/*globals GameListeners, Game */
/**
 * This class takes care of the global listeners in the game
 */

(function() {
    'use strict';

    function GlobalListenersManager(models, collections) {
        this.models = models;
        this.collections = collections;


        this.run();
    }

    /**
     * Checks ehether the objects implements necessary methods
     */
    GlobalListenersManager.prototype.run = function() {
        Object.keys(GameListeners).forEach(function(klaas) {
            var listener = GameListeners[klaas];
            if (Game.dev) {
                if (!listener.hasOwnProperty('initialize')) {
                    throw 'Listener in \'GameListeners.GoldTradeInterstitial\' has to implement \'initialize\' method';
                }

                if (!listener.hasOwnProperty('destroy')) {
                    throw 'Listener in \'GameListeners.GoldTradeInterstitial\' has to implement \'destroy\' method';
                }
            }

            listener.initialize(this.models, this.collections);
        }.bind(this));
    };

    window.GlobalListenersManager = GlobalListenersManager;
}());