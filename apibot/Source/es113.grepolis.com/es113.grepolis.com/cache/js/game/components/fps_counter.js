(function() {
    "use strict";

    var created_fps_counter = 0,
        created_fps_counters = [],
        current_fps = 0,
        current_frame = 0,
        last_update_at_second;

    function FC($el) {
        this.id = ++created_fps_counter;
        this.$el = $el;
        this.animate = true;

        this.last_fps = 0;
        created_fps_counters.push(this.id);

        $.fx.timer(this.tick.bind(this));
    }

    FC.prototype.tick = function() {
        var current_second,
            index;
        if (this.animate) {
            current_second = Math.floor(window.animationFrameStartTimestamp / 1000);

            if (created_fps_counters[0] === this.id) {
                if (current_second !== last_update_at_second) {
                    last_update_at_second = current_second;
                    current_fps = current_frame;
                    current_frame = 1;
                } else {
                    ++current_frame;
                }
            }

            if (this.last_fps !== current_fps) {
                this.$el.html(current_fps);
                this.last_fps = current_fps;
            }
        } else {
            index = created_fps_counters.indexOf(this.id);
            created_fps_counters.remove(index);
        }

        return this.animate;
    };

    /**
     * Returns id specified on the root node of the component
     *
     * @return {String}
     */
    FC.prototype.getId = function() {
        return this.$el.attr("id");
    };

    /**
     * Clears up stuff before component will be removed
     */
    FC.prototype.destroy = function() {
        this.animate = false;
    };

    $.fn.fps_counter = function(params) {
        var fc = new FC($(this));

        us.extend(this, fc);

        return this;
    };
}());