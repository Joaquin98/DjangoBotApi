/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "removing town group"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationDeleteTownGroupWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationDeleteTownGroupWindowData.inherits(ConfirmationWindowData);

    ConfirmationDeleteTownGroupWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationDeleteTownGroupWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.town_group_name);
    };

    ConfirmationDeleteTownGroupWindowData.prototype.getType = function() {
        return 'delete_town_group';
    };

    ConfirmationDeleteTownGroupWindowData.prototype.hasCheckbox = function() {
        return false;
    };

    window.ConfirmationDeleteTownGroupWindowData = ConfirmationDeleteTownGroupWindowData;
}());