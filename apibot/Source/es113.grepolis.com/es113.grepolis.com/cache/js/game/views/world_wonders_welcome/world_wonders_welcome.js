(function() {
    'use strict';

    var View = window.GameViews.BaseView;
    var Timestamp = require_legacy('Timestamp');
    var getHumanReadableDate = require_legacy('getHumanReadableDate');

    var WorldWondersWelcomeView = View.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            View.prototype.initialize.apply(this, arguments);

            this.render();
        },

        render: function() {
            var l10n = this.controller.getl10n();
            var window_arguments = this.controller.getWindowModel().getArguments();
            var starting_time = window_arguments.age_of_wonder_started_at;
            var dateTime = Timestamp.toDate(starting_time - Timestamp.clientGMTOffset(starting_time));
            var human_readable_time = getHumanReadableDate(dateTime);
            this.$el.html(us.template(this.controller.getTemplate('main'), {
                l10n: l10n,
                descr_1: l10n.descr_1(human_readable_time)
            }));

            this.registerViewComponents();
        },

        registerViewComponents: function() {
            var l10n = this.controller.getl10n();

            this.controller.registerComponent('btn_lets_go', this.$el.find('.btn_lets_go').button({
                caption: l10n.btn_lets_go
            }).on('btn:click', this.controller.onButtonClick.bind(this.controller)));
        },

        destroy: function() {

        }
    });

    window.GameViews.WorldWondersWelcomeView = WorldWondersWelcomeView;
}());