/* global Game, PremiumWindowFactory, LumberWindowFactory, StonerWindowFactory, IronerWindowFactory, GameData, GameDataPremium */
(function() {
    'use strict';

    var View = window.GameViews.BaseView;
    var us = window.us;

    function gameBorder(controller) {
        // TODO this should be globally available somehow
        return us.template(controller.getTemplate('gameborder'), {});
    }

    var StorageView = View.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            View.prototype.initialize.apply(this, arguments);
            this.l10n = this.controller.getl10n();

            this.render();
        },

        initializeView: function(data) {
            this.$el.html(
                us.template(
                    this.controller.getTemplate('index'),
                    data
                )
            );
            var title = this.l10n.warehouse + ' (' + Game.townName + ')';
            this.controller.setWindowTitle(title);
        },

        reRender: function() {
            this.controller.unregisterComponents();
            this.render();
        },

        render: function() {
            var view_context = this.controller.getRenderData();

            view_context.gameBorder = gameBorder(this.controller);
            view_context.l10n = this.l10n;

            this.initializeView(view_context);

            this.registerProgressbars();
            this.setStorageHideMarker(
                [view_context.wood.amount, view_context.stone.amount, view_context.iron.amount],
                view_context.hide_capacity,
                view_context.storage_capacity
            );
            this.registerResourceOnClick();
            this.registerBuyTraderBtn();
            this.registerShowAdvisorAdvButton();
        },

        updateResources: function(value, resource_type) {
            var resource_info = this.controller.getResourceDetails(resource_type);

            this.controller.getComponent(resource_type + '_progressbar').setValue(resource_info.to_go);
            this.$el.find('.' + resource_type + '_value').text(value);
        },

        setStorageHideMarker: function(resource_amounts, hide_capacity, storage_capacity) {
            var $hide_marker = this.$el.find('.storage_hide_marker');
            var $bars = this.$el.find('.storage_bar');

            var progress_bar_width = parseInt($bars.css('width'), 10);
            var hide_bar_width = 37 + (hide_capacity / storage_capacity * progress_bar_width);

            $hide_marker.css('left', hide_bar_width);

            var addHideoutTooltip = function($el, lootable) {
                $el.tooltip(
                    this.l10n.capacity_hideout(hide_capacity) + '<br />' +
                    this.l10n.storage_lootable(lootable)
                );
            }.bind(this);

            // set tooltips
            $hide_marker.each(function(i, marker) {

                var lootable = resource_amounts[i] - hide_capacity;
                lootable = Math.max(lootable, 0);

                var $bar = $($bars[i]);
                addHideoutTooltip($bar.find('.progress .indicator'), lootable);
                addHideoutTooltip($bar.find('.caption'), lootable);
                addHideoutTooltip($(marker), lootable);

            }.bind(this));

        },

        registerProgressbars: function() {

            var resources = us.keys(GameData.resources);

            $.each(resources, function(i, resource_type) {

                var resource_info = this.controller.getResourceDetails(resource_type);

                var bar = this.controller.registerComponent(resource_type + '_progressbar',
                    this.$el.find('#' + resource_type + '_bar_progress').singleProgressbar({
                        value: resource_info.to_go,
                        max: resource_info.complete,
                        clear_timer_if_zero: true,
                        liveprogress: true,
                        liveprogress_interval: 1,
                        type: 'time',
                        countdown: true,
                        template: 'tpl_pb_time_progress_only',
                        reverse_progress: true
                    })
                );

                this.$el.find('#' + resource_type + '_done_in')
                    .html(bar.getEndDate());

            }.bind(this));
        },

        registerBuyTraderBtn: function() {

            var $btn = this.$el.find('.btn_buy_trader');
            var trader_cost = GameDataPremium.getAdvisorCost('trader');

            this.controller.registerComponent('btn_buy_trader', $btn.button({
                caption: this.l10n.activate,
                icon: true,
                icon_type: 'gold',
                icon_position: 'right',
                tooltips: [{
                    title: this.l10n.buy_trader(trader_cost)
                }]
            }).on('btn:click', this.controller.onBuyTraderBtnClicked.bind(this.controller)));

        },

        registerShowAdvisorAdvButton: function() {
            this.controller.registerComponent('btn_show_trader_advantages', this.$el.find('.btn_show_trader_advantages').button({
                template: 'empty'
            }).on('btn:click', function(e, _btn) {
                PremiumWindowFactory.openAdvantagesTab('trader');
            }));
        },

        registerResourceOnClick: function() {

            var resources = us.keys(GameData.resources);
            $.each(resources, function(i, resource_type) {

                this.$el.find('.storage_' + resource_type).on("click", function(ev) {
                    switch (resource_type) {
                        case 'wood':
                            LumberWindowFactory.openLumberWindow();
                            break;
                        case 'stone':
                            StonerWindowFactory.openStonerWindow();
                            break;
                        case 'iron':
                            IronerWindowFactory.openIronerWindow();
                            break;
                    }
                });

            }.bind(this));
        },

        destroy: function() {

        }
    });

    window.GameViews.StorageView = StorageView;
}());