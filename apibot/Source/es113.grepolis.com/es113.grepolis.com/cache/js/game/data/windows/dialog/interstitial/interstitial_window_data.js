/*globals DM, GameData, InterstitialBaseWindowData, GameControllers */

(function() {
    'use strict';

    /**
     * Class which represents data to create welcome window from infopage benefits
     *
     * This subclass was created to handle welcome windows for infopage benefits
     *
     * @see InterstitialBaseWindowData class for details about all methods
     */
    function InterstitialWindowData(benefit, player_hint) {
        this.benefit = benefit;
        this.player_hint = player_hint;
    }

    InterstitialWindowData.inherits(InterstitialBaseWindowData);

    InterstitialWindowData.prototype.getBenefit = function() {
        return this.benefit;
    };

    InterstitialWindowData.prototype.getPlayerHint = function() {
        return this.player_hint;
    };

    InterstitialWindowData.prototype.getType = function() {
        return this.benefit.getParam('type');
    };

    InterstitialWindowData.prototype.getEventName = InterstitialWindowData.prototype.getType;

    InterstitialWindowData.prototype.getWindowTitle = function() {
        return this.getl10n().window_title;
    };

    InterstitialWindowData.prototype.getControllerClass = function() {
        return GameControllers[this.getInterstitialName()] ? GameControllers[this.getInterstitialName()] : GameControllers.DialogInterstitialController;
    };

    InterstitialWindowData.prototype.getInterstitialName = function() {
        return this.benefit.attributes.params.type.camelCase() + 'InterstitialController';
    };

    InterstitialWindowData.prototype.getl10n = function() {
        return DM.getl10n(this.getType(), 'welcome_screen');
    };

    InterstitialWindowData.prototype.getLogoUrl = function() {
        var meta_data = GameData[this.getEventName() + 'Meta'];

        if (!meta_data || !meta_data.external_url) {
            throw 'InterstitialWindowData: please provide GameData.{eventName}Meta.external_url';
        }

        return meta_data.external_url;
    };

    window.InterstitialWindowData = InterstitialWindowData;
}());