(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var CastedPowersModel = window.GameModels.CastedPowers;
    var GameEvents = window.GameEvents;

    var CastedPowers = function() {}; // never use this, becasue it will be overwritten

    CastedPowers.model = CastedPowersModel;
    CastedPowers.model_class = 'CastedPowers';

    CastedPowers.initialize = function() {
        /**
         * we do not sort on model.add during gameload, so we have to do it here manually
         */
        $.Observer(GameEvents.game.start).subscribe(['running_powers'], function() {
            this.sort();
        }.bind(this));

        this.on('change:end_at', this.sort.bind(this));
    };

    CastedPowers.comparator = function(model) {
        var end_at = model.getEndAt();
        if (end_at === null) {
            return Number.MAX_VALUE;
        }

        return end_at;
    };

    /**
     * Returns number of casted powers on the town
     *
     * @return {Integer}
     */
    CastedPowers.getCount = function() {
        return this.models.length;
    };

    /**
     * Returns array of casted powers
     *
     * @return {Array}
     */
    CastedPowers.getCastedPowers = function() {
        return this.models;
    };

    /**
     * Returns power if exists, if not then null
     *
     * @param {String} power_id
     * @return {CastedPower|null}
     *
     */
    CastedPowers.getPower = function(power_id) {
        var powers = this.where({
            power_id: power_id
        });
        return (powers.length > 0) ? powers[0] : null;
    };

    CastedPowers.isContaining = function(power_id) {
        return this.where({
            power_id: power_id
        }).length > 0;
    };

    CastedPowers.onCastedPowerCountChange = function(obj, callback) {
        obj.listenTo(this, 'add remove', callback);
    };

    CastedPowers.onCastedPowerEndAtChange = function(obj, callback) {
        obj.listenTo(this, 'change:end_at', callback);
    };

    window.GameCollections.CastedPowers = GrepolisCollection.extend(CastedPowers);
}());