/* global jQuery */

(function($) {
    "use strict";

    $.fn.listSlider = function(params) {
        var settings = $.extend({
            enable_wheel_scrolling: false,
            is_animated: false,
            is_horizontal: true,
            scroll_item_into_view: null
        }, params);

        var $el = $(this),
            button_left, button_right;

        var $viewport = $el.find('.js-list-viewport'),
            $list = $el.find('.js-list'),
            scroll_enabled = true;

        /**
         * Calculates total width in pixels of all elements which are displayed on the list
         *
         * @return {Integer}
         */
        function getContentDimension() {
            var $nodes = $list.children(),
                result = 0;

            $nodes.each(function(index, el) {
                var $el = $(el);
                result += settings.is_horizontal ? $el.outerWidth(true) : $el.outerHeight(true);
            });

            return result;
        }

        function setContentDimension() {
            if (settings.is_horizontal) {
                $list.width(getContentDimension());
            } else {
                $list.height(getContentDimension());
            }
        }

        /**
         * Returns dimension of the viewport, either based on width or height
         */
        function getViewportDimension() {
            return settings.is_horizontal ? $viewport.outerWidth(true) : $viewport.outerHeight(true);
        }

        /**
         * Returns dimension of the viewport without outer width, either based on width or height
         */
        function getViewportDimensionWithoutOuterWidth() {
            return settings.is_horizontal ? $viewport.width() : $viewport.height();
        }

        function getListPosition() {
            return $list.data('position');
        }

        function setListPosition() {
            $list.data('position', 0);
        }

        function getItemDimension($item) {
            return settings.is_horizontal ? $item.outerWidth(true) : $item.outerHeight(true);
        }

        /**
         * Returns item position; It uses the item index and multiplies it with the item dimension.
         * For example: Fourth list item multiplied with height, 4 * 60(px) = 240
         */
        function getItemPosition($item) {
            return $item.index() * getItemDimension($item);
        }

        /**
         * Hides or shows buttons depends on the position of the list and size of the viewport
         */
        function updateButtonsVisibility() {
            var viewport_dimension = getViewportDimensionWithoutOuterWidth(),
                content_dimension = getContentDimension(),
                list_pos = getListPosition();

            // Don't display left button when list is scrolled to the left side or when there is nothing to scroll
            var hide_left_button = list_pos === 0 || content_dimension <= viewport_dimension,
                // Don't display right button when list is scrolled to the right side or when there is nothing to scroll
                hide_right_button = list_pos === viewport_dimension - content_dimension || content_dimension <= viewport_dimension;

            button_left.toggle(!hide_left_button);
            button_right.toggle(!hide_right_button);
        }

        function updateListPosition(position) {
            if (settings.is_horizontal) {
                $list.css('left', position);
            } else {
                $list.css('top', position);
            }

            // Update current position in list
            $list.data('position', position);

            if (!settings.is_animated) {
                updateButtonsVisibility();
            }
        }

        /**
         * Centers icons relatively to the viewport
         */
        function alignIcons() {
            var position = 0,
                viewport_dimension = getViewportDimension(),
                content_dimension = getContentDimension();

            // If icons don't fill entire viewport
            if (viewport_dimension > content_dimension) {
                // Center them
                position = (viewport_dimension - content_dimension) / 2;
            }

            updateListPosition(position);
        }

        /**
         * Determines whether the item is visible in the viewport or not
         *
         * @return {Boolean}
         */
        function isItemVisibleInViewport($item) {
            var list_pos = getListPosition(),
                viewport_dimension = getViewportDimension(),
                pos = getItemPosition($item),
                width = getItemDimension($item),
                pos_modified = pos + list_pos; // It's done to operate only in range <0, viewport_width>

            return (pos_modified + width > 0) && (pos_modified + width) <= viewport_dimension;
        }

        /**
         * Returns position of the first or last visible item in the viewport
         *
         * @param {String} which
         *     Possible values:
         *     - 'first'
         *     - 'last'
         */
        function getVisibleItemInViewport(which) {
            var $item, items = $list.children(),
                i, l = items.length;

            for (i = 0; i < l; i++) {
                if (isItemVisibleInViewport($(items[i]))) {
                    $item = $(items[i]);

                    if (which === 'first') {
                        return $item;
                    }
                }
            }

            return $item;
        }

        function toggleScrolling(value) {
            if (settings.is_animated) {
                scroll_enabled = value;
            }
        }

        function scrollTo(list_position) {
            updateListPosition(Math.min(0, list_position));
        }

        function scrollToBeginning() {
            var $first_visible = getVisibleItemInViewport('first'),
                $previous_item = $first_visible.prev();

            if ($previous_item.length) {
                scrollTo(getListPosition() + getItemDimension($previous_item));
            } else {
                toggleScrolling(true);
            }
        }

        function scrollToEnd() {
            var $last_visible = getVisibleItemInViewport('last'),
                $next_item = $last_visible.next();

            if ($next_item.length) {
                scrollTo(getListPosition() - getItemDimension($next_item));
            } else {
                toggleScrolling(true);
            }
        }

        function bindEvents() {
            // Initialize left button
            button_left = $el.find('.js-button-left').button({
                template: 'empty'
            }).on('btn:click', function() {
                toggleScrolling(false);
                scrollToBeginning();
            });

            // Initialize right button
            button_right = $el.find('.js-button-right').button({
                template: 'empty'
            }).on('btn:click', function() {
                toggleScrolling(false);
                scrollToEnd();
            });

            if (settings.enable_wheel_scrolling) {
                $list.on('mousewheel', function(e, delta) {
                    if (!scroll_enabled) {
                        return;
                    }

                    toggleScrolling(false);

                    if (delta < 0) {
                        scrollToEnd();
                    } else {
                        scrollToBeginning();
                    }
                });
            }

            if (settings.is_animated) {
                $list.on('webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend', function() {
                    updateButtonsVisibility();
                    toggleScrolling(true);
                });
            }
        }

        function updateContent() {
            setListPosition();
            setContentDimension();
            // Update visibility of these buttons
            updateButtonsVisibility();
            // Center icons if they don't fill entire viewport
            alignIcons();
        }

        function scrollItemIntoView() {
            var $item = settings.scroll_item_into_view,
                item_pos = 0;

            if (!$item || $item.length === 0) {
                return;
            }

            if (isItemVisibleInViewport($item)) {
                return;
            }

            item_pos = getItemPosition($item);

            if (item_pos < 0) {
                scrollTo(getListPosition() - item_pos);
            } else {
                scrollTo(getViewportDimension() - (item_pos + getItemDimension($item)));
            }

            updateButtonsVisibility();
        }

        this.toggleAnimated = function(value) {
            settings.is_animated = value;
        };

        this.updateContent = function() {
            updateContent();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            button_left.destroy();
            button_right.destroy();
            $list.off();
        };

        // Initialize
        (function() {
            bindEvents();
            updateContent();
            scrollItemIntoView();
        }());

        return this;
    };
}(jQuery));