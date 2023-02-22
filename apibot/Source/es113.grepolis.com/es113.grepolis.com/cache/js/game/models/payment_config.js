/*global window, GrepolisModel */

(function() {
    "use strict";

    var PaymentConfig = function() {}; // never use this, because it will be overwritten
    PaymentConfig.urlRoot = 'PaymentConfig';

    /**
     * @returns {Boolean}
     */
    PaymentConfig.isBuyingEnabled = function() {
        return this.get('buying_enabled');
    };

    /**
     * @returns {Boolean}
     */
    PaymentConfig.isSpendingEnabled = function() {
        return this.get('spending_enabled');
    };

    window.GameModels.PaymentConfig = GrepolisModel.extend(PaymentConfig);
}());