/*globals MM, Game, ConfirmationWindowFactory, gpAjax */

(function($, window) {
    'use strict';

    /**
     * Class which manages communication with user when he want to use premium feature.
     * It checks if user has enough gold and if not shows 'not enough gold' window to him,
     * otherwise (if show premium confirmation dialog flag is enabled) shows confirmation window
     * asking if user realy want to spend gold, after last confirmation buys feature
     *
     * @param confirmation_data_object {Object}   an instance of the ConfirmationDialogDataStuff class
     *
     * @constructor
     */
    function PremiumWindowFinishForGold(confirmation_data) {
        this.confirmation_data = confirmation_data;

        //Get access to player ledger
        var player_ledger = MM.checkAndPublishRawModel('PlayerLedger', {
                id: Game.player_id
            }),
            currency_id = confirmation_data.getCurrencyId(),
            cost = confirmation_data.getCost();

        if (cost > 0) {
            //If user has enough gold
            if (player_ledger.getCurrency(currency_id) >= cost) {
                this.openConfirmationWindow();
            } else if (currency_id === 'gold') {
                this.openNotEnoughGoldWindow();
            }
        } else {
            // if a premium function is free (e.g. instant buy) call back instantly
            var onConfirmation = this.confirmation_data.getConfirmCallback();
            onConfirmation();
        }
    }

    /**
     * Opens confirmation window if show premium confirmation dialog flag is enabled
     * or executes action directly
     */
    PremiumWindowFinishForGold.prototype.openConfirmationWindow = function() {
        var onConfirmation = this.confirmation_data.getConfirmCallback(),
            hint_type = this.confirmation_data.getType();

        var hint = MM.getCollections().PlayerHint[0].getForType(hint_type);

        if (!hint.isHidden()) {
            ConfirmationWindowFactory.openConfirmationWindow(this.confirmation_data);
        } else {
            onConfirmation();
        }
    };

    /**
     * Opens not enough gold window
     */
    PremiumWindowFinishForGold.prototype.openNotEnoughGoldWindow = function() {
        window.NoGoldDialogWindowFactory.openWindow(this.confirmation_data.getType(), this.confirmation_data);
    };



    window.PremiumWindowFinishForGold = PremiumWindowFinishForGold;
}(jQuery, window));