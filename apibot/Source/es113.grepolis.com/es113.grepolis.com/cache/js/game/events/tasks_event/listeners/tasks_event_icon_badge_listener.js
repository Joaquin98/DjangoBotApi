/* global us, Backbone, GameEvents, DM */
(function() {
    'use strict';

    var TasksEventBadgeListener = {

        initialize: function(models, collections) {
            this.player_tasks = collections.player_tasks;

            this.registerEvents();
        },

        registerEvents: function() {
            $.Observer(GameEvents.happenings.icon.initialize).unsubscribe(['tasks_event_badge_icon']);
            $.Observer(
                GameEvents.happenings.icon.initialize).subscribe(['tasks_event_badge_icon'],
                this.showHideBadgeAndUpdateTooltip.bind(this)
            );

            this.stopListening();
            this.player_tasks.onProgressTaskChange(this, this.showHideBadgeAndUpdateTooltip.bind(this));
            this.player_tasks.onStateTaskChange(this, this.showHideBadgeAndUpdateTooltip.bind(this));
            this.player_tasks.onAddTask(this, this.showHideBadgeAndUpdateTooltip.bind(this));
        },

        showHideBadgeAndUpdateTooltip: function() {
            var $badge_amount = $('#happening_large_icon.divine_trials .amount').toggle(),
                satisfied_tasks = this.player_tasks.getAllSatisfiedTasks();

            $badge_amount.hide();
            if (satisfied_tasks.length) {
                $badge_amount.text(satisfied_tasks.length).show();
                $badge_amount.css('top', 0);
            }

            this.registerTooltip();
        },

        destroy: function() {

        },

        registerTooltip: function() {
            $('#happening_large_icon.tasksevent').tooltip(
                us.template(DM.getTemplate('events', 'tasks_event_tooltip'), {
                    l10n: DM.getl10n('divine_trials'),
                    daily_running_tasks: this.player_tasks.getDailyRunningTasks(),
                    ongoing_running_tasks: this.player_tasks.getOngoingRunningTasks(),
                    has_daily_satisfied_tasks: this.player_tasks.hasSatisfiedDailyTask(),
                    has_ongoing_satisfied_tasks: this.player_tasks.hasSatisfiedOngoingTask()
                })
            );
        }
    };

    us.extend(TasksEventBadgeListener, Backbone.Events);

    window.GameListeners.TasksEventBadgeListener = TasksEventBadgeListener;
}());