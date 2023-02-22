/* globals LocalStore */
define('features/collected_items/helpers/collected_items_storage', function() {
    var COLLECTED_ITEMS_DATA_KEY = 'collected_items_data';

    return {
        getDefaultItemsData: function() {
            return {
                items_count: 0,
                delta: 0
            };
        },

        getStoredItemsData: function() {
            return LocalStore.get(COLLECTED_ITEMS_DATA_KEY) || this.getDefaultItemsData();
        },

        storeItemsData: function(data, valid_until) {
            LocalStore.set(COLLECTED_ITEMS_DATA_KEY, data, valid_until);
        }
    };
});