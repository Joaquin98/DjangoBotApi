/*global GameEvents, TooltipFactory, GameViews,
Game, GameDataHeroes, HeroesWindowFactory */

(function() {
    'use strict';

    var View = window.GameViews.HeroesBase;

    var HeroesOverview = View.extend({
        view_premium_slot: null,
        scrollbar_position: 0,

        initialize: function() {
            View.prototype.initialize.apply(this, arguments);

            //@todo all these events should be in the controller!
            //@todo don't listen on the events directly, always create a method on the model/controller

            var _self = this;

            this.l10n = $.extend({}, this.controller.getl10n('overview'), this.controller.getl10n('common'));

            this.heroes = this.controller.getModel('heroes');
            this.heroes.on('change:available_slots', function() {
                _self.render();
            }, this);

            this.heroes.onCultureSlotsChange(this, function() {
                _self.render();
            });

            $.Observer(GameEvents.town.town_switch).subscribe(['heroes_overview'], function() {
                _self.render();
            });

            /*
             * when switching towns and the window is minimized the view gets renders, without being shown.
             * The causes to scrollbar to have no height. resetSlider fixes it, but reapply the heights after
             * the view is displayed
             */
            $.Observer(GameEvents.window.maximize).subscribe(['heroes_overview'], function() {
                this.render();
            }.bind(this));

            this.controller.getModel('player_ledger').onCoinsOfWarAndWisdomChange(this, this.onCoinsChange.bind(this));

            this.player_heroes_collection = this.controller.getCollection('player_heroes');
            this.player_heroes_collection.on('add', this.render, this);
            this.player_heroes_collection.on('remove', this.render, this);

            //Healing
            this.player_heroes_collection.on('change:cured_at', function(hero) {
                var hero_id = hero.getId();

                // before accessing the components, rerender the view
                // they may not be in the DOM if the hero was not injured previously
                _self.render();

                var pb = this.controller.getComponent('pb_regeneration_' + hero_id),
                    btn = this.controller.getComponent('btn_premium_' + hero_id);

                pb.setMax(hero.getHealingTime()).setValue(hero.getHealingTimeLeft());

                if (btn) {
                    btn.setState(!hero.isInjured());
                    btn.toggleDisable(!hero.isInjured());
                }

            }, this);

            //Sending resources
            this.player_heroes_collection.on('change:level', function(hero) {
                var pb_component = this.controller.getComponent('level_change_indicator_' + hero.getId());
                pb_component.animateIncrease(this.l10n.level(hero.getLevel()));
                this.createHeroCards();
            }, this);

            this.player_heroes_collection.on('change:experience_points change:level', function(hero) {
                var pb_component = this.controller.getComponent('pb_exp_' + hero.getId());
                var btn_component = this.controller.getComponent('btn_send_resources_' + hero.getId());

                if (hero.hasMaxLevel()) {
                    pb_component.setValue(1);
                    pb_component.setMax(1);
                    pb_component.setCaption(this.l10n.max);
                    pb_component.setShowValue(false);

                    btn_component.disable(true);
                } else {
                    pb_component.setMax(this.heroes.getExperienceLimit(hero.getLevel() + 1));
                    pb_component.setValue(hero.getExperiencePoints());
                }

                this.updateExperienceButtonTooltip(hero);
            }, this);

            this.render();
        },

        /**
         * Saves current scrollbar position
         */
        saveScrollbarPosition: function() {
            //Save previous scrollbar position
            var heroes_scrollbar = this.controller.getComponent('heroes_scrollbar');

            if (heroes_scrollbar) {
                this.scrollbar_position = heroes_scrollbar.getSliderPosition();
            }
        },

        /**
         * Restores previously saved scrollbar position
         */
        restoreScrollbarPosition: function() {
            this.controller.getComponent('heroes_scrollbar').scrollTo(this.scrollbar_position);
        },

        /**
         * Render main layout
         */
        render: function() {
            var controller = this.controller,
                player_ledger = controller.getModel('player_ledger'),
                player_heroes = controller.getCollection('player_heroes');

            this.saveScrollbarPosition();

            this.$el.html(us.template(controller.getTemplate('main'), {
                l10n: this.l10n,
                heroes: controller.getHeroes(),
                heroes_max_count: GameDataHeroes.getHeroesMaxCount(),
                heroes_max_slots: GameDataHeroes.getHeroesCountWithoutExclusive() + player_heroes.getExclusiveHeroCount(),
                available_slots: controller.getAvailableSlots(),
                culture_points_for_next_slot: controller.getCulturePointsForNextSlot(),
                the_lowest_level_hero: controller.getTheLowestLevelHeroId(), //used for tutorial quests
                coins: {
                    wisdom: player_ledger.getCoinsOfWisdom(),
                    war: player_ledger.getCoinsOfWar()
                }
            }));
            // add class name from strategy for styling
            this.$el.addClass(this.getStrategyName());

            this.registerViewComponents();
            this.createHeroCards();

            this.restoreScrollbarPosition();

            return this;
        },

        /**
         * Register main view components
         */
        registerViewComponents: function() {
            var _self = this,
                $el = this.$el,
                controller = this.controller,
                l10n = this.l10n;

            controller.unregisterComponents();

            this._destroyBuyHeroSlotView();
            //this is so badd
            this.controller.closeSubWindow();

            //Buy Premium spot
            if (controller.hasSlotsToBuy()) {
                this.view_premium_slot = new GameViews.HeroesBuyHeroSlot({
                    el: $el.find('.hero_locked_slot .premium'),
                    controller: controller
                });
            }

            //Register hero buttons and progressbars
            var hero_id, hero, heroes = controller.getHeroes(),
                i, l = heroes.length,
                hero_of_town;

            var onHeroArrivedToTown = function() {
                    _self.render();
                },
                onAssign = function(hero) {
                    controller.assignToTown(hero.getId());
                },
                onUnassign = function(hero) {
                    controller.unassignFromTown(hero.getId());
                },
                onCancelTravel = function(hero) {
                    controller.cancelTownTravel(hero.getId());
                };

            hero_of_town = controller.getHeroOfTown(Game.townId) || controller.getHeroBeingAssignedToTown(Game.townId);

            for (i = 0; i < l; i++) {
                hero = heroes[i];
                hero_id = hero.getId();

                //Assigning to town
                if (!hero.isAssignedToTown()) {
                    controller.registerComponent('btn_hero_not_assigned_' + hero_id, $el.find('.btn_hero_not_assigned.' + hero_id).button({
                        caption: l10n.btn_assign,
                        disabled: hero_of_town && hero_of_town.getOriginTownId() !== hero.getOriginTownId(),
                        state: hero_of_town && hero_of_town.getOriginTownId() !== hero.getOriginTownId(),
                        tooltips: [{
                            title: l10n.btn_assign_tooltip
                        }, {
                            title: l10n.btn_assign_tooltip_disabled
                        }]
                    }).on('btn:click', onAssign.bind(null, hero)));
                }
                //When Hero is on the way town
                else if (hero.isAssignedToTown() && hero.isTravelingToTown()) {
                    controller.registerComponent('pb_on_the_way_town_' + hero_id, $el.find('.pb_on_the_way_town_' + hero_id).singleProgressbar({
                        value: hero.getTransferToTownTimeLeft(),
                        max: hero.getTransferToTownTime(),
                        liveprogress: true,
                        type: 'time',
                        countdown: true,
                        template: 'tpl_pb_single_nomax',
                        caption: l10n.assignation
                    }).on('pb:cd:finish', onHeroArrivedToTown));
                    //@todo listen on the property in model, because BE tiggers an event

                    controller.registerComponent('btn_cancel_town_travel_' + hero_id, $el.find('.btn_cancel_town_travel.' + hero_id).button({
                        tooltips: [{
                            title: l10n.btn_cancel_town_travel_tooltip
                        }]
                    }).on('btn:click', onCancelTravel.bind(null, hero)));
                }
                //Unassigning
                else if (hero.isAssignedToTown() && !hero.isTravelingToTown()) {
                    controller.registerComponent('btn_hero_unassign_' + hero_id, $el.find('.btn_hero_unassign.' + hero_id).button({
                        caption: l10n.btn_unassign,
                        tooltips: [{
                            title: l10n.btn_unassign_tooltip
                        }]
                    }).on('btn:click', onUnassign.bind(null, hero)));
                }

                //if injured
                this.initializeRegenerationComponents(hero);

                //experience progressbar
                controller.registerComponent('pb_exp_' + hero_id, $el.find('.pb_exp_' + hero_id).singleProgressbar(
                    GameDataHeroes.getSettingsForHeroExperienceProgressbar(hero, this.heroes)
                ));

                //Level change indicators
                controller.registerComponent('level_change_indicator_' + hero.getId(), $el.find('.hero_slot.' + hero.getId() + ' .level').numberChangeIndicator({
                    template: 'empty',
                    caption: l10n.level(hero.getLevel())
                }));
            }

            var onBtnRecruitClick = function() {
                HeroesWindowFactory.openHeroesRecrutingTab();
            };

            //Buy by gold buttons
            this.$el.find('.btn_recruit').each(function(index, el) {
                var $el = $(el);

                controller.registerComponent('btn_recruit_' + index, $el.button({
                    caption: l10n.btn_recruit,
                    tooltips: [{
                        title: l10n.btn_recruit_tooltip
                    }]
                }).on('btn:click', onBtnRecruitClick));
            });

            //Initialize list
            controller.registerComponent('heroes_scrollbar', this.$el.find('.overview_viewport').skinableScrollbar({
                orientation: 'vertical',
                template: 'tpl_skinable_scrollbar',
                skin: 'round',
                disabled: false,
                elements_to_scroll: this.$el.find('.overview_content'),
                element_viewport: this.$el.find('.overview_viewport'),
                scroll_position: 0,
                min_slider_size: 16,
                hide_when_nothing_to_scroll: false
            }));

            $el.find('.js-btn_premium').each(function(index, el) {
                var $el = $(el),
                    hero_id = $el.attr('data-heroid'),
                    hero = controller.getHero(hero_id);

                _self.initializePremiumButton($el, hero);
            });

            $el.find('.btn_send_resources').each(function(index, el) {
                var $el = $(el),
                    hero_id = $el.data('heroid'),
                    hero = _self.player_heroes_collection.getHero(hero_id);

                controller.registerComponent('btn_send_resources_' + hero_id, $el.button(
                    GameDataHeroes.getSettingsForLevelingUpHeroButton(hero)
                ).on('btn:click', function() {
                    HeroesWindowFactory.openHeroesTrainWindow(hero);
                }));
            });

            controller.registerComponent('dropdown_sort', $el.find('#dd_sort_heroes').dropdown({
                value: this.player_heroes_collection.sort_attribute,
                options: [{
                        value: 'level',
                        name: l10n.hero_level_desc
                    },
                    {
                        value: 'origin_town_name',
                        name: l10n.city_name_asc
                    },
                    {
                        value: 'name',
                        name: l10n.hero_name_asc
                    },
                    {
                        value: 'category',
                        name: l10n.hero_type
                    }
                ]
            }).on('dd:change:value', function(event, new_val) {
                this.player_heroes_collection.sortByAttribute(new_val);
            }.bind(this)));

            this.initializeExchangeCurrencyButton();
            this.initializeCoinsTooltips();
        },

        updateExperienceButtonTooltip: function(hero) {
            var $el = this.$el;

            $el.find('.btn_send_resources[data-heroid="' + hero.getId() + '"]').off('mouseover').on('mouseover', function(e) {
                var $el = $(e.target);
                var configuration = GameDataHeroes.getSettingsForLevelingUpHeroButton(hero);

                $el.tooltip(configuration.tooltips[0].title).showTooltip();
            });
        },

        initializeRegenerationComponents: function(hero) {
            this.controller.registerComponent('pb_regeneration_' + hero.getId(), this.$el.find('.pb_regeneration_' + hero.getId()).singleProgressbar(
                GameDataHeroes.getSettingsForHeroInjuredProgressbar(hero)
            ));
        },

        /**
         * Creates Hero Cards Popups for each hero on the list
         */
        createHeroCards: function() {
            var $el = this.$el,
                hero, hero_id, heroes = this.controller.getHeroes(),
                i, l = heroes.length;

            for (i = 0; i < l; i++) {
                hero = heroes[i];
                hero_id = hero.getId();

                $el.find('.hero_slot.' + hero_id + ' .portrait')
                    .tooltip(TooltipFactory.getHeroCard(hero_id, {
                        hero_level: hero.getLevel()
                    }), {}, false);
            }
        },

        onCoinsChange: function(model) {
            this.$('.currency .coins_of_war span').text(model.getCoinsOfWar());
            this.$('.currency .coins_of_wisdom span').text(model.getCoinsOfWisdom());
        },

        _destroyBuyHeroSlotView: function() {
            if (this.view_premium_slot && typeof this.view_premium_slot._destroy === 'function') {
                this.view_premium_slot._destroy();
            }
        },

        destroy: function() {
            this.heroes.off(null, null, this);
            this.player_heroes_collection.off(null, null, this);
            this.controller.getModel('player_ledger').offCoinsOfWarAndWisdomChange(this);
            this.stopListening();

            $.Observer().unsubscribe('heroes_overview');

            this._destroyBuyHeroSlotView();
        }
    });

    window.GameViews.HeroesOverview = HeroesOverview;
}());