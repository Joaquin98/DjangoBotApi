/* global GrepolisModel, Timestamp, TM, PremiumWindowFactory */
(function() {
    'use strict';

    var Benefit = function() {},
        extended_model;

    Benefit.urlRoot = 'Benefit';

    GrepolisModel.addAttributeReader(Benefit,
        'start',
        'duration',
        'large_icon_data'
    );

    /**
     * register on changes on the times of this benefit, to update the started and ended timers
     */
    Benefit.initialize = function() {
        this.on('change:start change:duration', this._updateTimer, this);
    };

    Benefit.getTimestampEnd = function() {
        return this.getStart() + this.getDuration();
    };

    Benefit.hasLargeIconCountdown = function() {
        return this.CountdownStartTimestamp() !== 0 && this.CountdownEndTimestamp() !== 0;
    };

    /**
     * Returns information about when countdown on the large icon should start ticking
     *
     * @return {Number}
     */
    Benefit.CountdownStartTimestamp = function() {
        var large_icon_data = this.getLargeIconData().additional_data;

        if (!large_icon_data) {
            return 0;
        }

        return large_icon_data.countdown_start;
    };

    /**
     * Returns information about when countdown on the large icon should stop ticking
     *
     * @return {Number}
     */
    Benefit.CountdownEndTimestamp = function() {
        var large_icon_data = this.getLargeIconData().additional_data;

        return large_icon_data.countdown_end;
    };

    // TODO this is named incorrect, the benefit also has a type
    // e.g. type = 'award_category' and params.type = 'hades2016'
    Benefit.getType = function() {
        return this.getParam('type');
    };

    Benefit.getTheme = function() {
        return this.getParam('theme') || '';
    };

    Benefit.getIconType = function() {
        return this.getTheme();
    };

    Benefit.getId = function() {
        return this.getType();
    };

    Benefit.getOpenFunction = function() {
        return PremiumWindowFactory.openBuyGoldWindow.bind(PremiumWindowFactory);
    };

    Benefit.getBenefitType = function() {
        return this.get('type');
    };

    Benefit.getPercents = function() {
        return this.getParam('percent');
    };

    Benefit.getParam = function(name) {
        return this.get('params')[name];
    };

    Benefit.getHappeningName = function() {
        return require('enums/happenings').UNDEFINED;
    };

    Benefit.getEnd = function() {
        return this.getStart() + this.getDuration() || this.get('end');
    };

    Benefit.hasEnded = function() {
        return this.getEnd() < Timestamp.server();
    };

    Benefit.isRunning = function() {
        return this.getStart() <= Timestamp.server() && Timestamp.server() < this.getEnd();
    };

    Benefit.secondsTillStart = function() {
        return Math.max(0, this.getStart() - Timestamp.server());
    };

    Benefit.secondsTillEnd = function() {
        return Math.max(0, this.getEnd() - Timestamp.server());
    };

    /**
     * Get the fraction of time the benefit was running during the given interval.
     * Eg. if the benefit ran from 1 to 4 (runtime = 3) and the given interval ist from 2 to 10, then the result is 0.25:
     *           0   1   2   3   4   5   6   7   8   9   10
     * benefit       |-1-|-2-|-3-
     * interval          |-1-|-2-|-3-|-4-|-5-|-6-|-7-|-8-
     * overlap           |-1-|-2-
     * => 2 / 8 = 0.25 = 25% of the time of the interval, the benefit was running
     *
     * The method is used during the calculation of the production
     *
     * @method getTimeCoverage
     *
     * @param {integer} start Timestamp in seconds
     * @param {integer} end Timestamp in seconds
     *
     * @return {float} fraction of the time, between 0.0 and 1.0
     */
    Benefit.getTimeCoverage = function(start, end) {
        if (start >= end || end <= this.getStart()) {
            return 0.0;
        }
        var latest_start = Math.max(start, this.getStart()),
            first_end = Math.min(end, this.getEnd()),
            percentage = (first_end - latest_start) / (end - start);

        return Math.min(Math.max(percentage, 0.0), 1.0);
    };

    /*
     * adds 'started' and 'ended' events to this model, to be triggered when the benefit starts and ends
     */
    Benefit.externalTrigger = {
        started: {
            bind: '_boundStartListener',
            remove: '_removedStartListener'
        },
        ended: {
            bind: '_boundEndListener',
            remove: '_removedEndListener'
        }
    };

    /**
     * called when the times of this benefit change, because that will change when the started
     * and ended events should be triggered
     */
    Benefit._updateTimer = function() {
        if (this.hasListenerFor('started')) {
            this._boundStartListener();
        }

        if (this.hasListenerFor('ended')) {
            this._boundEndListener();
        }
    };

    /**
     * if the benefits hasn't started yet, register this model on the TM, so that it can trigger the started event on time
     */
    Benefit._boundStartListener = function() {
        var startIn = this.secondsTillStart() * 1000;

        if (startIn > 0) {
            this._removedStartListener();
            TM.register(this.url() + '_started', startIn, this.trigger.bind(this, 'started', this, true), {
                max: 1
            });
        }
    };

    /**
     * if nobody is interested in the started event anymore, call this to unregister the benefit from the TM
     */
    Benefit._removedStartListener = function() {
        TM.unregister(this.url() + '_started');
    };

    /**
     * if the benefits hasn't ended yet, register this model on the TM, so that it can trigger the ended event on time
     */
    Benefit._boundEndListener = function() {
        var endIn = this.secondsTillEnd() * 1000;

        if (endIn > 0) {
            this._removedEndListener();
            TM.register(this.url() + '_ended', endIn, this.trigger.bind(this, 'ended', this, true), {
                max: 1
            });
        }
    };

    /**
     * if nobody is interested in the ended event anymore, call this to unregister the benefit from the TM
     */
    Benefit._removedEndListener = function() {
        TM.unregister(this.url() + '_ended');
    };

    /**
     * Listens on the virtual property "started"
     *
     * @param {Function} callback
     * @param {Object} context
     */
    Benefit.onStarted = function(obj, callback) {
        obj.listenTo(this, 'started', callback);
    };

    Benefit.onEnded = function(obj, callback) {
        obj.listenTo(this, 'ended', callback);
    };

    Benefit.onRemove = function(obj, callback) {
        obj.listenTo(this, 'remove', callback);
    };

    Benefit.onChange = function(obj, callback) {
        obj.listenTo(this, 'change', callback);
    };

    extended_model = GrepolisModel.extend(Benefit);

    extended_model.LARGEICON = 'largeicon';
    extended_model.INFOPAGE = 'infopage';

    window.GameModels.Benefit = extended_model;
}());