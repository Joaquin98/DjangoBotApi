/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "cancel building order"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuildingOrderCancelWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationBuildingOrderCancelWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuildingOrderCancelWindowData.prototype.getTitle = function() {
        return this.l10n.window_title(this._isDemolishing());
    };

    ConfirmationBuildingOrderCancelWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this._isDemolishing());
    };

    ConfirmationBuildingOrderCancelWindowData.prototype._isDemolishing = function() {
        return this.props.data.demolish === true;
    };

    ConfirmationBuildingOrderCancelWindowData.prototype.getType = function() {
        return 'building_order_cancel';
    };

    ConfirmationBuildingOrderCancelWindowData.prototype.hasCheckbox = function() {
        return false;
    };

    window.ConfirmationBuildingOrderCancelWindowData = ConfirmationBuildingOrderCancelWindowData;
}());