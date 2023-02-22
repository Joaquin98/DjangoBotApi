/*globals Layout */

window.PhoenicianSalesmanWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'PhoenicianSalesman' window
         */
        openPhoenicianSalesmanWindow: function() {
            return Layout.phoenicianSalesman.open();
        }
    };
}());