/*globals GameControllers, GameViews */

/**
 * controller for the general welcome dialog
 *
 * the dialog has no behaviour, it will simply ask the passed window_data for it propertys (view class, title and general type)
 *
 * it is created to simplify the the process of creating simple windows to inform the player about events, be it happenings
 * etc
 */
(function() {
    'use strict';

    var DialogInterstitialBaseController = GameControllers.TabController.extend({
        initialize: function(options) {
            GameControllers.TabController.prototype.initialize.apply(this, arguments);

            var window_title = this.getWindowTitle() || this.getTranslationForWindowTitle();

            //Set window title
            this.setWindowTitle(window_title);

            this.render();
        },

        render: function() {
            this.extendWindowData();

            //Create the basic layout that the content of the interstitial will be loaded to
            this.view = new GameViews.DialogInterstitialBase({
                el: this.$el,
                controller: this
            });

            return this;
        },

        extendWindowData: function() {

        },

        renderPage: function() {
            //Its overwritten by child class which inherits from it
        },

        getControllerClass: function() {
            return this.options.data_object.getControllerClass();
        },

        getBtnStartCaption: function() {
            return this.l10n.btn_caption;
        },

        getTranslationForWindowTitle: function() {
            return this.options.data_object.getWindowTitle();
        },

        getEventName: function() {
            return this.options.data_object.getEventName();
        },

        getWindowTitle: function() {
            return this.l10n.window_title;
        },

        getBenefitSkin: function() {
            var BenefitHelper = require('helpers/benefit'),
                ignore_benefit_skin = this.getPreloadedData().ignore_benefit_skin;

            if (typeof ignore_benefit_skin === 'undefined' || !ignore_benefit_skin) {
                return BenefitHelper.getBenefitSkin();
            }

            return '';
        },

        destroy: function() {

        }
    });

    window.GameControllers.DialogInterstitialBaseController = DialogInterstitialBaseController;
}());