/*globals ConfirmationWindowData, GameDataPremium */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "Extend advisor"
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param onCancel {Function}       cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationExtendAdvisorWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationExtendAdvisorWindowData.inherits(ConfirmationWindowData);

    ConfirmationExtendAdvisorWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationExtendAdvisorWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameDataPremium.getAdvisorCost(this.props.advisor_id));
    };

    ConfirmationExtendAdvisorWindowData.prototype.getType = function() {
        return 'extend_' + this.props.advisor_id;
    };

    ConfirmationExtendAdvisorWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationExtendAdvisorWindowData = ConfirmationExtendAdvisorWindowData;
}());