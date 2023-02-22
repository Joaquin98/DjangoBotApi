/*global GameData, Game, GrepolisModel, us */

(function() {
    'use strict';

    var QUESTS = require('enums/quests');

    var Progressable;

    Progressable = GrepolisModel.extend({
        urlRoot: 'Progressable',
        defaults: {
            read: false
        },

        initialize: function(attributes) {
            if (!GameData.progressable) {
                // no progressable gameData available (for instance: forum "maximaised window")
                return false;
            }

            this.on('change:progressable_id', this.fetchStaticData, this);

            this.fetchStaticData(attributes);

            return true;
        },

        markAsRead: function(options) {
            if (this.getRead()) {
                return;
            }

            this.execute('markAsRead', {
                progressable_id: this.getProgressableId()
            });
        },

        getRead: function() {
            return this.get('read');
        },

        fetchStaticData: function() {
            this.staticData = GameData.progressable[this.get('progressable_id')];

            if (this.staticData) {
                this.staticData.steps = this._getSteps();
            }

            if (this.staticData) {
                if (this.staticData.hide_icon_if_not_accepted) {
                    this.setBlockRender(true);
                }

                if (this.staticData.show_window === 'quest_welcome') {
                    Game.quest_tutorial_show_welcome_window = true;
                }
            }
            Game.quest_tutorial_running = true;

            return this.staticData;
        },

        /**
         * Load steps from guide definitions and return them
         *
         * @private
         * @returns {Array} of step defintions
         */
        _getSteps: function() {
            var TutorialGuideStepHelper = require('prototype/tutorial/guide_step_helper'),
                GuideStepsDefintions = require('prototype/tutorial/guide_steps_definitions'),
                definitions,
                method,
                steps = [],
                helper = new TutorialGuideStepHelper(this);

            if (GuideStepsDefintions[this.getProgressableId()]) {
                definitions = GuideStepsDefintions[this.getProgressableId()];

                for (method in definitions) {
                    if (definitions.hasOwnProperty(method)) {
                        steps = steps.concat(helper[method].apply(helper, definitions[method]).getUserGuideSteps());
                    }
                }
            }

            return steps;
        },

        getId: function() {
            return this.get('id');
        },

        getSetId: function() {
            throw 'Please implement getSetId for your class if you inherit from Progressables';
        },

        getGroupId: function() {
            throw 'Please implement getGroupId for your class if you inherit from Progressables';
        },

        getStaticData: function() {
            return this.staticData || {};
        },

        getType: function() {
            return this.getStaticData().type;
        },

        getQuestType: function() {
            return this.getStaticData().questtype;
        },

        getClasses: function() {
            return 'quest animate ' + this.getStatus() + (' ' + this.staticData.questtype) + (this.hasStepsShown() ? ' guided' : '');
        },

        getStatus: function() {
            return this.get('state');
        },

        getSummary: function() {
            return this.getStaticData().name;
        },

        hasTask: function() {
            return !!this.getStaticData().tasks.length;
        },

        isRunning: function() {
            return this.getStatus() === QUESTS.RUNNING;
        },

        isSatisfied: function() {
            return this.getStatus() === QUESTS.SATISFIED;
        },

        isViable: function() {
            return this.getStatus() === QUESTS.VIABLE;
        },

        isClosed: function() {
            return this.getStatus() === QUESTS.CLOSED;
        },

        isAborted: function() {
            return this.getStatus() === QUESTS.ABORTED;
        },

        showWindow: function() {
            return this.getStaticData().show_window || false;
        },

        getBlockRender: function() {
            return this.get('block_render_icon');
        },

        setBlockRender: function(bool) {
            this.staticData.hide_icon_if_not_accepted = bool;
            this.set('block_render_icon', bool);
        },

        getConfiguration: function(key) {
            var config = this.get('configuration');
            return key ? config && config[key] : config;
        },

        getProgressableId: function() {
            return this.get('progressable_id');
        },

        /**
         * return the rewards using dynamic data (if given) enhanced with static data
         * @return {array || null}
         */
        getRewards: function() {
            var static_data = this.getStaticData().rewards;
            var dynamic_data = this.getConfiguration('rewards');
            // deep extend to overwrite any static data with their dynamic counterpart
            var toEnhancedData = function(dynamic_reward, index) {
                return $.extend(true, {}, GameData.powers[dynamic_reward.power_id], static_data[index], dynamic_reward);
            };
            return us.extend([], static_data, dynamic_data).map(toEnhancedData);
        },

        /**
         * returns true, if the quest has a reward that has resources or favor as payload
         * @returns {boolean}
         */
        hasRewardsWithResourcesOrFavor: function() {
            var resource_rewards = this.getRewardsWithResourcesOrFavor();
            return resource_rewards.length > 0;
        },

        /**
         * returns the data of 'resoures' or 'favor' rewards
         * @return {Object || null} Reward
         */
        getRewardsWithResourcesOrFavor: function() {
            var rewards = this.getRewards();
            return rewards.filter(function(reward) {
                return reward.type === 'resources' || reward.type === 'favor';
            });
        },

        /**
         * returns all tasks for the quest
         * @return {Object} tasks
         */
        getTasks: function() {
            return this.getStaticData().tasks;
        },

        /**
         * returns if the quest uses OR conditions
         * @return {boolean} isOrConditional
         */
        isOrConditional: function() {
            return this.getStaticData().or_conditions;
        },

        getState: function() {
            return this.get('state');
        }

    });

    Progressable.SELF = 'show_window_self';

    Progressable.ID_PREFIX = 'quest_';

    window.GameModels.Progressable = Progressable;
}());