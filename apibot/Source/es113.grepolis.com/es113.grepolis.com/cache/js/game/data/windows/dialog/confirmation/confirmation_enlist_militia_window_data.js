/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "enlisting militia"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationEnlistMilitiaWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationEnlistMilitiaWindowData.inherits(ConfirmationWindowData);

    ConfirmationEnlistMilitiaWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationEnlistMilitiaWindowData.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationEnlistMilitiaWindowData.prototype.getType = function() {
        return 'enlist_militia';
    };

    ConfirmationEnlistMilitiaWindowData.prototype.hasCheckbox = function() {
        return false;
    };

    window.ConfirmationEnlistMilitiaWindowData = ConfirmationEnlistMilitiaWindowData;
}());