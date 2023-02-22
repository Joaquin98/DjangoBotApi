define('data/windows/dialog/confirmation/confirmation_ares_sacrifice_not_enough_population', function(require) {
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
    function ConfirmationAresSacrificeNotEnoughPopulation(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationAresSacrificeNotEnoughPopulation.inherits(ConfirmationWindowData);

    ConfirmationAresSacrificeNotEnoughPopulation.prototype.getTitle = function() {
        return '';
    };

    ConfirmationAresSacrificeNotEnoughPopulation.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationAresSacrificeNotEnoughPopulation.prototype.getType = function() {
        return 'ares_sacrifice_not_enough_population';
    };

    ConfirmationAresSacrificeNotEnoughPopulation.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationAresSacrificeNotEnoughPopulation;
});