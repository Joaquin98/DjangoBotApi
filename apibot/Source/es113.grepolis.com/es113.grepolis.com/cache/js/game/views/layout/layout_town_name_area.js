/*global us, BuyForGoldWindowFactory, TooltipFactory, HelperTown, GameEvents, NotificationLoader, TM, HelperBrowserEvents */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView,
        TempleSizes = require('enums/temple_sizes'),
        CASTED_POWERS_CONTEXT = 'casted_powers';

    var LayoutTownNameArea = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.bindCastedPowersEvents();

            this.registerTownNameAreaComponents();
            this.renderCastedPowers();
            this.renderCultureOverview();

            $.Observer(GameEvents.town.town_switch).subscribe('layout_town_name_area', function() {
                this.controller.setTownName();
                this.controller.updateArrowButtonStates();
            }.bind(this));
        },

        registerTownNameAreaComponents: function() {
            var _self = this,
                controller = this.controller,
                $el = this.$el;

            controller.registerComponent('btn_prev_town', $el.find('.btn_prev_town').button({
                template: 'empty',
                disabled: controller.isTownSwitchPossibleInCurrentGroup()
            }).on('btn:click', function() {
                HelperTown.switchToPreviousTown();
            }));

            controller.registerComponent('btn_next_town', $el.find('.btn_next_town').button({
                template: 'empty',
                disabled: controller.isTownSwitchPossibleInCurrentGroup()
            }).on('btn:click', function() {
                HelperTown.switchToNextTown();
            }));

            controller.registerComponent('btn_toggle_town_groups_menu', $el.find('.btn_toggle_town_groups_menu').singleDoubleClick({}).on('sdc:click', function() {
                _self.controller.toggleList();
            }));

            //It should be registered after toggle town groups button, because its replacing context and then
            //rename component is missing reference to the object
            controller.unregisterComponent('ren_town_rename');
            controller.registerComponent('ren_town_rename', $el.find('.town_groups_dropdown .caption').rename({
                text: controller.getActiveTownName()
            }).on('rn:rename:stop', function(e, _rn, new_town_name) {
                controller.renameTown(new_town_name, _rn);
            }));

            controller.unregisterComponent('ren_town_rename_tooltip');
            controller.registerComponent('ren_town_rename_tooltip', $el.find('.town_groups_dropdown .caption .town_name').tooltip(this.l10n.rename_town_name));

            this.registerCultureOverviewExtendButton();
        },

        /**
         *
         * CASTED POWERS
         *
         */
        renderCastedPowers: function() {
            var controller = this.controller,
                $casted_powers_list = this.$el.find('.casted_powers_area .list');

            $casted_powers_list.html(us.template(controller.getTemplate('casted_powers'), {
                casted_powers: controller.getCastedPowers()
            }));

            this.registerCastedPowersComponents($casted_powers_list);
            this.renderCastedAlliancePowers($casted_powers_list, TempleSizes.SMALL);
            this.renderCastedAlliancePowers($casted_powers_list, TempleSizes.LARGE);
        },

        registerCastedPowersComponents: function($casted_powers_list) {
            var sub_context = 'casted_powers',
                controller = this.controller,
                $casted_powers = $casted_powers_list.find('.casted_power');

            controller.unregisterComponents(sub_context);

            controller.registerComponent('casted_powers_slider', this.$el.find('.casted_powers_area').listSlider({
                enable_wheel_scrolling: true
            }), CASTED_POWERS_CONTEXT);

            //Register all power icons as buttons, because confirmation window needs button object
            //set as an argument
            $casted_powers.each(function(index, el) {
                var $power = $(el),
                    real_power_id = $power.data('real_power_id'),
                    casted_power = controller.getCastedPowerById(real_power_id),
                    progress = controller.getCappedPowerProgressByPowerId(casted_power.getPowerId()),
                    on_mouseover_event_name = HelperBrowserEvents.getOnMouseOverEventName();

                controller.registerComponent('power_' + real_power_id, $power.button({
                    template: 'empty'
                }).on('btn:click', function(e, _btn) {
                    if (casted_power.isExtendable()) {
                        BuyForGoldWindowFactory.openExtendPowerForGoldWindow(_btn, casted_power);
                    }
                }).on(on_mouseover_event_name, function(e) {
                    $power.tooltip(TooltipFactory.getCastedPowerTooltip(casted_power, progress)).showTooltip(e);
                }), sub_context);
            });

            //Fetch new data for casted spells when time runs out
            var time_left = controller.getLowestExpireTime();

            if (time_left > 0) {
                TM.unregister('layout_rerender_casted_spells');
                TM.register('layout_rerender_casted_spells', time_left * 1000, function() {
                    NotificationLoader.resetNotificationRequestTimeout(100);
                }, {
                    max: 1
                });
            }
        },

        renderCastedAlliancePowers: function($casted_powers_list, origin) {
            var powers = this.controller.getCastedAlliancePowersByOrigin(origin),
                $casted_alliance_powers_el = $casted_powers_list.find('.' + origin + "_temple_powers"),
                list_slider = this.controller.getComponent('casted_powers_slider', CASTED_POWERS_CONTEXT),
                el, tooltip;

            if (powers && Object.keys(powers).length > 0) {
                tooltip = TooltipFactory.getAlliancePowersTooltip(origin, powers);

                if ($casted_alliance_powers_el.length === 0) {
                    el = document.createElement('div');
                    el.className = "casted_alliance_power power_icon16x16 " + origin + "_temple_powers";
                    $casted_powers_list.append(el);
                    $(el).tooltip(tooltip);
                    list_slider.updateContent();
                } else {
                    $casted_alliance_powers_el.tooltip(tooltip);
                }
            } else if ($casted_alliance_powers_el.length > 0) {
                $casted_alliance_powers_el.remove();
                list_slider.updateContent();
            }
        },

        bindCastedPowersEvents: function() {
            this.controller.getCollection('casted_powers').on('add', this.renderCastedPowers, this);
            this.controller.getCollection('casted_powers').on('remove', this.renderCastedPowers, this);
            this.controller.getCollection('casted_powers').on('change', this.renderCastedPowers, this);
            this.controller.getCollection('casted_powers').on('reset', this.renderCastedPowers, this);
        },

        /**
         * Sets town name
         *
         * @param {String} town name
         */
        setTownName: function(name) {
            var $town_name = this.$el.find('.town_groups_dropdown .js-townname-caption'),
                $town_name_viewport = this.$el.find('.town_groups_dropdown .js-viewport');

            //Change town name
            this.controller.getComponent('ren_town_rename').setText(name);

            //Clean up css classes and data attributes
            $town_name.removeClass('smaller smallest');
            $.removeData($town_name[0], 'js_rename_class');

            //Make text smaller if it does not fit to the viewport
            if ($town_name.width() > $town_name_viewport.width()) {
                $town_name.addClass('smaller').data('js_rename_class', 'smaller');
            }

            //Try again, and make text even smaller if it still does not fit to the viewport
            if ($town_name.width() > $town_name_viewport.width()) {
                $town_name.addClass('smallest').data('js_rename_class', 'smallest');
            }
        },

        renderCultureOverview: function() {
            var $wrapper = this.$el.find('.culture_overview_wrapper'),
                tooltip = TooltipFactory.getCultureOverviewTooltip(),
                player_model = this.controller.getPlayerModel(),
                owned_towns = this.controller.getTownsCount();

            this.overview_visible = this.overview_visible && !$wrapper.hasClass('.container_hidden');

            $wrapper.html(us.template(this.controller.getTemplate('culture_overview'), {
                town_count: owned_towns,
                culture_points: player_model.getCulturalStep(),
                overview_visible: this.overview_visible
            }));

            $wrapper.find('.caption').tooltip(tooltip);
            this.registerCultureOverviewExtendButton();
        },

        registerCultureOverviewExtendButton: function() {
            this.unregisterComponent('btn_extend');
            this.registerComponent('btn_extend', this.$el.find('.btn_extend').button({
                template: 'empty'
            }).on('btn:click', this.slideToggle.bind(this)));
        },

        slideToggle: function() {
            var $overview = this.$el.find('.culture_overview_wrapper'),
                hidden_class = 'container_hidden';

            if (this.overview_visible) {
                $overview.addClass(hidden_class);
                this.overview_visible = false;
            } else {
                $overview.removeClass(hidden_class);
                this.overview_visible = true;
            }
        },

        destroy: function() {
            this.controller.getCollection('casted_powers').off(null, null, this);

            $.Observer().unsubscribe('layout_town_name_area');
        }
    });

    window.GameViews.LayoutTownNameArea = LayoutTownNameArea;
}());