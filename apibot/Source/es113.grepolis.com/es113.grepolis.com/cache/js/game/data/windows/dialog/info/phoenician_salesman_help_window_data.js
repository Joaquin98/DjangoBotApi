/*globals DM, InfoWindowData */

(function() {
    'use strict';

    function PhoenicianSalesmanHelpInfoWindowData(options) {
        this.type = 'info_phoenician_salesman_help';
        this.options = options;
        this.l10n = DM.getl10n('dialog_info', this.type);
    }

    PhoenicianSalesmanHelpInfoWindowData.inherits(InfoWindowData);

    PhoenicianSalesmanHelpInfoWindowData.prototype.getTitle = function() {
        return this.l10n.title_1 + " - " + this.l10n.title_2;
    };

    PhoenicianSalesmanHelpInfoWindowData.prototype.getTemplateName = function() {
        return 'default_tmpl';
    };

    PhoenicianSalesmanHelpInfoWindowData.prototype.getl10n = function() {
        return $.extend(true, {
            descr: this.l10n.descr_1 + '<br/><br/>' + this.l10n.descr_2
        }, this.l10n);
    };

    window.PhoenicianSalesmanHelpInfoWindowData = PhoenicianSalesmanHelpInfoWindowData;
}());