/* global DM, readableUnixTimestamp, BuildingPlace */
define('features/unit_picker/views/unit_picker', function(require) {
    'use strict';

    var BaseView = window.GameViews.BaseView;
    var TooltipFactory = require('factories/tooltip_factory');
    var DateHelper = require('helpers/date');
    var Timestamp = require('misc/timestamp');
    var RuntimeFactory = require('features/runtime_info/factories/runtime_info');

    return BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);
            this.l10n = this.controller.getl10n();
            this.settings = this.controller.getViewSettings();
            this.render();
        },

        render: function() {
            var units = this.controller.getUnits();

            var options = {
                l10n: this.l10n,
                units: units // could be default
            };

            us.extend(options, this.settings);
            this.renderTemplate(this.$el, 'unit_picker', options);

            this.unregisterComponents();
            this.registerCapacityBar();
            this.registerViewComponents();
            this.registerInputBoxes();
            this.registerUnitTooltips();
            this.updateRuntimes();
            this.registerTimerArrivalTime();
            this.registerUnitPopulationTooltip();
        },

        reRender: function() {
            this.render();
        },

        registerCapacityBar: function() {
            if (!this.settings.show_capacity_bar) {
                return;
            }

            this.registerComponent('pb_capacity', this.$el.find('.js-capacity').singleProgressbar({
                extra: 0,
                min: 0,
                max: 0,
                value: 0,
                animate: false,
                caption: this.l10n.capacity
            }));
        },

        updateCapacityBar: function() {
            var bar = this.getComponent('pb_capacity');

            if (bar && this.settings.show_capacity_bar) {
                bar.setExtra(this.controller.getNeededCapacity());
                bar.setMax(this.controller.getTotalCapacity());
            }
        },

        /**
         * registers simulator button, runtime buttonm, expand button (attack spot) and
         * the images and tooltips.
         *
         * The 'attack' main action button is registered in the parent view / controller
         * and can be accessed from here via 'this.controller.getActionButton()'
         */
        registerViewComponents: function() {
            // attack / action button is part of the surrounding view
            this.registerComponent('btn_simulate', this.$el.find('.btn_simulate').button({
                caption: '',
                tooltips: [{
                        title: this.l10n.tooltips.simulator
                    },
                    null
                ]
            }).on('btn:click', function() {
                var sim_units = {
                    'att': this.controller.getSelectedUnits(true),
                    'def': this.controller.getNPCUnits()
                };

                BuildingPlace.insertUnitsToSimulator(sim_units);
            }.bind(this)));

            this.registerComponent('btn_runtime', this.$el.find('.btn_runtime').button({
                caption: '',
                icon: true,
                icon_position: 'left',
                icon_type: 'runtime',
                tooltips: [{
                        title: this.l10n.tooltips.travel_time
                    },
                    null
                ]
            }).on('btn:click', function() {
                var town_id = this.controller.getAttackSpotId();
                RuntimeFactory.openWindow(town_id);
            }.bind(this)));

            this.registerComponent('btn_expand_units', this.$el.find('.btn_expand_units').button({
                tooltips: [{
                        title: this.l10n.tooltips.expand_units
                    },
                    null
                ]
            }).on('btn:click', this._expandButtonClickHandler.bind(this)));

            this.$el.find('.select_all').on('click', this._selectAllClickHandler.bind(this));
            this.$el.find('.units_box .unit').on('click', this._unitImageClickHandler.bind(this));
            this.$el.find('.info_icon').tooltip(this.l10n.tooltips.info_icon);
        },

        registerInputBoxes: function() {
            var old_data = this.controller.loadInputBoxData() || {};
            this.unregisterComponents('input_boxes');

            us.each(this.controller.getOwnUnits(), function(data, unit_name) {
                this.registerComponent(unit_name, this.$el.find('.txt_unit[data-unit_id="' + unit_name + '"]').textbox({
                    type: 'number',
                    value: old_data[unit_name] || 0,
                    min: 0,
                    max: data.amount,
                    disabled: this.controller.isUnitFrozen(unit_name),
                    live: true,
                    hidden_zero: true,
                    show_initial_message: false,
                    visible: this.settings.show_zero_amount_units ? true : data.amount !== 0
                }).on('txt:change:value', function() {
                    this.updateRuntimes();
                    this.controller.saveInputBoxData();
                    this.updateActionButton();
                    this.updateCapacityBar();
                    this.updateNeededTransport();
                    this.updateMaxBooty();
                }.bind(this)), 'input_boxes');
            }.bind(this));

            if (!this.settings.show_hero) {
                return;
            }

            this.registerComponent('cbx_include_hero', this.$el.find('.cbx_include_hero').checkbox({
                caption: '',
                checked: false,
                disabled: !this.controller.isHeroHealthyInTown()
            }).on('cbx:check', function() {
                this.updateRuntimes();
                this.updateActionButton();
                this.updateNeededTransport();
                this.updateMaxBooty();
            }.bind(this)));
        },

        registerUnitTooltips: function() {
            var hero_l10n = DM.getl10n('heroes').attack_window;

            this.$el.find('.unit').each(function(idx, unit) {
                var $unit = $(unit),
                    hero = $unit.data('hero'),
                    tooltip = TooltipFactory.getUnitCard($unit.data('game_unit'), {
                        unit_skin_class: this.settings.unit_tooltip_class
                    });

                if (!hero) {
                    $unit.tooltip(tooltip, {}, false);
                } else {
                    if (this.controller.isHeroAttacking()) {
                        $unit.tooltip(hero_l10n.can_not_attack_attacking);
                    } else if (this.controller.isHeroInjured()) {
                        $unit.tooltip(hero_l10n.can_not_attck_injured);
                    } else if (this.controller.isHeroBeingAssigned()) {
                        $unit.tooltip(hero_l10n.hero_is_being_assigned);
                    } else {
                        $unit.tooltip(TooltipFactory.getHeroCard(this.controller.getHeroId(), {
                            hero_level: this.controller.getHeroLevel()
                        }), {}, false);
                    }
                }
            }.bind(this));

            this.$el.find('.laurels_bg').tooltip(hero_l10n.no_hero_in_town);
        },

        updateMaxBooty: function() {
            if (!this.settings.show_max_booty) {
                return;
            }

            this.$el.find('.duration .max_booty').text('~' + this.controller.getMaxBooty());
        },

        updateNeededTransport: function() {
            if (!this.settings.show_needed_transport) {
                return;
            }

            this.$el.find('.needed_transport .slow_boats_needed').text(this.controller.getSlowBoatsNeeded());
            this.$el.find('.needed_transport .fast_boats_needed').text(this.controller.getFastBoatsNeeded());

        },

        _unitImageClickHandler: function(event) {
            if (this.settings.unit_image_click_handler) {
                this.settings.unit_image_click_handler(event);
                return;
            }

            var $el = $(event.currentTarget),
                unit_type = $el.data('unit_id'),
                hero = $el.data('hero'),
                $textbox = this.getComponent(unit_type, 'input_boxes'),
                available_units = this.controller.getAvailableUnitsFor(unit_type),
                hero_checkbox = this.getComponent('cbx_include_hero');

            if (hero && this.controller.isHeroHealthyInTown()) {
                if (hero_checkbox.isChecked()) {
                    hero_checkbox.check(false);
                } else {
                    hero_checkbox.check(true);
                }
            } else if ($textbox) {
                if ($textbox.isDisabled()) {
                    return;
                }

                if ($textbox.getValue()) {
                    $textbox.setValue(0);
                } else {
                    $textbox.setValue(available_units);
                }
            }

            this.updateCapacityBar();
            this.updateNeededTransport();
            this.updateMaxBooty();
        },

        _selectAllClickHandler: function(event) {
            var ctrl = this.controller,
                input_boxes = ctrl.getComponents('input_boxes'),
                hero_checkbox = ctrl.getComponent('cbx_include_hero');

            if (!ctrl.getSelectAllToggleState()) {
                ctrl.setSelectAllToggleState(true);
            } else {
                ctrl.setSelectAllToggleState(false);
            }

            us.each(input_boxes, function($input_box) {
                if ($input_box.isDisabled()) {
                    return;
                }
                var value = ctrl.getSelectAllToggleState() ? $input_box.getMax() : 0;
                $input_box.setValue(value);
            });

            if (ctrl.isHeroHealthyInTown()) {
                hero_checkbox.check(ctrl.getSelectAllToggleState());
            }
            this._updateSelectAll();

            this.updateCapacityBar();
            this.updateNeededTransport();
            this.updateMaxBooty();
        },

        _updateSelectAll: function() {
            var $select_all = this.$el.find('.select_all');
            if (this.controller.getSelectAllToggleState()) {
                $select_all.text(this.l10n.deselect_all_units);
            } else {
                $select_all.text(this.l10n.select_all_units);
            }
        },


        _expandButtonClickHandler: function(event) {
            var input_boxes = this.controller.getComponents('input_boxes'),
                ctrl = this.controller;

            if (!ctrl.getExpandButtonToggleState()) {
                this.$el.find('.unit, .txt_unit').removeClass('hidden');
                us.each(input_boxes, function($input_box) {
                    $input_box.show();
                });
                ctrl.setExpandButtonToggleState(true);
                this.$el.find('.btn_expand_units').removeClass('plus').addClass('minus');
            } else {
                this.reRender();
                ctrl.setExpandButtonToggleState(false);
                this.$el.find('.btn_expand_units').removeClass('minus').addClass('plus');
                this.$el.find('.btn_expand_units').removeClass('disabled');
            }
        },

        updateActionButton: function() {
            var button = this.controller.getActionButton();

            if (!button) {
                return;
            }

            if (this.controller.getTotalAmountOfSelectedUnits() === 0 && !this.getComponent('cbx_include_hero').isChecked()) {
                button.setState(true);
                button.disable();
            } else {
                button.setState(false);
                button.enable();
            }
        },

        // update the duration and arrival time
        updateRuntimes: function() {
            if (!this.settings.show_runtimes) {
                return;
            }

            var runtime = this.controller.getSlowestUnitRuntime(),
                $way_duration = this.$el.find('.way_duration'),
                $arrival_time = this.$el.find('.arrival_time');

            $way_duration.text('~' + DateHelper.readableSeconds(runtime));
            $arrival_time.text('~' + readableUnixTimestamp(Timestamp.now() + runtime));
        },

        registerTimerArrivalTime: function() {
            if (!this.settings.show_runtimes) {
                return;
            }

            var $way_duration = this.$el.find('.way_duration'),
                $arrival_time = this.$el.find('.arrival_time');

            $arrival_time.tooltip(this.l10n.arrival_time);
            $way_duration.tooltip(this.l10n.way_duration);
            this.controller.unregisterTimer('arrival_timer');
            this.controller.registerTimer('arrival_timer', 1000, this.updateRuntimes.bind(this));
        },

        registerUnitPopulationTooltip: function() {
            if (!this.settings.show_capacity_bar) {
                return;
            }

            var units = this.controller.getUnitsPopulationInfo(),
                line_break_before = 'chariot',
                template = us.template($('script#tpl_unit_population_tooltip').html(), {
                    title: this.l10n.tooltips.unit_population.title,
                    description: this.l10n.tooltips.unit_population.description,
                    line_break_before: line_break_before, //first element of the second line, depends on the set width
                    units: units
                });

            this.$el.find('.unit_population_info').tooltip(template, {
                width: 300
            });
        },

        destroy: function() {}
    });
});