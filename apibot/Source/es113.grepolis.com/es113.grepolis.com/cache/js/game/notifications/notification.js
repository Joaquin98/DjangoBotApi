/*globals WMap, NotificationType, ITowns, PhoenicianSalesmanWindowFactory,
  HelperTown, PhoenicianSalesman, readableUnixTimestamp, BuildingWindowFactory, MassNotificationType,
  MapTiles, hOpenWindow, GPWindowMgr, GameEvents, Game, addslashes, Layout, gpAjax,
  GrepoNotificationStack, CommunityGoalReachedWindowFactory, PremiumWindowFactory, JSON */

(function() {
    'use strict';

    /**
     * Notification object. Create one of these to alert the user. No further method
     * calls are required, the object takes care of itself.
     *
     * If Notifications have a TTL set, they will disappear after the specified time.
     *
     *
     * @param options Object options for this Notification
     */
    function GrepoNotification(options) {
        if (!options) {
            return null;
        }

        var opt = options,
            notification,
            description,
            close,
            is_blocked = false,
            action = null,
            params = [],
            popup_params = {},
            town,
            str = '',
            town_id,
            that = this; // self reference

        // PRIVATE FUNCTIONS
        /**
         * Event handler for event description
         */
        function hideDesc() {
            if (action) {
                notification.css('cursor', 'auto');
            }

            window.setTimeout(function() {
                if (is_blocked) {
                    return;
                }

                description.stop(true, true).fadeOut();
            }, 150);
        }

        /**
         * Event handler for event description
         */
        function showDesc() {
            if (action) {
                notification.css('cursor', 'pointer');
            }

            if (WMap.currently_scrolling) {
                return;
            }

            description.fadeIn();
        }

        function getMassNotificationEndGameSubType() {
            var Features = require('data/features'),
                EndGameTypes = require('enums/end_game_types'),
                MassNotificationSubTypes = require('enums/mass_notification_subtypes'),
                result;

            switch (Features.getEndGameType()) {
                case EndGameTypes.END_GAME_TYPE_DOMINATION:
                    result = MassNotificationSubTypes.DOMINATION;
                    break;
                case EndGameTypes.END_GAME_TYPE_OLYMPUS:
                    result = MassNotificationSubTypes.OLYMPUS;
                    break;
                default:
                    result = '';
                    break;
            }

            return result;
        }

        function createMassNotificationDescription() {

            var MassNotificationSubTypes = require('enums/mass_notification_subtypes');

            switch (opt.param_id) {
                case MassNotificationType.MASS_NOTIFICATION_TYPE_CUSTOM:
                    opt.html = opt.html + '<br/>' + opt.param_str.subject;
                    popup_params.title = opt.param_str.subject;
                    popup_params.html = opt.param_str.text;
                    break;
                case MassNotificationType.MASS_NOTIFICATION_TYPE_WONDER:
                    var alliance_link;

                    popup_params.html = '<span style="height:92px;width:92px;float:left;background: url(' + Game.img() + '/game/map/wonder_' +
                        opt.param_str.wtp + '.png) no-repeat -' + (MapTiles.wonder_stages[10] * 99) + 'px 0;"></span>';

                    alliance_link = '<a href="javascript:void(0)" onclick="Layout.allianceProfile.open(\'' + addslashes(opt.param_str.anm) + '\',' +
                        opt.param_str.aid + ')">' + opt.param_str.anm + '</a>';

                    popup_params.html = popup_params.html + '<span style="float:left;width:280px;margin-left:15px;">' +
                        _('The alliance %1$s has completed World Wonder %2$s on %3$s.').replace('%1$s', alliance_link).replace('%2$s', opt.param_str.wnm).replace('%3$s', opt.param_str.ilnk);

                    popup_params.html = popup_params.html + '<br/>' + _('They now control %s of 7 World Wonders.').replace('%s', opt.param_str.wnum) + '</span>';

                    popup_params.title = _('Info about World Wonders');

                    opt.html = opt.html + '<br/>' + opt.param_str.text + '<br/><span class="small notification_date">' +
                        readableUnixTimestamp(opt.time - (opt.ttl ? opt.ttl : 0), 'player_timezone', {
                            extended_date: true
                        }) + '</span>';

                    opt.subtype = MassNotificationSubTypes.WONDER;
                    break;
                case MassNotificationType.MASS_NOTIFICATION_TYPE_COMMUNITY_GOAL:
                    opt.subtype = MassNotificationSubTypes.COMMUNITY_GOAL;
                    opt.html = opt.html + '<br/>' + opt.param_str.text;
                    break;
                case MassNotificationType.MASS_NOTIFICATION_TYPE_END_GAME:
                    opt.subtype = getMassNotificationEndGameSubType();
                    opt.html = opt.html + '<br/>' + opt.param_str.text;
                    break;
                case MassNotificationType.MASS_NOTIFICATION_TYPE_ARTIFACT:
                    opt.subtype = MassNotificationSubTypes.ARTIFACT;
                    opt.html = opt.html + '<br/>' + opt.param_str.text;
                    break;
                default:
                    opt.html = opt.html + '<br/>' + opt.param_str.text;
                    break;
            }
        }

        function createPhoenicianSalesmanArrivedNotificationDescription() {
            if (ITowns.numTowns() === 1) {
                str = _('The Phoenician merchant has arrived in your city.');
            } else {
                var town = ITowns.getTown(opt.param_id);
                str = s(_('The Phoenician merchant has arrived in %1.'), town.name);
            }

            PhoenicianSalesman.showHint(str);

            opt.html = '<a class="notify_subjectlink" href="#">' + str + '</a><br/><span class="small notification_date">' + readableUnixTimestamp(opt.time, 'player_timezone', {
                extended_date: true
            }) + '</span>';
        }

        function getDescriptionHtml() {
            if (opt.type === NotificationType.PHOENICIAN_SALESMAN_ARRIVED) {
                createPhoenicianSalesmanArrivedNotificationDescription();
            } else if (opt.type === NotificationType.MASS_NOTIFICATION) {
                createMassNotificationDescription();
            }
            return opt.html;
        }

        function createNotification() {
            var DM = require_legacy('DM');
            var description = getDescriptionHtml();
            var subtype = opt.subtype ? ' ' + opt.subtype : '';

            var template = DM.getTemplate('notifications', 'base');
            return $(us.template(template, {
                notification_class: opt.type + (opt.type === 'planed_attack' ? ' ' + opt.id : '') + subtype,
                notification_description_html: description
            }));
        }

        function bindEventListenersToNotification() {
            //bind handlers, do magic
            notification.off();
            notification.on({
                'mouseenter': showDesc,
                'mouseleave': hideDesc,
                'click tap': function(event) {
                    if (action) {
                        // no event nesting.
                        event.stopPropagation();

                        // Do action
                        action.apply(this, params);

                        // request deletion at server:
                        gpAjax.ajaxPost('notify', 'delete', {
                            id: opt.id
                        }, false, function( /*data*/ ) {
                            GrepoNotificationStack.del(that);
                            that.destroy();
                        });
                    }
                }
            });

            description.off();
            description.on({
                'mouseenter': function() {
                    is_blocked = true;
                },
                'mouseleave': function() {
                    is_blocked = false;
                    description.find('.report_html').remove();
                }
            });

            close.off();
            close.on('click', function(event) {
                event.stopPropagation();

                // request deletion at server:
                gpAjax.ajaxPost('notify', 'delete', {
                    id: opt.id
                }, false, function() {
                    GrepoNotificationStack.del(that);
                    that.destroy();
                });
            });
        }

        function createNotificationActionsAndAddParams() {

            switch (opt.type) {
                case NotificationType.NEWREPORT:
                    action = hOpenWindow.viewReport;
                    params.push(opt.param_id);
                    break;

                case NotificationType.NEWMESSAGE:
                case NotificationType.AWMESSAGE:
                    action = hOpenWindow.viewMessage;
                    params.push(opt.param_id);

                    //Trigger event only for new notifications, not notifications loaded when the game started.
                    if (!opt.game_initialization) {
                        $.Observer(GameEvents.notification.message.arrive).publish({
                            message_id: opt.param_id
                        });
                    }
                    break;

                case NotificationType.PLANED_ATTACK:
                    $.Observer(GameEvents.attack.planner_reminder).publish({
                        attack_id: opt.param_id
                    });
                    action = hOpenWindow.viewAttackPlan;
                    params.push(opt.param_id);
                    break;

                case NotificationType.RESOURCETRANSPORT:
                    action = hOpenWindow.viewResTransport;
                    break;

                case NotificationType.ALLIANCE_INVITATION:
                    action = GPWindowMgr.Create;
                    params.push(GPWindowMgr.TYPE_ALLIANCE);
                    params.push('');
                    params.push({
                        sub_content: 'applications'
                    });
                    break;

                case NotificationType.ALLIANCE_PACT_INVITATION:
                    action = GPWindowMgr.Create;
                    params.push(GPWindowMgr.TYPE_ALLIANCE);
                    params.push(_('Alliance'));
                    params.push({
                        sub_content: 'alliance_pact',
                        auto: true
                    });
                    break;

                case NotificationType.PHOENICIAN_SALESMAN_ARRIVED:
                    town = ITowns.getTown(opt.param_id);
                    action = function() {
                        if (town.id && town.id !== Game.townId) {
                            HelperTown.townSwitch(town.id);
                        }
                        PhoenicianSalesmanWindowFactory.openPhoenicianSalesmanWindow();
                    };
                    break;

                case NotificationType.BUILDING_FINISHED:
                    town_id = ($(opt.html).find('span.notification_building_image').attr('id') || '').split('_');
                    town_id = town_id[1] || 0;

                    action = function() {
                        if (town_id && town_id !== Game.townId) {
                            HelperTown.townSwitch(town_id);
                        }

                        BuildingWindowFactory.open.apply(BuildingWindowFactory, arguments);
                    };
                    params.push('main');

                    //Trigger event only for new notifications, not notifications loaded when the game started.
                    if (!opt.game_initialization) {
                        $.Observer(GameEvents.notification.building_finished.arrive).publish(opt);
                    }
                    break;

                case NotificationType.ALL_BUILDING_FINISHED:
                case NotificationType.ALL_RECRUITMENT_FINISHED:
                    action = function() {
                        town_id = parseInt(opt.param_id, 10);
                        if (town_id && town_id !== Game.townId) {
                            HelperTown.townSwitch(town_id);
                        }
                        BuildingWindowFactory.open.apply(BuildingWindowFactory, arguments);
                    };

                    if (opt.type === NotificationType.ALL_BUILDING_FINISHED) {
                        params.push('main');
                    } else {
                        params.push(JSON.parse(opt.param_str).building_type); // either barracks or docks
                    }

                    break;

                case NotificationType.MASS_NOTIFICATION:
                    if (opt.param_id === MassNotificationType.MASS_NOTIFICATION_TYPE_COMMUNITY_GOAL) {
                        action = CommunityGoalReachedWindowFactory.openWindow.bind(that, opt.param_str.reward_data);
                    } else if (
                        opt.param_id === MassNotificationType.MASS_NOTIFICATION_TYPE_END_GAME ||
                        opt.param_id === MassNotificationType.MASS_NOTIFICATION_TYPE_ARTIFACT
                    ) {
                        var NotificationPopupFactory = require('features/notification_popup/factories/notification_popup'),
                            additional_data = Object.assign({
                                    main_notification_type: NotificationType.MASS_NOTIFICATION,
                                    notification_id: opt.id
                                },
                                opt.param_str
                            );
                        action = NotificationPopupFactory.openWindow.bind(that, additional_data.notification_type, additional_data);
                        action();
                    } else {
                        action = function() {
                            Layout.showShortMessagePopup(popup_params);
                        };
                    }

                    break;

                case NotificationType.BOTCHECK:
                    action = function() {
                        Game.bot_check = -1;
                        $.Observer(GameEvents.bot_check.update_started_at_change).publish({});
                    };
                    break;

                case NotificationType.NEWAWARD:
                    action = function() {
                        var award_id = JSON.parse(opt.param_str).award_id;
                        var GrepolisScoreWindowFactory = require('features/grepolis_score/factories/grepolis_score');
                        GrepolisScoreWindowFactory.openWindow(award_id);
                    };
                    break;
                case NotificationType.DOMINATION_ERA_STARTED:
                    var DominationStartedPopup = require('features/notification_popup/factories/domination_era_started_popup'),
                        data = Object.assign({
                            main_notification_type: NotificationType.DOMINATION_ERA_STARTED,
                            notification_id: opt.id
                        }, {
                            subject: opt.param_str
                        });
                    action = DominationStartedPopup.openWindow.bind(that, data.main_notification_type, data);
                    action();
                    break;

                case NotificationType.PREMIUM_FEATURE_RUNNING_OUT:
                    action = PremiumWindowFactory.openBuyAdvisorsWindow.bind(that);
                    break;
                default:
                    break;
            }
        }

        function init() {
            createNotificationActionsAndAddParams();
            notification = createNotification();
            description = notification.find('.description');
            close = notification.find('.close');

            // save original value of ttl
            if (opt.ttl) {
                opt.total_ttl = opt.ttl;
            }

            HelperTown.updateBrowserWindowTitle();
        }

        // PUBLIC FUNCTIONS

        /**
         * Used to spawn
         */
        this.attachToParent = function() {
            //attach event listeners
            bindEventListenersToNotification();
            // put into notification area
            notification.prependTo(opt.parent).animate({
                top: 0,
                opacity: 1
            }, 1000, 'easeOutBounce');
        };

        this.despawn = function() {
            //remove listeners when element is not visible anymore:
            notification.detach().off().children().off();
        };

        /**
         * Getter to get Notification options
         */
        this.getOpt = function() {
            return opt;
        };

        // PRIVILEGED

        this.getType = function() {
            return opt.type;
        };

        this.getTime = function() {
            return opt.time;
        };

        this.getId = function() {
            return opt.id;
        };

        /**
         * decrements ttl for this object, if below or equal zero,
         * element is removed from DOM (but not from queue, this is done elsewhere)
         *
         * @return Boolean returns true if element is alive, false if it should be removed from queue
         */
        this.age = function() {
            if (!opt.ttl) {
                return false;
            }
            // remove 10 secs from ttl
            opt.ttl = opt.ttl - 10;
            if (opt.ttl <= 0) {
                that.destroy();
            }
            return true;
        };

        /**
         * Removes itself from document.
         */
        this.destroy = function() {
            // set ttl to zero so that element is removed when checked again
            opt.ttl = 0;
            notification.fadeOut(350, 'linear', function() {
                notification.off().empty().remove();
            });
        };

        init();
    }

    window.GrepoNotification = GrepoNotification;
}());