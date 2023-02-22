/* globals GameData, HelperBrowserEvents */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var HeroesTrainView = BaseView.extend({
        // basics
        controller: null,
        l10n: null,

        // models for this view
        player_hero: null,
        player_ledger: null,
        heroes: null,

        // component related
        sub_context: 'exchange_currency',
        slider: null,
        textbox: null,
        progress_bar: null,
        use_coins_button: null,

        /**
         * set up variables and trigger render
         */
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.player_hero = this.controller.getModel('player_hero');
            this.player_ledger = this.controller.getModel('player_ledger');
            this.heroes = this.controller.getModel('heroes');

            this.l10n = this.controller.getl10n('index');

            this.registerListener();
            this.render();
        },

        /**
         * Listen for changes on connected models
         */
        registerListener: function() {
            this.player_ledger.onCoinsOfWarAndWisdomChange(this, this.updateCoinsMax.bind(this));
            this.listenTo(this.player_hero, 'change', this.reRender.bind(this), this);
        },

        /**
         * Render template
         *
         * @returns {*}
         */
        render: function() {
            var player_hero = this.player_hero,
                level = player_hero.getLevel(),
                hero_data = GameData.heroes[player_hero.getId()],
                l10n = this.l10n;

            this.$el.html(us.template(this.controller.getTemplate('heroes_train'), {
                l10n: l10n,
                hero: player_hero,
                hero_data: hero_data,
                max_level: player_hero.hasMaxLevel(),
                attack: this.getStatsValueAndIncrease(hero_data.attack, level),
                def_hack: this.getStatsValueAndIncrease(hero_data.def_hack, level),
                def_pierce: this.getStatsValueAndIncrease(hero_data.def_pierce, level),
                def_distance: this.getStatsValueAndIncrease(hero_data.def_distance, level),
                bonus_effect: this.getHeroBonusEffectValueAndIncrease(player_hero, level)
            }).replace(/\s+/g, ' ').replace("\r\n", "").replace("\r", "").replace("\n", "").trim());

            if (!player_hero.hasMaxLevel()) {
                this.registerViewComponents();
            }

            return this;
        },

        /**
         * Rerender template
         */
        reRender: function() {
            this.unregisterViewComponents();
            this.render();
        },

        /**
         * update all coins depending components
         */
        updateCoinsMax: function() {
            var player_hero = this.player_hero,
                player_ledger = this.player_ledger,
                max_coins = player_hero.isHeroOfWar() ? player_ledger.getCoinsOfWar() : player_ledger.getCoinsOfWisdom(),
                current_experience_points = player_hero.getExperiencePoints(),
                next_level_limit = this.heroes.getExperienceLimit(player_hero.getLevel() + 1);

            var max_value = Math.min(max_coins, next_level_limit - current_experience_points);

            this.textbox.setValue(max_value);
            this.textbox.setMax(max_value);

            this.slider.setValue(max_value);
            this.slider.setMax(max_value);

            if (max_coins === 0) {
                this.textbox.disable();
                this.slider.disable();
                this.use_coins_button.disable();
            } else {
                this.textbox.enable();
                this.slider.enable();
                this.use_coins_button.enable();
            }
        },

        /**
         * register all view components
         */
        registerViewComponents: function() {
            var $el = this.$el,
                controller = this.controller,
                player_hero = this.player_hero,
                l10n = this.l10n,
                sub_context = this.sub_context,
                max_coins = this.getMaximumCoins(),
                current_experience_points = player_hero.getExperiencePoints(),
                next_level_limit = this.heroes.getExperienceLimit(player_hero.getLevel() + 1),
                use_coins_button_tooltip = this.getActualCoinButtonTooltip(),
                on_mouseover_event_name = HelperBrowserEvents.getOnMouseOverEventName();

            this.use_coins_button = controller.registerComponent('btn_hero_use_coins', $el.find('.button_new.use_coins').button({
                caption: l10n.use_coins,
                state: max_coins === 0 || player_hero.attacksTown(),
                disabled: max_coins === 0 || player_hero.attacksTown(),
                tooltips: [{
                    title: this.get
                }, {
                    title: use_coins_button_tooltip
                }]
            }).on(on_mouseover_event_name, (function(e) {
                var $el = $(e.target);
                $el.tooltip(this.getActualCoinButtonTooltip()).showTooltip();
            }).bind(this)).on("btn:click", (function() {
                player_hero.levelUpHero(this.textbox.getValue());
            }).bind(this)), sub_context);

            var maxValue = Math.min(max_coins, next_level_limit - current_experience_points);

            this.progress_bar = controller.registerComponent('pb_exp', $el.find('.pb_exp').singleProgressbar({
                value: current_experience_points + maxValue,
                max: next_level_limit
            }), sub_context);

            this.textbox = controller.registerComponent('spend_coins_slider_area_textbox', $el.find('.spend_coins_slider_area .textbox').textbox({
                type: 'number',
                value: maxValue,
                max: maxValue,
                hidden_zero: false
            }).on('txt:change:value', (function(e, value) {
                this.slider.setValue(value, {
                    silent: true
                });
                this.progress_bar.setValue(current_experience_points + value);
            }).bind(this)), sub_context);

            this.slider = controller.registerComponent('spend_coins_slider_area_slider', $el.find('.spend_coins_slider_area .slider').grepoSlider({
                max: maxValue,
                min: 0,
                step: 1,
                value: maxValue,
                snap: true
            }).on('sl:change:value', (function(e, _sl, value) {
                this.textbox.setValue(value, {
                    silent: true
                });
                this.progress_bar.setValue(current_experience_points + value);
            }).bind(this)), sub_context);
        },

        getStatsValueAndIncrease: function(base_value, level) {
            return {
                current: this.calculateStatsValueByLevel(base_value, level),
                increase: this.calculateStatsValueByLevel(base_value, level + 1)
            };
        },

        calculateStatsValueByLevel: function(base_value, level) {
            return base_value + (base_value * level / 10);
        },

        getHeroBonusEffectValueAndIncrease: function(hero, level) {
            var bonus_unit = hero.getBonusUnit();

            return {
                current: this.calculateHeroBonusEffectForLevel(hero, level) + bonus_unit,
                increase: this.calculateHeroBonusEffectForLevel(hero, level + 1) + bonus_unit
            };
        },

        calculateHeroBonusEffectForLevel: function(hero, level) {
            var effect = hero.getCalculatedBonusForLevel(level) * 100;
            return parseFloat((effect).toFixed(2)).toPrecision();
        },

        /**
         * Returns the current maximum coin number of the player
         *
         * @returns {Integer}
         */
        getMaximumCoins: function() {
            var player_hero = this.player_hero,
                player_ledger = this.player_ledger;

            return player_hero.isHeroOfWar() ? player_ledger.getCoinsOfWar() : player_ledger.getCoinsOfWisdom();
        },

        /**
         * Returns the actual tooltip state for the button tooltip. We need this since the button has three states instead of two.
         *
         * @returns {String}
         */
        getActualCoinButtonTooltip: function() {
            var use_coins_button_tooltip, l10n = this.l10n,
                player_hero = this.player_hero,
                max_coins = this.getMaximumCoins();

            if (max_coins === 0) {
                use_coins_button_tooltip = l10n.use_coins_no_coins_tooltip;
            } else if (player_hero.attacksTown()) {
                use_coins_button_tooltip = l10n.use_coins_hero_in_attack_tooltip;
            } else {
                use_coins_button_tooltip = l10n.use_coins_tooltip;
            }

            return use_coins_button_tooltip;
        },

        /**
         * unregister all components
         */
        unregisterViewComponents: function() {
            this.controller.unregisterComponents(this.sub_context);
        },

        destroy: function() {
            this.unregisterViewComponents();
            this.stopListening();
        }
    });

    window.GameViews.HeroesTrainView = HeroesTrainView;
}());