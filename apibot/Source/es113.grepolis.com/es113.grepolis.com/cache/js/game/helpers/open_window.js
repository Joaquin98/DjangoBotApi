/*global _, hCommon, GPWindowMgr */

define('helpers/open_window', function() {
    'use strict';

    var hWindow = {
        /**
         * This function chacks if window of specidied type is opened, and refresh
         * its content
         *
         * Important! It works only for old styled windows, not implemented in Backbone
         *
         * @param {Number} type   Window type @see gpwindowmgr.js line 37, example:
         *                        GPWindowMgr.TYPE_TOWN_OVERVIEWS
         */
        refreshWindowIfOpened: function(type) {
            var wnd = GPWindowMgr.getOpenFirst(type);

            //If window is opened
            if (wnd) {
                //Refresh content
                wnd.reloadContent();
            }
        },

        /**
         * This function chacks if window of specidied type is opened, and refresh
         * its content
         *
         * Important! It works only for old styled windows, not implemented in Backbone
         *
         * @param {Number} type   Window type @see gpwindowmgr.js line 37, example:
         *                        GPWindowMgr.TYPE_TOWN_OVERVIEWS
         */
        closeWindowIfOpened: function(type) {
            var wnd = GPWindowMgr.getOpenFirst(type);

            //If window is opened
            if (wnd) {
                //Refresh content
                wnd.close();
            }
        },

        openReservationList: function(reservation_id, callback) {
            callback = callback || function() {};

            hCommon.openWindow(GPWindowMgr.TYPE_ALLIANCE, _('Reservations'), {
                noInitRequest: true
            }, 'reservation', 'index', {
                reservation_id: reservation_id
            }, 'get', callback);
        },

        /**
         * If you want to use callback (after advisor has been successfuly activated) for this action please use something like this:
         *
         * $.Observer(GameEvents.premium.adviser.activate).subscribe(['buy_captain_for_reservation_tool_attack_planner'], function(e, data) {
         *		if (data.adviser_id === 'captain' || data.all_advisers) {
         *			model.setHasCaptain(true);
         *		}
         *	});
         *
         *
         * !!! Remember to unsubscribe this listener in proper time/place !!!
         * $.Observer(GameEvents.premium.adviser.activate).unsubscribe(['buy_captain_for_reservation_tool_attack_planner']);
         *
         */
        openActivateAdvisorWindow: function(advisor_id) {
            var message = _('Would you like to activate the captain in order to use the attack planner?');

            hCommon.openWindow(GPWindowMgr.TYPE_DIALOG, _('Activate the premium adviser'), {
                prevent_default_request: true
            }, 'premium_features', 'advisor_activate', {
                advisor: advisor_id,
                custom_message: message
            }, 'get', function(data2) {
                data2.getJQElement().find('a.button.advisor').on('click', function(e) {
                    data2.close();
                });
            });
        },

        /**
         * opens player invitation window
         *
         * @param {string} action default: get_mentoring_info
         */
        openMentoringInfoWindow: function(action) {
            action = action || 'get_mentoring_info';

            hCommon.openWindow(GPWindowMgr.TYPE_INVITE_FRIENDS, _('Invite players'), {
                prevent_default_request: true
            }, 'invite_friends', action, {}, 'get');
        },

        openFarmTownOverviewWindow: function() {
            hCommon.openWindow(GPWindowMgr.TYPE_FARM_TOWN_OVERVIEWS, _('Farming villages'), {});
        },

        /*
         * fold or unfold a spoiler
         */
        toggleSpoilerFolding: function(element) {
            var $element = $(element),
                $p = $element.siblings('div.bbcodes_spoiler_text'),
                $button = $element.find('span.middle'),
                $text = $button.text(),
                $alt_text = $element.data('alt_text');

            $button.text($alt_text);
            $element.data('alt_text', $text);
            $p.toggle();
        },

        /**
         * Display a confirm (Yes/No) dialog.
         * Default text for buttons are Yes/No; is changeable through arguments
         *
         * @depricated
         * @param use_player_hint is set to true when we are using the verification manager for creating confirmation prompts (old method) and do
         * not want to send a request to the player api to toggle confirmation popups
         */
        showConfirmDialog: function(title, text, onConfirmation, confirm_text, onCancel, cancel_text, onCheck, check_text, css_class, use_player_hint) {
            title = (title || '').strip();

            var wnd,
                data = {
                    'texts': {
                        'confirm': confirm_text || _('Yes'),
                        'cancel': cancel_text || _('No'),
                        'check': check_text || null,
                        'content': text
                    },
                    'callback': {
                        'confirm': onConfirmation,
                        'cancel': onCancel || null,
                        'check': onCheck || null
                    },
                    'use_player_hint': use_player_hint
                };

            wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_CONFIRM_DIALOG, title, {
                modal: false,
                css_class: css_class
            });
            if (wnd) {
                wnd.getHandler().onRcvData(data);
                return wnd;
            }

            return;
        },

        /**
         * @param {String} sub_tab
         * Possible values:
         * - commander
         */
        openPremiumOverviewWindow: function(sub_tab) {
            var params = {};

            if (sub_tab) {
                params = {
                    sub_content: 'premium_overview',
                    sub_tab: sub_tab
                };
            }

            GPWindowMgr.Create(GPWindowMgr.TYPE_PREMIUM, _('Premium'), params);
        },

        viewReport: function(report_id) {
            var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_REPORT);
            if (w) {
                w.toTop();
                w.getHandler().reportView(report_id);
            } else {
                GPWindowMgr.Create(GPWindowMgr.TYPE_REPORT, _('Reports'), {}, report_id, 'view');
            }
        },

        viewResTransport: function() {
            var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_REPORT);
            if (w) {
                w.toTop();
                w.requestContentGet('report', 'resource_transports', {});
            } else {
                GPWindowMgr.Create(GPWindowMgr.TYPE_REPORT, _('Reports'), {}, 0, 'resource_transports');
            }
        },

        viewMessage: function(message_id) {
            var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_MESSAGE);
            if (w) {
                w.toTop();
                w.getHandler().messageView(message_id, 'view');
            } else {
                GPWindowMgr.Create(GPWindowMgr.TYPE_MESSAGE, _('Messages'), {}, 'view', null, message_id);
            }
        },

        viewAttackPlan: function(attack_id) {
            var w = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_ATTACK_PLANER);
            if (w) {
                w.toTop();
                w.getHandler().showAttack(attack_id);
            } else {
                GPWindowMgr.Create(GPWindowMgr.TYPE_ATTACK_PLANER, _('Attack planner'), {}, 'attacks', {
                    attack_id: attack_id
                });
            }
        }
    };

    window.hOpenWindow = hWindow;

    return hWindow;
});