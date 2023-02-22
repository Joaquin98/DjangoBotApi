/*global GameControllers */

(function() {
    'use strict';

    var DialogConfirmationController = GameControllers.TabController.extend({
        initialize: function(options) {
            GameControllers.TabController.prototype.initialize.apply(this, arguments);

            this.setOnManualClose(function() {
                var onCancel = this.options.data_object.getCancelCallback();

                if (typeof onCancel === 'function') {
                    onCancel();
                }
            }.bind(this));
        },

        renderPage: function() {
            this.extendWindowData();

            this.setWindowTitle(this.getTranslationForWindowTitle());

            this.view = new window.GameViews.DialogConfirmation({
                controller: this,
                el: this.$el
            });

            return this;
        },

        extendWindowData: function() {

        },

        /**
         * to allow custom templates and templates data
         * e.g. for fatal_attack_dialog with image etc.
         * the template must be added to data_frontend_bridge:
         * dialog/confirmation_window_default/templates
         */
        hasCustomTemplate: function() {
            var data_object = this.options.data_object;

            return typeof data_object.hasCustomTemplate === 'function' && data_object.hasCustomTemplate();
        },

        getCustomTemplate: function() {
            var data_object = this.options.data_object;

            return this.getTemplate(data_object.getCustomTemplateName());
        },

        getCustomTemplateData: function() {
            return this.options.data_object.getCustomTemplateData();
        },

        getTranslationForWindowTitle: function() {
            return this.options.data_object.getTitle();
        },

        getQuestion: function() {
            return this.options.data_object.getQuestion();
        },

        /**
         * @deprecated: move to custom template
         */
        getSecondQuestion: function() {
            if (this.options.data_object.getSecondQuestion) {
                return this.options.data_object.getSecondQuestion();
            }
            return '';
        },

        getConfirmationButtonCaption: function() {
            return this.options.data_object.getConfirmCaption();
        },

        getCancelButtonCaption: function() {
            return this.options.data_object.getCancelCaption();
        },

        getCheckboxCaption: function() {
            return this.options.data_object.getCheckboxCaption();
        },

        hasCheckbox: function() {
            return this.options.data_object.hasCheckbox();
        },

        getCheckboxValue: function() {
            return this.options.data_object.getCheckboxValue();
        },

        hasResources: function() {
            return typeof this.options.data_object.hasResources === 'function' ? this.options.data_object.hasResources() : false;
        },

        getResources: function() {
            if (!this.hasResources()) {
                return {};
            }
            return this.options.data_object.getResources();
        },

        getResourcesNames: function() {
            if (!this.hasResources()) {
                return {};
            }

            return this.options.data_object.getResourcesNames();
        },

        onBtnConfirmClick: function() {
            var onConfirm = this.options.data_object.getConfirmCallback();

            if (typeof onConfirm === 'function') {
                onConfirm();
            }

            this.closeWindow();
        },

        onBtnCancelClick: function() {
            var onCancel = this.options.data_object.getCancelCallback();

            if (typeof onCancel === 'function') {
                onCancel();
            }

            this.closeWindow();
        },

        onCheckboxClick: function(e, _cbx, checked) {
            this.options.data_object.getCheckboxCallback()(checked);
        },

        destroy: function() {

        }
    });

    window.GameControllers.DialogConfirmationController = DialogConfirmationController;
}());