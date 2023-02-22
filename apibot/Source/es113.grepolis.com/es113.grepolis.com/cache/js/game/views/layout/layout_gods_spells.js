/*global Game, GameData, GameEvents, HelperBrowserEvents */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    /**
     * view for the new ui god spells, on the right site under the units
     *
     * .render is called, if the view is displayed (if switched from the units to powers)
     * .cleanUpSpells is called, if the view is hidden (switched back to units)
     *
     * @class LayoutGodsSpells
     */
    var LGS = {
        $parent: null,

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.$parent = options.$parent;
            this.l10n = this.controller.getl10n();

            this.$menu = this.$parent.find('.gods_spells_menu');
            this.$content = this.$menu.find('.middle .content');
            this.$btn = this.$el.find('.btn_gods_spells');
            this.$btn_close_all = this.$parent.find('.btn_close_all_windows');

            this.player_gods = this.controller.getModel('player_gods');
            this.casted_powers = this.controller.getCollection('casted_powers');

            this.registerViewComponents();
            this.render();
        },

        registerViewComponents: function() {
            this.controller.registerComponent('btn_gods_spells', this.$btn.button({
                template: 'internal'
            }).on('btn:click', this.openSpellsMenu.bind(this)));
        },

        render: function() {
            this.renderSpells();
        },

        renderSpells: function() {
            var controller = this.controller,
                castable_powers = this.player_gods.getCastablePowersOnTownForAvailableGods(),
                l10n_tooltips_spells = this.l10n.tooltips.spells,
                tooltip = '<strong>' + l10n_tooltips_spells.title +
                '</strong><br><br>' + l10n_tooltips_spells.text;

            this.cleanUpSpells();

            for (var god_id in castable_powers) {
                if (castable_powers.hasOwnProperty(god_id)) {
                    castable_powers[god_id] = castable_powers[god_id].filter(function(power_id) {
                        //illusion needs to be filtered manually because it's not a negative power
                        return !this.controller.isPowerNegative(power_id) && power_id !== 'illusion';
                    }.bind(this));
                }
            }

            //Render Template
            this.$content.html(us.template(controller.getTemplate('gods_powers'), {
                castable_powers: castable_powers,
                l10n: this.l10n,
                player_gods: this.player_gods
            }));

            this.$god_containers = this.$content.find('.god_containers');
            this.$god_containers.toggle(this.$parent.hasClass('gods_spells_active'));

            this.initializeSpellsContainerComponents();
            this.initButtonsStates();

            this.controller.publishViewHeight(this.controller.getComponent('btn_gods_spells').getState());

            this.controller.unregisterComponent('btn_close');
            this.controller.registerComponent('btn_close', this.$menu.find('.btn_close').button({
                template: 'empty'
            }).on('btn:click', this.openSpellsMenu.bind(this)));

            this.$content.find('.info_icon').tooltip(tooltip, {
                width: 400
            });
        },

        openSpellsMenu: function() {
            var MENU_OPEN_RIGHT = 134,
                MENU_CLOSED_RIGHT = -10,
                MENU_SLIDE_DURATION = 300,
                SPELLS_SLIDE_DURATION = 500,
                animation_in_progress = this.$god_containers.is(':animated') || this.$menu.is(':animated');

            if (animation_in_progress) {
                return;
            }

            if (this.$parent.hasClass('gods_spells_active')) {
                this.$god_containers.slideUp(SPELLS_SLIDE_DURATION, function() {
                    this.$menu.animate({
                        right: MENU_CLOSED_RIGHT
                    }, MENU_SLIDE_DURATION, function() {
                        this.publishViewHeight();
                        this.$parent.toggleClass('gods_spells_active');
                    }.bind(this));
                }.bind(this));
            } else {
                this.$menu.animate({
                    right: MENU_OPEN_RIGHT
                }, MENU_SLIDE_DURATION, function() {
                    this.$god_containers.slideDown(SPELLS_SLIDE_DURATION, this.publishViewHeight.bind(this));
                }.bind(this));

                this.$parent.toggleClass('gods_spells_active');
            }

            this.$btn.toggleState();

            this.$btn.toggleClass('checked');
        },

        publishViewHeight: function() {
            this.controller.publishViewHeight(this.$btn.getState());
        },

        initializeSpellsContainerComponents: function() {
            var _self = this,
                controller = this.controller;
            var on_mouseover_event_name = HelperBrowserEvents.getOnMouseOverEventName();

            this.$content.find('.js-power-icon').each(function(index, el) {
                var $el = $(el),
                    power_id = $el.data('power_id'),
                    town_id = parseInt(Game.townId, 10);

                _self.controller.registerComponent('powers_button_' + power_id, $el.button({
                    template: 'internal'
                }).on('btn:click', function(e, _btn) {
                    var casted_power = controller.getCollection('casted_powers').getPower(power_id),
                        is_my_own_town = controller.getCollection('towns').isMyOwnTown(town_id);

                    controller.btnSpellClickHandler.call(controller, town_id, Game.townName, casted_power, is_my_own_town, function() {
                        $.Observer(GameEvents.command.cast_power).publish({
                            power_id: power_id
                        });
                    }, _btn);
                }).on(on_mouseover_event_name, controller.btnSpellMouseOverHandler.bind(controller)), 'powers_buttons');
            });

            this.initializeActivePowersAnimation(this.controller.getCastedPowers());
        },

        initializeActivePowersAnimation: function(casted_powers) {
            for (var i = 0, l = casted_powers.length; i < l; i++) {
                this.addActiveStatus(casted_powers[i]);
            }
        },

        addActiveStatus: function(casted_power) {
            var power_id = casted_power.getPowerId(),
                $el = this.$god_containers.find('.js-power-icon.' + power_id),
                button = this.controller.getComponent('powers_button_' + power_id, 'powers_buttons');

            if (button) {
                $el.addClass('active_animation');
                this.updateButtonsStates(casted_power.getGodId());
            }
        },

        cleanUpSpells: function() {
            this.controller.unregisterComponents('powers_buttons');
            this.controller.unregisterComponents('powers_buttons_animations');

            this.$content.empty();
        },

        initButtonsStates: function() {
            var gods = this.player_gods.getGodsInTowns(),
                god_idx, gods_length = gods.length,
                god;

            for (god_idx = 0; god_idx < gods_length; ++god_idx) {
                god = gods[god_idx];
                this.updateButtonsStates(god);
            }
        },

        updateButtonsStates: function(god_id) {
            if (!god_id) {
                return;
            }

            var available_powers = this.$menu.find(".god_container[data-god_id='" + god_id + "'] .js-power-icon"),
                _self = this,
                current_favor = this.controller.getCurrentFavorForGod(god_id);

            available_powers.each(function(index, el) {
                var $el = $(el),
                    power_id = $el.data('power_id'),
                    gd_power = GameData.powers[power_id],
                    has_enough_favor = current_favor >= gd_power.favor,
                    casted_power = _self.casted_powers.getPower(power_id),
                    extendable = !!(casted_power && casted_power.isExtendable()),
                    button = _self.controller.getComponent('powers_button_' + power_id, 'powers_buttons');

                if (!button) {
                    return;
                }

                if ((!has_enough_favor && !casted_power) || (casted_power && !extendable)) {
                    button.disable();
                } else {
                    button.enable();
                }

                if (extendable) {
                    $el.addClass('extendable');
                } else {
                    $el.removeClass('extendable');
                }

                $el.find('.amount .value').html(parseInt(current_favor / gd_power.favor, 10));
            });
        },

        renderGodsFavorValues: function() {
            var gods = this.player_gods.getGodsInTowns(),
                god_idx, gods_length = gods.length,
                god;

            for (god_idx = 0; god_idx < gods_length; ++god_idx) {
                god = gods[god_idx];
                this.renderGodFavorValue(god);
            }
        },

        renderGodFavorValue: function(god_id) {
            var $god_element = this.$menu.find(".god_container[data-god_id='" + god_id + "'] .current_value");

            $god_element.html(this.player_gods.getCurrentFavorForGod(god_id));

            this.updateButtonsStates(god_id);
        },

        destroy: function() {

        }
    };

    window.GameViews.LayoutGodsSpells = BaseView.extend(LGS);
}());