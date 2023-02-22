/*global GameViews */

/**
 * Main view of the support overview which keeps elements which does not change
 */
(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var SupportOverviewMainView = BaseView.extend({
        list_view: null,

        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.supports_collection = this.controller.getSupportsCollection();

            this.supports_collection.on('remove change', function() {
                this.list_view.rerender();
            }, this);

            this.render();
        },

        render: function() {
            var controller = this.controller,
                $el = this.$el,
                l10n = this.l10n;

            $el.html(us.template(controller.getTemplate('main'), {
                l10n: {
                    box_title: controller.getBoxTitle(),
                    sort_by: l10n.sort_by
                },
                is_sort_option_visible: controller.isSortOptionVisible()
            }));

            //Initialize list view
            this.list_view = new GameViews.SupportOverviewListView({
                el: $el.find('.supporters_list'),
                controller: this.controller
            });

            //Initialize main view components
            this.initializeComponents();

            return this;
        },

        initializeComponents: function() {
            var $el = this.$el,
                controller = this.controller;

            controller.unregisterComponents();

            //Sorting options
            if (controller.isSortOptionVisible()) {
                //Sort by dropdown
                controller.registerComponent('dd_support_sort_by', $el.find('#dd_support_sort_by').dropdown({
                    value: controller.getDefaultSortOption(),
                    options: controller.getSortDropdownOptions()
                }).on('dd:change:value', function(e, new_val, old_val) {
                    //console.log("Sort by " + new_val);
                }));

                //Order asc/desc button
                controller.registerComponent('btn_support_order_by', $el.find('#btn_support_order_by').button({
                    toggle: true
                }).on('btn:click:even', function() {
                    //console.log("sort desc");
                }).on('btn:click:odd', function() {
                    //console.log("sort asc");
                }));
            }

            if (this.supports_collection && this.supports_collection.length > 0) {
                controller.registerComponent('btn_return_all_units', $el.find('.btn_return_all_units').button({
                    caption: this.l10n.send_all_units_back,
                    tooltips: [{
                        title: this.l10n.tooltips.send_all_units_back
                    }]
                }).on('btn:click', function() {
                    controller.returnAllUnits();
                }));
            }
        },

        destroy: function() {
            if (this.list_view) {
                this.list_view.destroy();
                this.list_view = null;
            }

            this.supports_collection.off(null, null, this);
        }
    });

    window.GameViews.SupportOverviewMainView = SupportOverviewMainView;
}());