/**
 * controler for the welcome dialog instance which handles infopage benefits
 *
 * first used for the christmas 2013 start and interstitial windows
 */
(function() {
    'use strict';

    var GameControllers = window.GameControllers;
    var GameViews = window.GameViews;
    var eventTracking = window.eventTracking;
    var INFOPAGE = window.GameModels.Benefit.INFOPAGE;
    var EVENT_SCREEN = require('enums/json_tracking').EVENT_SCREEN;

    var DialogInterstitialController = GameControllers.DialogInterstitialBaseController.extend({
        initialize: function() {
            GameControllers.DialogInterstitialBaseController.prototype.initialize.apply(this, arguments);

            this.initializeEventsListeners();

            var benefitType = this.getBenefit().getBenefitType();
            if (benefitType === INFOPAGE) {
                eventTracking.logJsonEvent(EVENT_SCREEN, {
                    'screen_name': this.getType(),
                    'action': 'view',
                    'ingame_event_name': this.getBenefit().getHappeningName()
                });
            }
        },

        initializeEventsListeners: function() {
            this.getBenefit().onEnded(this, this.handleOnBenefitEnded.bind(this));

            this.setOnManualClose(this.disableWindowForFuture.bind(this));
        },

        renderPage: function() {
            this.view = new GameViews.DialogInterstitial({
                el: this.$el,
                controller: this
            });
        },

        getBenefit: function() {
            return this.options.data_object.getBenefit();
        },

        getPlayerHint: function() {
            return this.options.data_object.getPlayerHint();
        },

        getType: function() {
            return this.options.data_object.getType();
        },

        getLogoUrl: function() {
            return this.options.data_object.getLogoUrl();
        },

        getCountdownTime: function() {
            return this.getBenefit().getEnd();
        },

        hasCountdownTimer: function() {
            return this.getCountdownTimerCss() !== '';
        },

        getCountdownTimerCss: function() {
            var extra_data = this.getExtraData(),
                ribbon = (typeof extra_data !== 'undefined') ? extra_data.ribbon : '';

            return ribbon || '';
        },

        getExtraClasses: function() {
            var extra_data = this.getExtraData(),
                classes = (typeof extra_data !== 'undefined') ? extra_data.classes : '';

            return classes || '';
        },

        disableWindowForFuture: function() {
            this.getPlayerHint().disable();
        },

        /**
         * Function called when user clicks on the button in the welcome screen window
         */
        handleOnButtonClick: function() {
            var props;
            var window_skin = this.getBenefitSkin();
            this.disableWindowForFuture();
            this.closeWindow();
            if (window_skin && window_skin !== '') {
                props = {
                    args: {
                        window_skin: window_skin
                    }
                };
            }

            window.WF.open(this.getType(), props);
        },

        handleOnLogoClick: function() {
            window.open(this.getLogoUrl());
        },

        handleOnBenefitEnded: function() {
            this.closeWindow();
        },

        destroy: function() {
            GameControllers.DialogInterstitialBaseController.prototype.destroy.apply(this, arguments);
        },

        getExtraData: function() {
            var model = this.getWindowModel();

            return model.getExtraData();
        }
    });

    window.GameControllers.DialogInterstitialController = DialogInterstitialController;
}());