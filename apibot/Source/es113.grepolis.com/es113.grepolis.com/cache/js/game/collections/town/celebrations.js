(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var Celebration = window.GameModels.Celebration;
    var GameEvents = window.GameEvents;

    var Celebrations = function() {}; // never use this, becasue it will be overwritten

    Celebrations.model = Celebration;
    Celebrations.model_class = 'Celebration';

    Celebrations.initialize = function(models, options) {
        this.comparator = function(model) {
            return model.getFinishedAt();
        };

        /**
         * we do not sort on model.add during gameload, so we have to do it here manually
         */
        $.Observer(GameEvents.game.start).subscribe(['celebrations'], function() {
            this.sort();
        }.bind(this));
    };

    /**
     * Returns information whether celebration event is running
     *
     * @param {String} type    celebration type
     * @return {Boolean}
     */
    Celebrations.isRunningCelebration = function(type) {
        var running_celebrations = this.filter(function(model) {
            return model.getCelebrationType() === type;
        });

        return running_celebrations.length > 0;
    };

    /**
     * Returns information whether the "Party" event is running
     *
     * @return {Boolean}
     */
    Celebrations.isPartyRunning = function() {
        return this.isRunningCelebration('party');
    };

    /**
     * Returns information whether the "Theater" event is running
     *
     * @return {Boolean}
     */
    Celebrations.isTheaterRunning = function() {
        return this.isRunningCelebration('theater');
    };

    /**
     * Returns information whether the "Triumph" event is running
     *
     * @return {Boolean}
     */
    Celebrations.isTriumphRunning = function() {
        return this.isRunningCelebration('triumph');
    };

    /**
     * Returns information whether the "Games" event is running
     *
     * @return {Boolean}
     */
    Celebrations.isGamesRunning = function() {
        return this.isRunningCelebration('games');
    };

    Celebrations.onCelebrationsEventsCountChange = function(view, callback) {
        view.listenTo(this, 'add remove', callback);
    };

    window.GameCollections.Celebrations = GrepolisCollection.extend(Celebrations);
}());