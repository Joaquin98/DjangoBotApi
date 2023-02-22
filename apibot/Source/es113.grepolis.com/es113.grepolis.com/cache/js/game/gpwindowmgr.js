/* global HumanMessage, GPWindow, WM, GameEvents, GPWindowMgr, Game */
(function() {
    'use strict';

    window.GPWindowMgr = function() {
        var wthat = this;

        var maxConcurrentOpen = 0; // = options['wndMaxConcurrent']; // Limit max concurrent open windows
        var TypeIDMAX = 0;
        var TypeInfo = [];

        function addWndType(name, taskbar_selector, wndhandler, _MaxConcurrentOpen, importantwindow) {
            if (!wndhandler) {
                return;
            }
            wthat['TYPE_' + name] = TypeIDMAX;

            _MaxConcurrentOpen = _MaxConcurrentOpen || 0; // INFINITE

            importantwindow = importantwindow || false;

            TypeInfo[TypeIDMAX] = {
                handler: wndhandler,
                refs: [],
                tselector: (_MaxConcurrentOpen === 1 ? '#' : '.') + taskbar_selector,
                maxconcurrent: _MaxConcurrentOpen,
                isImportant: importantwindow,
                name: name.toLowerCase()
            };

            TypeIDMAX++;
        }

        this.getInstance = function() {
            return wthat;
        };

        this.getTypeInfo = function(type) {
            return TypeInfo[type];
        };

        this.addWndType = function(name, taskbar_selector, wndhandler, _MaxConcurrentOpen, importantwindow) {
            return addWndType(name, taskbar_selector, wndhandler, _MaxConcurrentOpen, importantwindow);
        };

        addWndType('CUSTOM', null, window.WndHandlerDefault);
        //Its created here only to unify all opened windows at the start of the game
        addWndType('BOT_CHECK', null, window.WndHandlerDefault, 1, true); //type: jQuery Blocker
        addWndType('RECAPTCHA', null, window.WndHandlerDefault, 1, true); //type: jQuery Captcha/Recaptcha
        //The rest of declarations are in the same file as handlers declarations

        var wndref = [],
            wndStack = [], //used for 'limit max open windows'
            window_rootid = 1000, // dont modify this var @ runtime
            window_nextid = window_rootid;

        this.setMaxConcurrent = function(limit) {
            maxConcurrentOpen = limit;
        };

        this.getMaxConcurrent = function() {
            return maxConcurrentOpen;
        };

        this.getNextWindowId = function() {
            return window_nextid++;
        };

        this.getWindowById = function(window_id) {
            return wndref[window_id - window_rootid];
        };

        /**
         * Check if type attack command window with the same command id is already opened, don't open it again.
         *
         * @return {boolean}
         * */
        this.checkIfTypeAttackCommandWindowIsAlreadyOpened = function(wthat, type, command_id) {
            var open_windows = wthat.getOpen(type);

            if (!Array.isArray(open_windows)) {
                return false;
            }

            for (var i = 0; i < open_windows.length; i++) {
                if (open_windows[i].getWindowVeryMainNode().find('#arrival_' + command_id).length > 0) {
                    return true;
                }
            }

            return false;
        };

        this.Create = function(type, title, UIopts) { // Variadic Args..
            var handler,
                i;

            /**
             * Check if type attack command window with the same command id is already opened, don't open it again.
             */
            if (
                type === GPWindowMgr.TYPE_ATK_COMMAND &&
                this.checkIfTypeAttackCommandWindowIsAlreadyOpened(wthat, type, arguments[3])
            ) {
                return null;
            }

            // Check MaxConcurrentOpen over all windows by using wndStack
            // but only kill other windows when the 'to open' window isn't important
            if (maxConcurrentOpen !== 0 && !TypeInfo[type].isImportant && wndStack.length >= maxConcurrentOpen) {
                i = wndStack.length;
                while (i--) {
                    if (!TypeInfo[wndStack[i].type].isImportant) {
                        wndStack[i].close();
                    }
                }
            }

            // Check max opened per Type
            if ((TypeInfo[type].maxconcurrent > 0) && (TypeInfo[type].refs.length >= TypeInfo[type].maxconcurrent)) {
                i = TypeInfo[type].refs.length;
                while (i--) {
                    TypeInfo[type].refs[i].toTop();
                }

                if (UIopts && typeof UIopts.onAfterWindowLoad === 'function') {
                    UIopts.onAfterWindowLoad();
                }

                return null;
            }

            var wnd = new GPWindow(window_nextid++, wthat, this._models, this._collections);

            wnd.setIsImportant(TypeInfo[type].isImportant);
            handler = new TypeInfo[type].handler(wnd);

            // Set window handler and  Create the window itself://
            wnd.setHandler(handler);
            var args = [];
            for (i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }

            if (!wnd.createWindow.apply(wnd, args)) {
                wnd = null;
                handler = null;
                return null;
            }
            //delete args;

            wndref[wnd.getID() - window_rootid] = wnd;

            TypeInfo[type].refs.push(wnd);

            wnd.typeinforefid = TypeInfo[type].refs.length - 1;
            wnd.type = type;

            wndStack.push(wnd);

            $.Observer(GameEvents.window.open).publish({
                context: TypeInfo[type].name,
                wnd: wnd
            });

            GPWindowMgr.focusWindow(handler);

            return wnd;
        };

        this.Unregister = function(wnd) {
            TypeInfo[wnd.type].refs.remove(wnd.typeinforefid);
            wndref[wnd.getID() - window_rootid] = undefined; //

            // remove from wndStack
            var i = wndStack.length;
            while (i--) {
                if (wndStack[i] === wnd) {
                    wndStack.remove(i);
                    break;
                }
            }
        };

        this.onClose = function(wnd) {
            $.Observer(GameEvents.window.close).publish({
                window_obj: wnd,
                type: wnd.wnd.type,
                id: wnd.wnd.getIdentifier()
            });

            //Use new minimized windows manager
            if (typeof WM === 'object') {
                WM._removeFromMinimizedWindows(wnd.wnd.getID());
            }
        };

        this.getTypeInfo = function(id) {
            return TypeInfo[id];
        };

        this.numOpen = function() {
            return wndStack.length;
        };

        this.closeAll = function() {
            var wndstack = [],
                t = TypeInfo.length,
                w, i;

            while (t--) {
                w = TypeInfo[t].refs.length;
                while (w--) {
                    wndstack.push(TypeInfo[t].refs[w]);
                }
            }
            i = wndstack.length;
            while (i--) {
                if (wndstack[i].isClosable() && !wndstack[i].getIsImportant()) {
                    wndstack[i].close();
                    wndstack[i] = undefined; //unref
                }
            }
        };

        this.GetByID = function(id) {
            var ref = wndref[id - window_rootid];
            if (!ref) {
                return null;
            }

            return ref;
        };

        /**
         * Returns the number of opened windows by type
         * @deprecated
         */
        this.is_open = function(type) {
            return this.getOpen(type).length;
        };

        /**
         * Gives focus to the window
         *
         * @param {WndHandlerDefault} wnd_handler
         */
        this.focusWindow = function(wnd_handler) {
            if (typeof WM === 'object') {
                WM.giveFocus(wnd_handler);
            }
        };

        /**
         * @deprecated
         */
        this.getAllOpen = function() {
            return this.getOpenedWindows();
        };

        this.getOpenedWindows = function() {
            return wndStack;
        };

        this.getOpenedClosableWindows = function() {
            var window, windows = wndStack,
                i, l = windows.length,
                closable = [];

            for (i = 0; i < l; i++) {
                window = windows[i];

                if (window.isClosable() && !window.getIsImportant()) {
                    closable.push(window);
                }
            }

            return closable;
        };

        this.getByType = function(type) {
            var result = [];

            for (var i = 0, l = wndStack.length; i < l; i++) {
                var wnd = wndStack[i];

                if (wnd.getType() === type) {
                    result.push(wnd);
                }
            }

            return result;
        };

        this.getFocusedWindow = function() {
            var window, windows = wndStack,
                i, l = windows.length;

            for (i = 0; i < l; i++) {
                window = windows[i];

                if (window.isFocused()) {
                    return window;
                }
            }

            return null;
        };

        /**
         * Returns an array of the opened windows by type
         * @param type Number
         */
        this.getOpen = function(type) {
            return TypeInfo[type].refs;
        };

        /**
         * Returns the first open wnd handle.
         * @param type Number
         */
        this.getOpenFirst = function(type) {
            if (TypeInfo[type].refs.length > 0) {
                return TypeInfo[type].refs[0];
            }

            return null;
        };

        this._models = null;
        this._collections = null;
        this.setModelsAndCollections = function(models, collections) {
            this._models = models;
            this._collections = collections;
        };

        return this;
    }.call({});

    GPWindowMgr.extendLayoutWithShortLinks = function(context) {
        function GenericWindowThing(type) {
            this.open = function() {
                var w = GPWindowMgr.getOpenFirst(type),
                    args = Array.prototype.slice.call(arguments);
                if (!w) {
                    args.unshift(type, '', {}); // type, title, UIopts
                    GPWindowMgr.Create.apply(GPWindowMgr, args);
                } else {
                    w.maximizeWindow();
                    w.sendMessage('openIndex', Game.townId);
                    w.toTop();
                }
            };

            this.close = function(invokedbywindow) {
                var w = GPWindowMgr.getOpenFirst(type);

                if (!w) {
                    return;
                }

                if (!invokedbywindow) {
                    w.close();
                }
            };

            this.getWnd = function() {
                return GPWindowMgr.getOpenFirst(type);
            };
        }

        context.conquestWindow = function() {};
        context.conquestWindow.prototype = new GenericWindowThing(GPWindowMgr.TYPE_CONQUEST);
        context.conquestWindow.prototype.constructor = GenericWindowThing;
        context.conquestWindow = new context.conquestWindow();

        context.conquerorWindow = function() {
            this.open = function(command_id, other_town_id) {
                var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_CONQUEROR);

                if (!w) {
                    GPWindowMgr.Create(GPWindowMgr.TYPE_CONQUEROR, _('Conquest information'), {}, command_id, other_town_id);
                } else {
                    w.toTop();
                    w.sendMessage('refresh', command_id, other_town_id);
                }

                return w;
            };
        };
        context.conquerorWindow.prototype = new GenericWindowThing(GPWindowMgr.TYPE_CONQUEROR);
        context.conquerorWindow.prototype.constructor = GenericWindowThing;
        context.conquerorWindow = new context.conquerorWindow();

        context.allianceForum = function() {};
        context.allianceForum.prototype = new GenericWindowThing(GPWindowMgr.TYPE_ALLIANCE_FORUM);
        context.allianceForum.prototype.constructor = GenericWindowThing;
        context.allianceForum = new context.allianceForum();

        context.newMessage = function() {
            this.open = function(data) {
                var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_MESSAGE);
                if (!data.recipients) {
                    HumanMessage.error(_('The recipient list is empty.'));

                    return;
                }
                if (!w) {
                    GPWindowMgr.Create(GPWindowMgr.TYPE_MESSAGE, _('Messages'), {}, 'new', data);
                } else {
                    w.toTop();
                    w.sendMessage('messageNew', data);
                }
            };
        };
        context.newMessage.prototype = new GenericWindowThing(GPWindowMgr.TYPE_MESSAGE);
        context.newMessage.prototype.constructor = GenericWindowThing;
        context.newMessage = new context.newMessage();

        context.allianceProfile = function() {
            this.open = function(alliance_name, alliance_id) {
                var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_ALLIANCE_PROFILE);

                if (!w) {
                    context.wnd.Create(context.wnd.TYPE_ALLIANCE_PROFILE, alliance_name, {
                        alliance_id: alliance_id
                    });
                } else {
                    w.toTop();
                    w.requestContentGet('alliance', 'profile', {
                        alliance_id: alliance_id
                    });
                    w.setTitle(alliance_name);
                }
            };
        };
        context.allianceProfile.prototype = new GenericWindowThing(GPWindowMgr.TYPE_ALLIANCE_PROFILE);
        context.allianceProfile.prototype.constructor = GenericWindowThing;
        context.allianceProfile = new context.allianceProfile();

        context.playerProfile = function() {
            this.open = function(player_name, player_id) {
                var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_PLAYER_PROFILE),
                    title = _('User profile') + ' - ' + player_name;

                if (!w) {
                    context.wnd.Create(context.wnd.TYPE_PLAYER_PROFILE, title, {
                        player_id: player_id
                    });
                } else {
                    w.toTop();
                    w.requestContentGet('player', 'get_profile_html', {
                        player_id: player_id
                    });
                    w.setTitle(title);
                }
            };
        };
        context.playerProfile.prototype = new GenericWindowThing(GPWindowMgr.TYPE_PLAYER_PROFILE);
        context.playerProfile.prototype.constructor = GenericWindowThing;
        context.playerProfile = new context.playerProfile();

        context.phoenicianSalesman = function() {};
        context.phoenicianSalesman.prototype = new GenericWindowThing(GPWindowMgr.TYPE_PHOENICIANSALESMAN);
        context.phoenicianSalesman.prototype.constructor = GenericWindowThing;
        context.phoenicianSalesman = new context.phoenicianSalesman();

        context.dialogWindow = {
            open: function(content, title, width, height, onClose, minimizable, UIopts) {
                var opts = {
                        onClose: onClose,
                        minimizable: minimizable
                    },
                    windowOpts = (typeof UIopts !== 'undefined') ? $.extend(UIopts, opts) : opts,
                    w = GPWindowMgr.Create(GPWindowMgr.TYPE_DIALOG, _('Information'), windowOpts);

                w.setTitle(title);

                width = width || 400;
                height = height || 250;

                w.setContent(content);
                if (height === 'auto') {
                    w.setWidth(width);
                    w.autoResize(content);
                } else {
                    w.setSize(width, height);
                }
                // return wnd_handler
                return w;
            },

            close: function(wnd_id) {
                var w = GPWindowMgr.GetByID(wnd_id);
                if (!w) {
                    return;
                }

                if (w.type === GPWindowMgr.TYPE_DIALOG) {
                    w.close();
                }
            }
        };

        context.publishReportWindow = {
            open: function(content, report_id) {
                var w = GPWindowMgr.Create(GPWindowMgr.TYPE_PUBLISH_REPORT, _('Publish report'), {});
                w.setSize(500, 350);
                w.setContent(content);
            },

            close: function(wnd_id) {
                var w = GPWindowMgr.GetByID(wnd_id);
                if (!w) {
                    return;
                }

                if (w.type === GPWindowMgr.TYPE_PUBLISH_REPORT) {
                    w.close();
                }
            }
        };

        context.createApplication = function() {
            this.open = function(alliance_id) {
                var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_ALLIANCE);
                if (!w) {
                    GPWindowMgr.Create(GPWindowMgr.TYPE_ALLIANCE, _('New Application'), {}, null, 'create_application', alliance_id);
                } else {
                    w.toTop();
                    w.requestContentGet('alliance', 'create_application', {
                        alliance_id: alliance_id
                    });
                }
            };
        };
        context.createApplication.prototype = new GenericWindowThing(GPWindowMgr.TYPE_ALLIANCE);
        context.createApplication.prototype.constructor = GenericWindowThing;
        context.createApplication = new context.createApplication();
    };
}());