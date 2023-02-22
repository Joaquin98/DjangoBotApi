/*global GameViews, GameControllers, DM */

(function() {
    "use strict";

    var LayoutPremiumController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
            this.l10n = DM.getl10n('layout');
        },

        renderPage: function() {
            this.view = new GameViews.LayoutPremium({
                el: this.$el,
                controller: this
            });

            return this;
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutPremiumController = LayoutPremiumController;
}());