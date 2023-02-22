define('collections/artifacts/player_artifacts', function() {
    'use strict';

    var GrepolisCollection = require_legacy('GrepolisCollection'),
        PlayerArtifact = require('models/artifacts/player_artifact');

    var PlayerArtifactsCollection = GrepolisCollection.extend({
        model: PlayerArtifact,
        model_class: 'PlayerArtifact',

        getArtifact: function(id) {
            return this.findWhere({
                artifact: id
            });
        },

        onChange: function(obj, callback) {
            obj.listenTo(this, 'add change remove', callback);
        }
    });

    window.GameCollections.PlayerArtifacts = PlayerArtifactsCollection;

    return PlayerArtifactsCollection;
});