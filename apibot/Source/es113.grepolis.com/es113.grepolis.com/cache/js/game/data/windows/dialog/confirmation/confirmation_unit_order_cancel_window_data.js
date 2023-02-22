/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "cancel research order"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationUnitOrderCancelWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationUnitOrderCancelWindowData.inherits(ConfirmationWindowData);

    ConfirmationUnitOrderCancelWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationUnitOrderCancelWindowData.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationUnitOrderCancelWindowData.prototype.getType = function() {
        return 'unit_order_cancel';
    };

    ConfirmationUnitOrderCancelWindowData.prototype.hasCheckbox = function() {
        return false;
    };

    window.ConfirmationUnitOrderCancelWindowData = ConfirmationUnitOrderCancelWindowData;
}());