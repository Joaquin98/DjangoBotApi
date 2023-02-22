/**
 * It's a jQuery component which handles scrolling of big amounts of data (like Mass recruit).
 * Displayes rows only in the narrow viewport to keep the performace on the high level.
 *
 * @param params
 *    {Number} page                 number of the currently displayed page
 *    {Number} per_page             determinates the number of rows on the single page
 *    {Number} page_offset          determinates how many pages around the currently displayed
 *                                  pages will be render to make scrolling smooth
 *    {Object} items                an array which contains items which have to be displayed on the list
 *    {Number} items_count          keeps information how many items are in 'settings.items' array
 *    {Number} item_height          vertical size of the single row (height) in pixels
 *    {String} template             template for single row
 *    {String} template_item_name   name which is used in template for single item
 *    {Object} template_data        keeps additional data which is passed during rendering template
 *
 * @return {Object}  jQuery Component Object
 *
 * Component Events:
 * - scroller:change:page   fired when page number has changed
 */

(function($) {
    'use strict';

    //It keeps unique identifier for scrollers
    $.fn.scroller_counter = 0;

    $.fn.scroller = function(params) {
        //Unique id
        var uid = ++$.fn.scroller_counter;

        var settings = $.extend({
            disabled: false,
            //Current page
            page: 1,
            //Items per page
            per_page: 2,
            //how many pages before and after should be also rendered
            page_offset: 2,
            row_identifier: 'town_id',
            //Keeps items which have to be displayed
            items: [],
            //Keeps information how many items are in 'items'
            items_count: 0,
            //Vertical size in pixels of row
            item_height: 104,
            selected_item_height: 104,
            //Template for single row
            template: null,
            //name which is used in template for single item
            template_item_name: '',
            //keeps additional date which is passed during rendering template
            template_data: {},

            template_item_init: null,
            template_item_deinit: null,

            on_click_selector: '',

            //An element we will listen the 'scroll' event on
            $scroll_event_keeper: []
        }, params);

        var _self = this,
            $el = $(this),
            $scroll_event_keeper = settings.$scroll_event_keeper.length ? settings.$scroll_event_keeper : $el;

        var free_hepler_rows = [],
            taken_helper_rows = {},
            taken_helper_rows_swap = {};

        var precompiled_template;

        var edge_items;
        var skip_calculations = settings.selected_item_height === settings.item_height;

        /**
         * Renders items on the list
         *
         * @param {Boolean} force   if true, script will rerender all nodes from scratch
         *							otherwise nodes which are already rendered will be
         *							detected and ommited
         */
        function renderItems(force) {
            var i, id, el, page_offset = settings.page_offset,
                items_count = settings.items_count,
                item_height = settings.item_height,
                height_diff = settings.selected_item_height - item_height,
                start = Math.max(0, edge_items.first_item - page_offset), //Math.max((page - 1) * per_page - page_offset, 0),
                offset = Math.min(items_count, edge_items.last_item + page_offset), //Math.min(page * per_page + page_offset, items_count),
                row_id;

            var data = settings.template_data,
                init_fn = settings.template_item_init,
                deinit_fn = settings.template_item_deinit;

            //Getting additional nano seconds :D
            var is_deinit_fn = typeof deinit_fn === 'function',
                is_init_fn = typeof init_fn === 'function';

            var item, items = settings.items,
                selected = 0,
                is_selected,
                row_identifier = settings.row_identifier; //It seems that its used only in attack planner

            //Move all taken nodes to swap array
            taken_helper_rows_swap = $.extend({}, taken_helper_rows);

            //Reset taken helper rows
            taken_helper_rows = {};

            //quickly check which nodes can stay, and which can be used for new node
            //if 'force' is true, then all nodes will be rerendered
            if (!force) {
                for (i = start; i < offset; i++) {
                    //already rendered, can stay
                    if (taken_helper_rows_swap[i]) {
                        taken_helper_rows[i] = taken_helper_rows_swap[i];
                        delete taken_helper_rows_swap[i];
                    }
                }
            }

            //Reset rest of nodes and put them to reuse array
            for (id in taken_helper_rows_swap) {
                if (taken_helper_rows_swap.hasOwnProperty(id)) {
                    el = taken_helper_rows_swap[id];
                    el.style.display = 'none';
                    el.className = 'hepler_row';

                    free_hepler_rows[free_hepler_rows.length] = el;

                    delete taken_helper_rows_swap[id];

                    if (is_deinit_fn) {
                        deinit_fn($(el), 'js-scope_row_' + uid + '-' + id);
                    }
                }
            }

            //Render rows
            for (i = 0; i < items_count; i++) {
                item = items[i];
                is_selected = item.selected;

                //Skip rows which are already taken, we don't want to rewrite the same rows twice
                if (!taken_helper_rows[i] && i >= start && i < offset) {
                    el = free_hepler_rows.pop();
                    row_id = 'js-scope_row_' + uid + '-' + i;

                    data[settings.template_item_name] = item;
                    data.index = i;
                    data.row_id = row_id;

                    el.style.top = (i * item_height + selected * height_diff) + 'px';
                    el.style.display = 'block';
                    el.setAttribute('data-' + row_identifier, item[row_identifier]);
                    el.className = 'hepler_row' + (is_selected ? ' selected' : '');

                    el.innerHTML = precompiled_template(data);

                    /*if (is_deinit_fn && !is_selected && items[i].previously_selected) {
                    	deinit_fn($(el), row_id);
                    }*/

                    if (is_init_fn) {
                        init_fn($(el), row_id, item[row_identifier], is_selected, item);
                    }

                    taken_helper_rows[i] = el;
                }

                if (is_selected) {
                    selected++;
                }
            }

            //No results found
            $el.toggleClass('js-empty', !offset);
        }

        function calculateEdgeItems() {
            var scroll_top = $scroll_event_keeper.scrollTop(),
                container_height = $scroll_event_keeper.height(),
                viewport_end = scroll_top + container_height,

                items = settings.items,
                i, l = items.length,
                pos = 0,
                visible_first, visible_last,
                selected_item_height = settings.selected_item_height,
                item_height = settings.item_height;

            if (skip_calculations) {
                visible_first = parseInt(scroll_top / item_height, 10);
                visible_last = Math.ceil((scroll_top + container_height) / item_height, 10);
            } else {
                for (i = 0; i < l; i++) {
                    if (pos <= scroll_top) {
                        visible_first = i + 1;
                    }

                    if (pos < viewport_end) {
                        visible_last = i + 1;
                    }

                    pos += items[i].selected ? selected_item_height : item_height;
                }
            }

            return {
                first_item: visible_first,
                last_item: visible_last
            };
        }

        function checkForSelected() {
            var items = settings.items,
                i, l = items.length,
                counter = 0;

            for (i = 0; i < l; i++) {
                if (items[i].selected) {
                    counter++;
                }
            }

            return counter;
        }

        /**
         * Scroll simulator is a html node which resizes container to the size
         * which would be taken if we had rendered all elements. It makes user to feel
         * he is using a normal list, but we render only rows for the current viewport
         */
        function initializeScrollSimulator() {
            var num_of_sel_items = checkForSelected(),
                size = settings.item_height * settings.items_count + (settings.selected_item_height - settings.item_height) * num_of_sel_items;

            $el.find('.scroll_simulator').css({
                height: size
            });
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $scroll_event_keeper.off('.scroller' + uid);
            $el.off('.scroller' + uid);

            if (destroy) {
                $el.off('scroller:item:click, scroller:change:page');
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            unbindEvents();

            $scroll_event_keeper.on('scroll.scroller' + uid, function(e) {
                var old_page, new_page;

                edge_items = calculateEdgeItems();
                old_page = settings.page;
                new_page = parseInt(edge_items.last_item / Math.max(1, settings.per_page - 3), 10);

                //If there was a move between pages
                if (new_page !== old_page) {
                    settings.page = new_page;

                    renderItems();

                    $el.trigger('scroller:change:page', [_self, new_page, old_page]);
                }
            });

            $el.on('click.scroller' + uid, '.hepler_row ' + settings.on_click_selector, function(e) {
                var $row = $(e.currentTarget);

                $el.trigger('scroller:item:click', [_self, e, $row]);

                initializeScrollSimulator();
            });
        }

        /**
         * Prepares html elements which are used as rows, and parsed template is
         * loaded to them.
         */
        function prepareElements() {
            //Prepare stuff
            var i, l, el,
                fragment = document.createDocumentFragment();

            l = skip_calculations ? Math.max(0, settings.per_page * (1 + settings.page_offset * 2) - $el.find('.hepler_row').length) :
                Math.max(0, settings.per_page + settings.page_offset * 2 - $el.find('.hepler_row').length);

            for (i = 0; i < l; i++) {
                el = document.createElement('div');
                el.className = 'hepler_row';
                el.style.display = 'none';
                fragment.appendChild(el);

                free_hepler_rows[free_hepler_rows.length] = el;
            }

            $el.append(fragment);
        }

        /**
         * When new settings.items are specified, we have to reset all current
         * helper rows, calculate how many items are in the array, scroll list
         * to the top and prepare correct number of helper rows
         */
        function reset(dont_scroll) {
            free_hepler_rows = $el.find('.hepler_row').toArray();

            var i = free_hepler_rows.length,
                row;

            while (i--) {
                row = free_hepler_rows[i];

                row.innerHTML = '';
                row.style.display = 'none';
                row.className = 'hepler_row';
            }

            taken_helper_rows = {};
            taken_helper_rows_swap = {};

            //Determinate how many items do we have
            settings.items_count = settings.items.length;

            if (!dont_scroll) {
                $scroll_event_keeper.scrollTop(0);
            }

            prepareElements();
            initializeScrollSimulator();
        }

        /**
         * Disables component (I think its not implemented)
         */
        function disable(bool) {
            settings.disabled = bool;

            $el.toggleClass('disabled', bool);
        }

        /**
         * Returns number of rows which are displayed on the single page
         *
         * @return {Number}
         */
        this.getPerPage = function() {
            return settings.per_page;
        };

        /**
         * Returns total number of rows which are specified for this list
         *
         * @return {Number}
         */
        this.getItemsCount = function() {
            return settings.items_count;
        };

        /**
         * Returns vertical size of the single row in pixels
         *
         * @return {Number}
         */
        this.getItemHeight = function() {
            return settings.item_height;
        };

        /**
         * Allows to change items which are displayed in the .scroller
         */
        this.setItems = function(items, dont_scroll) {
            //Save new imtes
            settings.items = items;

            //Change currently displayed page to first one
            if (!dont_scroll) {
                settings.page = 1;
            }

            //Reset .scroller
            reset(dont_scroll);

            //Render new items
            renderItems();
        };

        /**
         * Rerenders current viewport
         *
         * @return {Object}  jQuery Component Object
         */
        this.rerender = function(props) {
            props = props || {};

            renderItems(true);

            if (props.reinitialize_scrollbar) {
                initializeScrollSimulator();
            }

            return this;
        };

        /**
         * Updates settings.template_date object with new data
         *
         * @return {Object}  jQuery Component Object
         */
        this.updateTemplateData = function(attr, value) {
            var data = settings.template_data;

            if (data.hasOwnProperty(attr)) {
                data[attr] = value;
            } else {
                throw 'You want to update Template Data for undefined attribute';
            }

            return this;
        };

        /**
         * Rerenders single row
         *
         * @param {String} row_id   unique id specified for each row
         *
         * @return {Object}  jQuery Component Object
         */
        this.rerenderItem = function(row_id) {
            //take the concrete number
            var index = row_id.split('-')[2];

            var $row = $el.find('.' + row_id).parent(),
                data = settings.template_data,
                init_fn = settings.template_item_init,
                deinit_fn = settings.template_item_deinit,
                item = settings.items[index];

            if (!$row.length) {
                return;
            }

            //Deinitialize components for the row
            if (typeof deinit_fn === 'function') {
                deinit_fn($row, row_id);
            }

            //Prepare data
            data[settings.template_item_name] = item;
            data.row_id = row_id;
            data.index = index;
            data.is_selected = item.selected;

            //Load template
            $row.html(precompiled_template(data));

            //Initialize components
            if (typeof init_fn === 'function') {
                init_fn($row, row_id, item[settings.row_identifier]);
            }
        };

        /**
         * Disables button (Not implemented I think)
         *
         * @return {Object}  jQuery Component Object
         */
        this.disable = function() {
            disable(true);

            return this;
        };

        /**
         * Enables button (Not implemented I think)
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
            //Unbind all events from the main node
            unbindEvents(true);
        };

        //Initialization
        (function() {
            if (settings.item_height > settings.selected_item_height) {
                throw 'Scroller Component: "item_height" can not be smaller than "selected_item_height"';
            }

            //Determinate how many items do we have
            settings.items_count = settings.items.length;

            //Prerended template
            precompiled_template = us.template(settings.template);

            edge_items = calculateEdgeItems();

            prepareElements();
            initializeScrollSimulator();

            bindEvents();

            renderItems();

            disable(settings.disabled);
        }());

        return this;
    };
}(jQuery));