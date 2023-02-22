(function() {
    'use strict';

    var sub_context = 'units_order',
        sub_context_fo = 'first_order',
        sub_context_ic = 'image_countdown';

    var BarracksUnitsOrderView = GameViews.BaseView.extend({
        initialize: function() {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.updateTranslations();
            this.render();
        },

        reRender: function() {
            this.render();
        },

        render: function() {
            var building_type = this.controller.getBuildingType();

            this.$el.html(us.template(this.controller.getTemplate('orders'), {
                building_type: building_type,
                max_orders_count: 7, //@todo
                orders: this.controller.getOrders(building_type),
                finish_for_gold_enabled: GameDataUnits.isBuildTimeReductionEnabled(),
                l10n: this.controller.getl10n()
            }));

            this.registerUnitsOrdersComponents();
            this.initializeFirstOrder();

            return this;
        },

        initializeFirstOrder: function() {
            var building_type = this.controller.getBuildingType();

            var controller = this.controller,
                first_order = this.controller.getFirstOrder(building_type),
                order_id,
                $order;

            controller.unregisterComponents(sub_context_fo);
            controller.unregisterComponents(sub_context_ic);

            if (first_order) {
                order_id = first_order.getId();
                $order = this.$el.find('.order_' + order_id);

                //Timer
                controller.registerComponent('unit_order_coutdown_' + order_id, $order.find('.time').countdown2({
                    value: first_order.getTimeLeft(),
                    display: 'readable_seconds'
                }).on('cd:finish', function() {
                    $order.addClass('finished');
                    //NotificationLoader.resetNotificationRequestTimeout(100);
                    //is already handled in the unit order collection
                }), sub_context_fo);
            }
        },

        updateFirstOrderUnitsLeft: function(order) {
            this.$el.find('.first .count_left').html(order.getUnitsToBuildLeft());
        },

        registerUnitsOrdersComponents: function() {
            var _self = this,
                controller = this.controller;
            var building_type = this.controller.getBuildingType();
            var l10n = this.controller.getl10n();

            controller.unregisterComponents(sub_context);

            //Register all build time reduction buttons
            this.$el.find('.btn_recruit_time_reduction').each(function(index, el) {
                var $el = $(el),
                    order_id = parseInt($el.attr('data-orderid'), 10);

                controller.registerComponent('txt_order_units_' + index, $el.button({
                    template: 'empty',
                    tooltips: [{
                        title: _self.getFinishForGoldPopup(),
                        hide_when_disabled: true
                    }]
                }).on('btn:click', function(e, _btn) {
                    var order = _self.controller.getOrderById(order_id),
                        prev_order = _self.controller.getPreviousOrderById(order.getId(), building_type);

                    var data = {
                        building_type: building_type,
                        order_id: order.getId(),
                        unit_id: order.getUnitId(),
                        completed_at: order.getCompletedAt(),
                        completed_at_prev: prev_order !== null ? prev_order.getCompletedAt() : 0
                    };

                    BuyForGoldWindowFactory.openReductUnitBuildTimeForGoldWindow(_btn, data, function(callbacks) {
                        var controller = GameData.buildings[building_type].controller,
                            action = 'finish_for_gold';

                        gpAjax.ajaxPost(controller, action, {
                            order_id: order.getId()
                        }, true, callbacks);
                    });
                }), sub_context);
            });

            //Register all cancel buttons
            this.$el.find('.btn_cancel').each(function(index, el) {
                var $el = $(el),
                    order_id = parseInt($el.attr('data-orderid'), 10),
                    order = _self.controller.getOrderById(order_id);

                controller.registerComponent('btn_cancel_' + index, $el.button({
                    template: 'empty',
                    tooltips: [{
                        title: controller.getRefundTooltip(order),
                        styles: {
                            width: 400
                        },
                        hide_when_disabled: true
                    }]
                }).on('btn:click', function(e, _btn) {
                    _btn.disable();
                    _self.cancelOrder(order, _btn.enable.bind(_btn));
                }), sub_context);
            });

            //Order popups
            this.$el.find('.order').each(function(index, el) {
                var $el = $(el),
                    order_id = parseInt($el.attr('data-orderid'), 10),
                    order = _self.controller.getOrderById(order_id);

                $el.find('.time').tooltip(s(l10n.completed_at, DateHelper.formatDateTimeNice(order.getCompletedAt(), false)));
            });
        },

        getFinishForGoldPopup: function() {
            var building_type = this.controller.getBuildingType(),
                l10n = this.controller.getl10n();

            return '<span class="bold">' + l10n.text_finish_for_gold_popup[building_type] + '</span><br /><br />' + l10n.available_gold;
        },

        updateTranslations: function() {
            var l10n = this.controller.getl10n(),
                //Cost of the build time reduction
                cost = GameDataUnits.getUnitOrderBuildTimeReductionCost(),
                //Available gold
                gold = this.controller.getAvailableGold();

            var l10n_premium = DM.getl10n('COMMON', 'premium').unit_build_time_reduction;

            $.extend(l10n, {
                finish_for_gold_dialog_text: {
                    barracks: s(ngettext(l10n_premium.question_barracks, l10n_premium.question_barracks_plural, cost), cost),
                    docks: s(ngettext(l10n_premium.question_docks, l10n_premium.question_docks_plural, cost), cost)
                },
                text_finish_for_gold_popup: {
                    barracks: s(ngettext(l10n_premium.tooltip_barracks, l10n_premium.tooltip_barracks_plural, cost), cost),
                    docks: s(ngettext(l10n_premium.tooltip_docks, l10n_premium.tooltip_docks_plural, cost), cost)
                },
                available_gold: s(ngettext(l10n_premium.available_gold, l10n_premium.available_gold_plural, gold), gold)
            });
        },

        cancelOrder: function(order, on_order_request_done) {
            var unit_id = order.getUnitId();
            var building_type = this.controller.getBuildingType();

            gpAjax.ajaxPost(GameData.buildings[building_type].controller, 'cancel', {
                id: unit_id
            }, true, function(data) {
                on_order_request_done();
                $.Observer(GameEvents.command.cancel).publish({
                    unit_id: unit_id
                });
            });
        },

        onToBeCompletedAtChange: function(order) {
            var order_id = order.getId();
            var building_type = this.controller.getBuildingType();
            var l10n = this.controller.getl10n();

            if (order === this.controller.getFirstOrder(building_type)) {
                this.updateFirstOrderUnitsLeft(order);
                this.controller.getComponent('btn_cancel_0', sub_context).setTooltip(this.controller.getRefundTooltip(order));

                this.controller.getComponent('unit_order_coutdown_' + order_id, sub_context_fo).setValue(order.getTimeLeft());
            } else {
                this.$el.find('.order_' + order_id).find('.time').html(DateHelper.readableSeconds(order.getBuildTime()));
            }

            this.$el.find('.order_' + order_id).find('.time').tooltip(s(l10n.completed_at, DateHelper.formatDateTimeNice(order.getCompletedAt(), false)));
        },

        destroy: function() {

        }
    });

    window.GameViews.BarracksUnitsOrderView = BarracksUnitsOrderView;
}());