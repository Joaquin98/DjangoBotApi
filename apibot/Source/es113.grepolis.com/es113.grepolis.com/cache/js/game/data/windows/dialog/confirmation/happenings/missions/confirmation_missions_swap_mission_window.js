/*globals ConfirmationWindowData */

define('data/windows/dialog/confirmation/happenings/missions/confirmation_missions_swap_mission_window', function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "swap mission"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationSwapMissionWindow(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);

        var MissionsHelper = require('events/missions/helpers/missions');
        this.l10n = MissionsHelper.getl10nForMissionSkin().premium[this.getType()].confirmation;
    }

    ConfirmationSwapMissionWindow.inherits(ConfirmationWindowData);

    ConfirmationSwapMissionWindow.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationSwapMissionWindow.prototype.getQuestion = function() {
        return this.l10n.question(this._getCost());
    };

    ConfirmationSwapMissionWindow.prototype._getCost = function() {
        return this.props.cost;
    };

    ConfirmationSwapMissionWindow.prototype.getType = function() {
        return 'missions_swap_mission';
    };

    ConfirmationSwapMissionWindow.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationSwapMissionWindow;
});