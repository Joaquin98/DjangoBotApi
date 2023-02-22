(function() {
    'use strict';

    var View = window.GameViews.BaseView;

    var MilitiaWelcomeView = View.extend({
        initialize: function() {
            // Don't remove it, it should call its parent
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

            this.controller.registerComponent('btn_enlist_militia', this.$el.find('.btn_enlist_militia').button({
                caption: l10n.btn_enlist_militia
            }).on('btn:click', this.controller.onButtonClick.bind(this.controller)));
        }
    });

    window.GameViews.MilitiaWelcomeView = MilitiaWelcomeView;
}());