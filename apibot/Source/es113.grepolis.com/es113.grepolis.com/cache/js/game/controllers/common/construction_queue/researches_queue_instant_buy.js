/*global ConstructionQueueHelper, GameControllers */

(function() {
    'use strict';

    var ResearchesQueueInstantBuyController = GameControllers.ResearchesQueueController.extend({

        getInstantBuyType: function() {
            return ConstructionQueueHelper.RESEARCH;
        },

        areRequirementsFulfilled: function(order) {
            return true;
        }
    });

    window.GameControllers.ResearchesQueueInstantBuyController = ResearchesQueueInstantBuyController;
}());