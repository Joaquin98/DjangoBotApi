/* globals GameData */
define('features/spells_dialog/views/spells_dialog_attack', function() {
    'use strict';

    var SpellDialogBaseView = require('features/spells_dialog/views/spells_dialog_base'),
        PowersEnum = require('enums/powers');

    return SpellDialogBaseView.extend({
        initialize: function() {
            SpellDialogBaseView.prototype.initialize.apply(this, arguments);
        },

        render: function() {
            this.renderTemplate();
            this.registerViewComponents();
            this.renderGodsFavor();
            this.registerCloseButton();
        },

        registerCloseButton: function() {
            this.$el.find('.spells_dialog').append('<div class="btn_close"></div>');

            this.unregisterComponent('close_button');
            this.registerComponent('close_button', this.$el.find('.btn_close').button({
                template: 'none'
            }).on('btn:click', this.controller.btnSpellClickHandler.bind(this.controller, PowersEnum.NO_POWER)));
        },

        updateButtonsStates: function(god_id) {
            if (!god_id) {
                return;
            }

            var $available_powers = this.$el.find(".god_container[data-god_id='" + god_id + "'] .js-power-icon"),
                _self = this,
                current_favor = this.controller.getCurrentFavorForGod(god_id);

            $available_powers.each(function(index, el) {
                var $el = $(el),
                    power_id = $el.data('power_id'),
                    gd_power = GameData.powers[power_id],
                    has_enough_favor = current_favor >= gd_power.favor,
                    button = _self.controller.getComponent('powers_button_' + power_id, 'powers_buttons');

                if (button) {
                    if (!has_enough_favor) {
                        button.disable();
                    } else {
                        button.enable();
                    }
                }

                $el.find('.amount .value').html(_self.controller.getPossibleCastsCount(current_favor, power_id));
            });
        }
    });
});