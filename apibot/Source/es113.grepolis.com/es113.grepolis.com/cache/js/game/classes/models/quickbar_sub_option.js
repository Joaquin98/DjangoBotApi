/*global Backbone */

(function() {
    'use strict';

    /*
    name: "Temple"
    url: "javascript:LTempleWindowFactory.openTempleWindow()"
    */

    var QuickbarSubOption = Backbone.Model.extend({
        /**
         * Returns name of the option
         *
         * @return {String}
         */
        getName: function() {
            return this.get('name');
        },

        /**
         * Returns js snippet created by user of the default one
         * prepared by us
         *
         * @return {String}
         */
        getSnippet: function() {
            return this.get('url');
        }
    });

    window.GameModels.QuickbarSubOption = QuickbarSubOption;
}());