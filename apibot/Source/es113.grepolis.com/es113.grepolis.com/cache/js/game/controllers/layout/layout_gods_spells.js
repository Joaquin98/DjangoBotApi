/*global GameEvents, Game, GameControllers, GameViews, HelperPower */

(function() {
    "use strict";

    var SpellButtonHelper = require('helpers/spell_button');

    var LGSC = {
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            this.$parent = options.$parent;
            this.$menu = options.$menu;
        },

        renderPage: function() {
            this.view = new GameViews.LayoutGodsSpells({
                el: this.$el,
                $parent: this.$parent,
                controller: this
            });

            this.bindEventListeners();

            return this;
        },

        bindEventListeners: function() {
            var player_gods = this.getModel('player_gods'),
                casted_powers = this.getCollection('casted_powers');

            var rerenderSpells = this.view.renderSpells.bind(this.view),
                rerenderGodsFavourValues = this.view.renderGodsFavorValues.bind(this.view);

            //Listen on god change
            player_gods.onGodChange(this, rerenderSpells);
            //Listen on gods favor change
            player_gods.onGodsFavorChange(this, rerenderGodsFavourValues);
            //Listen on new casted power
            casted_powers.onAdd(this, this.view.addActiveStatus.bind(this.view));
            //Listen on power exchange
            casted_powers.onChange(this, function(model) {
                this.view.updateButtonsStates(model.getGodId());
            }.bind(this), this);
            //Listen on casted power expiration
            casted_powers.onRemove(this, function(model) {
                this.removeActiveStatus(model.getPowerId());
            }.bind(this), this);
            //Actually don't know why its here
            casted_powers.onReset(this, this.view.cleanUpSpells.bind(this.view));

            this.observeEvent(GameEvents.town.town_switch, rerenderSpells);
            this.observeEvent(GameEvents.ui.spells_menu.request_open, this.view.openSpellsMenu.bind(this.view));
        },

        /**
         * Calculate unit container height and publish it
         *
         * @param {Boolean} button_state
         *
         * @returns {void}
         */
        publishViewHeight: function(button_state) {
            if (button_state) {
                var $gods_spells_menu = this.$parent.find('.gods_spells_menu'),
                    spells_menu_bottom = $gods_spells_menu.height() + $gods_spells_menu.position().top;

                $.Observer(GameEvents.ui.layout_gods_spells.rendered).publish({
                    spells_menu_bottom: spells_menu_bottom
                });
            } else {
                $.Observer(GameEvents.ui.layout_gods_spells.state_changed).publish({
                    state: button_state
                });
            }
        },

        removeActiveStatus: function(power_id) {
            this.getStrategy('cast_spell_own_town').removeActiveStatus(this, power_id);
        },

        getCastedPowers: function() {
            return this.getCollection('casted_powers').getCastedPowers();
        },

        getCurrentFavorForGod: function(god_id) {
            return this.getModel('player_gods').getCurrentFavorForGod(god_id);
        },

        isPowerNegative: function(power_id) {
            return HelperPower.createCastedPowerModel(power_id, Game.townId).isNegative();
        },

        btnSpellClickHandler: function(town_id, town_name, casted_power, is_my_own_town, callback, _btn) {
            SpellButtonHelper.TownCastSpellHandler(town_id, town_name, casted_power, is_my_own_town, callback, _btn, true);
        },

        btnSpellMouseOverHandler: function(e) {
            SpellButtonHelper.TownSpellMouseOverHandler(e, true, Game.townId);
        },

        destroy: function() {

        }
    };

    window.GameControllers.LayoutGodsSpellsController = GameControllers.BaseController.extend(LGSC);
}());