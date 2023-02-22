/*globals us, DM */

(function() {
    'use strict';

    var DialogGoToPage = GameViews.BaseView.extend({
        initialize: function() {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.render();
        },

        render: function() {
            this.$el.html(us.template(this.controller.getTemplate('go_to_page_window'), {
                l10n: this.controller.getl10n()
            }));

            this.registerComponents();

            return this;
        },

        registerComponents: function() {
            //Spinner
            var spinner = this.controller.registerComponent('sp_goto_page', this.$el.find('.sp_goto_page').spinner({
                min: 1,
                max: this.controller.getNumberOfPages(),
                step: 1,
                value: this.controller.getActivePageNr()
            }));

            //Confirm button
            this.controller.registerComponent('btn_confirm', this.$el.find('.btn_confirm').button({
                caption: this.controller.getBtnConfirmCaption()
            }).on('click', this.controller.onBtnConfirmClick.bind(this.controller, spinner)));
        },

        destroy: function() {

        }
    });

    window.GameViews.DialogGoToPage = DialogGoToPage;
}());