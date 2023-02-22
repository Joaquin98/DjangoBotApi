/*global define, us, TownOverviewWindowFactory, BuyForGoldWindowFactory, TooltipFactory, TM, PremiumWindowFactory, DM,
 NotificationLoader, GameDataInstantBuy, ConfirmationWindowFactory, GPWindowMgr, hCommon */

define('views/layout/layout_toolbar_activities', function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var CommandsHelper = require('helpers/commands');
    var FeatureHelper = require('data/features');

    var LayoutToolbarActivities = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.renderTemplate();
            this.registerViewComponents();
        },

        /**
         * Renders main template
         */
        renderTemplate: function() {
            this.$el.html(us.template(this.controller.getTemplate('main'), {
                activity_types: this.controller.getActivityTypes()
            }));
        },

        /**
         * Registers activity components for all sections
         */
        registerViewComponents: function() {
            var activity, activity_types = this.controller.getActivityTypes(),
                i, l = activity_types.length;

            //Initialize all activity buttons
            for (i = 0; i < l; i++) {
                activity = activity_types[i];

                if (this['initialize' + activity.camelCase() + 'Activity']) {
                    this['initialize' + activity.camelCase() + 'Activity'](activity);
                } else {
                    throw 'Please create a method which will initialize "' + activity + '" activity button';
                }
            }
        },

        initializeAttackIndicatorActivity: function() {
            var controller = this.controller;

            controller.registerComponent('wgt_attacks', this.$el.find('.activity.attack_indicator').button({
                state: CommandsHelper.getTotalCountOfIncomingAttacks() > 0,
                template: 'internal',
                caption: controller.getIncomingAttacksCommandsCountCaption(),
                tooltips: [{},
                    {
                        title: this.l10n.incomming_attacks
                    }
                ]
            }).on('btn:click', function() {
                if (controller.getPremiumFeaturesModel().hasCurator()) {
                    TownOverviewWindowFactory.openCommandOverview();
                } else {
                    PremiumWindowFactory.openCommandOverviewAdvantagesFeatureTab();
                }
            }));
        },

        /**
         * Initializes recruits activity bubble menu
         */
        initializeRecruitsActivity: function() {
            var controller = this.controller;

            if (GameDataInstantBuy.isEnabled()) {
                controller.registerComponent('wgt_recruits', this.$el.find('.activity.recruits').toolbarActivityRecruits({
                    templates: controller.getTemplate('list_recruits_order_queues'),
                    l10n: {
                        no_results: this.l10n.no_recruit_results
                    },
                    premium_mode_class: GameDataInstantBuy.isEnabled() ? 'instant_buy' : 'build_time_reduction',
                    state: controller.getUnitOrdersCount() > 0,
                    caption: controller.getUnitOrdersCount(),
                    exclude_click_nodes_for_hide: ['js-item-btn-cancel-order'], // TODO
                    queue_controllers: [{
                            name: 'barracks',
                            getter: controller.getBarracksRecruitingQueueController.bind(controller)
                        }, {
                            name: 'docks',
                            getter: controller.getDocksRecruitingQueueController.bind(controller)
                        }
                        // add more queues here
                    ],
                    destroy_function: controller.destroyQueueController.bind(controller),
                    queue_length_function: controller.getRecruitingQueueLength.bind(controller)
                }).on('btn:click', function() {
                    if (controller.getPremiumFeaturesModel().hasCurator()) {
                        TownOverviewWindowFactory.openMassRecruitOverview();
                    } else {
                        PremiumWindowFactory.openRecruitOverviewAdvantagesFeatureTab();
                    }
                }));
            } else {
                //OLD implementation: showing the orders top to bottom
                controller.registerComponent('wgt_recruits', this.$el.find('.activity.recruits').toolbarActivity({
                    template: controller.getTemplate('list_recruits'),
                    options: controller.getUnitsOrders(),
                    caption: controller.getUnitOrdersCount(),
                    state: controller.hasCurator(),
                    exclude_click_nodes_for_hide: ['reduction', 'remove'],
                    l10n: {
                        no_results: this.l10n.no_recruit_results
                    },
                    tooltips: {
                        btn_remove: function(option) {
                            return TooltipFactory.getRefundTooltip(option.getCancelRefund());
                        }
                    },
                    onOptionInit: function($option) {
                        var $time = $option.find('.time'),
                            $count = $option.find('.count'),
                            order_id = $option.data('id'),
                            order = controller.getUnitOrderById(order_id);

                        return $time.countdown2({
                            timestamp_end: order.getToBeCompletedAt(),
                            display: 'readable_seconds',
                            condition: function(seconds) {
                                var units_left = order.getUnitsToBuildLeft(),
                                    current_units_left = parseInt($count.html(), 10);

                                return units_left !== current_units_left;
                            }
                        }).on('cd:condition', function(e, seconds) {
                            $count.html(order.getUnitsToBuildLeft());
                        });

                    }
                }).on('wgtta:btn:reduce:click', function(e, order_id, _btn) {
                    var order = controller.getUnitOrderById(order_id),
                        prev_order = order.getPreviousOrder();

                    var data = {
                        building_type: order.getProductionBuildingType(),
                        order_id: order.getId(),
                        unit_id: order.getUnitId(),
                        completed_at: order.getCompletedAt(),
                        completed_at_prev: prev_order ? prev_order.getCompletedAt() : 0
                    };

                    BuyForGoldWindowFactory.openReductUnitBuildTimeForGoldWindow(_btn, data, function(callbacks) {
                        order.buildTimeReduct(callbacks);
                    });
                }).on('wgtta:btn:remove:click', function(e, order_id, _btn) {

                    var order = controller.getUnitOrderById(order_id);
                    ConfirmationWindowFactory.openConfirmationUnitOrderCancel(order.cancelOrder.bind(order));

                }).on('wgtta:btn:click:odd', function() {
                    PremiumWindowFactory.openRecruitOverviewAdvantagesFeatureTab();
                }).on('wgtta:btn:click:even', function() {
                    TownOverviewWindowFactory.openMassRecruitOverview();
                }));
            }
        },

        /**
         * Initializes commands activity bubble menu,
         * either the optimized implementation or the traditional one based
         * on the feature flag
         */
        initializeCommandsActivity: function(type) {
            var Controller = require('features/commands/controller/commands');
            var controller = this.controller;

            var btn_commands = this.$el.find('.activity.commands').button({
                template: 'tpl_button_layout_activity',
                icon_type: 'toolbar_activity_commands',
                state: this.areThereAnyIncomingAttacksOrRunningRevolts(),
                caption: controller.getCommandsCount(true, true),
                cm_context: controller.getContext(),
                type: type
            }).on('btn:click', function() {
                if (controller.getPremiumFeaturesModel().hasCurator()) {
                    TownOverviewWindowFactory.openCommandOverview();
                } else {
                    PremiumWindowFactory.openCommandOverviewAdvantagesFeatureTab();
                }
            });

            this.registerComponent('btn_commands', btn_commands);

            var commands_menu_controller = new Controller({
                el: this.$el.find('.activity.commands'),
                models: {
                    commands: controller.getCommandsModel()
                },
                collections: {
                    movements_spys: controller.getCollection('movements_spys'),
                    movements_units: controller.getCollection('movements_units'),
                    movements_revolts_attacker: controller.getCollection('movements_revolts_attacker'),
                    movements_revolts_defender: controller.getCollection('movements_revolts_defender'),
                    movements_colonizations: controller.getCollection('movements_colonizations'),
                    movements_conquerors: controller.getCollection('movements_conquerors')
                },
                templates: controller.getTemplates(),
                l10n: $.extend({
                        no_results: DM.getl10n('COMMON', 'no_results')
                    },
                    DM.getl10n('layout', 'toolbar_activities')
                ),
                cm_context: controller.getContext()
            });

            controller.registerController('commands_menu_controller', commands_menu_controller);
        },

        /**
         * Initializes trades activity bubble menu
         */
        initializeTradesActivity: function() {
            var _self = this,
                controller = this.controller;

            controller.unregisterComponent('wgt_trades');
            controller.registerComponent('wgt_trades', this.$el.find('.activity.trades').toolbarActivity({
                template: controller.getTemplate('list_trades'),
                options: controller.getTrades(),
                state: controller.hasCurator(),
                caption: controller.getTradesCount(),
                l10n: {
                    no_results: this.l10n.no_trades_results
                },
                tooltips: {

                },
                onOptionInit: function($option) {
                    var $time = $option.find('.time'),
                        trade_id = $option.data('id'),
                        trade = controller.getTradeById(trade_id);

                    $option.tooltip(TooltipFactory.getTradeTooltip(trade));

                    return $time.countdown2({
                        value: trade.getTimeLeft(),
                        display: 'readable_seconds'
                    });
                }
            }).on('wgtta:btn:remove:click', function(e, trade_id, _btn) {
                //Cancel trade
                var trade = controller.getTradeById(trade_id);
                trade.cancel();
            }).on('wgtta:btn:click:odd', function() {
                PremiumWindowFactory.openTradeOverviewAdvantagesFeatureTab();
            }).on('wgtta:btn:click:even', function() {
                TownOverviewWindowFactory.openTradeOverview();
            }).on('wgtta:options:set', function() {
                _self.registerTradeTimeout();
            }));

            this.registerTradeTimeout();
        },

        initializeTempleCommandsActivity: function() {
            var $el = this.$el.find('.activity.temple_commands'),
                temple_commands = this.controller.getTempleCommands();

            this.controller.unregisterComponent('wgt_temple_commands');
            this.controller.registerComponent('wgt_temple_commands', $el.toolbarActivity({
                template: this.controller.getTemplate('list_temple_commands'),
                caption: temple_commands.length,
                options: temple_commands,
                has_countdown_timers: false,
                l10n: {
                    no_results: this.l10n.no_movements_results
                },
                config: {
                    hide_revolt: FeatureHelper.isOldCommandVersion()
                }
            }).on('dd:option:click', function(event, dropdown, click_event) {
                var $target = $(click_event.target),
                    temple_id = $target.data('temple_id'),
                    OlympusWindowFactory = require('features/olympus/factories/olympus_window_factory');

                if (temple_id) {
                    OlympusWindowFactory.openTempleInfoWindow(temple_id);
                }
            }).on('btn:click', function() {
                if (this.controller.isPlayerInAlliance()) {
                    // Open the alliance temple overview tab
                    hCommon.openWindow(
                        GPWindowMgr.TYPE_ALLIANCE,
                        _('Alliance'), {},
                        'alliance',
                        'temple_overview', {},
                        'get',
                        function() {}
                    );
                } else {
                    require('features/olympus/factories/olympus_window_factory').openOverviewWindow();
                }
            }.bind(this)));

            this.controller.updateTempleCommandsActivityCounter(temple_commands);
        },

        registerTradeTimeout: function() {
            //Reinitialize trades activity bubble when time left to cancel
            //order for the first cancelable order passed
            var _self = this,
                controller = this.controller,
                time_left = controller.getFirstTimeout();

            if (time_left > 0) {
                TM.unregister('rerender_trades_bubble_menu');
                TM.register('rerender_trades_bubble_menu', time_left * 1000, function() {
                    NotificationLoader.resetNotificationRequestTimeout(100);
                    controller.getComponent('wgt_trades').rerenderList();

                    //Reinitialize timer for next option
                    _self.registerTradeTimeout();
                }, {
                    max: 1
                });
            }
        },

        areThereAnyIncomingAttacksOrRunningRevolts: function() {
            return this.controller.movements_units.getIncomingAttacksCount() > 0 || this.controller.movements_revolts_defender.length > 0;
        },

        destroy: function() {
            this.controller.unregisterComponents();
        }
    });

    window.GameViews.LayoutToolbarActivities = LayoutToolbarActivities;

    return LayoutToolbarActivities;
});