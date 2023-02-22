(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var LayoutCoins = {

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.$coins_of_wisdom = this.$el.find('.wisdom_coins_box');
            this.$coins_of_war = this.$el.find('.war_coins_box');

            this.render();
        },

        render: function() {
            var war = this.controller.getCoinsOfWar(),
                wisdom = this.controller.getCoinsOfWisdom();

            this.$coins_of_war.text(war);
            this.$coins_of_wisdom.text(wisdom);
            this.$el.tooltip(this.controller.getl10n().coins.tooltip);
        },

        destroy: function() {

        }
    };

    window.GameViews.LayoutCoins = BaseView.extend(LayoutCoins);
}());