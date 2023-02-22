/*globals ConfirmationWindowData */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "buy hero slot for gold"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationCelebrateOlympicGamesWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationCelebrateOlympicGamesWindowData.inherits(ConfirmationWindowData);

    ConfirmationCelebrateOlympicGamesWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationCelebrateOlympicGamesWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.cost);
    };

    ConfirmationCelebrateOlympicGamesWindowData.prototype.getType = function() {
        return 'celebrate_olympic_games';
    };

    ConfirmationCelebrateOlympicGamesWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationCelebrateOlympicGamesWindowData = ConfirmationCelebrateOlympicGamesWindowData;
}());