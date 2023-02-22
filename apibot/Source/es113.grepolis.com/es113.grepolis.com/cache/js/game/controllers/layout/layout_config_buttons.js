/*global GameViews, GameControllers, GameEvents */

(function() {
    "use strict";

    var LayoutConfigButtonsController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            // Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.LayoutConfigButtons({
                el: this.$el,
                controller: this
            });

            this.registerEventListeners();

            return this;
        },

        registerEventListeners: function() {
            this.observeEvent(GameEvents.sound.init, function(e, data) {
                this.initializeButtonAudioToggle();
            }.bind(this));
        },

        initializeButtonAudioToggle: function() {
            this.view.initializeButtonAudioToggle();
        }
    });

    window.GameControllers.LayoutConfigButtonsController = LayoutConfigButtonsController;
}());