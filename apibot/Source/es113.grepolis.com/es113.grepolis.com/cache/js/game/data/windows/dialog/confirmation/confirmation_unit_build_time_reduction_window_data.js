/*globals ConfirmationWindowData, DM, GameDataUnits */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * 'unit build time reduction'
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationUnitBuildTimeReductionWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);

        this.building_type = props.building_type;
        //Overwrite parent call
        this.l10n = DM.getl10n('premium').unit_build_time.confirmation[this.building_type];
    }

    ConfirmationUnitBuildTimeReductionWindowData.inherits(ConfirmationWindowData);

    ConfirmationUnitBuildTimeReductionWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationUnitBuildTimeReductionWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameDataUnits.getUnitOrderBuildTimeReductionCost());
    };

    ConfirmationUnitBuildTimeReductionWindowData.prototype.getType = function() {
        return 'unit_build_time';
    };

    ConfirmationUnitBuildTimeReductionWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationUnitBuildTimeReductionWindowData = ConfirmationUnitBuildTimeReductionWindowData;
}());