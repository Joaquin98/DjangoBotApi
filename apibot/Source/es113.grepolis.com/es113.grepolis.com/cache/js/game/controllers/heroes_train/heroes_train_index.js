/*global DM */

(function() {
    "use strict";

    var Controller = window.GameControllers.TabController;

    /**
     * Controller
     */
    var HeroesTrainController = Controller.extend({
        main_view: null,

        renderPage: function(data) {
            this.templates = DM.getTemplate('heroes_train');
            this.l10n = DM.getl10n('heroes_train');

            this.main_view = new window.GameViews.HeroesTrainView({
                controller: this,
                el: this.$el
            });

            return this;
        },

        /**
         * destroy main view
         *
         * @private
         */
        destroy: function() {
            if (this.main_view && typeof this.main_view._destroy === 'function') {
                this.main_view._destroy();
            }
        }
    });

    window.GameControllers.HeroesTrainController = HeroesTrainController;
}());