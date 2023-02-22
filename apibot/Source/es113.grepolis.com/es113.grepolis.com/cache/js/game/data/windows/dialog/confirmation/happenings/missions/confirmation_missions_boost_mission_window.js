/*globals ConfirmationWindowData */

define('data/windows/dialog/confirmation/happenings/missions/confirmation_missions_boost_mission_window', function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "boost mission"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBoostMissionWindow(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);

        var MissionsHelper = require('events/missions/helpers/missions');
        this.l10n = MissionsHelper.getl10nForMissionSkin().premium[this.getType()].confirmation;
    }

    ConfirmationBoostMissionWindow.inherits(ConfirmationWindowData);

    ConfirmationBoostMissionWindow.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBoostMissionWindow.prototype.getQuestion = function() {
        return this.l10n.question(this._getCost());
    };

    ConfirmationBoostMissionWindow.prototype._getCost = function() {
        return this.props.cost;
    };

    ConfirmationBoostMissionWindow.prototype.getType = function() {
        return 'missions_boost_mission';
    };

    ConfirmationBoostMissionWindow.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationBoostMissionWindow;
});