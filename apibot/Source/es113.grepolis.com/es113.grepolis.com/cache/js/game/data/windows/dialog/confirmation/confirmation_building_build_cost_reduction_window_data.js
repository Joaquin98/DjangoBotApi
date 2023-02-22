/*globals ConfirmationWindowData */

define('window_data/confirmation_building_build_cost_reduction', function() {
    'use strict';

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
    function ConfirmationBuildingBuildCostReductionWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationBuildingBuildCostReductionWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuildingBuildCostReductionWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuildingBuildCostReductionWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this._getReduction(), this._getCost());
    };

    ConfirmationBuildingBuildCostReductionWindowData.prototype._getReduction = function() {
        return this.props.reduction;
    };

    ConfirmationBuildingBuildCostReductionWindowData.prototype._getCost = function() {
        return this.props.cost;
    };

    ConfirmationBuildingBuildCostReductionWindowData.prototype.getType = function() {
        return 'building_build_cost_reduction';
    };

    ConfirmationBuildingBuildCostReductionWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationBuildingBuildCostReductionWindowData;
});