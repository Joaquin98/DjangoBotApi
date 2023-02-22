/* globals MM, DM, Timestamp, Game */
define('helpers/movement_tooltip_helper', function() {
    'use strict';

    var DateHelper = require('helpers/date');
    var COMMAND_TYPES = require('enums/command_types');
    var FeatureHelper = require('data/features');
    var OlympusHelper = require('helpers/olympus');
    var MovementTooltipHelper = {

        /**
         * This is the only function that should be used from the outside, it will generate html-tooltips for ongoing movements that can be appended
         * to the existing tooltip table
         * @param town - the town for which a tooltip should be constructed
         * @returns {*} list of rendered html tooltip rows
         */
        createMovementTooltipData: function(town) {
            var tooltips = [],
                tooltip_revolts_list = this.createHtmlListElementsForRevoltMovements(town.id),
                tooltip_attacks_element = this.createHtmlListElementsForAttacks(town.id),
                tooltip_support_element = this.createHtmlListElementsForSupports(town.id);

            if (tooltip_revolts_list) {
                tooltips = tooltips.concat(tooltip_revolts_list);
            }

            if (tooltip_attacks_element) {
                tooltips.push(tooltip_attacks_element);
            }

            if (tooltip_support_element) {
                tooltips.push(tooltip_support_element);
            }

            return tooltips;
        },

        createHtmlListElementsForRevoltMovements: function(town_id) {
            var takeover_collection = MM.getOnlyCollectionByName("Takeover");
            var tooltip_rows = [];
            if (!FeatureHelper.isOldCommandVersion() && !takeover_collection.hasRevoltMovements(town_id)) {
                return false;
            }

            if (FeatureHelper.isOldCommandVersion() && !takeover_collection.hasTakeOverMovements(town_id)) {
                return false;
            }

            var movement_tooltip_data = this.constructMovementTooltipDataForTown(town_id);

            movement_tooltip_data.forEach(function(element) {
                var movement_tooltip = us.template(DM.getTemplate('map', 'troop_movement_element'), {
                    icon_type: element.icon_type,
                    text: element.text
                });
                tooltip_rows.push(movement_tooltip);
            });

            return tooltip_rows;
        },

        getAttackTooltipText: function(town_id, attack) {
            var town_collection = MM.getOnlyCollectionByName("Town"),
                takeover_collection = MM.getOnlyCollectionByName("Takeover"),
                map_tooltips_translations = DM.getl10n('map_tooltips');

            if (FeatureHelper.isOldCommandVersion() && takeover_collection.hasTakeOverMovements(town_id)) {
                return map_tooltips_translations.incoming_attacks_on_siege(attack.getIncoming());
            }
            if (town_collection.isMyOwnTown(town_id)) {
                return map_tooltips_translations.incoming_attacks(attack.getIncoming());
            }

            return map_tooltips_translations.outgoing_attacks(attack.getIncoming());
        },

        getSupportTooltipText: function(town_id, support) {
            var town_collection = MM.getOnlyCollectionByName("Town"),
                takeover_collection = MM.getOnlyCollectionByName("Takeover"),
                map_tooltips_translations = DM.getl10n('map_tooltips');

            if (FeatureHelper.isOldCommandVersion() && takeover_collection.hasTakeOverMovements(town_id)) {
                return map_tooltips_translations.incoming_supports_on_siege(support.getIncoming());
            }
            if (town_collection.isMyOwnTown(town_id)) {
                return map_tooltips_translations.incoming_support(support.getIncoming());
            }

            return map_tooltips_translations.outgoing_support(support.getIncoming());
        },

        createHtmlListElementsForAttacks: function(town_id) {
            var attack_collection = MM.getOnlyCollectionByName("Attack"),
                town_collection = MM.getOnlyCollectionByName("Town"),
                attack = attack_collection.getIncomingAttacksForTown(town_id);

            if (attack && attack.getIncoming() > 0) {
                var attack_icon = town_collection.isMyOwnTown(town_id) ? COMMAND_TYPES.ATTACK_INDICATOR : COMMAND_TYPES.ATTACK_OUTGOING,
                    attack_text = this.getAttackTooltipText(town_id, attack),
                    movement_tooltip = us.template(DM.getTemplate('map', 'troop_movement_element'), {
                        icon_type: attack_icon,
                        text: attack_text
                    });
                return movement_tooltip;
            }
        },

        createHtmlListElementsForSupports: function(town_id) {
            var support_collection = MM.getOnlyCollectionByName("Support"),
                support = support_collection.getIncomingSupportsForTown(town_id);
            if (support && support.getIncoming() > 0) {
                var support_icon = COMMAND_TYPES.SUPPORT,
                    support_text = this.getSupportTooltipText(town_id, support),
                    movement_tooltip = us.template(DM.getTemplate('map', 'troop_movement_element'), {
                        icon_type: support_icon,
                        text: support_text
                    });
                return movement_tooltip;
            }
        },

        constructMovementTooltipDataForTown: function(town_id) {
            var takeover_collection = MM.getOnlyCollectionByName("Takeover");
            var tooltip_data_list = [];

            //TODO reduce code duplication here
            var incoming_revolt_movements = takeover_collection.getAllIncomingRevoltsForSpecificTown(town_id);
            if (incoming_revolt_movements.length > 0) {
                tooltip_data_list = tooltip_data_list.concat(this.constructRevoltTooltipData(incoming_revolt_movements, true));
            }

            var outgoing_revolt_movements = takeover_collection.getAllOutgoingRevoltsForSpecificTown(town_id);
            if (outgoing_revolt_movements.length > 0) {
                tooltip_data_list = tooltip_data_list.concat(this.constructRevoltTooltipData(outgoing_revolt_movements, false));
            }

            var incoming_take_over_movement = takeover_collection.getIncomingTakeOverForSpecificTown(town_id);
            if (incoming_take_over_movement) {
                tooltip_data_list.push(this.constructTakeOverTooltipData(incoming_take_over_movement, true));
            }

            var outgoing_take_over_movement = takeover_collection.getOutgoingTakeOverForSpecificTown(town_id);
            if (outgoing_take_over_movement) {
                tooltip_data_list.push(this.constructTakeOverTooltipData(outgoing_take_over_movement, false));
            }

            return tooltip_data_list;
        },

        constructRevoltTooltipData: function(revolts, is_incoming) {
            var direction = is_incoming ? "incoming" : "outgoing";

            var arising_revolt_count = 0;
            var arising_revolt = {};
            var running_revolt_count = 0;
            var running_revolt = {};

            var l10n_tooltips = DM.getl10n('map_tooltips');
            var element_list = [];
            var arising_revolt_data = {};
            var running_revolt_data = {};
            var origin_town_data = {};
            var destination_town_data = {};
            var player_name = '';

            var is_olympus_endgame = FeatureHelper.isOlympusEndgameActive();
            var is_own_revolt = false;
            var translation;

            revolts.forEach(function(movement) {
                // Arising
                if (Timestamp.now() < movement.getCommand().started_at) {
                    arising_revolt = movement;
                    arising_revolt_count++;
                }
                // Running
                if (Timestamp.now() >= movement.getCommand().started_at && Timestamp.now() < movement.getCommand().arrival_at) {
                    running_revolt = movement;
                    running_revolt_count++;
                }
            });

            if (arising_revolt_count > 0) {
                arising_revolt_data.icon_type = COMMAND_TYPES.REVOLT_ARISING;

                if (arising_revolt_count === 1) {
                    origin_town_data = arising_revolt.getOriginTown();
                    destination_town_data = arising_revolt.getDestinationTown();
                    is_own_revolt = Game.player_id === origin_town_data.player_id ||
                        Game.alliance_id === origin_town_data.alliance_id;

                    if (is_olympus_endgame && !is_own_revolt && OlympusHelper.isOlympusTemple(destination_town_data.id)) {
                        translation = is_incoming ?
                            l10n_tooltips.revolts[direction].arising :
                            l10n_tooltips.revolts[direction].arising_temple;

                        arising_revolt_data.text = translation(
                            this.getHumanReadableRevoltTime(arising_revolt), origin_town_data.alliance_name);
                    } else {
                        player_name = is_incoming ? origin_town_data.player_name : destination_town_data.player_name;
                        arising_revolt_data.text = l10n_tooltips.revolts[direction].arising(
                            this.getHumanReadableRevoltTime(arising_revolt), player_name);
                    }
                }
                if (arising_revolt_count > 1) {
                    arising_revolt_data.text = l10n_tooltips.revolts[direction].arising_multiple(arising_revolt_count);
                }
                element_list.push(arising_revolt_data);
            }

            if (running_revolt_count > 0) {
                running_revolt_data.icon_type = COMMAND_TYPES.REVOLT_RUNNING;
                if (running_revolt_count === 1) {
                    origin_town_data = running_revolt.getOriginTown();
                    destination_town_data = running_revolt.getDestinationTown();
                    is_own_revolt = Game.player_id === origin_town_data.player_id;

                    if (is_olympus_endgame && !is_own_revolt && OlympusHelper.isOlympusTemple(destination_town_data.id)) {
                        translation = is_incoming ?
                            l10n_tooltips.revolts[direction].running :
                            l10n_tooltips.revolts[direction].running_temple;

                        running_revolt_data.text = translation(
                            this.getHumanReadableRevoltTime(running_revolt), origin_town_data.alliance_name);
                    } else {
                        player_name = is_incoming ? origin_town_data.player_name : destination_town_data.player_name;
                        running_revolt_data.text = l10n_tooltips.revolts[direction].running(
                            this.getHumanReadableRevoltTime(running_revolt), player_name, is_own_revolt);
                    }

                }
                if (running_revolt_count > 1) {
                    running_revolt_data.text = l10n_tooltips.revolts[direction].running_multiple(running_revolt_count);
                }
                element_list.push(running_revolt_data);
            }

            return element_list;
        },

        constructTakeOverTooltipData: function(take_over, is_incoming) {
            var tooltip_function = is_incoming ? "enemy_siege" : "own_siege";
            var take_over_tooltip_data = {};
            var l10n_tooltips = DM.getl10n('map_tooltips');
            var player_name = is_incoming ? take_over.getOriginTown().player_name : "own_player_name";
            var take_over_time = DateHelper.readableSeconds(take_over.getCommand().arrival_at - Timestamp.now());

            take_over_tooltip_data.icon_type = COMMAND_TYPES.SIEGE;
            if (is_incoming) {
                take_over_tooltip_data.text = l10n_tooltips[tooltip_function](player_name, take_over_time);
            } else {
                take_over_tooltip_data.text = l10n_tooltips[tooltip_function](take_over_time);
            }
            return take_over_tooltip_data;
        },

        getHumanReadableRevoltTime: function(revolt_movement) {
            var movement_time = 0;
            if (revolt_movement.getCommand().started_at - Timestamp.now() < 0) {
                movement_time = revolt_movement.getCommand().arrival_at - Timestamp.now();
            } else {
                movement_time = revolt_movement.getCommand().started_at - Timestamp.now();
            }
            return DateHelper.readableSeconds(movement_time);
        }
    };

    return MovementTooltipHelper;
});