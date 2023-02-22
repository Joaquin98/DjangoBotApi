/*global DM, GameEvents, GameDataHeroes, TooltipFactory, us, Game, HelperPlayerHints */

/*
 * This window will be shown after 20 quests are done. It contains the reward and the hero
 * */
(function() {
    'use strict';

    var Controller = window.GameControllers.TabController;

    var heroes_enum = require('enums/heroes');

    var QuestProgress = Controller.extend({
        renderPage: function(data) {
            this.model = data.models.progressable;
            this.l10n = us.extend(DM.getl10n('progessables', 'quest').progressbar.window,
                DM.getl10n('questlog'),
                DM.getl10n('quest_progress'));

            this.renderInfo();

            return this;
        },

        renderInfo: function() {
            var l10n = this.l10n,
                $el = this.$el,
                model = this.model,
                template = DM.getTemplate('quest_progressbar').window;

            $.Observer(GameEvents.window.quest.open).publish({
                quest_type: this.model.get('questtype')
            });

            $el.html(us.template(template, {
                rewards: model.get('rewards'),
                quest_type: model.get('questtype'),
                show_hero_reward: GameDataHeroes.areHeroesEnabled() && !Game.quest_tutorial_andromeda_exists,
                l10n: l10n
            }));

            this.initializeComponents();
        },

        initializeComponents: function() {
            var _self = this,
                l10n = this.l10n,
                $el = this.$el,
                model = this.model,
                rewards = model.get('rewards'),
                i, l = rewards.length,
                reward,
                $reward_icon;

            this.unregisterComponents();

            //Tooltips
            for (i = 0; i < l; i++) {
                reward = rewards[i];
                $reward_icon = $el.find('.reward_icon.' + reward.type + '.' + reward.id);

                if (reward.type === 'power') {
                    $reward_icon.tooltip(TooltipFactory.getBasicPowerTooltipWithoutImage(reward.id));
                } else if (reward.type === 'hero') {
                    $reward_icon.tooltip(TooltipFactory.getHeroCard(reward.id), {}, false);
                }
            }

            this.registerComponent('btn_action:quest_progress_window', $el.find('.btn_action').button({
                caption: l10n.take_reward
            }).on('btn:click', function() {
                _self.openHeroWelcomeScreen();
                _self.window_model.close();
            }));
        },

        /**
         * Hero Welcome Screen is an interstitial which will be open after the player has finished 20 quests.
         * This interstitial will be opened only when the player has received Andromeda (since marketing players might already have another hero)
         */
        openHeroWelcomeScreen: function() {
            var windows = require('game/windows/ids');
            var priorities = require('game/windows/priorities');

            if (GameDataHeroes.areHeroesEnabled() && !GameDataHeroes.hasHeroesWelcomeScreenBeenSeen() && this._hasAndromeda()) {
                this.disableHeroesWelcomeScreen();

                WQM.addQueuedWindow({
                    type: windows.HEROES_WELCOME,
                    priority: priorities.getPriority(windows.HEROES_WELCOME),
                    open_function: function() {
                        return HeroesWelcomeWindowFactory.openHeroesWelcomeWindow();
                    }
                });
            } else {
                var QuestlogWindowFactory = require('features/questlog/factories/questlog'),
                    hero_quest_id = MM.getOnlyCollectionByName('Progressable').getQuestIdByProgressableId('AssignHeroQuest');
                QuestlogWindowFactory.openWindow(hero_quest_id);
            }
        },

        /**
         * Calls action on the server to save that the welcome screen has been seen by the user
         */
        disableHeroesWelcomeScreen: function() {

            HelperPlayerHints.disable('heroes_welcome', function() {
                //Change flag
                GameDataHeroes.setHeroWelcomeHint(false);
            }, true);
        },

        _hasAndromeda: function() {
            return this.getCollection('player_heroes').hasHero(heroes_enum.ANDROMEDA);
        },

        destroy: function() {
            this.$el.empty();
            this.model.off(null, null, this);
        }
    });

    window.GameViews.QuestProgress = QuestProgress;
}());