(function() {
    'use strict';

    var CastSpellStrategyFactory = {
        getCastSpellOwnTownStrategyInstance: function(models, collections) {
            var Strategy = require('strategy/cast_spell_own_town');

            return new Strategy({
                l10n: {

                },
                models: {

                },
                collections: {

                }
            });
        },

        getCastSpellOtherTownStrategyInstance: function(models, collections) {
            var Strategy = require('strategy/cast_spell_own_town');

            return new Strategy({
                l10n: {

                },
                models: {

                },
                collections: {

                }
            });
        }
    };

    window.CastSpellStrategyFactory = CastSpellStrategyFactory;
}());