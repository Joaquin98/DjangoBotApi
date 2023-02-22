/* global MM, us, DM */
define('helpers/units_tooltip_helper', function() {
    'use strict';

    var GameDataUnits = require('data/units');

    /**
     * The units tooltip helper class returns all units data for a specific town.
     * Depending on the city (if it is a player city or foreign city) different data will be shown.
     * In case of a player city, the own units which belong to the town will be returned, together with units supporting that town (own and foreign units).
     * In case of a foreign city, the own supporting units will be returned.
     */

    return {

        CURRENT_TOWN_ID: 'current_town_id',
        NUMBER_OF_UNITS_IN_ROW: 5,

        createHtmlListElementsForUnitsInTown: function(town_id) {
            var town_collection = MM.getOnlyCollectionByName('Town'),
                units_collection = MM.getTownAgnosticCollectionsByName('Units'),
                takeover = MM.getOnlyCollectionByName('Takeover'),
                units_in_current_town = [],
                units_translations = DM.getl10n('map_tooltips').units_tooltips,
                units_tooltip = '';

            units_collection.forEach(function(collection) {
                if (collection.segmentation_keys[0] === this.CURRENT_TOWN_ID) {
                    units_in_current_town = collection.fragments[town_id];
                }
            }.bind(this));

            if (town_collection.isMyOwnTown(town_id)) {
                units_tooltip += this.getUnitsForSpecificTownHtml('city_units', units_in_current_town, town_collection, units_translations, town_id);

                if (takeover.getAllTakeOverForSpecificTown(town_id).length) {
                    units_tooltip += this.getUnitsForSpecificTownHtml('player_town_conquered', units_in_current_town, town_collection, units_translations, town_id);
                } else {
                    units_tooltip += this.getUnitsForSpecificTownHtml('support', units_in_current_town, town_collection, units_translations, town_id);
                }

            } else if (takeover.getAllTakeOverForSpecificTown(town_id).length) {
                units_tooltip += this.getUnitsForSpecificTownHtml('city_units', units_in_current_town, town_collection, units_translations, town_id);
                units_tooltip += this.getUnitsForSpecificTownHtml('player_takeover_foreign', units_in_current_town, town_collection, units_translations, town_id);
            } else {
                units_tooltip += this.getUnitsForSpecificTownHtml('your_support', units_in_current_town, town_collection, units_translations, town_id);
            }

            return units_tooltip;
        },

        /**
         * Get Unit tooltip Html for different types of units (support foreign city, support player city, units in player city)
         *
         * @param {string} type
         * @param {object} units_in_current_town
         * @param {object} town_collection
         * @param {object} units_translation
         * @param {number} town_id
         * @returns {string}
         */
        getUnitsForSpecificTownHtml: function(type, units_in_current_town, town_collection, units_translation, town_id) {
            var tooltip_data = [],
                headline = '',
                tooltip = '';

            switch (type) {
                case 'city_units':
                    tooltip_data = this.getDataForStationedUnitsInTown(town_id, units_in_current_town);
                    headline = units_translation.city_units;
                    break;
                case 'support':
                    tooltip_data = this.getDataForSupportingUnits('support', units_in_current_town, town_collection, town_id);
                    headline = units_translation.support;
                    break;
                case 'player_town_conquered':
                    tooltip_data = this.getDataForSupportingUnits('siege_support', units_in_current_town, town_collection, town_id);
                    headline = units_translation.siege_support;
                    break;
                case 'player_takeover_foreign':
                    tooltip_data = this.getDataForSupportingUnits('player_takeover_foreign', units_in_current_town, town_collection, town_id);
                    headline = units_translation.support;
                    break;
                case 'your_support':
                    tooltip_data = this.getDataForSupportingUnits('your_support', units_in_current_town, town_collection, town_id);
                    headline = units_translation.your_support;
                    break;
                default:
                    break;

            }

            if (tooltip_data.length) {
                tooltip += '<div class="units_tooltip_infos">' +
                    '<span>' + headline + '</span>' +
                    '<span class="divider_line_units_tooltips"></span>' +
                    '</div>';

                tooltip += this.createUnitsHtml(tooltip_data, tooltip);
            }

            return tooltip;
        },

        /**
         * Returns array data for stationed units in player town
         *
         * @param {number} town_id
         * @param {object} units_in_current_town
         * @returns {array}
         */
        getDataForStationedUnitsInTown: function(town_id, units_in_current_town) {
            var own_units_data = this.getStationedUnitsInTownDataFromCollection(units_in_current_town, town_id);
            var tooltip_data = [];

            if (own_units_data) {
                var own_units = own_units_data.getUnits();
                us.each(own_units, function(amount, unit) {
                    tooltip_data.push(this.getHtmlForOneUnitElement(unit, amount));
                }.bind(this));
            }

            return tooltip_data;
        },

        /**
         * Returns object data (containing data for stationed units in player town) from collection
         *
         * @param {object} units_in_current_town
         * @param {number} town_id
         * @returns {object}
         */
        getStationedUnitsInTownDataFromCollection: function(units_in_current_town, town_id) {
            return units_in_current_town.findWhere({
                current_town_id: town_id,
                home_town_id: town_id
            });
        },

        /**
         * Returns an array containing supporting units data
         *
         * @param {string} type_of_support
         * @param {object} units_in_current_town
         * @param {object} town_collection
         * @param {number} town_id
         * @returns {array}
         */
        getDataForSupportingUnits: function(type_of_support, units_in_current_town, town_collection, town_id) {
            var support = [],
                tooltip_data = [];

            switch (type_of_support) {
                case 'support':
                    support = this.getDataForSupportingUnitsInPlayerTownFromCollection(units_in_current_town, town_collection);
                    break;
                case 'siege_support':
                    // FALLTHROUGH
                case 'player_takeover_foreign':
                    support = this.getDataForSupportingUnitsInConqueredTownFromCollection(town_id, units_in_current_town);
                    break;
                case 'your_support':
                    support = this.getDataForSupportingUnitsInOtherTownFromCollection(units_in_current_town, town_collection);
                    break;
                default:
                    break;
            }

            if (support.length) {
                var all_support_units = {};

                for (var i = 0; i < support.length; i++) {
                    var support_units = support[i].getUnits();

                    us.each(support_units, function(amount, unit) {
                        if (all_support_units[unit]) {
                            all_support_units[unit] = all_support_units[unit] + amount;
                        } else {
                            all_support_units[unit] = amount;
                        }
                    }.bind(this));
                }

                var unit_types = GameDataUnits.getUnitTypeOrder();

                us.each(unit_types, function(unit) {
                    if (all_support_units[unit]) {
                        tooltip_data.push(this.getHtmlForOneUnitElement(unit, all_support_units[unit]));
                    }
                }.bind(this));
            }

            return tooltip_data;
        },

        /**
         * Returns an array of all supporting units in player town (from other players and from own player)
         *
         * @param {object} units_in_current_town
         * @param {object} town_collection
         * @returns {array}
         */
        getDataForSupportingUnitsInPlayerTownFromCollection: function(units_in_current_town, town_collection) {
            return units_in_current_town ? units_in_current_town.filter(function(model) {
                return town_collection.isMyOwnTown(model.getCurrentTownId()) &&
                    model.getCurrentTownId() !== model.getOriginTownId();
            }) : [];
        },

        /**
         * Returns an array of all own supporting units in specific foreign town
         *
         * @param {object} units_in_current_town
         * @param {object} town_collection
         * @returns {array}
         */
        getDataForSupportingUnitsInOtherTownFromCollection: function(units_in_current_town, town_collection) {
            return units_in_current_town ? units_in_current_town.filter(function(model) {
                return town_collection.isMyOwnTown(model.getOriginTownId());
            }) : [];
        },

        /**
         * Returns an array of all supporting units in conquered town
         *
         * @param {number} town_id
         * @param {object} units_in_current_town
         * @returns {array}
         */
        getDataForSupportingUnitsInConqueredTownFromCollection: function(town_id, units_in_current_town) {
            return units_in_current_town ? units_in_current_town.filter(function(model) {
                return model.getCurrentTownId() === town_id &&
                    model.getOriginTownId() !== town_id;
            }) : [];
        },

        getHtmlForOneUnitElement: function(unit_type, unit_amount) {
            return us.template(DM.getTemplate('map', 'units_in_town_element'), {
                unit_type: unit_type,
                amount: unit_amount
            });
        },

        createUnitsHtml: function(units_tooltip_data) {
            var tooltip = '';
            units_tooltip_data.forEach(function(unit, unit_index) {
                if (unit_index === 0) {
                    tooltip += '<table><tr>';
                } else if (unit_index % this.NUMBER_OF_UNITS_IN_ROW === 0) {
                    tooltip += '</tr><tr>';
                }

                tooltip += unit;

                if (unit_index === units_tooltip_data.length - 1) {
                    tooltip += '</tr></table>';
                }
            }.bind(this));

            return tooltip;
        }
    };
});