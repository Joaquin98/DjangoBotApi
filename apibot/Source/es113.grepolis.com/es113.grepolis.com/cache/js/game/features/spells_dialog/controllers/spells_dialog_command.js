/* globals GameData, GrepoApiHelper, ConfirmationWindowFactory, InfoWindowFactory */
define('features/spells_dialog/controllers/spells_dialog_command', function() {
    'use strict';

    var SpellsDialogBaseController = require('features/spells_dialog/controllers/spells_dialog_base'),
        SpellsDialogCommandView = require('features/spells_dialog/views/spells_dialog_command');

    return SpellsDialogBaseController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            SpellsDialogBaseController.prototype.initialize.apply(this, arguments);
            this.is_own_command = options.is_own_command;
        },

        renderPage: function() {
            this.view = new SpellsDialogCommandView({
                el: this.$el,
                controller: this,
                is_town: false
            });

            this.registerEventListeners();
        },

        castSpell: function(power) {
            var callback = function(data) {
                var report_id = data.report_id;

                this.publishCastPowerEvent(power.id);

                if (report_id) {
                    this.showViewReportBox(report_id);
                }
            }.bind(this);

            GrepoApiHelper.execute('Commands', 'cast', {
                id: this.target_id,
                power_id: power.id
            }, callback);
        },

        onConfirmCastSpell: function(power) {
            var movement = this.getCollection('movements_units').getMovementByCommandId(this.target_id),
                on_confirm = this.castSpell.bind(this, power);

            if (this.is_own_command && power.negative) {
                ConfirmationWindowFactory.openConfirmationCastNegativeSpellOnOwnCommand(on_confirm);
            } else if (this.is_own_command && power.id === 'cap_of_invisibility' && !movement.wouldCapOfInvisibilityStillBeEffective()) {
                InfoWindowFactory.openCapOfInvisibilityInfoWindow();
            } else {
                this.castSpell(power);
            }
        },

        btnSpellClickHandler: function(power_id, e, _btn) {
            var power = GameData.powers[power_id];

            if (power) {
                ConfirmationWindowFactory.openConfirmationCastSpellOnCommand(
                    power.god_id,
                    power.name,
                    this.onConfirmCastSpell.bind(this, power)
                );
            }
        }
    });
});