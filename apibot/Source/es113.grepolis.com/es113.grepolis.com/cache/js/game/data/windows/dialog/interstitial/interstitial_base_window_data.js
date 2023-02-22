/*globals DialogWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data needed to create welcome window
     * (its used for every event in the game like Christmass, Halloween etc)
     *
     * @contructor
     */
    function InterstitialBaseWindowData() {

    }

    InterstitialBaseWindowData.inherits(DialogWindowData);

    /**
     * Returns window title
     *
     * @return {String}
     */
    InterstitialBaseWindowData.prototype.getEventName = function() {
        throw "getEventName method is not defined for InterstitialBaseWindowData";
    };

    /**
     * Returns window title
     *
     * @return {String}
     */
    InterstitialBaseWindowData.prototype.getWindowTitle = function() {
        throw "getWindowTitle method is not defined for InterstitialBaseWindowData";
    };

    /**
     * Returns controller class
     *
     * @return {@inherits GameControllers.DialogInterstitialController}
     */
    InterstitialBaseWindowData.prototype.getControllerClass = function() {
        throw "getControllerClass method is not defined for InterstitialBaseWindowData";
    };

    InterstitialBaseWindowData.prototype.getl10n = function() {
        throw "getl10n method is not defined for InterstitialBaseWindowData";
    };

    window.InterstitialBaseWindowData = InterstitialBaseWindowData;
}());