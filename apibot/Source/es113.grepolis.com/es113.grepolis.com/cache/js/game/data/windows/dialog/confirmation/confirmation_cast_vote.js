/*globals ConfirmationWindowData */

define('data/windows/dialog/confirmation/confirmation_cast_vote', function() {
    'use strict';

    function ConfirmationData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationData.inherits(ConfirmationWindowData);

    ConfirmationData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationData.prototype.getQuestion = function() {
        return this.l10n.question();
    };

    ConfirmationData.prototype.getType = function() {
        return 'cast_vote';
    };

    ConfirmationData.prototype.hasCheckbox = function() {
        return false;
    };

    return ConfirmationData;
});