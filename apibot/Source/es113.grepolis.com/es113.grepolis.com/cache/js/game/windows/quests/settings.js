/*globals DM */

(function(views, collections, models, settings) {
    'use strict';

    var windows = require('game/windows/ids');
    var tabs = require('game/windows/tabs');

    var window_type = windows.QUEST;

    //New quest system window
    settings[window_type] = function(options) {
        return us.extend({
            window_type: window_type,
            tabs: [{
                type: tabs.INFO,
                title: '',
                content_view_constructor: views.QuestInfo,
                hidden: true
            }],
            width: 669,
            max_instances: 1,
            minimizable: false
        }, options);
    };

    // do we really need the Var in here?
    var window_type_progress = windows.QUEST_PROGRESS;

    var l10n_quest_progress = DM.getl10n(window_type_progress);

    //New quest system window
    settings[window_type_progress] = function(options) {
        return us.extend({
            title: l10n_quest_progress.window_title,
            window_type: window_type_progress,
            tabs: [{
                type: tabs.PROGRESS,
                title: '',
                content_view_constructor: views.QuestProgress,
                hidden: true
            }],
            width: 669,
            max_instances: 1,
            closable: false,
            minimizable: false
        }, options);
    };

    var window_type_welcome = windows.QUEST_WELCOME;

    //New quest system window
    settings[window_type_welcome] = function(options) {
        return us.extend({
            window_type: window_type_welcome,
            skin: 'wnd_skin_column',
            tabs: [{
                type: tabs.WELCOME,
                title: '',
                content_view_constructor: views.QuestWelcome,
                hidden: true
            }],
            width: 850,
            max_instances: 1,
            minimizable: false,
            closable: false
        }, options);
    };
}(window.GameViews, window.GameCollections, window.GameModels, window.WindowFactorySettings));