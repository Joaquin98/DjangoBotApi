/* global  GrepolisModel */

/**
 * Represents invalidated map chunk coordinates.
 * As soon as this model changes, the map fetches the new data for all the listed chunks,
 * updates the map and finally clears this model.
 */
(function() {
    'use strict';

    var MapChunks = function() {};

    MapChunks.urlRoot = 'MapChunks';

    GrepolisModel.addAttributeReader(MapChunks,
        'id',
        'chunks'
    );

    /**
     * Empties the model so that no chunks are marked as invalid
     */
    MapChunks.reset = function() {
        this.clear({
            silent: true
        });
    };

    MapChunks.onChange = function(callback, context) {
        this.on('change', callback, context);
    };

    window.GameModels.MapChunks = GrepolisModel.extend(MapChunks);
}());