(function() {
    "use strict";

    var Town = window.GameModels.Town;

    /**
     * This model contains only data which can be visible for all players
     */
    var ConstrainedTown = function() {}; // never use this, becasue it will be overwritten

    ConstrainedTown.urlRoot = 'ConstrainedTown';

    /**
     * Returns town id
     *
     * @return {Number}
     */
    ConstrainedTown.getTownId = function() {
        return this.get('id');
    };

    /**
     * Returns town name
     *
     * @return {String}
     */
    ConstrainedTown.getTownName = function() {
        return this.get('name');
    };

    /**
     * Returns owner id
     *
     * @return {Number}
     */
    ConstrainedTown.getPlayerId = function() {
        return this.get('player_id');
    };

    window.GameModels.ConstrainedTown = Town.extend(ConstrainedTown);
}());