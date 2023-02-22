/*global jQuery, Game, GameEvents, HelperTown, MM, TM, WMap */

(function($, GameEvents) {
    'use strict';

    $(window).on("load", function() {
        /**
         * Keyboard shortcuts
         */
        $.Observer(GameEvents.document.key.arrow_left.up).subscribe('common_listeners', function(e, key_e, is_input) {
            if (!is_input) {
                HelperTown.switchToPreviousTown();
            }
        });

        $.Observer(GameEvents.document.key.arrow_right.up).subscribe('common_listeners', function(e, key_e, is_input) {
            if (!is_input) {
                HelperTown.switchToNextTown();
            }
        });

        $.Observer(GameEvents.document.key.space.up).subscribe('common_listeners', function() {
            WMap.mapJump({
                id: parseInt(Game.townId, 10),
                ix: WMap.islandPosition.x,
                iy: WMap.islandPosition.y
            });
        });

        /**
         * Alliance
         */
        $.Observer(GameEvents.alliance.leave).subscribe('common_listeners', function(e, data) {
            Game.alliance_id = null;
        });

        $.Observer(GameEvents.alliance.join).subscribe('common_listeners', function(e, data) {
            Game.alliance_id = data.alliance_id;
        });

        /**
         * Update notifications / Maintenance mode
         */
        // Check existence for jasmine/phantom environment
        if (MM.getModels().Maintenance) {
            var MAINTENANCE_MODEL_ID = 1; // always fix 1 as set by MaintenancePushable
            var maintenance_model = MM.getModels().Maintenance[MAINTENANCE_MODEL_ID];
            maintenance_model.onUpdate(function() {
                var message = maintenance_model.getMessage();
                if (message) {
                    $('#maintenance_notification').text(message).show();
                } else {
                    $('#maintenance_notification').hide();
                }
            });
        }

        /**
         * show update window as soon as we receive a update notification event
         */
        $.Observer(GameEvents.system.maintenance_started).subscribe('common_listeners', function(e, data) {
            $('#maintenance_notification').hide();
            if (window.UpdateNotificationWindowFactory) {
                window.UpdateNotificationWindowFactory.openWindow();
            }
        });

        /**
         * Global events to reduce timer speed, when tab is in the background.
         *
         * Whenever the tab goes in the BG, we switch from requestAnimationFrame(raf) to setTimeout
         * This allows web-notifications to still work, since raf is paused by browsers.
         **/
        var VisibilityWrapper = require('features/web_notifications/visibility');

        VisibilityWrapper.onVisibilityChange(VisibilityWrapper, function() {
            TM.useSystemTimer(VisibilityWrapper.isHidden());
        });

    });
}(jQuery, GameEvents));