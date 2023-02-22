/* globals WM, GameEvents, $, Timestamp */
define('features/collected_items/listeners/collected_items', function(require) {
    'use strict';

    var Backbone = require_legacy('Backbone'),
        CollectedItemsWindowFactory = require('features/collected_items/factories/collected_items'),
        BenefitHelper = require('helpers/benefit'),
        StorageHelper = require('features/collected_items/helpers/collected_items_storage'),
        COLLECTED_ITEMS_BADGE_SELECTOR = '#happening_large_icon .amount',
        EVENT_SKINS = require('enums/event_skins'),
        HAPPENINGS = require('enums/happenings');

    var Listener = us.extend({
        initialize: function(models, collections) {
            this.event_end_at = BenefitHelper.getEventEndAt();
            this.window_skin = BenefitHelper.getBenefitSkin();

            if (this.event_end_at === 0) {
                return;
            }

            collections.collected_items.onCollectedItemsAddChange(
                this,
                this.handleCollectedItemAddChange.bind(this)
            );

            $.Observer().unsubscribe('collected_item_badge');
            $.Observer(GameEvents.happenings.window.opened).subscribe(
                ['collected_item_badge', 'open_event_window'],
                this.resetBadge.bind(this)
            );
            $.Observer(GameEvents.happenings.icon.initialize).subscribe(
                ['collected_item_badge', 'initialize_icon'],
                this.updateBadgeAmountOnEventIcon.bind(this, 0)
            );

            WM.markPersistentData('collections', 'CollectedItems');
        },

        handleCollectedItemAddChange: function(model) {
            if (!WM.isOpened('collected_items')) {
                CollectedItemsWindowFactory.openWindow(this.window_skin);
            }

            this.updateBadgeAmountOnEventIcon(model.getDelta());
        },

        updateBadgeAmountOnEventIcon: function(delta) {
            var window_type = BenefitHelper.getWindowType(),
                items_data = StorageHelper.getStoredItemsData();

            // For the missions event we use the badge to show if a mission is finished
            if (window_type === HAPPENINGS.MISSIONS) {
                return;
            }

            if (WM.isOpened(window_type)) {
                return;
            }

            if (delta > 0) {
                items_data.items_count += 1;
                items_data.delta += delta;
                StorageHelper.storeItemsData(items_data, this.getStoredItemsDataTTL());
            }

            if (items_data.delta > 0) {
                this.showBadge(items_data);
            }
        },

        showBadge: function(items_data) {
            $(COLLECTED_ITEMS_BADGE_SELECTOR).html(items_data.delta).show();
        },

        resetBadge: function() {
            var items_data = StorageHelper.getStoredItemsData();
            items_data.delta = 0;

            StorageHelper.storeItemsData(items_data, this.getStoredItemsDataTTL());

            /**
             * This condition is added to override the default behaviour of 'hide badge, on window open'
             * and to make sure that the badge will not be hidden on window open Divine Trials event.
             * */
            if (EVENT_SKINS.DIVINE_TRIALS !== this.window_skin) {
                $(COLLECTED_ITEMS_BADGE_SELECTOR).html(0).hide();
            }
        },

        getStoredItemsDataTTL: function() {
            return this.event_end_at - Timestamp.now();
        },

        /**
         * Needs to be implemented for the GlobalListenersManager
         */
        destroy: function() {

        }
    }, Backbone.Events);

    window.GameListeners.CollectedItems = Listener;

    return Listener;
});