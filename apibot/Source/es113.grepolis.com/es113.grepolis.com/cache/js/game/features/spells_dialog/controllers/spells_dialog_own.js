/* global MM */
define('features/spells_dialog/controllers/spells_dialog_own', function() {
    'use strict';

    var SpellsDialogBaseController = require('features/spells_dialog/controllers/spells_dialog_base'),
        SpellsDialogOwnView = require('features/spells_dialog/views/spells_dialog_own');

    return SpellsDialogBaseController.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            SpellsDialogBaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new SpellsDialogOwnView({
                el: this.$el,
                controller: this
            });

            this.registerEventListeners();
            this.registerOwnTownEventListeners();
        },

        registerOwnTownEventListeners: function() {
            var casted_powers = this.getCastedPowersCollection(),
                town_agnostic_casted_powers = this.getCastedPowers();

            //Listen on god change
            town_agnostic_casted_powers.registerFragmentEventSubscriber(this);

            //Listen on new casted power
            casted_powers.onAdd(this, function(model) {
                this.view.addActiveStatus(model);
            }.bind(this));
            //Listen on power exchange
            casted_powers.onChange(this, function(model) {
                this.view.updateButtonsStates(model.getGodId());
            }.bind(this));
            //Listen on casted power expiration
            casted_powers.onRemove(this, function(model) {
                this.removeActiveStatus(model.getPowerId());
            }.bind(this));
        },

        /**
         * Returns town agnostic collections of casted powers
         * @returns array
         */
        getCastedPowers: function() {
            return MM.getTownAgnosticCollectionsByName('CastedPowers')[0];
        },

        /**
         * returns the casted powers for a given this.target_id
         * @return {[CastedPower]}
         */
        getCastedPowersCollection: function() {
            var casted_powers_town_agnostic = MM.getFirstTownAgnosticCollectionByName('CastedPowers'),
                casted_powers_collection = casted_powers_town_agnostic.getFragment(this.target_id);

            if (casted_powers_collection) {
                return casted_powers_collection;
            }

            return null;
        },

        removeActiveStatus: function(power_id) {
            this.getStrategy('cast_spell_own_town').removeActiveStatus(this, power_id);
        },

        getCastedPowersOnTheTargetTown: function() {
            return this.getCastedPowersCollection().getCastedPowers();
        },

        getCastedPowerOnTheTargetTown: function(power_id) {
            return this.getCastedPowersCollection().getPower(power_id);
        },

        destroy: function() {
            this.getCastedPowers().unregisterFragmentEventSubscriber(this);
        }
    });
});