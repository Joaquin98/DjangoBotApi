/*global Backbone */

(function(views, collections, models) {
    'use strict';

    collections.TabsCollection = Backbone.Collection.extend({
        model: models.TabModel,

        /**
         * Returns model of concrete page
         *
         * @param {Number} tab_index   page number
         *
         * @return {Object}   Backbone.Model object
         */
        getTabByNumber: function(tab_index) {
            return this.where({
                index: tab_index
            })[0];
        },

        getTabByType: function(tab_index) {
            return this.where({
                type: tab_index
            })[0];
        },

        showTab: function(tab_index) {
            var tab = this.where({
                index: tab_index
            })[0];
            tab.show();
        },

        hideTab: function(tab_index) {
            var tab = this.where({
                index: tab_index
            })[0];
            tab.hide();
        },

        disableTab: function(tab_index) {
            var tab = this.where({
                index: tab_index
            })[0];
            tab.disable();
        },

        enableTab: function(tab_index) {
            var tab = this.where({
                index: tab_index
            })[0];
            tab.enable();
        },

        disable: function() {
            this.each(function(tab) {
                tab.disable();
            });
        },

        enable: function() {
            this.each(function(tab) {
                tab.enable();
            });
        },

        comparator: function(tab_model) {
            return -tab_model.get('index');
        },

        setTabTitle: function(title, tab_index) {
            var tab = this.where({
                index: tab_index
            })[0];
            tab.setTitle(title);
        },

        onTabNameChange: function(obj, callback) {
            obj.listenTo(this, 'change:title', callback);
        },

        onTabVisibilityChange: function(obj, callback) {
            obj.listenTo(this, 'change:hidden', callback);
        },

        onTabHighlightChange: function(obj, callback) {
            obj.listenTo(this, 'change:highlight', callback);
        },

        onTabEnabledStateChange: function(obj, callback) {
            obj.listenTo(this, 'change:disabled', callback);
        }
    });
}(window.WindowManagerViews, window.WindowManagerCollections, window.WindowManagerModels));