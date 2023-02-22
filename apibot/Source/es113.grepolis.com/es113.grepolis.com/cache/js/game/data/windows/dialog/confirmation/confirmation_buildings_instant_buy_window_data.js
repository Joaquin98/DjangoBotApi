/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "buy inventory slot for gold"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationBuildingsInstantBuyWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);

        this.building_mode = this.props.order.isBeingTearingDown() ? 'demolishing' : 'constructing';
    }

    ConfirmationBuildingsInstantBuyWindowData.inherits(ConfirmationWindowData);

    ConfirmationBuildingsInstantBuyWindowData.prototype.getTitle = function() {
        return this.l10n.window_title[this.building_mode];
    };

    ConfirmationBuildingsInstantBuyWindowData.prototype.getQuestion = function() {
        return this.l10n.question[this.building_mode](this.props.cost);
    };

    ConfirmationBuildingsInstantBuyWindowData.prototype.getType = function() {
        return 'instant_buy_buildings';
    };

    ConfirmationBuildingsInstantBuyWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationBuildingsInstantBuyWindowData = ConfirmationBuildingsInstantBuyWindowData;
}());