define('prototype/tutorial/guide_steps_marker', function() {
    'use strict';

    function UserGuideStepMarker(selector) {
        /**
         *
         * @var {String}
         */
        this._selector = selector;

        /**
         *
         * @var {Object} offset
         */
        this._offset = null;

        /**
         *
         * @var {String} UserGuideStepConfig::TYPE_*
         */
        this._type = null;

        /**
         *
         * @var {String} UserGuideStepConfig::DIRECTION_*
         */
        this._direction = null;

        /**
         *
         * @var {Boolean}
         */
        this._bounce = null;

        /**
         * @var {Object} options
         */
        this._options = {};

        this.offset(0, 0);
        this.bounce(true);
    }

    /**
     * set marker offset
     *
     * @param {Number} x
     * @param {Number} y
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.offset = function(x, y) {
        x = x || 0;
        y = y || 0;

        this._offset = {
            x: x,
            y: y
        };
        return this;
    };

    /**
     * set type
     *
     * @param {String} type UserGuideStepConfig::TYPE_*
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.type = function(type) {
        this._type = type;
        return this;
    };

    /**
     * set marker pointing direction
     *
     * @param {String} direction UserGuideStepConfig::DIRECTION_*
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.direction = function(direction) {
        this._direction = direction;
        return this;
    };

    /**
     * set expand for highlight
     *
     * @param {Number} x
     * @param {Number} y
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.expand = function(x, y) {
        x = x || 0;
        y = y || 0;

        this._options.expand = {
            x: x,
            y: y
        };
        return this;
    };

    /**
     * set fix position
     *
     * @param {Boolean} [fix_position]
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.fixPosition = function(fix_position) {
        fix_position = fix_position || true;

        this._options.fix_position = fix_position;
        return this;
    };

    /**
     * set count for highlight blink
     *
     * @param {Number} count
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.count = function(count) {
        this._options.count = count;
        return this;
    };

    /**
     * set bounce
     *
     * @param {Boolean} bounce
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.bounce = function(bounce) {
        bounce = bounce || true;

        this._bounce = bounce;
        return this;
    };

    /**
     * set parent dom element to inject the arrow
     *
     * @param {String} selector
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.parentDom = function(selector) {
        this._options.parent_dom = selector;
        return this;
    };

    /**
     * set filter function to precisely pick a element from selector's list
     *
     * @param {String} fn
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.filter = function(fn) {
        this._options.custom_filter = fn;
        return this;
    };

    /**
     * set focus on window
     *
     * @param {String} focus_window
     * @return UserGuideStepMarker
     */
    UserGuideStepMarker.prototype.focusWindow = function(focus_window) {
        this._options.focus_window = focus_window;
        return this;
    };

    /**
     * get config object as array
     *
     * @return {Object} marker
     */
    UserGuideStepMarker.prototype.toArray = function() {
        return {
            selector: this._selector,
            offset: this._offset,
            type: this._type,
            direction: this._direction,
            bounce: this._bounce,
            options: this._options
        };
    };

    return UserGuideStepMarker;
});