/* global us, Game */
/**
 * HINT: Doesn't support situation when container resizes itself, but its easy to add
 */

(function($) {
    'use strict';

    $.fn.skinableScrollbar = function(params) {
        // Determined by experiment
        var MAX_DELTA = 10;

        var settings = $.extend({
            orientation: 'vertical', //horizontal | vertical
            skin: '', // round
            template: 'tpl_scrollbar',
            disabled: false,
            elements_to_scroll: null,
            elements_to_scroll_position: 'absolute',
            element_viewport: null,
            scroll_position: 0,
            hide_when_nothing_to_scroll: true,
            min_slider_size: 16,
            prepend: false
        }, params);

        var _self = this,
            $el = $(this),
            $document = $(document),
            isiOS = Game.isiOs(),
            $scrollbar, $slider, $slider_container, $viewport, $arrow1, $arrow2, $elements_to_scroll,
            scroll_height, scroll_width, template,
            uid = ++$.fn.scrollbar_index;

        var is_vertical = settings.orientation === 'vertical',
            pos_method = is_vertical ? 'top' : 'left',
            measure_method = is_vertical ? 'height' : 'width',
            client_method = is_vertical ? 'clientY' : 'clientX',
            touch_client_method = is_vertical ? 'pageY' : 'pageX',
            className = '.scrollbar' + uid;

        var localy_disabled = false;

        /**
         * Prepares and loads scrollbar template
         */
        function loadTemplate() {
            template = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();
            template = us.template(template, {
                uid: uid
            });

            if (settings.prepend) {
                $el.css({
                    overflow: settings.overflow
                }).prepend(template);
            } else {
                $el.css({
                    overflow: settings.overflow
                }).append(template);
            }
        }

        /**
         * calculates height and width of the slider,
         * beware: may fail when the Node is hidden / not in DOM
         */
        function calculateSliderSize() {
            var overflow = $elements_to_scroll.css('overflow');

            if (overflow !== 'hidden') {
                $elements_to_scroll.css('overflow', 'hidden');
                scroll_height = $elements_to_scroll.outerHeight();
                scroll_width = $elements_to_scroll.outerWidth();
                $elements_to_scroll.css('overflow', overflow);
            } else {
                scroll_height = $elements_to_scroll.outerHeight();
                scroll_width = $elements_to_scroll.outerWidth();
            }

            var verticalSize = function() {
                return Math.round(
                    Math.max(
                        settings.min_slider_size,
                        Math.min($viewport.height() / scroll_height, 1) * $slider_container.height()
                    )
                );
            };

            var horizontalSize = function() {
                return Math.round(
                    Math.max(
                        settings.min_slider_size,
                        Math.min($slider_container.width() / scroll_width, 1) * $slider_container.width()
                    )
                );
            };

            return is_vertical ? verticalSize() : horizontalSize();
        }

        function setSliderSize() {
            // Get slider size
            var size = calculateSliderSize();
            // Make it to fit to the scroll area
            $slider[measure_method](size);

            if (size >= $slider_container[measure_method]()) {
                localy_disabled = true;

                if (settings.hide_when_nothing_to_scroll) {
                    $scrollbar.hide();
                } else {
                    $scrollbar.addClass('disabled');
                }

                $viewport.addClass('scrollbar_not_active');
            } else {
                localy_disabled = false;
            }
        }

        /**
         * Caches elements and sets makes initial calculations
         */
        function prepareHtmlElements() {
            // Cache elements
            $scrollbar = $el.find('.js-sb-' + uid);
            $slider = $scrollbar.find('.js-sb-slider');
            $slider_container = $scrollbar.find('.js-sb-slider-container');
            $arrow1 = $scrollbar.find('.js-sb-arrow1');
            $arrow2 = $scrollbar.find('.js-sb-arrow2');
            $viewport = settings.element_viewport;
            $elements_to_scroll = settings.elements_to_scroll;

            $scrollbar.addClass(settings.orientation + ' ' + settings.skin);

            $elements_to_scroll.css({
                position: settings.elements_to_scroll_position
            });

            setSliderSize();
        }

        function getValidSliderPosition(value) {
            var max_position = is_vertical ?
                $slider_container.height() - $slider.outerHeight() :
                $slider_container.width() - $slider.outerWidth();

            return Math.min(max_position, Math.max(0, value));
        }

        function unbindEvents() {
            $el.off(className);
            $slider.off(className);
            $document.off(className);
        }

        var max_position, max_scroll, button_scroll;

        function calculateDefaults() {
            max_position = is_vertical ?
                $slider_container.height() - $slider.outerHeight() :
                $slider_container.width() - $slider.outerWidth();
            max_scroll = is_vertical ?
                scroll_height - $el.height() :
                scroll_width - $el.width();
            button_scroll = Math.floor(max_position / Math.ceil(max_scroll / max_position));
        }

        function get1DTranslate(value, is_vertical) {
            var x = is_vertical ? 0 : value,
                y = is_vertical ? value : 0;
            return {
                translate: [x, y]
            };
        }

        function getClampedScrollValue(value) {
            return Math.round(Math.min(0, Math.max(-max_scroll, -value)));
        }

        function getAbsoluteContentPosition() {
            return Math.round(
                Math.abs((
                    is_vertical ?
                    $elements_to_scroll.position().top :
                    $elements_to_scroll.position().left
                ) * Game.ui_scale.normalize.factor)
            );
        }

        function scrollElements(value, is_touch_scrolling) {
            var slider_scroll = is_touch_scrolling ? ((max_position * value) / max_scroll) : value,
                slider_position = Math.round(getValidSliderPosition(slider_scroll)),
                scroll = 0;

            if (max_scroll && is_touch_scrolling) {
                scroll = getClampedScrollValue(value);
            } else if (max_scroll) {
                scroll = getClampedScrollValue(max_scroll / max_position * slider_position);
            }

            $slider.css(get1DTranslate(slider_position, is_vertical));
            $elements_to_scroll.css(get1DTranslate(scroll, is_vertical));

            $arrow1.toggleClass('disabled', scroll === 0);
            $arrow2.toggleClass('disabled', scroll === -max_scroll);

            return scroll;
        }

        function isDisabled() {
            return settings.disabled || localy_disabled;
        }

        function bindEvents() {
            scrollElements(getValidSliderPosition(settings.scroll_position));

            unbindEvents();

            $slider_container.on('click.' + className, function(e) {
                if (isDisabled()) {
                    return;
                }

                var offset_slider = $slider_container.offset()[pos_method],
                    offset_cursor = e[client_method];

                scrollElements((offset_cursor - offset_slider) * Game.ui_scale.normalize.factor);
            });

            $arrow1.on('click.' + className, function() {
                if (isDisabled()) {
                    return;
                }

                scrollElements(_self.getSliderPosition() - button_scroll);
            });

            $arrow2.on('click.' + className, function() {
                if (isDisabled()) {
                    return;
                }

                scrollElements(_self.getSliderPosition() + button_scroll);
            });

            $slider.on('click.' + className, function(e) {
                if (isDisabled()) {
                    return;
                }

                e.stopPropagation();
            });

            $slider.on('mousedown.' + className, function(e) {
                if (isDisabled()) {
                    return;
                }

                e.stopPropagation();
                e.preventDefault();

                var client_start = e[client_method],
                    pos_start = $slider.position()[pos_method];

                $document.on('mousemove.' + className, function(e) {
                    var clientCurr = e[client_method];

                    scrollElements(pos_start + clientCurr - client_start);
                });
            });

            if (is_vertical) {
                $el.on('mousewheel.' + className, function(e, delta) {
                    if (isDisabled()) {
                        return;
                    }

                    e.stopPropagation();

                    var pos_start = $slider.position()[pos_method] * Game.ui_scale.normalize.factor;

                    //minus delta because delta is negative when you scroll down
                    scrollElements(pos_start - (delta / MAX_DELTA) * 50);
                });
            }

            $document.on('mouseup.' + className, function() {
                $document.off('mousemove.' + className);
            });

            $el.on('touchstart.' + className, function(e) {
                e = e.type === 'touchstart' ? e.originalEvent.touches[0] : e;

                var client_start_pos = e[touch_client_method],
                    client_move_pos;

                $document.on('touchmove.' + className, function(e) {
                    if (isiOS && e.type === 'mousemove') {
                        return;
                    }

                    e = e.type === 'touchmove' ? e.originalEvent.touches[0] : e;

                    client_move_pos = e[touch_client_method];
                    scrollElements(getAbsoluteContentPosition() + client_start_pos - client_move_pos, true);

                    /*
                     * Reset needed for switching direction, otherwise scrolling continues in same direction until
                     * initial start position was passed again
                     */
                    client_start_pos = client_move_pos;
                });

                $document.on('touchend.' + className, function() {
                    $document.off('touchmove.' + className);
                });
            });
        }

        function disable(bool) {
            settings.disabled = bool;

            $scrollbar.toggleClass('disabled', bool);
        }

        function showScrollbarIfNeeded() {
            var measure_method = is_vertical ? 'height' : 'width';

            if ($elements_to_scroll[measure_method]() > $viewport[measure_method]()) {
                $scrollbar.show();
            }
        }

        this.disable = function() {
            disable(true);

            return this;
        };

        this.enable = function() {
            disable(false);

            return this;
        };

        /**
         *
         * @param offset - distance from the top
         * @param [use_viewport_offset]
         * 	- if true, scrolls to the offset from the top of the viewport
         * 	- if false (default), scrolls to offset from top of slider bar
         */
        this.scrollTo = function(offset, use_viewport_offset) {
            if (use_viewport_offset) {
                var ratio = max_scroll / offset;
                return scrollElements(getValidSliderPosition(max_position / ratio));
            } else {
                return scrollElements(getValidSliderPosition(offset));
            }
        };

        this.getSliderPosition = function() {
            var pos_array = $slider.css('translate').split(','),
                position = is_vertical ? pos_array[1] : pos_array[0];
            return parseInt(position, 10);
        };

        this.update = function() {
            if (settings.hide_when_nothing_to_scroll || !isDisabled()) {
                showScrollbarIfNeeded();
                setSliderSize();
                calculateDefaults();
                this.scrollTo(this.getSliderPosition(), false);
            }
        };

        this.destroy = function() {
            //Unbind all events from the main node
            unbindEvents(true);

            $scrollbar.remove();
        };

        (function() {
            loadTemplate();
            prepareHtmlElements();
            calculateDefaults();
            bindEvents();

            disable(isDisabled());
        }());

        return this;
    };
}(jQuery));