(function() {
    'use strict';

    var Progressable = window.GameModels.Progressable;
    var QUESTS = require('enums/quests');

    var TutorialQuest;

    TutorialQuest = Progressable.extend({
        urlRoot: 'Progressable',

        getSetId: function() {
            return this.getGroupId() + '_' + this.getId();
        },

        getGroupId: function() {
            return QUESTS.QUEST;
        },

        hasClearViewOnAccept: function() {
            return this.getStaticData().clearViewOnAccept;
        },

        setClearViewOnAccept: function(clearViewOnAccept) {
            this.getStaticData().clearViewOnAccept = clearViewOnAccept;
        },

        hasClearViewOnReward: function() {
            return this.getStaticData().clearViewOnReward;
        },

        showIntroductionSteps: function() {
            return !!this.getStaticData().show_introduction_steps;
        },

        hasSteps: function() {
            var staticData = this.getStaticData();
            return !!(staticData.steps && staticData.steps.length);
        },

        getSteps: function() {
            if (this.hasSteps()) {
                return this.getStaticData().steps;
            } else {
                return false;
            }
        },

        setStepsShownStatus: function(bool) {
            this.set('steps_shown', bool);
            this.setStepsShown(bool);
        },

        hasStepsShown: function() {
            return (this.hasSteps() && !!(this.get('steps_shown')));
        },

        progressTo: function(new_state) {
            this.execute(
                'progressTo', {
                    progressable_id: this.getProgressableId(),
                    state: new_state
                }
            );
        },

        closeQuest: function() {
            this.progressTo(QUESTS.CLOSED);
        },

        setStepsShown: function(new_state) {
            this.execute(
                'setStepsShown', {
                    progressable_id: this.getProgressableId(),
                    steps_shown: new_state
                }
            );
        },

        hasProgress: function() {
            var progress = this.get('progress');
            var progress_new = this.get('progress_new');
            return (progress && !us.isArray(progress) && progress.conditions) || (progress_new && progress_new.conditions);
        },

        getProgressForTaskId: function(task_id) {
            var progress = this.get('progress');
            var progress_new = this.get('progress_new');

            // Detect which if we have progress in old (pre 2.107) type or already migrated >2.107
            if (us.isArray(progress) && !progress_new) {
                return progress[task_id];
            }

            // new style progress with min max values (after migrations)
            if (progress && !progress_new && progress.conditions) {
                return progress.conditions[task_id].progress;
            }

            // during migration process
            return progress_new.conditions[task_id].progress;
        },

        isTaskFulfilled: function(task_id) {
            var progress = this.getProgressForTaskId(task_id);

            // if we have new style progress
            if (typeof progress.curr !== 'undefined') {
                return progress.curr >= progress.max;
            } else {
                return progress;
            }
        },

        /**
         * For standard quests: find the first task that is running and return it´s id, skip done tasks.
         * If no non-satisfied task is found should return id of the last task (with highest id).
         *
         * For quest with OR conditions: returns first satisfied task id if any, otherwise return the first
         * running task id.
         *
         * On quest with only 1 task just return the ID of this task (0), no matter what state it´s in
         */
        getFirstRunningTaskId: function() {
            var tasks = this.getTasks(),
                isOrConditional = this.isOrConditional();

            if (tasks.length === 1) {
                return 0;
            }

            for (var task_id = 0; task_id < tasks.length; task_id++) {
                var isFulfilled = this.isTaskFulfilled(task_id);

                if (isFulfilled === isOrConditional) {
                    return task_id;
                }
            }

            return isOrConditional ? 0 : tasks.length - 1;
        }

    });

    window.GameModels.TutorialQuest = TutorialQuest;
}());