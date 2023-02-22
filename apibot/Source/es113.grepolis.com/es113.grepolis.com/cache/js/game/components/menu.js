/*global jQuery, us */

/**
 * Menus component provides a possibility to reuse the same functionality for
 * all menus in the game, you can specify the template which will be loaded in
 * the manu-container.
 *
 * @param params
 *     {Boolean} click         Determinates if the list should be open or not
 *                             when user will click on the dropdown
 *     {Boolean} hover         Determinates if the list should be open or not
 *                             when user will hover over the dropdown
 *     {Object} list_pos       Determinates how the list with options should be
 *                             displayed in relation to the dropdown element {vertival : 'top', horizontal : 'left'}
 *
 *        Vertical values:
 *         - top
 *         - bottom
 *         - auto
 *
 *        Horizontal values:
 *        - 'left'     the leftedge of the list will be stick to the left edge
 *                     of the dropdown
 *        - 'right'    the right edge of the list will be stick to the right edge
 *                     of the dropdown
 *        - 'center'   the list will be centered relarivly to the dropdown
 *
 *     {Boolean} disabled      Determinates if menu reasts on the user actions
 *     {String} template       the id (without #) of template which is already
 *                             in the document between
 *                             <script type="text/template" id="..." /> tag
 *                             or string which contains template
 *     {String} container_id   The Id of the element which reperesents
 *                             the menu-list
 *     {String} cid            keeps the additional informations, you can
 *                             store everything here. But please don't make
 *                             a storage with it ;)
 *
 * Component Events:
 * - menu:show  triggered when menu is shown
 * - menu:hide  triggered when menu is hidden
 *
 * =============================================================================
 *
 * Example:
 *
 * In this example I reused menu container between multiple menus, every time
 * when menu is opened, I take a information about the current row
 * from the "cid", and I reinitiated spinner with it. Please look at the index
 * tab in the market.
 *
 * CM.register(context, 'menu_name', $(node).menu({
 *     cid : details, container_id : 'menu_align_demand', template : 'tpl_menu_align_demand'
 * }).on("menu:show", function(e, menu) {
 *     var details = menu.getCid();
 *     _self.spinners.sp_align_demand.setMax(details.demand).setValue(0).setCid(details.id);
 * }));
 *
 */
(function($) {
    'use strict';

    $.fn.menu = function(params) {
        var settings = $.extend({
            click: true,
            hover: true,
            hide_on_hover: false,
            list_pos: {
                vertical: 'top',
                horizontal: 'left'
            },
            disabled: false,
            template: 'tpl_menu',
            container_id: null,
            cid: {}
        }, params);

        var _self = this,
            //HTML elements
            $el = $(this),
            $list, $tpl;

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $el.off('.menu');

            if (destroy) {
                $el.off('menu:show menu:hide');
                $list.off('.menu');
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $el.on('click.menu', function( /*e*/ ) {
                if (settings.click) {
                    _self.toggle();
                }
            });

            $el.on('mouseover.menu', function( /*e*/ ) {
                if (settings.hover) {
                    _self.show();
                }
            });

            $el.on('mouseout.menu', function(e) {
                var $target = $(e.relatedTarget);

                if ((settings.hover || settings.hide_on_hover) && $target !== $list && !$list.find($target).length && $target !== $el && !$el.find($target).length) {
                    _self.hide();
                }
            });

            //This List can shared between component instances, have to be initiated only once
            $list.off('mouseout.menu').on('mouseout.menu', function(e) {

                var $target = $(e.relatedTarget);

                if ((settings.hover || settings.hide_on_hover) && !$list.find($target).length && !$target.hasClass('menu_new') && !$el.find($target).length) {
                    _self.hide();
                }
            });
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            //Check if template is already specified as an argument
            $tpl = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();

            if (!settings.container_id) {
                throw 'Please specify settings.container_id for the menu component.';
            }

            $list = $('#' + settings.container_id);

            if (!$list.length) {
                //Take the menu element and append it to the body
                $('body').append(us.template($tpl, settings));
                $list = $('#' + settings.container_id);
            }

            //Bind events
            bindEvents();
        }

        /**
         * Disables or enables component, also adds "disabled" class to the root node
         * so the component can be skinned
         *
         * @param {Boolean}   bool   Determinates if component is enabled or not
         */
        function disable(bool) {
            settings.disabled = bool;

            $el.toggleClass('disabled', bool);
        }

        function recalculateMenuPosition() {
            var width = $el.outerWidth(),
                height = $el.outerHeight(),
                lwidth = $list.outerWidth(),
                lheight = $list.outerHeight(),
                list_pos = $.extend({}, settings.list_pos),
                offset = $el.offset(),

                $window;

            var top, bottom, left, right;

            if (list_pos.vertical === 'auto') {
                $window = $(window);

                if (offset.top + height + lheight < $window.innerHeight()) {
                    list_pos.vertical = 'top';
                } else {
                    list_pos.vertical = 'bottom';
                }
            }

            switch (list_pos.vertical) {
                case 'top':
                    top = offset.top + height;
                    break;
                case 'bottom':
                    top = offset.top - lheight;
                    break;
            }

            switch (list_pos.horizontal) {
                case 'center':
                    left = offset.left - (lwidth / 2) + width / 2;
                    break;
                case 'left':
                    left = offset.left;
                    break;
                case 'right':
                    left = offset.left + width - lwidth;
                    break;
            }

            $list.removeClass('vertical_top vertical_bottom').addClass('vertical_' + list_pos.vertical);

            return {
                top: top,
                left: left,
                bottom: bottom,
                right: right
            };
        }

        /**
         * Makes menu element visibile or not, depends on the previous state.
         * If the 'display' parameter is specified, then it will force to display
         * the list.
         *
         * @param {Boolean} display   forces toggle function to show list, instead of
         *                            looking at the previous value and then decide
         *                            if the list should be shown or hidden
         *
         * @return {Object}  jQuery Component Object
         */
        this.toggle = function(display) {
            if (settings.disabled) {
                return this;
            }

            var position, is_visible;

            $list[display ? 'show' : 'toggle']();

            is_visible = $list.css('display') === 'block';

            //Don't trigger an event, because .toggle() was called by .show() which also triggers an event
            if (!display) {
                this.trigger(is_visible ? 'menu:show' : 'menu:hide', [_self]);
            }

            //Do it after triggering an event because there can be some components which after initialization will resize menu list
            if (is_visible) {
                position = recalculateMenuPosition();

                $list.css(position);
            }

            return this;
        };

        this.getListHTMLElement = function() {
            return $list;
        };

        /**
         * Shows list with options
         *
         * @return {Object}  jQuery Component Object
         */
        this.show = function() {
            if ($list.css('display') !== 'block') {
                $el.addClass('active');

                this.trigger('menu:show', [_self]);

                this.toggle(true);
            }

            return this;
        };

        /**
         * Hides list with options
         *
         * @return {Object}  jQuery Component Object
         */
        this.hide = function() {
            if ($list.css('display') === 'block') {
                $el.removeClass('active');
                $list.hide();

                this.trigger('menu:hide', [_self]);
            }

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
         * Returns value stored in the 'cid'
         *
         * @return {Object|String|Number}
         */
        this.getCid = function() {
            return settings.cid;
        };

        /**
         * Disables menu
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);

            return this;
        };

        /**
         * Enables menu
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);

            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Unbind all events
            unbindEvents(true);

            this.hide();
        };

        /**
         * Initiates component
         */
        (function() {
            loadTemplate();
        }());

        return this;
    };
}(jQuery));