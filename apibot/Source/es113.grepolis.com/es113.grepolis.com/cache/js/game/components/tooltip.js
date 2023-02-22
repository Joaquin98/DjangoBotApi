/* global MousePopup */
(function() {
    'use strict';

    /**
     * Its a wrapper on the .mousePopup() component, which makes use of it
     * much easier
     *
     * @param {Object} $el		 html element
     * @param {String} xhtml     string which contains plain text or html structure
     * @param {Object} [styles]  object which contains css styles in the same
     *                           format as jQuery .css()
     * @param {Boolean} [display_container]   Determinates whether the tooltip
     *                                        container graphics will be displayed
     *
     * =======================================
     * Example:
     * =======================================
     *
     * Old style of initializing tooltips:
     * $el.mousePopup(new MousePopup('Hey!'));
     *
     * New recommanded style:
     * $el.tooltip('Hey!');
     *
     */

    function T($el, xhtml, styles, display_container) {
        var settings = $.extend({
            xhtml: '',
            styles: {
                'max-width': 400
            },
            display_container: true
        }, {
            xhtml: xhtml,
            styles: styles,
            display_container: display_container
        });

        this.$el = $el;

        this.obj_tooltip = new MousePopup(settings.xhtml, settings.styles, !settings.display_container);
        this.$el.mousePopup(this.obj_tooltip);

    }

    $.fn.tooltip = function(xhtml, styles, display_container) {
        var t = new T($(this), xhtml, styles, display_container);

        us.extend(this, t);

        return this;
    };

    /**
     * Show tooltip
     *
     * @param {Object} e   optional - mouse event or object with properties
     *                     listed in the function itself
     *
     * @return {jQuery Component Object}
     */
    T.prototype.showTooltip = function(e) {
        e = e || {};

        this.obj_tooltip.show(e);

        return this;
    };

    /**
     * Hides tooltip
     *
     * @return {jQuery Component Object}
     */
    T.prototype.hideTooltip = function() {
        this.obj_tooltip.onOutAnimationComplete();

        return this;
    };

    /**
     * Enables tooltip, which means that it will be show when user will
     * hover over the element
     *
     * @return {jQuery Component Object}
     */
    T.prototype.enable = function() {
        this.obj_tooltip.enable();

        return this;
    };

    /**
     * Disables tooltip, which means that it will not be show when user will
     * hover over the element
     *
     * @return {jQuery Component Object}
     */
    T.prototype.disable = function() {
        this.obj_tooltip.disable();

        return this;
    };

    /**
     * Destroys tooltip
     */
    T.prototype.destroy = function() {
        this.obj_tooltip.destroy();
    };
}());