/* globals DM, InfoWindowData */

(function() {
    'use strict';

    function CapOfInvisibilityNotPossibleInfoWindowData(options) {
        this.type = 'info_cap_of_invisibility_not_possible_help';
        this.options = options;
        this.l10n = DM.getl10n('dialog_info', this.type);
    }

    CapOfInvisibilityNotPossibleInfoWindowData.inherits(InfoWindowData);

    CapOfInvisibilityNotPossibleInfoWindowData.prototype.getTitle = function() {
        return this.l10n.title;
    };

    CapOfInvisibilityNotPossibleInfoWindowData.prototype.getTemplateName = function() {
        return 'default_tmpl';
    };

    CapOfInvisibilityNotPossibleInfoWindowData.prototype.getl10n = function() {
        return this.l10n;
    };

    window.CapOfInvisibilityNotPossibleInfoWindowData = CapOfInvisibilityNotPossibleInfoWindowData;
}());