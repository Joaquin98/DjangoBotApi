/*global Timestamp, us, TM, Game, GameEvents, GrepolisModel */

(function() {
    'use strict';

    var PremiumFeatures = function() {};

    PremiumFeatures.urlRoot = 'PremiumFeatures';

    PremiumFeatures.CURATOR = 'curator';
    PremiumFeatures.TRADER = 'trader';
    PremiumFeatures.PRIEST = 'priest';
    PremiumFeatures.COMMANDER = 'commander';
    PremiumFeatures.CAPTAIN = 'captain';

    PremiumFeatures.available_advisors = [PremiumFeatures.CURATOR, PremiumFeatures.TRADER, PremiumFeatures.PRIEST, PremiumFeatures.COMMANDER, PremiumFeatures.CAPTAIN];

    PremiumFeatures.initialize = function( /*params*/ ) {
        this.on('change', this.setTimersForAdvisors, this);
    };

    PremiumFeatures.getAvailableAdvisors = function() {
        return this.available_advisors;
    };

    PremiumFeatures.setTimersForAdvisors = function() {
        var activated_advisors = this.getAllActivated(),
            notification_hours_in_miliseconds = 24 * 60 * 60 * 1000,
            advisor_id, time_left, time_left_till_notification;

        for (advisor_id in activated_advisors) {
            if (activated_advisors.hasOwnProperty(advisor_id)) {
                time_left = (activated_advisors[advisor_id] - Timestamp.now()) * 1000;
                time_left_till_notification = time_left - notification_hours_in_miliseconds;

                TM.unregister('remove_advisor_' + advisor_id);
                TM.unregister('advisor_running_out_' + advisor_id);

                if (time_left) {
                    TM.register(
                        'remove_advisor_' + advisor_id,
                        time_left,
                        this.triggerAdvisorChange.bind(this, advisor_id), {
                            max: 1
                        }
                    );
                }

                if (time_left_till_notification > 0) {
                    TM.register(
                        'advisor_running_out_' + advisor_id,
                        time_left_till_notification,
                        this.triggerAdvisorRunnoutNotification.bind(this, advisor_id), {
                            max: 1
                        }
                    );
                }
            }
        }
    };

    PremiumFeatures.triggerAdvisorChange = function(advisor_id) {
        (this.changed = {})[advisor_id] = this.getExpiredTime(advisor_id);

        this.trigger('change', this, this.changed[advisor_id]);
        this.trigger('change:' + advisor_id, this, this.changed[advisor_id]);

        $.Observer(GameEvents.premium.adviser.expire).publish({
            advisor_id: advisor_id
        });
    };

    PremiumFeatures.triggerAdvisorRunnoutNotification = function(advisor_id) {
        $.Observer(GameEvents.premium.adviser.expire_soon).publish({
            advisor_id: advisor_id
        });
    };

    /**
     * Checks if advisor is already activated
     *
     * @param {String} id of advisor
     *
     * @return {Boolean}
     */
    PremiumFeatures.isActivated = function(id) {
        return (this.isProperAdvisorId(id) && this.getExpiredTime(id) > Timestamp.now());
    };

    /**
     * Checks if curator is already activated
     *
     * @return {Boolean}
     */
    PremiumFeatures.hasCurator = function() {
        return this.isActivated(PremiumFeatures.CURATOR);
    };

    /**
     * Checks if captain is already activated
     *
     * @return {Boolean}
     */
    PremiumFeatures.hasCaptain = function() {
        return this.isActivated(PremiumFeatures.CAPTAIN);
    };

    PremiumFeatures.getExpiredTime = function(advisor_id) {
        // this check is for admins, who logged in through AdminTool with PA
        if (Game.is_admin_mode_with_premium) {
            return Timestamp.now() + 3600;
        }

        return this.get(advisor_id);
    };

    /**
     * Returns array of all activated advisors with the timestamp to the end
     * If there is no activated advisors then returns empty object
     *
     * @return {Object}
     */
    PremiumFeatures.getAllActivated = function() {
        var activated_advisors = {};
        us.each(this.available_advisors, (function(advisor) {
            var validity_timestamp = this.getExpiredTime(advisor);
            if (validity_timestamp && this.isActivated(advisor)) {
                activated_advisors[advisor] = validity_timestamp;
            }
        }).bind(this));
        return activated_advisors;
    };

    /**
     * checks if passed id is defined advisor id
     *
     * @return {Boolean}
     */
    PremiumFeatures.isProperAdvisorId = function(id) {
        return (us.indexOf(this.available_advisors, id) !== -1);
    };

    /**
     * toggle autoextension state
     *
     * @param {String} advisor_id
     */
    PremiumFeatures.toggleAutoExtension = function(advisor_id, callbacks) {
        this.execute('toggleAutoExtension', {
            feature_type: advisor_id
        }, callbacks);
    };

    /**
     * Extend or buy premium feature
     *
     * @param {String} advisor_id
     * @param {Boolean} disable_auto_extension
     * @return void
     */
    PremiumFeatures.extend = function(advisor_id, disable_auto_extension, callback) {
        this.execute('extend', {
            feature_type: advisor_id,
            disable_auto_extension: disable_auto_extension || false
        }, callback);
    };

    PremiumFeatures.extendCurator = function() {
        this.extend(PremiumFeatures.CURATOR);
    };

    PremiumFeatures.extendTrader = function() {
        this.extend(PremiumFeatures.TRADER);
    };

    PremiumFeatures.extendPriest = function() {
        this.extend(PremiumFeatures.PRIEST);
    };

    PremiumFeatures.extendCommander = function() {
        this.extend(PremiumFeatures.COMMANDER);
    };

    PremiumFeatures.extendCaptain = function() {
        this.extend(PremiumFeatures.CAPTAIN);
    };

    /**
     * Registers event listener on the specific advisor activation
     *
     * @param {Backbone.Events} obj
     * @param {String} advisor_id
     * @param {Function} callback
     */
    PremiumFeatures.onSpecificAdvisorChange = function(obj, advisor_id, callback) {
        obj.listenTo(this, 'change:' + advisor_id, callback);
    };

    PremiumFeatures.onCuratorChange = function(obj, callback) {
        this.onSpecificAdvisorChange(obj, PremiumFeatures.CURATOR, callback);
    };

    PremiumFeatures.onCommanderChange = function(obj, callback) {
        this.onSpecificAdvisorChange(obj, PremiumFeatures.COMMANDER, callback);
    };

    PremiumFeatures.onTraderChange = function(obj, callback) {
        this.onSpecificAdvisorChange(obj, PremiumFeatures.TRADER, callback);
    };

    PremiumFeatures.onPriestChange = function(obj, callback) {
        this.onSpecificAdvisorChange(obj, PremiumFeatures.PRIEST, callback);
    };

    PremiumFeatures.onCaptainChange = function(obj, callback) {
        this.onSpecificAdvisorChange(obj, PremiumFeatures.CAPTAIN, callback);
    };

    PremiumFeatures.onAdvisorChange = function(obj, callback) {
        obj.listenTo(this, 'change', callback);
    };

    window.GameModels.PremiumFeatures = GrepolisModel.extend(PremiumFeatures);
}());