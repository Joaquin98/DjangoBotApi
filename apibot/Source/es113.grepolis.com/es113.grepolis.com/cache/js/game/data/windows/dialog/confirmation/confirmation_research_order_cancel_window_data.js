/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "cancel research order"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationResearchOrderCancelWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationResearchOrderCancelWindowData.inherits(ConfirmationWindowData);

    ConfirmationResearchOrderCancelWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationResearchOrderCancelWindowData.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationResearchOrderCancelWindowData.prototype.getType = function() {
        return 'research_order_cancel';
    };

    ConfirmationResearchOrderCancelWindowData.prototype.hasCheckbox = function() {
        return false;
    };

    window.ConfirmationResearchOrderCancelWindowData = ConfirmationResearchOrderCancelWindowData;
}());