/*global DM, GameViews */

(function() {
    'use strict';

    var FLASHING_DURATION = 6000;

    var LayoutButtonInventory = GameViews.BaseView.extend({
        initialize: function(options) {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.registerViewComponents();
        },

        registerViewComponents: function() {
            //Register Button controller
            this.controller.registerComponent('btn_inventory', this.$el.button({
                caption: this.controller.getCount(),
                template: 'internal',
                tooltips: [{
                    title: DM.getl10n('inventory', 'window_title')
                }]
            }).on('btn:click', this.controller.handleClickEvent.bind(this.controller)));

            this.setCount();
        },

        setCount: function() {
            var inventory_full = this.controller.isFull();

            this.controller.getComponent('btn_inventory')
                .setCaption(this.controller.getCount())
                .toggleClass('full', inventory_full);
        },

        /**
         * Lets the inventory button blink a few times to draw attention
         */
        flash: function() {
            var $btn = this.controller.getComponent('btn_inventory');
            $btn.addClass('flashing');
            setTimeout(function() {
                $btn.removeClass('flashing');
            }, FLASHING_DURATION);
        }
    });

    window.GameViews.LayoutButtonInventory = LayoutButtonInventory;
}());