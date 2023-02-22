/* globals ConfirmationWindowData, GameDataPowers */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "buy hero slot for gold"
     *
     * @param props {Object}
     * @param power_name {string}
     * @param onConfirm {Function}   confirmation button callback
     * @param onCancel {Function}    cancel button callback
     * @param currency_id {String}   currency id like gold, coins_of_war (@see PlayerLedger)
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationExtendPowerWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationExtendPowerWindowData.inherits(ConfirmationWindowData);

    ConfirmationExtendPowerWindowData.prototype.getTitle = function() {
        return this.l10n.window_title(this.props.power_name);
    };

    ConfirmationExtendPowerWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.power_name, GameDataPowers.getPowerExtensionCost());
    };

    ConfirmationExtendPowerWindowData.prototype.getType = function() {
        return 'extend_power';
    };

    ConfirmationExtendPowerWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationExtendPowerWindowData = ConfirmationExtendPowerWindowData;
}());