(function() {
    "use strict";

    var GrepolisCollection = window.GrepolisCollection;
    var MapFavorites = window.GameModels.MapFavorites;

    var PlayerMapFavorites = function() {}; // never use this, becasue it will be overwritten

    PlayerMapFavorites.model = MapFavorites;
    PlayerMapFavorites.model_class = 'MapFavorites';

    /**
     * Returns all 'saved map coordinates' converted to scructure acceptable by
     * dropdown component
     *
     * @return {Array}
     */
    PlayerMapFavorites.getDropDownOptions = function() {
        var favorite, favorites = this.models,
            i, l = favorites.length,
            options = [];

        for (i = 0; i < l; i++) {
            favorite = favorites[i];

            options.push({
                name: favorite.getName(),
                value: favorite.getId(),
                x: favorite.getXCoordinate(),
                y: favorite.getYCoordinate()
            });
        }

        //Sort By
        options.sort(function(a, b) {
            return a.name === b.name ? 0 : (a.name < b.name ? -1 : 1);
        });

        return options;
    };

    PlayerMapFavorites.onChange = function(context, callback) {
        this.on('change', callback, context);
    };

    PlayerMapFavorites.deleteFavorite = function(id) {
        var map_favorites = this.get(id);
        map_favorites.deleteFavorite();
    };

    PlayerMapFavorites.addFavorite = function(name, x, y) {
        var new_map_favorites_model = new this.model({
            x: x,
            y: y,
            name: name
        });
        new_map_favorites_model.addFavorite();
    };

    window.GameCollections.PlayerMapFavorites = GrepolisCollection.extend(PlayerMapFavorites);
}());