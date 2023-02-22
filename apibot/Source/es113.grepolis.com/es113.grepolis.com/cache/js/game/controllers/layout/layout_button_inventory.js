/*global GameViews, GameControllers, WF, GameEvents */

(function() {
    'use strict';

    var LayoutButtonInventoryController = GameControllers.BaseController.extend({
        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        rerenderPage: function() {
            this.view.setCount();
        },

        renderPage: function() {
            this.view = new GameViews.LayoutButtonInventory({
                el: this.$el,
                controller: this
            });

            this.registerEventsListeners();

            return this;
        },

        registerEventsListeners: function() {
            this.getCollection('inventory_items').onCountChange(this, this.rerenderPage.bind(this));
            this.getModel('inventory').onChange(this, this.rerenderPage.bind(this));
            this.observeEvent(GameEvents.window.inventory.item_added, this.view.flash.bind(this.view));
        },

        handleClickEvent: function() {
            WF.open('inventory');
        },

        getCount: function() {
            return this.getCollection('inventory_items').getCount();
        },

        isFull: function() {
            return this.getCount() >= this.getModel('inventory').getAmountOfAccessibleSlots();
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutButtonInventoryController = LayoutButtonInventoryController;
}());