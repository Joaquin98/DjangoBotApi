/* globals GameControllers, GameViews */

(function() {
    "use strict";

    var WorldEndWelcomeController = GameControllers.TabController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.setWindowTitle(this.getWindowTitleTranslation());

            this.view = new GameViews.WorldEndWelcomeView({
                el: this.$el,
                controller: this
            });

            return this;
        },

        getWindowTitleTranslation: function() {
            var l10n = this.getl10n();

            return l10n.world_ends_in(this.getDaysLeftUntilShutdown());
        },

        getDaysLeftUntilShutdown: function() {
            return this.getPreloadedData().gift_data[0].days_left_until_shutdown;
        },

        areNewWorldsExists: function() {
            return this.getPreloadedData().gift_data[0].new_world_exists;
        },

        getNewWorldSelectionUrl: function() {
            return this.getPreloadedData().gift_data[0].new_world_selection_url;
        },

        onBtnNewWorldsClick: function() {
            window.location.href = this.getNewWorldSelectionUrl();
        },

        onBtnContinueFightingClick: function() {
            //Disable hint
            var player_hint = this.getCollection('player_hints').getForType('world_ends');
            player_hint.disable();
            //Close window
            this.closeWindow();
        }
    });

    window.GameControllers.WorldEndWelcomeController = WorldEndWelcomeController;
}());