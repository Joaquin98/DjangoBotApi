/*global jQuery */
/**
 * slider spinner widget
 *
 * @param params
 *   {String} name                  the name for setting classes to the DOM elements
 *   {String} template              the id (without #) of template which is already
 *                                  in the document between
 *                                  <script type="text/template" id="..." /> tag
 *                                  or string which contains template
 *   {String} type                  determinates how spinner will interprete values
 *                                  Possible values:
 *                                      - 'integer'   treats all values as intergers
 *                                      - 'float'     treats all values as floats
 *                                      - 'time'      allows possibility to display values like '00:00:00'
 *   {Boolean} readonly             determinates if component reacts on user's actions - its not greyed
 *   {Number} min                   determinates minimal value which can be set in slider and spinner
 *   {Number} max                   determinates maximal value which can be set in slider and spinner
 *   {Number} value                 determinates current value which is indicated by slider and spinner
 *   {Number|Function} step         determinates value steps, for example if min = 0, max = 10, step = 2, then
 *                                  user will be able to set only following values:
 *                                  0, 2, 4, 6, 8, 10
 *   {Boolean} snap                 determinates if slider have to point exact values (user have a feeling of jumps during sliding)
 *   {Function} displayFunc         (optional) if given, convert the internal value before displaying it
 *                                  using this function - it sets the spinner to 'readonly'
 *                                  because most likely its 'getValue' can not be re-used as 'setValue'
 *   {Function} callback            called when updating and resync of the spinner and slider is needed
 *   {Function|String} tooltip      for setting tooltips to the slider and/or spinner
 *   {Function}mouseValueChangeFunc (optional) only if there is a need to define a different calculating of the value on mouse change for the slider
 *
 * @return {Object}  jQuery Component Object
 *
 * This widget as a combination of the grepoSlider widget and the spinner component. It also contains the needed button components.
 *
 * ------------------
 * How to use it:
 * ------------------
 * Example 1:
 *
 * this.registerComponent('trade_ratio', this.$el.find('.trade_ratio_wrapper').sliderSpinner({
				name: 'ratio',
				callback: function () {
					this.controller.onFiltersChanged();
				}.bind(this),
				template : 'tpl_spinner_slider',
				value : value,
				step : 1,
				max : 14,
				min : -14,
				type : 'ratio',
				readonly: true,
				snap: true,
				displayFunc : function(value) {
					var ratio = this._sliderRatioToFractionRatio(value);
					return window.readableRatio(1/ratio);
				}.bind(this),
				tooltip: this.l10n.ratio_filter
			}));
 *
 * Example 2:
 *
 * this.registerComponent('trade_duration', this.$el.find('.trade_duration_wrapper').sliderSpinner({
				name: 'duration',
				callback: function () {
					this.controller.onFiltersChanged();
				}.bind(this),
				template: 'tpl_spinner_slider',
				value : duration_value,
				step:  function (elem, value) {
					return this.getSliderStepByValue(value);
				}.bind(this),
				max: 172800,
				min: 1800,
				type: 'time',
				mouseValueChangeFunc: function(min, max, step_nr, step) {
					return this.getNewValueChangedByMouse(min, max, step_nr, step);
				}.bind(this),
				readonly: true,
				tooltip: this.l10n.duration_filter
			}));
 */



(function($) {
    'use strict';

    var DateHelper = require('helpers/date');

    $.fn.sliderSpinner = function(params) {
        var settings = $.extend({

            }, params),
            $el = $(this),
            default_value = settings.value,
            shown = false,
            dropdown_layer = $el.find('.dropdown_layer' + '.' + settings.name),
            old_value = default_value, // a saved value (saved during open up) for cancel action
            new_value = default_value, // set current value of the slider
            spinner = null,
            slider = null,
            btn = null,
            accept_btn = null;

        /**
         * hide the dropdown without changing the value of the spinner
         */
        function cancelAndHide() {
            var val;
            dropdown_layer.hide().off('click');
            dropdown_layer.find('.dropdown_' + settings.name).hide();
            shown = false;
            if (spinner.getSpinnerType() === 'time') {
                val = DateHelper.readableSeconds(old_value);
            } else {
                val = old_value;
            }
            spinner.setValue(val);
            new_value = old_value;
        }

        /**
         * hide the dropdown and save the new value to the spinner
         */
        function saveAndHide() {
            var val;
            dropdown_layer.hide().off('click');
            dropdown_layer.find('.dropdown_' + settings.name).hide();
            shown = false;
            // save and call success
            if (spinner.getSpinnerType() === 'time') {
                val = DateHelper.readableSeconds(new_value);
            } else {
                val = new_value;
            }
            spinner.setValue(val);
            settings.callback();
        }

        /**
         * show the dropdown with the correct spinner and slider value
         */
        function clickHandler() {
            if (!shown) {
                shown = true;
                if (spinner.getSpinnerType() === 'time') {
                    old_value = spinner.getTimeValueAsSeconds();
                } else {
                    old_value = spinner.getValue();
                }
                dropdown_layer.show().on('mousedown', function(e) {
                    if (e.target === dropdown_layer[0]) {
                        cancelAndHide();
                    }
                    return false;
                });
                dropdown_layer.find('.dropdown_' + settings.name).show();
                slider.setValue(old_value);
            } else {
                cancelAndHide();
            }
        }

        /**
         * the format of the value should be different for duration - should be shown as HH:mm:ss
         * @param val
         * @returns val
         */
        function getFormatValue(val) {
            if (settings.type === 'time') {
                return DateHelper.readableSeconds(val);
            } else {
                return val;
            }
        }

        this.setValue = function(value, silent) {
            spinner.setValue(value, !!silent);
        };

        this.getValue = function() {
            return spinner.getValue();
        };

        this.getTimeValueAsSeconds = function() {
            return spinner.getTimeValueAsSeconds();
        };

        this.formatTime = function(timeformat) {
            return spinner.formatTime(timeformat);
        };

        this.destroy = function() {
            spinner.destroy();
            btn.destroy();
            slider.destroy();
            accept_btn.destroy();
        };

        //Initialize
        (function() {
            spinner = $el.find('.spinner').spinner({
                template: settings.template,
                value: getFormatValue(settings.value),
                step: getFormatValue(settings.step),
                max: getFormatValue(settings.max),
                min: getFormatValue(settings.min),
                type: settings.type,
                readonly: settings.readonly,
                snap: settings.snap,
                displayFunc: settings.displayFunc
            });

            btn = spinner.find('.btn_dropdown').button({});

            if (settings.tooltip) {
                spinner.find('.body').tooltip(settings.tooltip);
            }

            slider = $el.find('.slider').grepoSlider({
                max: settings.max,
                min: settings.min,
                step: settings.step,
                value: settings.value,
                snap: settings.snap,
                mouseValueChangeFunc: settings.mouseValueChangeFunc,
                disabled: false
            }).on('sl:change:value', function(e, _sl, value, old_value, stopPos) {
                // this works around a bug that the slider / spinner jumps to 1:1 because for some reason the spinner
                // interprets 'null' or 'undefined' as 0 which leads the ratio to be 1:1
                // this only happens when dragging the slider to the far left
                if (value === 0 && old_value === -14) {
                    return;
                }

                new_value = value;
                if (spinner.getSpinnerType() === 'time') {
                    value = DateHelper.readableSeconds(value);
                }
                spinner.setValue(value);
            });

            spinner.on('sp:click', clickHandler);

            btn.on('btn:click', clickHandler);

            accept_btn = dropdown_layer.find('.button').button({
                template: 'tpl_emptybutton'
            }).on('btn:click', saveAndHide);

        }());

        return this;
    };
}(jQuery));