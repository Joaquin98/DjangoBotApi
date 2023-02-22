/* global Game */
define('data/awards', function() {
    'use strict';

    var EVENT_CATEGORY = 'event',
        UNOBTAINABLE_CATEGORY = 'unobtainable';

    return {
        getCategories: function() {
            return Game.awards.categories;
        },

        getTiers: function() {
            return Game.awards.tiers;
        },

        isEventCategory: function(category) {
            return category === EVENT_CATEGORY;
        },

        isUnobtainableCategory: function(category) {
            return category === UNOBTAINABLE_CATEGORY;
        },

        getCategoryHash: function(category) {
            return Game.awards.category_hashes[category];
        }
    };
});