/* globals GrepolisModel */

(function() {
    "use strict";

    var Player = function() {};

    Player.urlRoot = 'Player';

    GrepolisModel.addAttributeReader(Player,
        'name',
        'alliance_id',
        'alliance_name',
        'alliance_rights',
        'cultural_points',
        'available_cultural_points',
        'player_game_phase',
        'tutorial_skipped',
        'quests_closed',
        'domination_artifact_unlocked',
        'olympus_artifact_unlocked',
        'needed_cultural_points_for_next_step',
        'cultural_step',
        'additional_town_count',
        'id'
    );

    Player.onChangeAllianceMembership = function(obj, callback) {
        obj.listenTo(this, 'change:alliance_id', callback);
    };

    Player.onChangeQuestsClosed = function(obj, callback) {
        obj.listenTo(this, 'change:quests_closed', callback);
    };

    Player.onCulturalPointsChange = function(obj, callback) {
        obj.listenTo(this, 'change:cultural_points', callback);
    };

    Player.saveReminders = function(props, callback) {
        this.execute('saveReminders', props, callback);
    };

    window.GameModels.Player = GrepolisModel.extend(Player);
}());