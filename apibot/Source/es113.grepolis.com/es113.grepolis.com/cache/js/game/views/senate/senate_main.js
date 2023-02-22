/*global Backbone, GameViews, GameModels, GameDataBuildings */

(function() {
    "use strict";

    var SenateMainView = Backbone.View.extend({
        buildings_views: {},

        events: {

        },

        initialize: function(options) {
            this.controller = options.controller;
            this.l10n = this.controller.getl10n('main');
        },

        render: function() {
            this.renderMainLayout();
            this.renderBuildings();

            return this;
        },

        renderMainLayout: function() {
            this.$el.html(us.template(this.controller.getTemplate('index'), {

            }));
        },

        renderBuildings: function() {

        }
    });

    window.GameViews.SenateMainView = SenateMainView;
}());