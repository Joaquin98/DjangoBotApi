/* global window */

define('models/player/daily_login_bonus', function(require) {
    'use strict';

    var GrepolisModel = window.GrepolisModel;
    var DailyLoginBonus = GrepolisModel.extend({
        urlRoot: 'DailyLoginBonus',

        openMysteryBox: function(callbacks) {
            return this.execute('openBox', {}, callbacks);
        },

        forceUpdate: function(callbacks) {
            return this.execute('forceUpdate', {}, callbacks);
        },

        useReward: function(callbacks) {
            return this.execute('useReward', {}, callbacks);
        },

        stashReward: function(callbacks) {
            return this.execute('stashReward', {}, callbacks);
        },

        trashReward: function(callbacks) {
            return this.execute('trashReward', {}, callbacks);
        },

        acceptReward: function(opt, callback) {
            this.execute('accept', {
                option: opt
            }, callback);
        },

        onRewardsChange: function(obj, callback) {
            obj.listenTo(this, 'change', callback);
        },

        /**
         * simple callback with .on, used by the global listener
         */
        onNewBonusReceived: function(callback) {
            this.on('change', function() {
                if (this.getAcceptedAt() === null) {
                    callback();
                }
            }.bind(this));
        },

        getRewardData: function() {
            return this.get('reward');
        },

        getExpireDate: function() {
            return this.get('expires');
        }

    });

    GrepolisModel.addAttributeReader(DailyLoginBonus.prototype,
        'id',
        'accepted_at',
        'level',
        'open',
        'expires'
    );

    window.GameModels.DailyLoginBonus = DailyLoginBonus;
    return DailyLoginBonus;
});