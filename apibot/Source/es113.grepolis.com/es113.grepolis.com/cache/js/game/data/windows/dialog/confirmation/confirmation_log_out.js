/*globals ConfirmationWindowData */

define('data/windows/dialog/confirmation/confirmation_log_out', function() {
    'use strict';

    function ConfirmationLogOut() {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationLogOut.inherits(ConfirmationWindowData);

    ConfirmationLogOut.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationLogOut.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationLogOut.prototype.getType = function() {
        return 'log_out';
    };

    ConfirmationLogOut.prototype.hasCheckbox = function() {
        return false;
    };

    return ConfirmationLogOut;
});