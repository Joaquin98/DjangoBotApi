/*global us, Backbone, SettingsWindowFactory */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LayoutQuickbar = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.render();
        },

        rerender: function() {
            this.render();
        },

        render: function() {
            var controller = this.controller;

            //Render main template
            this.$el.html(us.template(controller.getTemplate('main'), {}));

            //Render options templates
            this.$el.find('.left .container').html(this.getSideOptionsHtml('left'));
            this.$el.find('.right .container').html(this.getSideOptionsHtml('right'));

            this.registerViewComponents();
        },

        /**
         * Returns parsed template for specific side
         *
         * @param {String} side
         *     Possible values:
         *     - 'left'
         *     - 'right'
         *
         * @return {String}
         */
        getSideOptionsHtml: function(side) {
            var controller = this.controller;

            return us.template(controller.getTemplate('options'), {
                options: controller.getOptions(side)
            });
        },

        registerViewComponents: function() {
            var controller = this.controller,
                $el = this.$el;

            controller.unregisterComponents();
            controller.registerComponent('btn_quickbar_settings', $el.find('.btn_quickbar_settings').button({
                template: 'empty',
                tooltips: [{
                    title: this.l10n.edit_quick_bar
                }]
            }).on('btn:click', function() {
                SettingsWindowFactory.openSettingsQuickbar();
            }));

            //Initialize click handler for the quickbar buttons
            this.$el.on('click.quickbar', '.option', function(e) {
                var $target = $(e.currentTarget),
                    option_id = $target.data('option_id');

                controller.handleQuickbarButtonClickEvent(option_id);
            });

            //Initialize dropdowns for the quickbar
            this.$el.find('.quickbar_dropdown').each(function(index, el) {
                var $el = $(el),
                    option_id = $el.data('option_id');

                controller.registerComponent('dd_quickbar_' + option_id, $el.dropdown({
                    value: 0,
                    repeatable_selection: true,
                    type: 'no_caption_update',
                    template: 'internal',
                    hover: true,
                    options: controller.getDropdownOptions(option_id)
                }).on('dd:change:value', function(e, sub_option_index) {
                    controller.handleQuickbarDropdownOptionClickEvent(option_id, sub_option_index);
                }));
            });
        },

        destroy: function() {

        }
    });

    window.GameViews.LayoutQuickbar = LayoutQuickbar;
}());