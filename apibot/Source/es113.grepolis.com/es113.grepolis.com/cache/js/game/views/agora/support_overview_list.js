/*global Backbone, GameViews */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var SupportOverviewListView = BaseView.extend({
        views: {},

        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.render();
        },

        rerender: function() {
            //Save position of the scrollbar
            var scroll_top = this.$el.scrollTop();

            //Unbind all events ans so on
            this.destroy();
            //Remove previous content
            this.$el.empty();
            //Render new content
            this.render();

            //Restore scrollbar position
            this.$el.scrollTop(scroll_top);
        },

        //Render list with supports
        render: function() {
            var controller = this.controller,
                mode = controller.getMode(),
                modes = controller.getModes(),
                num_of_supports = controller.getSupportsCount();

            var are_units_in_town = controller.getUnitsInTown(),
                is_more_than_one_support = num_of_supports > 1,
                no_supports = num_of_supports === 0;

            //for old agora first tab and new agora
            if (mode === modes.SUPPORT_FOR_ACTIVE_TOWN || mode === modes.ACTIVE_PLAYER_SUPPORTS_TOWN) {
                //Render total amount of units only when:
                //- there are multiple supports
                //- there are some supports and units in town
                if (is_more_than_one_support || (are_units_in_town && !no_supports)) {
                    this.renderTotalAmountOfUnits();
                }
            }

            //Render units in town only for old agora first tab and new agora in case if there are really units in town
            if ((mode === modes.SUPPORT_FOR_ACTIVE_TOWN || mode === modes.ACTIVE_PLAYER_SUPPORTS_TOWN) && are_units_in_town) {
                this.renderUnitsIntown();
            }

            this.renderSupports();

            if (no_supports && !are_units_in_town) {
                this.renderNoResults();
            }

            return this;
        },

        /**
         * Renders 'no result' row
         */
        renderNoResults: function() {
            this.views.total_units = new GameViews.SupportOverviewListRowNoResultsView({
                $list: this.$el,
                controller: this.controller
            });
        },

        /**
         * Renders row which displays total amount of units
         */
        renderTotalAmountOfUnits: function() {
            this.views.total_units = new GameViews.SupportOverviewListRowTotalUnitsView({
                $list: this.$el,
                controller: this.controller
            });
        },

        /**
         * Renders row which displays units in the town
         */
        renderUnitsIntown: function(is_even) {
            this.views.units_in_town = new GameViews.SupportOverviewListRowUnitsInTownView({
                $list: this.$el,
                controller: this.controller
            });
        },

        /**
         * Renders all supports
         */
        renderSupports: function() {
            var controller = this.controller,
                supports = controller.getSupports(),
                i, l = supports.length,
                support, is_even = true;

            for (i = 0; i < l; i++) {
                support = supports[i];

                this.views['support_' + support.getId()] = new GameViews.SupportOverviewListRowSupportView({
                    $list: this.$el,
                    model: support,
                    controller: controller,
                    is_even: is_even
                });

                is_even = !is_even;
            }
        },

        destroy: function() {
            var views = this.views,
                view_id;

            for (view_id in views) {
                if (views.hasOwnProperty(view_id)) {
                    views[view_id].destroy();
                }
            }
        }
    });

    window.GameViews.SupportOverviewListView = SupportOverviewListView;
}());