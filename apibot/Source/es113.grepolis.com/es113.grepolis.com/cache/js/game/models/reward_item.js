define('models/reward_item', function(require) {
    'use strict';

    var GrepolisModel = window.GrepolisModel;

    var RewardItem = function() {}; // never use this, because it will be overwritten
    RewardItem.urlRoot = 'RewardItem';

    /**
     *
     * @returns {Number}
     */
    RewardItem.getId = function() {
        return this.get('id');
    };

    /**
     * @returns {String}
     */
    RewardItem.getType = function() {
        return this.get('type');
    };

    /**
     * @returns {String}
     */
    RewardItem.isStashable = function() {
        return true;
    };

    /**
     * @returns {String}
     */
    RewardItem.getSubtype = function() {
        return this.get('subtype');
    };

    /**
     * @returns {Number}
     */
    RewardItem.getLevel = function() {
        return this.get('level');
    };

    /**
     * @returns {Object}
     */
    RewardItem.getConfiguration = function() {
        return this.get('configuration');
    };

    /**
     * @returns {String}
     */
    RewardItem.getPowerId = function() {
        return this.get('power_id');
    };

    /**
     * @returns {Number}
     */
    RewardItem.getRewardId = function() {
        return this.get('reward_id');
    };

    /**
     * advent specific
     *
     * @returns {Number}
     */
    RewardItem.getPosition = function() {
        return this.get('position');
    };

    /**
     * Use reward
     *
     * @param {Array} callbacks
     * @param {String} event_id
     * @returns {*|Object}
     */
    RewardItem.use = function(callbacks, event_id) {
        return this.execute('execute', {
            reward_id: this.getId() || this.getRewardId(),
            'event_id': event_id
        }, callbacks);
    };

    /**
     * Discard reward
     *
     * @param {Array} callbacks
     * @param {String} event_id
     * @returns {*|Object}
     */
    RewardItem.trash = function(callbacks, event_id) {
        return this.execute('trash', {
            reward_id: this.getId() || this.getRewardId(),
            'event_id': event_id
        }, callbacks);
    };

    /**
     * Put reward to inventory
     *
     * @param {Array} callbacks
     * @param {String} event_id
     * @returns {*|Object}
     */
    RewardItem.stash = function(callbacks, event_id) {
        return this.execute('stash', {
            reward_id: this.getId() || this.getRewardId(),
            'event_id': event_id
        }, callbacks);
    };

    window.GameModels.RewardItem = GrepolisModel.extend(RewardItem);

    return RewardItem;
});