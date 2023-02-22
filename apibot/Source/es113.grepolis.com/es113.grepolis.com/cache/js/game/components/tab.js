/**
 * This component provides a tab functionality
 *
 * @param params
 *     {Number} activepagenr   determinates which page is currently visible
 *
 * ------------------
 * Example:
 * ------------------
 * //the 'activepagenr' setting can be ommited because as default it's 0
 * var tab = CM.register(cm_ctx, 'tab_general_unit_types', root.find('.tab_general_unit_types').tab({activepagenr : 0}));
 *
 * //To change tab:
 * tab.setActiveTab(1);
 */
jQuery.fn.tab = function(params) {
    'use strict';

    var settings = $.extend({
        activepagenr: 0
    }, params);

    var _self = this,
        $el = $(this),
        pages_count = 0;

    /**
     * Removes all binded events from component
     */
    function unbindEvents(destroy) {
        if (destroy) {
            $el.off('tab:change:activepagenr');
        }
    }

    /**
     * Binds all events
     */
    function bindEvents() {
        unbindEvents();

        $el.on('click.tab', '.js-page-caption', function(e) {
            var $page_caption = $(e.currentTarget);

            if ($page_caption.hasClass('active')) {
                return;
            }

            _self.setActiveTab($page_caption.attr('data-pagenr'));
        });
    }

    /**
     * Returns active page number
     *
     * @return {Number}
     */
    this.getActiveTabNr = function() {
        return settings.activepagenr;
    };

    /**
     * Changes currently displayed page to another
     *
     * @param {Number} page_nr      number which represents the page number (1, 2 etc)
     * @param {Function} [callback]   a callback function executed after switching tab
     *
     * @return {Object}  jQuery Component Object
     */
    this.setActiveTab = function(page_nr, callback) {
        var prev_page_nr = settings.activepagenr;

        page_nr = parseInt(page_nr, 10);

        if (page_nr >= 0 && page_nr < pages_count) {
            settings.activepagenr = page_nr;

            //Hide all tabs, and display only active tab
            //$el.find('.js-page').hide().filter('.js-page-' + page_nr).show();
            $el.find('.js-page').removeClass('active').filter('.js-page-' + page_nr).addClass('active');
            $el.find('.js-page-caption').removeClass('active').filter('.js-page-caption-' + page_nr).addClass('active');

            //Trigger an event to notify about this change
            $el.trigger('tab:change:activepagenr', [page_nr, prev_page_nr]);

            if (typeof callback === 'function') {
                callback();
            }
        }

        return this;
    };

    this.getPageElement = function(page_nr) {
        return $el.find('.js-page-' + page_nr);
    };

    this.updateTabTitle = function(tab_nr, new_title) {
        $el.find('.js-page-caption-' + tab_nr + ' .js-caption').html(new_title);
    };

    this.getPageCount = function() {
        return pages_count;
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
        bindEvents();

        //Prepare variables
        pages_count = $el.find('.js-page').length;

        //Set default tab
        _self.setActiveTab(settings.activepagenr);
    }());

    return this;
};