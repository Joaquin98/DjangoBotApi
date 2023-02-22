/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "Buy event ingredient"
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param onCancel {Function}       cancel button callback
     *     @param cost {Number}             cost of the ingredient
     *     @param ingredient_type {String}  ingredient type
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyEventIngredientWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationBuyEventIngredientWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuyEventIngredientWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyEventIngredientWindowData.prototype.getQuestion = function() {
        var ingredient_name = this.props.ingredient.getName();

        return this.l10n.question(this.props.ingredient.getCost(), ingredient_name);
    };

    ConfirmationBuyEventIngredientWindowData.prototype.getType = function() {
        return 'buy_event_ingredient';
    };

    ConfirmationBuyEventIngredientWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuyEventIngredientWindowData = ConfirmationBuyEventIngredientWindowData;
}());