/* globals NotificationType, ITowns, Layout, WQM, MilitiaWelcomeWindowFactory, readableUnixTimestamp, MM,
MassNotificationType, gpAjax, GameEvents, Game, _, s, Timestamp, GrepoNotificationStack, NotificationFactory, JSON */
(function() {
    'use strict';
    var CommandsHelper = require('helpers/commands');

    /**
     * Notifiaction Handler, used to handle fetched notifiactions from backend
     */
    function NotificationHandler() {
        var _self = this;
        var notification_queue_timer = null;

        /**
         * Handles the default notification
         *
         * @param {object} notification
         * @return void
         */
        function handleDefault(notification) {
            if (notification.type === NotificationType.PHOENICIAN_SALESMAN_ARRIVED) {
                // Check for 'town in notification referenced still is 'ours'
                if (ITowns.getTown(notification.param_id) === undefined) {
                    gpAjax.ajaxPost('notify', 'delete', {
                        id: notification.id
                    }, false);
                    return;
                }
            }

            if (notification.type !== NotificationType.NEWTEMPREPORT) {
                notification.subject = '<a class="notify_subjectlink" href="#">' + notification.subject + '</a>';
            }

            if (notification.type === NotificationType.NEWREPORT) {
                $.Observer(GameEvents.notification.report.arrive).publish(notification);
            }

            _self.notify(
                notification.id,
                notification.type,
                notification.subject + '<span class="small notification_date">' +
                readableUnixTimestamp(notification.time, 'player_timezone', {
                    extended_date: true
                }) + '</span>',
                notification.time,
                notification.param_id,
                notification.param_str,
                notification.game_initialization
            );
        }

        /**
         * system notifications are forwarded as an event so many components can
         * access them independently
         *
         * @param {object} notification
         * @return void
         */
        function handleSystemNotification(notification) {
            $.Observer(GameEvents.notification.system.arrive).publish([notification.subject], notification);
        }

        /**
         * Handles notification for incoming attack
         *
         * @param {object} notification
         * @return void
         */
        function handleIncomingAttack(notification) {
            var windows = require('game/windows/ids');
            var priorities = require('game/windows/priorities');

            if (Layout.player_hint_settings !== undefined) {
                var notification_subject = notification.subject,
                    player_settings = MM.getModelByNameAndPlayerId('PlayerSettings'),
                    town = {
                        id: (notification.param_str ? JSON.parse(notification.param_str).town_id : false) || Game.townId
                    },
                    current_town_model = MM.getCollections().Town[0].getCurrentTown(),
                    town_name = notification.param_str ? JSON.parse(notification.param_str).town_name : '',
                    militia = current_town_model.getMilitia(town.id),
                    militia_active = false,
                    incoming_attack_count,
                    show_hint;

                if (typeof militia !== 'undefined') {
                    militia_active = militia.attributes.started_at >= 1;
                }

                incoming_attack_count = CommandsHelper.getTotalCountOfIncomingAttacks();

                show_hint = !militia_active &&
                    !current_town_model.hasConqueror() &&
                    incoming_attack_count > 0 &&
                    player_settings.isMilitiaPopupEnabled();

                if (show_hint) {
                    WQM.addQueuedWindow({
                        type: windows.MILITIA_WELCOME,
                        priority: priorities.getPriority(windows.MILITIA_WELCOME),
                        open_function: function() {
                            return MilitiaWelcomeWindowFactory.openWindow(town.id);
                        }
                    });
                }

                notification_subject += '<br/><span class="small">' + _('Arrival:') + ' ' +
                    readableUnixTimestamp(notification.time, 'player_timezone', {
                        extended_date: true
                    });

                if (town_name) {
                    notification_subject += ' ' + _('in') + ' ' + town_name;
                }

                notification_subject += '</span>';

                _self.notify(notification.id, notification.type, notification_subject, notification.time, notification.param_id, notification.param_str);
            }
        }

        /**
         * Handles notification for incoming support
         *
         * @param {object} notification
         * @return void
         */
        function handleIncomingSupport(notification) {
            var town_name = notification.param_str ? JSON.parse(notification.param_str).town_name : '';
            var notification_subject = notification.subject +
                '<br/><span class="small">' +
                _('Arrival:') + ' ' +
                readableUnixTimestamp(
                    notification.time, 'player_timezone', {
                        extended_date: true
                    });

            if (town_name) {
                notification_subject += ' ' + _('in') + ' ' + town_name;
            }
            notification_subject += '</span>';
            _self.notify(
                notification.id,
                notification.type,
                notification_subject,
                notification.time, notification.param_id, notification.param_str);
        }

        /**
         * Handles award notification
         *
         * @param {object} notification
         * @return void
         */
        function handleAwardNotification(notification) {
            var getSubject = function(award_id, level, name, description) {
                return '<div class="award31x31 ' + award_id + (level > 0 ? '_' + level : '') + '">' +
                    '</div><div><b class="award_name">' + name + '</b><div class="award_description">' + description + '</div></div>';
            };

            notification.subject = getSubject(notification.data.award_id, notification.data.level, notification.data.name, notification.data.description);

            handleDefault(notification);
        }

        /**
         * Handles building finished notification
         *
         * @param {object} notification
         * @return void
         */
        function handleBuildingFinishedNotification(notification) {
            var getSubject = function(params) {
                var subject_text;
                if (params.tear_down) {
                    subject_text = _('Demolition completed: %1 in %2');
                } else {
                    subject_text = _('Upgrade completed: %1 in %2');
                }
                return '<span id="townid_' + params.town_id + '" class="notification_building_image image_' + params.building_type + '"></span>' +
                    '<span>' + s(subject_text, params.building_name, params.town_name) +
                    '</span><span>' + _('New level:') + ' ' + params.new_level + '</span>';
            };

            //notification.game_initialization
            notification.subject = getSubject(JSON.parse(notification.param_str));

            handleDefault(notification);
        }

        /**
         * Handles all recruitment finished notification
         *
         * @param {object} notification
         * @return void
         */
        function handleAllRecruitmentFinishedNotification(notification) {
            var getSubject = function(subject, param_id, params) {
                return '<span id="townid_' + param_id +
                    '" class="notification_building_image image_' + params.building_type + '"></span>' +
                    '<span>' + subject + '</span>';
            };

            notification.subject = getSubject(notification.subject, notification.param_id, JSON.parse(notification.param_str));

            handleDefault(notification);
        }

        /**
         * Handles new message notification
         *
         * @param {object} notification
         * @return void
         */
        function handleNewMessageNotification(notification) {
            var getSubject = function(params) {
                return '<span>' + params.player_name + '</span><span>' + notification.subject + '</span>';
            };

            var params = JSON.parse(notification.param_str);
            if (params) {
                notification.subject = getSubject(params);
            }

            handleDefault(notification);
        }

        /**
         * Handles bot check notification
         *
         * @param {object} notification
         * @return void
         */
        function handleBotCheckNotification(notification) {
            var getSubject = function(params) {
                var text;
                if (params - Timestamp.now() > 0) {
                    text = '<span><span style="float:left">' + _('Captcha input necessary in') + '&nbsp;</span><span class="bot_check_eta">' + (params - Timestamp.now()) + '</span></span>';
                } else {
                    text = '<span>' + _('Captcha input required!') + '</span>';
                }
                return text;
            };

            var start_at = notification.param_id;
            if (start_at) {
                Game.bot_check = start_at;
                notification.subject = getSubject(start_at);
            }

            handleDefault(notification);
            $.Observer(GameEvents.bot_check.update_started_at_change).publish({});
        }

        /**
         * @param Object notification
         */
        function handleMassNotification(notification) {
            var str_params = JSON.parse(notification.param_str),
                subject = str_params.subject ? str_params.subject : _('Info');

            notification.subject = '<a class="notify_subjectlink" href="#">' + subject + '</a>';

            switch (+notification.param_id) {
                case MassNotificationType.MASS_NOTIFICATION_TYPE_WONDER:
                    str_params.text = _('A World Wonder has been completed!');
                    break;
                case MassNotificationType.MASS_NOTIFICATION_TYPE_CUSTOM:
                    break;
                case MassNotificationType.MASS_NOTIFICATION_TYPE_COMMUNITY_GOAL:
                    break;
                default:
                    break;
            }

            // show only valid notifications
            if (notification.time > Timestamp.now()) {
                _self.notify(notification.id, notification.type, notification.subject, notification.time, notification.param_id, str_params);
            }
        }

        function handleDominationEraStartedNotification(notification) {
            var str_params = notification.param_str;

            notification.subject = '<a class="notify_subjectlink" href="#">' + str_params + '</a>';

            // show only valid notifications
            if (notification.time > Timestamp.now()) {
                _self.notify(notification.id, notification.type, notification.subject, notification.time, notification.param_id, str_params);
            }
        }

        function handlePremiumFeatureRunningOutNotification(notification) {
            notification.subject = '<a class="notify_subjectlink" href="#">' + notification.subject + '</a>';
            notification.subject += '<span>' + _("Prolong the service of your advisor or you'll lose their benefits.") + '</span>';

            handleDefault(notification);
        }

        this.logNotifications = function(notifications) {
            var msg = [(notifications.length || 0) + ' Notifications received:'],
                idx,
                notifications_length = notifications.length,
                notification,
                subject;

            for (idx = 0; idx < notifications_length; ++idx) {
                notification = notifications[idx];
                subject = notification.subject ? notification.subject.substring(0, 15) : '--';
                msg.push('\n    "' + notification.type + '" ' + subject, notification);
            }

            return msg;
        };

        /**
         * Handles a notification
         *
         * @param {object} notification
         * @return void
         */
        this.handleNotification = function(notification) {
            switch (notification.type) {
                case NotificationType.SYSTEMMESSAGE:
                    handleSystemNotification(notification);
                    break;
                case NotificationType.INCOMING_ATTACK:
                    handleIncomingAttack(notification);
                    break;
                case NotificationType.INCOMING_SUPPORT:
                    handleIncomingSupport(notification);
                    break;
                case NotificationType.MASS_NOTIFICATION:
                    handleMassNotification(notification);
                    break;
                case NotificationType.NEWAWARD:
                    handleAwardNotification(notification);
                    break;
                case NotificationType.BUILDING_FINISHED:
                    handleBuildingFinishedNotification(notification);
                    break;
                case NotificationType.ALL_RECRUITMENT_FINISHED:
                    handleAllRecruitmentFinishedNotification(notification);
                    break;
                case NotificationType.BACKBONE:
                    MM.handleNotification(notification);
                    break;
                case NotificationType.NEWMESSAGE:
                    handleNewMessageNotification(notification);
                    break;
                case NotificationType.BOTCHECK:
                    handleBotCheckNotification(notification);
                    break;
                case NotificationType.DOMINATION_ERA_STARTED:
                    handleDominationEraStartedNotification(notification);
                    break;
                case NotificationType.PREMIUM_FEATURE_RUNNING_OUT:
                    handlePremiumFeatureRunningOutNotification(notification);
                    break;
                default:
                    handleDefault(notification);
                    break;
            }
        };

        this.notify = function(id, type, title, time, param_id, param_str, game_initialization) {
            var interval = 1E4,
                ttl, dupe = false;

            var $notification_area = $('#notification_area');

            // set ttl to end date for short living message or 7 days of otherwise
            ttl = type === NotificationType.MASS_NOTIFICATION ? (time - Timestamp.now()) : 604800;

            GrepoNotificationStack.loop(function(i, elem) {
                if (!dupe && id === elem.getOpt().id) {
                    return (dupe = true);
                }
            });

            // don't create duplicates.
            if (dupe) {
                return;
            }

            GrepoNotificationStack.push(NotificationFactory.createNotification({
                'ttl': ttl, //time to live,
                'id': id,
                'type': type,
                'html': title ? title : '',
                'time': time,
                'param_id': param_id,
                'param_str': param_str,
                'parent': $notification_area, // link to parent element
                'game_initialization': game_initialization
            }));

            function activateQueue() {
                notification_queue_timer = window.setInterval(function() {
                    /**
                     * checks all elements in queue, decrements their ttl,
                     * removes them atfer ttl expires and clears timer if no more elements are
                     * in queue.
                     */

                    // if Notifications reach their ttl, remove them from Array
                    GrepoNotificationStack.loop(function(i, elem, arr) {
                        if (!elem.age() && arr) {
                            arr.remove(i);
                        }
                    });

                    //clear interval if no more objects are in the queue
                    if (GrepoNotificationStack.length() === 0) {
                        window.clearInterval(notification_queue_timer);
                        notification_queue_timer = null;
                    }
                }, interval);
            }

            if (notification_queue_timer === null) {
                activateQueue();

                $notification_area.on({
                    mouseenter: function(ev) {
                        window.clearInterval(notification_queue_timer);
                    },
                    mouseleave: function(ev) {
                        //only do stuff when timer was set before
                        if (notification_queue_timer !== null) {
                            activateQueue();
                        }
                    }
                });
            }

            switch (type) {
                case 'newmessage':
                case 'awmessage':
                    $('#new_messages').attr('class', 'message_icon');
                    break;

                case 'newreport':
                    $('#new_reports').attr('class', 'message_icon');
                    break;
            }
        };
    }

    window.NotificationHandler = NotificationHandler;
}());