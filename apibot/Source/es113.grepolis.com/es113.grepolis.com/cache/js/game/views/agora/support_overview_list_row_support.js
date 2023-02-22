/*global GameData, GameDataUnits, readableUnixTimestamp, Timestamp, DateHelper */

/**
 * View which represents single row in the support overview which
 * displays support
 */
(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var SupportOverviewListRowSupportView = BaseView.extend({
        //Subcontext for component manager
        sub_context: '',
        //List container element
        $list: null,
        //Single row element
        $el: null,
        //Determinates if the row is even or odd
        is_even: false,

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.is_even = options.is_even;
            this.$list = options.$list;

            this.sub_context = 'support_list_' + this.model.getId();
            this.l10n = this.controller.getl10n();

            this.model.on('change', this._handleChange, this);

            this.render();
        },

        //Render list with supports
        render: function() {
            var controller = this.controller;

            this.$list.append((us.template(controller.getTemplate('list_support'), {
                l10n: this.l10n,
                support: this.model,
                mode: controller.getMode(),
                modes: controller.getModes(),
                is_even: this.is_even
            })));

            this.$el = this.$list.find('.support_row_' + this.model.getId());

            this.initializeComponents();

            return this;
        },

        /**
         * Initialize all components
         */
        initializeComponents: function() {
            var controller = this.controller,
                mode = controller.getMode(),
                modes = controller.getModes();

            controller.unregisterComponents(this.sub_context);

            //Send back all units button
            this.initializeSendBackAllButtonComponent();

            if (mode !== modes.SUPPORT_FOR_ACTIVE_TOWN) {
                //Button which opened container to send part of units
                this.initializeShowSendBackPartButtonComponent();
                //Send back part of the units
                this.initializeSendBackPartButtonComponent();
                //Spinners
                this.initializeSpinnersComponents();
                //Initialize toggle buttons on the unit icons
                this.initializeUnitIconsButtons();
                //Slow Ship and fast ship buttons
                this.initializeShipsButtons();
                //Initialize progressbar
                this.initializeCapacityProgressbar();
                //Initialize popups
                this.initializePopups();
            }
        },

        initializePopups: function() {

        },

        initializeSendBackAllButtonComponent: function() {
            var _self = this,
                controller = this.controller;

            controller.registerComponent('btn_send_back_all', this.$el.find('.btn_send_back_all').button({
                toggle: true,
                tooltips: [{
                    title: this.l10n.send_all_units_back
                }]
            }).on('btn:click', function() {
                controller.sendBack(_self.model);
            }), this.sub_context);
        },

        initializeSendBackPartButtonComponent: function() {
            var _self = this,
                controller = this.controller;

            this.controller.registerComponent('btn_send_back_part', this.$el.find('.btn_send_back_part').button({
                caption: this.l10n.btn_call_back,
                disabled: true,
                tooltips: [{
                    title: this.l10n.send_part_of_units_back,
                    hide_when_disabled: true
                }]
            }).on('btn:click', function() {
                controller.sendBackPart(_self.model, _self.sub_context);
            }), this.sub_context);
        },

        initializeShowSendBackPartButtonComponent: function() {
            var _self = this;

            this.controller.registerComponent('btn_show_send_back_part', this.$el.find('.btn_show_send_back_part').button({
                tooltips: [{
                    title: this.l10n.send_part_of_units_back
                }]
            }).on('btn:click', function() {
                _self.toggleSendBackPartContainer();
            }), this.sub_context);
        },

        initializeSpinnersComponents: function() {
            var _self = this,
                controller = this.controller,
                model = this.model,
                sub_context = this.sub_context;

            //Spinners
            this.$el.find('.outer_troops_send_part .spinner').each(function(index, el) {
                var $el = $(el),
                    unit_id = $el.data('unitid');

                controller.registerComponent('spinner_' + unit_id, $el.spinner({
                    value: 0,
                    min: 0,
                    step: 1,
                    max: model.getUnitCount(unit_id),
                    tabindex: index,
                    details: unit_id
                }).on('sp:change:value', function(e, new_val, old_val) {
                    _self.updateCapacityProgressbar();
                    _self.updateUnitRuntimes();
                }), sub_context);
            });
        },

        initializeUnitIconsButtons: function() {
            var _self = this,
                controller = this.controller,
                model = this.model,
                sub_context = this.sub_context;

            this.$el.find('.unit_icon40x40').each(function(index, el) {
                var $el = $(el),
                    unit_id = $el.data('unitid');

                controller.registerComponent('unit_icon_' + unit_id, $el.button({
                    caption: model.getUnitCount(unit_id),
                    toggle: true,
                    template: 'internal'
                }).on('btn:click:odd', function(e, _btn) {
                    _self.toggleUnitsAmount(unit_id, _btn.getCaption());
                }).on('btn:click:even', function(e, _btn) {
                    _self.toggleUnitsAmount(unit_id, 0);
                }), sub_context).setPopup(unit_id + '_details');
            });
        },

        initializeShipsButtons: function() {
            var _self = this,
                controller = this.controller,
                $el = this.$el,
                sub_context = this.sub_context,
                l10n = this.l10n;

            //Slow Ships button
            controller.registerComponent('btn_slow_ship', $el.find('.btn_slow_ship').button({
                caption: 0,
                toggle: true,
                tooltips: [{
                    title: l10n.slow_transport_ship
                }]
            }).on('btn:click:odd', function(e, _btn) {
                _self.toggleUnitsAmount('big_transporter', _btn.getCaption());
            }).on('btn:click:even', function(e, _btn) {
                _self.toggleUnitsAmount('big_transporter', 0);
            }), sub_context);

            //Fast Ships button
            controller.registerComponent('btn_fast_ship', $el.find('.btn_fast_ship').button({
                caption: 0,
                toggle: true,
                tooltips: [{
                    title: l10n.fast_transport_ship
                }]
            }).on('btn:click:odd', function(e, _btn) {
                _self.toggleUnitsAmount('small_transporter', _btn.getCaption());
            }).on('btn:click:even', function(e, _btn) {
                _self.toggleUnitsAmount('small_transporter', 0);
            }), sub_context);
        },

        initializeCapacityProgressbar: function() {
            this.controller.registerComponent('pb_capacity', this.$el.find('.pb_capacity').singleProgressbar({
                max: 0,
                caption: this.l10n.capacity,
                animate: true
            }), this.sub_context);
        },

        toggleUnitsAmount: function(unit_id, amount) {
            var spinner = this.controller.getComponent('spinner_' + unit_id, this.sub_context);

            if (spinner) {
                spinner.setValue(amount);
            }
        },

        toggleSendBackPartContainer: function() {
            this.$el.find('.outer_troops_send_part').animate({
                height: 'toggle'
            }, 500, function() {});
        },

        updateCapacityProgressbar: function() {
            var controller = this.controller,
                town_id = this.model.getOriginTownId(),
                units_to_send = this.getChoosenToSendUnitsCounts(),
                capacity = GameDataUnits.calculateCapacity(town_id, units_to_send);

            //Update progressbar
            controller.getComponent('pb_capacity', this.sub_context)
                .setMax(capacity.total_capacity, {
                    silent: true
                })
                .setValue(capacity.needed_capacity);

            //Update ship icons
            controller.getComponent('btn_slow_ship', this.sub_context).setCaption(capacity.slow_boats_needed);
            controller.getComponent('btn_fast_ship', this.sub_context).setCaption(capacity.fast_boats_needed);
        },

        /**
         * depending on the number and type of selected units, travel time and possible error messages are show
         *
         * @returns {void}
         */
        updateUnitRuntimes: function() {
            this.model.getRuntimes(this._doUpdateUnitRuntimes.bind(this));
        },

        _doUpdateUnitRuntimes: function(runtimes) {
            var model = this.model,
                $el = this.$el,
                $way_duration = $el.find('.way_duration'),
                $arrival_time = $el.find('.arrival_time'),
                error_message,
                merged_runtimes = {},
                // units to send back
                chosen_units = this.getChoosenToSendUnitsCounts(),
                chosen_units_transports_needed = !model.isSameIsland() || GameDataUnits.hasNavalUnits(chosen_units),
                chosen_units_capacity = GameDataUnits.calculateCapacity(model.getOriginTownId(), chosen_units),
                chosen_units_not_enough_capacity = chosen_units_capacity.needed_capacity > chosen_units_capacity.total_capacity,
                // units that stay
                remaining_units = model.calculateRemainingUnitsAfterSubstraction(chosen_units),
                remaining_units_transports_needed = !model.isSameIsland(),
                remaining_units_capacity = GameDataUnits.calculateCapacity(model.getOriginTownId(), remaining_units),
                remaining_units_not_enough_capacity = remaining_units_capacity.needed_capacity > remaining_units_capacity.total_capacity,
                slowest_runtime = GameDataUnits.getSlowestRuntime(
                    chosen_units,
                    Object.assign(
                        merged_runtimes,
                        runtimes.unit_runtimes.ground_units,
                        runtimes.unit_runtimes.naval_units
                    )
                );

            // no unit chosen at all? Nothing to do
            if (!slowest_runtime) {
                $el.find('.duration_container').hide();
                $el.find('.duration_error_container').hide();
                return;
            }

            // there must be enough transporters left for the remaining units
            if (remaining_units_transports_needed && remaining_units_not_enough_capacity) {
                error_message = this.l10n.errors.not_enough_transports_left;
            } else if (chosen_units_transports_needed && chosen_units_not_enough_capacity) {
                // are there enough transporters chosen for the units that are being send back
                error_message = this.l10n.errors.not_enough_transport_capacity;
                if (model.isSameIsland()) {
                    error_message = this.l10n.errors.not_enough_transport_capacity_same_island;
                }
            }

            // if there is an error, hide the runtimes and show the errors instead
            if (error_message) {
                $el.find('.duration_error_container .duration_error_text').text(error_message);
                $el.find('.duration_error_container').show();
                $el.find('.duration_container').hide();

                this.controller.getComponent('btn_send_back_part', this.sub_context).disable();
            } else {
                // hide the previous errors and show the runtime
                $way_duration.text('~' + DateHelper.readableSeconds(slowest_runtime));
                $arrival_time.text(slowest_runtime).updateTime();
                $arrival_time.text('~' + readableUnixTimestamp(Timestamp.server() + slowest_runtime, 'no_offset'));

                $el.find('.duration_error_container').hide();
                $el.find('.duration_container').show();
                this.controller.getComponent('btn_send_back_part', this.sub_context).enable();
            }
        },

        getChoosenToSendUnitsCounts: function() {
            var controller = this.controller,
                unit_id, units = this.model.getUnits(),
                spinner, count, units_to_send = {};

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id)) {
                    spinner = controller.getComponent('spinner_' + unit_id, this.sub_context);

                    if (spinner) {
                        count = parseInt(spinner.getValue(), 10);

                        if (count) {
                            units_to_send[unit_id] = count;
                        }
                    }
                }
            }

            return units_to_send;
        },

        _handleChange: function() {
            var unit_id, units = this.model.getUnits(),
                controller = this.controller,
                spinner, button, count;

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id)) {
                    count = units[unit_id];

                    //Update max value in spinner
                    spinner = controller.getComponent('spinner_' + unit_id, this.sub_context);
                    spinner.setValue(0).setMax(units[unit_id]);

                    //Update caption in units icons
                    button = controller.getComponent('unit_icon_' + unit_id, this.sub_context);
                    button.setCaption(count);
                }
            }
        },

        destroy: function() {
            this.model.off(null, null, this);
        }
    });

    window.GameViews.SupportOverviewListRowSupportView = SupportOverviewListRowSupportView;
}());