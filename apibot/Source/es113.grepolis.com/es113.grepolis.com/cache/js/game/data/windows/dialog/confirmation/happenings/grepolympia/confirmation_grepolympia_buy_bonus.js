/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * grepolympia_buy_bonus
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param onCancel {Function}       cancel button callback
     *     @param cost {Number}             cost of the training bonus
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationData.inherits(ConfirmationWindowData);

    ConfirmationData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.cost);
    };

    ConfirmationData.prototype.getType = function() {
        return 'grepolympia_training_boost';
    };

    ConfirmationData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationGrepolympiaBuyBonusTargets = ConfirmationData;
}());