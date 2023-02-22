/*globals DM, InfoWindowData */

(function() {
    'use strict';

    function MassRecruitHelpInfoWindowData(options) {
        this.type = 'info_mass_recruit_help';
        this.options = options;
        this.l10n = DM.getl10n('dialog_info', this.type);
    }

    MassRecruitHelpInfoWindowData.inherits(InfoWindowData);

    MassRecruitHelpInfoWindowData.prototype.getTitle = function() {
        return this.l10n.title;
    };

    MassRecruitHelpInfoWindowData.prototype.getTemplateName = function() {
        return 'default_tmpl';
    };

    MassRecruitHelpInfoWindowData.prototype.getl10n = function() {
        return this.l10n;
    };

    window.MassRecruitHelpInfoWindowData = MassRecruitHelpInfoWindowData;
}());