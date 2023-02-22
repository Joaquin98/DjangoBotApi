(function() {
    'use strict';

    var GameViews = window.GameViews;

    var DialogInterstitial = GameViews.BaseView.extend({
        initialize: function(options) {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.render();
        },

        render: function() {
            this.addEventListeners();

            return this;
        },

        addEventListeners: function() {},

        destroy: function() {

        }
    });

    window.GameViews.DialogInterstitial = DialogInterstitial;
}());