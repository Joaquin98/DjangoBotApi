/*global ConstructionQueueHelper, GameControllers, Game */

(function() {
    'use strict';

    var UnitsQueueInstantBuyController = GameControllers.UnitsQueueController.extend({
        registerEventsListeners: function() {
            GameControllers.UnitsQueueController.prototype.registerEventsListeners.apply(this, arguments);

            this.getCollection('feature_blocks').onFeatureBlocksCountChange(this, function() {
                //Rerender units queue
                this.rerenderPage();
                //Register timer to check for next block (end or start)
                this._updateTimerForNextBlockCheck();
            }.bind(this));

            this._updateTimerForNextBlockCheck();
        },

        getInstantBuyType: function() {
            return ConstructionQueueHelper.UNIT;
        },

        areRequirementsFulfilled: function( /*order*/ ) {
            return true;
        },

        _updateTimerForNextBlockCheck: function() {
            var time_left = this.getCollection('feature_blocks').getTheClosestTimeForNextBlockCheckForInstantBuy(Game.townId);

            this.unregisterTimer('next_block_check');

            if (time_left !== -1) {
                this.registerTimerOnce('next_block_check', time_left * 1000, this.rerenderPage.bind(this));
            }
        }
    });

    window.GameControllers.UnitsQueueInstantBuyController = UnitsQueueInstantBuyController;
}());