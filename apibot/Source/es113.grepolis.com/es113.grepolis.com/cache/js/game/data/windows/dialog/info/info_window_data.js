/*globals DialogWindowData, GameControllers */

(function() {
    'use strict';

    /**
     * Class which represents data needed to create 'info' window
     *
     * @contructor
     */
    function InfoWindowData(options) {
        this.options = options;
    }

    InfoWindowData.inherits(DialogWindowData);

    InfoWindowData.prototype.getTitle = function() {
        throw 'Please specify title you want to display in the window.';
    };

    InfoWindowData.prototype.getType = function() {
        return this.type;
    };

    InfoWindowData.prototype.getTemplate = function() {
        throw 'Please specify template name.';
    };

    InfoWindowData.prototype.getl10n = function() {
        throw 'Please define .getl10n for InfoWindowData';
    };

    InfoWindowData.prototype.getControllerClass = function() {
        return GameControllers.DialogInfoController;
    };

    window.InfoWindowData = InfoWindowData;
}());