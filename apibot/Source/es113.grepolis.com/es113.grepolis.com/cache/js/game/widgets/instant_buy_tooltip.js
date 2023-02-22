/* global us, DM */
(function($) {
    'use strict';

    /**
     * Arrow positions:
     *
     * - top-center
     * - top-left
     * - top-right
     *
     * - bottom-center
     * - bottom-left
     * - bottom-right
     *
     * - left-middle
     * - left-top
     * - left-bottom
     *
     * - right-middle
     * - right-top
     * - right-bottom
     */

    $.fn.instantBuyTooltip = function(params) {
        var settings = $.extend({
            template: DM.getTemplate('COMMON', 'tooltip_with_arrow'),
            selector: null,
            arrow_position: 'bottom-center',
            class_name: ''
        }, params);

        var _self = this,
            $el = $(this),
            namespace = 'construction-queue-base';

        var $tooltip = null;

        function updateClassName(arrow_position) {
            $tooltip.removeClass(getArrowCssClass(arrow_position) + ' ' + getArrowCssClass(settings.arrow_position) + ' ' + settings.class_name);
            $tooltip.addClass(settings.class_name + ' ' + getArrowCssClass(arrow_position));
        }

        /*
         * $target is optionally passed to the listeners
         */
        function destroyTooltip($target) {
            if ($tooltip === null) {
                return;
            }

            $tooltip.off('.' + namespace);
            $tooltip.fadeOut('fast', function() {
                $tooltip.remove();
                $tooltip = null;

                $el.trigger('ibt:destroy', [_self, $target]);
            });
        }

        function createTooltipContainer(item) {
            //var $template = $(us.template(settings.template, {}));

            //$tooltip = $template.attr('id', 'tooltip_with_arrow_unique');
            $tooltip = $(us.template(settings.template, {}));
            $tooltip.css({
                position: 'absolute',
                zIndex: 5000,
                display: 'none'
            });

            updateClassName(settings.arrow_position);

            $('#popup_div_curtain').append($tooltip);

            $tooltip.on('mouseout.' + namespace, function(e) {
                var $related_target = $(e.relatedTarget),
                    related_target = $related_target[0],
                    current_target = $(e.currentTarget)[0];

                if ((!$.contains(current_target, related_target) && !$.contains(item, related_target) && related_target !== current_target) || $related_target.hasClass('btn_cancel_order')) {
                    destroyTooltip(related_target);
                }
            });
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $el.off('.' + namespace);
            $el.off('ibt:load:data ibt:load:data:finish');
        }

        function getTooltipOffset($item, arrow_position) {
            var $arrow = $tooltip.find('.js-arrow');

            var item_offset = $item.offset();
            var item_width = $item.width();
            var item_height = $item.height();

            var arrow_pos = $arrow.position();
            var arrow_width = $arrow.width();
            var arrow_height = $arrow.height();
            var arrow_margin_left = parseInt($arrow.css('margin-left'), 10);
            var arrow_margin_top = parseInt($arrow.css('margin-top'), 10);

            var tooltip_width = $tooltip.width();
            var tooltip_height = $tooltip.height();

            //6 is just a fixed number which can not be calculated, used to put popup over the queue-item
            var fixed_offset = 6;

            var pos_left, pos_top;

            switch (arrow_position) {
                case 'bottom-left':
                case 'bottom-right':
                case 'bottom-center':
                    pos_left = item_offset.left + item_width / 2 - (arrow_pos.left + arrow_margin_left) - arrow_width / 2;
                    pos_top = item_offset.top - tooltip_height + fixed_offset;
                    break;
                case 'top-left':
                case 'top-right':
                case 'top-center':
                    pos_left = item_offset.left + item_width / 2 - (arrow_pos.left + arrow_margin_left) - arrow_width / 2;
                    pos_top = item_offset.top + item_height - fixed_offset;
                    break;
                case 'right-top':
                case 'right-middle':
                case 'right-bottom':
                    pos_left = item_offset.left - tooltip_width + fixed_offset;
                    pos_top = item_offset.top + item_height / 2 - (arrow_pos.top + arrow_margin_top) - arrow_height / 2;
                    break;
                case 'left-top':
                case 'left-middle':
                case 'left-bottom':
                    pos_left = item_offset.left + item_width + fixed_offset;
                    pos_top = item_offset.top + item_height / 2 - (arrow_pos.top + arrow_margin_top) - arrow_height / 2;
                    break;
            }

            return {
                top: pos_top,
                left: pos_left
            };
        }

        function getFlippedPosition(position) {
            var position_parts = position.split('-');

            if (position_parts[0] === 'top') {
                position_parts[0] = 'bottom';
            } else if (position_parts[0] === 'bottom') {
                position_parts[0] = 'top';
            } else if (position_parts[0] === 'left') {
                position_parts[0] = 'right';
            } else if (position_parts[0] === 'right') {
                position_parts[0] = 'left';
            }

            return position_parts.join('-');
        }

        function isTooltipOutOfTheViewport(tooltip_offset) {
            //Out of the left side of the screen
            if (tooltip_offset.left < 0) {
                return true;
            }

            //Out of the top side of the screen
            if (tooltip_offset.top < 0) {
                return true;
            }

            //Get this values only if the first two conditions are excluded (to don't waste resources)
            var tooltip_width = $tooltip.width(),
                tooltip_height = $tooltip.height();
            var $document = $(document),
                $window = $(window);
            var scroll_left = $document.scrollLeft(),
                scroll_top = $document.scrollTop();
            var window_width = $window.innerWidth(),
                window_height = $window.innerHeight();

            //Out of the right side of the screen
            if (tooltip_offset.left + tooltip_width > window_width + scroll_left) {
                return true;
            }

            //Out of the bottom side of the screen
            if (tooltip_offset.top + tooltip_height > window_height + scroll_top) {
                return true;
            }

            return false;
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            var selector = settings.selector,
                delayTimer;

            unbindEvents();
            destroyTooltip();

            $el.on('mouseover.' + namespace, selector, function(e) {
                var $target = $(e.target);

                if ($target.hasClass('btn_cancel_order')) {
                    return;
                }

                delayTimer = setTimeout(function() {
                    var $item = $(e.currentTarget),
                        item = $item[0];

                    if ($tooltip === null) {
                        createTooltipContainer(item);

                        _self.trigger('ibt:load:data', [_self, $tooltip.find('.js-content-area'), $item]);
                        _self.trigger('ibt:load:data:finish', [_self, $item]);
                    }
                }, 200);
            });

            $el.on('mouseout.' + namespace, selector, function(e) {
                clearTimeout(delayTimer);

                var $related_target = $(e.relatedTarget),
                    $current_target = $(e.currentTarget);

                if ($tooltip === null) {
                    return;
                }

                var target_is_not_tooltip =
                    $related_target[0] !== $tooltip[0] && !$.contains($tooltip[0], $related_target[0]),
                    target_is_not_item =
                    $current_target[0] !== $related_target[0] && !$.contains($current_target[0], $related_target[0]);

                if ((target_is_not_item && target_is_not_tooltip) || $related_target.hasClass('btn_cancel_order')) {
                    destroyTooltip($related_target);
                }
            });

            $el.on('ibt:load:data:finish', function(e, _ibt, $item) {
                // The tooltip may be gone (e.g. town switch)
                if (!$tooltip) {
                    return;
                }

                $tooltip.css('display', 'block');

                //Calculate tooltip position
                var tooltip_offset = getTooltipOffset($item, settings.arrow_position);

                //Check whether the tooltip is fully displayed in the viewport
                var is_out_of_the_viewport = isTooltipOutOfTheViewport(tooltip_offset);

                //If tooltip is out of the viewport flip the position and recalculate offset
                if (is_out_of_the_viewport === true) {
                    var new_arrow_position = getFlippedPosition(settings.arrow_position);
                    tooltip_offset = getTooltipOffset($item, new_arrow_position);
                    updateClassName(new_arrow_position);
                }

                $tooltip.css(tooltip_offset);
            });
        }

        /**
         * Returns the css class representing the arrow position
         * @param {String} position
         */
        function getArrowCssClass(position) {
            return 'arrow-' + position;
        }

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            unbindEvents(true);
            destroyTooltip();
        };

        this.hideTooltip = function() {
            destroyTooltip();
        };

        //Initialization
        (function() {
            if (settings.template === null) {
                throw 'Please load tooltip template';
            }

            bindEvents();
        }());

        return this;
    };
}(jQuery));