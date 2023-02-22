/* globals GameEvents */

define('helpers/context_menu', function() {
    return {
        showContextMenu: function(event, position, options) {
            var data = {},
                context_menu;

            if (!options) {
                return;
            }

            context_menu = options.context_menu ? options.context_menu : 'item_reward_all';

            if (position && position.x) {
                event.clientX = position.x;
            }

            if (position && position.y) {
                event.clientY = position.y;
            }

            us.extend(data, options.data);
            window.Layout.contextMenu(event, context_menu, data);
        },

        showRewardContextMenu: function(event, reward, position) {
            var data = {
                event_group: GameEvents.active_happening.reward,
                level_id: reward.level_id,
                data: reward
            };

            this.showContextMenu(event, position, {
                data: data
            });
        }
    };
});