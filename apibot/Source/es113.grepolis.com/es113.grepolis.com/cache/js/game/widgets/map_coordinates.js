/*globals jQuery, us */

(function($) {
    'use strict';

    $.fn.mapCoordinates = function(params) {
        var settings = $.extend({
            options: [],
            template: 'tpl_map_coordinates_widget',
            l10n: {},
            exclude_click_nodes: ['js-delete']
        }, params);

        var _self = this,
            $el = $(this);

        var textbox_x, textbox_y, button, dropdown;

        function unbindEvents() {
            $el.off('wgtmc:btn:click');
            $el.off('wgtmc:row:delete');
            $el.off('wgtmc:move:map');
        }

        function bindEvents() {
            unbindEvents();
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var template = $('#' + settings.template).html();

            if (!template) {
                throw 'Please specify Id to exising template for mapCoordinates widget';
            }

            //Append template to main container
            $el.html(us.template(template, settings));

            //Bind events
            bindEvents();
        }

        this.setX = function(value) {
            textbox_x.setValue(value);
        };

        this.setY = function(value) {
            textbox_y.setValue(value);
        };

        this.getX = function() {
            return textbox_x.getValue();
        };

        this.getY = function() {
            return textbox_y.getValue();
        };

        this.setOptions = function(options) {
            dropdown.setOptions(options);
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            unbindEvents();
        };

        //Initialize
        (function() {
            loadTemplate();

            textbox_x = $el.find('.js-coord-x').textbox({
                type: 'number',
                value: 0,
                min: 0,
                max: 999,
                hidden_zero: false,
                tabindex: 1
            }).on('txt:key:enter', function() {
                textbox_y.trigger("focus");
            });

            textbox_y = $el.find('.js-coord-y').textbox({
                type: 'number',
                value: 0,
                min: 0,
                max: 999,
                hidden_zero: false,
                tabindex: 2
            }).on('txt:key:enter', function() {
                $el.trigger('wgtmc:move:map');
            });

            button = $el.find('.js-coord-button').button({
                template: 'empty'
            }).on('btn:click', function() {
                $el.trigger('wgtmc:btn:click');

                dropdown.toggle();
            });

            dropdown = $el.find('.dd_coordinates').dropdown({
                list_pos: 'center',
                hover: false,
                click: true,
                type: 'image',
                value: 0,
                template: 'tpl_dd_map_coordinates',
                options: settings.options,
                auto_hide_list: false,
                l10n: settings.l10n,
                exclude_click_nodes: settings.exclude_click_nodes,
                repeatable_selection: true,
                list_z_index: 998 //The list should appear below the windows but still above the UI
            }).on('dd:change:value', function(e, new_val, old_val, _dd) {
                var option = dropdown.getOption('value', new_val);

                if (option) {
                    textbox_x.setValue(option.x);
                    textbox_y.setValue(option.y);
                    //Update map
                    $el.trigger('wgtmc:move:map');
                }
            }).on('dd:option:click', function(e, _dd, click_event, option_state, value) {
                var $target = $(click_event.target),
                    option = dropdown.getOption('value', value);

                if ($target.hasClass('js-delete')) {
                    $el.trigger('wgtmc:row:delete', [_self, option]);
                } else {
                    _dd.hide();
                }
            });
        }());

        return this;
    };
}(jQuery));