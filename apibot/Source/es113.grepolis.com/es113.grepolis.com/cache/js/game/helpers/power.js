/* globals Game, GameModels, us, MM, GameData, GameDataPowers, ITowns */

(function() {
    "use strict";

    var HelperPower = {
        /**
         * Casts spell on the town
         *
         * @param {String} power_id
         * @param {Integer} [town_id]
         * @param {Object|Function} [callbacks]
         *
         * @deprecated used only in mass recruit
         */
        cast: function(power_id, town_id, callbacks) {
            var power = this.createCastedPowerModel(power_id, town_id || Game.townId);

            power.cast(callbacks);
        },

        /**
         * Returns casted power model with supplied power_id if present (casted) on town with town_id
         *
         * @param {String} power_id
         * @param {Number} [town_id]
         *
         * @return {window.GameModels.CastedPowers}
         */
        getCastedPower: function(power_id, town_id) {
            return us.filter(MM.getModels().CastedPowers, function(power) {
                return power.getTownId() === town_id && power.getPowerId() === power_id;
            }, this)[0];
        },

        /**
         * Creates new casted power model
         *
         * @param power_id
         * @param town_id
         *
         * @returns {window.GameModels.CastedPowers}
         */
        createCastedPowerModel: function(power_id, town_id) {
            var power = new GameModels.CastedPowers({
                power_id: power_id,
                town_id: town_id
            });
            // Set configuration object to default from GameData.powers
            power.setDefaultPowerConfiguration();
            return power;
        },

        /**
         * Get all spells that can be preselected for an attack
         */
        getPossiblePreselectedAttackSpellsForAllGods: function() {
            var PowerEnums = require('enums/powers'),
                preselectable_spells = [
                    PowerEnums.STRENGTH_OF_HEROES,
                    PowerEnums.CAP_OF_INVISIBILITY,
                    PowerEnums.FAIR_WIND,
                    PowerEnums.RESURRECTION,
                    PowerEnums.EFFORT_OF_THE_HUNTRESS,
                    PowerEnums.ARES_ARMY,
                    PowerEnums.BLOODLUST
                ];

            return preselectable_spells.filter(function(power_id) {
                return GameDataPowers.getPowerIsEnabled(power_id);
            });
        },

        getPossiblePreselectedAttackSpellsForAvailableGods: function() {
            var god_model = MM.getModels().PlayerGods[Game.player_id],
                preselectable_spells_data = [];

            this.getPossiblePreselectedAttackSpellsForAllGods().forEach(function(power_id) {
                var power_data = GameData.powers[power_id],
                    has_god = god_model.hasGod(power_data.god_id),
                    is_castable = has_god ?
                    god_model.getCurrentFavorForGod(power_data.god_id) >= power_data.favor :
                    false,
                    disabled_css = has_god ? '' : ' disabled not_selectable',
                    not_selectable_css = has_god && !is_castable ? ' disabled' : '',
                    power_data_object = {
                        value: power_id,
                        css_classes: ' ' + power_id + disabled_css + not_selectable_css
                    };
                preselectable_spells_data.push(power_data_object);
            });

            return preselectable_spells_data;
        }
    };

    window.HelperPower = HelperPower;
}());