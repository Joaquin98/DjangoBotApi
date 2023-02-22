/*globals ConfirmationWindowData, HelperEaster */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * buy_halloween_ingredient
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param onCancel {Function}       cancel button callback
     *     @param cost {Number}             cost of the ingredient
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyEasterIngredientWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
        this.l10n = HelperEaster.getSkinl10n().premium[this.getType()].confirmation;
    }

    ConfirmationBuyEasterIngredientWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuyEasterIngredientWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyEasterIngredientWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.ingredient.getCost(), this.props.ingredient.getName());
    };

    ConfirmationBuyEasterIngredientWindowData.prototype.getType = function() {
        return 'easter_buy_ingredient';
    };

    ConfirmationBuyEasterIngredientWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuyEasterIngredientWindowData = ConfirmationBuyEasterIngredientWindowData;
}());