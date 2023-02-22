/*globals GameData */

define('features/spells_dialog/views/spells_dialog_own', function() {
    'use strict';

    var SpellDialogBaseView = require('features/spells_dialog/views/spells_dialog_base');

    return SpellDialogBaseView.extend({
        initialize: function() {
            SpellDialogBaseView.prototype.initialize.apply(this, arguments);
        },

        render: function() {
            this.renderTemplate();
            this.registerViewComponents();
            this.initializeActivePowersAnimation();
            this.renderGodsFavor();
        },

        initializeActivePowersAnimation: function() {
            var casted_powers = this.controller.getCastedPowersOnTheTargetTown();

            for (var i = 0, l = casted_powers.length; i < l; i++) {
                this.addActiveStatus(casted_powers[i]);
            }
        },

        addActiveStatus: function(casted_power) {
            var power_id = casted_power.getPowerId(),
                $power_icon = this.$el.find('.js-power-icon.' + power_id),
                button = this.controller.getComponent('powers_button_' + power_id, 'powers_buttons');

            if (button) {
                $power_icon.addClass('active_animation');
                this.updateButtonsStates(casted_power.getGodId());
            }
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
                    casted_power = _self.controller.getCastedPowerOnTheTargetTown(power_id),
                    extendable = !!(casted_power && casted_power.isExtendable()),
                    button = _self.controller.getComponent('powers_button_' + power_id, 'powers_buttons');

                if (button) {
                    if ((!has_enough_favor && !casted_power) || (casted_power && !extendable)) {
                        button.disable();
                    } else {
                        button.enable();
                    }
                }

                if (extendable) {
                    $el.addClass('extendable');
                } else {
                    $el.removeClass('extendable');
                }

                $el.find('.amount .value').html(_self.controller.getPossibleCastsCount(current_favor, power_id));
            });
        }
    });
});