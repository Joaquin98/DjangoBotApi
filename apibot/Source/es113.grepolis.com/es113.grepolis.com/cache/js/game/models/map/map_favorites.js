/*global GrepolisModel */
(function() {
    "use strict";

    var MapFavorites = function() {};

    MapFavorites.urlRoot = 'MapFavorites';

    /**
     * Returns id of the 'favorite'
     *
     * @return {Number}
     */
    MapFavorites.getId = function() {
        return this.get('id');
    };

    /**
     * Returns name of the 'favorite'
     *
     * @return {String}
     */
    MapFavorites.getName = function() {
        return this.get('name');
    };

    /**
     * Returns id of the player who created the favorite
     *
     * @return {Number}
     */
    MapFavorites.getPlayerId = function() {
        return this.get('player_id');
    };

    /**
     * Returns 'x' coordinate from the favorite
     *
     * @return {Number}
     */
    MapFavorites.getXCoordinate = function() {
        return this.get('x');
    };

    /**
     * Returns 'y' coordinate from the favorite
     *
     * @return {Number}
     */
    MapFavorites.getYCoordinate = function() {
        return this.get('y');
    };

    /**
     * request persisting the current model
     *
     * @returns {void}
     */
    MapFavorites.addFavorite = function() {
        var params = {
            x: this.getXCoordinate(),
            y: this.getYCoordinate(),
            name: this.getName()
        };

        this.execute('addFavorite', params);
    };

    /**
     * request delete of this model
     *
     * @returns {void}
     */
    MapFavorites.deleteFavorite = function() {
        var params = {
            id: this.getId()
        };

        this.execute('deleteFavorite', params);
    };

    window.GameModels.MapFavorites = GrepolisModel.extend(MapFavorites);
}());