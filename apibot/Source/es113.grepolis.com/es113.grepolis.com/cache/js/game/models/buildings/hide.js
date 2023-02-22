/*global define, console, window, Timestamp */

(function() {
    "use strict";

    var Hide = function() {}; // never use this, because it will be overwritten
    Hide.urlRoot = 'BuildingHide';

    /**
     * execute store iron on api building hide
     *
     * @param {Number} amount
     * @return {void}
     */
    Hide.storeIron = function(amount) {
        var params = {
            iron_to_store: amount
        };

        this.execute('storeIron', params);
    };

    window.GameModels.Hide = GrepolisModel.extend(Hide);
}());