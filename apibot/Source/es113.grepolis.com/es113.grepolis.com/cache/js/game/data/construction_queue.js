/*globals GameDataPremium, GameModels, GameDataResearches */

(function(window) {
    'use strict';

    var GameDataConstructionQueue = {
        /**
         * Returns size of the construction queue
         *
         * Check strategies for construction queues to get types
         *
         * @return {Integer}
         */
        getLength: function(queue_type) {
            if (queue_type.indexOf('type_unit_queue') > -1) {
                return 7;
            } else {
                return GameDataPremium.hasCurator() ? 7 : 2;
            }
        },

        getBuildingOrdersQueueLength: function() {
            return this.getLength('type_building_queue');
        },

        getResearchOrdersQueueLength: function() {
            return this.getLength('type_research_queue');
        },

        getUnitOrdersQueueLength: function() {
            return this.getLength('type_unit_queue');
        },

        getQueueCssClasses: function(queue_length) {
            var css_class = '';

            if (queue_length === 0) {
                css_class += 'empty_queue';
            }

            if (queue_length === 1) {
                css_class += ' one_order';
            }

            return css_class;
        },

        getQueueItemCssClasses: function(order, index, queue_length) {
            var item_css_class = '';

            if (index === 0) {
                item_css_class += ' first_order';
            }

            if (index === 0 && queue_length === 1) {
                item_css_class += ' only_order';
            }

            if (index === queue_length - 1) {
                item_css_class += ' last_order';
            }

            if (order.isBeingTearingDown()) {
                item_css_class += ' tearing_down';
            }

            return item_css_class;
        },

        getOrderCssClass: function(order) {
            return order instanceof GameModels.ResearchOrder ?
                GameDataResearches.getResearchCssClass(order.getType()) :
                order.getType();
        }
    };

    window.GameDataConstructionQueue = GameDataConstructionQueue;
}(window));