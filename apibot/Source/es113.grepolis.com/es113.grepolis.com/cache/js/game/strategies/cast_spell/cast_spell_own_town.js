define('strategy/cast_spell_own_town', function() {
    'use strict';

    var BaseCastSpell = require('strategy/cast_spell_base');

    function CastSpellOwnTown() {
        BaseCastSpell.prototype.constructor.apply(this, arguments);
    }

    CastSpellOwnTown.inherits(BaseCastSpell);

    CastSpellOwnTown.prototype.removeActiveStatus = function(controller, power_id) {
        var $god_containers = controller.$parent.find('.gods_spells_menu .middle .content .god_containers'),
            $power_icon = $god_containers.find('.js-power-icon.' + power_id),
            button = controller.getComponent('powers_button_' + power_id, 'powers_buttons');

        if (button) {
            controller.unregisterComponent('animation_' + power_id, 'powers_buttons_animations');
            $power_icon.removeClass('active_animation');
        }
    };

    return CastSpellOwnTown;
});