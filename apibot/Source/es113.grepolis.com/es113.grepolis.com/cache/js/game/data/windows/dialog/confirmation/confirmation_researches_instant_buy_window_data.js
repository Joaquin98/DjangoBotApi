/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "buy inventory slot for gold"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationResearchesInstantBuyWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationResearchesInstantBuyWindowData.inherits(ConfirmationWindowData);

    ConfirmationResearchesInstantBuyWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationResearchesInstantBuyWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.cost);
    };

    ConfirmationResearchesInstantBuyWindowData.prototype.getType = function() {
        return 'instant_buy_technologies';
    };

    ConfirmationResearchesInstantBuyWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationResearchesInstantBuyWindowData = ConfirmationResearchesInstantBuyWindowData;
}());