(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LayoutButtonNotepad = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.registerViewComponents();
        },

        registerViewComponents: function() {
            var controller = this.controller;

            //Register Button controller
            controller.registerComponent('btn_notepad', this.$el.button({
                template: 'internal',
                tooltips: [{
                    title: _('Notes')
                }]
            }).on('btn:click', function(e, _btn) {
                controller.handleClickEvent();
            }));
        }
    });

    window.GameViews.LayoutButtonNotepad = LayoutButtonNotepad;
}());