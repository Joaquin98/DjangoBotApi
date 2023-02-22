/*global  GameViews, GameControllers */

(function() {
    'use strict';

    var LayoutCoinsController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.player_ledger = this.getModel('player_ledger');

            this.view = new GameViews.LayoutCoins({
                el: this.$el,
                controller: this
            });

            this.player_ledger.onCoinsOfWarAndWisdomChange(this.view, this.view.render);

            return this;
        },

        getCoinsOfWar: function() {
            return this.player_ledger.getCoinsOfWar();
        },

        getCoinsOfWisdom: function() {
            return this.player_ledger.getCoinsOfWisdom();
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutCoinsController = LayoutCoinsController;
}());