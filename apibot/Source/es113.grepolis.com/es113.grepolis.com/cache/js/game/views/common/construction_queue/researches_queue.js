/*global GameViews */

(function() {
    'use strict';

    var ResearchesQueueView = GameViews.ConstructionQueueBaseView.extend({
        rerender: function() {
            GameViews.ConstructionQueueBaseView.prototype.rerender.apply(this, arguments);
        },

        destroy: function() {
            GameViews.ConstructionQueueBaseView.prototype.destroy.apply(this, arguments);
        }
    });

    window.GameViews.ResearchesQueueView = ResearchesQueueView;
}());