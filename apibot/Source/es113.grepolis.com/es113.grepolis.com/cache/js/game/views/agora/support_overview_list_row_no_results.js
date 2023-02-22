/*global Backbone */

/**
 * View which represents single row in the support overview which displayes
 * 'no result' message
 */
(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var SupportOverviewListRowNoResultsView = BaseView.extend({
        //List container element
        $list: null,
        //Single row element
        $el: null,

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.$list = options.$list;
            this.l10n = this.controller.getl10n();

            this.render();
        },

        //Render list with total units
        render: function() {
            var controller = this.controller;

            this.$list.append((us.template(this.controller.getTemplate('list_no_results'), {
                l10n: this.l10n,
                mode: controller.getMode(),
                modes: controller.getModes()
            })));

            this.$el = this.$list.find('.support_row_no_results');

            return this;
        },

        destroy: function() {

        }
    });

    window.GameViews.SupportOverviewListRowNoResultsView = SupportOverviewListRowNoResultsView;
}());