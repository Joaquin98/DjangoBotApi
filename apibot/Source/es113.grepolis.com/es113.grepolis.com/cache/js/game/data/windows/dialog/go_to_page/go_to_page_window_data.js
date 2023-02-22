/*globals DM, DialogWindowData, GameControllers */

(function() {
    "use strict";

    /**
     * Class which represents data needed to create "go to page" window
     *
     * @contructor
     */
    function GoToPageWindowData(options) {
        if (!options.activepagenr) {
            throw "'activepagenr' is not specified";
        }

        if (!options.number_of_pages) {
            throw "'number_of_pages' is not specified";
        }

        if (!options.onConfirm) {
            throw "'onConfirm' is not specified";
        }

        this.options = options;
        this.l10n = DM.getl10n('COMMON', 'wnd_goto_page');
    }

    GoToPageWindowData.inherits(DialogWindowData);

    GoToPageWindowData.prototype.getTitle = function() {
        return this.l10n.title;
    };

    GoToPageWindowData.prototype.getQuestion = function() {
        return this.l10n.page;
    };

    GoToPageWindowData.prototype.getConfirmCaption = function() {
        return this.l10n.btn_confirm;
    };

    GoToPageWindowData.prototype.getConfirmCallback = function() {
        return this.options.onConfirm;
    };

    GoToPageWindowData.prototype.getNumberOfPages = function() {
        return this.options.number_of_pages;
    };

    GoToPageWindowData.prototype.getActivePageNr = function() {
        return this.options.activepagenr;
    };

    GoToPageWindowData.prototype.getControllerClass = function() {
        return GameControllers.DialogGoToPageController;
    };

    window.GoToPageWindowData = GoToPageWindowData;
}());