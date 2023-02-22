define('models/artifacts/player_artifact', function() {
    'use strict';

    var GrepolisModel = require_legacy('GrepolisModel');

    var PlayerArtifactModel = GrepolisModel.extend({
        urlRoot: 'PlayerArtifact'
    });

    GrepolisModel.addAttributeReader(PlayerArtifactModel.prototype,
        'id',
        'player_id',
        'artifact',
        'level',
        'bonus',
        'bonus_description'
    );

    window.GameModels.PlayerArtifact = PlayerArtifactModel;

    return PlayerArtifactModel;
});