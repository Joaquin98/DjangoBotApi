define('features/collected_items/controllers/collected_items_indicator', function(require) {
    'use strict';

    var GameControllers = window.GameControllers,
        CollectedItemsIndicatorView = require('features/collected_items/views/collected_items_indicator'),
        StorageHelper = require('features/collected_items/helpers/collected_items_storage'),
        DAILY_ITEM_DROPS = 10,
        default_settings = {
            el_selector: '.collected_items_indicator',
            l10n: null,
            items: [],
            items_count: 0,
            stored_items_ttl: -1,
            tooltip: {
                template: '',
                css_classes: '',
                x_value_prefix: false
            }
        };

    return GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
            this.settings = us.extend({}, default_settings, options.settings);
            this.l10n = this.settings.l10n;
        },

        renderPage: function() {
            this.$el = this.parent_controller.$el.find(this.settings.el_selector);

            this.view = new CollectedItemsIndicatorView({
                controller: this,
                el: this.$el
            });
        },

        reRender: function(new_settings) {
            for (var setting in new_settings) {
                if (new_settings.hasOwnProperty(setting) && this.settings.hasOwnProperty(setting)) {
                    this.settings[setting] = new_settings[setting];
                }
            }

            this.view.render(true);
        },

        getCollectedItems: function() {
            return this.settings.items;
        },

        getCollectedItemsCount: function() {
            return this.settings.items_count;
        },

        getTooltip: function() {
            var drops_left = DAILY_ITEM_DROPS - this.getCollectedItemsCount(),
                l10n = this.l10n.tooltip;

            return us.template(this.getTemplate('indicator_tooltip'), {
                l10n: l10n,
                css_classes: this.settings.tooltip.css_classes,
                x_value_prefix: this.settings.tooltip.x_value_prefix,
                items: this.getCollectedItems(),
                drops_left_info: drops_left > 0 ? l10n.drops_left(drops_left) : l10n.no_drops_left
            });
        },

        getNewItemsCount: function() {
            return StorageHelper.getStoredItemsData().items_count;
        },

        getStoredItemsTTL: function() {
            return this.settings.stored_items_ttl;
        },

        resetNewItemsCount: function() {
            var items_data = StorageHelper.getStoredItemsData();

            items_data.items_count = 0;
            StorageHelper.storeItemsData(items_data, this.getStoredItemsTTL());
        },

        destroy: function() {

        }
    });
});