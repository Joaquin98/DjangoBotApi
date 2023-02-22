/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "unassigning hero from attack window"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationUnassignHeroFromAttackWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationUnassignHeroFromAttackWindowData.inherits(ConfirmationWindowData);

    ConfirmationUnassignHeroFromAttackWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationUnassignHeroFromAttackWindowData.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationUnassignHeroFromAttackWindowData.prototype.getType = function() {
        return 'unassign_hero_from_attack';
    };

    window.ConfirmationUnassignHeroFromAttackWindowData = ConfirmationUnassignHeroFromAttackWindowData;
}());