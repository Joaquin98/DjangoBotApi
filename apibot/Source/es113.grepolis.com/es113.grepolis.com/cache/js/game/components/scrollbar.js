/* global Game */
/**
 * Based on the native scrollabr
 */

(function($) {
    'use strict';

    $.fn.scrollbar_index = 0;

    $.fn.scrollbar = function(params) {
        var settings = $.extend({
            orientation: 'vertical', //horizontal | vertical
            $elements_to_scroll: null,
            $container: null
        }, params);

        var $el = $(this),
            $document = $(document),
            $scrollbar, $container = settings.$container,
            $elements_to_scroll = settings.$elements_to_scroll,
            container = $container[0],
            uid = ++$.fn.scrollbar_index,
            isiOS = Game.isiOs();

        var namespace = '.scrollbar' + uid;

        var scroll_width_method_name = (settings.orientation === 'vertical' ? 'offsetHeight' : 'scrollWidth'),
            scroll_method_name = (settings.orientation === 'vertical' ? 'scrollTop' : 'scrollLeft'),
            method_name = (settings.orientation === 'vertical' ? 'height' : 'width'),
            overflowX = (settings.orientation === 'vertical' ? 'hidden' : 'auto'),
            overflowY = (settings.orientation === 'vertical' ? 'auto' : 'hidden'),
            client_method_name = (settings.orientation === 'vertical' ? 'clientY' : 'clientX');

        function prepareHtmlElements() {
            var fragment = document.createDocumentFragment(),
                scrollbar = document.createElement('div'),
                resizer = document.createElement('div');

            scrollbar.className = 'scrollbar-native ' + settings.orientation;
            scrollbar.style.overflowX = overflowX;
            scrollbar.style.overflowY = overflowY;

            resizer.className = 'scrollbar-resizer';
            resizer.style[method_name] = container[scroll_width_method_name] + 'px';

            scrollbar.appendChild(resizer);
            fragment.appendChild(scrollbar);

            $scrollbar = $(scrollbar);
            $scrollbar.scrollTop(1000000);

            $el.append(fragment);

            //When there is nothing to scroll
            if (container[scroll_width_method_name] === $container[method_name]()) {
                $scrollbar.hide();
            } else {
                $scrollbar.show();
            }
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $scrollbar.off(namespace);
            $elements_to_scroll.off(namespace);
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $scrollbar.on('scroll.scrollbar' + uid, function() {
                $elements_to_scroll[scroll_method_name]($scrollbar[scroll_method_name]());
            });

            //Make possible to scroll also on iPad
            $elements_to_scroll.on('touchstart' + namespace, function(e) {
                e = e.type === 'touchstart' ? e.originalEvent.touches[0] : e;

                var scroll_pos = $scrollbar[scroll_method_name](),
                    client_start_pos = e[client_method_name],
                    client_move_pos;

                $document.on('touchmove' + namespace, function(e) {
                    if (isiOS && e.type === 'mousemove') {
                        return;
                    }

                    e = e.type === 'touchmove' ? e.originalEvent.touches[0] : e;

                    client_move_pos = e[client_method_name];

                    $scrollbar[scroll_method_name](scroll_pos + (client_start_pos - client_move_pos));
                });

                $document.on('touchend' + namespace, function(e) {
                    $document.off('touchmove' + namespace);
                });
            });
        }

        this.update = function() {
            var $elements_to_scroll = settings.$elements_to_scroll;

            $scrollbar.find('.scrollbar-resizer').css(method_name, container[scroll_width_method_name] + 'px');

            //When there is nothing to scroll
            if (container[scroll_width_method_name] === $container[method_name]()) {
                $scrollbar.hide();
                //Reset scroll (FF needs it)
                $elements_to_scroll[scroll_method_name](0);
            } else {
                $scrollbar.show();
            }
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Unbind all events from the main node
            unbindEvents(true);
        };

        //Initialization
        (function() {
            prepareHtmlElements();
            bindEvents();
        }());

        return this;
    };
}(jQuery));