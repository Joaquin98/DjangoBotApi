/*globals WF */

/**
 * @package calendar
 * @subpackage advent
 */
window.AdventWindowFactory = (function() {
    'use strict';
    var BenefitHelper = require('helpers/benefit');

    return {
        /**
         * Opens 'Advent' window
         */
        openAdventWindow: function() {
            var skin = BenefitHelper.getBenefitSkin();

            return WF.open('advent', {
                args: {
                    window_skin: skin
                }
            });
        }
    };
}());