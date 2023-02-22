/*global GameDataInstantBuy, GameDataInstantBuy */

(function() {
    'use strict';

    var ConstructionQueueInstantBuyBaseView = function(ParentClass) {
        return ParentClass.extend({
            rerender: function() {
                ParentClass.prototype.rerender.apply(this, arguments);

                this._hideTooltip();
            },

            registerViewDependentEventsListeners: function() {
                this.controller.unregisterComponent(GameDataInstantBuy.TOOLTIP_COMPONENT_NAME);

                var instant_buy_tooltip = this.controller.registerComponent(GameDataInstantBuy.TOOLTIP_COMPONENT_NAME, this.$el.find('.ui_various_orders').instantBuyTooltip({
                    selector: '.js-queue-item:not(.empty_slot)',
                    arrow_position: this.controller.getTooltipPosition()
                }));

                instant_buy_tooltip.on('ibt:load:data', function(e, _ibt, $content, $item) {
                    this._loadDataToTooltip($content, $item);
                }.bind(this)).on('ibt:destroy', function(e, _ibt) {
                    this.controller.unregisterComponents(GameDataInstantBuy.SUB_CONTEXT_NAME);
                }.bind(this));
            },

            unregisterViewDependentEventsListeners: function() {
                this.controller.unregisterComponent(GameDataInstantBuy.TOOLTIP_COMPONENT_NAME);
            },

            _loadDataToTooltip: function($content, $item) {
                var order_id = $item.data('order_id'),
                    order_index = $item.data('order_index');

                var order = this.controller.getOrderById(order_id);

                GameDataInstantBuy.loadInstantBuyTooltipContent(this.controller.getQueueStrategy(), this.controller, $content, order, order_index, order_index);
            },

            _hideTooltip: function() {
                var tooltip = this.controller.getComponent(GameDataInstantBuy.TOOLTIP_COMPONENT_NAME);

                if (tooltip) {
                    tooltip.hideTooltip();
                }
            },

            destroy: function() {
                ParentClass.prototype.destroy.apply(this, arguments);
            }
        });
    };

    window.GameViews.ConstructionQueueInstantBuyBaseView = ConstructionQueueInstantBuyBaseView;
}());