/*globals GameControllers, GameViews, PremiumWindowFactory */
(function() {
    'use strict';

    var LayoutAdvisorsController = GameControllers.BaseController.extend({
        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.LayoutAdvisors({
                el: this.$el,
                controller: this
            });

            this.registerEventListeners();

            return this;
        },

        registerEventListeners: function() {
            this.getModel('premium_features').onAdvisorChange(this, this.view.reRender.bind(this.view));
        },

        handleClickEvent: function() {
            PremiumWindowFactory.openBuyAdvisorsWindow();
        },

        getAvailableAdvisors: function() {
            return this.getModel('premium_features').getAvailableAdvisors();
        },

        isProperAdvisorId: function(advisor_id) {
            return this.getModel('premium_features').isProperAdvisorId(advisor_id);
        },

        isAdvisorActivated: function(advisor_id) {
            return this.getModel('premium_features').isActivated(advisor_id);
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutAdvisorsController = LayoutAdvisorsController;
}());