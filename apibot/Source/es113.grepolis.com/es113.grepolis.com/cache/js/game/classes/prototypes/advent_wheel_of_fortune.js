/**
 * @package calendar
 * @subpackage advent
 */

/*globals GameDataPowers */

(function() {
    "use strict";

    function AdventWheelOfFortune() {

    }

    //Keeps "spot" object
    AdventWheelOfFortune.prototype.spot = null;

    //Represents number of slots in the wheel
    AdventWheelOfFortune.prototype.max_slots = 6;

    //Represents position of the indicator on the wheel
    AdventWheelOfFortune.prototype.position = 0;

    AdventWheelOfFortune.prototype.tick = 0;

    //Keeps track of which animation settings are active
    AdventWheelOfFortune.prototype.step = 0;

    AdventWheelOfFortune.prototype.steps = [{
            interval: 85,
            duration: 250
        },
        {
            interval: 100,
            duration: 350
        },
        {
            interval: 130,
            duration: 450
        }
    ];

    /**
     * Updates information about the spot
     *
     * @param {GameModels.AdventSpot} spot_model
     */
    AdventWheelOfFortune.prototype.updateCurrentSpotData = function(spot_model) {
        this.spot = spot_model;
    };

    /**
     * get the current selected spot
     *
     * @return {GameModels.AdventSpot}
     */
    AdventWheelOfFortune.prototype.getCurrentSpotData = function() {
        return this.spot;
    };

    AdventWheelOfFortune.prototype.getRewards = function() {
        return this.spot.getSpotRewards();
    };

    /**
     * Returns reward
     *
     * @param {Number} index    Index counted from 0
     *
     * @return {Object}
     */
    AdventWheelOfFortune.prototype.getReward = function(index) {
        return this.spot.getSpotRewards()[index];
    };

    /**
     * Returns model of the reward which can be collected/used/removed by the user
     *
     * @returns {GameModels.RewardItem}
     */
    AdventWheelOfFortune.prototype.getCollectableReward = function() {
        return this.spot.getRewardToTakeModel();
    };

    /**
     *
     * @returns {Integer}
     */
    AdventWheelOfFortune.prototype.getTick = function() {
        return this.tick;
    };

    AdventWheelOfFortune.prototype.getTicksInCurrentStep = function() {
        var step_data = this.getStepData();

        return Math.max(0, parseInt(step_data.duration / step_data.interval, 10));
    };

    AdventWheelOfFortune.prototype.setTick = function(value) {
        this.tick = value;
    };

    AdventWheelOfFortune.prototype.getStepData = function() {
        return this.steps[this.step];
    };

    AdventWheelOfFortune.prototype.setStep = function(number) {
        this.tick = 0;
        this.step = number;
    };

    AdventWheelOfFortune.prototype.setNextStep = function() {
        this.setStep(Math.min(this.steps.length - 1, this.step + 1));
    };

    AdventWheelOfFortune.prototype.setStepToLast = function() {
        this.setStep(this.steps.length - 1);
    };

    AdventWheelOfFortune.prototype.isLastStep = function() {
        return this.step === this.steps.length - 1;
    };

    AdventWheelOfFortune.prototype.isTimeToSlowDown = function() {
        return this.step === 0 && this.getTick() > this.getTicksInCurrentStep();
    };

    /**
     * Checks whether there is still reward which is not drawn
     *
     * @return {Boolean}
     */
    AdventWheelOfFortune.prototype.isAnyRewardToDraw = function() {
        var rewards = this.spot.getSpotRewards(),
            i, l = rewards.length;

        for (i = 0; i < l; i++) {
            if (!this.isRewardCollected(i)) {
                return true;
            }
        }

        return false;
    };

    /**
     * return chance for reward
     */
    AdventWheelOfFortune.prototype.getRewardChance = function(index) {
        var reward = this.getReward(index);
        var rewards = this.getRewards();
        var sumPercents = 0;
        for (var i = 0; i < rewards.length; i++) {
            if (!rewards[i].collected) {
                sumPercents += parseInt(rewards[i].reward_chance, 10);
            }
        }
        if (!reward.collected) {
            return Math.floor(reward.reward_chance / sumPercents * 100);
        }
        return 0;
    };

    /**
     * return css class of reward
     */
    AdventWheelOfFortune.prototype.getRewardCssClassIdWithLevel = function(index) {
        var reward = this.getReward(index);

        return GameDataPowers.getRewardCssClassIdWithLevel(reward);
    };

    AdventWheelOfFortune.prototype.getMaxSlots = function() {
        return this.max_slots;
    };

    AdventWheelOfFortune.prototype.getCurrentSpeed = function() {
        return this.steps[this.step].interval;
    };

    AdventWheelOfFortune.prototype.isRewardCollected = function(index) {
        return this.spot.isRewardCollected(index);
    };

    AdventWheelOfFortune.prototype.isRewardCollectable = function(index) {
        return this.spot.isRewardCollectable(index);
    };

    AdventWheelOfFortune.prototype.isRewardSpun = function(index) {
        return this.spot.isRewardSpun(index);
    };

    AdventWheelOfFortune.prototype.getIndicatorPosition = function() {
        return this.position;
    };

    AdventWheelOfFortune.prototype.setIndicatorPosition = function(value) {
        this.position = value;
    };

    AdventWheelOfFortune.prototype.getIndicatorNextPosition = function() {
        var i, max = this.getMaxSlots(),
            pos = this.getIndicatorPosition(),
            next_pos;

        for (i = 1; i <= max; i++) {
            next_pos = (pos + i) % max;

            if (!this.isRewardCollected(next_pos)) {
                return next_pos;
            }
        }

        return -1;
    };

    AdventWheelOfFortune.prototype.reset = function() {
        this.position = 0;
        this.tick = 0;
        this.step = 0;
    };

    AdventWheelOfFortune.prototype.destroy = function() {

    };

    window.AdventWheelOfFortune = AdventWheelOfFortune;
}());