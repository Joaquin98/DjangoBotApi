define('data/windows/dialog/confirmation/confirmation_return_all_units_from_town', function(require) {
    'use strict';

    var ConfirmationWindowData = require_legacy('ConfirmationWindowData');

    /**
     * Class which represents data to create confirmation window for
     * "return all units from town"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationReturnAllUnitsFromTown(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationReturnAllUnitsFromTown.inherits(ConfirmationWindowData);

    ConfirmationReturnAllUnitsFromTown.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationReturnAllUnitsFromTown.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationReturnAllUnitsFromTown.prototype.getType = function() {
        return 'return_all_units_from_town';
    };

    ConfirmationReturnAllUnitsFromTown.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationReturnAllUnitsFromTown;
});