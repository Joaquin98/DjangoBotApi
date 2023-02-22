/*global GameViews, GameControllers, GameEvents */

(function() {
    "use strict";

    var BOTTOM_FRAME_HEIGHT_OF_UNIT_MENU = 30; //height of the frame at the bottom of the units menu which is not part of the div

    var LayoutUnitsController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            // if gods spell container is hidden
            // we need to republish out own height since we are now visible again
            this.observeEvent(GameEvents.ui.layout_gods_spells.state_changed, function(e, data) {
                if (!data.state) {
                    this.publishViewHeight();
                }
            }.bind(this));
        },

        renderPage: function() {
            this.view = new GameViews.LayoutUnits({
                el: this.$el,
                controller: this
            });

            return this;
        },

        /**
         * calculate unit container height and publish it
         *
         * @returns {void}
         */
        publishViewHeight: function() {
            $.Observer(GameEvents.ui.layout_units.rendered).publish({
                unit_menu_bottom: this.$el.height() + this.$el.position().top + BOTTOM_FRAME_HEIGHT_OF_UNIT_MENU
            });
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutUnitsController = LayoutUnitsController;
}());