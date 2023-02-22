/*globals define, Timestamp */

(function() {

    function FeatureBlock() {}

    FeatureBlock.urlRoot = 'FeatureBlock';

    GrepolisModel.addAttributeReader(FeatureBlock,
        'feature_type',
        'town_id',
        'blocked_from',
        'blocked_until'
    );

    /**
     * check if this feature is blocked for given town right now
     *
     * @param {Integer} [town_id]
     * @return {Boolean}
     */
    FeatureBlock.isBlocked = function(town_id) {
        var ts_now = Timestamp.now(),
            blocked_from = this.getBlockedFrom(),
            blocked_until = this.getBlockedUntil();

        if (town_id !== undefined) {
            var blocked_town_id = this.getTownId();

            // this feature block does not affect current town
            if (blocked_town_id > 0 && town_id !== blocked_town_id) {
                return false;
            }
        }

        if ((blocked_from === 0 || blocked_from <= ts_now) && (blocked_until === 0 || blocked_until > ts_now)) {
            return true;
        }

        return false;
    };

    window.GameModels.FeatureBlock = GrepolisModel.extend(FeatureBlock);
}());