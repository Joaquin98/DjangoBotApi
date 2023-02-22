/*global us, BarracksWindowFactory, BarracksWindowFactory, TooltipFactory, Game, GameDataHeroes, GameDataUnits */

(function() {
    'use strict';

    var Units = window.GameModels.Units;
    var BaseView = window.GameViews.BaseView;

    var LayoutUnits = BaseView.extend({
        events: {
            'click .unit': 'handleUnitClick'
        },
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.l10n;
            this.premium_features = this.controller.getModel('premium_features');
            this.unit_time_to_arrival = this.controller.getModel('unit_time_to_arrival');
            this.units = this.controller.getCollection('units');
            this.registerViewComponents();
            this.renderUnits();

            this.premium_features.onCuratorChange(this, this.toggleLinksButtons.bind(this));

            this.units.on('all', function() {
                this.updateSlideButtonStates();
                this.renderUnits();
            }, this);
        },

        registerViewComponents: function() {
            this.$units_land = this.$el.find('.units_land');
            this.$units_naval = this.$el.find('.units_naval');
            this.$units_land_wrapper = this.$el.find('.units_land .units_wrapper');
            this.$units_naval_wrapper = this.$el.find('.units_naval .units_wrapper');

            this.landunits_button = this.controller.registerComponent('btn_slide_units_land', this.$el.find('.units_land .btn_slide').button({
                template: 'internal',
                disabled: !this.units.hasLandUnits()
            }).on('btn:click', (function() {
                if (this.units.hasLandUnits()) {
                    this.$units_land_wrapper.slideToggle(this.controller.publishViewHeight.bind(this));
                }
                this.$units_land.toggleClass('container_hidden');
            }).bind(this)));

            this.navalunits_button = this.controller.registerComponent('btn_slide_units_naval', this.$el.find('.units_naval .btn_slide').button({
                template: 'internal',
                disabled: !this.units.hasNavalUnits()
            }).on('btn:click', (function() {
                this.$units_naval_wrapper.slideToggle(this.controller.publishViewHeight.bind(this));
                this.$units_naval.toggleClass('container_hidden');
            }).bind(this)));

            if (this.premium_features.hasCurator()) {
                this.createLinksButtons();
            }
        },

        updateSlideButtonStates: function() {
            this.landunits_button.toggleDisable(!this.units.hasLandUnits());
            this.navalunits_button.toggleDisable(!this.units.hasNavalUnits());
        },

        toggleLinksButtons: function() {
            if (this.premium_features.hasCurator()) {
                this.createLinksButtons();
            } else {
                this.removeLinksButtons();
            }
        },

        createLinksButtons: function() {
            if (this.premium_features && !(this.controller.getComponent('btn_open_barracks') || this.controller.getComponent('btn_open_harbor'))) {
                var units_land = this.$el.find('.units_land .bottom_link'),
                    units_naval = this.$el.find('.units_naval .bottom_link');

                this.controller.registerComponent('btn_open_barracks', units_land.addClass('link_active').show().button({
                    template: 'internal',
                    caption: this.l10n.barracks
                }).on('btn:click', (function() {
                    BarracksWindowFactory.openBarracksWindow();
                }).bind(this)));

                this.controller.registerComponent('btn_open_harbor', units_naval.addClass('link_active').show().button({
                    template: 'internal',
                    caption: this.l10n.harbor
                }).on('btn:click', (function() {
                    BarracksWindowFactory.openDocksWindow();
                }).bind(this)));

                this.updateStateOfUnitsAreas();
            }
        },

        removeLinksButtons: function() {
            this.controller.unregisterComponent('btn_open_barracks');
            this.$el.find('.units_land .bottom_link').removeClass('link_active').hide().off();

            this.controller.unregisterComponent('btn_open_harbor');
            this.$el.find('.units_naval .bottom_link').removeClass('link_active').hide().off();

            this.updateStateOfUnitsAreas();
        },

        updateStateOfUnitsAreas: function() {
            var has_curator = this.premium_features.hasCurator();
            if (has_curator || this.units.hasNavalUnits()) {
                this.showNavalUnits();
            } else {
                this.hideNavalUnits();
            }

            if (has_curator || this.units.hasLandUnits()) {
                this.showLandUnits();
            } else {
                this.hideLandUnits();
            }

            this.controller.publishViewHeight();
        },

        showLandUnits: function() {
            this.$units_land.show();
        },

        hideLandUnits: function() {
            this.$units_land.hide();
        },

        showNavalUnits: function() {
            this.$units_naval.show();
        },

        hideNavalUnits: function() {
            this.$units_naval.hide();
        },

        renderUnits: function() {
            var units = Units.sortByUnitTypes(this.units.calculateTotalAmountOfUnits()),
                naval_units_ids = GameDataUnits.navalUnitIds(),
                unit_id,
                container,
                unit_land_wrapper_parent = this.$units_land_wrapper.parent(),
                unit_naval_wrapper_parent = this.$units_naval_wrapper.parent(),
                is_naval = false,
                UnitNumbersHelper = require('helpers/unit_numbers');

            this.unit_time_to_arrival.clear();

            this.$units_land_wrapper.detach().empty();
            this.$units_naval_wrapper.detach().empty();

            for (unit_id in units) {
                if (units.hasOwnProperty(unit_id)) {
                    if (naval_units_ids.indexOf(unit_id) !== -1) {
                        container = this.$units_naval_wrapper;
                        is_naval = true;
                    } else {
                        container = this.$units_land_wrapper;
                        is_naval = false;
                    }
                    var $unit = $(us.template(
                        this.controller.getTemplate('unit'), {
                            type: unit_id,
                            amount: units[unit_id],
                            short_amount: UnitNumbersHelper.shortenNumber(units[unit_id]),
                            is_hero: GameDataHeroes.isHero(unit_id),
                            is_naval: is_naval
                        }
                    ));
                    container.append($unit);
                    $unit.tooltip(TooltipFactory.getUnitCard(unit_id, {
                        amount: units[unit_id]
                    }), {}, false);
                }
            }

            unit_land_wrapper_parent.prepend(this.$units_land_wrapper);
            unit_naval_wrapper_parent.prepend(this.$units_naval_wrapper);

            if (!Game.isMobileBrowser()) {
                this.$el.find('div').removeClass("js-scrollbar-viewport js-scrollbar-content");
            } else {
                this.unregisterComponent('scrollbar');
                this.registerComponent('scrollbar', this.$el.find('.js-scrollbar-viewport').skinableScrollbar({
                    orientation: 'vertical',
                    template: 'tpl_skinable_scrollbar',
                    skin: 'narrow',
                    disabled: false,
                    elements_to_scroll: this.$el.find('.js-scrollbar-content'),
                    element_viewport: this.$el.find('.js-scrollbar-viewport')
                }));
            }

            this.updateStateOfUnitsAreas();
        },

        handleUnitClick: function(e) {
            var unit = $(e.currentTarget),
                unit_id = unit.data('type');

            if (unit_id === 'militia') {
                return;
            }

            if (unit.data('selected')) {
                unit.removeClass('selected');
                unit.removeData('selected');
                this.unit_time_to_arrival.removeSelectedUnit(unit_id);
            } else {
                unit.addClass('selected');
                unit.data('selected', true);
                this.unit_time_to_arrival.addSelectedUnit(unit_id);
            }
        }
    });

    window.GameViews.LayoutUnits = LayoutUnits;
}());