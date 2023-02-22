/*globals _, s, ngettext, DM, __ */
(function() {
    "use strict";

    DM.loadData({
        l10n: {
            construction_queue: {
                free: __("Zero Cost|Free"),
                level: _("Level"),
                upgrade_time: _("Upgrade time:"),
                demolishing_time: _("Demolition time:"),
                recruitment_time: _("Recruitment time:"),
                research_time: _("Research time:"),
                completion: _("Completion:"),
                complete_now: _("Complete now!"),
                complete_now_for_free: _("Complete now for free!"),
                dependencies_not_fulfilled: _("Required for instant completion:"),
                units_instant_buy_blocked: _("<b>Hint:</b> You can not complete recruitment orders 5 minutes before an incoming attack."),

                advisor_banner: {
                    curator: _("Activate the administrator for 14 days and unlock 5 construction slots!"),
                    activate: function(cost) {
                        return s(_("Activate %1"), cost);
                    }
                },
                tooltips: {
                    cancel_order: {
                        building: function(demolish) {
                            return demolish ?
                                _("Cancel demolition order") :
                                _("Cancel the construction order");
                        },

                        research: _("Cancel research order"),
                        unit: _("Cancel unit order") // TODO missing translation
                    },

                    time_reduct: {
                        building: function(cost, demolish) {
                            return demolish ?
                                s(ngettext("You can cut the demolition time in half for %1 gold.", "You can cut the demolition time in half for %1 gold.", cost), cost) :
                                s(ngettext("You can cut the construction time in half for %1 gold.", "You can cut the construction time in half for %1 gold.", cost), cost);
                        },
                        research: function(cost) {
                            return s(ngettext("You can cut the research time in half for %1 gold.", "You can cut the research time in half for %1 gold.", cost), cost);
                        },
                        unit: function(cost) {
                            return s(ngettext("You can cut the recruitment time in half for %1 gold.", "You can cut the recruitment time in half for %1 gold.", cost), cost);
                        }
                    },
                    completion: {
                        building: function(human_date) {
                            return s(_("Completion %1"), human_date);
                        },
                        research: function(human_date) {
                            return s(_("Completion %1"), human_date);
                        },
                        unit: function(human_date) {
                            return s(_("Completion %1"), human_date);
                        }
                    },
                    instant_buy: {
                        building: function(cost) {
                            return s(ngettext("Finish instantly for %1 gold.", "Finish instantly for %1 gold.", cost), cost);
                        },
                        research: function(cost) {
                            return s(ngettext("Finish instantly for %1 gold.", "Finish instantly for %1 gold.", cost), cost);
                        },
                        unit: function(cost) {
                            return s(ngettext("Finish instantly for %1 gold.", "Finish instantly for %1 gold.", cost), cost);
                        }
                    }
                }
            }
        }
    });
}());