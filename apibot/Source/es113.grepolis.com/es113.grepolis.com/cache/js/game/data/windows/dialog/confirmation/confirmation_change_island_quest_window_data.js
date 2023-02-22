/*globals ConfirmationWindowData, GameData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "change island quest window"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationChangeIslandQuestWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationChangeIslandQuestWindowData.inherits(ConfirmationWindowData);

    ConfirmationChangeIslandQuestWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationChangeIslandQuestWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameData.island_quests.exchange_quest_cost);
    };

    ConfirmationChangeIslandQuestWindowData.prototype.getType = function() {
        return 'change_island_quest';
    };

    ConfirmationChangeIslandQuestWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationChangeIslandQuestWindowData = ConfirmationChangeIslandQuestWindowData;
}());