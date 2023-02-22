/*global GameViews, GameControllers, GameEvents, GameData */

(function() {
    "use strict";

    var HelperTown = require_legacy('HelperTown');

    var LayoutGodsController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.player_gods = this.getModel('player_gods');
            this.view = new GameViews.LayoutGods({
                el: this.$el,
                controller: this
            });

            this.registerEventListeners();
            this.view._updateData();

            return this;
        },

        registerEventListeners: function() {
            this.stopObservingEvents();
            this.observeEvent(GameEvents.town.town_switch, this.view._updateData.bind(this.view));
            this.observeEvent(GameEvents.god.change, this.view._updateData.bind(this.view));

            this.stopListening();
            this.player_gods.on('change', this.view._updateData, this.view);
            this.player_gods.onFuryChange(this, this.view._updateData.bind(this.view));
        },

        registerResourceChangeListener: function(old_god) {
            if (old_god) {
                this.player_gods.offGodsFavorChange(this, old_god);
            }

            this.player_gods.onGodFavorChange(
                this,
                this.getGodForCurrentTown(),
                this.view.setProgressValues.bind(this.view)
            );
        },

        getGodForCurrentTown: function() {
            return HelperTown.getGodForCurrentTown();
        },

        showFuryResource: function() {
            return GameData.gods.ares ? this.player_gods.hasGod(GameData.gods.ares.id) : false;
        },

        getMaxFavor: function() {
            return this.player_gods.getMaxFavor();
        },

        getCurrentFavorForGod: function(god_id) {
            return this.player_gods.getCurrentFavorForGod(god_id);
        },

        getCurrentFury: function() {
            return this.player_gods.getFury();
        },

        getMaxFury: function() {
            return this.player_gods.getMaxFury();
        },

        getCurrentProductionOverview: function() {
            return this.player_gods.getCurrentProductionOverview();
        },

        destroy: function() {
            this.player_gods.off(null, null, this);
        }
    });

    window.GameControllers.LayoutGodsController = LayoutGodsController;
}());