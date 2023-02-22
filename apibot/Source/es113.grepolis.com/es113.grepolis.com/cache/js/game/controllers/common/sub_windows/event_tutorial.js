/*global GameViews, us, GameControllers, Game */

(function() {
    'use strict';

    /**
     * Template which keeps control buttons for the tutorial sub window (maybe later can be moved to the separate file and loaded on game load)
     */
    var controls_template =
        '<div class="event_tutorial_controls">' +
        '<div class="tutorial_arrow_prev js-arrow-prev"><div class="arrow_prev"></div><%= l10n.arrow_prev %></div>' +
        '<div class="tutorial_arrow_next js-arrow-next"><div class="arrow_next"></div><%= l10n.arrow_next %></div>' +
        '<div class="tutorial_arrow_close js-arrow-close"><div class="arrow_next"></div><%= l10n.arrow_close %></div>' +
        '</div>';

    var EventTutorialSubWindowController = GameControllers.BaseController.extend({
        active_page_nr: 0,
        total_page_nr: 0,

        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            this.window_controller = options.window_controller;

            this.addTemplate('controls', controls_template);
            this.analizeTemplate();
        },

        render: function($content_node) {
            this.$el = $content_node;

            this.view = new GameViews.EventTutorialSubWindowView({
                el: this.$el,
                controller: this
            });

            this.selectPage(this.getActivePageNumber());

            return this;
        },

        /**
         * Returns last page number
         *
         * @return {Number}
         */
        getLastPageNumber: function() {
            return this.total_page_nr - 1;
        },

        /**
         * Returns active page number
         *
         * @return {Number}
         */
        getActivePageNumber: function() {
            return this.active_page_nr;
        },

        /**
         * Sets active page number (keep in mind that the value should be checked before). Function itself does not
         * check if the value is correct
         *
         * @param {Number} page_nr
         */
        setActivePageNumber: function(page_nr) {
            this.active_page_nr = page_nr;
        },

        /**
         * Performs before-check for the template
         */
        analizeTemplate: function() {
            var $template = $(this.getTemplate('tutorial')),
                $pages = $template.children();

            if (Game.dev) {
                if (!$template.hasClass('js-tutorial-root')) {
                    throw 'Tutorial template should contain "js-tutorial-root" css class';
                }

                if ($template.prop('tagName') !== 'SECTION') {
                    throw 'Tutorial root template node should be SECTION';
                }

                if ($pages.length === 0) {
                    throw 'Tutorial does not contain any pages';
                }
            }

            this.total_page_nr = $pages.length;
        },

        /**
         * Adds or replaces the current page and the total pages at the very end of the window title
         * (e.g. 'My Awesome Tutorial - 1/5')
         */
        adjustWindowTitleCounter: function() {
            var title = this.window_controller.getSubWindowTitle(),
                curr_page = this.getActivePageNumber() + 1,
                total_pages = this.getLastPageNumber() + 1,
                regex = /^\d+\/\d+\)$/;

            var splitted_title = title.split('('),
                last_element_is_already_counter = us.last(splitted_title).trim().match(regex);

            if (last_element_is_already_counter) {
                // remove the counter part
                splitted_title.pop();
                title = splitted_title.join('(');
            }

            this.window_controller.setSubWindowTitle(title + ' (' + curr_page + '/' + total_pages + ')');
        },

        /**
         * Displays page depends on the given argument
         *
         * @param {Number} page_nr
         */
        selectPage: function(page_nr) {
            this.setActivePageNumber(page_nr);
            this.view.selectPage(page_nr);
            this.adjustWindowTitleCounter();
        },

        /**
         * Handles situation when user click on the 'Previous' button
         */
        onArrowPrevClick: function() {
            var active_page_nr = this.getActivePageNumber(),
                new_active_page_nr = Math.max(active_page_nr - 1, 0);

            this.selectPage(new_active_page_nr);
        },

        /**
         * Handles situation when user click on the 'Previous' button
         */
        onArrowNextClick: function() {
            var active_page_nr = this.getActivePageNumber(),
                new_active_page_nr = Math.min(active_page_nr + 1, this.getLastPageNumber());

            this.selectPage(new_active_page_nr);
        },

        onArrowCloseClick: function() {
            this.window_controller.closeSubWindow();
        },

        destroy: function() {

        }
    });

    window.GameControllers.EventTutorialSubWindowController = EventTutorialSubWindowController;
}());