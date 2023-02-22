/**
 * This component is used to create a table look like box.
 * It has a header part which can have a banner and a body part.
 * It is used for the attack screen currently.
 * When creating this component it is important to input a content_html.
 * The content_html is an array which consist of objects that have a head and body property.
 * Example:
 * content_html = [
 *      {
 *          head: '<div class="title">Some Title</div>',
 *          body: '<div>Some content</div>'
 *      },
 *      {
 *          head: '<div class="title">Some Title</div>',
 *          body: '<div>Some content</div><div>More content</div>'
 *      }
 * ]
 *
 * Check the wndhandler_attack.js to see it usuage
 */
(function($) {
    'use strict';

    $.fn.tableBox = function(params) {
        var settings = $.extend({
                content_html: [], //required
                css_classes: '',
                template: 'tpl_table_box',
                use_banner: true,
                with_banner: '',
                banner_classes: 'blue'
            }, params),
            $el = $(this),
            $tpl;

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var template = settings.template;

            // Check if the given template is already a html or an template id
            $tpl = /^</.test(template) ? template : $('#' + template).html();

            //Add template to main container
            $el.html(us.template($tpl, settings));
        }

        /**
         * Returns id specified on the root node of the component
         *
         * @return {String}
         */
        this.getId = function() {
            return $el.attr('id');
        };

        this.destroy = function() {
            $el.html('');
        };

        (function() {

            if ($el.length === 0) {
                return;
            }

            if (settings.use_banner) {
                settings.banner_classes += ' with_banner';
            }

            loadTemplate();

            if (settings.css_classes !== '') {
                $el.addClass(settings.css_classes);
            }
        }());

        return this;
    };
})(jQuery);