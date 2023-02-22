/*global GameControllers */
(function() {
    'use strict';

    var DialogInfoController = GameControllers.TabController.extend({
        view_controller: null,

        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function(data) {
            this.extendWindowData();
            this.setWindowTitle(this.getTranslationForWindowTitle());
            this.initializeView();

            return this;
        },

        /**
         * This function is splitted to be overwritten by the child
         */
        initializeView: function() {
            this.view = new window.GameViews.DialogInfo({
                controller: this,
                el: this.$el
            });
        },

        getDialogInfoTemplate: function() {
            return this.getTemplate(this.options.data_object.getTemplateName());
        },

        extendWindowData: function() {
            this.l10n = this.options.data_object.getl10n();
        },

        getTranslationForWindowTitle: function() {
            return this.options.data_object.getTitle();
        },

        getType: function() {
            return this.options.data_object.getType();
        },

        destroy: function() {

        }
    });

    window.GameControllers.DialogInfoController = DialogInfoController;
}());