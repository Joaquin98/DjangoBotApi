/*globals ConfirmationWindowData, GameDataBuildings */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "halve build time building order"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuildingBuildTimeReductionWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationBuildingBuildTimeReductionWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuildingBuildTimeReductionWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuildingBuildTimeReductionWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameDataBuildings.getFinishBuildingOrderCost());
    };

    ConfirmationBuildingBuildTimeReductionWindowData.prototype.getType = function() {
        return 'building_build_time';
    };

    ConfirmationBuildingBuildTimeReductionWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuildingBuildTimeReductionWindowData = ConfirmationBuildingBuildTimeReductionWindowData;
}());