/*global jQuery */

/**
 * Pager component allows user to change pages by clicking on the concrete
 * page number or on the buttons "last", "first", "next", "previous"...
 *
 * @param params
 *     {Number} activepagenr                    determinates the currently selected page (counting from 0)
 *     {Number} per_page                        determinates how many elements should be on one page
 *     {Number} total_rows                      determinates how many elements are in total
 *     {Number} visible_pages                   determinates how many pages have to be visible (not used in grepo_mode)
 *     {String} template                        the id of the template which keeps the single
 *                                              page element (to let know component where the
 *                                              caption is placed, please put "page_text" css
 *                                              class on this node),
 *     {Object} buttons                         an array with values which determinates
 *                                              which buttons (Page Numbers, First, Previous, Next, Last...)
 *                                              should be available to use and which disabled
 *     {Boolean} grepo_mode                     if set to true, pager will behave as the old grepo one
 *     {Object} buttons_lang                    a Hash Array which contains a translated captions
 *                                              for each button
 *     {Function} onInit                        a function executed after pager was initialized
 *     {Boolean} hide_buttons_for_single_page   determinats if buttons should be visible if there is only one page
 *     {String} cid                             helps to determinate the button, its something like
 *                                              vitrual id, or you can store there some informtaions
 *
 * Component Events:
 * - pgr:page:switch
 * - pgr:page:select
 *
 *
 * ------------------
 * Example:
 * ------------------
 *
 * HTML Node:
 * <div id="pgr_all_offers" class="pager_grepo"></div>
 *
 * CM.register(context, 'pgr_go_ranking', $el.find(".pgr_go_ranking").pager({
 *     activepagenr : model_ranking.getActivePage(), per_page : model_ranking.getPerPage(), total_rows : model_ranking.getTotalRows()
 * }).on("pgr:page:switch", function(e, page_nr, prev_page_nr) {
 *     //Fetch new rows
 * }).on("pgr:page:select", function(e, _pager, activepagenr, number_of_pages) {
 *     //Open window which allows to select page manualy
 *     GoToPageWindowFactory.openPagerGoToPageWindow(_pager, activepagenr + 1, number_of_pages);
 * }));
 */
(function($) {
    'use strict';

    $.fn.pager = function(params) {
        var settings = $.extend({
            activepagenr: 0,
            per_page: 10,
            total_rows: 0,
            visible_pages: 3,
            template: 'tpl_pager',
            buttons: [
                true, //Page buttons
                false, //First page button
                false, //Previous page buttons
                false, //Next page buttons
                false //Last page buttons
            ],
            grepo_mode: true,
            buttons_lang: {
                first: '',
                prev: '',
                next: '',
                last: '',
                select_page: '...',
                last_page_number: '',
                first_page_number: ''
            },

            hide_buttons_for_single_page: false,
            onInit: function() {},
            cid: {}
        }, params);

        var _self = this,
            $el = $(this),
            $tpl,
            number_of_pages = 1;

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            $tpl = /^</.test(settings.template) ? settings.template : $('#' + settings.template).html();
        }

        /**
         * Its a helper function which adds necessary class names and texts on the
         * HTML page node.
         *
         * @param {jQuery Object} $node   represents the pager:page node
         * @param {Number|String} type    represents the type of the node, it can be
         *                                number or button type
         * @param {Number} activepagenr   number of page which is currently active
         */
        function setUpPageNode($node, type, activepagenr) {
            $node.removeClass('active disabled first last prev next select_page last_page_number first_page_number').attr('type', type);

            var $text = $node.find('.page_text'),
                caption = typeof type === 'number' ? type :
                (type === 'last_page_number' ? number_of_pages :
                    (type === 'first_page_number' ? 1 :
                        settings.buttons_lang[type]));

            if (isNaN(parseInt(type, 10))) {
                $node.addClass(type);
            } else {
                type = parseInt(type, 10);
            }

            if ($text.length === 0) {
                $text = $node;
            }

            //Set caption
            $text.html(caption);

            //Make page active
            if (type === activepagenr + 1) {
                $node.addClass('active');
            }

            if ((activepagenr === 0 && (type === 'first' || type === 'prev')) || (activepagenr + 1 === number_of_pages && (type === 'last' || type === 'next'))) {
                $node.addClass('disabled');
            }
        }

        /**
         * Selects the page depends on the node type specified as a first argument.
         *
         * @param {Number|String} type   page number or string which represents the type
         * @param {Object} props         hash array which contains the some settings
         *
         * Possible values:
         *     - 'force'     if this parameter is specified, the page number doesn't
         *                   have to pass the edge conditions
         *     - 'silent'    if this parameter is specified, the 'pgr:page:switch' event
         *				     won't be triggered
         */
        function selectPage(type, props) {
            var activepagenr = settings.activepagenr,
                force = props && props.force,
                silent = props && props.silent,
                page_nr;

            page_nr = type === 'first' || type === 'first_page_number' ? 0 :
                (type === 'prev' ? activepagenr - 1 :
                    (type === 'next' ? activepagenr + 1 :
                        type === 'last' || type === 'last_page_number' ? number_of_pages - 1 :
                        parseInt(type, 10) - 1));

            //Check if the page number is correct
            if (force || (page_nr >= 0 && page_nr < number_of_pages && activepagenr !== page_nr)) {
                settings.activepagenr = page_nr;

                renderPaginator();

                $el.find('.page_number').each(function(index, node) {
                    var $node = $(node);
                    setUpPageNode($node, $node.attr('type'), page_nr);
                });

                if (!silent) {
                    _self.trigger('pgr:page:switch', [page_nr, activepagenr]);
                }
            }

            switch (type) {
                case 'select_page':
                    _self.trigger('pgr:page:select', [_self, activepagenr, number_of_pages]);
                    break;
            }
        }

        /**
         * Removes all binded events from component
         */
        function unbindEvents(destroy) {
            $el.off('.pager');

            if (destroy) {
                $el.off('pgr:page:switch pgr:page:select');
            }
        }

        /**
         * Binds all events
         */
        function bindEvents() {
            //Events can not be unbinded here

            $el.on('click.pager', '.page_number', function(e) {
                var $target = $(e.currentTarget);

                selectPage($target.attr('type'));
            });
        }

        /**
         * Helper function which creates necessary html nodes for the pager and
         * binds events on them
         */
        function renderPaginator() {
            var i, l, activepagenr = settings.activepagenr,
                buttons = settings.buttons,
                visible_pages = settings.visible_pages,
                grepo_mode = settings.grepo_mode,
                hide_buttons = settings.hide_buttons_for_single_page;

            number_of_pages = Math.ceil(settings.total_rows / settings.per_page);

            var items = [];

            if (grepo_mode) {
                var dots = false;

                //make pager in the same way how its done on the server side
                for (i = 0; i < number_of_pages; i++) {
                    if (i === 0 || (activepagenr >= i - 1 && activepagenr <= i + 1) || i > number_of_pages - 2) {
                        //page number
                        items[items.length] = i + 1;
                        dots = false;
                    } else {
                        if (!dots) {
                            items[items.length] = 'select_page';
                            dots = true;
                        }
                    }
                }
            } else {
                //Add buttons
                if ((buttons[2] && !hide_buttons) || (number_of_pages > 1 && hide_buttons)) {
                    items.unshift('prev');
                }

                if (buttons[1]) {
                    items.unshift('first');
                }

                //@todo, this part is not used anywhere yet, check it later
                if (number_of_pages > visible_pages) {
                    //Button which allows to select page
                    items.unshift('select_page');
                    //Button which contains the number of the first page
                    items.unshift('first_page_number');
                }

                if (number_of_pages > visible_pages) {
                    //Button which allows to select page
                    items.push('select_page');
                    //Button which contains the number of the last page
                    items.push('last_page_number');
                }
                //end of not used part

                if ((buttons[3] && !hide_buttons) || (number_of_pages > 1 && hide_buttons)) {
                    items.push('next');
                }

                if (buttons[4]) {
                    items.push('last');
                }
            }

            //Clear stuff
            unbindEvents();
            $el.empty();

            //@todo, I don't have a time to investiage it right now, but
            //everything should be done in one loop
            for (i = 0, l = items.length; i < l; i++) {
                $el.append($tpl);
            }

            $el.find('.page_number').each(function(index, node) {
                setUpPageNode($(node), items[index], activepagenr);
            });

            bindEvents();
        }

        /**
         * Changes the currently selected page to the page specified as a parameter,
         * The 'value' has to be bigger than 0 and smaller or equal the max number
         * of pages.
         *
         * @param {Number} value   number which represents the the currently selected page
         * @param {Object} props   hash array which contains the some settings
         *
         * Possible values:
         *     - 'force'     if this parameter is specified, the page number doesn't
         *                   have to pass the edge conditions
         *     - 'silent'    if this parameter is specified, the 'pgr:page:switch' event
         *				     won't be triggered
         *
         * @return {Object}  jQuery Component Object
         */
        this.setActivePage = function(value, props) {
            //Select page is used also with HTML nodes where we takes caption
            selectPage(value + 1, props);

            return this;
        };

        /**
         * Returns a number of the page which is currently selected
         *
         * @return {Number}
         */
        this.getActivePage = function() {
            return settings.activepagenr;
        };

        this.unsetActivePagener = function() {
            $(this).find('.page_number.active').removeClass('active');
            settings.activepagenr = -1;
        };

        /**
         * Selects next page
         *
         * @return {Object}  jQuery Component Object
         */
        this.nextPage = function() {
            selectPage(settings.activepagenr + 1);

            return this;
        };

        /**
         * Selects previous page
         *
         * @return {Object}  jQuery Component Object
         */
        this.previousPage = function() {
            selectPage(settings.activepagenr - 1);

            return this;
        };

        /**
         * Selects last page
         *
         * @return {Object}  jQuery Component Object
         */
        this.lastPage = function() {
            selectPage(number_of_pages);

            return this;
        };

        /**
         * Selects first page
         *
         * @return {Object}  jQuery Component Object
         */
        this.firstPage = function() {
            selectPage(1);

            return this;
        };

        /**
         * Sets 'total_row' in the pager, which represents how many items are
         * displayed on some list which is necessary to determinate how many page
         * buttons have to be displayed
         *
         * @param {Number} value represents total number of rows
         *
         * @return {Object}  jQuery Component Object
         */
        this.setTotalRows = function(value) {
            var activepagenr = settings.activepagenr,
                number_of_pages;

            settings.total_rows = value;
            number_of_pages = Math.ceil(value / settings.per_page);

            this.setActivePage(Math.min(activepagenr, number_of_pages - 1));
            renderPaginator();

            return this;
        };

        /**
         * Returns how many pages are displayed in the pager
         *
         * @return {Number}
         */
        this.getNumberOfPages = function() {
            return number_of_pages;
        };

        /**
         * Returns value of the per page property
         *
         * @return {Number}
         */
        this.getPerPage = function() {
            return settings.per_page;
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
            unbindEvents(true);
        };

        /**
         * Initiates component
         */
        (function() {
            loadTemplate();
            //Prepare page nodes, which will indicates how many pages are available
            renderPaginator();

            //Execute devloper's code
            settings.onInit(_self);
        }());

        return this;
    };
}(jQuery));