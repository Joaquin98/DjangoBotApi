/* globals DM, GPWindowMgr, CM, GameControllers, GameDataPremium, BuyForGoldWindowFactory */

(function() {
    'use strict';

    var DateHelper = require('helpers/date');

    function WndHandlerPremium(wndhandle) {
        this.wnd = wndhandle;
        this.subContent = {};

    }

    WndHandlerPremium.inherits(window.WndHandlerDefault);

    WndHandlerPremium.prototype.getDefaultWindowOptions = function() {
        return {
            height: 570,
            width: 790,
            resizable: false,
            minimizable: true,
            autoresize: true,
            title: _('Premium')
        };
    };

    WndHandlerPremium.prototype.onInit = function(title, UIopts) {
        var sub_content,
            callback = UIopts.callback || function() {};

        if (UIopts.sub_content) {
            sub_content = UIopts.sub_content;
        } else {
            sub_content = 'index';
        }
        this.subContent.action = sub_content;
        this.subContent.sub_tab = UIopts.sub_tab;
        this.l10n = DM.getl10n('premium', 'advisors');

        if (sub_content === 'mentoring') {
            this.wnd.requestContentGet('mentoring', 'index', {});
        } else {
            if (!UIopts.noInitRequest) {
                var source = UIopts.source ? UIopts.source : '';
                this.wnd.requestContentGet('premium_features', sub_content, {
                    'source': source
                }, callback);
            }
        }

        return true;
    };

    WndHandlerPremium.prototype.onRcvData = function(data, controller, action) {
        //Handle advisors tab in the new way
        if (controller === 'premium_features' && action === 'index') {
            var models = this.wnd.getModels();
            var collections = this.wnd.getCollections();

            if (this.tab_controller) {
                this.tab_controller._destroy();
            }

            this.tab_controller = new GameControllers.PremiumAdvisorsController({
                el: this.wnd.getJQElement().find('.gpwindow_content'),
                cm_context: this.wnd.getContext(),
                models: {
                    premium_features: models.premium_features,
                    player_settings: models.player_settings
                },
                collections: {
                    tutorial_quests: collections.tutorial_quests
                },
                templates: data.templates,
                l10n: this.l10n
            });

            this.tab_controller.renderPage();
        } else {
            if (this.tab_controller) {
                this.tab_controller.destroy();
            }

            this.wnd.setContent2(data.html);

            if (this.subContent.sub_tab) {
                this.premiumFeature(this.subContent.sub_tab);
            }
            this.renderAdvisorActivationArea();
        }
        //This window should go over another ones when its opened.
        GPWindowMgr.focusWindow(this.wnd);
    };

    WndHandlerPremium.prototype.renderAdvisorActivationArea = function() {
        var $area = this.wnd.getJQElement().find('.advisor_activation_area'),
            $text = $area.find('.advisor_activation_text'),
            $button = $area.find('.btn_buy_advisor'),
            advisor_id = $area.data('advisor_id'),
            advisor_duration, expiration_time;

        if (!advisor_id) {
            return;
        }

        advisor_duration = GameDataPremium.getAdvisorDuration(advisor_id);

        if (GameDataPremium.isAdvisorActivated(advisor_id)) {
            expiration_time = GameDataPremium.getAdvisorExpirationTime(advisor_id);
            expiration_time = DateHelper.formatDateTimeNice(expiration_time, false, false);
            $text.html(this.l10n.active_until(expiration_time));
            $button.hide();
        } else {
            $button.show();
            $text.html(this.l10n.activate_advisor(advisor_duration));
            this.registerBuyAdvisorButton($button, advisor_id);
        }
    };

    WndHandlerPremium.prototype.registerBuyAdvisorButton = function($button, advisor_id) {
        var cost = GameDataPremium.getAdvisorCost(advisor_id),
            callback = function() {
                GameDataPremium.getPremiumFeaturesModel().extend(advisor_id, false, this.renderAdvisorActivationArea.bind(this));
            }.bind(this);

        CM.unregister(this.wnd.getContext(), 'btn_buy_advisor');
        CM.register(this.wnd.getContext(), 'btn_buy_advisor', $button.button({
            caption: this.l10n.activate_with_cost(cost),
            icon: true,
            icon_type: 'gold'
        }).on('btn:click', function() {
            BuyForGoldWindowFactory.openBuyAdvisorWindow($button, advisor_id, callback);
        }.bind(this)));
    };

    WndHandlerPremium.prototype.premiumFeature = function(feature) {
        var root = this.wnd.getJQElement();
        var sl_cur = root.find('#premium_feature_sublist.curator');
        var sl_cap = root.find('#premium_feature_sublist.captain');

        if (feature == 'curator' || feature == 'outer_units' || (feature.indexOf('overview') != -1 && sl_cur.is(':visible'))) {
            sl_cur.slideDown();
            if (sl_cap.is(':visible')) {
                sl_cap.slideUp();
            }
        } else {
            if ((sl_cur.is(':visible') || sl_cap.is(':visible')) && (feature != 'attack_planer' && feature != 'farm_town_overview')) {
                sl_cur.slideUp();
                sl_cap.slideUp();
            }
            if (feature == 'captain') {
                sl_cap.slideDown();
            }
        }

        root.find('#premium_overview_info_area').children().fadeOut(500);

        this.wnd.ajaxRequestGet('premium_features', 'premium_feature', {
            feature_type: feature
        }, function(window, data) {
            root.find('#premium_overview_info_area').hide().html(data.html).fadeIn(500);
            this.renderAdvisorActivationArea();
        }.bind(this));
    };

    /**
     * Looks trough the Premium->Vortaile menu searching for the category with link with name='$feature'.
     * Slides down if feature has been found, and slides up if not.
     */
    WndHandlerPremium.prototype.showPremiumFeature = function(feature) {
        var node, fl = $("#featurelist li"),
            root = this.wnd.getJQElement();

        fl.each(function() {
            node = $(this).find("ul");

            if (node.find("a[name='" + feature + "']").length > 0) {
                node.slideDown();
            } else {
                if (node.is(':visible')) {
                    node.slideUp();
                }
            }
        });

        root.find('#premium_overview_info_area').children().fadeOut(500);

        this.wnd.ajaxRequestGet('premium_features', 'premium_feature', {
            feature_type: feature
        }, function(window, data) {
            root.find('#premium_overview_info_area').hide().html(data.html).fadeIn(500);
            this.renderAdvisorActivationArea();
        }.bind(this));
    };

    WndHandlerPremium.prototype.onClose = function() {
        var root = this.wnd.getJQElement();

        root.off(".premium_features_window");

        if (this.tab_controller) {
            this.tab_controller._destroy();
        }
    };

    window.WndHandlerPremium = WndHandlerPremium;

    GPWindowMgr.addWndType('PREMIUM', 'premium_link', WndHandlerPremium, 1);
}());