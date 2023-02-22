/*global Backbone, us, TooltipFactory, GameEvents */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LayoutResourcesBar = BaseView.extend({
        //Determinates a minumum value which will be indicated with animation
        ANIMATION_THRESHOLD: 10,

        $wood: null,
        $stone: null,
        $iron: null,
        $population: null,

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.render();
        },

        rerender: function() {
            this.controller.unregisterComponents();
            this.render();
        },

        render: function() {
            var controller = this.controller;

            this.$el.html(us.template(controller.getTemplate('main'), {
                indicators_data: controller.getIndicatorsData(),
                storage_capacity: this.controller.getStorageCapacity()
            }));

            this.$wood = this.$el.find('.indicator.wood .amount');
            this.$stone = this.$el.find('.indicator.stone .amount');
            this.$iron = this.$el.find('.indicator.iron .amount');
            this.$population = this.$el.find('.indicator.population .amount');

            this.registerViewComponents();
        },

        updateResources: function(value, resource_id) {
            var storage_capacity = this.controller.getStorageCapacity(),
                limit_reached = value === storage_capacity,
                previous_value = this.controller.getComponent('nci_indicator_' + resource_id).getCaption();

            this.controller.getComponent('nci_indicator_' + resource_id)
                .setCaption(value)
                .toggleClass("limit_reached", limit_reached);

            this.controller.getComponent('pb_' + resource_id)
                .setValue(value)
                .toggleClass("limit_reached", limit_reached);

            //@todo It would be better to have it in the model, but I don't have time to investigate
            //Please try to move it to the "town_resources" model
            if (limit_reached && previous_value !== storage_capacity) {
                $.Observer(GameEvents.town.resources.limit_reached).publish({
                    resource_id: resource_id
                });
            } else if (previous_value === storage_capacity && value !== storage_capacity) {
                $.Observer(GameEvents.town.resources.limit_freed).publish({
                    resource_id: resource_id
                });
            }
        },

        updateUsedPopulation: function(value) {
            var town_model = this.controller.getTownModelReference();

            this.controller.getComponent('pb_population')
                .setMax(town_model.getMaxPopulation(), {
                    silent: true
                })
                .setValue(value.blocked);
        },

        updateAvailablePopulation: function(value) {
            var town_model = this.controller.getTownModelReference(),
                graphical_limit_reached = value < 0,
                limit_reached = value <= 0,
                previous_value = parseInt(this.$population.html(), 10);

            this.$population
                .html(value)
                .toggleClass("limit_reached", graphical_limit_reached)
                .toggleClass("negative", graphical_limit_reached);

            this.controller.getComponent('pb_population')
                .setMax(town_model.getMaxPopulation());

            //@todo It would be better to have it in the model, but I don't have time to investigate
            //Please try to move it to the "town_resources" model (this is not a duplicated comment)
            if (limit_reached && previous_value > 0) {
                $.Observer(GameEvents.town.population.limit_reached).publish({});
            } else if (previous_value <= 0 && value > 0) {
                $.Observer(GameEvents.town.population.limit_freed).publish({});
            }
        },

        registerViewComponents: function(value) {
            var _self = this,
                storage_capacity = this.controller.getStorageCapacity(),
                town_model = this.controller.getTownModelReference();

            //Initialize progress
            var draw_settings = {
                start_angle: Math.PI * 0.72 - Math.PI / 2,
                end_angle: Math.PI * 2.26 - Math.PI / 2,
                start_color: 'rgb(226,188,38)',
                end_color: 'rgb(210,142,50)',
                line_thick: 3
            };

            $(["wood", "stone", "iron"]).each(function(index, resource_id) {
                _self.controller.registerComponent('pb_' + resource_id, _self.$el.find('.indicator.' + resource_id).singleProgressbar({
                    template: 'internal',
                    type: 'circular',
                    draw_settings: draw_settings,
                    value: town_model.getResource(resource_id),
                    max: storage_capacity
                }));

                //Number Change indicators
                _self.controller.registerComponent('nci_indicator_' + resource_id, _self.$el.find('.indicator.' + resource_id + ' .amount').numberChangeIndicator({
                    caption: town_model.getResource(resource_id),
                    center_hor: true,
                    animation_threshold: _self.ANIMATION_THRESHOLD
                }));
            });

            this.controller.registerComponent('pb_population', _self.$el.find('.indicator.population').singleProgressbar({
                template: 'internal',
                type: 'circular',
                draw_settings: draw_settings,
                value: town_model.getUsedPopulation(),
                max: town_model.getMaxPopulation()
            }));

            //Click events on the resource types and population
            this.$el.on('click.resources_bar', '.indicator', function(e) {
                var $el = $(e.currentTarget),
                    type = $el.data('type');

                _self.controller.handleClickOnTheIndicators(type);
            });

            //Tooltips and progressbars
            this.$el.on('mouseover.resources_bar', '.indicator .wrapper', function(e) {
                var $el = $(e.currentTarget),
                    $parent_el = $el.parent(),
                    type = $parent_el.data('type');

                $el.tooltip(_self.controller.getTooltip(type)).showTooltip(e);
            });
        },

        destroy: function() {
            var town_model = this.controller.getTownModelReference();

            this.controller.stopListening();

            this.controller.unregisterComponents();
        }
    });

    window.GameViews.LayoutResourcesBar = LayoutResourcesBar;
}());