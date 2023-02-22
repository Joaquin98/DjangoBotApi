/*global GameControllers */

(function() {
    'use strict';

    var DialogBaseController = GameControllers.TabController.extend({
        view_controller: null,

        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            var data_object = this.getDataObject(),
                ControllerClass = data_object.getControllerClass();

            this.l10n = this.getPreloadedData().l10n || data_object.getl10n();

            var controller = this.registerController('dialog_sub_controller', new ControllerClass({
                el: this.$el,
                data_object: data_object,
                parent_controller: this
            }));

            controller.renderPage();

            return this;
        },

        /**
         * Returns data DialogWindowData passed during window initialization
         *
         * @return {DialogWindowData}
         */
        getDataObject: function() {
            return this.getPreloadedData().preloaded_data.data_object;
        },

        destroy: function() {

        }
    });

    window.GameControllers.DialogBaseController = DialogBaseController;
}());