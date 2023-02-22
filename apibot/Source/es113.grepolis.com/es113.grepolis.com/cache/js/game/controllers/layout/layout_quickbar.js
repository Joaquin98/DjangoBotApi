/*global GameViews, GameControllers, console */

(function() {
    "use strict";

    var LayoutQuickbarController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            //Rerender if anything changed in the quickbar options
            this.getModel('quickbar').on('change', function() {
                this.view.rerender();
            }.bind(this), this);
        },

        /**
         * Returns array of options for specific side
         *
         * @param {String} side
         *     Possible values:
         *     - 'left'
         *     - 'right'
         *
         * @return {Array}
         */
        getOptions: function(side) {
            var start = side === 'left' ? 0 : 3,
                stop = side === 'left' ? 2 : 5;

            return this.getModel('quickbar').getOptionsInRange(start, stop);
        },

        /**
         * Returns option by id
         *
         * @param {Integer} option_id
         *
         * @return {GameModels.QuickbarOption}
         */
        getOption: function(option_id) {
            return this.getModel('quickbar').getOption(option_id);
        },

        getDropdownOptions: function(option_id) {
            var option = this.getOption(option_id),
                sub_options = option.getSubOptions(),
                i, l = sub_options.length,
                dropdown_options = [];

            for (i = 0; i < l; i++) {
                dropdown_options.push({
                    name: sub_options[i].getName(),
                    value: i
                });
            }

            return dropdown_options;
        },

        renderPage: function() {
            this.view = new GameViews.LayoutQuickbar({
                el: this.$el,
                controller: this
            });

            return this;
        },

        handleQuickbarButtonClickEvent: function(option_id) {
            var option = this.getOption(option_id),
                snippet = option.getSnippet();

            this.executeJavascript(snippet);
        },

        handleQuickbarDropdownOptionClickEvent: function(option_id, sub_option_index) {
            var option = this.getOption(option_id),
                sub_option = option.getSubOption(sub_option_index);

            this.executeJavascript(sub_option.getSnippet());
        },

        executeJavascript: function(snippet) {
            //Eval is not evil :)
            try {
                eval(snippet);
            } catch (e) {
                // we don't want errors in a user's quickbar setup to pop up in sentry
                console.error(e);
            }
        },

        destroy: function(remove_html) {
            //Unbind all events from the quickbar model
            this.getModel('quickbar').off(null, null, this);

            this.$el.empty();
        }
    });

    window.GameControllers.LayoutQuickbarController = LayoutQuickbarController;
}());