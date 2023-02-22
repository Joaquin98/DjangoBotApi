/*globals ConfirmationWindowData, GameDataHeroes */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "buy hero slot for gold"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyHeroSlotWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationBuyHeroSlotWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuyHeroSlotWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyHeroSlotWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameDataHeroes.getSlotCost());
    };

    ConfirmationBuyHeroSlotWindowData.prototype.getType = function() {
        return 'buy_hero_slot';
    };

    ConfirmationBuyHeroSlotWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuyHeroSlotWindowData = ConfirmationBuyHeroSlotWindowData;
}());