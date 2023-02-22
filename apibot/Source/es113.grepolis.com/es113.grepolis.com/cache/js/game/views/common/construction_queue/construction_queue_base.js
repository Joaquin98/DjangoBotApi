/*global BuyForGoldWindowFactory, GameDataPremium, GameDataInstantBuy, PopupFactory, us, PremiumWindowFactory, GameViews */

(function() {
    'use strict';

    var ConstructionQueueBaseView = GameViews.BaseView.extend({
        initialize: function(options) {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            //should be moved to the sub view, but is here to don't create another 3 views only to handle it
            this.$el.toggleClass('instant_buy', GameDataInstantBuy.isEnabled());

            this.render();
        },

        rerender: function() {
            this.$el.find('.ui_various_orders').remove();
            this.$el.find('.advisor_container').remove();

            this.unregisterViewDependentEventsListeners();

            this.controller.unregisterComponents(this.controller.getQueueSubContextName());

            this.render();
        },

        render: function() {
            this.renderQueue();

            //Render advisors container only if necessary
            if (this.controller.showAdvisorOverlay()) {
                this.renderAdvisorContainer();
            }
        },

        renderQueue: function() {
            //.show() is because the container is always in the document, but we don't want to show it on the game load (its true for building orders)
            this.$el.append(us.template(this.controller.getQueueTemplate(), {
                orders: this.controller.getOrders(),
                controller: this.controller
            })).show();

            this.registerViewComponents();
            this.registerViewDependentEventsListeners();
        },

        renderAdvisorContainer: function() {
            this.$el.append(us.template(this.controller.getTemplate('advisor_container'), {
                l10n: this.controller.getl10n('construction_queue')
            }));

            this.initializeAdvisorContainer();
        },

        registerViewDependentEventsListeners: function() {
            //nothing here, but is for instant buy
        },

        unregisterViewDependentEventsListeners: function() {
            //nothing here, but is for instant buy
        },

        registerViewComponents: function() {
            var order, orders = this.controller.getOrders(),
                order_id, $order, type;

            var sub_context = this.controller.getQueueSubContextName();

            for (var i = 0, l = orders.length; i < l; i++) {
                order = orders[i];

                order_id = order.getId();
                type = order.getType();
                $order = this.$el.find('.order_id_' + order_id);

                //Timer
                if (this.controller.doInitializeTimer(i)) {
                    this.controller.registerComponent('order_countdown_' + order_id, $order.find('.js-item-countdown').countdown2({
                        value: order.getTimeLeft()
                    }).on('cd:finish', this.controller.onCountdownFinish.bind(this.controller)), sub_context);
                }

                //Progressbar
                if (this.controller.doInitializeProgressbar(i)) {
                    GameDataInstantBuy.initializeProgressbar(this.controller.getQueueStrategy(), this.controller, $order.find('.js-item-progressbar'), order, sub_context);
                }

                //Button - Premium Action
                //Rest of the buttons are moved to the 'cloud'
                if (this.controller.doInitializePremiumButton(i)) {
                    //if the timer ends (is set to 0) don't initialize the button (since it will be removed anyways)
                    if (order.getTimeLeft() > 0) {
                        GameDataInstantBuy.initializePremiumButton(this.controller.getQueueStrategy(), this.controller, $order.find('.js-item-btn-premium-action'), order, sub_context);
                        $order.find('.js-item-btn-premium-action').show();
                    } else {
                        $order.find('.js-item-btn-premium-action').hide();
                    }
                }

                //Button - Cancel Order
                if (i === l - 1) {
                    // only the last can be canceled
                    this.controller.registerComponent('order_cancel_' + order_id, $order.find('.js-item-btn-cancel-order').button({
                        tooltips: [{
                            title: this.controller.getCancelOrderTooltip(order),
                            styles: {
                                "max-width": 430
                            }
                        }]
                    }).on('btn:click', this.controller.onOrderCancel.bind(this.controller, order)), sub_context);
                }

                //Tooltips
                //Add Building name tooltip on the image
                if (!GameDataInstantBuy.isEnabled()) {
                    $order.find('.js-item-icon').tooltip(this.controller.getItemName(type));
                }

                //Add the completion time tooltip
                $order.find('.js-item-countdown').tooltip(this.controller.getCompletionTimeTooltip(order));
            }
        },

        initializeAdvisorContainer: function() {
            var l10n = this.controller.getl10n('construction_queue');

            //Register activate curator button
            this.controller.unregisterComponent('activate_curator');

            this.controller.registerComponent('activate_curator', this.$el.find('.btn_activate_curator').button({
                caption: l10n.advisor_banner.activate(GameDataPremium.getCuratorCost()),
                icon: true,
                icon_type: 'gold',
                icon_position: 'right',
                tooltips: [{
                    title: PopupFactory.texts.curator_hint
                }]
            }).on('btn:click', function(e, _btn) {
                BuyForGoldWindowFactory.openBuyCuratorWindow(_btn, function() {
                    this.controller.extendCurator();
                }.bind(this));
            }.bind(this)));

            // link image to advantages window
            this.$el.find('.curator').on("click", function() {
                PremiumWindowFactory.openAdvantagesTab('curator');
            });
        },

        /**
         * Cleans up HTML and components after removing "Advisor Commercial Box"
         */
        removeAdvisorContainer: function() {
            this.$el.find('.advisor_container').remove();
            this.controller.unregisterComponent('activate_curator');
        },

        destroy: function() {
            this.$el.hide().empty();
        }
    });

    window.GameViews.ConstructionQueueBaseView = ConstructionQueueBaseView;
}());