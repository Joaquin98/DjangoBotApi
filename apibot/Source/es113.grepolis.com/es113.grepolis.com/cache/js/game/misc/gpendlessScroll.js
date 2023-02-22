/**
 * GPEndlessScroll -- can receive a set of options (args). Some of them are optional, others are importent and must be given.
 *
 * important parameters:
 * @param elem_id <String> element id which endless scroller will be bound on
 * @param controller <String> controller where the ajax request goes to
 * @param action <String> action to call
 * @param limit <Integer> number of elements to fetch
 *
 * optional parameters:
 * @param insert_elem_id <String> element id where the data should be inserted (i.e. ES is bound to table, insert elements into tbody)
 * @param window_handle <Object> Window handle for the loader. Takes layout if no handle is defined.
 * @param first_element <Integer> First data element. Usually 0 if not set.
 * @param last_element <Integer> Number of last data element or number of elements total. This is required if started in the middle of a dataset. It will be set by the first scroll action auomatically.
 * @param callback <Function> callback function. Executed after elements are fetched
 * @param args <Object> additional options for the action (i.e. search terms)
 * @param ttl <Integer> time in seconds for the data to be stored in localstore. 600 by default
 *
 *
 */
(function() {
    'use strict';

    function GPEndlessScroll(args) {
        // Set default values to args
        if (args.insert_elem_id == null) {
            args.insert_elem_id = args.elem_id;
        }
        if (!args.limit) {
            args.limit = 35;
        }
        if (!args.ttl) {
            args.ttl = 600; // default ttl 10 minutes
        }
        if (!args.window_handle) {
            args.window_handle = Layout;
        }
        if (!args.rowspan) {
            args.rowspan = false;
        }

        function getLastStartElement(last_element, limit) {
            var last_start_element = last_element % limit;
            last_start_element = last_element - (last_start_element > 0 ? last_start_element : limit);
            return last_start_element;
        }

        // local settings
        var ajaxloader = new GPAjax(args.window_handle, true),
            atBoF = typeof args.first_element == 'undefined' ? true : args.first_element <= args.limit,
            start_element = atBoF == false ? args.first_element - (args.first_element % args.limit) : 0,
            last_start_element = getLastStartElement(args.last_element, args.limit),
            atEoF = last_start_element == start_element,
            EOF = atEoF == true ? true : false,
            BOF = atBoF == false ? false : true, // atBoF can be null or undefined
            new_start_element = 0,
            ajax_data,
            es_pagination_id = args.es_pagination_id == 'undefined' ? 'es_pagination' : args.es_pagination_id,
            fpen = args.first_element, // first page element, used to calculate the page
            elem = $('#' + es_pagination_id + ' .es_page_input');

        EndlessScroll.prev_scroll_direction[args.elem_id] = 'none';

        // set start page
        if (elem) {
            var start_page = Math.ceil((start_element + 1) / args.limit);
            elem.val(start_page);
        }

        $('#' + args.insert_elem_id).children().addClass('bottom');

        // bind jump page trigger
        $(document).off('es_jump_' + args.elem_id); // unbind all trigger first
        $(document).on('es_jump_' + args.elem_id, function(evt, data) {
            atBoF = data.page == 1;
            start_element = data.start_element;
            last_start_element = getLastStartElement(data.last_element, data.limit);
            atEoF = last_start_element == start_element;
            EOF = atEoF == true ? true : false;
            BOF = atBoF == false ? false : true;
            EndlessScroll.prev_scroll_direction[args.elem_id] = 'none';
            fpen = data.first_element;
        });

        var that = this,
            es_object = {
                insert_elem_id: args.insert_elem_id,
                rowspan: args.rowspan,
                pixelOffset: args.pixelOffset ? args.pixelOffset : 1,
                start_page: start_page,

                /**
                 * Callback function executed by jquery.gp_endless-scroll
                 *
                 * @params isScrollDown <Boolean> true if scrolling down, false otherwise
                 */
                callback: function(isScrollDown) {
                    EndlessScroll.lock();

                    var ls_key,
                        ls_store_key,
                        scroll_direction = isScrollDown ? 'down' : 'up';

                    if (isScrollDown) {
                        //No more data available, do not send a request
                        if (EOF == true) {
                            EndlessScroll.unlock();
                            return false;
                        }

                        new_start_element = start_element + (EndlessScroll.prev_scroll_direction[args.elem_id] != 'up' ? 1 : 2) * args.limit;
                        ls_store_key = 'es_' + args.elem_id + '_' + (EndlessScroll.prev_scroll_direction[args.elem_id] == 'up' ? start_element : (start_element - args.limit));
                    } else {

                        //No more data available, do not send a request
                        if (BOF == true) {
                            EndlessScroll.unlock();
                            return false;
                        }

                        new_start_element = start_element - (EndlessScroll.prev_scroll_direction[args.elem_id] != 'down' ? 1 : 2) * args.limit;
                        ls_store_key = 'es_' + args.elem_id + '_' + (EndlessScroll.prev_scroll_direction[args.elem_id] == 'up' ? (start_element + args.limit) : start_element);
                    }

                    ls_key = 'es_' + args.elem_id + '_' + new_start_element;
                    that.getData(ls_key, ls_store_key, new_start_element, scroll_direction);

                    return {
                        visible_height: $('#' + args.elem_id).height(),
                        inner_elem_id: args.insert_elem_id,
                        pagination_elem_id: es_pagination_id
                    }; // TODO: do we need this??
                }
            };

        /**
         * Returns data for the scroll area. Tries to get data from localstore and if
         * not found, requests them via AJAX
         *
         * @param ls_key <String> key for localstore
         * @param ls_store_key <String> key for storing new data into localstore
         * @param new_start_element <Integer> number of the new start element
         * @param scroll_direction <String> indicates the current scroll direction
         */
        this.getData = function(ls_key, ls_store_key, new_start_element, scroll_direction) {
            LocalStore.get(ls_key, function(ok, data) {
                if (ok) {
                    debug('got data from ls with key: ' + ls_key);

                    // prepare data for insertion
                    if (data.length !== 0) {
                        var scroll_options = {
                            start_element: new_start_element,
                            elements_length: $(data).length,
                            view: data
                        };
                        scroll_direction == 'up' ? that.scrollUp(scroll_options, ls_store_key) : that.scrollDown(scroll_options, ls_store_key);
                        EndlessScroll.unlock();
                    }
                } else {
                    // if data not found or no local storage available, request via ajax
                    ajax_data = {
                        start_element: new_start_element,
                        limit: args.limit,
                        scroll_direction: 'top',
                        refetch: 1,
                        es_args: args.es_args
                    };
                    if (typeof args.args != 'undefined' && args.args != null && args.args != '') {
                        ajax_data.es_args = args.args;
                    }

                    ajaxloader.ajaxGet(args.controller, args.action, ajax_data, true, function(_data, _flag) {
                        data = _data;
                        if (data.length !== 0) {
                            scroll_direction == 'up' ? that.scrollUp(data, ls_store_key) : that.scrollDown(data, ls_store_key);
                        }
                        EndlessScroll.unlock();
                    });
                }
            });
        };

        /**
         * Handle scrolling down
         *
         * @param <Object> data
         * @param <String> ls_key localstore key
         */
        this.scrollDown = function(data, ls_key) {
            EOF = data.elements_length < args.limit || (data.start_element == last_start_element); // first condition unnecessary? TODO: check
            start_element = data.start_element;

            // remove old lines
            var sum_lines_to_remove = $('#' + args.insert_elem_id + ' .top').length;

            if (sum_lines_to_remove > 0) {
                // Try to store data
                var sum_top_elements_height = that.getSumElementsHeight(args.insert_elem_id, '.top'),
                    old_scroll_position = $('#' + args.elem_id).scrollTop(),
                    elm = $('#' + args.insert_elem_id + ' .top').remove(),
                    ls_data = elm.wrapAll('<table id="' + ls_key + '"><tbody></tbody></table>').parent().html();

                debug('store data into ls with key: ' + ls_key);

                LocalStore.set(ls_key, ls_data, args.ttl);
                $('#' + ls_key).remove();
                BOF = false;
            }

            // mark current lines as old
            $('#' + args.insert_elem_id + ' .bottom').toggleClass('bottom top');

            // if data came from local store, all elements may have the class bottom or top, so set correct class here
            var ins_data = $(data.view);
            if (ins_data.hasClass('top')) {
                ins_data.toggleClass('top bottom');
            }

            // append data
            $("#" + args.insert_elem_id).append(ins_data);
            $('#' + args.insert_elem_id).children().not('.top').addClass('bottom');
            $('.bottom').show();

            if (sum_lines_to_remove > 0) {
                $('#' + args.elem_id).scrollTop(that.scrollPos(true, sum_top_elements_height, old_scroll_position));
                EndlessScroll.correctlastScrollPosition(args.elem_id, true);
                fpen += args.limit;
            }

            EndlessScroll.prev_scroll_direction[args.elem_id] = 'down';

            if (typeof args.callback == 'function') {
                args.callback(args, data, true);
            }
        };

        /**
         * Handle scrolling up
         *
         * @param <Object> data
         * @param <String> ls_key localstore key
         */
        this.scrollUp = function(data, ls_key) {
            start_element = data.start_element;

            if (data.start_element <= 0) {
                BOF = true;
            }

            // remove old lines
            var sum_bottom = $('#' + args.insert_elem_id + ' .bottom').length,
                sum_top = $('#' + args.insert_elem_id + ' .top').length;

            if (sum_bottom > 0 && sum_top > 0) {
                // Try to store data
                var elm = $('#' + args.insert_elem_id + ' .bottom').remove(),
                    ls_data = elm.wrapAll('<table id="' + ls_key + '"><tbody></tbody></table>').parent().html();

                $('#' + ls_key).remove();
                debug('store data into ls with key: ' + ls_key);

                LocalStore.set(ls_key, ls_data, args.ttl);
                EOF = false;
            }

            var old_scroll_position = $('#' + args.insert_elem_id).scrollTop();

            // mark current lines as old
            $('#' + args.insert_elem_id + ' .top').toggleClass('bottom top');

            // if data came from local store, all elements may have the class bottom or top, so set correct class here
            var ins_data = $(data.view);
            if (ins_data.hasClass('bottom')) {
                ins_data.toggleClass('top bottom');
            }

            $("#" + args.insert_elem_id).prepend(ins_data);
            $('#' + args.insert_elem_id).children().not('.bottom').addClass('top');
            $('.top').show();

            if (sum_bottom > 0) {
                var sum_top_elements_height = that.getSumElementsHeight(args.insert_elem_id, '.top');

                $('#' + args.elem_id).scrollTop(that.scrollPos(false, sum_top_elements_height, old_scroll_position));
                EndlessScroll.correctlastScrollPosition(args.elem_id, false);
                fpen = start_element;
            }

            EndlessScroll.prev_scroll_direction[args.elem_id] = 'up';

            if (typeof args.callback == 'function') {
                args.callback(args, data, false);
            }
        };

        /**
         * Calculate a new position for scroll bar. If the element height and/or number of inserted and removed
         * elements differ, we need to recalculate the position of the scrollbar.
         *
         * @param isScrollDown <Boolean> Scroll direction
         * @param sum_top_elements_height <Integer> total height of top page
         * @param old_scroll_position <Integer> old position of scroll bar
         *
         * @return new_scroll_pos <Integer> new scroll position
         */
        this.scrollPos = function(isScrollDown, sum_top_elements_height, old_scroll_position) {
            return isScrollDown ? old_scroll_position - sum_top_elements_height : old_scroll_position + sum_top_elements_height;
        };

        /**
         * Get the total elements height
         *
         * @param insert_elem_id <String> element id where data are inserted
         * @param childClass <String> child class
         *
         * @return sum_elm_height <Integer> total element height
         */
        this.getSumElementsHeight = function(insert_elem_id, childClass) {
            var sum_elm_height = 0;

            $('#' + insert_elem_id).children(childClass).each(function(key, elem) {
                sum_elm_height += $(elem).outerHeight();
            });
            return sum_elm_height;
        };

        // bind endless scrolling to element
        $('#' + args.elem_id).endlessScroll(es_object);
    }

    window.GPEndlessScroll = GPEndlessScroll;
}());