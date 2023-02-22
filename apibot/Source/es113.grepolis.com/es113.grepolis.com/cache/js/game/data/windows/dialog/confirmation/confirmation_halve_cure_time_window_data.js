/*globals ConfirmationWindowData, GameDataHeroes */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "halve cure time window"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationHalveCureTimeWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationHalveCureTimeWindowData.inherits(ConfirmationWindowData);

    ConfirmationHalveCureTimeWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationHalveCureTimeWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameDataHeroes.getHalveCureTimeCost());
    };

    ConfirmationHalveCureTimeWindowData.prototype.getType = function() {
        return 'halve_cure_time';
    };

    ConfirmationHalveCureTimeWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationHalveCureTimeWindowData = ConfirmationHalveCureTimeWindowData;
}());