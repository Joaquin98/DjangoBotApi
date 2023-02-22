/* global GameControllers, GameViews, Game */
(function() {
    'use strict';

    var SubWindowController = GameControllers.BaseController.extend({
        //Keeps reference to the content view
        content_controller: null,

        initialize: function(options) {
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
            this.$parent = options.$parent;
            this.css_classes = options.css_classes;
            this.center_top = options.center_top;
            this.closeable = options.closeable;

            if (options.center_top || Game.isHybridApp()) {
                this.center_top = true;
            }
        },

        initializeView: function() {
            this.view = new GameViews.SubWindowView({
                $parent: this.$parent,
                controller: this,
                css_classes: this.css_classes
            });
        },

        renderView: function(content_controller) {
            if (!this.view) {
                this.initializeView();
            }

            this.content_controller = content_controller;

            content_controller.render(this.window_controller.getSubWindowContentNode());
            this.center();
        },

        /**
         * reRender the subwindow and restore the current state
         */
        reRender: function() {
            this.initializeView();
            this.content_controller.render(this.window_controller.getSubWindowContentNode());
            this.center();
        },

        /**
         * Center sub window in the window
         */
        center: function() {
            if (this.center_top) {
                this.view.centerTop();
            } else {
                this.view.center();
            }

        },

        /**
         * Change the window title of the sub window
         */
        setTitle: function(title) {
            this.view.setTitle(title);
        },

        /**
         * Get the window title of the sub window
         */
        getTitle: function() {
            return this.view.getTitle();
        },

        /**
         * Closes window
         */
        close: function() {
            if (typeof this._onBeforeCloseCallback === 'function') {
                this._onBeforeCloseCallback();
            }

            if (this.window_controller) {
                this.window_controller.enableTabs();
                this.window_controller.closeSubWindow();
            }

            this._destroy();

            if (typeof this._onAfterCloseCallback === 'function') {
                this._onAfterCloseCallback();
            }
        },

        /**
         * Registers callback that will be called just before closing.
         */
        setOnBeforeClose: function(cb) {
            this._onBeforeCloseCallback = cb;
        },

        /**
         * Registers callback that will be called just after closing.
         */
        setOnAfterClose: function(cb) {
            this._onAfterCloseCallback = cb;
        },

        isCloseable: function() {
            return this.closeable !== false;
        },

        /**
         * Clean up code
         */
        destroy: function() {
            this.content_controller._destroy();
        }
    });

    window.GameControllers.SubWindowController = SubWindowController;
}());