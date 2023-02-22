/*global GameViews */

(function() {
    'use strict';

    var LayoutConstructionQueue = GameViews.ConstructionQueueBaseView.extend({
        rerender: function() {
            GameViews.ConstructionQueueBaseView.prototype.rerender.apply(this, arguments);
        },

        /**
         * Handles situation when "Minimized windows area" is being shown
         */
        onShowMinimizedWindowsArea: function() {
            this.$el.parents('.ui_construction_queue').addClass('minimized_windows');
        },

        /**
         * Handles situation when "Minimized windows area" is being hidden
         */
        handleOnHideMinimizedWindowsArea: function() {
            this.$el.parents('.ui_construction_queue').removeClass('minimized_windows');
        },

        destroy: function() {
            GameViews.ConstructionQueueBaseView.prototype.destroy.apply(this, arguments);
        }
    });

    window.GameViews.LayoutConstructionQueue = LayoutConstructionQueue;
}());