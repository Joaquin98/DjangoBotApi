/* global readableUnixTimestamp */
define('features/runtime_info/views/runtime_info', function(require) {
    'use strict';

    var Views = require_legacy('GameViews');
    var GameDataHeroes = require('data/heroes');
    var GameFeatures = require('data/features');
    var Timestamp = require('misc/timestamp');
    var DateHelper = require('helpers/date');
    var RUNTIME_MODIFIER = require('enums/runtime_info');
    var TooltipFactory = require('factories/tooltip_factory');

    return Views.BaseView.extend({
        initialize: function(options) {
            Views.BaseView.prototype.initialize.apply(this, arguments);
            this.l10n = this.controller.getl10n();
            this.cm_context = this.controller.getContext();
            this.render();
        },

        render: function() {
            var is_portal_command = this.controller.isPortalCommand(),
                town_link;

            if (is_portal_command) {
                town_link = this.controller.getOlympusTempleLink();
            } else {
                town_link = this.controller.getTownLink();
            }

            this.renderTemplate(this.$el, 'index', {
                l10n: this.l10n,
                units: this.controller.getUnits(),
                town_link: town_link,
                town_name: this.controller.getTownName(),
                hero_feature_enabled: GameFeatures.areHeroesEnabled(),
                extended_world_features: GameFeatures.areExtendedWorldFeaturesEnabled(),
                is_portal_command: is_portal_command
            });

            this.registerViewComponents();
        },

        registerHeroPicker: function() {
            var all_heroes = GameDataHeroes.getHeroesObjForHeroPicker();

            this.unregisterComponent('hero_picker');
            this.registerComponent('hero_picker', this.$el.find('.hero_modifier').heroPicker({
                options: all_heroes,
                should_have_remove_and_change_btn: false,
                should_have_level_btn: true,
                confirmation_window: null
            }).on('hd:change:value', function(e, new_hero_name, old_hero_name) {
                this.addOrHideHeroLine(new_hero_name, old_hero_name);
                this.registerTimerArrivalTime();
            }.bind(this)).on('sp:change:value', function() {
                this.registerTimerArrivalTime();
            }.bind(this)));


        },

        registerTooltipsForModifiers: function() {
            this.$el.find('.modifier .meteorology').tooltip(TooltipFactory.getResearchTooltip(RUNTIME_MODIFIER.METEOROLOGY));
            this.$el.find('.modifier .cartography').tooltip(TooltipFactory.getResearchTooltip(RUNTIME_MODIFIER.CARTOGRAPHY));
            if (GameFeatures.areExtendedWorldFeaturesEnabled()) {
                this.$el.find('.modifier .set_sail').tooltip(TooltipFactory.getResearchTooltip(RUNTIME_MODIFIER.SET_SAIL));
            }
            this.$el.find('.modifier .unit_movement_boost').tooltip(TooltipFactory.getPowerTooltipWithDefaultSettings(RUNTIME_MODIFIER.UNIT_MOVEMENT, {
                percent: 30,
                lifetime: 1800,
                level: 1
            }));
            this.$el.find('.modifier .lighthouse').tooltip(TooltipFactory.getSpecialBuildingTooltip(RUNTIME_MODIFIER.LIGHTHOUSE));
        },

        addOrHideHeroLine: function(new_hero_name, old_hero_name) {
            if (old_hero_name.length > 0) {
                this.$el.find('.unit_runtime.hero .unit').removeClass(old_hero_name);
                this.$el.find('.unit_runtime.hero .duration').removeClass(old_hero_name);
            }
            if (new_hero_name.length > 0 && new_hero_name !== old_hero_name) {
                this.$el.find('.unit_runtime.hero').show();
                this.$el.find('.unit_runtime.hero .unit').addClass(new_hero_name);
                this.$el.find('.unit_runtime.hero .duration').addClass(new_hero_name);
            } else {
                this.$el.find('.unit_runtime.hero').hide();
            }
            this.registerScrollbar();
        },

        registerTooltipsForUnits: function() {
            var units = this.controller.getUnits();
            for (var pos = 0; pos < units.length; pos++) {
                if (this.$el.find('.unit_runtime .unit.' + units[pos])) {
                    this.$el.find('.unit_runtime .unit.' + units[pos]).tooltip(TooltipFactory.getUnitCard(units[pos]), {}, false);
                }
            }
        },

        registerDurationAndRuntimeTooltip: function() {
            this.$el.find('.way_duration').tooltip(this.l10n.way_duration);
            this.$el.find('.arrival_time').tooltip(this.l10n.arrival_time);
        },

        registerModifiers: function() {
            var controller = this.controller,
                self = this,
                modifiers = this.$el.find('.modifier');

            modifiers.each(function(idx, el) {
                var modifier_id = $(el).find('.checkbox_new').attr('data-modifierid');

                controller.unregisterComponent(modifier_id);
                controller.registerComponent(modifier_id, $(el).find('.checkbox_new').checkbox({
                    caption: '',
                    checked: this.controller.hasModifierActive(modifier_id)
                }).on('cbx:check', function() {
                    var id = $(this).attr('data-modifierid');

                    controller.setModifiers(id);
                    self.registerTimerArrivalTime();
                }));
            }.bind(this));
        },

        registerScrollbar: function() {
            this.controller.unregisterComponent('runtime_scrollbar');
            this.controller.registerComponent('runtime_scrollbar', this.$el.find('.js-scrollbar-viewport').skinableScrollbar({
                orientation: 'vertical',
                template: 'tpl_skinable_scrollbar',
                skin: 'blue',
                disabled: false,
                elements_to_scroll: this.$el.find('.js-scrollbar-content'),
                element_viewport: this.$el.find('.js-scrollbar-viewport'),
                scroll_position: 0,
                min_slider_size: 16
            }));
        },

        updateRuntimes: function(runtimes) {
            var units = this.controller.getUnits();

            $.each(units, function(pos, unit) {
                $('.unit_runtime .duration.' + unit + ' .way_duration').text('~' + DateHelper.readableSeconds(runtimes[unit]));
                $('.unit_runtime .duration.' + unit + ' .arrival_time').text('~' + readableUnixTimestamp(Timestamp.now() + runtimes[unit]));
            });
        },

        registerTimerArrivalTime: function() {
            var runtimes = this.controller.getFinalRuntimes();
            this.controller.unregisterTimer('runtime_timer');
            this.controller.registerTimer('runtime_timer', 1000, function() {
                this.updateRuntimes(runtimes);
            }.bind(this));
        },

        registerViewComponents: function() {
            this.registerTimerArrivalTime();
            if (GameFeatures.areHeroesEnabled()) {
                this.registerHeroPicker();
            }
            this.registerTooltipsForModifiers();
            this.registerTooltipsForUnits();
            this.registerDurationAndRuntimeTooltip();
            this.registerModifiers();
            this.registerScrollbar();
        }
    });
});