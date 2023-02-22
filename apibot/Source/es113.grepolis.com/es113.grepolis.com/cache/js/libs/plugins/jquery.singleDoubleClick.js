/*globals $ */

/**
 * Handles situation when "click" and "dbclick" is binded on the same node. In normal way its difficult to diffrenciate
 * which event should be handled in time because if user intends to double click, then 2 "click" events are fired, and
 * after them "dbclick" event is fired. This script awaits for user actions and then decide if "click" or "dbclick"
 * should be fired.
 *
 * @param {Object} options
 *     @param {Integer} timeout
 *
 * @return {jQuery Component Object}
 */
$.fn.singleDoubleClick = function(options) {
    "use strict";

    var opts = $.extend({
        timeout: 300
    }, options);

    var $el = $(this);

    return this.each(function() {
        var clicks = 0;

        $el.on('click.single_double_click', function(e) {
            clicks++;

            if (clicks === 1) {
                setTimeout(function() {
                    $el.trigger(clicks === 1 ? 'sdc:click' : 'sdc:dbclick');

                    clicks = 0;
                }, opts.timeout);
            }
        });

        this.destroy = function() {
            $el.off('.single_double_click');
        };
    });
};