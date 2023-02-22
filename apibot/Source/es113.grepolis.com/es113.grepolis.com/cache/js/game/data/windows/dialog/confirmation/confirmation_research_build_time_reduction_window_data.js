/*globals ConfirmationWindowData, GameDataResearches */

(function() {
    'use strict';

    /**
     * Class which represents data to create confirmation window for
     * "halve build time building order"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationResearchBuildTimeReductionWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationResearchBuildTimeReductionWindowData.inherits(ConfirmationWindowData);

    ConfirmationResearchBuildTimeReductionWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationResearchBuildTimeReductionWindowData.prototype.getQuestion = function() {
        return this.l10n.question(GameDataResearches.getBuildTimeReductionCost());
    };

    ConfirmationResearchBuildTimeReductionWindowData.prototype.getType = function() {
        return 'research_build_time';
    };

    ConfirmationResearchBuildTimeReductionWindowData.prototype.hasCheckbox = function() {
        return true;
    };

    window.ConfirmationResearchBuildTimeReductionWindowData = ConfirmationResearchBuildTimeReductionWindowData;
}());