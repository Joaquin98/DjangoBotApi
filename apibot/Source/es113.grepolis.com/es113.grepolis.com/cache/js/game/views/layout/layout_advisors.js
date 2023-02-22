/*global define, TooltipFactory, GameViews */

(function() {
    'use strict';

    var LayoutAdvisors = GameViews.BaseView.extend({
        initialize: function() {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.registerEventListeners();
            this.render();
        },

        registerEventListeners: function() {
            this.$el.on('click', this.controller.handleClickEvent.bind(this.controller));
        },

        reRender: function() {
            this.render();
        },

        render: function() {
            var advisor_id, available_advisors = this.controller.getAvailableAdvisors();

            for (var i = 0, l = available_advisors.length; i < l; i++) {
                advisor_id = available_advisors[i];

                this.updateAdvisor(advisor_id);

                this.$el.find('.advisor_frame.' + advisor_id + ' .advisor').tooltip(TooltipFactory.getAdvisorTooltip(advisor_id));
            }
        },

        updateAdvisor: function(advisor_id) {
            /** check if advisor id exists **/
            if (this.controller.isProperAdvisorId(advisor_id)) {
                var is_active = this.controller.isAdvisorActivated(advisor_id);

                this.$el.find('.' + advisor_id + ' .advisor').toggleClass(advisor_id + '_active', is_active);
                this.$el.find('.' + advisor_id + ' .advisor').toggleClass(advisor_id + '_sepia', !is_active);
            }
        },

        destroy: function() {

        }
    });

    window.GameViews.LayoutAdvisors = LayoutAdvisors;
}());