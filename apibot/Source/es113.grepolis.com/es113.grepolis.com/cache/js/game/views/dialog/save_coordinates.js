/*globals us, Backbone, DM, GameData */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var DialogSaveCoordinates = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.render();
        },

        render: function() {
            this.$el.html(us.template(this.controller.getTemplate('save_coordinates'), {
                data_object: this.controller.getDataObject()
            }));

            this.registerComponents();

            return this;
        },

        registerComponents: function() {
            //Textbox title
            var txt_title = this.controller.registerComponent('txt_title', this.$el.find('.txt_title').textbox({
                type: 'text',
                value: this.controller.getFieldTitleValue(),
                max: 64
            }).select());

            //Textbox x
            var txt_x = this.controller.registerComponent('txt_x', this.$el.find('.txt_x').textbox({
                type: 'number',
                value: this.controller.getFieldXValue(),
                min: 0,
                max: 9999,
                hidden_zero: false
            }));

            //Textbox y
            var txt_y = this.controller.registerComponent('txt_y', this.$el.find('.txt_y').textbox({
                type: 'number',
                value: this.controller.getFieldYValue(),
                min: 0,
                max: 9999,
                hidden_zero: false
            }));

            //Confirm button
            this.controller.registerComponent('btn_confirm', this.$el.find('.btn_confirm').button({
                caption: this.controller.getConfirmCaption()
            }).on('click', this.controller.onBtnConfirmClick.bind(this.controller, txt_title, txt_x, txt_y)));
        },

        destroy: function() {

        }
    });

    window.GameViews.DialogSaveCoordinates = DialogSaveCoordinates;
}());