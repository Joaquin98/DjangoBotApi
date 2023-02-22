/* global Game */
(function($) {
    'use strict';

    $.fn.rename = function(params) {
        var settings = $.extend({
            text: ''
        }, params);

        var _self = this,
            isiOs = Game.isiOs(),
            $el = $(this),
            namespace = 'live_rename';

        var textbox, previous_text;

        var $caption = $el.find('.js-rename-caption'),
            $close_list_layer;

        /**
         * Destroys layer which is used to close dropdown when user will click
         * somewhere in the window
         */
        function destroyCloseListLayer() {
            if ($close_list_layer) {
                $close_list_layer.off().remove();
                $close_list_layer = null;
            }
        }

        /**
         * Sets value when text matches all rules. Additionaly stores previous
         * value
         *
         * @param {String} text
         */
        function setValue(text) {
            $caption.text(text);

            //Store old value
            previous_text = settings.text;
            //Save new value
            settings.text = text;
        }

        /**
         * Clears everything when renameing has been canceled
         */
        function cancelRenaming() {
            if (textbox) {
                textbox.destroy();
                textbox.remove();
            }

            $caption.show();

            destroyCloseListLayer();

            $el.trigger('rn:rename:cancel', [_self]);
        }

        /**
         * Sets value if its different than the current one
         */
        function stopRenaming() {
            var new_value = textbox.getValue().trim(),
                old_value = $caption.text();

            cancelRenaming();

            if (new_value !== old_value) {
                //Set new value
                setValue(new_value);

                $el.trigger('rn:rename:stop', [_self, new_value, old_value]);
            }
        }

        /**
         * Creates layer which is used to close dropdown when user will click
         * somewhere in the window
         */
        function createCloseListLayer() {
            var attr = {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2002 //has to be higher than town groups list @see GP-10095
            };

            $close_list_layer = $('<div class="close_rename_layer" />').appendTo('body').css(attr).one('click', function() {
                stopRenaming();
            });
        }

        /**
         * Prepares all elements for renaming
         */
        function startRenaming() {
            var offset = $el.offset(),
                width = $el.width();
            var special_class_name = $caption.data('js_rename_class') || '';

            createCloseListLayer();

            textbox = $('<input type="text" class="rename_component_input ' + special_class_name + '" />').appendTo('body');
            textbox.textbox({
                    type: 'text',
                    value: 0,
                    min: 3,
                    max: 20,
                    template: 'internal',
                    live: true
                }).trigger("focus")
                .on('txt:key:enter', function() {
                    stopRenaming();
                }).on('txt:key:esc', function() {
                    cancelRenaming();
                });

            textbox.css({
                left: offset.left / Game.ui_scale.factor,
                top: offset.top / Game.ui_scale.factor,
                width: width
            }).val(settings.text);

            $caption.hide();

            $el.addClass('renaming_started');

            $el.trigger('rn:rename:start', [_self]);
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents() {
            $el.off(namespace);

            $el.off('rn:rename:cancel');
            $el.off('rn:rename:start');
            $el.off('rn:rename:stop');
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            var listen_on = (isiOs ? 'doubletap.' : 'dblclick.') + namespace;

            unbindEvents();

            $el.on(listen_on, function(e) {
                startRenaming();
            });
        }

        /**
         * Restores previous text
         */
        this.restore = function() {
            setValue(previous_text);

            return this;
        };

        /**
         * Sets new value
         */
        this.setText = function(text) {
            setValue(text);

            return this;
        };

        this.destroy = function() {
            stopRenaming();
        };

        //Initialization
        (function() {
            bindEvents();

            //Set default text
            setValue(settings.text);
        }());

        return this;
    };
}(jQuery));