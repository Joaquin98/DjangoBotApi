/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data to create confirmation window for
     * "Heroes - Call new heroes"
     *
     * @param props {Object}
     *     @param onConfirm {Function}      confirmation button callback
     *     @param cost {Number}             cost of the ingredient
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuyCallNewHeroesWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationBuyCallNewHeroesWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuyCallNewHeroesWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationBuyCallNewHeroesWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.cost);
    };

    ConfirmationBuyCallNewHeroesWindowData.prototype.getType = function() {
        return 'call_new_heroes';
    };

    ConfirmationBuyCallNewHeroesWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuyCallNewHeroesWindowData = ConfirmationBuyCallNewHeroesWindowData;
}());