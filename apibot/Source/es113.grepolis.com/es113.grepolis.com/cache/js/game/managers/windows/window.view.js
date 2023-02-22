/*global $, us, Backbone, Game */

(function(window_manager_views) {
    'use strict';

    window_manager_views.WindowView = Backbone.View.extend({
        //Keeps JQuery objects of most used elemenets
        $min: null,
        $max: null,
        $content: null,
        $window: null,
        $curtain: null,
        $parent: null,

        initialize: function(options) {
            this.controller = options.controller;
            this.$parent = options.$parent;
        },

        render: function() {
            var $el = this.$el;
            var window_model = this.controller.getModel('window'),
                window_args = window_model.getArguments(),
                window_skin = (window_args && window_args.window_skin) ? window_args.window_skin : '';

            //Render window template
            $el.html(us.template(this.controller.getWindowTemplate(), {
                model: window_model,
                window_skin: window_skin
            }));

            this.$parent.append($el);

            //Save JQuery objects of most used elements
            this.$min = $el.find('.minimize');
            this.$max = $el.find('.maximize');
            this.$content = $el.find('.js-window-content');
            this.$window = $el.find('.js-window-main-container');
            this.$curtain = $el;

            this.$window.toggle(window_model.isVisible());
            this.$curtain.toggleClass('show_curtain is_modal_window', window_model.isModal());

            this.adjustCurtainDimensions();
            this.bindEventListeners();

            return this;
        },

        bindEventListeners: function() {
            //Bring to fron when user clicks on the window
            this.$el.on('mousedown', this._handleBringToFrontEvent.bind(this));

            //Close button
            this.$el.on('click', '.js-wnd-buttons .close', this._handleCloseButtonClickEvent.bind(this));

            //Minimize button
            this.$el.on('click', '.js-wnd-buttons .minimize', this._handleMinimizeButtonClickEvent.bind(this));

            //Maximize button
            this.$el.on('click', '.js-wnd-buttons .maximize', this._handleMaximizeButtonClickEvent.bind(this));

            //Help button
            this.$el.on('click', '.js-wnd-buttons .help', this._handleHelpButtonClickEvent.bind(this));

            //Click on the tab
            this.$el.on('click', '.tab:not(.disabled)', this._handleTabClickEvent.bind(this));
        },

        /**
         * Updates window curtain height when browser window resizes
         */
        adjustCurtainDimensions: function() {
            var window_model = this.controller.getModel('window');

            if (window_model.isModal()) {
                this.$curtain.height('auto').height($(window).outerHeight() / Game.ui_scale.factor);
                this.$curtain.width('auto').width($(window).outerWidth() / Game.ui_scale.factor);
            } else {
                this.$curtain.height('auto').height($(window).outerHeight());
            }
        },

        /**
         * Handles click on the tab
         *
         * @private
         */
        _handleTabClickEvent: function(e) {
            var $el = $(e.currentTarget),
                tab_id = parseInt($el.attr("details"), 10);

            this.controller.handleTabClickEvent(tab_id);
        },

        /**
         * Handles click on the 'close' button
         *
         * @private
         */
        _handleCloseButtonClickEvent: function() {
            this.controller.handleCloseButtonClickEvent();
        },

        /**
         * Handles click on the 'minimize' button
         *
         * @private
         */
        _handleMinimizeButtonClickEvent: function() {
            this.controller.handleMinimizeButtonClickEvent();
        },

        /**
         * Handles click on the 'maximize' button
         *
         * @private
         */
        _handleMaximizeButtonClickEvent: function() {
            this.controller.handleMaximizeButtonClickEvent();
        },

        /**
         * Handles click on the 'help' button
         *
         * @private
         */
        _handleHelpButtonClickEvent: function() {
            this.controller.handleHelpButtonClickEvent();
        },

        /**
         * Handles click on any part of the window
         *
         * @private
         */
        _handleBringToFrontEvent: function() {
            this.controller.handleBringToFrontEvent();
        },

        /**
         * Handles zIndex change
         */
        handleZindexChangeEvent: function(zindex, is_modal) {
            this.$curtain.css('z-index', zindex);

            if (is_modal) {
                //this.$curtain.css('z-index', 2002);
            }
        },

        /**
         * Handles situation when window is being minimized
         *
         * @param {Boolean} is_minimized   determinates if window is minimized or not
         */
        handleMinimizedChangeEvent: function(is_minimized) {
            this.$window.toggleClass('minimized', is_minimized);
        },

        /**
         * Handles situation when browser window is being resized
         */
        handleBrowserWindowResizeEvent: function() {
            this.adjustCurtainDimensions();
        },

        /**
         * Updates window's title
         *
         * @param {String} title
         */
        changeTitle: function(title) {
            this.$window.find('.title').first().html(title);
        },

        /**
         * Shows window
         */
        show: function() {
            this.$curtain.css('visibility', 'visible');
        },

        setWidth: function(width) {
            this.$window.width(width);
        },

        setHeight: function(height) {
            this.$window.height(height);
        },

        /**
         * Hides window
         */
        hide: function() {
            this.$curtain.css('visibility', 'hidden');
        },

        /**
         * Position window depends on the settings
         *
         * @param {Boolean} ver   determinates if vertical position of the window should be updated
         * @param {Boolean} hor   determinates if horizontal position of the window should be updated
         */
        changePosition: function(ver, hor) {
            var window_model = this.controller.getModel('window'),
                $window = this.$window,
                props = {
                    position: 'absolute'
                },
                resizable = window_model.isResizable(),
                position = window_model.getPosition();

            var viewport_size = {
                width: $('body').innerWidth(),
                height: $('body').innerHeight(),
            };

            var town_name_area_height = $(".btn_toggle_town_groups_menu").outerHeight();

            //Get Values
            var types = {
                    'width': window_model.getWidth(),
                    'height': window_model.getHeight(),
                    'min-width': window_model.getMinWidth(),
                    'min-height': window_model.getMinHeight(),
                    'max-width': window_model.getMaxWidth(),
                    'max-height': window_model.getMaxHeight()
                },
                id;

            //If resizable, don't set height'
            if (resizable) {
                types.height = null;
            }

            //Check if values are different than 0 or false
            for (id in types) {
                if (types.hasOwnProperty(id) && types[id]) {
                    props[id] = types[id];
                }
            }

            //Set styles
            $window.css(props);

            var real_width = $window.outerWidth(true),
                real_height = $window.outerHeight(true);

            // Center window vertically
            if (ver && position[0] === "center") {
                //rules for windows placement from GP-9858 (The only rule is that the window can not be over the
                // 'town name area' - excluding casted powers)
                $window.css({
                    'margin-top': 0,
                    'top': town_name_area_height + Math.max(((viewport_size.height - town_name_area_height) - real_height) / 2, 0)
                });
            }

            // Center window horizontally
            if (hor && position[1] === "center") {
                $window.css({
                    'margin-left': 0,
                    'left': Math.max((viewport_size.width - real_width) / 2, 0)
                });
            }
        },

        // shows the ajax loading icon centered in the window
        toggleAjaxLoader: function(is_loading) {
            if (is_loading && !this.$window.find('div.grey_layer').length) {
                // the loader gif is has too sharp edges so we place a soft shadow under it
                var loader_shadow = $('<div/>').addClass('loading_icon_wrapper'),
                    ajax_loader = $('<div/>').addClass('loading_icon'),
                    grey_layer = $('<div/>').addClass('grey_layer');

                this.$window.append(grey_layer, loader_shadow.append(ajax_loader));
            } else {
                this.$window.find('.grey_layer, .loading_icon_wrapper').remove();
            }
        },

        destroy: function() {
            this.$curtain.off().remove();
        },

        adjustWindowTitleWidth: function() {
            var $window_buttons = this.$window.find('div.wnd_border_t.js-wnd-buttons');
            var $title = $window_buttons.find('.title');
            var titles_siblings_width_total = 0;
            var defined_tabs_width = true;

            $title.siblings(':not(.window_move_container)').each(function() {
                if ($(this).width() === 0) {
                    defined_tabs_width = false;
                }
                titles_siblings_width_total += $(this).width();
            });

            if (defined_tabs_width) {
                $title.css('width', ($window_buttons.width() - titles_siblings_width_total));
            }
        }
    });
}(window.WindowManagerViews));