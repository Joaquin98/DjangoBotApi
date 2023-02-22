/**
 * Progressbar component which contains 3 indicators inside, so it's possible
 * to show 3 values on one progressbar (look on the "Send resources to WW window")
 *
 * @param {Object} params
 *     {Number} value    determinates the value of the first indicator
 *     {Number} value2   determinates the value of the second indicator
 *     {Number} value3   determinates the value of the third indicator
 *     {Number} max      determinates the max value which can be displayed
 *                       in the progressbar, sum of these 3 values is bigger
 *                       than max, the "overloaded" class is set on the main
 *                       container
 *     {String} template   the id (without #) of template which is already
 *						   in the document between
 *						   <script type="text/template" id="..." /> tag
 *						   or string which contains template
 *	   {String} cid      helps to determinate the button, its something like
 *						 vitrual id, or you can store there some informtaions
 *
 * @return {Object}  jQuery Component Object
 */

(function($) {
    "use strict";

    $.fn.progressbar = function(params) {
        var settings = $.extend({
            value: 0,
            value2: 0,
            value3: 0,
            max: 0,
            template: 'tpl_pb_tripple',
            cid: {}
        }, params);

        //jQuery HTML elemements
        var $el = $(this),
            $tpl,
            $progress, $indicator, $indicator2, $indicator3, $amount_curr,
            $amount_curr2, $amount_curr3, $amount_max, width;

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            $tpl = /^</.test(settings.template) ? settings.template : $("#" + settings.template).html();

            //Append template to main container
            $el.html(us.template($tpl, settings));

            $progress = $el.find('.progress');
            $indicator = $el.find('.indicator');
            $indicator2 = $el.find('.indicator2');
            $indicator3 = $el.find('.indicator3');
            $amount_curr = $el.find('.curr');
            $amount_curr2 = $el.find('.curr2');
            $amount_curr3 = $el.find('.curr3');
            $amount_max = $el.find('.max');
            width = $progress.width();
        }

        /**
         * Shows the progress depends on the values specified as arguments
         *
         * @param {Number} value    the value which should be displayed in first indicator
         * @param {Number} value2   the value which should be displayed in second indicator
         * @param {Number} value3   the value which should be displayed in third indicator
         */
        function showProgress(value, value2, value3) {
            if (value === null) {
                value = settings.value;
            }
            if (value2 === null) {
                value2 = settings.value2;
            }
            if (value3 === null) {
                value3 = settings.value3;
            }

            value = parseInt(value || 0, 10);
            value2 = parseInt(value2 || 0, 10);
            value3 = parseInt(value3 || 0, 10);

            var max = settings.max,
                w1 = (value / max) * width,
                w2 = (value2 / max) * width,
                w3 = (value3 / max) * width,
                start = 0,
                total_value = value + value2 + value3;

            //Add class if value is bigger than max
            $progress[total_value > max ? 'addClass' : 'removeClass']('overloaded');

            //Update indicators
            $indicator.css('left', start).width(w1);
            $indicator2.css('left', start += w1).width(w2);
            $indicator3.css('left', start += w2).width(w3);

            //Update captions
            $amount_curr.text(value);
            $amount_curr2.text(value2 > 0 ? ' + ' + value2 : '');
            $amount_curr3.text(value3 > 0 ? ' + ' + value3 : '');
            $amount_max.text(max);

            //Save values
            settings.value = value;
            settings.value2 = value2;
            settings.value3 = value3;
        }

        /**
         * Sets value of the progressbar. It's not necessary to specify all of them
         * the missing ones will be skipped (the current value will be taken)
         *
         * @param {Number} [value]    value for first indicator
         * @param {Number} [value2]   value for second indicator
         * @param {Number} [value3]   value for third indicator
         */
        this.setValue = function(value, value2, value3) {
            showProgress(value, value2, value3);

            return this;
        };

        /**
         * Returns value for specific indicator
         *
         * @param {String} type   indicator type
         * Possible values:
         *     - 'value'    value of the first indicator
         *     - 'value2'   value of the second indicator
         *     - 'value3'   value of the third indicator
         *
         * @return {Number}
         */
        this.getValue = function(type) {
            return settings[type];
        };

        /**
         * Changes specific indicators value by amount given in the param
         *
         * @param {String} type   indicator type
         * Possible values:
         *     - value    value of the first indicator
         *     - value2   value of the second indicator
         *     - value3   value of the third indicator
         *
         * @param {Number} value   the value which will be substraced or added to the
         *                         current one.
         */
        this.changeValueBy = function(type, value) {
            var val = type === 'value' ? settings.value + value : settings.value,
                val2 = type === 'value2' ? settings.value2 + value : settings.value2,
                val3 = type === 'value3' ? settings.value3 + value : settings.value3;

            showProgress(val, val2, val3);
        };

        /**
         * Returns value stored in the "cid"
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
            return $el.attr("id");
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //There is nothing to unbind
        };

        //Initialization
        (function() {
            loadTemplate();

            showProgress(settings.value, settings.value2, settings.value3);
        }());

        return this;
    };
}(jQuery));