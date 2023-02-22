/*global DM, _ */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            unit_info: {
                tooltips: {
                    regular_ground: {
                        headline: _("Regular land unit"),
                        bullets: [
                            _("Participates in land battles.")
                        ],
                        transport_ship_bullet: _("Needs transport ships to attack and support cities on other islands.")

                    },
                    mythological_ground: {
                        headline: _("Mythical land unit"),
                        bullets: [
                            _("Participates in land battles."),
                            _("Can only support cities which worship the same god.")
                        ],
                        transport_ship_bullet: _("Needs transport ships to attack and support cities on other islands.")

                    },
                    regular_naval: {
                        headline: _("Regular naval unit"),
                        bullets: [
                            _("Participates in naval battles.")
                        ]
                    },
                    mythological_naval: {
                        headline: _("Mythical naval unit"),
                        bullets: [
                            _("Participates in naval battles."),
                            _("Can only support cities which worship the same god.")
                        ]
                    },
                    function_off: {
                        headline: _("Offensive"),
                        bullets: [
                            _("Should be used for attacking cities.")
                        ]
                    },
                    function_def: {
                        headline: _("Defensive"),
                        bullets: [
                            _("Should be used for defending or supporting cities.")
                        ]
                    },
                    flying: {
                        headline: _("Flying"),
                        bullets: [
                            _("Needs no transport ships to attack and support cities on other islands."),
                            _("Ignores enemy naval units when attacking.")
                        ]
                    },
                    wall_destruct: {
                        headline: _("Wall destruction"),
                        bullets: [
                            _("Reduces the level of the enemy city wall when attacking."),
                            _("If the attack is successful the wall is damaged permanently.")
                        ]
                    },
                    self_destruct: {
                        headline: _("Self destruction"),
                        bullets: [
                            _("Can only be used for defense and support."),
                            _("Will destroy itself and one enemy regular naval unit with an attack value."),
                            _("Self destruction is activated at the end of the naval battle and only if needed.")
                        ]
                    },
                    colonization: {
                        headline: _("Colonization"),
                        bullets: [
                            _("Can found a new city on a free island spot."),
                            _("Can conquer enemy cities if the respective technology is researched.")
                        ]
                    },
                    ship_capacity: {
                        headline: _("Transport"),
                        bullets: [
                            _("Can take units across oceans to attack and support."),
                            _("Take part in the naval battles but do not cause damage."),
                            _("When transport ship faces naval defenses without any escort they will be instantly destroyed killing all units they are carrying.")
                        ]
                    }
                }
            }
        }
    });
}());