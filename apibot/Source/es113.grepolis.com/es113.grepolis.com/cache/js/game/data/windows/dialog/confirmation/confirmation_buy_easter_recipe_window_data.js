/*globals ConfirmationWindowData, HelperEaster */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "Halloween  - buy recipe"
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param onCancel {Function}       cancel button callback
     *     @param cost {Number}             cost of the ingredient
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyEasterRecipeWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
        this.l10n = HelperEaster.getSkinl10n().premium[this.getType()].confirmation;
    }

    ConfirmationBuyEasterRecipeWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuyEasterRecipeWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyEasterRecipeWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.cost, this.props.has_level);
    };

    ConfirmationBuyEasterRecipeWindowData.prototype.getType = function() {
        return 'easter_buy_recipe';
    };

    ConfirmationBuyEasterRecipeWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuyEasterRecipeWindowData = ConfirmationBuyEasterRecipeWindowData;
}());