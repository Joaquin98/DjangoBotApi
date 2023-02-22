/*globals ConfirmationWindowData */

define('data/windows/dialog/confirmation/happenings/missions/confirmation_missions_buy_event_units_window', function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "buy event units"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyEventUnitsWindow(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);

        var MissionsHelper = require('events/missions/helpers/missions');
        this.l10n = MissionsHelper.getl10nForMissionSkin().premium[this.getType()].confirmation;
    }

    ConfirmationBuyEventUnitsWindow.inherits(ConfirmationWindowData);

    ConfirmationBuyEventUnitsWindow.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyEventUnitsWindow.prototype.getQuestion = function() {
        return this.l10n.question(this._getAmount(), this._getUnitName(), this._getCost());
    };

    ConfirmationBuyEventUnitsWindow.prototype._getCost = function() {
        return this.props.cost;
    };

    ConfirmationBuyEventUnitsWindow.prototype._getAmount = function() {
        return this.props.amount;
    };

    ConfirmationBuyEventUnitsWindow.prototype._getUnitName = function() {
        return this.props.unit_name;
    };

    ConfirmationBuyEventUnitsWindow.prototype.getType = function() {
        return 'missions_buy_event_units';
    };

    ConfirmationBuyEventUnitsWindow.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationBuyEventUnitsWindow;
});