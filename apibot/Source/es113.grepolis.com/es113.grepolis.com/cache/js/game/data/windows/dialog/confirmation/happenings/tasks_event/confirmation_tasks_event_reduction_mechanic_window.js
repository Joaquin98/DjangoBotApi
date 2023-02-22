/*globals ConfirmationWindowData */

define('data/windows/dialog/confirmation/happenings/tasks_event/confirmation_tasks_event_reduction_mechanic_window',
    function() {
        'use strict';

        /**
         * Class which represents data to create confirmation window for
         * "reduction task amount"
         *
         * @param props {Object}
         * @param onConfirm {Function}   confirmation button callback
         * @param onCancel {Function}    cancel button callback
         *
         * @see ConfirmationWindowData class for details about all methods
         */
        function ConfirmationTaskReduceAmountWindow(props) {
            ConfirmationWindowData.prototype.constructor.apply(this, arguments);

            this.l10n = require('helpers/benefit').getl10nPremiumForSkin(this.l10n, this.getType());
        }

        ConfirmationTaskReduceAmountWindow.inherits(ConfirmationWindowData);

        ConfirmationTaskReduceAmountWindow.prototype.getTitle = function() {
            return this.l10n.window_title;
        };

        ConfirmationTaskReduceAmountWindow.prototype.getQuestion = function() {
            return this.l10n.question(this._getCost(), this._getPercentage());
        };

        ConfirmationTaskReduceAmountWindow.prototype._getCost = function() {
            return this.props.cost;
        };

        ConfirmationTaskReduceAmountWindow.prototype._getPercentage = function() {
            return this.props.percentage;
        };

        ConfirmationTaskReduceAmountWindow.prototype.getType = function() {
            return 'tasks_event_reduction_mechanic';
        };

        ConfirmationTaskReduceAmountWindow.prototype.hasCheckbox = function() {
            return true;
        };

        return ConfirmationTaskReduceAmountWindow;
    }
);