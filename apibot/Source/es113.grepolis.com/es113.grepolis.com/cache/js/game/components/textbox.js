/*global us, Game, debug */

/**
 * Textbox component extends functionality of the native <input type='text' />
 *
 * @param params
 *     {String} value                 represents current value stored in the textbox
 *     {String} type                  determinates how textbox will threat the value which is stored inside it
 *         Possible values:
 *         - 'text'
 *         - 'number'
 *         - 'custom' - use it if you want to define your own rules in 'settings.regexp'
 *
 *     {Number} min                   option used only when 'type' is set to 'number', and determinayes the minimal value which user can put in the textbox
 *     {Number} max                   option used only when 'type' is set to 'number', and determinayes the maximal value which user can put in the textbox
 *     {String} placeholder           if given represents the input box default value
 *     {Boolean} disabled             determinates if user can select/add value or not
 *     {Number} tabindex              determinates the HTML tabindex attribute for textboxs, which allows to switch between them with TAB button in specific order
 *     {Boolean} prevent_repeats      determinates if the 'updated' event will be triggered if user will press 2x enter with the same value
 *     {String} template              the id (without #) of template which is already in the document between <script type='text/template' id='...' /> tag
 *                                    or string which contains template
 *     {String} cid                   store some information about the button here
 *     {String} initial_message       a message which is displayed to user in the textbox when there is any character inside it
 *     {Boolean} clear_msg_button     a button which gives a possibility to clear	text inside the textbox
 *     {Boolean} autocompletion       enables grepo-autocompletion for the textbox
 *     {Boolean} autocompletion_with_id   Server will return rows in this shape: ['player_name', 'player_id'], instad of ['player_name', 'player_name']
 *     {String} autocompletion_type   determinates type of grepo-autocompletion
 *         Possible values:
 *         - 'game_player'
 *         - 'game_town'
 *         - 'game_report'
 *         - 'game_alliance'
 *     {String} regexp                regular expression which is used to check if string specified in the textbox is correct
 *     {Boolean} focus                determinates if textbox should receive focus after initialization
 *     {Boolean} selection_details    determinates if text inside the texbox have to be selected or not
 *     {Object} selection_details     an object which specified the selection range {start : x, end : y}
 *     {String} invalidmsg            a error message string which is loaded to the HTMLElement (.js-txt-error-msg) which is a child of the root Textbox node
 *     {Boolean} live                 when this property is set to true, textbox waits 250ms after each character and tries to save value
 *                                    (if the settings.invalidmsg is not specified, it will try to correct value if its wrong)
 *     {String} ios_keyboard          tells ios devices to shows different keyboard layouts
 *         Possible values:
 *         - 'default' (default one)
 *         - 'numbers' tells ios devices to show numeric keyboard
 *     {Boolean} read_only            if true, adds read_only to the input box
 *     {Number} autocompletion_min_chars Minimum amount of characters until search begins. Default: 3
 *
 * Component events:
 * - txt:change:value          triggered when user typed some value and confirmed it by pressing ENTER
 * - txt:cleared               triggered when user clicked on the X-clear button
 * - txt:focus                 triggered when textbox has been focused
 * - txt:afterfocus            triggered after focus event is triggered
 * - txt:autocomplete:select   triggered when option from autocomplete list has been choosen
 * - txt:key:enter             triggered when enter key has been pressed for this textbox
 *
 *
 * HINTS:
 * - when 'settings.invalidmsg' is specified, the textbox component will not correct values itself, instead of it, will apply the 'textbox_error' css class
 *   on the root node
 *
 * ------------------
 * Example:
 * ------------------
 *
 * CM.register(context, 'txt_recruit', $el.textbox({type : 'number', max : 30}).on('txt:change:value', function(e, new_val, old_val, _btn) {
 *     //Do something when value in the spinner has changed
 * }).on('txt:focus', function(e, _txt) {
 *     //Do something when spinner received focus
 * }));
 */

(function($, w) {
    'use strict';

    var BrowserHelper = require('helpers/browser');

    $.fn.textbox = function(params) {
        var settings = $.extend({
            value: '',
            type: 'text',
            ios_keyboard: 'default',
            min: 0,
            max: 100,
            disabled: false,
            tabindex: 1,
            prevent_repeats: true,
            hidden_zero: true,
            template: 'tpl_textbox',
            cid: {},
            initial_message: '',
            show_initial_message: true,
            clear_msg_button: false,
            live: false,
            regexp: /(.*)/g,
            focus: false,
            selection: false,
            selection_details: null,
            autocompletion: false,
            autocompletion_type: 'game_player',
            autocompletion_format_list: null,
            autocompletion_format_output: null,
            autocompletion_with_id: false,
            autocompletion_limit: 10,
            invalidmsg: '',
            placeholder: '',
            last_selected_suggestion: [],
            visible: true,
            read_only: false,
            autocompletion_min_chars: 3
        }, params);

        var _self = this,
            $el = $(this),
            $input, $empty, $clear, $invalidmsg;

        /**
         * Hides initial message
         */
        function hideInitialMessage() {
            $el.removeClass('initial-message');
            $empty.hide();
        }

        /**
         * Shows initial message
         */
        function showInitialMessage() {
            $el.addClass('initial-message');
            $empty.html(settings.initial_message);
            $empty.show();
        }

        /**
         * Shows clear message button
         */
        function showClearMessageButton() {
            $el.addClass('clear-message');
            $clear.show();
        }

        /**
         * Hides clear message button
         */
        function hideClearMessageButton() {
            $el.removeClass('clear-message');
            $clear.hide();
        }

        /**
         * Focuses textbox
         */
        function setFocus() {
            $input.trigger("focus");
        }

        /**
         * Selects text in the textbox, if you have stored selection object somewhere,
         * you can use it to select only specific part of text (specify it as settings.selection_details)
         */
        function setSelection(start, end) {
            var sel = typeof start === 'number' && typeof end === 'number' ? {
                start: start,
                end: end
            } : settings.selection_details;

            if (sel) {
                $input.selection(sel.start, sel.end);
            } else {
                $input.select();
            }
        }

        /**
         * Returns selection_details for the textbox
         */
        function getSelection() {
            return $input.selection();
        }

        /**
         * Checks if the value passed as an argument maches all conditions, and if not
         * strips the value which is more than 'max', or less than 'min'
         *
         * @param {Number|String} value   value which has to be checked
         *
         * @return {Number|String}
         */
        function checkConditions(value) {
            var max = settings.max,
                min = settings.min,
                type = settings.type,
                correct_mistakes = !settings.invalidmsg,
                new_val = value,
                error = false;

            switch (type) {
                case 'number':
                    new_val = parseInt(value, 10) || 0;

                    if (new_val > max) {
                        if (correct_mistakes) {
                            new_val = max;
                        } else {
                            error = true;
                        }
                    }

                    if (new_val < min) {
                        if (correct_mistakes) {
                            new_val = min;
                        } else {
                            error = true;
                        }
                    }

                    break;
                case 'text':
                    new_val = (value || '').toString().substr(0, settings.max);
                    break;
                case 'custom':
                    if (!(new RegExp(settings.regexp).test(value))) {
                        if (correct_mistakes) {
                            new_val = '';
                        } else {
                            error = true;
                        }
                    }
                    break;
                default:
                    if (Game.dev) {
                        debug('Textbox #' + $el.attr('id') + ' component type is not supported');
                    }
                    break;
            }

            $el.toggleClass('textbox_error', error);

            return new_val;
        }

        /**
         * Sets value
         *
         * @param {String} value     value which have to be displayed in component
         * @param {Boolean} props   determinates if 'txt:change:value' should be triggered or not
         */
        function setValue(value, props) {
            props = props || {};

            var new_val = checkConditions(value),
                old_val = settings.value;
            // replaces displayed value on component init
            if (settings.hidden_zero && new_val === old_val && new_val === 0) {
                $input.val('');
            }

            if (new_val === old_val && new_val !== value) {
                $input.val(new_val);
            }

            if (!settings.prevent_repeats || (new_val !== old_val && (!settings.hidden_zero || (settings.hidden_zero && new_val !== ''))) || settings.type === 'custom') {

                settings.value = new_val;

                if (settings.hidden_zero && parseInt(new_val, 10) === 0) {
                    new_val = '';
                }

                $input.val(new_val);

                if (!props.silent) {
                    $el.trigger('txt:change:value', [new_val, old_val, _self]);
                }
            }

            //don't change condition to if (!settings.value), because this condition shouldn't be true for 0

            if (settings.value === '') {
                if (settings.show_initial_message) {
                    showInitialMessage();
                }

                if (settings.clear_msg_button) {
                    hideClearMessageButton();
                }
            } else {
                if (settings.show_initial_message) {
                    hideInitialMessage();
                }

                if (settings.clear_msg_button) {
                    showClearMessageButton();
                }
            }
        }

        /**
         * Clears textbox and sets focus to input element
         */
        function clearTextbox() {
            setValue('');
            $input.trigger("focus");

            $el.trigger('txt:cleared', [_self]);
        }

        /**
         * Adds autocompletion to the textbox component
         */
        function addAutocompletion() {
            var props = {
                minChars: settings.autocompletion_min_chars,
                autoFill: true,
                extraParams: {
                    limit: settings.autocompletion_limit,
                    what: settings.autocompletion_type,
                    with_id: settings.autocompletion_with_id
                }
            };

            if (typeof settings.autocompletion_format_list === 'function') {
                props.formatItem = settings.autocompletion_format_list;
            }

            if (typeof settings.autocompletion_format_output === 'function') {
                props.formatOutput = settings.autocompletion_format_output;
            }

            var automplete_source = settings.autocomplete_data ? settings.autocomplete_data : '/autocomplete';
            $input.oldautocomplete(automplete_source, props).result(function(e, row) {
                settings.last_selected_suggestion = row;

                $el.trigger('txt:autocomplete:select', [_self, row]);
            });
        }

        /**
         * Removes autocompletion to the textbox component
         */
        function removeAutocompletion() {
            $input.unautocomplete();
        }

        /**
         * Changes autocompletion from one to another
         */
        function changeAutocompletion() {
            removeAutocompletion();
            addAutocompletion();
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $el.off('.textbox');

            $input.off('.textbox');
            $empty.off('.textbox');
            $clear.off('.textbox');

            if (destroy) {
                $el.off('txt:change:value');
                $el.off('txt:cleared');
                $el.off('txt:focus');
                $el.off('txt:autocomplete:select');
                $el.off('txt:afterfocus');
                $el.off('txt:key:enter');
                $el.off('txt:key:esc');

                if (settings.autocompletion) {
                    removeAutocompletion();
                }
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            var live_typing_timer;

            unbindEvents();

            $input.on('keydown.textbox', function(e) {
                var old_val;

                if (settings.disabled) {
                    return;
                }

                old_val = settings.value;

                switch (e.keyCode) {
                    case 27: //Esc
                        $el.trigger('txt:key:esc', [_self]);
                        break;
                    case 13: //Enter
                        setValue($input.val());
                        $el.trigger('txt:key:enter', [_self]);
                        break;
                }

                $el.trigger('txt:key:down', [$input.val(), old_val, _self]);
            });

            $input.on('keyup.textbox', function( /*e*/ ) {
                var old_val;

                if (settings.disabled) {
                    return;
                }

                old_val = settings.value;

                //Show clear message icon
                if (settings.clear_msg_button && ($input.val() || '').length > 0) {
                    if (settings.clear_msg_button) {
                        showClearMessageButton();
                    }

                    if (settings.show_initial_message) {
                        hideInitialMessage();
                    }
                } else {
                    if (settings.clear_msg_button) {
                        hideClearMessageButton();
                    }
                }

                if (settings.live) {
                    w.clearTimeout(live_typing_timer);

                    // the used plugin for liveupdate is broken in IE10 and does insert <-> in the DOM
                    // at random places, see libs/jquery.autocomplete.js
                    // it is unmaintained, version 1.2.3 is even worse on IE10
                    // see GP-15838 for more details
                    if (!BrowserHelper.isIE10OrLower()) {
                        live_typing_timer = w.setTimeout(function() {
                            //Save current position of the cursor
                            var current_position = getSelection();

                            //Update value
                            setValue($input.val());

                            //Restore previous position
                            setSelection(current_position.start, current_position.end);
                        }, 250);
                    }
                }

                $el.trigger('txt:key:up', [$input.val(), old_val, _self]);
            });

            $input.on('focus.textbox', function(e) {
                if (settings.disabled) {
                    return;
                }

                if (settings.value === '' && settings.initial_message) {
                    hideInitialMessage();
                }

                $el.trigger('txt:focus', [_self]);
            });

            $input.on('mouseup.textbox', function(e) {
                if (settings.disabled) {
                    return;
                }

                $el.trigger('txt:afterfocus', [_self]);
            });

            $input.on('blur.textbox', function(e) {
                if (settings.disabled) {
                    return;
                }

                var old_val = settings.value;

                setValue($input.val());
                $el.trigger('txt:blur', [$input.val(), old_val, _self]);
            });

            //$input.on('click.textbox', '.clear-button'

            if ($empty.length) {
                $empty.on('click.textbox', function() {
                    $input.trigger("focus");
                });
            }

            if ($clear.length) {
                $clear.on('click.textbox', function() {
                    clearTextbox();
                });
            }

            if (settings.autocompletion) {
                addAutocompletion();
            }
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var template = settings.template,
                $tpl = template === 'internal' ? null : (/^</.test(settings.template) ? settings.template : $('#' + settings.template).html());

            //Append template to main container
            if ($tpl) {
                $el.html(us.template($tpl, settings));
            }

            $input = $el.is('input') ? $el : $el.find('input');
            $input.val(settings.value).attr('tabindex', settings.tabindex).attr('placeholder', settings.placeholder);
            $empty = $el.find('.js-empty');
            $clear = $el.find('.js-clear');
            $invalidmsg = $el.find('.js-txt-error-msg');

            if ($invalidmsg.length) {
                $invalidmsg.html(settings.invalidmsg);
            }

            if (settings.read_only) {
                $input.attr('readonly', true);
            }

            //Force iOS keyboard
            if (settings.ios_keyboard === 'numbers') {
                $input.attr('pattern', '^MAX$|[0-9]*');
            }

            //Bind events
            bindEvents();
        }

        function visibility(state) {
            $el[state ? 'show' : 'hide']();
        }

        /**
         * Disables or enables component, also adds 'disabled' class to the root node
         * so the component can be skinned
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

        /**
         * Sets value of the textbox
         *
         * @param {Number|String} value   the value you want to put into the textbox
         *                                (it can be changed depends on the settings)
         *
         * @param {Boolean} silent   determinates if change should be done silently (without triggering change event)
         *
         * @return {Object}  jQuery Component Object
         */
        this.setValue = function(value, silent) {
            setValue(value, {
                silent: silent
            });

            return this;
        };

        /**
         * Returns value of the textbox
         *
         * @return {Number|String}
         */
        this.getValue = function() {
            return settings.value;
        };

        /**
         * returns the placeholder
         *
         * @return {String} placeholder
         */
        this.getPlaceholder = function() {
            return settings.placeholder;
        };

        /**
         * Sets max value of the textbox
         *
         * @param {Number} value   the maximal value which can be stored in textbox
         *
         * @return {Object}  jQuery Component Object
         */
        this.setMax = function(value) {
            settings.max = value;

            return this;
        };

        /**
         * Returns maxi setting of the textbox
         *
         * @return {Number}
         */
        this.getMax = function() {
            return settings.max;
        };

        /**
         * Adds autocompletion to the textbox component
         *
         * @return {Object}  jQuery Component Object
         */
        this.enableAutocompletion = function() {
            settings.autocompletion = true;

            addAutocompletion();

            return this;
        };

        /**
         * Removes autocompletion to the textbox component
         *
         * @return {Object}  jQuery Component Object
         */
        this.disableAutocompletion = function() {
            settings.autocompletion = false;

            removeAutocompletion();

            return this;
        };

        /**
         * Changes autocompletion from one to another
         *
         * @return {Object}  jQuery Component Object
         */
        this.changeAutocompletion = function(type, autocompletion_format_list, autocompletion_format_output) {
            settings.autocompletion_type = type;

            if (typeof(autocompletion_format_list) !== 'undefined') {
                settings.autocompletion_format_list = autocompletion_format_list;
            }

            if (typeof(autocompletion_format_output) !== 'undefined') {
                settings.autocompletion_format_output = autocompletion_format_output;
            }

            changeAutocompletion();

            return this;
        };

        this.getLastSelectedSuggestion = function() {
            return settings.last_selected_suggestion;
        };

        /**
         * Makes component visible or invisible
         *
         * @param {Boolean} value
         */
        this.setVisibility = function(value) {
            settings.visible = value;

            visibility(value);
        };

        /**
         * true if visible
         * @returns {boolean}
         */
        this.isVisible = function() {
            return settings.visible;
        };

        /**
         * toggles hide / show
         */
        this.toggleVisibility = function() {
            this.setVisibility(!this.isVisible());
        };

        /**
         * Disables textbox
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);

            return this;
        };

        /**
         * Enables textbox
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);

            return this;
        };

        /**
         * true if disabled
         * @returns {boolean}
         */
        this.isDisabled = function() {
            return settings.disabled;
        };

        /**
         * Selects value in component. If no parameters are set, select everything
         *
         * @param {Number} [start]   start position
         * @param {Number} [end]     end position
         *
         * @return {Object}  jQuery Component Object
         *
         * ===============================
         * Can be used to put cursor in specific position by calling this method with:
         * select(x, x);
         */
        this.select = function(start, end) {
            setFocus();
            setSelection(start, end);

            return this;
        };

        /**
         * Alias for this.select without a range -> see setSelection
         */
        this.selectAll = function() {
            return this.select();
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
         * Clears value in component
         *
         * @return {Object}  jQuery Component Object
         */
        this.clear = function() {
            this.setValue('');

            return this;
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
         * Sets focus to component
         *
         * @return {Object}  jQuery Component Object
         */
        this.focus = function() {
            setFocus();

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //$el.textbox = null;

            //Unbind all events
            unbindEvents(true);
        };

        //Initialize
        (function() {
            if (settings.type === 'number') {
                settings.ios_keyboard = 'numbers';
            }

            if (settings.type === 'text') {
                settings.hidden_zero = false;
            }

            loadTemplate();

            //Set value which is in settings
            setValue(settings.value);

            //Disable if needed
            disable(settings.disabled);

            if (settings.focus) {
                setFocus();
            }

            if (settings.selection) {
                setSelection();
            }

            visibility(settings.visible);
        }());

        return this;
    };
}(jQuery, window));