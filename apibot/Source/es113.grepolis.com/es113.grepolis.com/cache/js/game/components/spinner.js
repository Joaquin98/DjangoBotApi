/* global us */

/**
 * This components represents an HTML input with two buttons which allows user
 * to increment or decrement the value by some amount which can be determined
 * as a 'step'. It also allows user to change the value directly in the input
 * field. The value can be limited by 'max' and 'min' settings
 *
 * @param params
 *    {Number|String} value   value of the spinner
 *    {Number|String} max     determines maximal value which can be stored in the component
 *    {Number|String} min     determines minimal value which can be stored in the component
 *    {Boolean} disabled      determines if component reacts on user's actions - its greyed out
 *    {Boolean} readonly      determines if component reacts on user's actions - its not greyed
 *    {String} type           determines how spinner will interpret values
 *        Possible values:
 *        - 'integer'   treats all values as integers
 *        - 'float'     treats all values as floats
 *        - 'time'      allows possibility to display values like '00:00:00'
 *    {String} template       the id (without #) of template which is already
 *                            in the document between
 *                            <script type="text/template" id="..." /> tag
 *                            or string which contains template
 *    {Number} tabindex       determines the HTML tabindex attribute for
 *                            spinner, which allows to switch between them with
 *                            TAB button in specific order
 *    {String} cid            helps to determinate the spinner, its something
 *                            like virtual id
 *    {Function} displayFunc  (optional) if given, convert the internal value before displaying it
 *                            using this function - it sets the spinner to 'readonly'
 *                            because most likely its 'getValue' can not be re-used as 'setValue'
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - sp:change:value    triggered when value was changed
 * - sp:change:max      triggered when max value was changed
 * - sp:change:step      triggered when step size was changed
 * - sp:click           triggered when spinner clicked
 *
 * Default HTML Node:
 * <div class="spinner"></div>
 *
 * ------------------
 * Example 1:
 * ------------------
 *
 * CM.register(context, 'spinner_name', $el.find('#sp_trading_demand').spinner({
 *     value : 0, step : 500, max : 3 * data.available_capacity, min : 0
 * }).on('sp:change:value', function(e, new_val, old_val, spinner) {
 *     //Do something when value of this spinner will change
 * }));
 *
 * ------------------
 * Example 2:
 * ------------------
 *
 * var spinner = $('#first_spinner').spinner({value : 100, max : 200});
 *     spinner.setValue(1000).incr(300);//1300
 *
 */
(function($) {
    'use strict';

    $.fn.spinner = function(params) {
        var _self = this,
            settings, type = (params || {}).type || 'integer';

        /**
         * Setting up default values
         */
        params = $.extend({
            template: 'tpl_spinner',
            disabled: false,
            readonly: false,
            tabindex: 1,
            cid: null,
            details: null,
            displayFunc: null
        }, params);

        if (type === 'integer' || type === 'float' || type === 'ratio') {
            settings = $.extend({
                value: 0,
                step: 500,
                max: Infinity,
                min: 0,
                type: type
            }, params);
        } else if (type === 'time') {
            settings = $.extend({
                value: '00:00:00',
                step: '00:30:00',
                max: '240:00:00',
                min: '00:00:00',
                type: 'time'
            }, params);
        }

        var $el = $(this),
            $input, $tpl;

        /**
         * Each type of values has to be differently parsed. This function will return
         * the current value stored in the spinner, or will return parsed value
         * if you specified it as an argument
         *
         * @param {Number|String} value   spinners value
         *
         * @return {Number|String}
         */
        function getValue(value) {
            switch (type) {
                case 'integer':
                    return value ? parseInt(value, 10) : settings.value;
                case 'float':
                    return value ? parseFloat(value) : settings.value;
                case 'time':
                    return value || settings.value || '00:00:00';
                case 'ratio':
                    return value || parseFloat(value) || settings.value;
            }
        }

        /**
         * Removes all bound events from component
         */
        function unbindEvents(destroy) {
            $el.off('.spinner');
            $input.off('.spinner');

            if (destroy) {
                $el.off('sp:change:value sp:change:max');
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $el.on('click.spinner', '.button_up', function() {
                if (settings.disabled || settings.readonly) {
                    return;
                }

                _self.stepUp();
            });

            $el.on('click.spinner', '.button_down', function() {
                if (settings.disabled || settings.readonly) {
                    return;
                }

                _self.stepDown();
            });

            $el.on('click.spinner', 'input', function() {
                $el.trigger('sp:click', [_self]);
                return false;
            });

            $el.on('updated:max', function( /*e, new_val, old_val*/ ) {
                _self.setValue(settings.value, {
                    silent: true
                });
            });

            $input.on('blur.spinner', function( /*e*/ ) {
                if (settings.disabled || settings.readonly) {
                    return;
                }

                _self.setValue($input.val(), {
                    force: true
                });
            });
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            $tpl = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();

            //Append template to main container
            $el.html(us.template($tpl, settings));

            //Prepare elements
            $input = $el.find('input').attr('tabindex', settings.tabindex);

            // Set the displayed value
            // if we use a display filter function that changes the value before displaying it
            // we deactivate user interaction with the component, to avoid interpreting formatted input
            if (settings.displayFunc) {
                $input.val(settings.displayFunc(settings.value));
                settings.readonly = true;
            } else if (settings.value !== settings.min) {
                $input.val(settings.value);
            }

            //Bind events
            bindEvents();
        }

        /**
         * Returns time-formatted value
         *
         * @param {Object} obj_date   Native Javascript Date object
         *
         * @return {String}
         */
        function formatTime(obj_date) {
            var day = obj_date.getDate(),
                hour = obj_date.getHours(),
                min = obj_date.getMinutes(),
                sec = obj_date.getSeconds();

            hour = (day - 1) * 24 + hour;

            return (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
        }

        /**
         * Multiply step value properly - depending on the step type
         *
         * @param {Number|String} value    the value to multiply
         * @param {Number} multiplier      multiplier value
         */
        function multiply(value, multiplier) {
            var time;

            if (typeof value === 'string') {
                value = value.split(':');
                time = new Date(null, null, 1,
                    parseInt(value[0], 10) * multiplier,
                    parseInt(value[1], 10) * multiplier,
                    parseInt(value[2], 10) * multiplier
                );

                return formatTime(time);
            } else {
                return value * multiplier;
            }
        }

        /**
         * This function is used to increment or decrement numbers or dates
         *
         * @param {Number|String} value   Value which has to be in/decremented
         * @param {Number|String} step    the amount we in/decrease the value
         * @param {Number} sign           -1 (decrementing) or 1 (incrementing)
         *
         * @return {Number|String}
         */
        function changeValue(value, step, sign) {
            var type = settings.type;

            if (type === 'integer') {
                return value + sign * step;
            } else if (type === 'float' || type === 'ratio') {
                //Preventing problem with float problem
                return Math.round((value + sign * step) * 100) / 100;
            } else if (type === 'time') {
                var t_value = (value || '').split(':'),
                    t_step = (step || '').split(':');

                //Prevent bad values @todo replace it later with regexp
                t_value = t_value.length !== 3 ? [0, 0, 0] : t_value;
                t_step = t_step.length !== 3 ? [0, 0, 0] : t_step;

                t_value = [parseInt(t_value[0], 10), parseInt(t_value[1], 10), parseInt(t_value[2], 10)];

                //This Date object will calculate seconds, minutes and hours.
                //if the amount of hours will be bigger than 24, then it will also
                //in/decrement the number of days
                var time = new Date(null, null, 1,
                    parseInt(t_value[0], 10) + sign * parseInt(t_step[0], 10),
                    parseInt(t_value[1], 10) + sign * parseInt(t_step[1], 10),
                    parseInt(t_value[2], 10) + sign * parseInt(t_step[2], 10)
                );

                return formatTime(time);
            } else {
                return value;
            }
        }

        /**
         * Checks if the value passed as an argument matches all conditions, and if not
         * strips the value which is more than 'max', or less than 'min'
         *
         * @param {Number|String} val   value which has to be checked
         *
         * @return {Number|String}
         */
        function checkConditions(val) {
            var type = settings.type,
                max = settings.max,
                min = settings.min;

            if (type === 'integer' || type === 'float' || type === 'ratio') {
                val = type === 'integer' ? parseInt(val, 10) : parseFloat(val);

                // parse could return NaN, in that case we reset the value to 0
                if (isNaN(val)) {
                    val = 0;
                }

                if (val > max) {
                    val = max;
                    $el.trigger('sp:adjust_to_max', [_self]);
                }

                if (val < min) {
                    val = min;
                }

                return val;
            } else if (type === 'time') {
                var t_max = (settings.max || '').split(':'),
                    t_min = (settings.min || '').split(':'),
                    t_val = (val || '').split(':');

                //Prevent bad values @todo replace it later with regexp
                t_val = t_val.length !== 3 ? [0, 0, 0] : t_val;

                //These values are negative
                var ms_max = Date.UTC(null, null, 1, t_max[0], t_max[1], t_max[2]),
                    ms_min = Date.UTC(null, null, 1, t_min[0], t_min[1], t_min[2]),
                    ms_val = Date.UTC(null, null, 1, t_val[0], t_val[1], t_val[2]),

                    obj_time = new Date(null, null, 1, t_val[0], t_val[1], t_val[2]);

                if (ms_val < ms_min) {
                    obj_time = new Date(null, null, 1, t_min[0], t_min[1], t_min[2]);
                }

                if (ms_val > ms_max) {
                    obj_time = new Date(null, null, 1, t_max[0], t_max[1], t_max[2]);
                    $el.trigger('sp:adjust_to_max', [_self]);
                }

                return formatTime(obj_time);
            } else {
                return val;
            }
        }

        /**
         * Disables or enables component, also adds 'disabled' class to the root node
         * so the component can be skinned and 'disabled' attribute on the input element
         *
         * @param {Boolean} bool   Determinates if component is enabled or not
         */
        function disable(bool) {
            settings.disabled = bool;

            if (bool) {
                $input.prop('disabled', true);
            } else {
                $input.prop('disabled', false);
            }

            $el.toggleClass('disabled', bool);
        }

        function readonly(bool) {
            settings.readonly = bool;

            if (bool) {
                $input.attr('readonly', 'true');

                // FF still shows a text cursor (workaround)
                $input.on("focus", function() {
                    this.blur();
                });
            } else {
                $input.prop('readonly', false);
                $input.off('focus');
            }



            $el.toggleClass('readonly', bool);
        }

        /**
         * Sets value of the spinner
         *
         * @param {Number|String} value   the value you want to put in the spinner
         *                                (it can be changed depends on the settings)
         * @param {Object} props          hash array which contains settings
         * Possible values:
         *    - {Boolean} force   Used to trigger the 'updated' event when value is
         *                        the same as previous one (normally, when user try
         *                        to insert the same value, nothing is changed)
         *    - {Boolean} silent  Used if you don't want to trigger the 'updated'
         *                        event
         *
         * @return {Object}  jQuery Component Object
         */
        this.setValue = function(value, props) {
            var force = props && props.force,
                silent = props && props.silent,
                val = force ? settings.value : getValue($input.val()),
                new_val = checkConditions(value),
                // if we have a display filter function, use it
                display_val = settings.displayFunc ? settings.displayFunc(new_val) : new_val;

            if (force === true || val !== new_val) {
                if (display_val === settings.min) {
                    display_val = '';
                }

                $input.val(display_val);

                settings.value = new_val;

                if (!silent) {
                    $el.trigger('sp:change:value', [new_val, val, _self]);
                }
            }

            return this;
        };

        /**
         * Returns value of the spinner
         *
         * @return {Number|String}
         */
        this.getValue = function() {
            return getValue();
        };

        /**
         * Sets the step size of the spinner
         *
         * @param {Number|String} value   new step size for inc/decr
         *
         * @return {Object}  jQuery Component Object
         */
        this.setStep = function(value) {
            var old_val = settings.step;

            if (old_val !== value) {
                settings.step = value;
                this.trigger('sp:change:step', [value, old_val, _self]);
            }

            return this;
        };

        /**
         * This function simulates pressing '+' button, and also allows to use
         * 'multiplier' to make multiple steps at once
         *
         * @param {Number} multiplier
         *
         * @return {Object}  jQuery Component Object
         */
        this.stepUp = function(multiplier) {
            var step = multiplier ? multiply(settings.step, parseInt(multiplier, 10)) : settings.step;

            this.setValue(changeValue(settings.value, step, 1));

            return this;
        };

        /**
         * This function simulates pressing '-' button, and also allows to use
         * 'multiplier' to make multiple steps at once
         *
         * @param {Number} multiplier
         *
         * @return {Object}  jQuery Component Object
         */
        this.stepDown = function(multiplier) {
            var step = multiplier ? multiply(settings.step, parseInt(multiplier, 10)) : settings.step;

            this.setValue(changeValue(settings.value, step, -1));

            return this;
        };

        /**
         * Returns time value as a float number
         *
         * Examples:
         * 00:30:00 becomes 0.5
         * 01:00:00 becomes 1
         *
         * @return {Number}
         */
        this.getTimeValueAsFloat = function() {
            var val = getValue().split(':'),
                hours = parseInt(val[0], 10),
                minutes = Math.round((val[1] / 60) * 100) / 100,
                seconds = Math.round((val[2] / 3600) * 1000) / 1000;

            return hours + minutes + seconds;
        };

        /**
         * Returns time value in seconds
         *
         * @return {Number}
         */
        this.getTimeValueAsSeconds = function() {
            var val = getValue().split(':'),
                hours = parseInt(val[0], 10) * 3600,
                minutes = parseInt(val[1], 10) * 60,
                seconds = parseInt(val[2], 10);

            return hours + minutes + seconds;
        };

        /**
         * Increases value of the spinner by 'value'
         *
         * @param {Number|String} value  amount which the value will be increased by
         *
         * @return {Object}  jQuery Component Object
         */
        this.incr = function(value) {
            var val = getValue($input.val());

            _self.setValue(changeValue(val, value, 1));

            return this;
        };

        /**
         * Decreases spinners value by 'value'
         *
         * @param {Number|String} value  amount which the value will be decreased by
         *
         * @return {Object}  jQuery Component Object
         */
        this.decr = function(value) {
            var val = getValue($input.val());

            _self.setValue(changeValue(val, value, -1));

            return this;
        };

        /**
         * Sets maximal value which can be choosen in spinner
         *
         * @param {Number|String} value   new maximal value which can be choosen
         *                                in the spinner
         *
         * @return {Object}  jQuery Component Object
         */
        this.setMax = function(value) {
            var old_val = settings.max;

            if (old_val !== value) {
                settings.max = value;
                this.trigger('sp:change:max', [value, old_val, _self]);
                if (this.getValue() > settings.max) {
                    this.setValue(settings.max);
                }
            }

            return this;
        };

        /**
         * return type of the spinner
         * @return {String}
         */
        this.getSpinnerType = function() {
            return settings.type;
        };

        /**
         * Returns maximal value which can be chosen in spinner
         *
         * @return {Number|String}   maximal value which can be chosen in the spinner
         */
        this.getMax = function() {
            return settings.max;
        };

        /**
         * Sets minimal value which can be chosen in spinner
         *
         * @param {Number|String} value   new minimal value which can be chosen
         *                                in the spinner
         * @return {Object}  jQuery Component Object
         */
        this.setMin = function(value) {
            settings.min = value;

            return this;
        };

        /**
         * Disables spinner
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);

            return this;
        };

        /**
         * Enables spinner
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);

            return this;
        };

        /**
         * Returns value stored in the 'cid'
         *
         * @return {Object|String|Number}
         */
        this.getCid = function() {
            return settings.cid;
        };

        /**
         * Returns id specified on the root node of the component
         *
         * @return {String}
         */
        this.getId = function() {
            return $el.attr('id');
        };

        /**
         * Sets cid for the spinner (it used to store some values)
         *
         * @param {Number|Object|String}
         */
        this.setCid = function(value) {
            settings.cid = value;
        };

        /**
         * Method can be used only when settings.type === 'time'
         */
        this.getTimeValues = function() {
            var value = settings.value.split(':'),
                obj_date = new Date(null, null, 1,
                    parseInt(value[0], 10),
                    parseInt(value[1], 10),
                    parseInt(value[2], 10)
                );

            return {
                hours: obj_date.getHours(),
                minutes: obj_date.getMinutes(),
                seconds: obj_date.getSeconds()
            };
        };

        /**
         * Method can be used only when settings.type === 'time'
         */
        this.getHours = function() {
            var value = settings.value.split(':'),
                obj_date = new Date(null, null, 1,
                    parseInt(value[0], 10),
                    parseInt(value[1], 10),
                    parseInt(value[2], 10)
                );

            return obj_date.originalGetHours();
        };

        /**
         * Method can be used only when settings.type === 'time'
         */
        this.getMinutes = function() {
            var value = settings.value.split(':'),
                obj_date = new Date(null, null, 1,
                    parseInt(value[0], 10),
                    parseInt(value[1], 10),
                    parseInt(value[2], 10)
                );

            return obj_date.originalGetMinutes();
        };

        /**
         * Method can be used only when settings.type === 'time'
         */
        this.getSeconds = function() {
            var value = settings.value.split(':'),
                obj_date = new Date(null, null, 1,
                    parseInt(value[0], 10),
                    parseInt(value[1], 10),
                    parseInt(value[2], 10)
                );

            return obj_date.originalGetSeconds();
        };

        this.getDetails = function() {
            return settings.details;
        };

        this.formatTime = function() {
            return formatTime.apply(this, arguments);
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

            disable(settings.disabled);
            readonly(settings.readonly);

            _self.setValue(settings.value);
        }());

        return this;
    };
}(jQuery));