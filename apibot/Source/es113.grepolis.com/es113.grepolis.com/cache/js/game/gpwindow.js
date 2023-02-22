/* global GameControllers, GPAjax, CM, WM, Game, Layout, GPWindowMgr, GameEvents, JSON */
(function() {
    'use strict';

    function GPWindow(id, wndmgr, _models, _collections) {
        var wndid = id,
            wndname = 'gpwnd_' + id,
            rootnode,
            ajaxloader,
            loader,
            jqrootnode,
            jqcontent,
            wndhandler = null,
            that = this,
            frame,
            options,
            minElm = {},
            menuScroll = false,
            clear_menu_flag = false,
            minimized = false,
            cachedArguments,
            menuData,
            focused,
            minimizable = false,
            is_important = false,
            curr_controller = null,
            curr_action = null,
            first_call = false,

            // fakeWindow = true means we use this window as a tab inside of a new window
            // this blocks all operations on $.dialog but allows to run old WndHandlers and building code
            fakeWindow = false;

        this.models = _models;
        this.collections = _collections;

        //Used for registering components
        var cm_context = {
            main: null,
            sub: null
        };

        var _self = this;

        var header;

        this.setIsImportant = function(boolval) {
            is_important = boolval;
        };

        this.getModel = function() {
            return GameControllers.BaseController.prototype.getModel.apply(this, arguments);
        };

        this.getCollection = function(name) {
            return GameControllers.BaseController.prototype.getCollection.apply(this, arguments);
        };

        this.getModels = function() {
            return GameControllers.BaseController.prototype.getModels.apply(this, arguments);
        };

        /**
         * call to set this module in a mode to allow to run inside a non-$.dialog window
         */
        this.runInNewStyleWindowSystem = function() {
            fakeWindow = true;
        };

        this.getCollections = function() {
            return GameControllers.BaseController.prototype.getCollections.apply(this, arguments);
        };

        this.getIsImportant = function() {
            return is_important;
        };

        /*
         * Sets the window handler class
         */
        this.setHandler = function(Handler) {
            wndhandler = Handler;
        };

        this.getHandler = function() {
            return wndhandler;
        };

        this.getContext = function() {
            return cm_context;
        };

        this.setContext = function(context) {
            cm_context = context;
        };

        this.getOptions = function() {
            return options;
        };

        this.isClosable = function() {
            return options.closable !== false;
        };

        this.isMinimizable = function() {
            return options.minimizable === true;
        };

        this.isModal = function() {
            return false;
        };

        /*
         * Used internally; to create the window from the windowfactory.
         */
        this.createWindow = function(title, UIopts, additional_data) {
            options = UIopts || (UIopts = {});

            rootnode = document.createElement('div');
            rootnode.id = wndname;
            rootnode.className = 'gpwindow_content';

            frame = document.createElement('div');

            frame.className = 'gpwindow_frame' + (options.css_class ? ' ' + options.css_class : '');

            var left = document.createElement('div'),
                right = document.createElement('div'),
                bottomCenter = document.createElement('div'),
                bottomLeft = document.createElement('div'),
                bottomRight = document.createElement('div'),
                topCenter = document.createElement('div'),
                topLeft = document.createElement('div'),
                topRight = document.createElement('div'),
                minimizeElem,
                help,
                ipad_drag_element;

            left.className = 'gpwindow_left';
            right.className = 'gpwindow_right';

            bottomLeft.className = 'gpwindow_left corner';
            bottomRight.className = 'gpwindow_right corner';
            bottomCenter.className = 'gpwindow_bottom';

            topLeft.className = 'gpwindow_left corner';
            topRight.className = 'gpwindow_right corner';
            topCenter.className = 'gpwindow_top';

            bottomCenter.appendChild(bottomLeft);
            bottomCenter.appendChild(bottomRight);

            topCenter.appendChild(topLeft);
            topCenter.appendChild(topRight);

            frame.appendChild(left);
            frame.appendChild(right);
            frame.appendChild(bottomCenter);
            frame.appendChild(topCenter);
            frame.appendChild(rootnode);

            ajaxloader = document.createElement('div');
            ajaxloader.id = 'window_ajax_loader';
            ajaxloader.style.visibility = 'hidden';
            rootnode.appendChild(ajaxloader);

            jqrootnode = $(frame);

            jqcontent = $(rootnode);

            jqcontent.wnd = this;

            loader = new GPAjax(Layout || null, false);

            if (wndhandler) {
                if (!wndhandler.onInit.apply(wndhandler, arguments)) {
                    loader = null;
                    return false;
                }

                var defaults = wndhandler.getDefaultWindowOptions(UIopts);
                var factor = 1;
                if (typeof Game.ui_scale !== "undefined") {
                    factor = Game.ui_scale.normalize.factor;
                }

                $.extend(defaults, UIopts, {
                    position: {
                        scaling: factor
                    }
                });
                UIopts = options = defaults;

                if (options.minimizable) {
                    minimizable = true;
                }

                //due to the window the top menu must be substracted too
                ajaxloader.style.top = ((defaults.height / 2) - 58) + 'px'; //center
                ajaxloader.style.left = ((defaults.width / 2) - 29) + 'px';
                ajaxloader.style.position = 'relative';
            }

            if (title && title.length > 0) {
                UIopts.title = title;
            }

            // no border if window should contain townindex
            if (UIopts.fullwindow) {
                rootnode.className += ' fullwindow';
            }

            if (UIopts.menuScroll) {
                menuScroll = UIopts.menuScroll;
            }

            /**
             * closing old windows is handled in windows.view.js
             */
            UIopts.closeOnEscape = false;

            jqrootnode.dialog(UIopts);

            this.getWindowVeryMainNode().addClass('js-window-main-container');

            var is_not_closable = typeof UIopts.closable === 'boolean' && !UIopts.closable;

            //add minimize-button
            if (UIopts.minimizable && !is_not_closable) {
                minimizeElem = $('<a>').attr({
                    'href': '#',
                    'class': 'ui-dialog-titlebar-minimize ui-corner-all'
                }).on("click", function() {
                    that.minimize.apply(that, arguments);
                });
                jqrootnode.prev().append(minimizeElem);
            }

            if (is_not_closable) {
                jqrootnode.prev().find('.ui-dialog-titlebar-close').remove();
            }

            if (UIopts.help) {
                help = $('<a>').attr({
                    'href': '#',
                    'class': 'ui-dialog-titlebar-help ui-corner-all'
                }).on("click", this.showHelp);
                jqrootnode.prev().append(help);
            }

            if (window.isiOs()) {
                //Quick fix for drag and drop for old windows (there is no sense to investigage it further...)
                ipad_drag_element = $('<div class="ipad_drag_element">');
                jqrootnode.prev().append(ipad_drag_element);
            }

            if (UIopts.yOverflowHidden) {
                jqcontent.css({
                    'overflow-y': 'hidden'
                });
            }

            jqrootnode.on('dialogbeforeclose', function() {
                var ctx_main = wndhandler.wnd.getID(),
                    on_close_success = wndhandler.onClose();

                if (on_close_success) {
                    //Automaticaly unregister all components for this window
                    CM.unregisterGroup(ctx_main);

                    //Unsuscribe events
                    $.Observer().unsubscribe('window_' + ctx_main);
                }

                return on_close_success;
            });

            jqrootnode.on('dialogclose', function(event, ui) {
                // Remove from window factory
                wndmgr.Unregister(jqcontent.wnd);

                // cleanup..
                jqrootnode.dialog('destroy');
                //remove all event handlers
                if (header) {
                    header.find('div.menu_wrapper').find('a').off();
                }
                // remove from dom:
                if (jqrootnode.parent()) {
                    jqrootnode.remove();
                }

                loader = null;
                wndmgr.onClose(wndhandler);
                wndhandler = null;
            });

            jqrootnode.on('dialogfocus', function(event, ui) {
                GPWindowMgr.focusWindow(wndhandler);

                //wndhandler.onFocus();
            });

            if (window.isiOs() || window.isSmallScreen()) {
                if (UIopts.autoresize) {
                    first_call = true;
                }
                this.centerWindowVerticaly();
            }

            return true;
        };

        /*
         * Initialize the windows as sub-tab for new style windows
         */
        this.createContentInNewWindow = function(title, UIopts, building_id, $el, action) {
            options = UIopts || (UIopts = {});

            jqrootnode = $el;

            jqcontent = $el;

            jqcontent.wnd = this;

            loader = new GPAjax(Layout || null, false);

            if (wndhandler) {
                if (!wndhandler.onInit.apply(wndhandler, [title, UIopts, building_id, action, {}])) {
                    loader = null;
                    return false;
                }

                var defaults = wndhandler.getDefaultWindowOptions(UIopts);

                $.extend(defaults, UIopts);
                UIopts = options = defaults;

                if (options.minimizable) {
                    minimizable = true;
                }
            }

            if (title && title.length > 0) {
                UIopts.title = title;
            }

            UIopts.closeOnEscape = false;

            return true;
        };

        /**
         * get access to main node of the window
         */
        this.getWindowVeryMainNode = function() {
            return jqrootnode.parent();
        };

        /**
         * windowhandler must contain a function showHelp() when option.help is true
         */
        this.showHelp = function() {
            return wndhandler.showHelp.apply(wndhandler, arguments);
        };

        /*
         * Forces the close of an window. note the close event on windowhandler wouldn't get triggered.
         */
        this.destroy = function() {
            jqrootnode.dialog('destroy');
        };

        /*
         * Sets the position; see query UI for argument explanation...
         */
        this.setPosition = function(pos) {
            jqrootnode.dialog('option', 'position', pos);
        };

        /*
         * Sets/Gets the Size
         */
        this.setSize = function(width, height) {
            jqrootnode.dialog('option', 'width', width);
            jqrootnode.dialog('option', 'height', height);
        };

        /**
         * autoresize for windows. height is adjusted, width stays the same/default.
         *
         * @param data String
         * @return the very same String
         */
        this.autoResize = function(data) {
            var tmp, elem, arr = [],
                newheight;
            // remove scripts
            tmp = data.split(/<script.*?>[\s\S]*?<\/.*?script>/gi).join('');

            // clone element, insert content and apply styles
            elem = jqcontent.parent().parent().clone().appendTo('body').css({
                'width': jqcontent.width(),
                'zIndex': 0,
                'left': -5000,
                'position': 'absolute'
            });

            var content = elem.find('.gpwindow_content');

            //get offset and height for each elem
            content.html(tmp).children().each(function() {
                var child = $(this);

                arr.push(child.position().top + child.outerHeight(true));
            });

            // get needed height of content and add gpwindow-borders
            newheight = Math.max(arr.max(arr), content.height()) + parseInt(content.css('top'), 10) + parseInt(content.css('bottom') || 0, 10);

            this.setHeight(Math.max(newheight, options.minHeight || 0));

            elem.remove();
            elem = undefined;

            if (first_call) {
                this.centerWindowVerticaly();
                first_call = false;
            }

            return data;
        };

        /**
         * rules for windows placement from GP-9858
         * (The only rule is that the window can not be over the 'town name area' - excluding casted powers)
         */
        this.centerWindowVerticaly = function() {
            var jqrootnode_parent = jqrootnode.parent(),
                viewport_height = $(window).innerHeight(),
                window_height = jqrootnode_parent.outerHeight(true),
                town_name_area_height = $('.btn_toggle_town_groups_menu').outerHeight();

            var min_top = town_name_area_height + Math.max(((viewport_height - town_name_area_height) - window_height) / 2, 0);

            jqrootnode_parent.css('top', min_top + 'px');
        };

        this.setHeight = function(height) {
            jqrootnode.dialog('option', 'height', height);
        };

        this.setWidth = function(width) {
            jqrootnode.dialog('option', 'width', width);
        };

        this.getHeight = function() {
            return jqrootnode.dialog('option', 'height');
        };

        this.getWidth = function() {
            return jqrootnode.dialog('option', 'width');
        };

        /*
         * Sets/Gets the mininum Size
         */
        this.setMinSize = function(minWidth, minHeight) {
            jqrootnode.dialog('option', 'minWidth', minWidth);
            jqrootnode.dialog('option', 'minHeight', minHeight);
        };

        this.setMinHeight = function(minHeight) {
            jqrootnode.dialog('option', 'minHeight', minHeight);
        };

        this.setMinWidth = function(minWidth) {
            jqrootnode.dialog('option', 'minWidth', minWidth);
        };

        this.getMinHeight = function() {
            return jqrootnode.dialog('option', 'minHeight');
        };

        this.getMinWidth = function() {
            return jqrootnode.dialog('option', 'minWidth');
        };

        /*
         * Sets/Gets the maximum Size
         */
        this.setMaxSize = function(maxWidth, maxHeight) {
            jqrootnode.dialog('option', 'maxWidth', maxWidth);
            jqrootnode.dialog('option', 'maxHeight', maxHeight);
        };

        this.setMaxHeight = function(maxHeight) {
            jqrootnode.dialog('option', 'maxHeight', maxHeight);
        };

        this.setMaxWidth = function(maxWidth) {
            jqrootnode.dialog('option', 'maxWidth', maxWidth);
        };

        this.getMaxHeight = function() {
            return jqrootnode.dialog('option', 'maxHeight');
        };

        this.getMaxWidth = function() {
            return jqrootnode.dialog('option', 'maxWidth');
        };

        this.allowResize = function(allowed) {
            jqrootnode.dialog('option', 'resizable', allowed);
        };

        /*
         * Sets/Gets the zIndex
         */
        this.getZIndex = function() {
            return parseInt(jqrootnode.parent().css('zIndex'), 10);
            //return jqrootnode.dialog('option', 'zIndex');
        };

        this.setZIndex = function(value) {
            jqrootnode.parent().css('zIndex', value);
        };

        this.toTop = function() {
            //pass any arguments to maximize(), e.g. Event ...
            that.maximize.apply(that, arguments);
            jqrootnode.dialog('moveToTop');
        };

        /*
         * Gets the current window Position and size
         * for position elem see jqui doc @@ dialog position
         */
        this.getPosition = function() {
            var rect = {
                position: jqrootnode.dialog('option', 'position'),
                width: jqrootnode.dialog('option', 'width'),
                height: jqrootnode.dialog('option', 'height')
            };

            return rect;
        };

        /*
         * Sets the Window Theme
         */
        this.setDialogClass = function(dialogClass) {
            if (fakeWindow) {
                return;
            }
            jqrootnode.dialog('option', 'dialogClass', dialogClass);
        };

        /*
         * Sets the Title
         */
        this.setTitle = function(title) {
            if (fakeWindow) {
                return;
            }
            options.title = title;
            jqrootnode.dialog('option', 'title', title);
        };

        /*
         * Sets the content
         */
        this.setContent = function(data) {
            // removal of iframe from replacing content as autoResize method as it could cause
            // extra callbacks calling
            // @TODO: maybe temporary remove onload in autoResize function as well
            jqcontent.find('iframe').removeAttr('onload').remove();

            if (wndhandler) {
                if (options.autoresize) {
                    data = this.autoResize(wndhandler.onSetContent(data));
                } else {
                    data = wndhandler.onSetContent(data);
                }
            }

            // we have to use .html() here, otherwise script-tags wouldn't work.
            jqcontent.html(data);

            $.Observer(GameEvents.window.reload).publish();
        };

        /*
         * Sets the content without calling the wndhandler onSetContent function (this is faster)
         * no autoresize!
         */
        this.setContent2 = function(data) {
            // we have to use .html() here, otherwise script-tags wouldn't work.'
            jqcontent.html(data);
            $.Observer(GameEvents.window.reload).publish();
        };

        /*
         * Sets the content without calling the wndhandler onSetContent function (this is faster)
         * no autoresize! Allows to determinate a node where the content will be appended
         */
        this.setContent3 = function(selector, data) {
            jqcontent.find(selector).html(data);
            $.Observer(GameEvents.window.reload).publish();
        };

        /**
         * Appends content  to the current window content
         */
        this.appendContent = function(data) {
            jqcontent.append(data);
        };

        /**
         * Initialzes the tab-menu in a GPWindow-titlebar.
         *
         * @param {Object} data
         * @param {String} controller
         * @param {String} action
         */
        this.initMenu = function(data, controller, action) {
            // new style windows do not need 'menu' from the backend
            if (fakeWindow) {
                return;
            }

            var args = arguments;
            menuData = data || menuData;
            // menu data as json
            var menu = JSON.parse(menuData);

            header = jqrootnode.dialog('widget').find('div.ui-widget-header');
            var title_width = header.find('span.ui-dialog-title').outerWidth(true),
                list = document.createElement('ul'),
                html = document.createElement('div'),
                link, li, wrapper,

                elements = [],
                naturalWidth = [],
                width_factor = 1.25;

            function arrangeScroll() {
                var button_sum = 0,
                    titlebar,
                    tab_width,
                    header_width;

                // Scrolling
                prev = $('<a href="#" class="prev"></a>');
                next = $('<a href="#" class="next"></a>');
                step = 100;
                lf = document.createElement('div');
                rf = document.createElement('div');

                lf.className = 'fade_left';
                rf.className = 'fade_right';
                // 2 more buttons:
                html.className = html.className += ' menu_wrapper_scroll';
                html.appendChild(lf);
                html.appendChild(rf);
                header.append(next).append(prev);
                header.append(html);

                [
                    ".ui-dialog-titlebar-minimize",
                    ".ui-dialog-titlebar-close",
                    ".next",
                    ".prev",
                    ".fade_left",
                    ".fade_right"
                ].forEach(function(element_identifier) {
                    if ($(header).find(element_identifier).length) {
                        button_sum += $(header).find(element_identifier).outerWidth(true);
                    }
                });

                if (title_width + button_sum > (header_width = header.width()) || !menu_width) {
                    titlebar = header.find('span.ui-dialog-title');
                    title_width = titlebar.outerWidth(true);
                    tab_width = total_width + button_sum;

                    if (title_width - tab_width < 0) {
                        titlebar.css('width', header_width / 2).attr('title', titlebar.text());
                    } else {
                        titlebar.css('width', Math.max(header_width - tab_width, header_width / 2)).attr('title', titlebar.text());
                    }
                    // call the whole thing again
                    return that.initMenu.apply(that, args);
                }

                // why does IE stupid things here?
                var magicnumber = 1;
                max_scroll = $(html).width() - total_width;
                list.style.width = total_width + magicnumber + 'px';
                list.style.right = max_scroll - step + 'px';

                prev.on("click", function() {
                    var right = parseInt(list.style.right, 10);

                    if (right >= max_scroll) {
                        list.style.right = right - step + 'px';
                    }

                    return false;
                });
                next.on("click", function() {
                    var right = parseInt(list.style.right, 10);

                    if (right <= step) {
                        list.style.right = right + step + 'px';
                    }

                    return false;
                });
            }

            function arrangeShort() {
                j = elements.length;

                while (j--) {
                    var k = naturalWidth.length;
                    // distribute pixels:
                    new_w = naturalWidth[j][1] ? Math.floor(max_width) : naturalWidth[j][0];
                    count = naturalWidth.length;

                    while (k--) {
                        if (naturalWidth[k][1] === false && k !== j) {
                            incr = ((max_width - foo[k]) / count);
                            foo[k] -= incr;
                            if (new_w + incr > naturalWidth[j][0]) {
                                count--;
                                naturalWidth[j][1] = false;
                            } else {
                                new_w += incr;
                            }
                        }
                    }

                    // TODO: this is horrible.
                    if (new_w < (naturalWidth[j][0])) { //approximate width of dots
                        var el_li = elements[j];
                        var el_a = el_li.childNodes[0];

                        // add …
                        dots = document.createElement('span');
                        dots.className = 'submenu_dots';
                        dots.innerHTML = '\u2026';

                        text = el_li.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
                        text.appendChild(dots);
                        text.style.width = new_w - 24 + 'px'; //2 * 7 (width of left + right tab borders) + 10
                        text.style.marginRight = '16px';

                        $(el_li).tooltip(el_a.getAttribute('data-menu_name'));
                    }
                }
                header.append(html);
            }

            //if menu exists and should be cleared
            wrapper = header.find('div.menu_wrapper');

            if (clear_menu_flag && wrapper.length) {
                clear_menu_flag = false;
                //remove it
                header.find('div.menu_wrapper, a.prev, a.next').remove();
                //clear wrapper variable
                wrapper = [];
            } else if (wrapper.length) {
                return false;
            }

            //Default window options are not applied from the default window class
            //and I can not fix everything, because I would never finish one task
            //so if options.closable !== false it means that window is closable
            var is_closable = options.closable !== false;

            html.className = 'menu_wrapper' + (is_closable && options.minimizable ? ' minimize' : '') + (is_closable ? ' closable' : '') + (options.help ? ' help' : '');
            list.className = 'menu_inner';

            var i, tmp,
                mapFunction = function(i) {
                    // remove and append element to work around a strange reflow-problem in FF.
                    tmp = i.firstChild;
                    i.removeChild(tmp);

                    tmp.className = tmp.className.replace(' active', '');

                    i.appendChild(tmp);
                },
                clickHandler = function fooooooo() {
                    var i = this.id,
                        that = this,
                        onclick = menu[i].onclick,
                        action, controller, obj,
                        switchTab;

                    // If the menu entry is disabled first
                    if (menu[i].disabled) {
                        return;
                    }

                    // if id is set, check for onclick:
                    if (menu[i].id) {
                        //if onclick is set, do magic:
                        if (onclick) {
                            // i'm lazy, so i don't want to rewrite every menulink with onclick:
                            onclick = typeof onclick === Object ? onclick : onclick.replace(/"/g, '').split(/,|\(|\)/g);

                            switchTab = function() {
                                wndhandler.wnd[onclick.shift()].apply(this, onclick); // duuuude ...
                                //set active tab
                                elements.map(mapFunction);
                                that.className += ' active';
                            };

                            if (wndhandler.onBeforeTabSwitch && !wndhandler.onBeforeTabSwitch(switchTab)) {
                                return;
                            }

                            switchTab();
                        } else {
                            elements.map(mapFunction);
                            this.className += ' active';
                        }
                    } else {
                        // .. otherwise there should be a 'normal' link:
                        action = menu[i].action;
                        controller = menu[i].controller;
                        obj = menu[i].type ? {
                            'type': menu[i].type
                        } : menu[i].obj;

                        switchTab = function() {
                            wndhandler.wnd.requestContentGet(controller, action, obj);
                            //set active tab
                            elements.map(mapFunction);
                            that.className += ' active';
                        };

                        if (wndhandler.onBeforeTabSwitch && !wndhandler.onBeforeTabSwitch(switchTab)) {
                            return;
                        }

                        switchTab();
                    }
                };

            for (i in menu) {
                if (menu.hasOwnProperty(i)) {
                    link = document.createElement('a');
                    link.setAttribute('data-menu_name', menu[i].name);
                    link.innerHTML = '<span class="left"><span class="right"><span class="middle">' + menu[i].name + '</span></span></span>';
                    link.className = 'submenu_link' + (menu[i].className ? ' ' + menu[i].className : '');
                    link.href = '#';
                    // set tooltip if no <img/>

                    // add prefix to avoid collisions
                    link.id = i;

                    if (menu[i].is_active || i === controller + '-' + action) {
                        link.className += ' active';
                    }

                    if (menu[i].disabled) {
                        link.className += ' disabled';
                    }

                    // bind click event
                    $(link).on("click", clickHandler);

                    li = document.createElement('li');
                    li.appendChild(link);
                    list.insertBefore(li, list.firstChild);
                    elements.push(li);
                }
            }

            html.appendChild(list);
            header.append(html);

            var menu_width = $(html).width(),
                // calculate average width:
                max_width = Math.ceil(menu_width / elements.length),
                // second pass: elements have no width before they are appended to DOM:
                total_width = 0,
                width,
                j = elements.length;

            while (j--) {
                width = $(elements[j]).outerWidth(true);
                total_width += (naturalWidth[j] = [$(elements[j]).outerWidth(true), width > max_width])[0];
            }

            //It needs more space because first tab is not displayed
            total_width += 2;

            // clone array
            var foo = naturalWidth.map(function(i) {
                    return i[0];
                }, this),
                new_w, count, dots, text, incr,
                next, prev, max_scroll, rf, lf, step;

            if (minimized || (menu_width && menu_width > total_width)) {
                $(html).css({
                    'width': total_width,
                    'float': 'right'
                });
                this.adjustTitleWidth(header);
                return;
            }

            // remove html for all following operations to reduce DOM access:
            header[0].removeChild(html);

            // check if we shorten the tabs or if we use scrolling
            if (menu_width * width_factor > total_width && !menuScroll) {
                arrangeShort();
            } else {
                arrangeScroll();
            }
        };

        /**
         * clear window tab menu
         */
        this.clearMenu = function() {
            clear_menu_flag = true;
        };

        /**
         * clear window tab menu instantly
         */
        this.clearMenuNow = function() {
            // new style window do not need this, so bail on fakeWindow = true
            if (jqrootnode && !fakeWindow && this.getHandler()) {

                var header = jqrootnode.dialog('widget').find('div.ui-widget-header');
                //if menu exists and should be cleared
                var wrapper = header.find('div.menu_wrapper');

                if (wrapper.length) {
                    //remove it
                    header.find('div.menu_wrapper, a.prev, a.next').remove();
                }
            }
        };

        /*
         * Sends a Message event to the bound windowhandler and returns the result.
         */
        this.sendMessage = function(data, callback) {
            return wndhandler.onMessage.apply(wndhandler, arguments, callback);
        };

        /*
         * Calls a function on the current Window Handler, returns the result
         */
        this.call = function() {
            var args = Array.prototype.slice.call(arguments);
            return wndhandler[args.shift()].apply(wndhandler, (args));
        };

        /*
         * Ajax Request; Callback Function Paramter: (_wnd, response_data, flags)
         */
        this.ajaxRequest = function(controller, action, params, callback, method) {
            var HumanMessage = require('misc/humanmessage');

            var obj;
            var callback_success = null;
            var callback_error = null;

            if (typeof callback === 'object') {
                callback_success = callback.success ? callback.success : null;
                callback_error = callback.error ? callback.error : null;
            } else {
                callback_success = callback;
            }

            if (!params) {
                params = {
                    town_id: Game.townId
                };
            } else if (!params.town_id) {
                params.town_id = Game.townId;
            }

            obj = {
                success: function(_context, _data, _flag, _t_token) {
                    if (callback_success && window.hasValidTownToken(_data, _t_token)) {
                        callback_success(that, _data, _flag);
                    }
                },
                error: function(_context, _data, _t_token) {
                    if (!window.hasValidTownToken(_data, _t_token)) {
                        return;
                    }

                    //If error callback was defined call this
                    if (callback_error) {
                        callback_error(that, _data);
                    }

                    if (_data.error && _data.error !== "backend_requested_verification") {
                        if (wndhandler && typeof wndhandler.onRcvDataError === 'function') {
                            wndhandler.onRcvDataError(_data.error);
                        } else {
                            HumanMessage.error(_data.error);
                        }
                    }
                    if (_data.gpWindowclose === true) {
                        that.close();
                    }
                }
            };

            if (method === 'get') {
                return loader.ajaxGet(controller, action, params, true, obj);
            } else if (method === 'post') {
                return loader.ajaxPost(controller, action, params, true, obj);
            }
        };

        this.ajaxRequestGet = function(controller, action, params, callback) {
            this.ajaxRequest(controller, action, params, callback, 'get');
        };

        this.ajaxRequestPost = function(controller, action, params, callback) {
            this.ajaxRequest(controller, action, params, callback, 'post');
        };

        this.showAjaxLoader = function() {
            ajaxloader.style.visibility = 'visible';
        };

        this.hideAjaxLoader = function() {
            ajaxloader.style.visibility = 'hidden';
        };

        /**
         *	Reloads content for active tab.
         *	All params, callbacks etc are also used.
         */
        this.reloadContent = function() {
            if (!wndhandler) {
                return false;
            }
            if (!cachedArguments) {
                throw 'No controller or action!';
            }

            //After switching towns, the old town id is kept which prevents loading data into the window
            if (cachedArguments[2]) {
                cachedArguments[2].town_id = Game.townId;
            }

            this.requestContent.apply(this, cachedArguments);
        };

        this.requestContent = function(controller, action, params, callback, external_reload, method) {
            var HumanMessage = require('misc/humanmessage');

            var _self = this,
                obj, http_status_code_options;
            cachedArguments = arguments;

            if (!wndhandler) {
                return;
            }

            if (typeof wndhandler.onBeforeReloadContent === 'function') {
                wndhandler.onBeforeReloadContent();
            }

            if (!params) {
                params = {
                    town_id: Game.townId
                };
            } else if (!params.town_id) {
                params.town_id = Game.townId;
            }

            if (!jqrootnode.find('div.grey_layer').length) {
                jqrootnode.append($('<div class="grey_layer"></div>'));
            }

            obj = {
                success: function(_context, _data, _flag, _t_token) {
                    jqrootnode.find('div.grey_layer').remove();

                    if (!window.hasValidTownToken(_data, _t_token)) {
                        if (wndhandler && typeof wndhandler.onReloadContentError === 'function') {
                            wndhandler.onReloadContentError();
                        }

                        return;
                    }

                    if (_data.menu || external_reload) {
                        // pass controller & action to determine active tab
                        if (!Game.dev) {
                            try {
                                that.clearMenuNow();
                                that.initMenu.apply(that, [_data.menu || menuData, controller, action]);
                            } catch (e) {
                                // just in case there's again a freaky json error ...
                                //debug(e)
                            }
                        } else {
                            that.clearMenuNow();
                            that.initMenu.apply(that, [_data.menu || menuData, controller, action]);
                        }
                    } else {
                        that.adjustTitleWidth(jqrootnode.dialog('widget').find('div.ui-widget-header'));
                    }

                    if (window.isiOs() && _data.html) {
                        _data.html = _data.html.replace(/href=(['"])#['"]/g, 'href=$1javascript:void$1');
                    }

                    var ctx_main = _self.getID();

                    //Unregister components before new data will be loaded
                    CM.unregisterGroup(ctx_main);

                    //Unsuscribe events
                    $.Observer().unsubscribe('window_' + ctx_main);

                    curr_controller = controller;
                    curr_action = action;

                    if (wndhandler) {
                        if (action === 'default') {
                            var menu_tabs = JSON.parse(_data.menu || menuData);

                            //Determinate which action is 'default one'
                            for (var tab_id in menu_tabs) {
                                if (menu_tabs.hasOwnProperty(tab_id) && menu_tabs[tab_id].is_active) {
                                    curr_action = menu_tabs[tab_id].action;
                                }
                            }
                        }

                        _self.setContext({
                            main: _self.getID(),
                            sub: curr_controller + '_' + curr_action
                        });

                        wndhandler.onRcvData(_data, curr_controller, curr_action, params);

                        if (params.onAfterWindowLoad && typeof params.onAfterWindowLoad === 'function') {
                            params.onAfterWindowLoad();
                        }

                        if (callback) {
                            if (typeof callback === 'object' && callback.success) {
                                callback.success(that, _data, _flag);
                            } else {
                                callback(that, _data, _flag);
                            }
                        }
                    } else {
                        if (typeof callback === 'object' && callback.error) {
                            callback.error(that, _data, _flag);
                        }
                    }
                },
                error: function(_context, _data, _t_token) {
                    jqrootnode.find('div.grey_layer').remove();

                    if (!window.hasValidTownToken(_data, _t_token)) {
                        if (_data && _data.gpWindowclose === true) {
                            that.close();
                        } else {
                            if (wndhandler && typeof wndhandler.onReloadContentError === 'function') {
                                wndhandler.onReloadContentError();
                            }
                        }
                        return;
                    }

                    if (_data.error) {
                        if (wndhandler && typeof wndhandler.onRcvDataError === 'function') {
                            wndhandler.onRcvDataError(_data.error);
                        } else {
                            HumanMessage.error(_data.error);
                        }
                    }
                    if (_data && _data.gpWindowclose === true) {
                        that.close();
                    }
                }
            };

            if (wndhandler.last_ajax_req &&
                wndhandler.last_ajax_req.readyState !== 4 &&
                typeof wndhandler.last_ajax_req.abort === 'function') {
                wndhandler.last_ajax_req.abort();
            }

            if (method === 'get') {
                http_status_code_options = {
                    close_wnd: true,
                    wnd: this
                };

                wndhandler.last_ajax_req = loader.ajaxGet(controller, action, params, true, obj, http_status_code_options);
            } else if (method === 'post') {
                wndhandler.last_ajax_req = loader.ajaxPost(controller, action, params, true, obj);
            } else {
                if (method !== undefined) {
                    window.debug('check & remove old 6th param (used for ajax-call-locking) of ajax call!!!');
                }
                wndhandler.last_ajax_req = loader.ajaxPost(controller, action, params, true, obj);
            }
        };

        this.requestContentPost = function(controller, action, params, callback_success, external_reload) {
            return this.requestContent(controller, action, params, callback_success, external_reload, 'post');
        };

        this.requestContentGet = function(controller, action, params, callback_success, external_reload) {
            return this.requestContent(controller, action, params, callback_success, external_reload, 'get');
        };

        /**
         * @deprecated
         */
        this.getID = function() {
            return this.getIdentifier();
        };

        /**
         * Returns unique identifier for the window
         *
         * @return {Number}
         */
        this.getIdentifier = function() {
            return wndid;
        };

        this.setFocus = function(value) {
            var will_be_focused = value,
                is_currently_focused = focused;

            var handler = this.getHandler();

            focused = value;

            if (is_currently_focused && !will_be_focused && typeof handler.onBlur === 'function') {
                handler.onBlur();
            }

            if (!is_currently_focused && will_be_focused && typeof handler.onFocus === 'function') {
                handler.onFocus();
            }
        };

        /**
         * Returns whether the focus is on the window or not
         *
         * @return {Boolean}
         */
        this.isFocused = function() {
            return focused;
        };

        this.getFocus = function() {
            return focused;
        };

        this.getAction = function() {
            return curr_action;
        };

        this.getController = function() {
            return curr_controller;
        };

        this.getName = function() {
            return wndname;
        };

        this.getTitle = function() {
            return options.title;
        };

        this.getType = function() {
            return this.type;
        };

        this.getElement = function() {
            return rootnode;
        };

        this.getJQElement = function() {
            return jqrootnode;
        };

        this.getJQCloseButton = function() {
            return jqrootnode.parent().find('.ui-dialog-titlebar-close.ui-corner-all');
        };

        this.isMinimized = function() {
            return minimized;
        };

        this.isMinimizable = function() {
            return minimizable;
        };

        this.getMinimized = function() {
            return !minimized ? false : $('.box[cid=' + id + ']');
        };

        this.minimizeWindow = function() {
            if (this.isMinimizable()) {
                var html = minElm.html = $('<div id="' + jqcontent[0].id + '_min" class="gpwindow_minimize left"><div class="right"><div class="center"></div></div></div>'),
                    close = minElm.close = $('<a>').attr({
                        'href': '#',
                        'class': 'ui-dialog-titlebar-close ui-corner-all'
                    }).on("click", that.close),
                    max = minElm.max = $('<a>').attr({
                        'href': '#',
                        'class': 'ui-dialog-titlebar-maximize ui-corner-all'
                    }).on("click", that.maximizeWindow),
                    title = minElm.title = $('<span>').attr({
                        'href': '#',
                        'class': 'ui-dialog-title'
                    }).css({
                        'cursor': 'pointer'
                    }).html(options.title).on("click", that.maximizeWindow),
                    area = minElm.area = $('#gpwindow_area').show();

                html.find('div.center').append(title).append(close).append(max);
                // chrome/webkit workaround:
                area.append(html).parent().parent().show();
                html.fadeIn();

                jqrootnode.parent().hide();
                this.getWindowVeryMainNode().addClass('minimized');
                minimized = true;

                WM._addToMinimizedWindows(this);
            }
        };

        this.maximizeWindow = function() {
            jqrootnode.parent().show();

            if (!minElm.html) {
                return;
            }

            //Removed window from minimized
            var wnd = _self.getHandler().wnd;
            WM._removeFromMinimizedWindows(wnd.getID());

            minElm.html.remove();
            // remove event listeners
            minElm.close.off();
            minElm.max.off();
            minElm.title.off();

            if (minElm.area.children().length < 2 && wndmgr.numOpen() < 2) {
                // chrome/webkit workaround:
                minElm.area.parent().parent().hide();
            }
            minElm = {};
            // bring to front
            that.toTop();
            this.getWindowVeryMainNode().removeClass('minimized');
            minimized = false;

            $.Observer(GameEvents.window.maximize).publish({
                window_type: 'old'
            });
        };

        this.close = function() {
            try {
                jqrootnode.dialog('close');
            } catch (e) {
                window.debug(e);
            }
        };

        /**
         * Set titles max-width equal to free remaining space from other elements in header
         */
        this.adjustTitleWidth = function($header) {
            var $title = $header.find('span.ui-dialog-title');
            var title_siblings_width_total = 1;

            $title.siblings().each(function() {
                title_siblings_width_total += $(this).width();
            });

            $title.css(
                'max-width', ($header.width() - title_siblings_width_total - ($title.outerWidth(true) - $title.width()))
            );
        };
    }

    /**
     * Minimize a window and show it at the bottom of the screen
     */
    GPWindow.prototype.minimize = function() {
        this.minimizeWindow();
    };
    /**
     * Restore window and remove 'minimized'-markup
     */
    GPWindow.prototype.maximize = function() {
        this.maximizeWindow();
    };

    window.GPWindow = GPWindow;
}());