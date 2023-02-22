(function() {
    'use strict';

    var View = window.GameViews.BaseView;

    var EventTutorialSubWindowView = View.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            View.prototype.initialize.apply(this, arguments);

            this.render();
            this.initializeEventListeners();
        },

        render: function() {
            //Load pages
            this.$el.html(this.controller.getTemplate('tutorial'));

            //Load control buttons
            this.$el.append(us.template(this.controller.getTemplate('controls'), {
                l10n: {
                    arrow_next: _('next'),
                    arrow_prev: _('previous'),
                    arrow_close: _('close')
                }
            }));
        },

        initializeEventListeners: function() {
            this.$el.on('click', '.js-arrow-prev', this.controller.onArrowPrevClick.bind(this.controller));
            this.$el.on('click', '.js-arrow-next', this.controller.onArrowNextClick.bind(this.controller));
            this.$el.on('click', '.js-arrow-close', this.controller.onArrowCloseClick.bind(this.controller));
        },

        selectPage: function(page_nr) {
            var $tutorial = this.$el.find('.js-tutorial-root');
            var $pages = $tutorial.children(),
                $page = $pages.eq(page_nr);

            //Hide all pages
            $pages.hide();

            //Show only active page
            $page.show();

            this.updateControls(page_nr);
            this.registerScrollbar($page);
        },

        updateControls: function(page_nr) {
            this.$el.find('.js-arrow-prev').toggle(page_nr !== 0);
            this.$el.find('.js-arrow-next').toggle(page_nr !== this.controller.getLastPageNumber());
            this.$el.find('.js-arrow-close').toggle(page_nr === this.controller.getLastPageNumber());
        },

        registerScrollbar: function($page) {
            var $viewport = $page.find('.js-scrollbar-viewport'),
                $content = $page.find('.js-scrollbar-content'),
                show_scrollbar = $content.height() > $viewport.height();

            if ($viewport.length === 0 || $content.length === 0 || !show_scrollbar) {
                return;
            }

            this.unregisterComponent('tutorial_scrollbar');
            this.registerComponent('tutorial_scrollbar', $viewport.skinableScrollbar({
                orientation: 'vertical',
                template: 'tpl_skinable_scrollbar',
                skin: 'blue',
                disabled: false,
                elements_to_scroll: $content,
                elements_to_scroll_position: 'relative',
                element_viewport: $viewport,
                scroll_position: 0,
                min_slider_size: 16,
                hide_when_nothing_to_scroll: true,
                prepend: true
            }));
        },

        destroy: function() {

        }
    });

    window.GameViews.EventTutorialSubWindowView = EventTutorialSubWindowView;
}());