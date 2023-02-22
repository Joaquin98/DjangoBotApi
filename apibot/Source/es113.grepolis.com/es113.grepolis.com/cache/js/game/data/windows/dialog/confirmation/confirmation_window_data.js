/*globals DM, DialogWindowData, GameControllers, MM */

(function() {
    'use strict';

    /**
     * Common problems:
     *
     * ------------------------------------
     * Confirmation button stays grayed out
     * ------------------------------------
     * It happends in the "not enough gold windows", 'callback' function in the 'NotEnoughGoldWindowData' gets 'callbacks' object
     * as an argument, you have to pass it to the request, so it will be executed.
     */

    /**
     * Class which represents data needed to create confirmation window
     *
     * @contructor
     */
    function ConfirmationWindowData(props) {
        //This constructor is called by .inherit function on the game load, so we have to check whether its instantiation or game load
        //Dummy check
        if (typeof this.getType === 'function') {
            this.props = props;
            this.l10n = DM.getl10n('premium')[this.getType()].confirmation;
        }
    }

    ConfirmationWindowData.inherits(DialogWindowData);

    /**
     * Returns title which is used in the title of confirmation window
     *
     * @return {String}
     */
    ConfirmationWindowData.prototype.getTitle = function() {
        throw 'getTitle method is not defined';
    };

    /**
     * Returns question string which is used in the confirmation window
     *
     * @return {String}
     */
    ConfirmationWindowData.prototype.getQuestion = function() {
        throw 'getQuestion method is not defined';
    };

    /**
     * Returns caption of the confirmation button
     *
     * @return {String}
     */
    ConfirmationWindowData.prototype.getConfirmCaption = function() {
        return DM.getl10n('COMMON', 'game').default_confirm_caption;
    };

    /**
     * Returns caption of the cancel button
     *
     * @return {String}
     */
    ConfirmationWindowData.prototype.getCancelCaption = function() {
        return DM.getl10n('COMMON', 'game').default_cancel_caption;
    };

    /**
     * Returns function which is triggered when confirmation button is pressed
     *
     * @return {Function}
     */
    ConfirmationWindowData.prototype.getConfirmCallback = function() {
        return this.props.onConfirm;
    };

    /**
     * Returns function which is triggered when cancel button is pressed
     *
     * @return {Function}
     */
    ConfirmationWindowData.prototype.getCancelCallback = function() {
        return this.props.onCancel;
    };

    /**
     * Returns whether the checkbox should be displayed or not
     *
     * @return {Boolean}
     */
    ConfirmationWindowData.prototype.hasCheckbox = function() {
        return false;
    };

    ConfirmationWindowData.prototype.getCheckboxCaption = function() {
        return DM.getl10n('COMMON', 'game').toggle_spend_gold_confirmation;
    };

    ConfirmationWindowData.prototype.getCheckboxValue = function() {
        return MM.getCollections().PlayerHint[0].getForType(this.getType()).isHidden();
    };

    ConfirmationWindowData.prototype.getCheckboxCallback = function() {
        var type = this.getType();

        return function(checked) {
            var hint = MM.getCollections().PlayerHint[0].getForType(type);
            hint.setHidden(checked);
        };
    };

    ConfirmationWindowData.prototype.getControllerClass = function() {
        return GameControllers.DialogConfirmationController;
    };

    ConfirmationWindowData.prototype.getCost = function() {
        return this.props.cost;
    };

    ConfirmationWindowData.prototype.getCurrencyId = function() {
        return 'gold';
    };

    window.ConfirmationWindowData = ConfirmationWindowData;
}());