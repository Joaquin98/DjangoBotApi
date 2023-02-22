/* global us, WQM, WM, DM, InterstitialWindowFactory, GameControllers */

/**
 * layout controller to create the interstitials welcome windows
 * it does not have own views
 * it was first used for christmas2013 welcome and interstitial windows
 */
(function() {
    'use strict';

    var LayoutInfopageController = GameControllers.BaseController.extend({
        initialize: function(options) {
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            var info_page_benefits = this._getInfopageBenefits();

            us.each(info_page_benefits, function(benefit) {
                if (benefit.isRunning()) {
                    this._showWindowIfNotHidden(benefit);
                } else if (!benefit.hasEnded()) {
                    benefit.onStarted(this, this._showWindowIfNotHidden);
                }
            }.bind(this));

            return this;
        },

        /**
         * Returns info page benefits
         *
         * @return {Array}
         * @private
         */
        _getInfopageBenefits: function() {
            return this.getCollection('benefits').getBenefitsOfType(window.GameModels.Benefit.INFOPAGE);
        },

        _getPlayerHint: function(type) {
            return this.getCollection('player_hints').getForType(type);
        },

        _isInterstitialWindowOpen: function(type) {
            return WM.getWindowByType('dialog').filter(function(win) {
                return win.get('interstitial_type') === type;
            }).length > 0;
        },

        _showIcon: function(benefit) {
            return new window.GameControllers.CrmIconController({
                el: $('.happening_large_icon_container'),
                l10n: {
                    common: DM.getl10n('common')
                },
                templates: {
                    large_icon: 'tpl_special_offer_icon'
                },
                models: {
                    interstitial_model: benefit
                },
                collections: {},
                cm_context: {
                    main: 'interstitial',
                    sub: 'icon'
                }
            });
        },

        _showWindowIfNotHidden: function(benefit) {
            var type = benefit.getParam('type'),
                player_hint = this._getPlayerHint(type),
                window_already_opened = this._isInterstitialWindowOpen(type),
                windows = require('game/windows/ids'),
                priorities = require('game/windows/priorities'),
                priority;

            if (!player_hint.isHidden() && !window_already_opened) {
                priority = priorities.getPriority(type) ||  priorities.getPriority(windows.INTERSTITIAL); // fallback if no specific priority was defined;

                WQM.addQueuedWindow({
                    type: windows.INTERSTITIAL,
                    priority: priority,
                    open_function: function() {
                        return InterstitialWindowFactory.openInterstitialWindow(benefit, player_hint);
                    }
                });
            }

            if (benefit.hasIcon && benefit.hasIcon()) {
                this._showIcon(benefit);
            }
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutInfopageController = LayoutInfopageController;
}());