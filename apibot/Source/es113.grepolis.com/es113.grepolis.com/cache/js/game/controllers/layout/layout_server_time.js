/*global GameViews, GameControllers */

(function() {
    "use strict";

    var LayoutServerTimeController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.LayoutServerTime({
                el: this.$el,
                controller: this
            });

            return this;
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutServerTimeController = LayoutServerTimeController;
}());