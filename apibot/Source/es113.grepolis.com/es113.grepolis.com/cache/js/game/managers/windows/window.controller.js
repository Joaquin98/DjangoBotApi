/*global $, CM, DM, GameEvents, Logger, Game, MobileMessages */

(function(window_manager_controllers, window_manager_views, controllers) {
    'use strict';

    window_manager_controllers.WindowController = controllers.BaseController.extend({
        className: 'window_curtain ui-front',

        $parent: null,

        //window view
        view: null,
        tabs_view: null,

        extended_window_manager: null,

        initialize: function(options) {
            var extended_options = $.extend(true, {}, options),
                skin_name = options.models.window.getSkinName();

            extended_options.templates = options.templates || {};
            extended_options.templates[skin_name] = DM.getTemplate('COMMON', skin_name);

            controllers.BaseController.prototype.initialize.apply(this, [extended_options]);

            this.controllers = options.controllers || {};

            var window_model = this.getModel('window');

            this.extended_window_manager = options.extended_window_manager;
            this.$parent = options.$parent;

            window_model.onTitleChange(this, this.handleTitleChangeEvent.bind(this));
            window_model.onVisibleChange(this, this.handleVisibilityChangeEvent.bind(this));
            window_model.onZIndexChange(this, this.handleZindexChangeEvent.bind(this));
            window_model.onMinimizedChange(this, this.handleMinimizedChangeEvent.bind(this));
            window_model.onDataReplace(this, this.renderContent.bind(this));
            window_model.onLoadingChange(this, this.handleLoadingChangeEvent.bind(this));
            window_model.onWidthChange(this, this.handleWidthChangeEvent.bind(this));
            window_model.onHeightChange(this, this.handleHeightChangeEvent.bind(this));
            window_model.onRequestPositionReset(this, this.handleRequestPositionResetEvent.bind(this));

            //@todo move it to .observeEvent
            $(window).on('resize.window' + window_model.getId(), this.handleBrowserWindowResizeEvent.bind(this));
            this.observeEvent(GameEvents.window.tab.rendered, window_model.hideLoading.bind(window_model));
            this.observeEvent(GameEvents.window.dialog.rendered, window_model.hideLoading.bind(window_model));
            this.observeEvent(GameEvents.window.open, this.adjustWindowTitleWidth.bind(this));
        },

        render: function() {
            var window_model = this.getModel('window');

            this.view = new window_manager_views.WindowView({
                el: this.$el,
                controller: this,
                $parent: this.$parent
            });

            this.view.render();
            window_model.showLoading();

            //Focus window because it was created as last one
            this.extended_window_manager.focusWindow(this.getModel('window'));

            this.renderContent();

            return this;
        },

        adjustWindowTitleWidth: function(event, window) {
            if (!window || (typeof window.getIdentifier !== 'function')) {
                return;
            }

            if (this.getModel('window').getIdentifier() === window.getIdentifier()) {
                this.view.adjustWindowTitleWidth();
            }
        },

        renderContent: function() {
            //Initialize window content object
            var window_model = this.getModel('window'),
                main_context = window_model.getIdentifier();

            var tabs_view_data = {
                collection: window_model.getTabsCollection(),
                el: this.$el,
                extended_window_manager: this.extended_window_manager,
                window_model: window_model
            };

            //Destroy tab view if it was already created (only one tab is visible at once)
            if (this.tabs_view) {
                this.tabs_view._destroy();
                this.tabs_view = null;
            }

            if (Game.dev) {
                this.tabs_view = new window_manager_views.TabsView(tabs_view_data);
            } else {
                try {
                    this.tabs_view = new window_manager_views.TabsView(tabs_view_data);
                } catch (e) {
                    Logger.get('error').log(window_model.getType() + '.renderContent() throw an exception:', e);
                }
            }

            //Execute predefined function
            window_model._onBeforeReload();

            // @dev Oliver?
            if (typeof window_model.onBeforeReload === 'function') {
                window_model.onBeforeReload();
            }

            // to clear all components before we render this window newly
            CM.unregisterGroup(main_context);

            //Unsubscribe events
            $.Observer().unsubscribe('window_' + main_context);

            this.tabs_view.render();

            //Publish, that window has been opened
            $.Observer(GameEvents.window.reload).publish(window_model);

            //Execute predefined function
            window_model._onAfterReload();
        },

        /**
         * Returns template which is used to create the window
         *
         * @return {String}
         */
        getWindowTemplate: function() {
            return this.getTemplate(this.getModel('window').getSkinName());
        },

        /**
         * Handles click on the tab
         *
         * @param {Number} tab_id
         */
        handleTabClickEvent: function(tab_id) {
            this.getModel('window').setActivePageNr(tab_id);
        },

        /**
         * Handles click on the 'close' button
         */
        handleCloseButtonClickEvent: function() {
            this.close();
        },

        /**
         * Handles click on the 'minimize' button
         */
        handleMinimizeButtonClickEvent: function() {
            this.minimize();
        },

        /**
         * Handles click on the 'maximize' button
         */
        handleMaximizeButtonClickEvent: function() {
            this.maximize();
        },

        /**
         * Handles click on the 'help' button
         */
        handleHelpButtonClickEvent: function() {
            var settings = this.getModel('window').getHelpButtonSettings(),
                action_type = settings.action.type;

            if (action_type === 'external_link') {
                if (Game.isHybridApp()) {
                    MobileMessages.openExternalLink(settings.action.url);
                } else {
                    window.open(settings.action.url);
                }
            }
        },

        /**
         * Handles any click on the window
         */
        handleBringToFrontEvent: function() {
            this.bringToFront();
        },

        handleRequestPositionResetEvent: function() {
            this.updateWindowPosition();
        },

        /**
         * Handles title change
         */
        handleTitleChangeEvent: function() {
            this.view.changeTitle(this.getModel('window').get('title'));
        },

        /**
         * Handles visibility change
         */
        handleVisibilityChangeEvent: function() {
            var display = this.getModel('window').get('visible');

            if (display === true) {
                this.view.show();
            } else {
                this.view.hide();
            }
        },

        /**
         * Updates zIndex of the window
         */
        handleZindexChangeEvent: function(model, value) {
            var window_model = this.getModel('window'),
                zindex = window_model.getZIndex(),
                is_modal = window_model.isModal();

            this.view.handleZindexChangeEvent(zindex, is_modal);
        },

        /**
         * Handles situation when window is being minimized
         */
        handleMinimizedChangeEvent: function() {
            var window_model = this.getModel('window'),
                is_minimized = window_model.isMinimized();

            this.view.handleMinimizedChangeEvent(is_minimized);

            this.getCollection('windows').trigger(is_minimized ? 'window:minimize' : 'window:maximize', window_model);
        },

        handleLoadingChangeEvent: function() {
            var window_model = this.getModel('window'),
                is_loading = window_model.isLoading();

            this.view.toggleAjaxLoader(is_loading);
        },

        handleWidthChangeEvent: function() {
            this.view.setWidth(this.getModel('window').getWidth());
        },

        handleHeightChangeEvent: function() {
            this.view.setHeight(this.getModel('window').getHeight());
        },

        /**
         * Handles situation when browser window is being resized
         */
        handleBrowserWindowResizeEvent: function() {
            this.view.handleBrowserWindowResizeEvent();
        },

        updateWindowVerticalPosition: function() {
            this.view.changePosition(true, false);
        },

        updateWindowPosition: function() {
            this.view.changePosition(true, true);
        },

        // ==============================================
        // ------------- Public Methods -----------------
        // ==============================================

        /**
         * Sets window title
         *
         * @param {String} value   new window title
         */
        setTitle: function(value) {
            this.getModel('window').setTitle(value);
        },

        /**
         * Shows window on the first plane
         */
        bringToFront: function() {
            this.getModel('window').bringToFront();
            //this.extended_window_manager.focusWindow(this.getModel('window'));
        },

        /**
         * Maximizes the window
         */
        maximize: function() {
            this.getModel('window').maximize();
        },

        /**
         * Minimizes the window
         */
        minimize: function() {
            this.getModel('window').minimize();
        },

        /**
         * By this function you can set onBeforeClose event for the window
         *
         * @param {Function} fn   function which will be executed before
         *                        window is closed
         */
        setOnBeforeClose: function(fn) {
            this.getModel('window').setOnBeforeClose(fn);
        },

        /**
         * By this function you can set onAfterClose event for the window
         *
         * @param {Function} fn   function which will be executed after
         *                        window is closed
         */
        setOnAfterClose: function(fn) {
            this.getModel('window').setOnAfterClose(fn);
        },

        /**
         * By this function you can set onBeforeReload event for the window
         *
         * @param {Function} fn   function which will be executed before
         *                        window is reloaded
         */
        setOnBeforeReload: function(fn) {
            this.getModel('window').setOnBeforeReload(fn);
        },

        /**
         * By this function you can set onAfterReload event for the window
         *
         * @param {Function} fn   function which will be executed after
         *                        window is reloaded
         */
        setOnAfterReload: function(fn) {
            this.getModel('window').setOnAfterReload(fn);
        },

        /**
         * Closes the window
         */
        close: function() {
            this.getModel('window').manualClose();
        },

        destroy: function() {
            //@todo check what is happening here
            this.tabs_view._destroy();

            //@todo move it to .observeEvent
            $(window).off('resize.window' + this.getModel('window').getId());
        }
    });
}(window.WindowManagerControllers, window.WindowManagerViews, window.GameControllers));