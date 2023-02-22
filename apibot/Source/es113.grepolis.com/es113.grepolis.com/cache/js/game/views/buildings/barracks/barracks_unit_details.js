/*global define, GameData, Backbone, GameDataUnits, MousePopup */

(function() {
    'use strict';

    var BarracksUnitDetails = GameViews.BaseView.extend({
        initialize: function() {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);
        },

        reRender: function(unit_id) {
            //Unregistering components is done before registration
            this.render(unit_id);
        },

        render: function(unit_id) {
            this.renderUnitOrderBox(unit_id);
            this.renderUnitDetails(unit_id);

            return this;
        },

        renderUnitOrderBox: function(unit_id) {
            //Render unit order view
            this.$el.html(us.template(this.controller.getTemplate('unit_order_box'), {
                unit_id: unit_id,
                unit_name: GameData.units[unit_id].name,
                l10n: this.controller.getl10n(),
                dependencies: GameDataUnits.getDependencies(unit_id)
            }));

            this.registerUnitOrderComponents(unit_id);
        },

        registerUnitOrderComponents: function(unit_id) {
            var _self = this,
                controller = this.controller,
                $el = this.$el.find('.unit_order'),
                has_dependencies = GameDataUnits.hasDependencies(unit_id),
                min_unit_build = 0,
                min_button_val = 1,
                max_unit_build = GameDataUnits.getMaxBuildForSingleUnit(unit_id);

            var sub_context = this.controller.getUnitDetailsSubContextName();

            if (has_dependencies || max_unit_build === 0) {
                max_unit_build = 0;
                min_button_val = 0;
            }

            controller.unregisterComponents(sub_context);

            //Min button
            controller.registerComponent('btn_min', $el.find('.btn_min').button({
                template: 'empty',
                caption: min_button_val
            }).on('btn:click', function() {
                controller.getComponent('sl_order_units', sub_context).setValue(min_button_val);
            }), sub_context);

            //Max button
            controller.registerComponent('btn_max', $el.find('.btn_max').button({
                template: 'empty',
                caption: max_unit_build,
                details: max_unit_build
            }).on('btn:click', function(e, _btn) {
                controller.getComponent('sl_order_units', sub_context).setValue(_btn.getDetails());
            }), sub_context);

            //Accept button
            controller.registerComponent('btn_accept_order', $el.find('.btn_accept_order').button({
                template: 'empty',
                disabled: max_unit_build <= 0
            }).on('btn:click', function(e, _btn) {
                var amount = controller.getComponent('sl_order_units', sub_context).getValue();

                _btn.disable();

                controller.buildUnits(amount, function() {
                    _btn.enable();
                });
            }), sub_context);

            //Slider
            controller.registerComponent('sl_order_units', $el.find('.sl_order_units').grepoSlider({
                min: min_unit_build,
                max: max_unit_build,
                step: 1,
                value: max_unit_build
            }).on('sl:change:value', function(e, _sl, value) {
                //Set value to textbox
                controller.getComponent('txt_order_units', sub_context).setValue(value);
                //Enable or disable button
                controller.getComponent('btn_accept_order', sub_context)[value > 0 ? 'enable' : 'disable']();
                //Rerender view
                _self.renderUnitDetails(unit_id, value);
            }), sub_context);

            //Textbox
            controller.registerComponent('txt_order_units', $el.find('.txt_order_units').textbox({
                type: 'number',
                value: max_unit_build,
                min: min_unit_build,
                max: max_unit_build,
                hidden_zero: false
            }).on('txt:change:value', function(e, value, old_value, _txt) {
                controller.getComponent('sl_order_units', sub_context).setValue(value);
            }), sub_context);

            //Popup on the big unit image
            $el.find('.icon').setPopup(unit_id + '_details');
        },

        renderUnitDetails: function(unit_id, amount) {
            var $el = this.$el,
                units_amount = typeof amount === 'undefined' ? GameDataUnits.getMaxBuildForSingleUnit(unit_id) : amount,
                building_type = this.controller.getBuildingType();

            $el.find('.costs_box, .details_box').remove();
            $el.append(us.template(this.controller.getTemplate('unit_details'), {
                building_type: building_type,
                unit: this.controller.getUnitDetails(unit_id),
                units_amount: units_amount,
                l10n: this.controller.getl10n()
            }));

            this.registerUnitDetailsComponents();
        },

        registerUnitDetailsComponents: function() {
            var $unit_details = this.$el,
                l10n = this.controller.getl10n(),
                building_type = this.controller.getBuildingType(),
                cost_name, costs_names = ['wood', 'iron', 'stone', 'favor', 'population', 'buildtime_' + building_type];

            //Popups for costs
            for (var i = 0, l = costs_names.length; i < l; i++) {
                cost_name = costs_names[i];

                $unit_details.find('td.' + cost_name).tooltip(l10n.cost_details[cost_name]);
            }

            //Popups for skills
            if (building_type === 'barracks') {
                $unit_details.find('.att_hack .icon').tooltip('<h4>' + l10n.tooltips.att_hack + '</h4>');
                $unit_details.find('.att_pierce .icon').tooltip('<h4>' + l10n.tooltips.att_pierce + '</h4>');
                $unit_details.find('.att_distance .icon').tooltip('<h4>' + l10n.tooltips.att_distance + '</h4>');

                $unit_details.find('.def_pierce').tooltip('<h4>' + l10n.tooltips.def_pierce + '</h4>');
                $unit_details.find('.def_distance').tooltip('<h4>' + l10n.tooltips.def_distance + '</h4>');
                $unit_details.find('.def_hack .icon').tooltip('<h4>' + l10n.tooltips.def_hack + '</h4>');

                $unit_details.find('.booty').tooltip('<h4>' + l10n.tooltips.booty.title + '</h4><p>' + l10n.tooltips.booty.descr + '</p>');
                $unit_details.find('.speed').tooltip('<h4>' + l10n.tooltips.speed + '</h4>');
            } else {
                $unit_details.find('.ship_attack').tooltip('<h4>' + l10n.tooltips.ship_attack + '</h4>');
                $unit_details.find('.ship_defense').tooltip('<h4>' + l10n.tooltips.ship_defense + '</h4>');
                $unit_details.find('.ship_capacity').tooltip('<h4>' + l10n.tooltips.ship_transport.title + '</h4><p>' + l10n.tooltips.ship_transport.descr + '</p>');
                $unit_details.find('.speed').tooltip('<h4>' + l10n.tooltips.speed + '</h4>');
            }
        },

        destroy: function() {

        }
    });

    window.GameViews.BarracksUnitDetails = BarracksUnitDetails;
}());