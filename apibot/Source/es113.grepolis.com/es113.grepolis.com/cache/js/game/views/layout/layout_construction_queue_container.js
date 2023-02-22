/*global Backbone, GameEvents, BuyForGoldWindowFactory, ConfirmationWindowFactory */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var LayoutConstructionQueueContainer = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = options.l10n;

            this.$el.toggleClass('instant_buy', GameDataInstantBuy.isEnabled());

            this.render();
        },

        render: function() {
            this.registerViewComponents();
        },

        registerViewComponents: function() {
            //Register Hammer button
            this.controller.registerComponent('btn_construction_mode', this.$el.find('.btn_construction_mode').button({
                toggle: true,
                tooltips: [{
                        title: this.l10n.tooltips.construction_mode_inactive
                    },
                    {
                        title: this.l10n.tooltips.construction_mode_active
                    }
                ]
            }).on('btn:click:odd', function() {
                this.controller.publishEvent(GameEvents.ui.layout_construction_queue.construction_mode.activated);
            }.bind(this)).on('btn:click:even', function() {
                this.controller.publishEvent(GameEvents.ui.layout_construction_queue.construction_mode.deactivated);
            }.bind(this)));
        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        },

        destroy: function() {

        }
    });

    window.GameViews.LayoutConstructionQueueContainer = LayoutConstructionQueueContainer;
}());