/*globals ConfirmationWindowData */

define('data/windows/dialog/confirmation/happenings/missions/confirmation_missions_skip_cooldown_window', function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "skip cooldown"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationSkipCooldownWindow(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);

        var MissionsHelper = require('events/missions/helpers/missions');
        this.l10n = MissionsHelper.getl10nForMissionSkin().premium[this.getType()].confirmation;
    }

    ConfirmationSkipCooldownWindow.inherits(ConfirmationWindowData);

    ConfirmationSkipCooldownWindow.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationSkipCooldownWindow.prototype.getQuestion = function() {
        return this.l10n.question(this._getCost());
    };

    ConfirmationSkipCooldownWindow.prototype._getCost = function() {
        return this.props.cost;
    };

    ConfirmationSkipCooldownWindow.prototype.getType = function() {
        return 'missions_skip_cooldown';
    };

    ConfirmationSkipCooldownWindow.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationSkipCooldownWindow;
});