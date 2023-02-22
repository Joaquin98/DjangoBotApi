define('features/spells_dialog/controllers/spells_dialog_attack', function() {
    'use strict';

    var SpellsDialogBaseController = require('features/spells_dialog/controllers/spells_dialog_base'),
        SpellsDialogAttackView = require('features/spells_dialog/views/spells_dialog_attack'),
        PowerEnums = require('enums/powers');

    return SpellsDialogBaseController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            SpellsDialogBaseController.prototype.initialize.apply(this, arguments);
            this.onSpellSelect = options.onSpellSelect;
        },

        renderPage: function() {
            this.view = new SpellsDialogAttackView({
                el: this.$el,
                controller: this,
                is_town: false
            });

            this.registerEventListeners();
        },

        getCastablePowersForAllGods: function() {
            return {
                zeus: [PowerEnums.FAIR_WIND],
                poseidon: [],
                hera: [],
                athena: [PowerEnums.STRENGTH_OF_HEROES],
                hades: [
                    PowerEnums.CAP_OF_INVISIBILITY,
                    PowerEnums.RESURRECTION
                ],
                artemis: [PowerEnums.EFFORT_OF_THE_HUNTRESS],
                aphrodite: [],
                ares: [
                    PowerEnums.ARES_ARMY,
                    PowerEnums.BLOODLUST
                ]
            };
        },

        getCastablePowersForAvailableGods: function() {
            var castable_powers = this.getCastablePowersForAllGods(),
                player_gods = this.player_gods.getPlayerAvailableGods(),
                result = {};

            for (var god_id in castable_powers) {
                if (castable_powers.hasOwnProperty(god_id) && player_gods.indexOf(god_id) >= 0) {
                    result[god_id] = castable_powers[god_id];
                }
            }

            return result;
        },

        btnSpellClickHandler: function(power_id, e, _btn) {
            this.onSpellSelect(power_id);
        }
    });
});