(function() {
    'use strict';

    var View = window.GameViews.BaseView;

    window.GameViews.PhoenicianSalesmanWelcomeView = View.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            View.prototype.initialize.apply(this, arguments);

            this.render();
        },

        render: function() {
            this.$el.html(us.template(this.controller.getTemplate('main'), {
                l10n: this.controller.getl10n()
            }));

            this.registerViewComponents();
        },

        registerViewComponents: function() {
            var l10n = this.controller.getl10n();

            this.controller.registerComponent('btn_go_to_ps_main_window', this.$el.find('.btn_go_to_ps_main_window').button({
                caption: l10n.go_to_ps_main_window
            }).on('btn:click', this.controller.onButtonClick.bind(this.controller)));
        },

        destroy: function() {

        }
    });
}());