/* globals CM, Timestamp */
define('helpers/wonder', function() {
    'use strict';

    var Game = require_legacy('Game');

    return {
        registerGracePeriodProgressBar: function(window_element) {
            var $grace_period_wonder_bar = window_element.getJQElement().find('.grace_period_wonder_bar');

            if ($grace_period_wonder_bar.length) {
                var world_wonder_start_at_timestamp = $grace_period_wonder_bar.data('timestamp'),
                    max = Game.constants.wonder.wonder_start_grace_period_seconds,
                    value = world_wonder_start_at_timestamp - Timestamp.now();

                CM.unregister(window_element.getContext(), 'grace_period_wonder_bar');
                CM.register(window_element.getContext(), 'grace_period_wonder_bar',
                    $grace_period_wonder_bar.singleProgressbar({
                        template: 'tpl_pb_single_nomax_bg',
                        type: 'time',
                        reverse_progress: true,
                        liveprogress: true,
                        liveprogress_interval: 1,
                        value: value,
                        max: max,
                        countdown: true
                    })
                );
            }
        }
    };
});