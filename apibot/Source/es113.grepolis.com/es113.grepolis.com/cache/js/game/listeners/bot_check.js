/*global GameEvents, Timestamp, TM, RecaptchaWindowFactory, Game, WQM, GPWindowMgr */

(function() {
    "use strict";

    if (!GameEvents.bot_check) {
        GameEvents.bot_check = {};
    }

    GameEvents.bot_check.update_started_at_change = 'bot_check:update_started_at_change';

    function displayReCaptcha() {
        return RecaptchaWindowFactory.openRecaptchaWindowBotCheck();
    }

    // When the timestamp changed for the started_at time
    $.Observer(GameEvents.bot_check.update_started_at_change).subscribe('bot_check', function(e, data) {

        // we do not show the captcha window in maximized forum
        // as we are missing a lot of javascript objects
        // and templates
        // we display a popup instead (see gpajax error handling)
        if (window.isForum) {
            return;
        }

        var started_at = Game.bot_check,
            time_left = started_at - Timestamp.now();

        if (started_at === null) {
            return;
        }

        var bot_check_countdown_initialize_callback = function() {
            $('#notification_area').find('span.bot_check_eta').each(function() {
                $(this).countdown().destroy();
                $(this).countdown(started_at).show();
            });
        }.bind(this);

        bot_check_countdown_initialize_callback();

        $('#notification_area').on('finish', function() {
            $('#notification_area').find('span.bot_check_eta').each(function() {
                $(this).countdown().destroy();
            });
        });

        $.Observer(GameEvents.notification.checkstack.spawned).unsubscribe(['bot_check']);
        $.Observer(GameEvents.notification.checkstack.spawned).subscribe(['bot_check'], function(ev, new_notification) {
            if (new_notification.getType() === 'botcheck') {
                bot_check_countdown_initialize_callback();
            }
        });

        TM.unregister("bot_check_display_captcha");

        if (time_left < 0) {
            var priorities = require('game/windows/priorities');

            WQM.addQueuedWindow({
                type: GPWindowMgr.TYPE_RECAPTCHA,
                priority: priorities.getPriority(GPWindowMgr.TYPE_RECAPTCHA),
                open_function: function() {
                    return displayReCaptcha();
                }
            });
        } else {
            TM.register("bot_check_display_captcha", time_left * 1000, displayReCaptcha, {
                max: 1
            });
        }
    });
}());