/*globals MM, Game */
define('helpers/commands', function() {

    //TODO the counting functions and listener registration functions could be moved to the town_agnostic_collection as a feature
    var commands_bulk_update_incoming = false;

    return {
        isCommandsBulkUpdateIncoming: function() {
            return commands_bulk_update_incoming;
        },

        setCommandsBulkUpdateIncoming: function(is_bulk_update_incoming) {
            commands_bulk_update_incoming = is_bulk_update_incoming;
        },

        isPlayersTown: function(town_id) {
            var town_id_list = this.getTownIds();
            return town_id_list.indexOf(town_id) > -1;
        },

        getTownIds: function() {
            var town_id_list = MM.getModelByNameAndPlayerId('TownIdList', Game.player_id);
            return town_id_list.getTownIds();
        },

        getTotalCountOfIncomingAttacks: function(changed_town_id, new_attack_count) {
            var incoming_attack_count = 0,
                town_agnostic_movements_units = MM.getFirstTownAgnosticCollectionByName('MovementsUnits'),
                town_ids = this.getTownIds();

            us.each(town_ids, function(town_id) {
                if (new_attack_count && town_id === changed_town_id) {
                    // Use an updated attack count when available,
                    // as the result from getIncomingAttacksCount will be outdated
                    incoming_attack_count += new_attack_count;

                    return;
                }

                incoming_attack_count += town_agnostic_movements_units
                    .getFragment(town_id)
                    .getIncomingAttacksCount(town_id);
            }.bind(this));

            return incoming_attack_count;
        },
        /**
         * Register listener for 'add' event on the movements units collection for all fragements
         * @param listener
         * @param callback
         */
        onAddMovementsUnitsInAllTownsChange: function(listener, callback) {
            var town_agnostic_movements_units = MM.getFirstTownAgnosticCollectionByName('MovementsUnits'),
                town_ids = this.getTownIds();
            us.each(town_ids, function(town_id) {
                town_agnostic_movements_units.getFragment(town_id).onAdd(listener, callback);
            }.bind(this));
        },

        /**
         * Register listener for 'remove' event on the movements units collection for all fragements
         * @param listener
         * @param callback
         */
        onRemoveMovementsUnitsInAllTownsChange: function(listener, callback) {
            var town_agnostic_movements_units = MM.getFirstTownAgnosticCollectionByName('MovementsUnits'),
                town_ids = this.getTownIds();
            us.each(town_ids, function(town_id) {
                town_agnostic_movements_units.getFragment(town_id).onRemove(listener, callback);
            }.bind(this));
        },

        /**
         * Register listener for 'add remove change' events on the movements colonization collection for all fragements
         * @param listener
         * @param callback
         */
        onAnyColonizationInAllTownsChange: function(listener, callback) {
            var town_agnostic_movements_colonization = MM.getFirstTownAgnosticCollectionByName('MovementsColonization'),
                town_ids = this.getTownIds();
            us.each(town_ids, function(town_id) {
                town_agnostic_movements_colonization.getFragment(town_id).onMovementsColonizationsChange(listener, callback);
            }.bind(this));
        },

        getOnGoingColonizationsCount: function() {
            var ongoing_colonizations = 0,
                town_agnostic_movements_colonization = MM.getFirstTownAgnosticCollectionByName('MovementsColonization'),
                town_ids = this.getTownIds();
            us.each(town_ids, function(town_id) {
                ongoing_colonizations += town_agnostic_movements_colonization.getFragment(town_id).models.length;
            }.bind(this));

            return ongoing_colonizations;
        },

        getTownIdsForAllRevoltsOfGivenType: function(isArising) {
            var town_agnostic_revolts = MM.getFirstTownAgnosticCollectionByName('MovementsRevoltDefender'),
                town_ids = this.getTownIds(),
                town_ids_with_revolt = [];

            us.each(town_ids, function(town_id) {
                var revolts = town_agnostic_revolts.getFragment(town_id).getRevolts(isArising);
                if (revolts.length) {
                    town_ids_with_revolt.push(town_id);
                }
            }.bind(this));

            return town_ids_with_revolt;
        },

        getTownIdsForAllIncomingConquerors: function() {
            var town_ids = this.getTownIds(),
                incoming_conquerors = MM.getOnlyCollectionByName('Takeover'),
                town_ids_with_incoming_conquerors = [];

            us.each(town_ids, function(town_id) {
                var conqueror = incoming_conquerors.getIncomingTakeOverForSpecificTown(town_id);
                if (conqueror !== null) {
                    town_ids_with_incoming_conquerors.push(town_id);
                }
            }.bind(this));

            return town_ids_with_incoming_conquerors;
        }
    };
});