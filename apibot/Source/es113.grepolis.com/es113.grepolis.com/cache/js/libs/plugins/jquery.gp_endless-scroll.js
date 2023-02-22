/**
 * Endless Scroll plugin for jQuery
 *
 * v1.4.1
 *
 * Copyright (c) 2008 Fred Wu
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * Usage:
 *
 * // using default options
 * $(document).endlessScroll();
 *
 * // using some custom options
 * $(document).endlessScroll({
 *   callback: function(){
 *     alert("test");
 *   }
 * });
 *
 * Configuration options:
 *
 * data          string|function  plain HTML data, can be either a string or a function that returns a string
 * insertAfter   string           jQuery selector syntax: where to put the loader as well as the plain HTML data
 * callback      function         callback function, accepets one argument: fire sequence (the number of times
 *                                the event triggered during the current page session)
 *
 * Usage tips:
 *
 * The plugin is more useful when used with the callback function, which can then make AJAX calls to retrieve content.
 * The fire sequence argument (for the callback function) is useful for 'pagination'-like features.
 */

/* * * *
 * Modified for grepolis; to allow up and down scrolling;
 * Based on VERSION 1.4.1
 * * * */

(function($) {

    $.fn.endlessScroll = function(options) {

        var defaults = {
                pixelOffset: 1,
                data: "",
                callback: function() {
                    return true;
                }
            },
            options = $.extend(defaults, options),
            scroll_direction_down,
            last_scroll_position = 0,
            content_height = 0,
            sum_top = 0,
            visible_height = 0,
            pagination_elem_id,
            current_page = options.start_page,
            rowspan = options.rowspan,
            was_at_top = true;

        $(document).off('essl_trigger_' + $(this).attr('id')); // unbind all trigger first
        $(document).on('essl_trigger_' + $(this).attr('id'), function(evt, data) {
            last_scroll_position = data.scroll_pos;
            was_at_top = data.is_at_top;

            if (data.current_page != undefined) {
                current_page = data.current_page;
            }
        });

        this.scroll = function() {
            if (EndlessScroll.isLocked()) {
                return;
            }

            var has_height, is_at_bottom, is_at_top;

            scroll_direction_down = ($(this).scrollTop() - last_scroll_position) > 0;
            last_scroll_position = $(this).scrollTop();

            // if scrolled into a new page, change current page in page_input_box
            if (sum_top == 0) {
                $('#' + options.insert_elem_id).children('.top').each(function(key, elem) {
                    sum_top += $(elem).height();
                });
            }

            if (sum_top >= 20) {
                current_page = EndlessScroll.updatePage(pagination_elem_id, current_page, was_at_top, visible_height, last_scroll_position, sum_top);
                was_at_top = sum_top - (visible_height / 2) > last_scroll_position;

                EndlessScroll.unlockPage();
            }

            if (content_height == 0) {
                if (rowspan) {
                    content_height = document.getElementById(options.insert_elem_id).scrollHeight;
                } else {
                    // calculates the actual height of the scrolling container
                    $('#' + options.insert_elem_id).children().each(function(key, elem) {
                        content_height += $(elem).outerHeight(); // if elem has margin, use outerHeight(true)
                    });
                }
            }

            has_height = content_height > 0;
            is_at_bottom = $(this).scrollTop() >= content_height - $(this).height() - options.pixelOffset;
            is_at_top = $(this).scrollTop() < options.pixelOffset;

            if (has_height && (is_at_top || is_at_bottom)) {

                if (typeof options.data == 'function') {
                    data = options.data.apply(this);
                } else {
                    data = options.data;
                }

                if (data !== false) {
                    var args = new Array(scroll_direction_down),
                        pagination = options.callback.apply(this, args);
                    sum_top = 0;
                    content_height = 0;

                    // store data for pagination
                    if (pagination) {
                        visible_height = pagination.visible_height;
                        pagination_elem_id = pagination.pagination_elem_id;
                    }
                }
            }
        }

        // bind scroll
        $(this).off("scroll").on("scroll", this.scroll);
    };
})(jQuery);