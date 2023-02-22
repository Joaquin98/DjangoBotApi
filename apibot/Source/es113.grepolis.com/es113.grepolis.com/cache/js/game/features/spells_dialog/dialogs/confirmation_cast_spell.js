/*globals ConfirmationWindowData */

define('features/spells_dialog/dialogs/confirmation_cast_spell', function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for god selection
     *
     * @param props {Object}
     *		@param god_id {Number}
     *		@param power_name {String}
     *		@param town_name {String}
     *		@param is_town {Boolean}
     *		@param onConfirm {Function}		confirmation button callback
     *		@param onCancel {Function}		cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationData(props) {
        this.god_id = props.god_id;
        this.power_name = props.power_name;
        this.town_name = props.town_name;
        this.is_town = props.is_town || false;

        // constructor call has to be moved at the end
        // first set the private properties since they are used
        // parent constructor calls getType() which uses this.is_town
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationData.inherits(ConfirmationWindowData);

    ConfirmationData.prototype.hasCustomTemplate = function() {
        return true;
    };

    ConfirmationData.prototype.getTitle = function() {
        return '';
    };

    ConfirmationData.prototype.getQuestion = function() {
        return '';
    };

    ConfirmationData.prototype.getCustomTemplateName = function() {
        return 'cast_spell_confirmation';
    };

    ConfirmationData.prototype.getCustomTemplateData = function() {
        var data = {
            god_id: this.god_id,
            power_name: this.power_name,
            l10n: this.l10n,
            display_checkbox: this.hasCheckbox(),
            is_town: this.is_town
        };

        if (this.is_town) {
            data.town_name = this.town_name;
        }

        return data;
    };

    ConfirmationData.prototype.getType = function() {
        return this.is_town ?
            'cast_spell_confirmation_town' :
            'cast_spell_confirmation_command';
    };

    ConfirmationData.prototype.hasCheckbox = function() {
        return true;
    };

    ConfirmationData.prototype.getConfirmCaption = function() {
        return this.l10n.confirm;
    };

    ConfirmationData.prototype.getCancelCaption = function() {
        return this.l10n.cancel;
    };

    return ConfirmationData;
});