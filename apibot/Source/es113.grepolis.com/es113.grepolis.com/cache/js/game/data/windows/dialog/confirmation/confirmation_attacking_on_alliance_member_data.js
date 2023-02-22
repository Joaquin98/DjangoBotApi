/*globals ConfirmationWindowData */

define('data/windows/dialog/confirmation/confirmation_attacking_on_alliance_member_data', function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * 'Attacking an alliance member'
     *
     * @param props {Object}
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationAttackingOnAllianceMemberData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationAttackingOnAllianceMemberData.inherits(ConfirmationWindowData);

    ConfirmationAttackingOnAllianceMemberData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationAttackingOnAllianceMemberData.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationAttackingOnAllianceMemberData.prototype.getType = function() {
        return 'attacking_on_alliance_member';
    };

    ConfirmationAttackingOnAllianceMemberData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationAttackingOnAllianceMemberData = ConfirmationAttackingOnAllianceMemberData;
    return ConfirmationAttackingOnAllianceMemberData;
});