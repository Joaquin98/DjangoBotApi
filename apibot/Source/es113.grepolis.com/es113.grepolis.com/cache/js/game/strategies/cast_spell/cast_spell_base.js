/*globals GameControllers */

define('strategy/cast_spell_base', function() {
    'use strict';

    function CastSpellBase(data) {
        //Parent class is called during game load because of .inherits(), so 'data' might be undefined
        if (typeof data !== 'undefined') {
            this.data = data;
            this.collections = data.collections || {};
            this.models = data.models || {};
            this.l10n = data.l10n || {};
        }
    }

    /**
     * @see GameControllers.BaseController
     */
    CastSpellBase.prototype.getl10n = function() {
        return GameControllers.BaseController.prototype.getl10n.apply(this, arguments);
    };

    /**
     * @see GameControllers.BaseController
     */
    CastSpellBase.prototype.getCollection = function() {
        return GameControllers.BaseController.prototype.getCollection.apply(this, arguments);
    };

    /**
     * @see GameControllers.BaseController
     */
    CastSpellBase.prototype.getModel = function() {
        return GameControllers.BaseController.prototype.getModel.apply(this, arguments);
    };

    CastSpellBase.prototype.renderGodsFavor = function() {
        var gods_favor = this.controller.getCurrentFavorForGods(),
            _self = this;

        this.$el.find('.js-god-box').each(function(index, el) {
            var $god_box = $(el),
                god_id = $god_box.data('god_id');

            $god_box.find('.js-favor').html(gods_favor[god_id]);

            _self.updateButtonsStates(god_id);
        });
    };

    return CastSpellBase;
});