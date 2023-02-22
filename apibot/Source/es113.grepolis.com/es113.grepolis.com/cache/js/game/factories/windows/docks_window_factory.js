/*globals BarracksWindowFactory */
window.DocksWindowFactory = (function() {
    'use strict';

    return {
        /**
         * IMPORTANT!
         *
         * Please don't use it, we keep it only for the DataQuickbar.php
         *
         * @deprecated
         */
        openDocksWindow: function() {
            return BarracksWindowFactory.openDocksWindow();
        }
    };
}());