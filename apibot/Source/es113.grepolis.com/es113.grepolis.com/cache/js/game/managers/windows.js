/*global jQuery, Backbone, us, CM, GPWindowMgr, MM, GameData, CloseWindowManager, FocusWindowManager, Game */

(function($, Backbone, us, window, views, collections, models) {
    'use strict';

    window.WindowsManager = function() {
        //Maximal number of windows which can be opened in the game
        var max_windows_opened = 5,

            //Collection which contains all windows
            open_windows = new collections.WindowsCollection(),

            //Holds Backbone data used for the layout => stuff loaded from the gameloader
            layoutData = {
                models: [],
                collections: []
            },
            PrivateModule,
            Module,
            windows_view;

        var close_window_manager = new CloseWindowManager(open_windows, GPWindowMgr);
        var focus_window_manager = new FocusWindowManager(open_windows, GPWindowMgr);

        /**
         * Gives focus to the window
         *
         * @param {WindowManagerModels.WindowModel} window_model
         */
        function focusWindow(window_model) {
            focus_window_manager.focus(window_model);
        }

        //Bring window to the front when gets focus
        open_windows.onFocusChange(function(window_model, state) {
            if (state === true) {
                focusWindow(window_model);
            }
        });

        /**
         * Check Settings
         */
        function checkSettings(settings) {
            if (!settings.window_type) {
                throw 'Please specify _window_type_ for this window.';
            }

            //'focused' property can not be preset, because WM tries to bring window to the front on initialization
            //when this property will be already set to 'true', then event won't be triggered
            if (settings.hasOwnProperty('focused')) {
                throw 'Do not set _focused_ property.';
            }
        }

        /**
         * Returns array of opened windows depends of the specified Type
         *
         * @param {String} type   window type (check model.window_type in the top of this file)
         */
        function getOpenedWindowsByType(type) {
            var open_windows_of_type = open_windows.filter(function(model) {
                return model.get('window_type') === type;
            });

            return open_windows_of_type;
        }

        /**
         * Returns number of opened windows (all types) but not old windows
         */
        function getNumberOfOpenWindows() {
            return open_windows.models.length;
        }

        /**
         * props = {
         *     dont_remove : Boolean,
         *     _manual_close : Boolean
         * }
         */
        function closeWindow(window_model, props) {
            props = props || {};

            if (!window_model) {
                return false;
            }

            if (typeof window_model.onBeforeClose === 'function') {
                //If onBeforeClose returns 'false', stop closing window
                if (window_model.onBeforeClose() === false) {
                    return;
                }
            }

            window_model._onBeforeClose();

            if (props.manual_close) {
                if (typeof window_model.onManualClose === 'function') {
                    //If onManualClose returns 'false', stop closing window
                    if (window_model.onManualClose() === false) {
                        return;
                    }
                }

                window_model._onManualClose();
            }

            if (!props.dont_remove) {
                var ctx_main = window_model.cid;

                //Unregister all components
                CM.unregisterGroup(ctx_main);

                //Unsuscribe events
                $.Observer().unsubscribe('window_' + ctx_main);

                open_windows.remove(window_model);
            }

            if (typeof window_model.onAfterClose === 'function') {
                window_model.onAfterClose();
            }
            window_model._onAfterClose();
        }

        /**
         * this function checks if other open windows still need a model or collection (or template)
         * It does this by checking the data_frontend_bridge.json for every open_window
         *
         * @param {string} data_type 'models' or 'collection' or something
         * @param {string} data_id name of the model
         * @param {object} window_creation_arguments arguments can have dependencies as well
         * @returns Boolean
         */
        function otherOpenWindowNeedsData(data_type, data_id, window_creation_arguments) {
            if (layoutData[data_type].indexOf(data_id) === -1) {
                return open_windows.any(function(window_model) {
                    return us.any(GameData.frontendBridge[window_model.getType()], function(tab_spec) {
                        // precondition:
                        // if the data_frontend_bridge.json does not have a 'models', or 'collections' entry, bail
                        if (!tab_spec[data_type]) {
                            return false;
                        }

                        var data_spec = tab_spec[data_type][data_id.camelCase()],
                            required_arguments, checked_arguments = 0,
                            required_argument_idx, required_arguments_length, required_argument,
                            other_window_creation_arguments = window_model.getArguments();

                        if (data_spec && !us.isEmpty(data_spec)) {
                            required_arguments = us.keys(data_spec['arguments']);
                            required_arguments_length = required_arguments.length;

                            if (required_arguments.length === 0) {
                                // the data requires no arguments, to it is fine
                                return true;
                            }

                            for (required_argument_idx = 0; required_argument_idx < required_arguments_length; ++required_argument_idx) {
                                required_argument = required_arguments[required_argument_idx];

                                if (other_window_creation_arguments[required_argument] === window_creation_arguments[required_argument]) {
                                    ++checked_arguments;
                                }
                            }

                            return checked_arguments === required_arguments_length;
                        }
                    });
                });
            }

            return true;
        }

        function getAlreadyLoadedData(window_model) {
            return MM.getAlreadyLoadedData(GameData.frontendBridge[window_model.getType()], window_model.getArguments());
        }

        /**
         * ============================================================================
         * ========================== Package private methods =========================
         * ============================================================================
         */
        PrivateModule = {
            focusWindow: focusWindow,

            /**
             * Returns number of opened windows (all types)
             */
            getNumberOfOpenWindows: getNumberOfOpenWindows,

            getFocusedWindow: function() {
                return open_windows.find(function(model) {
                    return model.get('focused');
                });
            },

            /**
             * Returns array of opened windows depends of the specified Type
             *
             * @param {String} type   window type (check model.window_type in the top of this file)
             */
            getOpenWindowsByType: getOpenedWindowsByType,

            closeAllWindows: function() {
                var windows = open_windows.models,
                    l = windows.length,
                    wqm_exists = window.WQM && window.WQM.pause;

                // if we have a Window Queue Manager running, the closing event on windows
                // may cause the creation of new window. We pause the creation of new
                // windows, until closeAll is done
                if (wqm_exists) {
                    window.WQM.pause();
                }

                while (l--) {
                    if (windows[l].isClosable() && !windows[l].getIsImportant()) {
                        closeWindow(windows[l]);
                    }
                }
                /*
                 The reset function is not needed since the collection is already up to date
                 Calling the reset function on the collection without passing any models, will empty the entire collection.
                 We have windows that are not closable so there will be window models still in the collection,
                 the reset function would remove them from the collection and lead to bugs
                 */
                //open_windows.reset();

                // resume wqm execution
                if (wqm_exists) {
                    window.WQM.resume();
                }
            }
        };

        /**
         * ============================================================================
         * ========================== Public methods ==================================
         * ============================================================================
         */
        Module = {
            /**
             * Creates new window
             *
             * @param {Object} settings   object contains initial data which will be stored in model
             */
            openWindow: function(settings, args) {
                settings = us.clone(settings);

                checkSettings(settings);
                settings.args = args.args;

                var override_activepagenr = args.args && (args.args.activepagenr !== undefined);

                if (override_activepagenr) {
                    settings.activepagenr = args.args.activepagenr;
                }

                var i, window_type = settings.window_type,
                    requested_window = new models.WindowModel(settings),
                    open_windows_with_same_type = getOpenedWindowsByType(window_type),
                    open_windows_with_same_type_len = open_windows_with_same_type.length;

                requested_window.setPreloadedData(args);

                //Checks if limit of opened windows by type has been reached
                if (getNumberOfOpenWindows() < max_windows_opened && open_windows_with_same_type_len < requested_window.getMaxInstances()) {
                    if (args.models) {
                        requested_window.replaceModels(args.models);
                    }

                    if (args.collections) {
                        requested_window.replaceCollections(args.collections);
                    }

                    //Add model to collection
                    open_windows.add(requested_window);

                    return requested_window;
                }

                //Otherwise maximize all opened window of the same type
                for (i = 0; i < open_windows_with_same_type_len; i++) {
                    // first bring the window to front / maximize to allow the rendering to access
                    // correct DOM/jQuery dimensions (e.g. for scrollbars)
                    if (open_windows_with_same_type[i].isMinimized()) {
                        open_windows_with_same_type[i].maximize();
                    } else {
                        open_windows_with_same_type[i].bringToFront();
                    }

                    // this also re-renders the content
                    if (requested_window.getMaxInstances() === 1) {
                        open_windows_with_same_type[i].updateArgumentsAndActivePageNr(
                            args.args, override_activepagenr ? args.args.activepagenr : null
                        );
                    }
                }

                return null;
            },

            /**
             * Returns information whether the window is opened or not
             *
             * @param {String} window_type   for example windows.DAILY_LOGIN
             * @return {Boolean}
             */
            isOpened: function(window_type) {
                return getOpenedWindowsByType(window_type).length > 0;
            },

            /**
             * Returns window depends of the specified type
             *
             * @param {String} type   the unique identifier by developer
             *
             * @return array
             */
            getWindowByType: function(type) {
                return open_windows.where({
                    window_type: type
                });
            },

            /**
             * Closes all windows of specific type
             *
             * @param {String} type   window type for instance: 'barracks
             */
            closeWindowsByType: function(type) {
                var opened_windows = this.getWindowByType(type),
                    i, l = opened_windows.length;

                for (i = 0; i < l; i++) {
                    this.closeWindow(opened_windows[i]);
                }
            },

            /**
             * Close window
             *
             * @param {Backbone Model} window_model   model representation of the window
             * @param {Boolean} dont_remove
             */
            closeWindow: closeWindow,

            otherOpenWindowNeedsData: otherOpenWindowNeedsData,

            getAlreadyLoadedData: getAlreadyLoadedData,

            getNumberOfAllOpenWindows: function() {
                var old_windows = GPWindowMgr.getOpenedClosableWindows(),
                    result;

                result = old_windows.filter(function(window) {
                    return !window.isMinimized();
                }).length;

                return close_window_manager.getSortedOpenedWindows().length + result;
            },

            minimizeAllWindows: function(force_close) {
                //Handle new windows
                open_windows.each(function(model /*, index*/ ) {
                    if (model.isMinimizable()) {
                        if (!model.isMinimized()) {
                            model.minimize();
                        }
                    } else {
                        if (force_close && model.isClosable()) {
                            closeWindow(model);
                        }
                    }
                });
                //Handle old windows
                var open_legacy_windows = GPWindowMgr.getAllOpen(),
                    i, l = open_legacy_windows.length,
                    wnd;

                for (i = l; i > 0; i--) {
                    wnd = open_legacy_windows[i - 1];

                    if (wnd.isMinimizable()) {
                        if (!wnd.isMinimized()) {
                            wnd.minimize();
                        }
                    } else if (force_close && wnd.isClosable()) {
                        wnd.close();
                    }
                }
            },

            /**
             * models and collections marked with this method will not be purged, if a windows closes and purges all data it loaded
             *
             * @param {String} type either 'models' or 'collections'
             * @param {String} backbone model identifier (e.g. 'PlayerLedger')
             */
            markPersistentData: function(type, name) {
                layoutData[type].push(name.snakeCase());
            }
        };

        /**
         * ======================================
         * =========== Window Manager ===========
         * ======================================
         */
        windows_view = new views.WindowsView({
            collection: open_windows,
            extended_window_manager: $.extend(PrivateModule, Module)
        });

        /**
         * Windows Collection Events
         */

        return $.extend({
            closeFrontWindow: function() {
                close_window_manager.closeFrontWindow();
            },

            isMinimizedWindowsBoxVisible: function() {
                return windows_view.MinimizedWndManager.isMinimizedWindowsBoxVisible();
            },

            /**
             * Gives focus to the window
             *
             * @param {WindowManagerModels.WindowModel|WndHandlerDefault} wnd
             */
            giveFocus: function(wnd) {
                focus_window_manager.focus(wnd);
            },

            /* Methods which are used only as a bridge between old and new window manager */
            _addToMinimizedWindows: function(wnd) {
                windows_view.getMinimizedWindowsView()._addMinimizedWindowForOldWindows(wnd);
            },

            _removeFromMinimizedWindows: function(window_id) {
                windows_view.getMinimizedWindowsView()._removeMinimizedWindowForOldWindows(window_id);
            },

            _addFakedMinimizedWindowsForAutomationTests: function() {
                windows_view.MinimizedWndManager.collection.add([{
                        wnd_cid: 1000,
                        title: 'title 1',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1001,
                        title: 'title 2',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1002,
                        title: 'title 3',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1003,
                        title: 'title 4',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1004,
                        title: 'title 5',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1005,
                        title: 'title 6',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1006,
                        title: 'title 7',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1007,
                        title: 'title 8',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1008,
                        title: 'title 9',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1009,
                        title: 'title 10',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1010,
                        title: 'title 11',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1011,
                        title: 'title 12',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1012,
                        title: 'title 13',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1013,
                        title: 'title 14',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1014,
                        title: 'title 15',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1015,
                        title: 'title 16',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1016,
                        title: 'title 17',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1017,
                        title: 'title 18',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1018,
                        title: 'title 19',
                        type: 'old'
                    },
                    {
                        wnd_cid: 1019,
                        title: 'title 20',
                        type: 'old'
                    }
                ]);
            }
        }, Module);
    };
}(jQuery, Backbone, us, window, window.WindowManagerViews, window.WindowManagerCollections, window.WindowManagerModels));