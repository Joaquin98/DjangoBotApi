/*global jQuery */
/**
 * This component creates the color matrix for the color picker. It contains two parts,
 * the first part are the main colors and the second part is the 6x6 color matrix depending on the selected main color.
 * Clicking on the main colors will change the 6x6 color matrix. For example if the user clicks on the blue color
 * the 6x6 color matrix will be filled by a blue color range.
 * This component is mostly used as a part of the color picker widget, but can also be used by itself.
 * The component fires customised events.
 *
 * @param params
 *     {String} template    the id (without #) of template which is already
 *							in the document between
 *							<script type="text/template" id="..." /> tag
 *							or string which contains template
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - cs:change:value       fired when a new color value is set
 *
 * -----------------------------------
 * How to use this component example:
 * -----------------------------------
 *
 * var cs = CM.register(context, 'color_selector', $el.find('.color_selector").color_selector({}).on('cs:change:value', function(e, new_value) {
				//do something
			}));
 *
 */
(function($) {
    'use strict';

    $.fn.color_selector = function(params) {
        var settings = $.extend({
            template: 'tpl_color_selector',
            color: null
        }, params);

        var _self = this,
            $el = $(this),
            $tpl, color_value;

        /**
         * Removes all binded events from component
         *
         * @param {Boolean} destroy   determinates if the component is being currently destroyed
         */
        function unbindEvents(destroy) {
            $el.find('.color_picker_colors').off('click', 'div');
            $el.find('.color_picker_tones').off('click', 'div');

            if (destroy) {
                $el.off('cs:change:value');
            }
        }

        /**
         * Remove selection square from color selection field
         */
        function clearSelection() {
            if (_self.previous) {
                var prev = _self.previous.style;
                prev.border = '';
                prev.width = '';
                prev.height = '';
                prev.borderTop = '1px solid #000';
                prev.borderLeft = '1px solid #000';
            }
        }

        /**
         * Set new color value and trigger change event
         *
         * @param {String} color
         */
        function setColorValue(color) {
            color_value = color;
            $el.trigger('cs:change:value', [color_value, settings.value, _self]);
        }

        /**
         * Converts a color string ('#fb0', '#FFBB00', 'rgb(255,127,0)') to an rgb number array
         *
         * @param {string} colorString
         */
        function getColorArrayFromString(colorString) {
            var rgb = [0, 0, 0];
            //expand color string to full hex format #0f0 -> #00ff00
            if (colorString.length === 4 && colorString.substr(0, 1) === '#') {
                colorString = '#' + colorString.substr(1, 1) + colorString.substr(1, 1) + colorString.substr(2, 1) + colorString.substr(2, 1) + colorString.substr(3, 1) + colorString.substr(3, 1);

                //convert hex 2 decimal format
                rgb[0] = parseInt(colorString.substr(1, 2), 16);
                rgb[1] = parseInt(colorString.substr(3, 2), 16);
                rgb[2] = parseInt(colorString.substr(5, 2), 16);
            } else if (colorString.substr(0, 1) === '#') {
                rgb[0] = parseInt(colorString.substr(1, 2), 16);
                rgb[1] = parseInt(colorString.substr(3, 2), 16);
                rgb[2] = parseInt(colorString.substr(5, 2), 16);
            } else {
                rgb = colorString.match(/\d+/g);
                rgb = [parseInt(rgb[0], 10), parseInt(rgb[1], 10), parseInt(rgb[2], 10)];
            }
            return rgb;
        }

        /**
         * Gets the base color of the rgb value to use for the range. If rgb is not
         * in any defined range, or is greyscale, will return red.
         * @param {Array} rgb
         */
        function getBaseColor(rgb) {
            if (rgb[0] !== rgb[1] && rgb[0] !== rgb[2] && rgb[1] !== rgb[2]) {
                // color was not in any range, default to red range
                return [255, 0, 0];
            }

            var min = 255,
                max = 0;

            us.each(rgb, function(value) {
                min = value < min ? value : min;
                max = value > max ? value : max;
            });

            if (min === max) {
                // rgb was greyscale, default to red range
                return [255, 0, 0];
            }

            us.each(rgb, function(value, index) {
                rgb[index] = value === min ? 0 : 255;
            });

            return rgb;
        }

        /**
         * Get Hex value from rgb
         * @param {Array} color
         * @returns {string}
         */
        function getHexValueOfColor(color) {
            var rr = color[0].toString(16),
                gg = color[1].toString(16),
                bb = color[2].toString(16);

            rr = rr.length < 2 ? '0' + rr : rr;
            gg = gg.length < 2 ? '0' + gg : gg;
            bb = bb.length < 2 ? '0' + bb : bb;

            return (rr + gg + bb).toUpperCase();
        }

        /**
         * Get hex color from element. Calculate the rgb value from the hex value and set the new color.
         * @param {Object} event
         */
        function chooseColor(event) {
            clearSelection();

            //if no background color is set, just ignore click event
            if (event.target.style.backgroundColor === '') {
                return;
            }

            _self.previous = event.target;
            _self.saved_style = {
                border: event.target.style.border,
                width: event.target.style.width,
                height: event.target.style.height
            };
            event.target.style.border = '2px solid #fff';
            event.target.style.width = '13px';
            event.target.style.height = '13px';

            var str = event.target.style.backgroundColor,
                hex = str.charAt(0) === '#',
                // opera fix ...
                rgb = hex ? str.match(/\w{2}/g) : str.match(/\d+/g),
                radix = (hex ? 16 : 10),
                i = rgb.length;

            while (i--) {
                rgb[i] = parseInt(rgb[i], radix);
            }

            var color = getHexValueOfColor(rgb);

            setColorValue(color);
        }

        /**
         * Callback function called when user picks a main color
         * @param {Array} color
         */
        function setColors(color) {
            var x = 0,
                y = 0;
            $el.find('.color_picker_tones').children('div').each(function(index, child) {
                var xx = x++ % 6,
                    yy = xx === 5 ? y++ : y,
                    light;

                xx /= 6;
                yy /= 6;

                xx = Math.sqrt(xx);
                //0 - 255
                light = Math.max(0, 255 - 127 * yy);

                var r = Math.floor(Math.max(0, Math.min(255, (color[0] * yy - 255 * (xx)) + light)));
                var g = Math.floor(Math.max(0, Math.min(255, (color[1] * yy - 255 * (xx)) + light)));
                var b = Math.floor(Math.max(0, Math.min(255, (color[2] * yy - 255 * (xx)) + light)));

                child.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
            });
        }

        /**
         * Create color ranges from one color
         */
        function setNewColorRange(event) {
            var bg_color = event.target.style.backgroundColor;
            var rgb = getColorArrayFromString(bg_color);
            setColors(rgb);
            clearSelection();

            var color = getHexValueOfColor(rgb);
            setColorValue(color);
        }

        /**
         * Bind all events
         */
        function bindEvents() {
            unbindEvents(false);

            $el.find('.color_picker_colors').on('click', 'div', setNewColorRange);
            $el.find('.color_picker_tones').on('click', 'div', chooseColor);
        }
        /**
         * render template
         */
        function render() {
            $tpl = $('#' + settings.template).html();
            $el.html(us.template($tpl, {}));
            bindEvents();
        }

        /**
         * Returns the rgb current color value
         * @returns {Array} color_value
         */
        this.getValue = function() {
            return color_value;
        };

        /**
         * Set the rgb color value
         * @param {String} color
         */
        this.setValue = function(color) {
            setColorValue(color);
        };

        /**
         * Call private clearSelection method to remove selection square from color selection field
         */
        this.clearSelection = function() {
            clearSelection();
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
            var rgb = getColorArrayFromString(settings.color),
                baseColor = getBaseColor(rgb);

            render();
            setColors(baseColor);
        }());

        return this;
    };
}(jQuery));