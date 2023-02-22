/*global PremiumWindowFactory */

(function() {
    'use strict';

    var BenefitWithPreconditions = window.GameModels.BenefitWithPreconditions;

    /**
     * Extend this class if you want to have an icon with a countdown for your infopage
     * @constructor
     */
    var SaleInterstitial = function() {};

    SaleInterstitial._satisfiesPrerequisites = function() {
        return this._hasSenateOnLevelGreaterOrEqualThan(3);
    };

    SaleInterstitial.hasIcon = function() {
        return true;
    };

    SaleInterstitial.getPriority = function() {
        return 50;
    };

    SaleInterstitial.isValid = function() {
        return this.isRunning();
    };

    SaleInterstitial.hasTimer = function() {
        return true;
    };

    SaleInterstitial.getTimer = function() {
        return this.getTimestampEnd();
    };

    SaleInterstitial.getOnClickFunction = function() {
        return PremiumWindowFactory.openBuyGoldWindow.bind(PremiumWindowFactory);
    };

    window.GameModels.SaleInterstitial = BenefitWithPreconditions.extend(SaleInterstitial);
}());