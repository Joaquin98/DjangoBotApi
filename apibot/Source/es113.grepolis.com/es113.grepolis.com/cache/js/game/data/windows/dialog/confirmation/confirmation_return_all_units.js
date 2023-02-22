define('data/windows/dialog/confirmation/confirmation_return_all_units', function(require) {
    'use strict';

    var ConfirmationWindowData = require_legacy('ConfirmationWindowData');

    /**
     * Class which represents data to create confirmation window for
     * "return all units"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationReturnAllUnits(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
        this.has_selected_cities = props.has_selected_cities;
    }

    ConfirmationReturnAllUnits.inherits(ConfirmationWindowData);

    ConfirmationReturnAllUnits.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationReturnAllUnits.prototype.getQuestion = function() {
        return this.l10n.question(this.has_selected_cities);
    };

    ConfirmationReturnAllUnits.prototype.getType = function() {
        return 'return_all_units';
    };

    ConfirmationReturnAllUnits.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationReturnAllUnits;
});