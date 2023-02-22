/*globals DM, InfoWindowData */

(function() {
    'use strict';

    function AttackPlanerInfoWindowData(options) {
        this.type = 'info_attack_planner_help';
        this.options = options;
        this.l10n = DM.getl10n('dialog_info', this.type);
    }

    AttackPlanerInfoWindowData.inherits(InfoWindowData);

    AttackPlanerInfoWindowData.prototype.getTitle = function() {
        return this.l10n.title;
    };

    AttackPlanerInfoWindowData.prototype.getTemplateName = function() {
        return 'info_attack_planner';
    };

    AttackPlanerInfoWindowData.prototype.getl10n = function() {
        return this.l10n;
    };

    window.AttackPlanerInfoWindowData = AttackPlanerInfoWindowData;
}());