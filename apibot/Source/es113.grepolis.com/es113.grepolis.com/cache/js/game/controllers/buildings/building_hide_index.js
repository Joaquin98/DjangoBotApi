/*globals DM, us, GameControllers */

(function() {
    "use strict";

    var BuildingHideIndexController = GameControllers.TabController.extend({

        /**
         * @property {window.GameViews.BuildingHideView}
         */
        main_view: null,

        /**
         * render the page, instantiate view
         *
         * @param {Object} data
         * @returns {window.GameControllers.BuildingHideIndexController}
         */
        renderPage: function(data) {
            this.models = data.models;
            this.collections = data.collections;
            this.templates = DM.getTemplate('hide');
            this.l10n = DM.getl10n('hide');

            this.main_view = new window.GameViews.BuildingHideView({
                controller: this,
                el: this.$el
            });

            return this;
        },

        _onTownChange: function() {
            this.setWindowTitle(this.l10n.index.hide + ' (' + this.getCurrentTown().getName() + ')');
        },

        /**
         * trigger store iron for this town
         *
         * @param {Number} amount
         * @return {void}
         */
        storeIron: function(amount) {
            var building_hide = new window.GameModels.Hide();
            building_hide.storeIron(amount);
        },

        /**
         * get overall iron on its way on all spy commands
         *
         * @return {Number}
         */
        getPayedIron: function() {
            var spy_commands = this.getCollection('movements_spys').models;
            var payed_iron = 0;

            us.each(spy_commands, function(object) {
                payed_iron += object.getPayedIron();
            });

            return payed_iron;
        },

        /**
         * @return {window.GameModels.Town}
         */
        getCurrentTown: function() {
            return this.getCollection('towns').getCurrentTown();
        },

        /**
         * @return {window.Backbone.Collection}
         */
        getLastSpyReports: function() {
            return this.getCollection('last_spy_reports');
        },

        /**
         * destroy main view
         *
         * @private
         */
        destroy: function() {
            if (this.main_view && typeof this.main_view._destroy === 'function') {
                this.main_view._destroy();
            }
        }
    });

    window.GameControllers.BuildingHideIndexController = BuildingHideIndexController;
}());