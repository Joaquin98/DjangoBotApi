(function($, touch, window, undefined) {

    var namespace = 'doubletap',
        cfg = {
            distance: 10,
            duration: 300,
            finger: 1
        },
        prev_tap = null;

    touch.track(namespace, {
        touchstart: function(event, state, start) {
            state[namespace] = {
                finger: start.point.length
            };
            if (prev_tap && cfg.duration < (Date.now() - prev_tap)) {
                prev_tap = null;
            }
        },
        touchmove: function(event, state, move) {
            // if another finger was used then increment the amount of fingers used
            state[namespace].finger = move.point.length > state[namespace].finger ? move.point.length : state[namespace].finger;
        },
        touchend: function(event, state, end) {
            var opt = $.extend(cfg, event.data),
                duration,
                distance;

            // calc
            duration = touch.calc.getDuration(state.start, end);
            distance = touch.calc.getDistance(state.start.point[0], end.point[0]);

            // check if the tap was valid
            if (duration < opt.duration && distance < opt.distance) {
                // fire if the amount of fingers match
                if (prev_tap && cfg.duration > (Date.now() - prev_tap) && state[namespace].finger === opt.finger) {
                    $(event.target).trigger(
                        $.Event(namespace, touch.addEventParam(state.start, state[namespace]))
                    );
                    prev_tap = null;
                } else {
                    prev_tap = Date.now();
                }
            } else {
                prev_tap = null;
            }
        }
    });

}(jQuery, jQuery.toe, this));