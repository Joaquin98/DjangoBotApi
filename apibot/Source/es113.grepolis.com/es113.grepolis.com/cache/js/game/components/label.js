/*global jQuery, us */

/**
 * Label is usually a single HTML node which contains some text, this component
 * will allow to refer to it as to object
 *
 * @param {Object} params
 *     {String} caption      text which will be displayed in the label
 *                           (you can also specified it in "name" attribute on the
 *                           root node)
 *     {String} template     id (without #) of template which is already in the document,
 *                           template itself or 'internal' (will use HTML which is
 *                           already in the code, use .js-caption to point the place
 *                           where is caption)
 *     {Object} cid          you can store here some informations
 */
(function($) {
    'use strict';

    $.fn.label = function(params) {
        var settings = $.extend({
            caption: 'Default text',
            template: 'tpl_label_default',
            /* tpl_label_shadow */
            cid: {}
        }, params);

        var _self = this,
            $el = $(this),
            $tpl, precompiled_template;

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            var template = settings.template,
                $clone;

            $tpl = template === 'internal' ? null : (/^</.test(template) ? template : $('#' + template).html());

            if (!$tpl) {
                if (template === 'empty') {
                    $tpl = '<%= caption %>';
                } else {
                    //Use HTML which is already appended to the label
                    $clone = $el.clone();

                    if (!$clone.find('.js-caption').length) {
                        throw 'Please specify a "js-caption" which indicates where label caption is placed or use "template" : "empty".';
                    }

                    $tpl = $clone.find('.js-caption').text('%caption');

                    //small workaround because jQuery doesn't allow to put <> in the .text()
                    $tpl = $clone.html().toString().replace('%caption', '<%= caption %>');
                }
            }

            //Append template to main container
            precompiled_template = us.template($tpl);
        }

        /**
         * Sets text in the label; runs animation if necessary
         *
         * @param {String} value   text which will be displayed in the label
         *
         * @return {Object}  jQuery Component Object
         */
        this.setCaption = function(value) {
            settings.caption = value;

            $el.html(precompiled_template(settings));

            return this;
        };

        /**
         * Returns currently displayed caption in the label
         *
         * @return {String}
         */
        this.getCaption = function() {
            return settings.caption;
        };

        this.getCaptionElement = function() {
            return $el.find('.js-caption').length ? $el.find('.js-caption') : $el;
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
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //No events to unbind
        };

        /**
         * Initiates component
         */
        (function() {
            loadTemplate();

            //If the "name" attribute is specified on the root node, then it will be
            //take as a caption
            if ($el.attr('name')) {
                settings.caption = $el.attr('name');
            }

            _self.setCaption(settings.caption);
        }());

        return this;
    };
}(jQuery));