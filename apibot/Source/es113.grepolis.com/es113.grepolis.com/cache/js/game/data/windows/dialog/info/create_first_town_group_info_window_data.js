/*globals DM, InfoWindowData */

(function() {
    'use strict';

    function CreateFirstTownGroupInfoWindowData(options) {
        this.type = 'info_create_first_town_group';
        this.options = options;
        this.l10n = DM.getl10n('dialog_info', this.type);
    }

    CreateFirstTownGroupInfoWindowData.inherits(InfoWindowData);

    CreateFirstTownGroupInfoWindowData.prototype.getTitle = function() {
        return this.l10n.title;
    };

    CreateFirstTownGroupInfoWindowData.prototype.getTemplateName = function() {
        return 'default_tmpl';
    };

    CreateFirstTownGroupInfoWindowData.prototype.getl10n = function() {
        return this.l10n;
    };

    window.CreateFirstTownGroupInfoWindowData = CreateFirstTownGroupInfoWindowData;
}());