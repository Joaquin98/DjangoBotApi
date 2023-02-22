(function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var Benefit = window.GameModels.Benefit;

    var Benefits = function() {}; // never use this, becasue it will be overwritten

    Benefits.model = Benefit;
    Benefits.model_class = 'Benefit';

    Benefits.getAugmentationBonusForUnitBuildTime = function() {
        var factor = 1,
            benefit, benefits = this.models,
            i, l = benefits.length;

        for (i = 0; i < l; i++) {
            benefit = benefits[i];

            if (benefit.getType() === 'unit_build_time') {
                factor -= benefit.getPercents() * 0.01;
            }
        }

        return factor;
    };

    Benefits.getFirstLargeIconOfWindowType = function(type, window_type) {
        var large_icons = this.filter(function(benefit) {
            return benefit.get('type') === type && benefit.getLargeIconData().window_type === window_type;
        });
        return large_icons[0];
    };

    Benefits.getSkinForTheLargeIconOfWindowType = function(type, window_type) {
        var large_icon = this.getFirstLargeIconOfWindowType(type, window_type);
        if (large_icon.get('params') && large_icon.get('params').skin) {
            return large_icon.get('params').skin;
        }
        return '';
    };

    /**
     * @method getBenefitsOfType
     * @param {string} type for example 'largeicon'
     * @return {GameModels.Benefit[]}
     */
    Benefits.getBenefitsOfType = function(type) {
        return this.filter(function(benefit) {
            return benefit.get('type') === type;
        });
    };

    /**
     * Returns all benefits with matching type where the current time is between the benefit start and end times.
     *
     * @param type
     * @return {*}
     */
    Benefits.getRunningBenefitsOfType = function(type) {
        return this.filter(function(benefit) {
            return benefit.get('type') === type && benefit.isRunning();
        });
    };

    Benefits.getFirstRunningBenefitOfType = function(type) {
        return this.find(function(benefit) {
            return benefit.get('type') === type && benefit.isRunning();
        });
    };

    Benefits.getFirstRunningBenefitOfTypeWithoutPrerequisites = function(type) {
        return this.find(function(benefit) {
            return benefit.get('type') === type && benefit.isRunningWithoutPrerequisites();
        });
    };

    /**
     * Return true if event with given event_id is currently running
     * @param event_id
     * @returns {boolean}
     */
    Benefits.isBenefitWithGivenEventIdRunning = function(event_id) {
        var running_benefits_with_given_event_id = this.filter(function(benefit) {
            return benefit.get('event_id') === event_id && benefit.isRunning();
        });

        return running_benefits_with_given_event_id.length > 0;
    };

    Benefits.onBenefitStarted = function(obj, callback) {
        obj.listenTo(this, 'started', callback);
    };

    Benefits.onBenefitEnded = function(obj, callback) {
        obj.listenTo(this, 'ended', callback);
    };

    /**
     * Adds event listener which listens on the events which are
     * important for Grepolis Game Events / Large Icon
     *
     * @param {Function} callback
     * @param {Object} context
     */
    Benefits.onImportantChangesForLargeIcon = function(callback, context) {
        this.on('add remove change:start change:duration', callback, context);
    };

    Benefits.onBenefitAdd = function(obj, callback) {
        obj.listenTo(this, 'add', callback);
    };

    Benefits.onBenefitChange = function(obj, callback) {
        obj.listenTo(this, 'add remove change', callback);
    };

    Benefits.getAwardCategoryBenefit = function() {
        return this.getBenefitsOfType('award_category')[0];
    };

    /**
     * true, if we have a benefit of type 'award_category' which is active
     * @returns {boolean}
     */
    Benefits.isAwardCategoryBenefitEnabled = function() {
        return this.filter(function(benefit) {
            return benefit.getBenefitType() === 'award_category' && benefit.isRunning();
        }).length > 0;
    };

    Benefits.getFirstExternalSurveyIconBenefit = function() {
        return this.getBenefitsOfType('external_survey_icon').length > 0 ? this.getBenefitsOfType('external_survey_icon')[0] : null;
    };

    window.GameCollections.Benefits = GrepolisCollection.extend(Benefits);
}());