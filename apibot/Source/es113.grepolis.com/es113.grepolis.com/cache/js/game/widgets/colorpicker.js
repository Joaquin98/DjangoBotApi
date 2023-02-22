/*global jQuery, Game  */
/**
 * The colorpicker widged contains the following components:
 * 	- color_selector
 * 	- textbox
 * 	- buttons
 * 	- has a div with a flag image to show how the picket color looks like
 *
 * 	The color picker is used to assign new colors, reassign colors (assign default colors) and set custom hex colors
 * 	(which for example are not available in the 6x6 color matrix of the color selector).
 * 	The color picker automatically shows the user how the chosen color would look like (depending on the type on a image elem, div
 * 	with background image or on text).
 *
 * @param params
 *     {String} template    	the id (without #) of template which is already
 *								in the document between
 *								<script type="text/template" id="..." /> tag
 *								or string which contains template
 *
 *	   {String} color			the hex color string for already set colors. For example if
 *	   							we want to change a color of a blue text, the color picker will
 *	   							show the already existing color (blue color).
 *
 *	   {String} default_color	the hex color string for the default color
 *
 *	   {String} type			Can be image or text.
 *	   							Image is used when we want the color picker with the flag image to show the chosen color.
 *	   							Text is used when we want the box with text to show the chosen color.
 *
 *	   {Function} changeColor	Callback functions for changing the color for example on the map or in the message.
 *
 *
 *
 * @return {Object}  jQuery Component Object
 *
 * 	------------------------------------
 * 	How to use the color picker example:
 * 	------------------------------------
 *
 * 	CM.register(context, 'colorpicker', this.$el.find('.color_picker_window').colorpicker({
 *				l10n : {
 *					default_btn : this.l10n.default_btn
 *				},
 *				color : this.controller.getCurrentColor(),
 *				default_color : '000000',
 *				changeColor : function() {
 *					//callback function to assign or reassignColor
 *				},
 *			    type : 'image'
 *			}).on('cp:color:changed', function(e, color) {
 *				//do something
 *			}));
 */
(function($) {
    'use strict';

    $.fn.colorpicker = function(params) {
        var settings = $.extend({
                template: 'tpl_colorpicker',
                color: null,
                default_color: null,
                changeColor: null,
                type: 'image'
            }, params),
            $el = $(this),
            $tpl = null,
            _self = this,
            color_text = null,
            color_selector = null,
            color_confirm = null,
            color_default = null,
            lorem_ipsum_text = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.';

        /**
         * load template
         */
        function loadTemplate() {
            $tpl = $('#' + settings.template).html();
            $el.html(us.template($tpl, us.extend({
                l10n: settings.l10n,
                type: settings.type
            })));
        }

        /**
         * Set color value to input box
         * @param {String} color
         */
        function setColorToInputBox(color) {
            color_text.setValue(color);
        }

        /**
         * Confirm color change
         */
        function confirm() {
            if (typeof settings.changeColor === 'function') {
                settings.changeColor(_self.getValue());
            } else {
                if (Game.dev) {
                    throw 'settings.changeColor should be a function';
                }
            }
        }

        /**
         * value of the color textfield was changed
         */
        function onColorTextChange(new_color_text) {
            var is_empty_color_text = new_color_text.length === 0;

            if (is_empty_color_text) {
                color_confirm.setState(true);
                color_confirm.disable();
            } else {
                color_confirm.setState(false);
                color_confirm.enable();
            }

            if (settings.type === 'image') {
                $el.find('.color_picker_flag_big').css('background-color', '#' + new_color_text);
            } else {
                $el.find('.example_text').css('color', '#' + new_color_text);
            }
        }

        /**
         * set default color
         */
        function setDefault() {
            color_selector.clearSelection();
            color_selector.setValue(settings.default_color);
            if (typeof settings.changeColor === 'function') {
                settings.changeColor(settings.default_color, true);
            }
        }

        /**
         * unbind all events
         * @param {boolean} destroy
         */
        function unbindEvents(destroy) {
            if (destroy) {
                $el.off('cp:color:changed');
            }
        }

        /**
         * bind all needed events
         */
        function bindEvents() {

            color_selector.off('cs:change:value').on('cs:change:value', function(e, new_value) {
                setColorToInputBox(new_value);
            });

            color_text.off('txt:change:value').on('txt:change:value', function(e, new_value) {
                onColorTextChange(new_value);
            });

            color_text.off('txt:key:enter').on('txt:key:enter', function() {
                if (color_selector.getValue() !== color_text.getValue()) {
                    color_selector.clearSelection();
                }
            });

            color_confirm.off('btn:click').on('btn:click', confirm);

            color_default.off('click').on('click', setDefault);
        }

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {

            color_selector.destroy();
            color_text.destroy();
            color_confirm.destroy();
            color_default.destroy();

            unbindEvents(true);
        };

        /**
         *
         * @returns {Array|String} color
         */
        this.getValue = function() {
            return color_text.getValue();
        };

        (function() {
            loadTemplate();
            unbindEvents(false);

            _self.type = settings.type;
            if (settings.type === 'image' && settings.color !== null) {
                $el.find('.color_picker_flag_big').css('background-color', '#' + settings.color);
            }

            if (settings.type === 'text') {
                $el.find('.example_text').text(lorem_ipsum_text);
            }

            color_selector = $el.find('.color_selector').color_selector({
                color: '#' + settings.color
            });

            color_text = $el.find('.color_input').textbox({});
            color_text.setValue(settings.color);

            color_confirm = $el.find('.color_confirm').button({
                caption: '',
                icon: true,
                icon_type: 'checkmark',
                tooltips: [{
                    title: settings.l10n.save_color
                }, {}]
            });

            color_default = $el.find('.color_default').button({
                caption: settings.l10n.default_btn,
                tooltips: [{
                    title: settings.l10n.default_color_text
                }, {}]
            });

            bindEvents();
        }());

        return this;
    };
}(jQuery));