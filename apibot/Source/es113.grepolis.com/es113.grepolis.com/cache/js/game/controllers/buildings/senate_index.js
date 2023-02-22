/*globals DM, GameControllers */

(function() {
    "use strict";

    var SenateController = GameControllers.TabController.extend({
        events: {

        },

        renderPage: function(data) {
            this.models = data.models;
            this.collections = data.collections;

            this.templates = {
                index: DM.getTemplate('senate', 'index'),
                building: DM.getTemplate('senate', 'building')
            };

            this.l10n = DM.getl10n('common', 'senate');

            var main_view = new window.GameViews.SenateMainView({
                controller: this,
                el: this.$el
            });

            main_view.render();

            return this;
        },

        destroy: function() {

        }
    });

    window.GameControllers.SenateController = SenateController;
}());