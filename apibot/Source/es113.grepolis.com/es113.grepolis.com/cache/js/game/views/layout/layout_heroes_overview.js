/*global GameDataHeroes, HeroesWindowFactory, HeroesWelcomeWindowFactory, Game, us, HelperBrowserEvents */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var PlayerHeroesOverview = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n('main');

            this.render();
        },

        rerender: function() {
            this._destroy();
            this.controller.unregisterComponents();
            this.render();
        },

        render: function() {
            var controller = this.controller;

            this.$el.html(us.template(controller.getTemplate('main'), {
                //General
                l10n: this.l10n,
                heroes_enabled: controller.areHeroesEnabled(),
                //Hero box
                hero: controller.getHeroOfTown(Game.townId),
                hero_being_assinged: controller.getHeroBeingAssignedToTown(Game.townId),
                is_injured_hero_in_town: controller.isStateInjuredHeroInTown(),
                is_healthy_hero_in_town: controller.isStateHealthyHeroInTown(),
                is_hero_attacking: controller.isStateHeroIsAttacking()
            }));

            this.registerViewComponents();

            return this;
        },

        registerViewComponents: function() {
            var l10n = this.l10n,
                $el = this.$el,
                controller = this.controller;
            var hero = controller.getHeroOfTown(Game.townId);
            var hero_being_assinged = controller.getHeroBeingAssignedToTown(Game.townId);
            var hero_in_town_or_coming = hero || hero_being_assinged;

            //Tooltip on the teaser
            $el.find('.teaser').tooltip(controller.areHeroesEnabled() ? l10n.tooltips.say_hi : l10n.tooltips.comming_soon);

            //Click to open heroes window
            $el.find('.hero_in_town')
                .on(
                    'click.layout_heroes_overview',
                    '.hero_icon_border, .single-progressbar, .asclepius_snake_icon',
                    this.handleClickEvent.bind(this)
                );
            $el.find('.teaser').on('click.layout_heroes_overview', this.handleClickEvent.bind(this));

            if (hero || hero_being_assinged) {
                $el.find('.hero_in_town').on('mouseover', '.hero_icon_border', function(e) {
                    var $el = $(e.target);

                    $el.tooltip(this.controller.getHeroIconTooltip(hero || hero_being_assinged)).showTooltip();
                }.bind(this));
            }

            if (hero_in_town_or_coming) {

                if (controller.isStateInjuredHeroInTown()) {
                    // Hero is injured
                    this.initializeHeroInjuredComponents(hero);

                } else if (hero_being_assinged) {
                    //When Hero is on the way town
                    this.initializeHeroOnTheWayComponents(hero_being_assinged);

                } else if (controller.isStateHealthyHeroInTown() || controller.isStateHeroIsAttacking()) {
                    // Hero is healthy or is attacking
                    this.initializeExperienceProgressbar();

                    if (controller.isStateHeroIsAttacking()) {
                        this.initializeAttackIcon(hero);
                    }

                    if (controller.isStateHealthyHeroInTown()) {
                        //Button level up hero
                        this.initializeLevelUpButton(hero);
                    }
                }
            } else {
                //No hero in town
                this.initializeNoHeroInTownButton();
            }
        },

        initializeAttackIcon: function(hero) {
            this.$el.find('.hero_in_town .sword_icon_border')
                .show()
                .tooltip(this.l10n.tooltips.hero_is_attacking + '<br />' + hero.getTargetTownName());
        },

        initializeLevelUpButton: function(hero) {
            var on_mouseover_event_name = HelperBrowserEvents.getOnMouseOverEventName();
            this.controller.registerComponent('btn_experience', this.$el.find('.btn_experience').button(
                GameDataHeroes.getSettingsForLevelingUpHeroButton(hero)
            ).on('btn:click', function() {
                HeroesWindowFactory.openHeroesTrainWindow(hero);
            }).on(on_mouseover_event_name, function(e) {
                var $el = $(e.target);
                var configuration = GameDataHeroes.getSettingsForLevelingUpHeroButton(hero);

                $el.tooltip(configuration.tooltips[0].title).showTooltip();
            }));
        },

        initializeHeroInjuredComponents: function(hero) {
            //Progressbar regeneration
            this.controller.registerComponent('pb_regeneration', this.$el.find('.pb_regeneration').singleProgressbar(
                GameDataHeroes.getSettingsForHeroInjuredProgressbar(hero)
            ));

            this.$el.find('.pb_regeneration, .asclepius_snake_icon')
                .tooltip(this.l10n.tooltip_health_bar, {
                    width: 400
                });
        },

        initializeHeroOnTheWayComponents: function(hero_being_assinged) {
            this.controller.registerComponent('pb_on_the_way_town', this.$el.find('.pb_on_the_way_town').singleProgressbar({
                value: hero_being_assinged.getTransferToTownTimeLeft(),
                max: hero_being_assinged.getTransferToTownTime(),
                liveprogress: true,
                type: 'time',
                countdown: true,
                template: 'tpl_pb_single_nomax',
                caption: this.l10n.assignation
            }));

            this.controller.registerComponent('btn_cancel_town_travel', this.$el.find('.btn_cancel_town_travel').button({
                tooltips: [{
                    title: this.l10n.btn_cancel_town_travel_tooltip
                }]
            }).on('btn:click', function(hero_being_assinged) {
                this.controller.cancelTownTravel(hero_being_assinged.getId());
            }.bind(this, hero_being_assinged)));
        },

        initializeNoHeroInTownButton: function() {
            this.controller.registerComponent('btn_no_hero_in_town', this.$el.find('.btn_no_hero_in_town').button({
                caption: this.l10n.heroes
            }).on('btn:click', function() {
                HeroesWindowFactory.openHeroesWindow();
            }));
        },

        initializeExperienceProgressbar: function() {
            var controller = this.controller,
                hero = controller.getHeroOfTown(Game.townId),
                heroes = controller.getModel('heroes');

            controller.unregisterComponent('pb_experience');
            controller.registerComponent('pb_experience', this.$el.find('.pb_experience').singleProgressbar(
                GameDataHeroes.getSettingsForHeroExperienceProgressbar(hero, heroes)
            ));
        },

        /**
         * Handles click event on the icon and the
         */
        handleClickEvent: function() {
            if (this.controller.areHeroesEnabled()) {
                if (!this.controller.hasHeroesWelcomeScreenBeenSeen()) {
                    this.controller.disableHeroesWelcomeScreen();

                    HeroesWelcomeWindowFactory.openHeroesWelcomeWindow();
                } else {
                    HeroesWindowFactory.openHeroesWindow();
                }
            }
        },

        /**
         * Hides teaser banner
         */
        hideTeaser: function() {
            this.$el.find('.teaser').fadeOut();
        },

        /**
         * Updates experience points in the progressbar
         *
         * @param {GameModels.PlayerHero} hero
         */
        onHeroExperienceChange: function(hero) {
            if (!hero.isInjured() && hero === this.controller.getHeroOfTown(Game.townId)) {
                this.initializeExperienceProgressbar();
                var configuration = GameDataHeroes.getSettingsForLevelingUpHeroButton(hero);
                this.controller.getComponent('btn_experience').disable(configuration.disabled);
            }
        },

        /**
         * Updates cured at progressbar and button to reduce the time
         *
         * @param {GameModels.PlayerHero} hero
         */
        onCuredAtChange: function(hero) {
            if (hero === this.controller.getHeroOfTown(Game.townId)) {
                var pb = this.controller.getComponent('pb_regeneration'),
                    btn = this.controller.getComponent('btn_regeneration');

                pb.setMax(hero.getHealingTime()).setValue(hero.getHealingTimeLeft());
                btn.setState(!hero.isInjured());
                btn.toggleDisable(!hero.isInjured());
            }
        },

        destroy: function() {
            this.$el.off('click.layout_heroes_overview');
        }
    });

    window.GameViews.PlayerHeroesOverview = PlayerHeroesOverview;
}());