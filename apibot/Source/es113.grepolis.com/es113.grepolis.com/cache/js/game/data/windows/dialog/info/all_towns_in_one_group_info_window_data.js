/*globals DM, InfoWindowData */

(function() {
    'use strict';

    function AllTownsInOneGroupInfoWindowData(options) {
        this.type = 'info_all_towns_in_one_group';
        this.options = options;
        this.l10n = DM.getl10n('dialog_info', this.type);
    }

    AllTownsInOneGroupInfoWindowData.inherits(InfoWindowData);

    AllTownsInOneGroupInfoWindowData.prototype.getTitle = function() {
        return this.l10n.title;
    };

    AllTownsInOneGroupInfoWindowData.prototype.getTemplateName = function() {
        return 'default_tmpl';
    };

    AllTownsInOneGroupInfoWindowData.prototype.getl10n = function() {
        return this.l10n;
    };

    window.AllTownsInOneGroupInfoWindowData = AllTownsInOneGroupInfoWindowData;
}());