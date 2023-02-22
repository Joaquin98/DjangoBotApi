define('models/player/player_happening_main_reward_progress', function() {
    'use strict';

    var GrepolisModel = window.GrepolisModel;
    var PlayerHappeningMainRewardProgress = GrepolisModel.extend({
        urlRoot: 'PlayerHappeningMainRewardProgress',

        spendShards: function(callbacks) {
            this.execute('spendShards', {}, callbacks);
        },

        onRewardsChange: function(obj, callback) {
            obj.listenTo(this, 'change:next_rewards', callback);
        },

        onShardProgressChange: function(obj, callback) {
            obj.listenTo(this, 'change:shard_progress', callback);
        }
    });

    GrepolisModel.addAttributeReader(PlayerHappeningMainRewardProgress.prototype,
        'id',
        'cost',
        'currency_names',
        'event_mechanic',
        'last_number_of_progress_steps',
        'main_reward_collected_count',
        'next_rewards',
        'shard_progress'
    );

    window.GameModels.PlayerHappeningMainRewardProgress = PlayerHappeningMainRewardProgress;
    return PlayerHappeningMainRewardProgress;
});