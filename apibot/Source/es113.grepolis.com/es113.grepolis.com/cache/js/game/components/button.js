/*global jQuery, MousePopup, Game */

/**
 * This component extends the functionality of the native HTML button, can be
 * easly skinned. Triggers its own events (see list below).
 *
 * @param params
 *     {String} caption     caption of the button, there is also a possibility
 *							to put caption in the "name" attribute of the root
 *							node of the button, to define the caption (see example below)
 *     {Boolean} disabled   determinates if events will be fired or not,
 *							for example, when button is disabled, the code in
 *							onclick handler won't be fired
 *     {String} template    the id (without #) of template which is already
 *							in the document between
 *							<script type="text/template" id="..." /> tag
 *							or string which contains template
 *     Possible values:
 *         - 'internal'
 *         - 'empty'
 *         - template name, example: 'tpl_button'
 *         - template string, example: '<div><%= caption %></div>'
 *
 *     {Boolean} toggle     fires 'btn:click:odd', 'btn:click:even' alternately, you can determinate different code for them
 *     {Boolean} state      determinates the current state of the button,
 *							false = 'odd', true = 'even', in this way you can
 *							determinate which one of these events will be triggered first
 *     {String} cid         helps to determinate the button, its something like
 *                          vitrual id, or you can store there some informtaions
 *     {Boolean} icon                Determinates whether button has icon or not (use this property in the template)
 *     {String} icon_position        Determinates position of the icon (use this property in the template)
 *     {Boolean} highlight           when this parameter is set to true, button receives a css
 *                                   class "highlight" for X seconds after Y seconds (check highlight_settings)
 *     {Object} highlight_settings   A hash array which keeps settings for highlight feature
 *     Possible values:
 *         {Number} start      the time after which the css class will be added to the button
 *         {Number} duration   the time the css class will stay on the button
 *
 *     {Object} tooltips    an array which contains tooltips objects {title: 'tooltip', styles : {width :100}, hide_when_disabled : true}
 *							if settings.toggle is set to false, then only one tooltip will be applied on the button
 *							but if settings.toggle is set to true, tooltips will change accordingly to the settings.state
 *							so: false - first-tooltip, true, second tooltip
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - btn:click            fired when button is clicked (toggle option has to be 'false')
 * - btn:click+alt        fired when button is clicked during the 'alt' key is pressed (toggle option has to be 'false')
 * - btn:click:even       fired on 'even' clicks, (toggle option has to be 'true')
 * - btn:click:even+alt   fired on 'even' clicks during the 'alt' key is pressed, (toggle option has to be 'true')
 * - btn:click:odd        fired on 'odd'  clicks, (toggle option has to be 'true')
 * - btn:click:odd+alt    fired on 'odd'  clicks during the 'alt' key is pressed, (toggle option has to be 'true')
 *
 * ------------------
 * Example 1:
 * ------------------
 *
 * The simpliest use of the button component. It creates a default grepo button with caption,
 * and fires 'btn:click' event every time when user clicks on the button. Please remember that
 * all skining things are done in css files, so to make it looks as default grepo button, the
 * HTML node have to looks like following: <div class="button_new"></div>
 *
 * var button = CM.register(context, 'button_name', $("#btn_sort_offer").button({caption : 'Some Caption'}).on("btn:click", function() {
 *     //do something
 * }));
 *
 *
 * ------------------
 * Example 2:
 * ------------------
 *
 * Using 'toggle' property to do different actions (even click, sort ascending, odd click, sort descending).
 *
 * CM.register(context, 'btn_order_by', $("#btn_troops_ourside_order_by").button({toggle : true}).on('btn:click:even', function() {
 *     _self.sortData("desc");
 * }).on('btn:click:odd', function() {
 *     _self.sortData("asc");
 * }));
 *
 * ------------------
 * Example 3:
 * ------------------
 *
 * Specifing tooltips for the button. This code will create a button, which will use the inner html of the button as a template.
 * Button will be disabled when 'no_more_disciplines' variable is set to 'true'.
 * IMPORTANT! internal one needs to contain div with class name js-caption
 *
 * CM.register(context, 'btn_laurels_count', $el.find('.laurels_count .single_line_box').button({
 *     template : 'internal',
 *     disabled : no_more_disciplines,
 *     tooltips : [
 *         {title : 'Some tooltip title', styles : {'max-width' : 30}, hide_when_disabled : true}
 *     ]
 * }).on('btn:click', function() {
 *     _self.window_model.setActivePageNr(1);
 * }));
 *
 */
(function($) {
    'use strict';

    $.fn.button = function(params) {
        var settings = $.extend({
            caption: '',
            disabled: false,
            template: 'tpl_button',
            /* internal, empty */
            toggle: false,
            state: false,
            cid: {},
            icon: false,
            icon_position: 'right',
            icon_type: 'speed',
            highlight: false, //@todo it have to be done as a widget
            highlight_settings: { //@todo it have to be done as a widget
                start: 0,
                duration: 86400000 //24h, our buttons blinks 2100 ms
            },
            tooltips: [],
            details: {},
            css_classes: '',
            stop_propagation: false //is set to false by default because we use the bubbling in more places already
        }, params);

        var _self = this,
            $el = $(this),
            $tpl,
            disable_dblclick = false;

        //Keeps reference to the tooltip object
        var tooltip;

        //Timers used for "highlight" feature
        var timer, timer2;
        var dblclick_timer;

        function bindTooltip(force) {
            var pos = +settings.state,
                ttp, ttps = settings.tooltips;

            //Get tooltip
            if (ttps[pos] || ttps.length) {
                ttp = ttps[pos] || ttps[0];
            }

            //if new tooltip is the same as previous or doesn't exist, don't change anything
            // except the 'force' param is set
            if (!force && (!ttp || (tooltip && tooltip.xhtml === ttp.title && !ttp.hide_when_disabled))) {
                return;
            }

            //Destroy previous tooltip if exist
            if (tooltip && tooltip.destroy) {
                //Hide tooltip
                tooltip.onOutAnimationComplete();
                //Destroy it
                tooltip.destroy();
                tooltip = null;
            }

            //If button is disabled, and if tooltip should be hidden
            if (ttp && ((settings.disabled && ttp.hide_when_disabled) || !ttp.title)) {
                return;
            }

            //Add new tooltip
            if (force || (settings.toggle && !settings.disabled) || (pos === 0 && !settings.disabled) || (pos === 1 && settings.disabled)) {
                tooltip = new MousePopup(ttp.title, ttp.styles);
                $el.mousePopup(tooltip);
            }
        }

        function unbindTooltip() {
            if (tooltip && tooltip.destroy) {
                tooltip.destroy();
                tooltip = null;
            }
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $el.off('.button');

            if (destroy) {
                $el.off('btn:click btn:click:even btn:click:odd');

                //Destroy tooltip if exist
                unbindTooltip();
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $el.on('click.button', function(e) {

                if (settings.disabled || disable_dblclick) {
                    return;
                }

                disable_dblclick = true;

                var alt_key = e.altKey;

                var event_name = 'btn:click' + (alt_key ? '+alt' : '') + (settings.state ? ':even' : ':odd');

                if (settings.toggle) {
                    settings.state = !settings.state;

                    $el.toggleClass('active', settings.state);
                    //Bind new tooltip
                    bindTooltip();
                }

                _self.trigger('btn:click', [_self, e.originalEvent]);
                _self.trigger(event_name, [_self, e.originalEvent]);

                //Allow next clicking on the button after some delay. It prevents button to be double clicked
                dblclick_timer = window.setTimeout(function() {
                    //Add css class after "start" time
                    window.clearInterval(dblclick_timer);

                    disable_dblclick = false;
                }, 300);

                //Solution for the ticket:
                //- check if we can trigger :even and :odd only for the "toggle" true, otherwise trigger normal click
                //- add +alt and _shift to all events, btn:click and btn:click+alt can not be triggered simultaniously
                if (settings.stop_propagation) {
                    e.stopPropagation();
                }
            });
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var template = settings.template,
                $clone;

            $tpl = template === 'internal' ? null : (/^</.test(template) ? template : $('#' + template).html());

            if (!$tpl) {
                if (template === 'none') {
                    //do nothing
                } else if (template === 'empty') {
                    $tpl = '<%= caption %>';
                } else {
                    //Use HTML which is already appended to the label
                    $clone = $el.clone();

                    if ($clone.hasClass('js-caption') || $clone.hasClass('js-button-caption')) {
                        $tpl = $clone.text('%caption');
                    } else if ($clone.find('.js-button-caption').length) {
                        $tpl = $clone.find('.js-button-caption').text('%caption');
                    } else if ($clone.find('.js-caption').length) {
                        $tpl = $clone.find('.js-caption').text('%caption');
                    } else {
                        if (Game.dev) {
                            throw 'Please specify "js-caption" css class on the node where caption should be placed. Otherwise please use template="empty"';
                        }
                    }

                    //small workaround because jQuery doesn't allow to put <> in the .text()
                    $tpl = $clone.html().toString().replace('%caption', '<%= caption %>');
                }
            }

            //Append template to main container
            if (template !== 'none') {
                $el.html(us.template($tpl, settings));
            }

            //Bind events
            bindEvents();
        }

        /**
         * Disables or enables component, also adds "disabled" class to the root node
         * and "disabled" attribute on the input element, so the component can be skinned
         *
         * @param {Boolean}   bool   Determinates if component is enabled or not
         */
        function disable(bool) {
            settings.disabled = bool;

            $el.toggleClass('disabled', bool);

            //Update tooltips
            bindTooltip();
        }

        /**
         * Sets caption of the button
         *
         */
        function setCaption() {
            if (settings.template !== 'none') {
                $el.html(us.template($tpl, settings));
            }
        }

        /**
         * Public method which allows to change the caption of the button
         *
         * @param {String} caption   new caption of the button
         *
         * @return {Object}  jQuery Component Object
         */
        this.setCaption = function(caption) {
            settings.caption = caption;

            setCaption();

            return this;
        };

        /**
         * Public method which returns button's caption
         *
         * @return {String}
         */
        this.getCaption = function() {
            return settings.caption;
        };

        this.isDisabled = function() {
            return settings.disabled;
        };

        /**
         * Allows to enable icon dynamically for example if button settings have to
         * be completlely changed by some action of the user.
         *
         * Example, in the Grepolympia
         * on the bottom of the Athelte tab, there was a button to 'Attend'. The Default state
         * of this button was a grepo button with simple caption. But when user attended
         * a discipline, the button has changed, and displayed different catpion and the gold icon.
         *
         * @return {Object}  jQuery Component Object
         */
        this.enableIcon = function() {
            settings.icon = true;
            $el.toggleClass('icon_' + settings.icon_position + ' icon_type_' + settings.icon_type, settings.icon);

            return this;
        };

        /**
         * Allows to disable icon dynamically for example if button settings have to
         * be completlely changed by some action of the user.
         *
         * Example, in the Grepolympia
         * on the bottom of the Athelte tab, there was a button to 'Attend'. The Default state
         * of this button was a grepo button with simple caption. But when user attended
         * a discipline, the button has changed, and displayed different catpion and the gold icon.
         *
         * @return {Object}  jQuery Component Object
         */
        this.disableIcon = function() {
            settings.icon = false;

            $el.toggleClass('icon_' + settings.icon_position + ' icon_type_' + settings.icon_type, settings.icon);

            return this;
        };

        /**
         * Returns state of the button. If "toggle" setting is set to false, button
         * has only one state (as default 'false'),
         * in other case "true" for "odd" and "false" for "even" clicks
         *
         * @return {Boolean}
         */
        this.getState = function() {
            return settings.state;
        };

        this.toggleState = function() {
            settings.state = !settings.state;

            $el.toggleClass('active', settings.state);
        };

        /**
         * Sets state of the button
         *
         * @param {Boolean} value   new state
         *
         * @return {Object}  jQuery Component Object
         */
        this.setState = function(value) {
            settings.state = value;

            $el.toggleClass('active', settings.state);

            return this;
        };

        /**
         * This is just helper function which returns "asc" or "desc" depends on the
         * settings.state
         *
         * @return {String}  'asc' or 'desc'
         */
        this.getDirectionState = function() {
            return settings.state ? 'asc' : 'desc';
        };

        /**
         * Disables button
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function(value) {
            var state = typeof value === 'boolean' ? value : true;

            disable(state);

            return this;
        };

        this.toggleDisable = function(value) {
            disable(value);

            return this;
        };

        /**
         * Enables button
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);

            return this;
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
            return $el.attr('id');
        };

        /**
         * Returns something like jQuery data
         *
         * @return {Object}
         */
        this.getDetails = function() {
            return settings.details;
        };

        this.setDetails = function(value) {
            settings.details = value;
        };

        /**
         * Enables button highlightion
         *
         * @return {Object}  jQuery Component Object
         */
        this.enableHighlightion = function() {
            timer = window.setTimeout(function() {
                //Add css class after "start" time
                window.clearInterval(timer);
                $el.addClass('highlight');

                timer2 = window.setTimeout(function() {
                    //Remove css class after "duration" time
                    window.clearInterval(timer2);
                    $el.removeClass('highlight');
                }, settings.highlight_settings.duration);

            }, settings.highlight_settings.start);

            return this;
        };

        /**
         * Disables button highlightion
         *
         * @return {Object}  jQuery Component Object
         */
        this.disableHighlightion = function() {
            $el.removeClass('highlight');
            window.clearInterval(timer);
            window.clearInterval(timer2);

            return this;
        };

        this.setTooltip = function(title, index) {
            index = index || 0;

            var tp = settings.tooltips[index];

            unbindTooltip();

            if (!tp) {
                settings.tooltips[index] = {
                    title: title
                };
            } else {
                tp.title = title;
            }

            bindTooltip(true);
        };

        this.destroyTooltip = function() {
            unbindTooltip();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Unbind all events from the main node
            unbindEvents(true);

            window.clearInterval(timer);
            window.clearInterval(timer2);
            window.clearInterval(dblclick_timer);
        };

        /**
         * Helper function used for unit tests, don't use it in development
         */
        this.getSetting = function(name) {
            return settings[name];
        };

        //Initialization
        (function() {

            // if there is no element to bind to, exit creating button
            if ($el.length === 0) {
                return;
            }

            loadTemplate();

            if ($el.attr('name')) {
                settings.caption = $el.attr('name');
            }

            setCaption();
            disable(settings.disabled);

            if (!settings.disabled && settings.highlight) {
                _self.enableHighlightion();
            }

            if (settings.css_classes !== '') {
                $el.addClass(settings.css_classes);
            }

            $el.toggleClass('active', settings.state);

            $el.toggleClass('icon_' + settings.icon_position + ' icon_type_' + settings.icon_type, settings.icon);

            bindTooltip();
        }());

        return this;
    };
}(jQuery));