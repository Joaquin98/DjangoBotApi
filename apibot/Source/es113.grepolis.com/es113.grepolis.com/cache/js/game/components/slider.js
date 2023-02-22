/* global Game*/
/**
 * Slider component
 *
 * @param params
 *      {String} template      the id (without #) of template which is already
 *                            in the document between
 *                            <script type="text/template" id="..." /> tag
 *                            or string which contains template
 *     {Boolean} disabled     determinates if events will be fired or not,
 *                            for example, when button is disabled, the code in
 *                            onclick handler won't be fired
 *     {String} orientation   determinates sliding orientation, vertical or horizontal
 *     {Number} min           determinates minimal value which can be set in slider
 *     {Number} max           determinates maximal value which can be set in slider
 *     {Number} value         determinates current value which is indicated by slider
 *     {Number} step          determinates value steps, for example if min = 0, max = 10, step = 2, then
 *                            user will be able to set only following values:
 *                            0, 2, 4, 6, 8, 10
 *     {Boolean} snap         determinates if slider have to point exact values (user have a feeling of jumps during sliding)
 *     {Boolean} live         determinates if value is updated on fly, or when user stops sliding
 *     {Boolean} select_by_click    determinates if user is able to set value by clicking on the slider
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - sl:change:value      fired when value of the slider has changed
 * - sl:slide:stop        fired when sliding has been finished
 *
 * ------------------
 * Example 1:
 * ------------------
 *
 * CM.register(cm_context, 'sl_resize_menu', $option.find('.sl_resize_menu').slider2({
 *      min : 0, max : 10, step : 1, value : 0
 * }).on('sl:change:value', function(e, _sl, value, old_value) {
 *
 * }).on('sl:slide:stop', function(e, _sl, value, old_value) {
 *
 * }));
 */
(function($) {
    'use strict';

    /* only process mousemove events every nth ms*/
    var SLIDER_EVENT_THROTTELING_VALUE = 20;

    $.fn.slider2_index = 0;

    $.fn.slider2 = function(params) {
        var settings = $.extend({
            template: 'tpl_slider',
            disabled: false,
            orientation: 'horizontal',
            min: 0,
            max: 100,
            value: 0,
            step: 1,
            stepcount: 0,
            stepsize: null,
            mouseValueChangeFunc: null,
            snap: false,
            live: true,
            select_by_click: true,
            $parent: null //specify if you want to inherit css classes
        }, params);

        var isiOs = Game.isMobileBrowser();

        var _self = this,
            $document = $(document),
            $el = $(this),
            $slider_handle_container,
            $slider_handle,
            uid = ++$.fn.slider2_index;

        var previous_value = settings.value;
        var inner_disabled_state = false;

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $el.off('.slider' + uid);
            $slider_handle_container.off('.slider' + uid);

            if (destroy) {
                $el.off('sl:change:value');
                $el.off('sl:slide:stop');
            }
        }

        function getStepValue() {
            return typeof settings.step === 'function' ? settings.step(_self, _self.getValue()) : settings.step;
        }

        /**
         * Calculates position of the indicator in pixels depends on the current value
         *
         * @param {Number} value      value indicated by slider
         * @param {Number} step_size  size in pixels between next two values (step)
         *
         * @return {Number}   number in pixels which determinates position
         *                    of the slider indicator
         */
        function calculateStopPosition(value, step_size) {
            return ((value - settings.min) / getStepValue()) * step_size;
        }

        function checkRange() {
            inner_disabled_state = settings.max === 0 && settings.min === 0;
        }

        function isDisabled() {
            return settings.disabled || inner_disabled_state;
        }

        function setValue(value, props) {
            props = props || {};

            var new_val = Math.max(settings.min, Math.min(settings.max, value)),
                is_disabled = isDisabled(),
                silent = props.silent || false,
                step = getStepValue(),
                steps = typeof settings.stepcount === 'function' ? settings.stepcount(_self, step, _self.getValue()) : (settings.max - settings.min) / step,
                is_horizontal = settings.orientation === 'horizontal',
                size_method_name = is_horizontal ? 'width' : 'height',
                pos_method_name = is_horizontal ? 'left' : 'top',
                sl_size = $slider_handle_container[size_method_name](),
                step_size = typeof settings.stepsize === 'function' ? settings.stepsize(_self, step, steps, sl_size, _self.getValue()) : sl_size / steps,
                step_nr,
                stopPos;

            stopPos = typeof props.stopPos !== 'undefined' ? props.stopPos : calculateStopPosition(new_val, step_size);
            // Limit movement to size of the main_area container
            stopPos = Math.min(Math.max(0, stopPos), sl_size);

            checkRange();

            $el.toggleClass('disabled', is_disabled);

            if (settings.$parent) {
                settings.$parent.toggleClass('disabled', is_disabled);
            }

            if (is_disabled) {
                stopPos = 0;
            }

            step_nr = Math.round(stopPos / step_size) || 0;

            //If slider-handle should snap to grid
            if (settings.snap) {
                stopPos = step_nr * step_size;
            }

            $slider_handle.css(pos_method_name, stopPos);
            //If value change is done by mouse
            if (typeof props.stopPos !== 'undefined') {
                /* The settings.mouseValueChangeFunc is by default null. I inserted this option to define a different behaviour
                 * for the mouse change than it is written in the else part.
                 * I actually could not find out why we are calculating the settings.min to the step_nr, I think this should already be calculated in the step_nr.
                 * In the market offer place where we work with times and logarithmic step changes since the value is already calculated inside the step_nr.
                 * I also tried to remove it but this caused bugs on other places?! We should rethink the logic here, something is going wrong. Even if
                 * I change the number in other places where it works fine, it won't work anymore with the settings.min calculated to the step_nr.
                 * TODO recheck if settings.min really needs to be calculated to step_nr
                 */
                if (settings.mouseValueChangeFunc) {
                    new_val = settings.mouseValueChangeFunc(settings.min, settings.max, step_nr, step);
                } else {
                    new_val = Math.max(settings.min, Math.min(settings.max, settings.min + step_nr * step));
                }
            }

            //If value equals step number in pixels (not tested)
            if (settings.value !== new_val) {
                if (!silent) {
                    $el.trigger('sl:change:value', [_self, new_val, settings.value]);
                }

                previous_value = settings.value;
                settings.value = new_val;
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            var is_horizontal = settings.orientation === 'horizontal',
                currpos_method_name = is_horizontal ? 'clientX' : 'clientY',
                pos_method_name = is_horizontal ? 'left' : 'top';

            var mousedown_event_name = (isiOs ? 'touchstart' : 'mousedown') + '.slider' + uid,
                mousemove_event_name = (isiOs ? 'touchmove' : 'mousemove') + '.slider' + uid,
                mouseup_event_name = (isiOs ? 'touchend' : 'mouseup') + '.slider' + uid;

            unbindEvents();

            $el.on(mousedown_event_name, '.js-slider-handle', function(e) {
                var $target = $(e.currentTarget),
                    target_pos, stopPos, startPos;

                if (isDisabled()) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();
                e = e.type === 'touchstart' ? e.originalEvent.touches[0] : e;

                target_pos = $target.position();
                startPos = e[currpos_method_name];

                $document.on(mousemove_event_name, us.throttle(function(e) {
                    e = e.type === 'touchmove' ? e.originalEvent.touches[0] : e;

                    stopPos = target_pos[pos_method_name] + (e[currpos_method_name] - startPos);
                    if (settings.live) {
                        setValue(null, {
                            stopPos: stopPos,
                            silent: !settings.live
                        });
                    }
                }, SLIDER_EVENT_THROTTELING_VALUE));

                $document.on(mouseup_event_name, function(e) {
                    //Honestly I do not know why touchend does not contain clientX
                    if (!isiOs) {
                        e = e.type === 'touchend' ? e.originalEvent.touches[0] : e;
                        stopPos = target_pos[pos_method_name] + (e[currpos_method_name] - startPos);

                        setValue(null, {
                            stopPos: stopPos
                        });
                    }

                    $el.trigger('sl:slide:stop', [_self, settings.value, previous_value]);

                    $document.off(mousemove_event_name + ' ' + mouseup_event_name);
                });
            });

            $slider_handle_container.on('click.slider', function(e) {
                if (isDisabled()) {
                    return;
                }

                var $target = $(e.target),
                    pos = $slider_handle_container.offset();

                if (settings.select_by_click && !$target.hasClass('js-slider-handle')) {
                    setValue(null, {
                        stopPos: e[currpos_method_name] - pos[pos_method_name]
                    });
                }
            });
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var $tpl;

            if (settings.template !== 'internal' && settings.template !== 'empty') {
                $tpl = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();

                //Append template to main container
                $el.html(us.template($tpl, settings));
            }

            $slider_handle_container = $el.find('.js-slider-handle-container');

            if (!$slider_handle_container.length) {
                $slider_handle_container = $el;
            }

            $slider_handle = $el.find('.js-slider-handle');

            //Bind events
            bindEvents();
        }

        /**
         * Disables  component
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            settings.disabled = true;

            return this;
        };

        /**
         * Enables  component
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            settings.disabled = false;

            return this;
        };

        /**
         * Sets value of the slider
         *
         * @param {Number} value   value which has to be set on the slider
         * @param {Object} props   object which contains additional parameters
         *
         * @return {Object}  jQuery Component Object
         */
        this.setValue = function(value, props) {
            setValue(value, props);

            return this;
        };

        /**
         * Returns value which is currently set in the slider
         *
         * @return {Number}
         */
        this.getValue = function() {
            return settings.value;
        };

        this.getMin = function() {
            return settings.min;
        };

        this.setMax = function(value) {
            settings.max = value;

            setValue(settings.value);

            return this;
        };

        this.getMax = function() {
            return settings.max;
        };

        this.getStep = function() {
            return getStepValue();
        };

        this.stepUp = function() {
            setValue(settings.value + getStepValue());

            return this;
        };

        this.stepDown = function() {
            setValue(settings.value - getStepValue());

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Unbind all events
            unbindEvents(true);
        };

        //Initialization
        (function() {
            loadTemplate();
            setValue(settings.value);
        }());

        return this;
    };
}(jQuery));