/*globals DM, DialogWindowData, WMap, GameControllers */

(function() {
    'use strict';

    /**
     * Class which represents data needed to create "go to page" window
     *
     * @contructor
     */
    function SaveCoordinatesWindowData(options) {
        if (!options.onConfirm) {
            throw "'onConfirm' is not specified";
        }

        this.options = options;
        this.l10n = DM.getl10n('COMMON', 'wnd_save_coordinates');
    }

    SaveCoordinatesWindowData.inherits(DialogWindowData);

    SaveCoordinatesWindowData.prototype.getTitle = function() {
        return this.l10n.title;
    };

    SaveCoordinatesWindowData.prototype.getFieldTitleLabel = function() {
        return this.l10n.fields.title.label;
    };

    SaveCoordinatesWindowData.prototype.getFieldTitleValue = function() {
        return this.l10n.fields.title.value;
    };

    SaveCoordinatesWindowData.prototype.getFieldXLabel = function() {
        return this.l10n.fields.x.label;
    };

    SaveCoordinatesWindowData.prototype.getFieldXValue = function() {
        return WMap.getXCoord();
    };

    SaveCoordinatesWindowData.prototype.getFieldYLabel = function() {
        return this.l10n.fields.y.label;
    };

    SaveCoordinatesWindowData.prototype.getFieldYValue = function() {
        return WMap.getYCoord();
    };

    SaveCoordinatesWindowData.prototype.getConfirmCaption = function() {
        return this.l10n.btn_confirm;
    };

    SaveCoordinatesWindowData.prototype.getConfirmCallback = function() {
        return this.options.onConfirm;
    };

    SaveCoordinatesWindowData.prototype.getControllerClass = function() {
        return GameControllers.DialogSaveCoordinatesController;
    };

    window.SaveCoordinatesWindowData = SaveCoordinatesWindowData;
}());