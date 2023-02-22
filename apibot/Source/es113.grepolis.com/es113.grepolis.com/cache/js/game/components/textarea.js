/*globals us */

/**
 * Textarea component extends functionality of the native <textarea>, provides possibility to
 * check string specified by user and show proper error message if something is not right
 *
 * @param params
 *     {String} value        represents <textarea> value
 *     {Number} minlength    determinates minimal number of characters which should be specified (not used when regexp is defined)
 *     {Number} maxlength    determinates maximal number of characters which should be specified (not used when regexp is defined)
 *     {String} regexp       regular expression which is used to check if string specified in the textarea is correct
 *     {String} invalidmsg   a error message  string which is loaded to the HTMLElement (.js-txta-error-msg) which is a child of the root Textarea node
 *     {String} template     the id (without #) of template which is already in the document between
 *                           <script type="text/template" id="..." /> tag or string which contains template
 *     {Boolean} disabled    determinates if user can select/add value or not
 *
 * Component events:
 * - txta:change:value   triggered when user typed some value
 *
 * ------------------
 * Example:
 * ------------------
 * CM.register(context, 'txta_message', $('.txta_message').textarea({
 *     value : 'Some text', maxlength : 160, invalidmsg : 'Message is too long'
 * }));
 */

(function($, w) {
    'use strict';

    $.fn.textarea = function(params) {
        var settings = $.extend({
            value: '',
            minlength: 0,
            maxlength: Infinity,
            regexp: '',
            invalidmsg: '',
            template: 'tpl_textarea',
            disabled: false,
            tabindex: 1,
            cols: null,
            rows: null
        }, params);

        var _self = this,
            $el = $(this),
            $tpl, $textarea, $invalidmsg;

        /**
         * Tests <textarea> value against regular expression or number of allowed characters.
         */
        function testValue() {
            var len = $textarea.val().length,
                //If regular expression is specified, then don't check anything else
                error = settings.regexp ? !(new RegExp(settings.regexp).test(settings.value)) :
                len > settings.maxlength || len < settings.minlength;

            $el.toggleClass('textarea_error', error);
        }

        /**
         * Sets value to the textarea
         *
         * @param {String} value           value which have to be displayed in component
         * @param {Boolean} dont_update    determinates if the textarea HTMLElement value has to be updated or not
         */
        function setValue(value, dont_update) {
            var prev_val = settings.value;

            if (value !== prev_val) {
                //Save value
                settings.value = value;

                //There is no sense to update value when this function is called by onkeyup event (its already up-to-date)
                if (!dont_update) {
                    $textarea.val(value);
                }

                testValue();

                $el.trigger('txta:change:value', [value, prev_val, _self]);
            }
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $el.off('.textarea');

            $textarea.off('.textarea');

            if (destroy) {
                $el.off('txta:change:value');
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            var live_typing_timer,
                _updateValue = function() {
                    setValue($textarea.val(), true);
                };

            unbindEvents();

            $textarea.on('input.textarea, keyup.textarea', function(e) {
                if (settings.disabled) {
                    return;
                }

                w.clearTimeout(live_typing_timer);

                live_typing_timer = w.setTimeout(_updateValue, 250);
            });

            $textarea.on("change", _updateValue);
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            if (settings.template === 'internal') {
                throw 'Textarea component doesn\'t support "internal" template';
            }

            $tpl = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();

            //Append template to main container
            $el.html(us.template($tpl, settings));

            $textarea = $el.find('textarea');
            $invalidmsg = $el.find('.js-txta-error-msg').html(settings.invalidmsg);

            $textarea.attr('cols', settings.cols);
            $textarea.attr('rows', settings.rows);

            if (!$textarea.length) {
                throw 'Textarea template have to contain <textarea> HTMLElement.';
            }

            $textarea.attr('tabindex', settings.tabindex);

            //Bind events
            bindEvents();
        }

        /**
         * Disables or enables component, also adds 'disabled' class to the root node
         * so the component can be skinned
         *
         * @param {Boolean}   bool   Determinates if component is enabled or not
         */
        function disable(bool) {
            settings.disabled = bool;

            if (bool) {
                $textarea.prop('disabled', true);
            } else {
                $textarea.prop('disabled', false);
            }

            $el.toggleClass('disabled', bool);
        }

        /**
         * Sets value of the textarea
         *
         * @param {String} value   the value you want to put into the textarea
         *
         * @return {Object}  jQuery Component Object
         */
        this.setValue = function(value) {
            setValue(value);

            return this;
        };

        /**
         * Returns value of the textarea
         *
         * @return {String}
         */
        this.getValue = function() {
            return settings.value;
        };

        /**
         * Disables textarea
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);

            return this;
        };

        /**
         * Enables textarea
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);

            return this;
        };

        this.focus = function() {
            $textarea.trigger("focus");

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Unbind all events
            unbindEvents(true);
        };

        //Initialize
        (function() {
            loadTemplate();

            //Disable if needed
            disable(settings.disabled);

            testValue();
        }());

        return this;
    };
}(jQuery, window));