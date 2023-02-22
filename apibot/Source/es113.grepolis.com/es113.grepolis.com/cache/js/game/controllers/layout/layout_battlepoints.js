/*global  GameViews, GameControllers */

(function() {
    'use strict';

    var LayoutBattlepointsController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.killpoints = this.getModel('player_killpoints');

            this.view = new GameViews.LayoutBattlepoints({
                el: this.$el,
                controller: this
            });

            this.killpoints.onPointsChange(this.view, this.view.render);

            return this;
        },

        getBattlepoints: function() {
            return this.killpoints.getUnusedPoints();
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutBattlepointsController = LayoutBattlepointsController;
}());