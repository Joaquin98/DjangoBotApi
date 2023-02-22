/*global GameModels, Backbone */

(function() {
    'use strict';

    /*
    id: 0
    image: "/game/toolbar/main.png"
    name: "Senat"
    url: "javascript:MainWindowFactory.openMainWindow()"
    */

    var QuickbarOption = Backbone.Model.extend({
        getId: function() {
            return this.get('item').id;
        },

        /**
         * Returns name of the option
         *
         * @return {String}
         */
        getName: function() {
            return this.get('item').name;
        },

        /**
         * Returns js snippet created by user of the default one
         * prepared by us
         *
         * @return {String}
         */
        getSnippet: function() {
            return this.get('item').url;
        },

        /**
         * Returns information whether the option is a single option,
         * or contains a list of options
         *
         * @return {Boolean}
         */
        isDropdownMenu: function() {
            return this.get('options').length > 0;
        },

        /**
         * Returns array of sub options {GameModels.QuickbarSubOption}
         *
         * @return {Array}
         */
        getSubOptions: function() {
            var options = this.get('options'),
                i, l = options.length,
                wrapped = [];

            for (i = 0; i < l; i++) {
                wrapped.push(new GameModels.QuickbarSubOption(options[i]));
            }

            return wrapped;
        },

        /**
         * Returns sub option
         *
         * @return {GameModels.QuickbarSubOption}
         */
        getSubOption: function(sub_option_index) {
            var option = this.get('options')[sub_option_index] || false;

            return option ? new GameModels.QuickbarSubOption(option) : option;
        }
    });

    window.GameModels.QuickbarOption = QuickbarOption;
}());