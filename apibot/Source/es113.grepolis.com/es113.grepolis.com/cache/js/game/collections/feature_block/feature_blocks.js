/*globals Timestamp, us */

(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var FeatureBlock = window.GameModels.FeatureBlock;

    function FeatureBlocks() {}

    FeatureBlocks.model = FeatureBlock;
    FeatureBlocks.model_class = 'FeatureBlock';

    FeatureBlocks.INSTANT_BUY = 'instant_buy';

    /**
     * Checks if given feature in given town is blocked. town_id can be ommitted to check
     * if blocked for whole player
     *
     * @param {String} feature_type
     * @param {Integer} [town_id]
     * @return {Boolean}
     */
    FeatureBlocks.isBlocked = function(feature_type, town_id) {
        var blocks = this.getActiveBlocks(feature_type, town_id);

        return blocks.length > 0;
    };

    /**
     * Returns all active blocks
     *
     * @param {String} feature_type
     * @param {Number} [town_id]
     * @returns {Array}
     */
    FeatureBlocks.getActiveBlocks = function(feature_type, town_id) {
        return this.filter(function(model) {
            return model.getFeatureType() === feature_type && model.isBlocked(town_id);
        });
    };

    /**
     * Returns all blocks active and not active for specific feature.
     *
     * @param {String} feature_type
     * @param {Number} [town_id]
     * @returns {Array}
     */
    FeatureBlocks.getBlocks = function(feature_type, town_id) {
        return this.filter(function(model) {
            var is_feature_type_the_same = model.getFeatureType() === feature_type,
                is_town_id_the_stame = town_id !== undefined ? model.getTownId() === town_id : true; //If town id is not specified then don't check it

            return is_feature_type_the_same && is_town_id_the_stame;
        });
    };

    /**
     * Returns number of seconds after which blocking should be rechecked again.
     *
     * @param {String} feature_type
     * @param {Number} [town_id]
     *
     * @return {Number}
     */
    FeatureBlocks.getTheClosestTimeForNextBlockCheck = function(feature_type, town_id) {
        var blocks = this.getBlocks(feature_type, town_id),
            ts_now = Timestamp.now();

        var closest = us.reduce(blocks, function(closest, block) {
            var blocked_from = block.getBlockedFrom();
            var blocked_until = block.getBlockedUntil();

            //Check the closest block start in the future
            if (blocked_from > ts_now && blocked_from < closest) {
                return blocked_from;
            }

            //Check the closest block end in the future
            if (blocked_until > ts_now && blocked_until < closest) {
                return blocked_until;
            }

            return closest;
        }, Infinity);

        return closest === Infinity ? -1 : closest - ts_now;
    };

    /**
     * Returns the closes time when something will change in the feature blocks.
     * If town_id is not specified it will check all blocks of the type.
     *
     * @param [town_id]
     * @returns {Number}
     */
    FeatureBlocks.getTheClosestTimeForNextBlockCheckForInstantBuy = function(town_id) {
        return this.getTheClosestTimeForNextBlockCheck(this.INSTANT_BUY, town_id);
    };

    /**
     *
     * @param [town_id]
     * @returns {Array}
     */
    FeatureBlocks.getActiveBlocksForInstantBuy = function(town_id) {
        return this.getActiveBlocks(this.INSTANT_BUY, town_id);
    };

    /**
     * Returns whether the instant buy feature is currently blocked or not
     *
     * @param {Number} [town_id]
     * @return {Boolean}
     */
    FeatureBlocks.isInstantBuyBlocked = function(town_id) {
        return this.isBlocked(this.INSTANT_BUY, town_id);
    };

    FeatureBlocks.onFeatureBlocksCountChange = function(obj, callback) {
        obj.listenTo(this, 'add remove', callback);
    };

    window.GameCollections.FeatureBlocks = GrepolisCollection.extend(FeatureBlocks);
}());