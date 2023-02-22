/*global GameMixins*/
(function() {
    'use strict';

    var ConstructionQueueInstantBuyBaseController = function(ParentClass) {
        var Class = ParentClass.extend(GameMixins.IntantBuyController);

        return Class.extend({
            rerenderPage: function() {
                ParentClass.prototype.rerenderPage.apply(this, arguments);

                this.registerUpdatePremiumButtonsCaptionsTimer();
            },

            renderPage: function() {
                ParentClass.prototype.renderPage.apply(this, arguments);
            },

            registerEventsListeners: function() {
                ParentClass.prototype.registerEventsListeners.apply(this, arguments);

                this.registerUpdatePremiumButtonsCaptionsTimer();
            },

            destroy: function() {
                ParentClass.prototype.destroy.apply(this, arguments);
            }
        });
    };

    window.GameControllers.ConstructionQueueInstantBuyBaseController = ConstructionQueueInstantBuyBaseController;
}());