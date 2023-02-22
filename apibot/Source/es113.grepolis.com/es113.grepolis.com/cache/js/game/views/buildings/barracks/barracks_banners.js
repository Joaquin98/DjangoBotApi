/*global define, Backbone, Game, GameEvents, ITowns, Layout, PhoenicianSalesman, PopupFactory, Timestamp, hOpenWindow, ngettext, s */

(function() {
    'use strict';

    var sub_context = 'banners';

    var BarracksBannersView = GameViews.BaseView.extend({
        initialize: function() {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.render();
        },

        reRender: function() {
            var building_type = this.controller.getBuildingType();

            this.$el.find('#barracks_commander_hint, #unit_order_ph_background').remove();

            //For barracks just remove container, for docks show different box
            if (building_type === 'docks') {
                this.render();
            }
        },

        render: function() {
            this.$el.append(us.template(this.controller.getTemplate('banners'), {
                l10n: this.controller.getl10n(),
                phoenician_salesman: this.controller.getModel('phoenician_salesman'),
                show_banner_in_barracks: this.controller.showBannerInBarracks(),
                show_banner_in_docs: this.controller.showBannerInDocks()
            }));

            this.registerBannersComponents();

            return this;
        },

        registerBannersComponents: function() {
            var $el = this.$el,
                l10n = this.controller.getl10n(),
                l10n_pt = l10n.phoenician_trader,
                controller = this.controller,
                available_gold = this.controller.getAvailableGold();

            controller.unregisterComponents(sub_context);

            if (this.controller.showBannerInBarracks()) {
                controller.registerComponent('btn_activate_commander', $el.find('.btn_activate_commander').button({
                    caption: l10n.activate,
                    icon: true,
                    icon_position: 'left',
                    tooltips: [{
                        title: PopupFactory.texts.commander_hint
                    }]
                }).on('btn:click', function(e, _btn) {
                    BuyForGoldWindowFactory.openBuyAdvisorWindow(_btn, 'commander', function() {
                        this.controller.extendCommander();
                    }.bind(this));
                }.bind(this)), sub_context);

                controller.registerComponent('commander_icon', $el.find('.commander_icon').button({
                    template: 'empty'
                }).on('btn:click', function() {
                    hOpenWindow.openPremiumOverviewWindow('commander'); //@todo
                }), sub_context);

                $el.find('.unit_orders_premium_link').off().on('click', function() {
                    hOpenWindow.openPremiumOverviewWindow(); //@todo
                });
            } else if (this.controller.showBannerInDocks()) {
                var current_town_id = this.controller.getPhoenicianSalesmanCurrentTownId(),
                    town_name = (Game.townName || ''),
                    tooltip,
                    pt_call_cost = Game.phoenician.immediate_call_gold_cost;

                //This is fuckin wierd, but they did it in this way before @todo move it to common translations
                PhoenicianSalesman.call_for_gold_dialog_text = s(ngettext(l10n_pt.invite_question, l10n_pt.invite_question_plural, pt_call_cost), pt_call_cost);

                town_name = town_name.length > 10 ? town_name.substr(0, 10) + '...' : town_name;

                if (!current_town_id || current_town_id !== parseInt(Game.townId, 10)) {
                    tooltip = '<span class="bold">' +
                        s(ngettext(l10n_pt.invite_tooltip, l10n_pt.invite_tooltip_plural, pt_call_cost), pt_call_cost) +
                        '</span><br /><br /><span>' +
                        s(ngettext(l10n_pt.gold, l10n_pt.gold_plural, available_gold), available_gold) +
                        '</span>';

                    //Trader components
                    var btn_call_trader = controller.registerComponent('btn_call_trader', $el.find('.btn_call_trader').button({
                        icon: true,
                        icon_position: 'left',
                        caption: s(l10n.phoenician_trader.invite, town_name),
                        tooltips: [{
                            title: tooltip
                        }]
                    }).on('btn:click', function() {
                        BuyForGoldWindowFactory.openImmediateCallPhoenicianSalesmanForGoldWindow(
                            btn_call_trader, {},
                            PhoenicianSalesman.doCallToTown);
                    }), sub_context);
                } else {
                    controller.registerComponent('btn_open_pt_wnd', $el.find('.btn_open_pt_wnd').button({
                        template: 'empty',
                        caption: l10n.phoenician_trader.do_handel
                    }).on('btn:click', function() {
                        PhoenicianSalesmanWindowFactory.openPhoenicianSalesmanWindow();
                    }), sub_context);
                }
            }
        },

        destroy: function() {

        }
    });

    window.GameViews.BarracksBannersView = BarracksBannersView;
}());