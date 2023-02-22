(function() {
    'use strict';

    var View = window.GameViews.BaseView;

    var WorldEndWelcomeView = View.extend({
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

            this.controller.registerComponent('btn_new_worlds', this.$el.find('.btn_new_worlds').button({
                caption: l10n.btn_new_worlds,
                disabled: !this.controller.areNewWorldsExists()
            }).on('btn:click', this.controller.onBtnNewWorldsClick.bind(this.controller)));

            this.controller.registerComponent('btn_continue_fighting', this.$el.find('.btn_continue_fighting').button({
                caption: l10n.btn_continue_fighting
            }).on('btn:click', this.controller.onBtnContinueFightingClick.bind(this.controller)));
        },

        destroy: function() {

        }
    });

    window.GameViews.WorldEndWelcomeView = WorldEndWelcomeView;
}());