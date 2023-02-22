/*global GameData, TooltipFactory, MousePopup, DM */

(function() {
    "use strict";

    var View = window.GameViews.HeroesBase;

    var HeroesCouncil = View.extend({
        initialize: function() {
            View.prototype.initialize.apply(this, arguments);

            this.l10n = $.extend({}, this.controller.getl10n('council'), DM.getl10n('barracks'));

            this.controller.getModel('player_ledger').onCoinsOfWarAndWisdomChange(this, this.onCoinsChange.bind(this));

            this.render();

            return this;
        },

        rerender: function() {
            this.controller.unregisterComponents();
            this.render();
        },

        /**
         * Render main layout
         */
        render: function() {
            var controller = this.controller,
                heroes_available = controller.areHeroesAvailable(),
                player_ledger = controller.getModel('player_ledger');

            this.$el.html(us.template(controller.getTemplate('council_main'), {
                l10n: this.l10n,
                recruited_all_heroes: controller.hasMaxAmountOfHeroes(),
                heroes_available: heroes_available,
                time_till_next_call: controller.getTimeTillNextCall(),
                coins: {
                    wisdom: player_ledger.getCoinsOfWisdom(),
                    war: player_ledger.getCoinsOfWar()
                },
                council_opened_first_time: controller.isCouncilOpenedFirstTime()
            }));

            if (heroes_available) {
                this.createHeroCards();
            }

            this.registerViewComponents();

            return this;
        },

        createHeroCards: function() {
            var $heroes_list = this.$('.available_heroes'),
                card;

            us.each(this.controller.getCalledHeroes(), function(hero_id, hero_type) {
                card = TooltipFactory.getHeroCard(hero_id, {
                    show_requirements: true,
                    show_description: true
                });

                $heroes_list.append(
                    $('<li class="' + hero_type + '"></li>').append(card)
                );
            });
        },

        /**
         * Register main view components
         */
        registerViewComponents: function() {
            var _self = this,
                controller = this.controller,
                l10n = this.l10n,
                called_heroes = controller.getCalledHeroes(),
                are_heroes_available = controller.areHeroesAvailable(),
                time_till_next_call = controller.getTimeTillNextCall();

            this.initializeSwapHeroesButton();

            this.$('.council_info .timer_box').toggleClass('hidden', controller.isSwapHeroesButtonDisabled());
            if (time_till_next_call && !controller.isSwapHeroesButtonDisabled()) {
                controller.registerComponent('time_till_next_hero_call', this.$('.council_info .timer').singleProgressbar({
                    template: 'tpl_pb_single_nomax',
                    countdown: true,
                    type: 'time',
                    liveprogress: true,
                    value: time_till_next_call
                })).on('pb:cd:finish', function() {
                    controller.forceUpdateHeroesRecruitment();
                });
            }

            if (are_heroes_available) {
                us.each(called_heroes, function(hero_id, type) {
                    var $card = _self.$el.find('.available_heroes .' + type),
                        $el = $card.find('.hire_hero');

                    controller.registerComponent('hire_hero_' + type, $el.button({
                        disabled: !controller.checkIfBuyable(hero_id) || !controller.hasFreeSlots(),
                        state: !controller.checkIfBuyable(hero_id) || !controller.hasFreeSlots(),
                        caption: l10n.hero_card.hire_hero,
                        tooltips: controller.getTooltipsForRecruitButton(hero_id)
                    }).on('btn:click', function() {
                        controller.buyHero({
                            type: hero_id
                        });
                    }));

                    //Initialize description scrollbar
                    controller.registerComponent('description_scrollbar' + type, $card.find('.description_viewport').skinableScrollbar({
                        orientation: 'vertical',
                        skin: 'small_scrollbar',
                        template: 'tpl_small_scrollbar',
                        disabled: false,
                        elements_to_scroll: $card.find('.description_scroller'),
                        element_viewport: $card.find('.description_viewport'),
                        scroll_position: 0
                    }));
                });

                this.initializeStatisticsTooltips();
            }

            this.initializeExchangeCurrencyButton();
            this.initializeCoinsTooltips();

            return this;
        },

        initializeStatisticsTooltips: function() {
            var l10n = this.l10n,
                $statistics = this.$el.find('.statistics');

            //Popups for skills
            $statistics.find('.att_hack').tooltip('<h4>' + l10n.tooltips.att_hack + '</h4>');
            $statistics.find('.att_pierce').tooltip('<h4>' + l10n.tooltips.att_pierce + '</h4>');
            $statistics.find('.att_distance').tooltip('<h4>' + l10n.tooltips.att_distance + '</h4>');

            $statistics.find('.def_pierce').tooltip('<h4>' + l10n.tooltips.def_pierce + '</h4>');
            $statistics.find('.def_distance').tooltip('<h4>' + l10n.tooltips.def_distance + '</h4>');
            $statistics.find('.def_hack').tooltip('<h4>' + l10n.tooltips.def_hack + '</h4>');

            $statistics.find('.booty').tooltip('<h4>' + l10n.tooltips.booty.title + '</h4>' + l10n.tooltips.booty.descr);
            $statistics.find('.speed').tooltip('<h4>' + l10n.tooltips.speed + '</h4>');
        },

        initializeSwapHeroesButton: function() {
            var controller = this.controller,
                l10n = this.l10n;

            controller.registerComponent('btn_call_for_gold', this.$('.btn_call_for_gold').button({
                icon: true,
                icon_type: 'gold',
                caption: l10n.calling,
                state: controller.isSwapHeroesButtonDisabled(),
                disabled: controller.isSwapHeroesButtonDisabled(),
                tooltips: [{
                        title: l10n.mouse_popup.call_hero_for_gold.idle(GameDataHeroes.getPriceForHeroesCall())
                    },
                    {
                        title: l10n.mouse_popup.call_hero_for_gold.disabled
                    }
                ]
            }).on('btn:click', function(e, _btn) {
                BuyForGoldWindowFactory.openBuyCallNewHeroesWindow(_btn, function() {
                    controller.swapOffer();
                    _btn.enable();
                });
            }));
        },

        updateSwapHeroesButton: function() {
            var is_button_disabled = this.controller.isSwapHeroesButtonDisabled();

            this.controller.getComponent('btn_call_for_gold')
                .setState(is_button_disabled)
                .toggleDisable(is_button_disabled);
        },

        onCoinsChange: function(model) {
            var controller = this.controller,
                called_heroes = controller.getCalledHeroes();

            this.$('.currency .coins_of_war span').text(model.getCoinsOfWar());
            this.$('.currency .coins_of_wisdom span').text(model.getCoinsOfWisdom());

            us.each(called_heroes, function(hero_id, type) {
                controller.getComponent('hire_hero_' + type).toggleDisable(!controller.checkIfBuyable(hero_id));
            });
        },

        destroy: function() {
            this.controller.getModel('player_ledger').offCoinsOfWarAndWisdomChange(this);
            this.stopListening();
        }
    });

    window.GameViews.HeroesCouncil = HeroesCouncil;
}());