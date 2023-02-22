/*globals define */

/**
 * How to add new BB model
 *
 * Assuming that all data from the backed is already provided, then go to gameloader.js
 * to funciton 'recvRemoteCallback' and add another case, and in 'init' function add:
 * addOutstanding('player_report_status');
 */
(function() {
    "use strict";

    var PlayerReportStatus = GrepolisModel.extend({
        urlRoot: 'PlayerReportStatus',

        defaults: {

        },

        onNewMessagesCountChange: function(callback, context) {
            this.on('change:count_new_messages', callback, context);
        },

        onNewReportsCountChange: function(callback, context) {
            this.on('change:count_new_reports', callback, context);
        },

        onNewAlliancePostsCountChange: function(callback, context) {
            this.on('change:count_new_alliance_post', callback, context);
        },

        onNewAnnouncementsCountChange: function(callback, context) {
            this.on('change:count_new_announcements', callback, context);
        },

        getNewMessagesCount: function() {
            return this.get('count_new_messages');
        },

        getNewAnnouncementsCount: function() {
            return this.get('count_new_announcements');
        },

        getNewAlliancePostsCount: function() {
            return this.get('count_new_alliance_post');
        },

        getNewReportsCount: function() {
            return this.get('count_new_reports');
        },

        getTotalMessagesAnnouncementsAmount: function() {
            return this.getNewMessagesCount() + this.getNewAnnouncementsCount();
        },

        /**
         * Returns information whether there are new annoucements or not
         *
         * @return {Boolean}
         */
        hasNewAnnouncements: function() {
            return this.get('has_new_announcements') === true;
        }
    });

    window.GameModels.PlayerReportStatus = PlayerReportStatus;
}());