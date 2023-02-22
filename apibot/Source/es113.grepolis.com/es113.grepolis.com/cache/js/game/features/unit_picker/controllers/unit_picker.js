/* global DM, us */
define('features/unit_picker/controllers/unit_picker', function() {
    'use strict';

    var GameControllers = require_legacy('GameControllers');
    var View = require('features/unit_picker/views/unit_picker');
    var GameDataUnits = require('data/units');
    var GameDataHeroes = require('data/heroes');
    var HEROES = require('enums/heroes');
    var GameEvents = require('data/events');
    var Game = require_legacy('Game');
    var default_settings = {
        unit_icon_class: 'unit_icon40x40',
        unit_tooltip_class: '',
        town_type: null,
        line_break_before: '',
        show_laurels: false,
        show_expand_button: false,
        show_simulator_button: false,
        show_runtime_simulator: false,
        show_runtimes: false,
        show_max_booty: false,
        show_needed_transport: false
    };

    /**
     * TODO:
     *  Simulator, Expand and Runtime buttons incomplete
     *  Hero picker incomplete (see attack spot for reference)
     *  @see GP-21535
     */
    return GameControllers.BaseController.extend({
        initialize: function(options) {
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
            this.settings = us.extend({}, default_settings, options.settings);
            this.data = options.data;
            this.l10n = DM.getl10n('attack_spot');
            this.select_all_toggle_state = false;
            this.cm_context = {
                main: this.cm_context.main,
                sub: 'unit_picker'
            };
        },

        renderPage: function() {
            this.initializeView();

            if (typeof this.settings.onRenderComplete === 'function') {
                this.settings.onRenderComplete();
            }
        },

        initializeView: function() {
            this.$el = this.parent_controller.$el.find(this.settings.el_selector);

            this.view = new View({
                controller: this,
                el: this.$el
            });

            this.registerEventListeners();
        },

        registerEventListeners: function() {
            this.stopListening();

            if (this.getUnitsCollection()) {
                this.getUnitsCollection().onUnitsChange(this, this.renderPage.bind(this));
            }
            this.stopObservingEvent(GameEvents.town.town_switch);
            this.observeEvent(GameEvents.town.town_switch, function() {
                this.renderPage();
                this.publishEvent(GameEvents.unit_picker.town_switch_rerender);
            }.bind(this));

            var player_gods = this.getModel('player_gods');
            if (player_gods) {
                player_gods.onGodChange(this, this.renderPage.bind(this));
            }

            var hero_collection = this.getHeroCollection();
            if (hero_collection) {
                hero_collection.onHeroLevelChange(this, this.view.registerUnitTooltips.bind(this.view));
                hero_collection.onCuredAtChange(this, this.renderPage.bind(this));
            }
        },

        getActionButton: function() {
            if (typeof this.settings.action_button_getter === 'function') {
                return this.settings.action_button_getter();
            }
        },

        getViewSettings: function() {
            return this.settings;
        },

        getHeroCollection: function() {
            return this.getCollection('player_heroes');
        },

        getHero: function() {
            if (!this.settings.show_hero) {
                return;
            }

            return this.getHeroCollection().getHeroOfTown(Game.townId);
        },

        getUnitsCollection: function() {
            return this.getCollection('units');
        },

        getUnits: function() {
            var units = {},
                naval = {},
                units_sorted = {},
                hero = this.getHero(),
                filter_ground_units = this.settings.filter_units ? this.settings.filter_units.ground_units : [],
                filter_naval_units = this.settings.filter_units ? this.settings.filter_units.naval_units : [];

            if (!this.hasUnitsCollection()) {
                return this.data.units;
            }

            if (this.settings.show_land_units) {
                units = this.getUnitsCollection().getUnitsInTown().getLandUnits();
                units = us.omit(units, filter_ground_units);
            }

            if (this.settings.show_naval_units) {
                naval = this.getUnitsCollection().getUnitsInTown().getNavalUnits();
                naval = us.omit(naval, filter_naval_units);
            }

            us.extend(naval, units);

            units_sorted = this.getUnitsSorted(naval);

            if (hero) {
                units_sorted[hero.getId()] = 'hero'; // done to identify the hero in the template
            }

            us.each(units_sorted, function(amount, unit_id) {
                units_sorted[unit_id] = {
                    amount: amount,
                    game_unit: unit_id
                };
            });

            return units_sorted;
        },

        /**
         * return the pre-calculated runtimes for all units
         */
        getUnitRuntimes: function() {
            return typeof this.settings.runtimes === 'function' ? this.settings.runtimes() : this.settings.runtimes;
        },

        /**
         * return runtime of the slowest selected unit
         */
        getSlowestUnitRuntime: function() {
            var runtimes = this.getUnitRuntimes(),
                selected_units = this.getSelectedUnits(),
                merged_runtimes = {};

            return GameDataUnits.getSlowestRuntime(
                selected_units,
                Object.assign(merged_runtimes, runtimes.ground_units, runtimes.naval_units),
                null,
                this.settings.town_type
            );
        },

        getUnitsSorted: function(units) {
            var result = {};

            GameDataUnits.allUnitIds().forEach(function(unit_id) {
                if (units.hasOwnProperty(unit_id)) {
                    result[unit_id] = units[unit_id];
                }
            });

            return result;
        },

        getOwnUnits: function() {
            return this.getUnits();
        },

        /**
         * return hash with all values from the input_boxes != 0
         * { sword: 33, slinger: 13 }
         *
         * the way the hero gets added to this has differs for the attack action and the simulator (defined by APIs)
         * simulator: the hero will be added as <heroId>: <level>
         * non-simulator: the hero will be added as 'heroes': <heroId>
         *
         * @param {boolean} simulator
         * @returns {Object} units
         */
        getSelectedUnits: function(simulator) {
            var input_boxes = this.getComponents('input_boxes'),
                result = {};

            for (var unit_type in input_boxes) {
                if (input_boxes.hasOwnProperty(unit_type)) {
                    var val = input_boxes[unit_type].getValue();
                    if (val !== 0) {
                        result[unit_type] = val;
                    }
                }
            }

            // Add 1 hero or not, depending on the selection
            var cbx_include_hero = this.getComponent('cbx_include_hero');
            if (GameDataHeroes.areHeroesEnabled() && cbx_include_hero && cbx_include_hero.isChecked()) {
                if (simulator) {
                    result[this.getHeroId()] = this.getHeroLevel();
                } else {
                    result.heroes = this.getHeroId();
                }
            }

            return result;
        },

        getTotalAmountOfSelectedUnits: function(units) {
            units = units || this.getSelectedUnits();

            var total = 0;

            us.each(units, function(amount) {
                total += amount;
            });
            return total;
        },

        getAvailableUnitsFor: function(unit_type) {
            var units = this.getUnits();
            return units[unit_type].amount;
        },

        getNPCUnits: function() {
            return this.settings.npc_units;
        },

        /*

         Capacity related

         */

        getCapaInfo: function() {
            return GameDataUnits.calculateCapacity(Game.townId, this.getSelectedUnits());
        },

        getTotalCapacity: function() {
            return this.getCapaInfo().total_capacity;
        },

        getNeededCapacity: function() {
            return this.getCapaInfo().needed_capacity;
        },

        getSlowBoatsNeeded: function() {
            return this.getCapaInfo().slow_boats_needed;
        },

        getFastBoatsNeeded: function() {
            return this.getCapaInfo().fast_boats_needed;
        },

        getMaxBooty: function() {
            var total_capacity = 0,
                booty_factor = 1;

            us.each(this.getSelectedUnits(), function(amount, unit_id) {
                var unit = GameDataUnits.getUnit(unit_id);

                if (unit && amount > 0 && unit.hasOwnProperty('booty')) {
                    total_capacity += unit.booty * amount;
                }
            });

            var cbx_include_hero = this.getComponent('cbx_include_hero');
            if (GameDataHeroes.areHeroesEnabled() && cbx_include_hero && cbx_include_hero.isChecked()) {
                var hero_id = this.getHeroId();

                if (hero_id) {
                    var hero = GameDataHeroes.getHero(hero_id);
                    total_capacity += hero.booty;

                    if (hero_id === HEROES.IASON) {
                        booty_factor += hero.getCalculatedBonusForLevel();
                    }
                }
            }

            return Math.floor(total_capacity * booty_factor);
        },

        // Button states / Management
        getSelectAllToggleState: function() {
            return this.select_all_toggle_state;
        },

        setSelectAllToggleState: function(state) {
            this.select_all_toggle_state = state;
        },

        saveInputBoxData: function(input_box_data) {
            if (this.settings.window_model) {
                this.settings.window_model.setData('input_boxes', this.getSelectedUnits());
            }
        },

        loadInputBoxData: function() {
            var result = {};

            if (this.settings.window_model) {
                us.extend(result, this.settings.window_model.getData('input_boxes'));
            }

            if (this.settings.freeze_units) {
                us.extend(result, this.settings.freeze_units);
            }

            return result;
        },

        isUnitFrozen: function(unit_id) {
            return this.settings.freeze_units && (typeof this.settings.freeze_units[unit_id] !== 'undefined');
        },

        isHeroHealthyInTown: function() {
            return this.getHeroCollection().isStateHealthyHeroInTown();
        },

        isHeroAttacking: function() {
            var hero = this.getHero();

            return hero && hero.attacksTown();
        },

        isHeroInjured: function() {
            var hero = this.getHero();

            return hero && hero.isInjured();
        },

        isHeroBeingAssigned: function() {
            var hero = this.getHeroCollection().getHeroBeingAssignedToTown(Game.townId);

            return hero && hero.isOnTheWayToTown(Game.townId);
        },

        getHeroId: function() {
            return this.getHero().getId();
        },

        getHeroLevel: function() {
            return this.getHero().getLevel();
        },

        getUnitsPopulationInfo: function() {
            var units = this.getUnitsCollection().getUnitsInTown().getLandUnits();

            for (var unit in units) {
                if (units.hasOwnProperty(unit)) {
                    units[unit] = GameDataUnits.getUnit(unit).population;
                }
            }

            return units;
        },

        getAttackSpotId: function() {
            return this.getModel('player_attack_spot').getTownId();
        },

        getUnitSkin: function() {
            return this.settings.unit_skin;
        },

        hasUnitsCollection: function() {
            return typeof this.getUnitsCollection() !== 'undefined';
        }
    });
});