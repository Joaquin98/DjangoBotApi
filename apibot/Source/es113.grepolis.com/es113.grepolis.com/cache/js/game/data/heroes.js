/*globals GameData, Game, DM, MM */

define('data/heroes', function() {
    'use strict';

    var GameDataHeroes = {

        /**
         *
         * @returns {Object}
         */
        getMeta: function() {
            return GameData.heroes_meta;
        },

        /**
         * Returns cost of the premium hero slot
         *
         * @return {Number}
         */
        getSlotCost: function() {
            return this.getMeta().premium_slot_cost;
        },

        /**
         * Returns data of single hero
         *
         * @return {Object}
         */
        getHero: function(hero_id) {
            return GameData.heroes[hero_id];
        },

        /**
         * Returns information whether the given string represents name of the hero
         *
         * @param {String} hero_id
         *
         * @return {Boolean}
         */
        isHero: function(hero_id) {
            return GameData.heroes.hasOwnProperty(hero_id);
        },

        getHeroModel: function(hero_id) {
            return MM.getCollections().PlayerHero[0].getHero(hero_id);
        },

        /**
         * Returns hero type
         *
         * @return {String}
         */
        getHeroType: function(hero_id) {
            return GameData.heroes[hero_id].category;
        },

        /**
         * Returns information about whether Heroes feature is enabled or not
         *
         * @return {Boolean}
         */
        areHeroesEnabled: function() {
            return Game.features.heroes_enabled === true;
        },

        /**
         * Sets hero welcome screen setting flag
         *
         * @param value {Boolean}
         */
        setHeroWelcomeHint: function(value) {
            Game.player_hint_settings.heroes_welcome_hint = value;
        },

        /**
         * Determinates whether or not the heroes welcome screen has been seen
         *
         * @return {Boolean}
         */
        hasHeroesWelcomeScreenBeenSeen: function() {
            return !Game.player_hint_settings.heroes_welcome_hint;
        },

        /**
         * Returns amount of heroes that user can possibly get
         *
         * @return {Number}
         */
        getHeroesMaxCount: function() {
            return us.keys(GameData.heroes).length;
        },

        /**
         * get the number of available exclusive heroes
         *
         * @returns {Number}
         */
        getExclusiveHeroCount: function() {
            var count = 0,
                data_heroes = GameData.heroes,
                hero_id;
            for (hero_id in data_heroes) {
                if (data_heroes.hasOwnProperty(hero_id) && data_heroes[hero_id].exclusive) {
                    count++;
                }
            }

            return count;
        },

        /**
         * Returns Returns the count of heroes which are not exclusive.
         * It is needed for the buyable hero slots
         *
         * @returns {Number}
         */
        getHeroesCountWithoutExclusive: function() {
            return this.getHeroesMaxCount() - this.getExclusiveHeroCount();
        },

        /**
         * Returns cost of the halving cure time
         *
         * @return {Number}   amount of gold needed to halve cure time
         */
        getHalveCureTimeCost: function() {
            return this.getMeta().premium_halve_cure_cost;
        },

        /**
         * Returns maximal number of heroes which can be in town
         *
         * @return {Number}
         */
        getMaxHeroesPerTown: function() {
            return this.getMeta().max_heroes_per_town;
        },

        /**
         * get the max level of a hero
         *
         * @returns {Number}
         */
        getMaxLevel: function() {
            return Game.constants.heroes_meta.max_level;
        },

        /**
         * checks if there is any hero who can be trained (leveled up)
         *
         * @returns {bool}
         */
        isAnyTrainableHero: function() {
            var collection = new window.GameCollections.PlayerHeroes(),
                result;

            collection.repopulate();
            result = collection.isAnyTrainableHero();

            return result;
        },

        getCoinsExchangeOfferDenominator: function() {
            return this.getMeta().coins_exchange_offer_denominator;
        },

        getCoinsExchangeOfferNumerator: function() {
            return this.getMeta().coins_exchange_offer_numerator;
        },

        /**
         * Returns settings for the progressbar for Hero which indicates his experience points
         *
         * @param {GameModels.PlayerHero} hero
         * @param {GameModels.Heroes} heroes
         *
         * @return {Object}
         */
        getSettingsForHeroExperienceProgressbar: function(hero, heroes) {
            var l10n = DM.getl10n('heroes', 'overview');

            if (hero.hasMaxLevel()) {
                return {
                    value: 1,
                    max: 1,
                    caption: l10n.max,
                    show_value: false
                };
            } else {
                return {
                    value: hero.getExperiencePoints(),
                    max: heroes.getExperienceLimit(hero.getLevel() + 1)
                };
            }
        },

        /**
         * Returns settings for the leveling up Hero button
         *
         * @param {GameModels.PlayerHero} hero
         *
         * @return {Object}
         */
        getSettingsForLevelingUpHeroButton: function(hero) {
            var l10n = DM.getl10n('heroes', 'overview'),
                max_level = GameDataHeroes.getMaxLevel(),
                hero_level = hero.getLevel(),
                use_coins_button_tooltip;

            if (hero_level === max_level) {
                use_coins_button_tooltip = l10n.btn_level_hero_max;
            } else if (hero.attacksTown()) {
                use_coins_button_tooltip = l10n.btn_level_hero_in_attack;
            } else {
                use_coins_button_tooltip = l10n.btn_level_hero;
            }

            return {
                disabled: hero_level === max_level || hero.attacksTown(),
                state: hero_level === max_level || hero.attacksTown(),
                tooltips: [{
                    title: use_coins_button_tooltip
                }]
            };
        },

        /**
         * Returns settings for the progressbar injured Hero
         *
         * @param {GameModels.PlayerHero} hero
         *
         * @return {Object}
         */
        getSettingsForHeroInjuredProgressbar: function(hero) {
            var l10n = DM.getl10n('heroes', 'common');

            return {
                caption: l10n.healthy,
                clear_timer_if_zero: true,
                show_caption_if_zero: true,
                value: hero.getHealingTimeLeft(),
                max: hero.getHealingTime(),
                liveprogress: true,
                type: 'time',
                countdown: true,
                template: 'tpl_pb_single_nomax'
            };
        },

        /**
         * Returns price in gold of the calling new heroes who can be picked up by user
         *
         * @return {Number}
         */
        getPriceForHeroesCall: function() {
            return this.getMeta().premium_rotate_offer_cost_gold;
        },

        /**
         * Returns an array with all heroes containing necessary informations like hero id, name and level
         *
         * @returns {Array}
         */
        getHeroesObjForHeroPicker: function() {
            var l10n = DM.getl10n('place', 'simulator'),
                all_heroes = [{
                    info: l10n.unassign,
                    value: ''
                }];

            if (GameData.heroes) {
                $.each(GameData.heroes, function(hero_id, hero) {
                    var hero_obj = {
                        value: hero_id,
                        level: hero.name,
                        hero_level: 1
                    };

                    all_heroes.push(hero_obj);
                });
            }
            return all_heroes;
        }
    };

    window.GameDataHeroes = GameDataHeroes;
    return GameDataHeroes;
});