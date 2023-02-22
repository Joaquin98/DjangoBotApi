/* global ITowns, GameControllers, GameViews, BuildingWindowFactory */
(function() {
    'use strict';

    var MilitiaWelcomeController = GameControllers.TabController.extend({
        initialize: function(options) {
            // Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.MilitiaWelcomeView({
                el: this.$el,
                controller: this
            });

            return this;
        },

        getMilitiaTownId: function() {
            return this.getPreloadedData().town_id;
        },

        onButtonClick: function() {
            var militia_town_id = this.getMilitiaTownId();

            // There can be situation when militia window is opened for longer time and the town is already conquered
            // and does not belong to the user anymore
            // In this case window should be closed GP-13234
            if (ITowns.getTown(militia_town_id) !== undefined) {
                ITowns.townGroupsTownSwitch(null, militia_town_id);
                BuildingWindowFactory.open('farm');
            }

            // Close currently opened window
            this.closeWindow();
        }
    });

    window.GameControllers.MilitiaWelcomeController = MilitiaWelcomeController;
}());