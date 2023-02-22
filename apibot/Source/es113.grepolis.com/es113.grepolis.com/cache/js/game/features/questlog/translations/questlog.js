/* globals DM, __ */
define("features/questlog/translations/questlog", function() {
    "use strict";

    DM.loadData({
        l10n: {
            questlog: {
                window_title: _("Quest Log"),
                tabs: [],
                rewards: _("Rewards"),
                cancel_quest: _("Cancel the quest"),
                close: __("quest|Close"),
                take_reward: _("Collect reward"),
                take_quest: _("Accept the quest"),
                already_accepted: _("Already accepted"),
                start_quest: _("Continue"),
                quest_finished: s(_("Quest %1 completed"), "</br>"),
                your_tasks: _("Quests list"),
                lub_or: _("or"),
                island: _("Island"),

                categories: {
                    default_category: _("Open Quests"),
                    island_quests: _("Island Quests")
                },

                awaiting_decision: _("Awaiting decision"),
                quest_expiration: _("Expiration"),
                quest_progress_caption: _("Quest progress"),
                next_island_quest_in: _("Next island quest in:")
            },

            questlog_icon: {
                begin_text: _("Open Questlog"),
                new_quests: _("new quests"),
                complete_quests: _("complete quests")
            },

            quest_progress: {
                window_title: _("Foundation reward")
            }
        }
    });
});