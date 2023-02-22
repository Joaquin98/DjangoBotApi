// jshint ignore: start

/**
 * A component which extends functionality of the standard HTML <select /> element.
 * Allows to skin it, and provides additional features.
 *
 * @param params
 *     {String|Number} value   represents the value of the option which should
 *                             be selected
 *     {Boolean} click         Determinates if the list should be open or not
 *                             when user will click on the dropdown
 *     {Boolean} hover         Determinates if the list should be open or not
 *                             when user will hover over the dropdown
 *     {String} template       the id (without #) of template which is already
 *                             in the document between
 *                             <script type="text/template" id="..." /> tag
 *                             or string which contains template
 *     {String} list_pos       Determinates how the list with options should be
 *                             displayed in relation to the dropdown element
 *     Possible values:
 *         - 'left'     the leftedge of the list will stick to the left edge of the dropdown
 *         - 'right'    the right edge of the list will stick to the right edge of the dropdown
 *         - 'center'   the list will be centered relatively to the dropdown
 *
 *     {String} type           Describes which type of the data is displayed inthe dropdown
 *         Possible values:
 *         - 'image'        when user selects some option, the value of this option
 *                          will be added on the $caption elements as a Css class
 *         - 'text'         when user selects some option, the text will be indicated
 *                          in the dropdown
 *         - 'image+text'   (not implemented)
 *     {Boolean} disabled         Determinates if user can change the value or not
 *     {Object} option            Array which contains list of options: [{value : 1, name : 'First option'}]
 *     {Object} exclusions        Array which contains values of the options
 *                                which have to be excluded (disabled on the list)
 *     {String} cid               helps to determinate the button, its something like
 *                                vitrual id, or you can store there some informtaions
 *     {String} class_name        a class name which will be applied on the dropdown, dropdown-list
 *                                and the curtain which is used to close the list
 *     {String} initial_message   a message which is displayed to user when there is no option selected in the dropdown
 *
 *     {Array} tooltips    an array which contains tooltips objects {title: 'tooltip', styles : {width :100}, hide_when_disabled : true}
 *							if settings.toggle is set to false, then only one tooltip will be applied on the button
 *							but if settings.toggle is set to true, tooltips will change accordingly to the settings.state
 *							so: false - first-tooltip, true, second tooltip
 *     {Array} exclude_click_nodes   array of class names of nodes which if are clicked will not trigger value change of the dropdown
 *     {Boolean} repeatable_selection   determinates if options on the list can be selected second time. Example:
 *                                      usually, when option 1 is selected, its impossible to select it once again.
 *
 * Component Events:
 * - dd:change:value   fired when dropdown value is changed
 * - dd:option:click   fired when dropdown list option is clicked
 * - dd:list:show      fired when dropdown list is being shown, callback arguments: $list, _self
 * - dd:list:hide      fired when dropdown list is being hidden, callback arguments: $list, _self
 *
 *
 * ------------------
 * Example 1:
 * ------------------
 *
 * This example shows how easly we can disable options in the dropdown depends
 * on the selected option on the another one
 *
 * var dd_res_demand = CM.register(context, 'demand', $el.find("#dd_res_demand").dropdown({
 *     list_pos : 'center', hover : true, type : 'image', value : 'stone', exclusions : [default_offer_type], template : 'tpl_dd_resources'
 * }));
 *
 * var dd_res_offer = CM.register(context, 'offer', $el.find("#dd_res_offer").dropdown({
 *     list_pos : 'center', hover : true, type : 'image', value : 'wood', template : 'tpl_dd_resources'
 * }).on("dd:change:value", function(e, new_val, old_val) {
 *     _self.dropdowns.dd_res_demand.setExclusions([new_val]);
 * }));
 *
 * ------------------
 * Example 2:
 * ------------------
 *
 * var dd_sort_by = CM.register('dd_sort_by', $("#dd_troops_outside_sort_by").dropdown({
 *     list_pos : 'right',
 *     value : 'origin_town_name',
 *     options : [
 *         {value : 'origin_town_name', name : lang.origin_town_name},
 *         {value : 'destination_town_name', name : lang.destination_town_name},
 *         {value : 'player_name', name : lang.player_name},
 *         {value : 'troop_count', name : lang.troop_count}
 *     ]
 * }).on("dd:change:value", function(e, new_val, old_val) {
 *    //Do something when user select some option
 * }));
 */
(function($) {
    'use strict';

    var close_list_layer_z_index = 2000;

    $.fn.dropdown = function(params) {
        var settings = $.extend(true, {
            default_value: '',
            value: '',
            click: true,
            hover: false,
            template: 'tpl_dd_default',
            list_pos: 'right',
            list_top_pos_pixel: 0,
            type: 'text',
            disabled: false,
            options: [],
            exclusions: [],
            cid: {},
            details: null,
            initial_message: '',
            class_name: '',
            auto_hide_list: true,
            bindings: {
                value: 'value'
            },
            tooltips: [],
            exclude_click_nodes: [],
            exclude_click_nodes_for_hide: [],
            l10n: {},
            id: params.id || null,
            repeatable_selection: false,
            list_z_index: null
        }, params);

        var list_z_index = settings.list_z_index || close_list_layer_z_index;

        var _self = this,
            initial_width,
            //HTML elements
            $el = $(this),
            $list, $caption, $tpl, $empty, $close_list_layer,
            $item_list, $document = $(document);

        //Keeps reference to the tooltip object
        var tooltip;

        /**
         * Binds tooltip to component
         */
        function bindTooltip() {
            var pos = +settings.disabled,
                ttp, ttps = settings.tooltips;

            //Get tooltip
            if (ttps[pos] || ttps.length) {
                ttp = ttps[pos] || ttps[0];
            }

            //if new tooltip is the same as previous or doesn't exist, don't change anything
            if (!ttp || (tooltip && tooltip.xhtml === ttp.title && !ttp.hide_when_disabled)) {
                return;
            }

            //Destroy previous tooltip if exist
            if (tooltip && tooltip.destroy) {
                //Hide tooltip
                tooltip.onOutAnimationComplete();
                //Destroy it
                tooltip.destroy();
            }

            //If button is disabled, and if tooltip should be hidden
            if (settings.disabled && ttp.hide_when_disabled) {
                return;
            }

            //Add new tooltip
            tooltip = new MousePopup(ttp.title, ttp.styles);
            $el.mousePopup(tooltip);
        }

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
                zIndex: list_z_index
            };

            $list.css('z-index', list_z_index + 1);

            $close_list_layer = $('<div class="close_list_layer ' + settings.class_name + '" />').appendTo('body').css(attr).one('click', function() {
                _self.hide();
            });
        }

        /**
         * Checks if the value passed in parameter is excluded or not.
         * (with excluded I mean that whether or not it should be disabled on the list)
         *
         * @param {String|Number} value   the value which have to be checked
         *
         * @return {Boolean}
         */
        function isExcluded(value) {
            var exclusions = settings.exclusions,
                i, l = exclusions.length;

            for (i = 0; i < l; i++) {
                // do not change ==, because of different types
                if (exclusions[i] == value) { // jshint ignore:line
                    return true;
                }
            }

            return false;
        }

        function isInOptions(value) {
            var options = settings.options,
                i, l = options.length;

            for (i = 0; i < l; i++) {
                // do not change ==, because of different types
                if (options[i].value == value) { // jshint ignore:line
                    return true;
                }
            }

            return false;
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $list.off('.dropdown');
            $el.off('.dropdown');

            if (destroy) {
                $el.off('dd:change:value');
                $el.off('dd:list:show');
                $el.off('dd:list:hide');
                $el.off('dd:option:click');

                //Destroy tooltip if exist
                if (tooltip && tooltip.destroy) {
                    tooltip.destroy();
                }
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $el.on('click.dropdown', function( /*e*/ ) {
                if (settings.click) {
                    _self.toggle();
                }
            });

            $el.on('mouseover.dropdown touchstart.dropdown', function( /*e*/ ) {
                if (settings.hover) {
                    _self.show();
                }
            });

            $el.on('mouseout.dropdown', function(e) {
                var $target = $(e.relatedTarget);

                if (settings.hover && !$target.hasClass('close_list_layer') && $target !== $list && !$list.find($target).length && $target !== $el && !$el.find($target).length) {

                    if (settings.auto_hide_list) {
                        _self.hide();
                    }
                }
            });

            $list.on('mouseout.dropdown', function(e) {
                var $target = $(e.relatedTarget);

                if (settings.hover && $target !== $list && !$list.find($target).length && !$('#popup_div_curtain').find($target).length) {
                    if (settings.auto_hide_list) {
                        _self.hide();
                    }
                }
            });

            $list.on('click.dropdown', '.option', function(e) {
                var $current_target = $(e.currentTarget),
                    $target = $(e.target),
                    value = $current_target.attr('name');

                //Its possible to prevent setting value of the dropdown
                //when some specific nodes are clicked
                var exclude_click_nodes = settings.exclude_click_nodes,
                    i, l = exclude_click_nodes.length,
                    set_value = true,
                    hide_on_click = true;

                for (i = 0; i < l; i++) {
                    if ($target.hasClass(exclude_click_nodes[i])) {
                        set_value = false;
                    }
                }

                if (!isExcluded(value)) {
                    if (set_value) {
                        _self.setValue(value, {
                            force: settings.repeatable_selection
                        });
                    }

                    l = settings.exclude_click_nodes_for_hide.length;
                    for (i = 0; i < l; i++) {
                        if ($target.hasClass(settings.exclude_click_nodes_for_hide[i])) {
                            hide_on_click = false;
                        }
                    }

                    if (hide_on_click && settings.auto_hide_list) {
                        _self.hide();
                    }

                    $el.trigger('dd:option:click', [_self, e, 'notexcluded', value]);
                } else {
                    $el.trigger('dd:option:click', [_self, e, 'excluded', value]);
                }
            });
        }

        function callOnInit() {
            var start_pos = $list.position(),
                start_display = $list.css('display');

            //Components which are initialized in on the list, can not calculate
            //sizes of HTML elements correctly, because they are hidden
            $list.css({
                display: 'block',
                left: 50000
            });

            if (typeof settings.onInit === 'function') {
                settings.onInit.call(_self, $list);
            }

            $list.css({
                display: start_display,
                left: start_pos.left
            });
        }

        function rerenderList() {
            var $temp = $('<div></div>');
            //Render template once again in memory
            $temp.html(us.template($tpl, settings));

            //Update list with new items
            $list.html($temp.find('.dropdown-list').html());

            callOnInit();
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            if (settings.template !== 'internal') {
                $tpl = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();

                //Append template to main container
                $el.html(us.template($tpl, settings));
            }

            $list = $el.find('.js-dropdown-list, .dropdown-list');
            $caption = $el.find('.caption');
            $empty = $el.find('.js-empty');
            $item_list = $el.find('.js-dropdown-item-list, .item-list');

            var id = $el.attr('id');

            if (!id) {
                throw 'Hey, Dev! Please specify ID for this dropdown, its necessary!';
            }

            //When user will click on the tab to refresh the list will be duplicated
            var $exist = $('#' + id + '_list');

            if (!$exist.length) {
                //Take the list element and append it to the body
                $list.appendTo('body').attr('id', id + '_list');
            } else {
                $list = $exist;
            }

            $el.addClass(settings.class_name);
            $list.addClass(settings.class_name);

            //Bind events
            bindEvents();
        }

        /**
         * This function selects option depends on the settings.value, and also
         * checks which options should be disabled, and make that changes visible
         * to user. If currently selected option just has been excluded, the next
         * free option will be taken at its place.
         *
         * TODO think about renaming the value to something more speaking like selected_value
         * TODO think about splitting up function into multiple sub functions
         *
         * @param {String|Number} value  the value of the option which will be
         *                               selected in the dropdown component
         */
        function selectOption(value) {
            var $option, type = settings.type,
                option_value,
                not_excluded, set_different_val = false,
                caption;

            //Change caption depends on the dropdown type
            switch (type) {
                case 'image':
                    $caption.removeClass().addClass('caption ' + value);
                    break;
                case 'text':
                    caption = settings.options.searchFor(settings.bindings.value, value);

                    if (caption.length) {
                        $caption.text(caption[0].name);
                        hideInitialMessage();
                    } else {
                        if (value === '') {
                            $empty.html(settings.initial_message);
                            showInitialMessage();
                        }
                    }

                    break;
                case 'no_caption_update':

                    break;
            }

            //Search through all options
            $list.find('.option').each(function() {
                $option = $(this);
                option_value = $option.attr('name');

                //Remove these classes from all elements to be able to apply them
                //only on specific items
                // TODO find out why disabled needs to be removed - and add comment why its necessary
                $option.removeClass('selected disabled');

                //Check if the option is excluded
                if (isExcluded(option_value)) {
                    $option.addClass('disabled');

                    //We store information in 'name' attribute, so number will become string (do not change ==)
                    if (option_value == value) { // jshint ignore:line
                        set_different_val = true;
                    }
                } else {
                    // TODO add comment that it is ok to overwrite
                    not_excluded = option_value;

                    //We store information in 'name' attribute, so number will become string (do not change ==)
                    if (option_value == value) { // jshint ignore:line
                        $option.addClass('selected');
                    }
                }
            });

            //If the current selected option has been excluded, take another one
            if (set_different_val) {
                _self.setValue(not_excluded, {
                    silent: true
                });
            } else {
                if (!isInOptions(value)) {
                    _self.setValue(settings.default_value, {
                        not_existing_value: true
                    });
                }
            }
        }

        /**
         * Disables or enables component, also adds "disabled" class to the root node
         * so the component can be skinned
         *
         * @param {Boolean} bool   Determinates if component is enabled or not
         */
        function disable(bool) {
            settings.disabled = bool;

            $el.toggleClass('disabled', bool);

            //Update tooltips
            bindTooltip();
        }

        // TODO add doc comment pls
        function updateDropDownListSize() {
            $list.css({
                width: 'auto'
            });

            var new_width = Math.max(
                $el.outerWidth(true),
                $list.hiddenOuterWidth(true),
                initial_width
            );

            $list.setOffsetWidth(new_width);
        }

        // TODO add doc comment pls
        // TODO might split the function into more sub functions
        function updateDropDownListPosition() {
            var width = $el.outerWidth(true),
                height = $el.outerHeight(true),
                list_pos = settings.list_pos,
                list_top_pos_pixel = settings.list_top_pos_pixel,
                offset = $el.offset(),
                mod_top = height - 1 + list_top_pos_pixel,
                mod_left = 0,
                list_height = $list.outerHeight(true) * Game.ui_scale.factor,
                list_width = $list.outerWidth(true) * Game.ui_scale.factor,
                list_left,
                list_top,
                list_bottom,
                list_right;

            switch (list_pos) {
                case 'center':
                    mod_left = -((list_width - width) / 2);
                    break;
                case 'left':
                    // Do nothing
                    break;
                case 'right':
                    mod_left = width - list_width;
                    break;
            }

            list_left = offset.left + mod_left;
            list_right = list_left + list_width;
            list_top = offset.top + mod_top;
            list_bottom = list_top + list_height;

            // Check if dropdown is not going out of the viewport
            var d_width = $document.outerWidth(true) * Game.ui_scale.factor,
                d_height = $document.outerHeight(true) * Game.ui_scale.factor;

            // Lest skip checking whether the list is cut on the top, because list
            // opens always below the "dropdown" element, so technically it can not happen

            // When list goes out of the right border
            if (list_right > d_width) {
                list_left -= list_right - d_width;
            }

            // When list goes out of the left border
            if (list_left < 0) {
                list_left = 0;
            }

            // Scale list top here in case it must be overridden
            list_top = list_top * Game.ui_scale.normalize.factor;

            // When list goes out of the bottom border
            if (list_bottom > d_height) {
                // Check if it's possible to move it above the dropdown
                if (offset.top - list_height > 0) {
                    list_top = offset.top * Game.ui_scale.normalize.factor - list_height;
                }
                // Just put it on the bottom border
                else {
                    // TODO add better explanation what is happening here
                    // TODO add warning for possible bug since that might still not fit
                    // TODO rewrite the line into a more easily way
                    // list_top = list_top - (list_bottom - d_height);
                    list_top -= list_bottom - d_height;
                }
            }

            $list.css({
                top: list_top,
                left: list_left * Game.ui_scale.normalize.factor,
                marginLeft: 0
            });
        }

        /**
         * Makes dropdown list element visible or not, depends on the previous state.
         * If the "display" parameter is specified, then it will force to display
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

            var initial_display = $list.css('display');

            $list.addClass('active');

            updateDropDownListSize();
            updateDropDownListPosition();

            $list[display ? 'show' : 'toggle']();

            if (settings.click && !settings.hover) {
                if ($list.css('display') === 'none') {
                    destroyCloseListLayer();
                } else {
                    createCloseListLayer();
                }
            }

            if (!display || initial_display === 'none') {
                $el.trigger($list.css('display') === 'none' ? 'dd:list:hide' : 'dd:list:show', [$list, _self]);
            }

            return this;
        };

        /**
         * Shows list with options
         *
         * @return {Object}  jQuery Component Object
         */
        this.show = function() {
            $el.addClass('active');

            this.toggle(true);

            return this;
        };

        /**
         * Hides list with options
         *
         * @return {Object}  jQuery Component Object
         */
        this.hide = function() {
            $el.removeClass('active');
            $list.removeClass('active');

            $list.hide();

            if (settings.click) {
                destroyCloseListLayer();
            }

            $el.trigger('dd:list:hide', [$list, _self]);

            return this;
        };

        /**
         * Sets value of the dropdown
         * @todo make clear that this sets the selected value of the list
         *
         * @param {String|Number} value   value of the option which should be selected
         * @param {Object} props          contains additional settings for the function
         * Possible values:
         *     {Boolean} silent   determinates if the 'dd:change:value' event has to be fired or not
         *
         *
         * @return {Object}  jQuery Component Object
         */
        this.setValue = function(value, props) {
            props = props || {};

            var curr_val = settings.value;

            if ((curr_val !== value) || props.force) {
                settings.value = value;
                selectOption(value);

                if (!props.silent) {
                    $el.trigger('dd:change:value', [value, curr_val, this, props]);
                }
            }

            return this;
        };

        /**
         * Returns value of the currently selected option
         *
         * @return {String|Number}
         */
        this.getValue = function() {
            return settings.value;
        };

        this.resetValue = function(props) {
            this.setValue(settings.default_value, props);

            return this;
        };

        /**
         * get current option
         *
         * @return {object}
         */
        this.getCurrentOption = function() {
            var current_option = settings.options.searchFor('value', this.getValue());
            if (current_option) {
                return current_option.pop();
            }

            return null;
        };

        /**
         * get option
         *
         * @return {object}
         */
        this.getOption = function(property_name, property_value) {
            var option = settings.options.searchFor(property_name, property_value);

            if (option) {
                return option.pop();
            }

            return null;
        };

        /**
         * Changes available list of options in component
         *
         * @param {Object} options   (@see for data structure see examples above)
         *
         * @return {Object}  jQuery Component Object
         */
        this.setOptions = function(options) {
            settings.options = options;

            rerenderList();
            selectOption(settings.value);

            updateDropDownListSize();
            updateDropDownListPosition();

            return this;
        };

        this.updateDropDownListSize = function() {
            updateDropDownListSize();
        };

        this.rerenderList = function() {
            rerenderList();
        };

        this.getList = function() {
            return $list;
        };

        this.getOptions = function() {
            return settings.options.clone();
        };

        /**
         * Sets which options should be excluded
         *
         * @param {Object} exclusions   Array which contains values of the options
         *								which have to be excluded (disabled on the list)
         *
         * @return {Object}  jQuery Component Object
         */
        this.setExclusions = function(exclusions) {
            settings.exclusions = exclusions;
            selectOption(settings.value);

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

        this.getDetails = function() {
            return settings.details;
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
         * Disables dropdown component
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);

            return this;
        };

        /**
         * Enables dropdown component
         *
         * @return {Object}  jQuery Component Object
         */
        this.enable = function() {
            disable(false);

            return this;
        };

        this.getListElement = function() {
            return $list;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Unbind all events
            unbindEvents(true);

            destroyCloseListLayer();

            //Remove list node
            $('#' + $el.attr('id') + '_list').remove();
        };

        /**
         * @protected
         */
        this.__recalculateInitialWidth = function() {
            $list.css({
                width: 'auto'
            });
            initial_width = $list.hiddenOuterWidth(true);
        };

        /**
         * Initiates component
         */
        (function() {
            loadTemplate();

            disable(settings.disabled);

            //Execute even the "value" is not set, because this function will also
            //disable excluded options
            selectOption(settings.value);

            initial_width = $list.hiddenOuterWidth(true);

            callOnInit();

            bindTooltip();
        }());

        return this;
    };
}(jQuery));
// jshint ignore: end