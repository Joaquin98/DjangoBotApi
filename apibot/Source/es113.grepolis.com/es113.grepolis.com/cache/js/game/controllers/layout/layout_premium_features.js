/*globals GameControllers, BuildingWindowFactory */
(function() {
    "use strict";

    var LayoutPremiumFeaturesController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            var premium_features_model = this.getModel('premium_features');
            premium_features_model.on('change', this.update, this);

            this.banners = {};
            this.banners[premium_features_model.TRADER] = '.mines_trader_hint';
            this.banners[premium_features_model.PRIEST] = '#temple_priest_hint';
        },

        renderPage: function() {
            return this;
        },

        update: function(advisors_model, options) {
            var advisor_id, changes = advisors_model.changedAttributes();

            for (advisor_id in changes) {
                if (changes.hasOwnProperty(advisor_id) &&
                    this.getModel('premium_features').isProperAdvisorId(advisor_id)
                ) {
                    this.removeBanners(advisor_id);
                }
            }

            this.reloadWindows();
        },

        /**
         * removing premium info for different windows
         * @param {String} advisor id
         */
        removeBanners: function(advisor) {
            var banners = this.banners;
            if (banners && banners[advisor]) {
                $(banners[advisor]).remove();
            }
        },

        reloadWindows: function() {
            BuildingWindowFactory.refreshIfOpened();
        },

        destroy: function() {
            this.getModel('premium_features').off(null, null, this);
        }
    });

    window.GameControllers.LayoutPremiumFeaturesController = LayoutPremiumFeaturesController;
}());