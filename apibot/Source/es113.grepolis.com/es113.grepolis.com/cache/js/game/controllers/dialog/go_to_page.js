/*global GameControllers */
(function() {
    'use strict';

    var DialogGoToPageController = GameControllers.TabController.extend({
        view_controller: null,

        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.extendWindowData();

            this.setWindowTitle(this.getTranslationForWindowTitle());

            this.view = new window.GameViews.DialogGoToPage({
                controller: this,
                el: this.$el
            });

            return this;
        },

        extendWindowData: function() {
            this.l10n = {
                question: this.options.data_object.getQuestion()
            };
        },

        getTranslationForWindowTitle: function() {
            return this.options.data_object.getTitle();
        },

        getBtnConfirmCaption: function() {
            return this.options.data_object.getConfirmCaption();
        },

        getNumberOfPages: function() {
            return this.options.data_object.getNumberOfPages();
        },

        getActivePageNr: function() {
            return this.options.data_object.getActivePageNr();
        },

        getConfirmCallback: function() {
            return this.options.data_object.getConfirmCallback();
        },

        onBtnConfirmClick: function(spinner) {
            var onConfirm = this.getConfirmCallback();

            if (typeof onConfirm === 'function') {
                onConfirm(spinner.getValue());
            }

            this.closeWindow();
        },

        destroy: function() {

        }
    });

    window.GameControllers.DialogGoToPageController = DialogGoToPageController;
}());