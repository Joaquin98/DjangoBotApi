/*global CircularProgress, DateHelper, MousePopup, numberToLocaleString, Timestamp */

/**
 * Single Progressbar component mostly used to show the capacity (WW for example)
 *
 * @param {Object} params   Hash array contains settings
 *     {Number} value      determinates the currently displayed value in the progressbar
 *     {Number} max        determinates the maximal value which can be displayed
 *     {Number} min        determinates the minimal value which can be displayed
 *     {Number} extra      determinates the amount which will be added to the value
 *                         every time when the value is changed
 *     {String} position   'vertical' or 'horizontal', indicates in which way progressbar is resizing itself
 *     {String} caption    displays caption in the progressbar, for example 'Kapazitat'
 *     {Boolan} countdown  determinates if the value indicated by the progressbar will be counted down or not
 *
 *     {Boolean} reverse_progress	reverts the progressbar indicator; only for type: time;
 *
 *
 *     {String} type       determinates how progressbar will interprete values
 *         Possible values:
 *         - integer       displays values as numbers
 *         - time          displays values as a readable time
 *         - percentage    displays values as percentage of progress
 *         - round         displays progressbar as 'round-ish' element
 *         - circular
 *
 *     {String} template   the id (without #) of template which is already
 *                         in the document between
 *                         <script type="text/template" id="..." /> tag
 *                         or string which contains template
 *                         for 'round' type progressbar please use tpl_pb_round
 *
 *     {Boolean} liveprogress           determinates if progress will be updated live
 *     {Number} liveprogress_interval   determinates how often progress will be updated (graphics), default every 10 ticks of the countdown
 *     {Function} cdCondition           every tick countdown checks this condition and looks if can trigger 'cd:condition' event or not
 *     {Number} step_count				number of steps prepared in sprite of round progressbar
 *     {String} cid                     helps to determinate the button, its something like
 *                                      vitrual id, or you can store there some informtaions
 *     {Boolean} animate                determinaes if change of the progress will be animated
 *     {Boolean} prevent_overloading    as default 'value' in the progressbar can be higher than 'max'. In this case
 *                                      additional css class will be applied on the root node. To limit this behaviour
 *                                      set 'prevent_overloading' to true.
 *     {Boolean} show_overloading		determines if overloading css class will be applied when value is greater than max.
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - pb:change:value   triggered when value has been changed
 * - pb:change:extra   triggered when extra value has been changed
 * - pb:max:reached    triggered when max value is reached (not triggered during initialization)
 * - pb:cd:each        triggered every coutdown tick (if set)
 * - pb:cd:condition   triggered when coutdown condition is true (checked every tick)
 * - pb:cd:finish      triggered when countdown stopped ticking
 *
 *
 * ------------------
 * Example:
 * ------------------
 *
 * <div id="pb_trading_capacity" class="single-progressbar"></div>
 *
 * var pb_capacity = CM.register(context, 'progressbar_name', root.find('#ww_big_progressbar').singleProgressbar({
 *     'extra' : max_trade_capacity - free_trade_capacity,
 *     'max': max_trade_capacity,
 *     'caption': _('Capacity:')
 * }).on('pb:change:value', function(e, new_val, old_val) {
 *     //Do something when value has changed
 * }).on('pb:change:extra', function(e, new_val, old_val) {
 *     //Do something when extra value has changed
 * });
 */

(function($) {
    'use strict';

    $.fn.singleProgressbar = function(params) {
        var settings = $.extend({
            template: 'tpl_pb_single',
            position: 'horizontal', //'vertical' or 'horizontal'
            value: 0,
            min: 0,
            max: 0,
            extra: 0,
            caption: '',
            type: 'integer',
            countdown: false,
            countdown_settings: {
                display_days: false, //readableSeconds gets second argument which tells if hours should be converted to days
                timestamp_end: null, //keeps real timestamps to calculate values more acurate
                display: '' //represents the way how returned value is formated
            },
            format_locale: false, // uses number.toLocaleString() for grouping
            liveprogress: false,
            liveprogress_interval: 10,
            cdCondition: null,
            cid: {},
            animate: false,
            animate_settings: {
                duration: 2000
            },
            prevent_overloading: false,
            show_overloading: true,
            tooltips: {
                //idle : {template : null, data : null, styles : null},
                //disabled : {template : null, data : null, styles : null}
                //in_progress : {template : null, data : null, styles : null}
            },

            reverse_progress: false,
            parts: [],
            show_value: true,
            show_real_max: true,

            //Type 'time'
            real_max: null,
            clear_timer_if_zero: false,
            show_caption_if_zero: false,

            //Type 'round'
            step_count: 39,

            //Type 'circular'
            draw_settings: {
                start_angle: Math.PI * 9 / 8 - Math.PI / 2,
                end_angle: Math.PI * 23 / 8 - Math.PI / 2,
                start_color: 'rgb(89,209,251)',
                end_color: 'rgb(35,139,283)',
                line_thick: 4
            }
        }, params);

        var initialized = false;

        //References to concrete HTML nodes, to don't search in document every time
        //when they are needed
        var _self = this,
            $el = $(this),
            $tpl,
            $indicator, $caption, $amount_curr, $amount_max, $real_value, $real_max,
            countdown = null,
            tooltip;

        //Used to keep previous size of the indicator to avoid not necessary node updates
        var indicator_size = null;

        var circular_progress;

        // type 'circular'
        if (settings.type === 'circular') {
            circular_progress = new CircularProgress({
                element: $el.find('canvas')[0],
                max_value: settings.max,
                value: settings.value,
                parent: $el,
                draw_settings: settings.draw_settings
            });
        }

        var animation_in_progress = false;

        function bindTooltip() {
            var state = settings.disabled ? 'disabled' : (animation_in_progress ? 'in_progress' : 'idle'),
                tooltip_data = settings.tooltips[state];

            //Destroy previous tooltip if exist
            if (tooltip && tooltip.destroy) {
                //Destroy it
                tooltip.destroy();
            }

            if (!tooltip_data) {
                return;
            }

            if (typeof tooltip_data.template === 'function') {
                tooltip = new MousePopup(tooltip_data.template(tooltip_data.data), tooltip_data.styles);
                $el.mousePopup(tooltip);
            } else if (typeof tooltip_data.template === 'string') {
                tooltip = $el.tooltip(tooltip_data.template);
            } else {
                throw 'Template for tooltip needs to be a function or a string';
            }

        }

        function updateNode(type, value) {
            var $node;

            switch (type) {
                case 'real-value':
                    $node = $real_value;
                    break;
                case 'real-max':
                    $node = $real_max;
                    break;
                case 'value':
                    $node = $amount_curr;
                    break;
                case 'max':
                    $node = $amount_max;
                    break;
            }

            if (settings.format_locale) {
                value = numberToLocaleString(value);
            }

            if ($node.length) {
                $node.html(value);
            }
        }

        function updateIndicator(position_method, progress_size) {
            var progress = Math.floor(progress_size * 100);

            if (indicator_size !== progress) {
                $indicator[position_method](progress + '%');

                indicator_size = progress;
            }
        }

        /**
         * Helper function which indicates progress based on the value specified as
         * a parameter
         *
         * @param {Number} value   a value which have to be indicated in the progressbar
         */
        function updateProgress(value) {
            var max = settings.max,
                type = settings.type,
                position_method = settings.position === 'horizontal' ? 'width' : 'height',
                size = $el.find('.progress')[position_method](),
                step_size = settings.max / settings.step_count,
                animation_step = 0,
                $animate = $indicator.find('.js-animate'),
                total_value,
                factor, animation_settings = {},
                progress_size,
                real_max = settings.real_max,
                real_value;

            if (type === 'time') {
                if (settings.animate) {
                    throw 'This type doesn\'t support animation';
                }
                //if something will be wrong with it, check 'factor'
                //I think it should be done in the same way here
                if (max) {
                    progress_size = settings.reverse_progress ? (max - value) / max : (value / max);
                    real_value = parseInt(progress_size * real_max, 10);
                } else {
                    progress_size = settings.reverse_progress ? (real_max - value) / real_max : (value / real_max);
                    real_value = value;
                }

                updateNode('real-value', real_value);
                updateNode('real-max', real_max);

                if (max) {
                    value = Math.max(settings.min, Math.min(settings.max, value));

                    if (settings.clear_timer_if_zero) {
                        updateNode('value', value ? DateHelper.readableSeconds(value, settings.countdown_settings.display_days) : '');

                        if (!value && settings.show_caption_if_zero) {
                            $caption.text(settings.caption);
                        }
                    } else {
                        updateNode('value', DateHelper.readableSeconds(value, settings.countdown_settings.display_days));
                    }
                }

                updateIndicator(position_method, progress_size);
            } else if ((type === 'integer' || type === 'percentage') && !settings.countdown) {
                //settings.reverse_progress not supported

                total_value = value + settings.extra;
                factor = max > 0 ? total_value / max : Infinity;
                factor = factor > 1 ? 1 : factor;
                animation_settings[position_method] = factor * 100 + '%';

                $indicator.toggleClass('overloaded', total_value > max && settings.show_overloading);

                if ($indicator[position_method]() !== factor * size) {
                    if (settings.animate) {
                        animation_in_progress = true;

                        $el.trigger('pb:animation:start');
                        $el.addClass('pb_animation');

                        bindTooltip();

                        $indicator.animate(animation_settings, {
                            step: function(now, fx) {
                                animation_step += 1;
                                $el.trigger('pb:animation:step', [now, fx, animation_step]);
                            },
                            duration: settings.animate_settings.duration,
                            complete: function() {
                                $el.removeClass('pb_animation');
                                $el.trigger('pb:animation:complete', [animation_step]);

                                animation_in_progress = false;
                                bindTooltip();
                            }
                        }).css('overflow', 'visible');
                    } else {
                        updateIndicator(position_method, factor);
                    }
                }

                if (type === 'integer') {
                    updateNode('value', total_value);
                    updateNode('max', max);
                } else if (type === 'percentage') {
                    // value is multiplied by 100 before division to avoid floating point math issues. (a/b)*c == (a*c)/b
                    updateNode('value', Math.floor((max > 0 ? (total_value * 100) / max : 0)) + '%');
                }
            } else if (type === 'round') {
                //settings.reverse_progress not supported

                if (value > max) {
                    value = max;
                } else if (value < settings.value) {
                    $indicator.attr('class', 'indicator s_' + settings.step_count).delay(500).queue(function(next) {
                        $indicator.attr('class', 'indicator s_0');
                        next();
                    });
                }

                total_value = Math.floor(value / step_size);

                if (!settings.animate) {
                    $indicator.attr('class', 'indicator s_' + total_value);
                } else {
                    $animate.addClass('indicator s_' + total_value).fadeIn().fadeOut().fadeIn().fadeOut().fadeIn(function() {
                        $indicator.attr('class', 'indicator s_' + total_value);
                        $animate.fadeOut().removeClass('s_' + total_value);
                    });
                }
            } else if (type === 'circular') {
                //settings.reverse_progress not supported

                if (value > max) {
                    value = max;
                }

                circular_progress.setCurrentValue(value);
                //circular_progress.animate(100, 10000);
            }
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            if (countdown) {
                countdown.destroy();
            }

            if (destroy) {
                $el.off('pb:change:value pb:cd:finish');

                //Destroy tooltip if exist
                if (tooltip && tooltip.destroy) {
                    tooltip.destroy();
                }
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            //Update countdown if exist
            if (settings.countdown) {
                if (settings.value > 0) {
                    animation_in_progress = true;
                }

                countdown = $amount_curr.countdown2({
                    value: settings.value,
                    parent: $el,
                    condition: settings.cdCondition,
                    timestamp_start: settings.countdown_settings.timestamp_start, //it seems to be not used
                    timestamp_end: settings.countdown_settings.timestamp_end,
                    display: settings.countdown_settings.display
                });

                countdown.on('cd:each', function(e, seconds) {
                    $el.trigger('pb:cd:each', [seconds]);
                });

                countdown.on('cd:condition', function(e, seconds) {
                    $el.trigger('pb:cd:condition', [seconds]);
                });

                countdown.on('cd:finish', function(e, seconds) {
                    animation_in_progress = false;
                    bindTooltip();

                    $el.trigger('pb:cd:finish', [seconds]);
                });

                //Updating progress in the progressbar
                if (settings.liveprogress) {
                    countdown.setCondition(function(value) {
                        return parseInt(value, 10) % settings.liveprogress_interval === 0;
                    });

                    countdown.on('cd:condition.internal', function(e, seconds) {
                        if (settings.prevent_overloading) {
                            seconds = Math.max(settings.min, Math.min(settings.max, seconds));
                        }

                        updateProgress(seconds);
                    });
                }
            }

            bindTooltip();
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            if (settings.template !== 'internal') {
                $tpl = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();

                //Append template to main container
                $el.html(us.template($tpl, settings));
            }

            //its better to use more unique class names to indicates important
            //elements in the component, so I need to create a fallback for old solution
            $amount_curr = $el.find('.js-value');
            $indicator = $el.find('.js-indicator');
            $caption = $el.find('.js-caption');
            $amount_max = $el.find('.js-max');
            //I don't like what I have done below, but I don't have a time now
            $real_value = $el.find('.js-real-value');
            $real_max = $el.find('.js-real-max');

            if (!$amount_curr.length) {
                $amount_curr = $el.find('.curr');
            }

            if (!$indicator.length) {
                $indicator = $el.find('.indicator');
            }

            if (!$caption.length) {
                $caption = $el.find('.text');
            }

            if (!$amount_max.length) {
                $amount_max = $el.find('.max');
            }
        }

        /**
         * Shows the progress depends on the value specified as an argument
         *
         * @param {Number} value   the current value which should be displayed on
         *                         the progressbar (time is also represented as a number)
         */
        function showProgress(value) {
            if (settings.prevent_overloading) {
                value = Math.min(settings.max, value);
            }

            //Actualize countdown
            if (countdown) {
                countdown.setValue(value);
            }

            //Trigger the change event
            $el.trigger('pb:change:value', [value, settings.value, _self]);

            if (initialized && value >= settings.max) {
                $el.trigger('pb:max:reached', [value, settings.value, _self]);
            }

            //Save the value
            settings.value = value;

            bindEvents();

            //Update progress
            updateProgress(value);
        }

        /**
         * Updates data in tooltips
         * @method updateTooltipData
         * @chainable
         *
         * @param {String} state   tooltip state ('idle', 'disabled', 'in_progress')
         * @param {Object} data    object with data
         */
        this.updateTooltipData = function(state, data) {
            var tooltip_data = settings.tooltips[state].data,
                data_id;

            for (data_id in data) {
                if (data.hasOwnProperty(data_id)) {
                    tooltip_data[data_id] = data[data_id];
                }
            }

            //Recreate tooltip
            bindTooltip();

            return this;
        };

        this.setAnimate = function(value) {
            settings.animate = value;

            return this;
        };

        /**
         * Sets value of the progressbar
         *
         * @param {Number} value   determinates value which will be displayed on
         *                         the progressbar (time is also represented
         *                         as a number)
         */
        this.setValue = function(value) {
            showProgress(value);

            return this;
        };

        this.setRealValue = function(real_value) {
            var max = settings.max,
                real_max = settings.real_max,
                value;

            if (max) {
                if (settings.reverse_progress) {
                    value = max - ((real_value * max) / real_max);
                } else {
                    value = (real_value * max) / real_max;
                }
            } else {
                if (settings.reverse_progress) {
                    value = real_max - real_value;
                } else {
                    value = real_value;
                }
            }

            showProgress(value);

            $el.trigger('pb:change:realvalue', [_self, real_value, value]);

            return this;
        };

        /**
         * Get value of the progressbar
         */
        this.getValue = function() {
            return settings.value;
        };

        /**
         * Returns countdown value if exists
         *
         * @return {Number|null}
         */
        this.getCountdownValue = function() {
            return countdown ? countdown.getValue() : null;
        };

        /**
         * Set caption for component
         *
         * @param {String} caption
         * @returns {Object} jQuery Component Object
         */
        this.setCaption = function(caption) {
            settings.caption = caption;
            $el.find('.caption .text').text(caption);
            return this;
        };

        /**
         * Set visibility for values container containing current value and max
         *
         * @param {Boolean} show_value
         * @returns {Object} jQuery Component Object
         */
        this.setShowValue = function(show_value) {
            settings.show_value = show_value;
            $el.find('.value_container').toggleClass('hidden', !show_value);

            return this;
        };

        /**
         * Sets maximal value of the progressbar
         *
         * @param {Number} value   determinates the maximal value which can be
         *                         indicated on the progressbar
         * @param {Object} props   hash array which contains settings
         * Possible values:
         *    - {Boolean} 'silent'  used if you don't want to refresh the progressbar
         *
         * @return {Object}  jQuery Component Object
         */
        this.setMax = function(value, props) {
            var silent = props && props.silent;

            settings.max = value;

            if (typeof circular_progress !== 'undefined') {
                circular_progress.setMax(value, {
                    silent: silent
                });
            }

            if (!silent) {
                showProgress(settings.value);
            }

            return this;
        };

        /**
         * Returns maximal value which can be indicated in the progressbar
         *
         * @return {Number}
         */
        this.getMax = function() {
            return settings.max;
        };

        this.getMin = function() {
            return settings.min;
        };

        this.setRealMax = function(value, props) {
            var silent = props && props.silent;

            settings.real_max = value;

            if (!silent) {
                showProgress(settings.value);
            }

            return this;
        };

        /**
         * Determinates if change of the progress has to be indicated with animation
         *
         * @return {Object}  jQuery Component Object
         */
        this.setAnimate = function(value) {
            settings.animate = value;

            return this;
        };

        /**
         * Returns information if 'animate' setting is true or false
         *
         * @return {Boolean}
         */
        this.getAnimate = function() {
            return settings.animate;
        };

        /**
         * Determinates if the progress is running reversed
         *
         * @return {Object}  jQuery Component Object
         */
        this.setReverseProgress = function(value) {
            settings.reverse_progress = value;

            return this;
        };

        /**
         * Returns information if 'reverse_progress' setting is true or false
         *
         * @return {Boolean}
         */
        this.getReverseProgress = function() {
            return settings.reverse_progress;
        };

        /**
         * Determinates if progress will be updated live
         *
         * @return {Object}  jQuery Component Object
         */
        this.setLiveprogress = function(value) {
            settings.liveprogress = value;
            bindEvents();

            return this;
        };

        /**
         * Returns information if progress will be updated live
         *
         * @return {Boolean}
         */
        this.getLiveprogress = function() {
            return settings.liveprogress;
        };

        /**
         * Increases value indicated by progressbar
         *
         * @param {Number} value   amount which will increase the current value
         *
         * @return {Object}  jQuery Component Object
         */
        this.incr = function(value) {
            showProgress(settings.value + parseInt(value, 10));

            return this;
        };

        /**
         * Decreases value indicated by progressbar
         *
         * @param {Number} value   amount which will decrease the current value
         *
         * @return {Object}  jQuery Component Object
         */
        this.decr = function(value) {
            showProgress(settings.value - parseInt(value, 10));

            return this;
        };

        /**
         * Changes 'extra' by value
         *
         * @param {Number} value   amount which will in/decrease the 'extra' value
         *
         * @return {Object}  jQuery Component Object
         */
        this.changeExtraBy = function(value) {
            var new_val = settings.extra + parseInt(value, 10),
                old_val = settings.extra;

            if (new_val !== old_val) {
                settings.extra = new_val;
                showProgress(settings.value);
                $el.trigger('pb:change:extra', [new_val, old_val]);
            }

            return this;
        };

        /**
         * Sets new 'extra' value
         *
         * @param {Number} value   number which represents value which constant, and
         *                         is a part of the progress
         *
         * @return {Object}  jQuery Component Object
         */
        this.setExtra = function(value) {
            var new_val = parseInt(value, 10),
                old_val = settings.extra;

            if (new_val !== old_val) {
                settings.extra = new_val;
                showProgress(settings.value);
                $el.trigger('pb:change:extra', [new_val, old_val]);
            }

            return this;
        };

        this.setShowOverloading = function(value) {
            settings.show_overloading = value;
            updateProgress(settings.value);

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
         * Returns the remaining seconds until the progress will be completed
         *
         * @return {Integer}  remaining seconds
         */
        this.getRemainingValue = function() {
            return settings.reverse_progress ? settings.value : settings.max - settings.value;
        };

        /**
         * Returns the point in time where the progress will be completed nicely formatted
         *
         * @return {String}  a string showing the date and time or using 'today/tomorrow at ...''
         */
        this.getEndDate = function() {
            var future_date = Timestamp.now() + this.getRemainingValue();
            return DateHelper.formatDateTimeNice(future_date, false);
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            unbindEvents(true);
        };

        //Initialization
        (function() {
            loadTemplate();

            if (!settings.show_caption_if_zero ||
                (settings.show_caption_if_zero && parseInt(settings.value, 10) === 0)) {

                $caption.text(settings.caption);
            }

            showProgress(settings.value);

            initialized = true;
        }());

        return this;
    };
}(jQuery));