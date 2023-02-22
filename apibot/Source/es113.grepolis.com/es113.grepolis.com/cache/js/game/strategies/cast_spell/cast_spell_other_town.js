define('strategy/cast_spell_other_town', function() {
    'use strict';

    var BaseCastSpell = require('strategy/cast_spell_base');

    function CastSpellOtherTown() {
        BaseCastSpell.prototype.constructor.apply(this, arguments);
    }

    CastSpellOtherTown.inherits(BaseCastSpell);

    CastSpellOtherTown.prototype.getTemplateName = function() {
        return 'queue';
    };

    return CastSpellOtherTown;
});