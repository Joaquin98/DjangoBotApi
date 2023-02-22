define('features/collected_items/views/collected_items_indicator', function() {
    'use strict';

    var GameViews = window.GameViews;

    return GameViews.BaseView.extend({
        initialize: function(options) {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);
            this.l10n = this.controller.getl10n();
            this.render(false);
        },

        render: function(is_rerender) {
            var frag = document.createDocumentFragment(),
                tooltip = this.controller.getTooltip(),
                $tooltip = $(tooltip),
                collected_items_count = this.controller.getCollectedItemsCount(),
                new_items_count = this.controller.getNewItemsCount(),
                marked_items = 0;

            for (var i = 0; i < collected_items_count; i++) {
                var element = document.createElement('div');
                frag.appendChild(element);
            }

            this.$el.html(frag);

            if (!is_rerender && new_items_count > 0) {
                marked_items = collected_items_count - new_items_count + 1;

                if (marked_items && marked_items >= 0) {
                    this.$el.find('div:nth-child(n+' + marked_items + ')').addClass('new');
                }

                this.controller.resetNewItemsCount();
            }

            this.addActivityListToTooltip($tooltip);
            this.$el.tooltip($tooltip);
        },

        addActivityListToTooltip: function($tooltip) {
            var frag = document.createDocumentFragment(),
                activity_list = this.l10n.tooltip.activity_list;

            if (typeof activity_list !== 'object') {
                return;
            }

            for (var activity in activity_list) {
                if (activity_list.hasOwnProperty(activity)) {
                    var element = document.createElement('li');
                    element.innerText = activity_list[activity];
                    frag.appendChild(element);
                }
            }

            $tooltip.find('.activity_list').html(frag);
        }
    });
});