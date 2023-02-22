/*globals GPWindowMgr, _ */

window.FarmTownOverviewWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens 'Farm Town Overview' window
         */
        openFarmTownOverview: function() {
            return GPWindowMgr.Create(GPWindowMgr.TYPE_FARM_TOWN_OVERVIEWS, _('Farming villages'), {});
        }
    };
}());