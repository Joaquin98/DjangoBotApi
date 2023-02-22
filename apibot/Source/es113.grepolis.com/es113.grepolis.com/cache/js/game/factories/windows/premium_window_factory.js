/*globals GPWindowMgr, DM, hCommon, PremiumShopWindowFactory, gpAjax, MM, Game */

window.PremiumWindowFactory = (function() {
    'use strict';

    var l10n_premium = DM.getl10n('COMMON', 'premium');

    return {
        /**
         * opens window with advisors and option to buy more gold
         */
        openBuyAdvisorsWindow: function() {
            var wnd = hCommon.openWindow(GPWindowMgr.TYPE_PREMIUM, null, {
                noInitRequest: true
            }, 'premium_features', 'index', {}, 'get', function() {});

            if (wnd) {
                wnd.toTop();
            }

            return wnd;
        },

        _openCashShopWindow: function(shop_url) {
            require('features/cash_shop/factories/cash_shop').openWindow(shop_url);
        },

        /**
         * open the 'classic' buy_gold window
         */
        _openFullBuyGoldWindow: function(shop_url) {
            PremiumShopWindowFactory.openWindow(shop_url);
        },

        /**
         * true, if world config allows buying of gold
         *
         * @returns {Boolean}
         */
        _isBuyingEnabled: function() {
            var payment_config = MM.getModels().PaymentConfig[Game.player_id];

            return payment_config.isBuyingEnabled();
        },

        /**
         * Opens the cash shop. If the Game configuration disables payment globally, the Advisors window opens instead
         *
         * @param {String} tab_id defines which tab of the cash shop should be opened
         */
        openBuyGoldWindow: function(tab_id) {
            if (!this._isBuyingEnabled()) {
                this.openBuyAdvisorsWindow();
                return;
            }

            var params = {
                    source: 'premium_top',
                    tab_id: tab_id
                },
                player_ledger;

            if (Game.isHybridApp()) {
                player_ledger = MM.getModelByNameAndPlayerId('PlayerLedger');

                window.top.postMessage({
                    message: 'premium_shop',
                    data: {
                        gold: player_ledger.getGold()
                    }
                }, '*');
            } else {
                gpAjax.get('premium_features', 'get_cash_shop_url', params, true, function(stuff, data) {
                    this._openCashShopWindow(data.url);
                }.bind(this));
            }
        },

        /**
         * opens advantages tab with selected advisor passed as an argument
         *
         * @param {String} advisor_id
         */
        openAdvantagesTab: function(advisor_id) {
            return this._openPremiumWindow(advisor_id, null);
        },

        /**
         * opens particular feature
         * @param {String} feature
         */
        openAdvantagesFeatureTab: function(feature) {
            return this._openPremiumWindow(null, feature);
        },

        openTradeOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('trade_overview');
        },

        openCommandOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('command_overview');
        },

        openRecruitOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('recruit_overview');
        },

        openOuterUnitsOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('outer_units');
        },

        openBuildingsOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('building_overview');
        },

        openCultureOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('culture_overview');
        },

        openGodsOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('gods_overview');
        },

        openHidesOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('hides_overview');
        },

        openTownGroupsOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('town_group_overview');
        },

        openTownsOverviewAdvantagesFeatureTab: function() {
            return this.openAdvantagesFeatureTab('towns_overview');
        },

        /**
         * @param {String} sub_tab
         * Possible values:
         * - commander
         */
        openPremiumOverviewWindow: function(sub_tab) {
            var params = {};

            if (sub_tab) {
                params = {
                    sub_content: 'premium_overview',
                    sub_tab: sub_tab
                };
            }

            return GPWindowMgr.Create(GPWindowMgr.TYPE_PREMIUM, l10n_premium.premium, params);
        },

        /**
         * Opens Premium window
         *
         * @param {String} category id of advisor
         * @param {String} link selector of particular feature
         */
        _openPremiumWindow: function(category, link) {
            var window = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_PREMIUM),
                callback;

            if (category) {
                callback = function() {
                    window.sendMessage('premiumFeature', category);
                };
            } else if (link) {
                callback = function() {
                    window.sendMessage('showPremiumFeature', link);
                };
            }

            if (!window) {
                window = GPWindowMgr.Create(GPWindowMgr.TYPE_PREMIUM, l10n_premium.premium, {
                    sub_content: 'premium_overview',
                    callback: callback
                });
            } else {
                window.requestContentGet('premium_features', 'premium_overview', {}, callback, true);
            }

            return window;
        }
    };
}());