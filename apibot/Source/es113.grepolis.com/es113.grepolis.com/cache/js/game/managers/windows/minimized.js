/*global $, Backbone, DM, GPWindowMgr, us, GameEvents */

(function(views, collections, models) {
    'use strict';

    /**
     * ======================================
     * ===== Minimized Windows Manager ======
     * ======================================
     */
    collections.MinimizedWindows = Backbone.Collection.extend({});

    views.ViewMinimizedWindows = Backbone.View.extend({
        //Keeps jQuery object of minimized windows area element
        $minimized: null,
        $windows_box: null,
        $windows: null,
        $btn_close_all: null,

        //item which is disapayed as first one
        current_item_nr: 0,

        extended_window_manager: null,

        events: {
            'click .btn_wnd.maximize': '_handleMaximizeWindowEvent',
            'click .btn_wnd.close': '_handleCloseWindowEvent',
            //'click .btn_close_all_windows' : '_handleCloseAllWindowsEvent',
            'click .button_scroll_left': '_handleClickButtonScrollLeft',
            'click .button_scroll_right': '_handleClickButtonScrollRight'
        },

        initialize: function(options) {
            var _self = this,
                collection = this.collection,
                open_windows = this.open_windows = options.open_windows,
                l10n = DM.getl10n('COMMON');

            collection.on('add', this.render, this);
            collection.on('remove', this.render, this);

            open_windows.on('window:maximize', this._maximizeWindow, this);
            open_windows.on('remove', this._removeMinimizedWindow, this);
            open_windows.on('window:minimize', this._addMinimizedWindow, this);

            this.extended_window_manager = options.extended_window_manager;
            this.$minimized = this.$el.find('.minimized_windows_area');
            this.$windows_box = this.$el.find('.windows_box');
            this.$windows = this.$el.find('.windows');
            this.$btn_close_all = $('.btn_close_all_windows')
                .on('click', $.proxy(this._handleCloseAllWindowsEvent, this))
                .tooltip(l10n.close_all);

            this.$windows_box.mousewheel($.proxy(this._handleScrollEvent, this));
            this.$windows_box.on('webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend', function(e) {
                _self.enableScrolling();
            });

            this.render();
        },

        render: function() {
            var $minimized = this.$minimized,
                $windows_box = this.$windows_box,
                $windows = this.$windows,
                $boxes,
                total_width = 0,
                max_size, overloaded;

            var models = this.collection.models,
                template = DM.getTemplate('COMMON', 'wnd_minimized');

            $windows.html(us.template(template, {
                windows: models
            }));

            this.toggleMinimizedWindowsArea();

            //Determinate if there are more windows minimized than viewport size can contain
            $boxes = $windows.find('.box');
            max_size = $windows_box.outerWidth();

            $boxes.each(function(index, el) {
                var $el = $(el);

                total_width += $el.outerWidth(true);
            });

            overloaded = max_size < total_width;

            $minimized.toggleClass('overloaded', overloaded);

            //Reset position
            $windows.css({
                left: 0
            });

            return this;
        },

        enableScrolling: function() {
            this.scrolling_enabled = true;
        },

        disableScrolling: function() {
            this.scrolling_enabled = false;
        },

        isScrollingEnabled: function() {
            return this.scrolling_enabled;
        },

        toggleMinimizedWindowsArea: function() {
            var _self = this,
                collection = this.collection;

            function toggleMinimizedArea() {
                _self.$minimized[collection.length ? 'show' : 'hide']();

                //Display close all windows when at least one window is opened
                _self.$btn_close_all[
                    (_self.open_windows.getOpenedClosableWindows().length +
                        GPWindowMgr.getOpenedClosableWindows().length
                    ) > 0 ?
                    'show' :
                    'hide'
                ]();

                if (collection.length > 0) {
                    $.Observer(GameEvents.window.minimized_windows_area.show).publish();
                } else {
                    $.Observer(GameEvents.window.minimized_windows_area.hide).publish();
                }
            }

            //Events which are watching if any window has been opened or closed
            $.Observer(GameEvents.window.open).subscribe('closeAllWindowsButton', function(e, data) {
                toggleMinimizedArea();
            });

            $.Observer(GameEvents.window.close).subscribe('closeAllWindowsButton', function(e, data) {
                toggleMinimizedArea();
            });

            toggleMinimizedArea();
        },

        _handleScrollEvent: function(e, delta) {
            if (this.$minimized.hasClass('overloaded')) {
                this._getScrollView(this.current_item_nr - delta);
            }
        },

        _handleClickButtonScrollLeft: function() {
            if (this.$minimized.hasClass('overloaded')) {
                this._getScrollView(this.current_item_nr - 1);
            }
        },

        _handleClickButtonScrollRight: function() {
            if (this.$minimized.hasClass('overloaded')) {
                this._getScrollView(this.current_item_nr + 1);
            }
        },

        _getScrollView: function(item_nr) {
            var $windows = this.$windows,
                $windows_box = this.$windows_box,
                $boxes = $windows.find('.box');

            var viewport_size = $windows_box.outerWidth(),
                scroll_to, total_size = 0,
                curr_position = 0,
                temp_size = 0,
                edge_item_nr = null;

            //Pre-calculate total size of the boxes
            $boxes.each(function(index, el) {
                total_size += $(el).outerWidth(true);
            });

            //Calculate which element is an 'edge' element
            $boxes.each(function(index, el) {
                //Limit scrolling to the last element
                if (temp_size + viewport_size > total_size && edge_item_nr === null) {
                    edge_item_nr = index;
                }

                temp_size += $(el).outerWidth(true);
            });

            //Keep item_nr between 0 and max
            item_nr = Math.min(Math.max(0, item_nr), edge_item_nr);

            $boxes.each(function(index, el) {
                var $el = $(el),
                    width = $el.outerWidth(true);

                if (item_nr === index) {
                    scroll_to = curr_position;
                }

                curr_position += width;
            });

            //Limit scrolling to the first element
            scroll_to = Math.max(0, scroll_to);

            //Limit scrolling to the last element
            if (scroll_to + viewport_size > total_size) {
                scroll_to = total_size - viewport_size;
            }

            this.current_item_nr = item_nr;

            $windows.addClass('scrolling').css({
                left: -scroll_to
            });
        },

        _handleMaximizeWindowEvent: function(e) {
            //Get clicked button
            var $target = $(e.currentTarget),
                cid = $target.attr('cid'),
                model = this.open_windows.get(cid),
                old_window_id = parseInt(cid, 10);

            //Old windows have IDs 1000+, new one have c1, c2...
            if (old_window_id > 0) {
                //If old window, maximize it
                GPWindowMgr.getWindowById(old_window_id).maximizeWindow();
            } else {
                //Maximize window
                model.maximize();
            }
        },

        _handleCloseWindowEvent: function(e) {
            //Get clicked button
            var $target = $(e.currentTarget),
                cid = $target.attr('cid'),
                model = this.open_windows.get(cid),
                old_window_id = parseInt(cid, 10);

            //Old windows have IDs 1000+, new one have c1, c2...
            if (old_window_id > 0) {
                //If old window, close it
                GPWindowMgr.getWindowById(old_window_id).close();
            } else {
                //Close window (event on colection will be triggered itself)
                this.extended_window_manager.closeWindow(model);
            }
        },

        _handleCloseAllWindowsEvent: function(e) {
            //Remove all new windows (even opened)
            this.extended_window_manager.closeAllWindows();

            //Support for old windows
            GPWindowMgr.closeAll();
        },

        _maximizeWindow: function(wnd_model) {
            this._removeMinimizedWindow(wnd_model);
        },

        _removeMinimizedWindow: function(wnd_model) {
            var collection = this.collection,
                model = collection.where({
                    wnd_cid: wnd_model.cid,
                    type: 'new'
                });

            //Remove information about minimized window
            collection.remove(model);
        },

        _removeMinimizedWindowForOldWindows: function(window_id) {
            var collection = this.collection,
                model = collection.where({
                    wnd_cid: window_id,
                    type: 'old'
                });

            //Remove information about old minimized window
            collection.remove(model);
        },

        _addMinimizedWindow: function(wnd_model) {
            //Add information about minimized window
            this.collection.add([{
                wnd_cid: wnd_model.getIdentifier(),
                title: wnd_model.getTitle(),
                type: 'new',
                closable: wnd_model.isClosable()
            }]);
            $.Observer(GameEvents.window.minimize).publish({
                window_obj: wnd_model
            });
        },

        _addMinimizedWindowForOldWindows: function(wnd) {
            //Add information about old minimized window
            this.collection.add([{
                wnd_cid: wnd.getIdentifier(),
                title: wnd.getTitle(),
                type: 'old',
                closable: wnd.isClosable()
            }]);
            $.Observer(GameEvents.window.minimize).publish({
                window_obj: wnd
            });
        },

        /**
         * Determines whether the minimized windows box is visible or not
         *
         * @return {Boolean}
         *
         * @todo change name later when windows part is refactored
         */
        isMinimizedWindowsBoxVisible: function() {
            return this.collection.length > 0;
        }
    });
}(window.WindowManagerViews, window.WindowManagerCollections, window.WindowManagerModels));