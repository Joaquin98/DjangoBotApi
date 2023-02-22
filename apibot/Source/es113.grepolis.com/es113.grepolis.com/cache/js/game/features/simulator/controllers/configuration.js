/* globals GameData, JSON */

define('features/simulator/controllers/configuration', function() {
    'use strict';

    var GameControllers = require_legacy('GameControllers'),
        SimulatorConfigurationView = require('features/simulator/views/configuration'),
        Categories = require('features/simulator/enums/categories'),
        SubWindowHelper = require('helpers/sub_window'),
        Features = require('data/features'),
        OlympusHelper = require('helpers/olympus');

    return GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            GameControllers.TabController.prototype.initialize.apply(this, arguments);

            this.categories = Object.keys(options.categories);
            this.categories_mapping = options.categories;
            this.power_configurations = options.power_configurations;
            this.onBeforeCloseCallback = options.onBeforeCloseCallback;
            this.options = {};
            this.configuration = {
                attacker: {},
                defender: {}
            };
            this.$subwindow = null;

            if (Features.isOlympusEndgameActive()) {
                var olympus = OlympusHelper.getOlympusModel();

                this.temples_alliance_limit = {
                    small: olympus.getSmallTemplesAllianceLimit(),
                    large: olympus.getLargeTemplesAllianceLimit()
                };
            }
        },

        renderPage: function() {
            SubWindowHelper.renderSubWindow(this.$el, 'simulator_configuration');

            if (!this.$subwindow) {
                this.$subwindow = this.$el.find('.sub_window .content');
                this.categories.forEach(this.generateOptionsForCategory.bind(this));

                this.view = new SimulatorConfigurationView({
                    el: this.$subwindow,
                    controller: this
                });

                this.resetConfiguration();
            } else {
                this.$subwindow.appendTo(this.$el.find('.sub_window .content'));
            }
        },

        handleCloseButtonClick: function() {
            this.onBeforeCloseCallback();
            this.$subwindow.detach();
            this.$el.find('.simulator_configuration').remove();
        },

        getConfigurationOptionCountForAttacker: function() {
            return this.getConfigurationOptionCount(this.configuration.attacker);
        },

        getConfigurationOptionCountForDefender: function() {
            return this.getConfigurationOptionCount(this.configuration.defender);
        },

        getConfigurationOptionCount: function(configuration) {
            var result = 0;

            for (var id in configuration) {
                if (configuration.hasOwnProperty(id)) {
                    result += configuration[id].length;
                }
            }

            return result;
        },

        getSimulatorConfiguration: function() {
            var i, side, category,
                final_configuration = JSON.parse(JSON.stringify(this.configuration));

            for (side in this.configuration) {
                if (!this.configuration.hasOwnProperty(side)) {
                    continue;
                }

                for (category in this.configuration[side]) {
                    if (!this.configuration[side].hasOwnProperty(category)) {
                        continue;
                    }

                    this.configuration[side][category].forEach(function(option) {
                        if (option.count > 1) {
                            for (i = 2; i <= option.count; i++) {
                                final_configuration[side][category].push(option);
                            }
                        }
                    });
                }
            }

            return final_configuration;
        },

        getOptionConfigurationIndex: function(options, category, id, permutation) {
            var option_index = null;

            options[category].find(function(option, index) {
                var is_match = option.power_id === id;

                if (is_match && typeof permutation !== 'undefined') {
                    is_match = option.permutation === permutation;
                }

                if (is_match) {
                    option_index = index;
                }

                return is_match;
            });

            return option_index;
        },

        addOptionToConfiguration: function(side, category, option) {
            var id = option.power_id,
                permutation = option.permutation;

            if (!this.configuration[side][category]) {
                this.configuration[side][category] = [];
            }

            if (!this.getOptionConfigurationIndex(this.configuration[side], category, id, permutation)) {
                this.configuration[side][category].push(JSON.parse(JSON.stringify(option)));
            }
        },

        removeOptionFromConfiguration: function(side, category, option) {
            var index = this.getOptionConfigurationIndex(
                this.configuration[side],
                category,
                option.power_id,
                option.permutation
            );

            if (index !== null) {
                this.configuration[side][category].splice(index, 1);
            }
        },

        /**
         * Increase or decrease a configuration property's value
         */
        adjustOptionPropertyValue: function(side, category, option, property_name, change) {
            var index = this.getOptionConfigurationIndex(
                this.configuration[side],
                category,
                option.power_id,
                option.permutation
            );

            if (index === null) {
                return;
            }

            this.setPropertyValueOnIndex(
                side,
                category,
                option,
                index,
                property_name,
                this.configuration[side][category][index].configuration[property_name] + change
            );
        },

        /**
         * Set a configuration property to a new value
         */
        setOptionPropertyValue: function(side, category, option, property_name, new_value) {
            var index = this.getOptionConfigurationIndex(
                this.configuration[side],
                category,
                option.power_id,
                option.permutation
            );

            if (index === null) {
                return;
            }

            this.setPropertyValueOnIndex(side, category, option, index, property_name, new_value);
        },

        /**
         * Set a configuration property value for a known power index
         * Verifies that the value is valid (within min/max)
         */
        setPropertyValueOnIndex: function(side, category, option, index, property_name, new_value) {
            var invalid_value = option.properties.some(function(property) {
                if (property.name === property_name && (new_value > property.max || new_value < property.min)) {
                    return true;
                }
            });

            if (invalid_value) {
                return;
            }

            this.configuration[side][category][index].configuration[property_name] = new_value;
            this.view.renderOptionToCategory(side, category, this.configuration[side][category][index], true);
        },

        /**
         * Increase or decrease the number of times a given option (power) should be counted
         */
        adjustOptionCount: function(side, category, option, change) {
            var index = this.getOptionConfigurationIndex(
                this.configuration[side],
                category,
                option.power_id,
                option.permutation
            );

            if (index === null) {
                return;
            }

            var new_count = this.configuration[side][category][index].count + change;

            if (new_count < 1 || new_count > this.configuration[side][category][index].max_count) {
                return;
            }

            this.configuration[side][category][index].count = new_count;
            this.view.renderOptionToCategory(side, category, this.configuration[side][category][index], true);
        },

        getPowerConfiguration: function(power_id) {
            return this.power_configurations.find(function(power_configuration) {
                return power_configuration.id === power_id;
            });
        },

        addPermutationsToOptions: function(category, power_id, permutations, power_configuration) {
            permutations.forEach(function(permutation, index) {
                this.options[category].push({
                    power_id: power_id,
                    configuration: permutation,
                    permutation: index,
                    size: permutation.size,
                    max_count: category === Categories.TEMPLES ?
                        this.temples_alliance_limit[permutation.size] : 1,
                    attacker: power_configuration ? power_configuration.attacker : true,
                    defender: power_configuration ? power_configuration.defender : true,
                    count: 1, // number of times this power will be sent to BE
                    properties: power_configuration ? power_configuration.properties : []
                });
            }.bind(this));
        },

        generateOptionsForCategory: function(category) {
            var category_power = this.categories_mapping[category],
                power_configuration, permutations, gd_power,
                attacker, defender;

            if (!this.options[category]) {
                this.options[category] = [];
            }

            for (var id in category_power) {
                if (!category_power.hasOwnProperty(id)) {
                    continue;
                }

                var power_id = category_power[id];

                power_configuration = this.getPowerConfiguration(power_id);
                permutations = power_configuration ? power_configuration.permutations : [];

                if (category !== Categories.POWERS && category !== Categories.SPELLS && permutations.length > 0) {
                    this.addPermutationsToOptions(category, power_id, permutations, power_configuration);

                    continue;
                }

                gd_power = GameData.powers[power_id];
                attacker = true;
                defender = true;

                if (power_configuration) {
                    attacker = power_configuration.attacker;
                    defender = power_configuration.defender;
                }

                this.options[category].push({
                    power_id: power_id,
                    count: 1,
                    max_count: 1,
                    // clone the meta_defaults object, to avoid altering the original
                    configuration: gd_power && gd_power.meta_defaults ?
                        JSON.parse(JSON.stringify(gd_power.meta_defaults)) :
                        {},
                    attacker: attacker,
                    defender: defender,
                    properties: power_configuration ? power_configuration.properties : {}
                });
            }
        },

        getCategories: function() {
            return this.categories;
        },

        getCategoryOptions: function(category) {
            return this.options[category];
        },

        hasAvailableCategoryOptions: function(side, category) {
            return this.getAvailableCategoryOptionsBySide(side, category).length !== 0;
        },

        getAvailableCategoryOptionsBySide: function(side, category) {
            return this.getCategoryOptions(category).filter(function(option) {
                if (!option[side]) {
                    return false;
                }

                return !(this.configuration[side][category] &&
                    this.configuration[side][category].find(this.compareOptions.bind(this, option)));
            }.bind(this));
        },

        compareOptions: function(option_a, option_b) {
            return option_a.power_id === option_b.power_id &&
                option_a.permutation === option_b.permutation;
        },

        getOption: function(category, id, permutation) {
            var index = this.getOptionConfigurationIndex(this.options, category, id, permutation);
            return Object.assign({}, this.options[category][index]);
        },

        resetConfiguration: function() {
            this.configuration = {
                attacker: {},
                defender: {}
            };

            this.view.render();
        }
    });
});