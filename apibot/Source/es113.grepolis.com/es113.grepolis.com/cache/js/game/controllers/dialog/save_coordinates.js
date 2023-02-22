/*global GameControllers */
(function() {
    'use strict';

    var DialogSaveCoordinatesController = GameControllers.TabController.extend({
        view_controller: null,

        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.extendWindowData();

            this.setWindowTitle(this.getTranslationForWindowTitle());

            this.view = new window.GameViews.DialogSaveCoordinates({
                controller: this,
                el: this.$el
            });

            return this;
        },

        extendWindowData: function() {

        },

        getTranslationForWindowTitle: function() {
            return this.options.data_object.getTitle();
        },

        getDataObject: function() {
            return this.options.data_object;
        },

        getFieldTitleValue: function() {
            return this.options.data_object.getFieldTitleValue();
        },

        getFieldXValue: function() {
            return this.options.data_object.getFieldXValue();
        },

        getFieldYValue: function() {
            return this.options.data_object.getFieldYValue();
        },

        getConfirmCaption: function() {
            return this.options.data_object.getConfirmCaption();
        },

        onBtnConfirmClick: function(txt_title, txt_x, txt_y) {
            var data_object = this.getDataObject(),
                onConfirm = data_object.getConfirmCallback();

            onConfirm(txt_title.getValue(), txt_x.getValue(), txt_y.getValue());

            this.closeWindow();
        },

        destroy: function() {

        }
    });

    window.GameControllers.DialogSaveCoordinatesController = DialogSaveCoordinatesController;
}());