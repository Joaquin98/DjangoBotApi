/*global Backbone, GameData */

(function(views, collections, models) {
    'use strict';

    models.TabModel = Backbone.Model.extend({
        defaults: {
            title: 'Default Caption',
            content_view_constructor: null,
            hidden: false,
            disabled: false,
            maxWidth: null
        },

        isHidden: function() {
            return this.get('hidden');
        },

        isDisabled: function() {
            return this.get('disabled');
        },

        isHighlighted: function() {
            return this.get('highlight');
        },

        getTitle: function() {
            return this.get('title');
        },

        setTitle: function(title) {
            this.set('title', title);
        },

        getType: function() {
            return this.get('type');
        },

        getIndex: function() {
            return this.get('index');
        },

        show: function() {
            this.set('hidden', false);
        },

        hide: function() {
            this.set('hidden', true);
        },

        disable: function() {
            this.set('disabled', true);
        },

        enable: function() {
            this.set('disabled', false);
        },

        enableHighlight: function() {
            this.set('highlight', true);
        },

        disableHighlight: function() {
            this.set('highlight', false);
        },

        requestTabData: function(callback, window_model) {
            window_model.requestTabData(this, callback);
        },

        getRequiredData: function(window_type) {
            if (!GameData.frontendBridge[window_type]) {
                throw 'Window "' + window_type + '" is not defined in data_frontend_bridge.json';
            }
            return GameData.frontendBridge[window_type][this.getType()];
        },

        getMaxWidth: function() {
            return this.get('maxWidth');
        },

        setMaxWidth: function(width) {
            return this.set('maxWidth', width);
        }
    });
}(window.WindowManagerViews, window.WindowManagerCollections, window.WindowManagerModels));