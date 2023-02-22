/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "Halloween 2013 - buy recipe"
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param onCancel {Function}       cancel button callback
     *     @param cost {Number}             cost of the ingredient
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyAdventSpinWindowData(props) {
        var BenefitHelper = require('helpers/benefit');

        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
        this.l10n = BenefitHelper.getl10nPremiumForSkin(this.l10n, this.getType());
    }

    ConfirmationBuyAdventSpinWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuyAdventSpinWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyAdventSpinWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.cost);
    };

    ConfirmationBuyAdventSpinWindowData.prototype.getType = function() {
        return 'advent_buy_spin';
    };

    ConfirmationBuyAdventSpinWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuyAdventSpinWindowData = ConfirmationBuyAdventSpinWindowData;
}());