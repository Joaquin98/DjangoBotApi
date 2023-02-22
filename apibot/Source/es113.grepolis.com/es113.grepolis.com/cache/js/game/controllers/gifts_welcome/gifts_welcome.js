/*global GameViews, GameModels, GameControllers */

(function() {
    'use strict';

    var GiftsWelcomeController = GameControllers.AcceptGiftController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function(data) {
            this.setWindowTitle(this.getWindowTitleString());

            this.view = new GameViews.GiftsWelcomeView({
                el: this.$el,
                controller: this
            });

            //this.setExpirationInterval(this.getTimerName(), this.getExpireDate());

            return this;
        },

        getTimerName: function() {
            var cm_context = this.getContext();

            return cm_context.main + '_' + cm_context.sub + '_' + this.getGiftType();
        },

        /**
         *
         * @return {Number|null}
         */
        getExpireDate: function() {
            return this.getGiftData().expires;
        },

        getWindowTitleString: function() {
            var gift_data = this.getGiftData();

            return gift_data.name || gift_data.title;
        },

        getGiftData: function() {
            return this.getPreloadedData().gift_data;
        },

        getGiftFullType: function() {
            return this.getGiftData().type;
        },

        getGiftId: function() {
            return this.getGiftData().id;
        },

        getGiftType: function() {
            return this.getGiftFullType().split('.')[1];
        },

        getName: function() {
            return this.getGiftData().name;
        },

        getGiftLevel: function() {
            return this.getGiftData().level || 0;
        },

        getDescription: function() {
            return this.getGiftData().description;
        },

        isOdysseusGift: function() {
            return this.getGiftFullType() === 'gift.HeroOdysseus';
        },

        isPowerGift: function() {
            /*
             * before the daily login changes, power was treated like a power object.
             * With the new daily login, backend structure was changed, so there is no more a power object, now the power is part of the reward object
             * (before only hero was a part of the reward object), therefor this function contains the check for the type of the reward
             */
            return this.getGiftFullType() === 'gift.inactivity' && (this.getGiftData().rewards[0].reward && this.getGiftData().rewards[0].reward.type === 'power');
        },

        _getFirstPowerReward: function() {
            return this.getGiftData().rewards[0].reward;
        },

        getPowerRewardItem: function() {
            var reward_data = this._getFirstPowerReward(),
                reward = new GameModels.RewardItem({
                    id: reward_data.power_id,
                    level: reward_data.configuration.level,
                    type: reward_data.type,
                    subtype: reward_data.subtype,
                    power_id: reward_data.power_id,
                    configuration: reward_data.configuration
                });
            return reward;
        },

        onBtnGetGiftClick: function() {
            var gift_id = this.getGiftId(),
                gift_type = this.getGiftType(),
                gift_level = this.getGiftLevel();

            this.onAcceptReward(gift_id, '', gift_type, gift_level);
        },

        destroy: function() {
            //controllers.AcceptGiftController.prototype.destroy.apply(this, arguments);
        }
    });

    window.GameControllers.GiftsWelcomeController = GiftsWelcomeController;
}());