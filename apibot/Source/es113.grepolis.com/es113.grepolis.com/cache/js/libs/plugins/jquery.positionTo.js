/*globals jQuery */

/*
 * jQuery positionTo
 *
 * Version 0.1 (20.03.2013) Requires jQuery
 *
 * (c) 2013 Michal Dyro
 * Licensed under CC BY-SA 3.0 http://creativecommons.org/licenses/by-sa/3.0/
 *
 */
jQuery.fn.extend({
    positionTo: function(target_el) {
        "use strict";

        var offset = {
                top: 0,
                left: 0
            },
            $el = this,
            el = this[0],
            $target_offset_parent;

        // if no target - return element's offset relative to body
        if (!target_el) {
            return $el.offset();
        }

        $target_offset_parent = target_el.offsetParent();

        // if target's offset parent is body - return values from getBoundingClientRect()
        if ($target_offset_parent.is($('body'))) {
            return $el.offset();
        }

        /*
         * add current offset and go one up
         *  while there is where to go
         *  OR
         *  up does not equal our target
         */

        do {
            offset.top += el.offsetTop;
            offset.left += el.offsetLeft;
            el = el.offsetParent;
        } while (el && (el !== $target_offset_parent[0]));

        /*
         * IF we have no common offset parents
         * give the coordinates relative to requested offset parent
         */
        if (!el && $target_offset_parent.offset()) {
            offset.top += -$target_offset_parent.offset().top;
            offset.left += -$target_offset_parent.offset().left;
        }

        return offset;
    }
});