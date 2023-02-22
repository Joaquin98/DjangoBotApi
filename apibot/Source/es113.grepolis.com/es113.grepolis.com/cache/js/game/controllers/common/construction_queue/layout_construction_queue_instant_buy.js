/*globals ConstructionQueueHelper, GameControllers */
(function() {
    'use strict';

    var LayoutConstructionQueueInstantBuyController = GameControllers.LayoutConstructionQueueController.extend({
        getInstantBuyType: function() {
            return ConstructionQueueHelper.BUILDING;
        }
    });

    window.GameControllers.LayoutConstructionQueueInstantBuyController = LayoutConstructionQueueInstantBuyController;
}());