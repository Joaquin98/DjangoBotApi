/*global _, s, DM, ngettext*/

(function() {
    'use strict';

    DM.loadData({
        l10n: {
            map_tooltips: {
                revolts: {
                    outgoing: {
                        arising: function(time_until_revolt_starts) {
                            return s(_("Your revolt will begin in %1"), time_until_revolt_starts);
                        },
                        arising_multiple: function(amount_of_revolts) {
                            return s(ngettext("%1 revolt will begin soon!", "%1 revolts will begin soon!", amount_of_revolts), amount_of_revolts);
                        },
                        arising_temple: function(time_until_revolt_starts, player_name) {
                            return s(_("Your revolt started by %1 will begin in %2"), player_name, time_until_revolt_starts);
                        },
                        running: function(time_until_revolt_ends) {
                            return s(_("Your revolt will end in %1"), time_until_revolt_ends);
                        },
                        running_multiple: function(amount_of_revolts) {
                            return s(ngettext("%1 revolt is going on!", "%1 revolts are going on!", amount_of_revolts), amount_of_revolts);
                        },
                        running_temple: function(time_until_revolt_ends, player_name) {
                            return s(_("Your revolt started by %1 will end in %2"), player_name, time_until_revolt_ends);
                        }
                    },
                    incoming: {
                        arising: function(time_until_revolt_starts, player_name) {
                            return s(_("%1's revolt will begin in %2"), player_name, time_until_revolt_starts);
                        },
                        arising_multiple: function(amount_of_revolts) {
                            return s(ngettext("%1 revolt will begin soon!", "%1 revolts will begin soon!", amount_of_revolts), amount_of_revolts);
                        },
                        running: function(time_until_revolt_ends, player_name) {
                            return s(_("%1's revolt will end in %2"), player_name, time_until_revolt_ends);
                        },
                        running_multiple: function(amount_of_revolts) {
                            return s(ngettext("%1 revolt is going on!", "%1 revolts are going on!", amount_of_revolts), amount_of_revolts);
                        }
                    }
                },
                own_siege: function(time_until_siege_ends) {
                    return s(_("You take control in %1"), time_until_siege_ends);
                },
                incoming_attacks_on_siege: function(amount_of_siege_attacks) {
                    return s(ngettext("%1 incoming attack on the siege!", "%1 incoming attacks on the siege!", amount_of_siege_attacks),
                        amount_of_siege_attacks);
                },
                incoming_supports_on_siege: function(amount_of_siege_support) {
                    return s(ngettext("%1 incoming support for the siege!", "%1 incoming support for the siege!", amount_of_siege_support),
                        amount_of_siege_support);
                },
                enemy_siege: function(player_name, time_until_siege_ends) {
                    return s(_("%1 takes control in %2"), player_name, time_until_siege_ends);
                },
                incoming_attacks: function(amount_of_attacks) {
                    return s(ngettext("%1 incoming attack!", "%1 incoming attacks", amount_of_attacks), amount_of_attacks);
                },
                outgoing_attacks: function(amount_of_attacks) {
                    return s(ngettext("%1 incoming attack from you!", "%1 incoming attacks from you", amount_of_attacks), amount_of_attacks);
                },
                incoming_support: function(amount_of_supports) {
                    return s(ngettext("%1 incoming support!", "%1 incoming supports", amount_of_supports), amount_of_supports);
                },
                outgoing_support: function(amount_of_supports) {
                    return s(ngettext("%1 incoming support from you!", "%1 incoming supports from you", amount_of_supports), amount_of_supports);
                },
                units_tooltips: {
                    your_support: _("Your Support"),
                    city_units: _("City Units"),
                    support: _("Support"),
                    siege_support: _("Siege Support")

                }
            }
        }
    });
}());