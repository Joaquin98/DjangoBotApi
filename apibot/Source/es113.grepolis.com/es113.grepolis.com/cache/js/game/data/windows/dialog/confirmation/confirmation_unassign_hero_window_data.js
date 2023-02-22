/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "unassigning hero"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationUnassignHeroWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationUnassignHeroWindowData.inherits(ConfirmationWindowData);

    ConfirmationUnassignHeroWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationUnassignHeroWindowData.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationUnassignHeroWindowData.prototype.getType = function() {
        return 'unassign_hero';
    };

    window.ConfirmationUnassignHeroWindowData = ConfirmationUnassignHeroWindowData;
}());