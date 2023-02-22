/* globals GameControllers, GameViews, HelperPlayerHints, PhoenicianSalesmanWindowFactory */

(function() {
    'use strict';

    var PhoenicianSalesmanWelcomeController = GameControllers.TabController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function(data) {
            this.view = new GameViews.PhoenicianSalesmanWelcomeView({
                el: this.$el,
                controller: this
            });

            return this;
        },

        onButtonClick: function() {
            //Disable info window
            HelperPlayerHints.disable('phoenician_salesman');

            //Open PS window
            PhoenicianSalesmanWindowFactory.openPhoenicianSalesmanWindow();

            //Close currently opened window
            this.closeWindow();
        },

        destroy: function() {

        }
    });

    window.GameControllers.PhoenicianSalesmanWelcomeController = PhoenicianSalesmanWelcomeController;
}());