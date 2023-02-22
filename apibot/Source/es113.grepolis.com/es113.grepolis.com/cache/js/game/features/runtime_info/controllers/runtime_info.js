/* global MM, GameData */

define('features/runtime_info/controllers/runtime_info', function() {
    'use strict';

    var GameControllers = require_legacy('GameControllers');
    var View = require('features/runtime_info/views/runtime_info');
    var GameDataUnits = require('data/units');
    var GameEvents = require('data/events');
    var RUNTIME_MODIFIER = require('enums/runtime_info');
    var GameDataResearches = require_legacy('GameDataResearches');
    var GameDataAdditionalModifiers = require('data/additional_modifiers');
    var features = require('data/features');
    var OlympusHelper = require('helpers/olympus');

    return GameControllers.TabController.extend({

        initialize: function(options) {
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        registerEventListeners: function() {
            this.stopObservingEvent(GameEvents.town.town_switch);
            this.observeEvent(GameEvents.town.town_switch, function() {
                this.runtime_simulator.reFetchTargetData();
            }.bind(this));

            this.stopListening();
            this.runtime_simulator.onDistanceChange(this, this.reRender.bind(this));
        },

        renderPage: function() {
            this.modifiers = [];
            this.runtime_simulator = this.getModel('runtime_simulator');
            this.initializeView();
        },

        reRender: function() {
            this.initializeView();
        },

        initializeView: function() {
            this.view = new View({
                controller: this,
                el: this.$el
            });
            this.registerEventListeners();
        },

        /**
         * get all land units ids
         * @returns {array} unit_ids
         */
        getLandUnits: function() {
            var land_units = GameDataUnits.groundUnitIds();

            // remove militia from result
            land_units.shift();

            // add current selected hero as first item
            var hero_picker = this.getComponent('hero_picker');

            if (hero_picker) {
                var hero = hero_picker.getCurrentlySelectedHeroAndLevel(),
                    name = hero.name;

                if (name.length > 0) {
                    land_units.unshift(name);
                }
            }

            return land_units;
        },

        /**
         * get all naval unit ids
         * @returns {array} unit_ids
         */
        getNavalUnits: function() {
            return GameDataUnits.navalUnitIds();
        },

        getUnits: function() {
            var land_units = this.getLandUnits(),
                naval_units = this.getNavalUnits(),
                units = this.isCurrentTownOnSameIsland() ? land_units.concat(naval_units) : naval_units.concat(this.getFlyingUnits()),
                enabled_units = GameDataUnits.getEnabledUnits();

            return units.filter(function(unit_id) {
                return enabled_units[unit_id] !== undefined && enabled_units[unit_id] !== null;
            });
        },

        getFlyingUnits: function() {
            return GameDataUnits.flyingUnitIds();
        },

        getRuntimes: function() {
            var naval_units = this.getNavalUnits(),
                land_units = this.getLandUnits(),
                runtimes = {
                    ground_units: {},
                    naval_units: {}
                },
                general_modifier = this.getGeneralModifier(),
                ground_modifier = this.getGroundModifier(),
                naval_modifier = this.getNavalModifer(),
                distance = this.runtime_simulator.getDistance(),
                delay_to_other_island_extra_time = GameDataUnits.getUnitsRuntimeSetupTime();

            us.each(land_units, function(unit_id) {
                var speed = GameDataUnits.getUnitSpeed(unit_id) * general_modifier * ground_modifier,
                    duration = Math.floor((distance * 50 / speed) + delay_to_other_island_extra_time);

                if (duration < 1) {
                    duration = 1;
                }
                runtimes.ground_units[unit_id] = duration;
            });

            us.each(naval_units, function(unit_id) {
                var speed = GameDataUnits.getUnitSpeed(unit_id) * general_modifier;

                if (unit_id === 'colonize_ship' && this.modifiers.indexOf(RUNTIME_MODIFIER.SET_SAIL) > -1) {
                    speed *= (naval_modifier + GameDataResearches.getBonusColonyShipSpeed());
                } else {
                    speed *= naval_modifier;
                }

                var duration = Math.floor((distance * 50 / speed) + delay_to_other_island_extra_time);

                if (duration < 1) {
                    duration = 1;
                }
                runtimes.naval_units[unit_id] = duration;
            }.bind(this));

            if (this.isPortalCommand()) {
                runtimes.ground_units = this.addPortalTravelTimeToUnits(runtimes.ground_units);
                runtimes.naval_units = this.addPortalTravelTimeToUnits(runtimes.naval_units);
            }

            return runtimes;
        },

        getFinalRuntimes: function() {
            var runtimes = this.getRuntimes(),
                final_runtimes = $.extend({}, runtimes.ground_units, runtimes.naval_units);

            if (features.battlepointVillagesEnabled() && this.isAttackspot()) {
                return this.getAttackspotRuntimes();
            }

            return final_runtimes;
        },

        /**
         * returns the factor for unit_movement_boost and hero atalanta
         * @see GeneralModifications.php getUnitSpeedModification
         * @returns {number} a float > 1
         */
        getGeneralModifier: function() {
            var base_speed_factor = 1;
            if (this.modifiers.indexOf(RUNTIME_MODIFIER.UNIT_MOVEMENT) > -1) {
                base_speed_factor += 0.01 * GameDataAdditionalModifiers.getDefaultUnitMovementBoost();
            }
            var hero_picker = this.getComponent('hero_picker');

            if (hero_picker) {
                var hero = hero_picker.getCurrentlySelectedHeroAndLevel(),
                    name = hero.name,
                    level = hero.level;

                if (name === RUNTIME_MODIFIER.ATALANTA) {
                    // TODO get from Hero Model
                    var hero_data = GameData.heroes[RUNTIME_MODIFIER.ATALANTA].description_args[1];
                    base_speed_factor += hero_data.value + (level * hero_data.level_mod);
                }
            }

            return base_speed_factor;
        },

        getGroundModifier: function() {
            var base_speed_factor = 1;

            if (this.modifiers.indexOf(RUNTIME_MODIFIER.METEOROLOGY) > -1) {
                base_speed_factor += GameDataResearches.getBonusMeteorologySpeed();
            }

            return base_speed_factor;
        },

        getNavalModifer: function() {
            var base_speed_factor = 1;

            if (this.modifiers.indexOf(RUNTIME_MODIFIER.CARTOGRAPHY) > -1) {
                base_speed_factor += GameDataResearches.getBonusCartographySpeed();
            }

            if (this.modifiers.indexOf(RUNTIME_MODIFIER.LIGHTHOUSE) > -1) {
                base_speed_factor += GameDataAdditionalModifiers.getBonusLighthouseSpeed();
            }

            return base_speed_factor;
        },

        setModifiers: function(modifier) {
            var indexOfModifier = this.modifiers.indexOf(modifier);
            if (indexOfModifier > -1) {
                this.modifiers.splice(indexOfModifier, 1);
            } else {
                this.modifiers.push(modifier);
            }
        },

        hasModifierActive: function(modifier) {
            return this.modifiers.indexOf(modifier) > -1;
        },

        isCurrentTownOnSameIsland: function() {
            var current_town = this.getCollection('towns').getCurrentTown();

            if (current_town.getIslandX() === this.runtime_simulator.getIslandX() && current_town.getIslandY() === this.runtime_simulator.getIslandY()) {
                return true;
            }

            return false;
        },

        getTownName: function() {
            return this.runtime_simulator.getName();
        },

        getTownLink: function() {
            return this.runtime_simulator.getTownLink();
        },

        isAttackspot: function() {
            return this.runtime_simulator.isAttackspot();
        },

        getFirstTenAttackspotRuntimes: function(level, attack_spot_times) {
            var runtime = attack_spot_times[0];

            if (level >= 0 && level < attack_spot_times.length) {
                runtime = attack_spot_times[level];
            }

            return runtime;
        },

        /*
         * The first 10 fights need to have a fixed runtime depending on the number completed.
         * After the 10th fight, the runtime will be calculated like this: (int) (50 * 50 / unit-speed) + 300
         */
        getAttackspotRuntimes: function() {
            var land_units = this.getLandUnits(),
                naval_units = this.getNavalUnits(),
                runtimes = {},
                general_modifier = this.getGeneralModifier(),
                naval_modifier = this.getNavalModifer(),
                ground_modifier = this.getGroundModifier(),
                // since the player_attack_spot model is BPV only we don´t request it via data_frontend_bridge, since unfeatured versions won´t have it
                attack_spot_model = MM.getModelByNameAndPlayerId('PlayerAttackSpot'),
                attack_spot_level = attack_spot_model.getLevel(),
                first_attack_spot_runtimes = attack_spot_model.getFirstAttackSpotRuntimes(),
                is_first_ten_fights = attack_spot_level < 10; // level is 0-indexed

            us.each(land_units, function(unit_id) {
                var speed = GameDataUnits.getUnitSpeed(unit_id) * general_modifier * ground_modifier,
                    duration = Math.floor((50 * 50 / speed) + 300);

                if (is_first_ten_fights) {
                    duration = this.getFirstTenAttackspotRuntimes(attack_spot_level, first_attack_spot_runtimes);
                }

                if (duration < 1) {
                    duration = 1;
                }

                runtimes[unit_id] = duration;
            }.bind(this));

            us.each(naval_units, function(unit_id) {
                var speed = GameDataUnits.getUnitSpeed(unit_id) * general_modifier;

                if (unit_id === 'colonize_ship' && this.modifiers.indexOf(RUNTIME_MODIFIER.SET_SAIL) > -1) {
                    speed *= (naval_modifier + GameDataResearches.getBonusColonyShipSpeed());
                } else {
                    speed *= naval_modifier;
                }

                var duration = Math.floor((50 * 50 / speed) + 300);

                if (is_first_ten_fights) {
                    duration = this.getFirstTenAttackspotRuntimes(attack_spot_level, first_attack_spot_runtimes);
                }

                if (duration < 1) {
                    duration = 1;
                }

                runtimes[unit_id] = duration;
            }.bind(this));

            return runtimes;
        },

        isPortalCommand: function() {
            return this.getWindowModel().getArguments().is_portal_command;
        },

        getOlympusPortalTravelTime: function() {
            var olympus = OlympusHelper.getOlympusModel();

            if (olympus) {
                return olympus.getPortalTempleTravelHours() * 3600;
            }

            return 0;
        },

        addPortalTravelTimeToUnits: function(units) {
            var portal_travel_time = this.getOlympusPortalTravelTime(),
                result = {};

            Object.keys(units).forEach(function(id) {
                result[id] = units[id] + portal_travel_time;
            });

            return result;
        },

        getOlympusTempleLink: function() {
            var temple = OlympusHelper.getOlympusTemple(),
                temple_data = {
                    id: temple.getId(),
                    x: temple.getIslandX(),
                    y: temple.getIslandY(),
                    name: temple.getName()
                };

            return OlympusHelper.generateTempleLink(temple_data).outerHTML;
        }
    });
});