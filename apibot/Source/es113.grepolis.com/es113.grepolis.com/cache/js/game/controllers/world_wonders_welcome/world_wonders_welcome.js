/* globals GameControllers, GameViews, HelperPlayerHints */
(function() {
    'use strict';

    var WorldWondersWelcomeController = GameControllers.TabController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.WorldWondersWelcomeView({
                el: this.$el,
                controller: this
            });

            return this;
        },

        onButtonClick: function() {
            //Disable window
            HelperPlayerHints.disable('age_of_wonder');

            //Close window
            this.closeWindow();
        }
    });

    window.GameControllers.WorldWondersWelcomeController = WorldWondersWelcomeController;
}());