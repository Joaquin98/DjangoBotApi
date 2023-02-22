/**
 * GPEndless Scroll
 *
 * Fetches new data via AJAX when scrolling down or up. Remove old data to keep list clear.
 * --Uses Localstore to cache data
 * --Can execute a callback function at end of scrolling
 * --Virtually paginates data, so user can access any part of data fast
 *
 * Part 1: EndlessScroll - Globally used functions for endless scrolling
 * Part 2: GPEndlessScroll - Endless scroller class
 *
 * TODO: Description how to embedd endless scrolling
 */

(function() {
    'use strict';

    var EndlessScroll = {

        paginate: false,
        locked: false,
        page_locked: false,
        prev_scroll_direction: {},

        /**
         * Locking utility functions. Lock is needed to avoid multiple page calculations
         * at once when scrolling very fast up and down
         */
        lock: function() {
            this.locked = true;
        },
        unlock: function() {
            this.locked = false;
        },
        isLocked: function() {
            return this.locked;
        },
        lockPage: function() {
            this.page_locked = true;
        },
        unlockPage: function() {
            this.page_locked = false;
        },
        isPageLocked: function() {
            return this.page_locked;
        },

        /**
         * Fetch and display a specific page. User can enter a page number he wants to jump to
         *
         * @param args <Object> A set of arguments
         * @param es_pagination_id <String> html-element id for endless-scroll pagination
         * @param parent_html_elem_id <String> parent element id where new es-elements should be inserted
         * @param update_inner <boolean> true if inner element should be updatede, false otherwise
         */
        jumpToPage: function(args, es_pagination_id, parent_html_elem_id, update_inner) {
            EndlessScroll.lock();

            var page = $('#' + es_pagination_id + ' .es_page_input').val();

            if (page > 0 && (page * args.limit) < args.last_element + args.limit) {
                args.start_element = page > 0 ? (page - 1) * args.limit : args.start_element;
                args.refetch = update_inner ? 1 : 0;

                // TODO: get from localstore if microtemplating is active

                gpAjax.ajaxGet(args.controller, args.action, args, false, function(_data) {

                    if (update_inner) {
                        var jump_data = {
                                page: page,
                                start_element: args.start_element,
                                last_element: args.last_element,
                                limit: args.limit,
                                first_element: args.first_element
                            },
                            ins_data = $(_data.view);

                        if (ins_data.hasClass('top')) {
                            ins_data.toggleClass('top bottom');
                        }
                        $('#' + args.insert_elem_id).html(ins_data);
                        $('#' + args.insert_elem_id).children().addClass('bottom');
                        $('#' + args.elem_id).scrollTop(0);

                        $(document).trigger('es_jump_' + args.elem_id, jump_data); // reset values of endless scroll callback function to match the page jump
                        EndlessScroll.correctlastScrollPosition(args.elem_id, true, page);
                    } else {
                        $('#' + parent_html_elem_id).html(_data.html);
                        //Set page number because entire window content has been reloaded
                        $('#' + es_pagination_id + ' .es_page_input').val(page);
                    }

                    EndlessScroll.prev_scroll_direction[args.elem_id] = 'none';

                    if (typeof args.callback == 'function') {
                        args.callback(args, _data, true);
                    }

                    EndlessScroll.unlock();
                });
            }
        },

        /**
         * Calculate the current page number and update it in es_page_input field
         *
         * @param pagination_elem_id <String> element id of pagination object
         * @param current_page <Integer> current page
         * @param was_at_top <Boolean> Flag if viewport was previously at top or bottom area
         * @param visible_height <Integer> Height of viewport
         * @param scrollPos <Integer> current position of scroll bar
         * @param sum_top <Integer> Height of top area
         */
        updatePage: function(pagination_elem_id, current_page, was_at_top, visible_height, scrollPos, sum_top) {
            if (EndlessScroll.isPageLocked()) {
                //return current_page;
            }

            EndlessScroll.lockPage();

            var page_top = sum_top - (visible_height / 2) > scrollPos,
                new_page;

            if (!page_top && was_at_top) {
                new_page = ~~current_page + 1;
                $('#' + pagination_elem_id + ' .es_page_input').val(new_page);
                return new_page;
            } else if (page_top && !was_at_top) {
                new_page = ~~current_page - 1;
                $('#' + pagination_elem_id + ' .es_page_input').val(new_page);
                return new_page;
            }

            return current_page;
        },

        /**
         * If elements are removed or inserted, the total height of the scroll content may change. If this is the case,
         * the last scroll position has to be corrected to match the new height. Otherwise the system may treat a scroll event
         * wrong.
         *
         * @param elem_id <String> used to identify the trigger
         * @param is_at_top <Boolean> true if viewport is in top area, false otherwise
         * @param current_page <integer> Current page
         */
        correctlastScrollPosition: function(elem_id, is_at_top, current_page) {
            var data = {
                scroll_pos: $('#' + elem_id).scrollTop(),
                is_at_top: is_at_top,
                current_page: current_page
            };

            $(document).trigger('essl_trigger_' + elem_id, data);
        }
    };

    window.EndlessScroll = EndlessScroll;
}());