/* globals GrepoNotification */

(function() {
    'use strict';

    /**
     * Notification Types
     * Note: keep it in sync with GameNotification NOTIFY_TYPE_<x> const's!
     */
    window.NotificationType = {
        NOTASSIGNED: 'notassigned',
        SYSTEMMESSAGE: 'systemmessage',
        NEWMESSAGE: 'newmessage', // new message
        AWMESSAGE: 'awmessage', //answer message
        NEWTEMPREPORT: 'newtempreport', // non clickable notification (like awards)
        NEWREPORT: 'newreport',
        NEWALLIANCEPOST: 'newalliancepost',
        NEWAWARD: 'newaward',
        RESOURCETRANSPORT: 'resourcetransport',
        INCOMING_ATTACK: 'incoming_attack',
        INCOMING_SUPPORT: 'incoming_support',
        PLANED_ATTACK: 'planed_attack',
        PHOENICIAN_SALESMAN_ARRIVED: 'phoenician_salesman_arrived',
        ALLIANCE_INVITATION: 'alliance_invitation',
        ALLIANCE_PACT_INVITATION: 'alliance_pact_invitation',
        BUILDING_FINISHED: 'building_finished',
        ALL_BUILDING_FINISHED: 'all_building_finished',
        ALL_RECRUITMENT_FINISHED: 'all_recruitment_finished',
        MASS_NOTIFICATION: 'mass_notification',
        BACKBONE: 'backbone',
        BOTCHECK: 'botcheck',
        TRADE_CANCELLED: 'trade_cancelled',
        DOMINATION_ERA_STARTED: 'domination_era_started',
        PREMIUM_FEATURE_RUNNING_OUT: 'premium_feature_running_out'
    };

    /**
     * Mass notification message types
     * Note: keep in sync with Notifications MASS_NOTIFICATION_TYPE_<X>!
     */
    window.MassNotificationType = {
        MASS_NOTIFICATION_TYPE_WONDER: 1,
        MASS_NOTIFICATION_TYPE_CUSTOM: 2,
        MASS_NOTIFICATION_TYPE_COMMUNITY_GOAL: 3,
        MASS_NOTIFICATION_TYPE_END_GAME: 4,
        MASS_NOTIFICATION_TYPE_ARTIFACT: 5
    };

    window.NotificationFactory = function notificationFactory() {
        /**
         * Create a new notification object
         *
         * Example:
         *
         * <code>
         * var notification = NotificationFactory.createNotification(
         *	'ttl': ttl, //time to live,
         *	'id': id,
         *	'type': type,
         *	'html': title ? title : '',
         *	'time': time,
         *	'param_id': param_id,
         *	'param_str': param_str,
         *	'parent': jQElem.notificationArea, // link to parent element
         *	'game_initialization' : game_initialization
         * );
         * </code>
         *
         *
         */
        this.createNotification = function(options) {
            return new GrepoNotification(options);
        };

        return this;
    }.call({});
}());