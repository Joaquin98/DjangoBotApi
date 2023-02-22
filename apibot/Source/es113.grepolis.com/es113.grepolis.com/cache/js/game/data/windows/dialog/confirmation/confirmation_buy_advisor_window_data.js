/*globals ConfirmationWindowData, GameDataPremium */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "Buy advisor"
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param onCancel {Function}       cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyAdvisorWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationBuyAdvisorWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuyAdvisorWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyAdvisorWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameDataPremium.getAdvisorCost(this.props.advisor_id));
    };

    ConfirmationBuyAdvisorWindowData.prototype.getType = function() {
        return 'buy_' + this.props.advisor_id;
    };

    ConfirmationBuyAdvisorWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuyAdvisorWindowData = ConfirmationBuyAdvisorWindowData;
}());