/*globals ConfirmationWindowData */

define('features/spells_dialog/dialogs/confirmation_cast_negative_spell', function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "casting negative spells"
     *
     * @param props {Object}
     *		@param is_town {Boolean}
     *		@param onConfirm {Function}   confirmation button callback
     *		@param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationCastNegativeSpell(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
        this.is_town = props.is_town || false;
    }

    ConfirmationCastNegativeSpell.inherits(ConfirmationWindowData);

    ConfirmationCastNegativeSpell.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationCastNegativeSpell.prototype.getQuestion = function() {
        return this.l10n.question;
    };

    ConfirmationCastNegativeSpell.prototype.getType = function() {
        return this.is_town ?
            'cast_negative_spell_on_own_town' :
            'cast_negative_spell_on_own_command';
    };

    ConfirmationCastNegativeSpell.prototype.hasCheckbox = function() {
        return false;
    };

    return ConfirmationCastNegativeSpell;
});