/*global GameViews, GameControllers */

(function() {
    "use strict";

    var LayoutButtonPremiumController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.LayoutButtonPremium({
                el: this.$el,
                controller: this
            });

            return this;
        },

        handleClickEvent: function() {

        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutButtonPremiumController = LayoutButtonPremiumController;
}());