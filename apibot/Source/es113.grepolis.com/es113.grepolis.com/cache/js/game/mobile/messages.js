/* global define, gpAjax, WM, ConfirmationWindowFactory, DOMPurify, Game, MM */

define('mobile/messages', function(require) {
    'use strict';

    var HumanMessage = require('misc/humanmessage'),
        JSON_TRACKING_EVENTS = require('enums/json_tracking');

    var MobileMessages = {
        handleBackButton: function() {
            if (WM.getNumberOfAllOpenWindows() > 0) {
                WM.closeFrontWindow();
            } else {
                ConfirmationWindowFactory.openConfirmationLogout(function() {
                    gpAjax.ajaxPost('player', 'logout', {}, true, function() {});
                });
            }
        },

        registerPush: function(data) {
            gpAjax.ajaxPost('push_notifications', 'register_device', {
                id: DOMPurify.sanitize(data.id),
                token: DOMPurify.sanitize(data.token),
                service: DOMPurify.sanitize(data.service), //'apns' | 'fcm'
                user_agent: DOMPurify.sanitize(data.user_agent),
                device_brand_model: DOMPurify.sanitize(data.device_brand_model),
                build_profile: DOMPurify.sanitize(data.build_profile)
            }, true, function(result) {
                if (result.success) {
                    HumanMessage.success(_("Push notifications registered for this device."));
                }
                if (result.error) {
                    HumanMessage.error(_("Push notifications not registered."));
                }
            });
        },

        /**
         * Set volume to zero when app is minimized and set volume to player preferences when opened again
         *
         * @param {bool} is_muted
         */
        handleSound: function(is_muted) {
            var player_settings = MM.getModelByNameAndPlayerId('PlayerSettings');
            if (player_settings && player_settings.get('muted')) {
                return;
            }

            if (is_muted) {
                Game.Audio.mute();
            } else {
                Game.Audio.unmute();
            }
        },

        updatePlayerGold: function(available_gold) {
            window.top.postMessage({
                message: 'available_gold',
                data: {
                    gold: available_gold
                }
            }, '*');
        },

        openExternalLink: function(url) {
            window.top.postMessage({
                message: 'open_link',
                data: {
                    url: url
                }
            }, '*');
        },

        trackShopOpenEvent: function(payment_session_id) {
            var tracking_data = {
                payment_session_id: DOMPurify.sanitize(payment_session_id),
                screen_info: 'gold_screen'
            };
            if (payment_session_id !== '') {
                window.eventTracking.logJsonEvent(JSON_TRACKING_EVENTS.SHOP_OPEN, tracking_data);
            }
        },

        trackShopCloseEvent: function() {
            window.eventTracking.logJsonEvent(JSON_TRACKING_EVENTS.SHOP_CLOSE, {});
        },

        trackShopErrorEvent: function(payment_session_id, error_code, message) {
            var tracking_data = {
                payment_session_id: DOMPurify.sanitize(payment_session_id),
                type: 'error',
                error_code: DOMPurify.sanitize(error_code),
                message: DOMPurify.sanitize(message)
            };
            if (payment_session_id !== '' && error_code !== '' && message !== '') {
                window.eventTracking.logJsonEvent(JSON_TRACKING_EVENTS.SHOP_ERROR, tracking_data);
            }
        },

        addEventListeners: function() {
            window.addEventListener("message", function(event) {

                var message_obj = event.data;

                /**
                 * Message format is expected to be { message: '<string>', data: {} }
                 */
                if (typeof(message_obj) !== 'object' || !message_obj.hasOwnProperty("message")) {
                    return;
                }

                var message = message_obj.message;
                var data = message_obj.data;

                switch (message) {
                    case 'register_push':
                        this.registerPush(data);
                        break;
                    case 'back_button':
                        this.handleBackButton();
                        break;
                    case 'handle_sound':
                        this.handleSound(data.is_muted);
                        break;
                    case 'open_shop':
                        this.trackShopOpenEvent(data.payment_session_id);
                        break;
                    case 'close_shop':
                        this.trackShopCloseEvent();
                        break;
                    case "error_shop":
                        this.trackShopErrorEvent(data.payment_session_id, data.error_code, data.message);
                        break;
                    default:
                        break;
                }
            }.bind(this), false);
        }
    };

    window.MobileMessages = MobileMessages;

    return MobileMessages;
});