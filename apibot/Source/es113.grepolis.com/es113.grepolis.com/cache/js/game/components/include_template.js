/*global jQuery */

(function($) {
    'use strict';

    /**
     * Component which helps to use box container templates. Rather used for very basic
     * structures which don't keeps "static" data
     */
    $.fn.includeTemplate = function(params) {
        var settings = $.extend({
            template: 'generic_box',
            content: ''
        }, params);

        var $el = $(this),
            templates = {
                generic_box: 'tpl_generic_box_container'
            };

        function getContent() {
            switch (settings.template) {
                case 'generic_box':
                    return settings.content || $el.html();
                default:
                    return settings.content;
            }
        }

        /**
         * Loads template
         */
        function loadTemplate() {
            var template = templates[settings.template],
                tpl = $('#' + template).html();

            if (!template) {
                throw 'Please specify real Id of the template (which should be preloaded to the document) in the "templates" variable on the top of include_template.js';
            }

            $el.html(us.template(tpl, {
                value: getContent()
            }));
        }

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {

        };

        //Initialization
        (function() {
            loadTemplate();
        }());

        return this;
    };
}(jQuery));