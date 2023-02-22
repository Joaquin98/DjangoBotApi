/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "buy inventory slot for gold"
     *
     * @param props {Object}
     * @param onConfirm {Function}   confirmation button callback
     * @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyInventorySlotWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationBuyInventorySlotWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuyInventorySlotWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyInventorySlotWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.getCost());
    };

    ConfirmationBuyInventorySlotWindowData.prototype.getType = function() {
        return 'buy_inventory_slot';
    };

    ConfirmationBuyInventorySlotWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuyInventorySlotWindowData = ConfirmationBuyInventorySlotWindowData;
}());