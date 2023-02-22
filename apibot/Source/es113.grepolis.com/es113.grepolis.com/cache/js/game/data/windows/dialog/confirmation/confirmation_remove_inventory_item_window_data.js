/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "removing inventory item"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *     @param item_name {String}     name of the item to remove
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationRemoveInventoryItemDataWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationRemoveInventoryItemDataWindowData.inherits(ConfirmationWindowData);

    ConfirmationRemoveInventoryItemDataWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationRemoveInventoryItemDataWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.item_name);
    };

    ConfirmationRemoveInventoryItemDataWindowData.prototype.getType = function() {
        return 'remove_inventory_item';
    };

    ConfirmationRemoveInventoryItemDataWindowData.prototype.hasCheckbox = function() {
        return false;
    };

    window.ConfirmationRemoveInventoryItemDataWindowData = ConfirmationRemoveInventoryItemDataWindowData;
}());