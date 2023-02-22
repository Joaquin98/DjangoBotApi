/*globals us, GameViews */

(function() {
    'use strict';

    var DialogConfirmation = GameViews.BaseView.extend({
        initialize: function() {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.render();
        },

        render: function() {
            if (this.controller.hasCustomTemplate()) {
                this.$el.html(us.template(this.controller.getCustomTemplate(), this.controller.getCustomTemplateData()));
            } else {
                this.$el.html(us.template(this.controller.getTemplate('confirmation_window'), {
                    l10n: {
                        question: this.controller.getQuestion(),
                        additional_question: this.controller.getSecondQuestion(),
                        resources_names: this.controller.getResourcesNames()
                    },
                    display_checkbox: this.controller.hasCheckbox(),
                    has_resources: this.controller.hasResources(),
                    resources: this.controller.getResources()
                }));
            }

            this.registerComponents();

            return this;
        },

        registerComponents: function() {
            //Confirm button
            this.registerComponent('btn_confirm', this.$el.find('.btn_confirm').button({
                caption: this.controller.getConfirmationButtonCaption()
            }).on('click', this.controller.onBtnConfirmClick.bind(this.controller)));

            //Cancel button
            this.registerComponent('btn_cancel', this.$el.find('.btn_cancel').button({
                caption: this.controller.getCancelButtonCaption()
            }).on('click', this.controller.onBtnCancelClick.bind(this.controller)));

            if (this.controller.hasCheckbox()) {
                //Checkbox
                this.registerComponent('cbx_confirmation', this.$el.find('.cbx_confirmation').checkbox({
                    caption: this.controller.getCheckboxCaption(),
                    checked: this.controller.getCheckboxValue()
                }).on('cbx:check', this.controller.onCheckboxClick.bind(this.controller)));
            }
        },

        destroy: function() {

        }
    });

    window.GameViews.DialogConfirmation = DialogConfirmation;
}());