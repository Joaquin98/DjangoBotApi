(function() {
    "use strict";

    /**
     * Class which represents data needed to create confirmation window
     *
     * @contructor
     */
    function DialogWindowData() {

    }

    /**
     * Returns translations object
     *
     * @return {Object}
     */
    DialogWindowData.prototype.getl10n = function() {
        return this.l10n || {};
    };

    /**
     * Returns view name which is used to create the confirmation window
     *
     * @return {Controller}
     */
    DialogWindowData.prototype.getControllerClass = function() {
        throw "Please specify getControllerClass method";
    };

    window.DialogWindowData = DialogWindowData;
}());