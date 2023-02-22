/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * grepolympia_extra_attempt
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param onCancel {Function}       cancel button callback
     *     @param cost {Number}             cost of the extra attempt
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
        var BenefitHelper = require('helpers/benefit'),
            premium_l10n = BenefitHelper.getl10nForSkin(this.l10n, 'premium');
        if (premium_l10n && premium_l10n.grepolympia_extra_attempt) {
            this.l10n = premium_l10n.grepolympia_extra_attempt.confirmation;
        }
    }

    ConfirmationData.inherits(ConfirmationWindowData);

    ConfirmationData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.cost);
    };

    ConfirmationData.prototype.getType = function() {
        return 'grepolympia_extra_attempt';
    };

    ConfirmationData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationGrepolympiaBuyAttemptTargets = ConfirmationData;
}());