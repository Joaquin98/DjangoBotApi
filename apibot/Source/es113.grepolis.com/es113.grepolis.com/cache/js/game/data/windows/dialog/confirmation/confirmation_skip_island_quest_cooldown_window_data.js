/*globals ConfirmationWindowData, GameData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * 'skip_island_quest_cooldown'
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationSkipIslandQuestCooldownWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationSkipIslandQuestCooldownWindowData.inherits(ConfirmationWindowData);

    ConfirmationSkipIslandQuestCooldownWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationSkipIslandQuestCooldownWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameData.island_quests.skip_cooldown_cost);
    };

    ConfirmationSkipIslandQuestCooldownWindowData.prototype.getType = function() {
        return 'skip_island_quest_cooldown';
    };

    ConfirmationSkipIslandQuestCooldownWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationSkipIslandQuestCooldownWindowData = ConfirmationSkipIslandQuestCooldownWindowData;
}());