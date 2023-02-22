/**
 * Executes callback function when css animation ends
 *
 * @param {Function} [callback]
 *
 * @return {Object}
 */
$.fn.onceOnAnimationEnd = function(callback) {
    var $el = $(this),
        classes = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

    $el.on(classes, function() {
        $el.off(classes);

        if (typeof callback === "function") {
            callback();
        }
    });

    return this;
};

/**
 * Executes callback function when css transition ends
 *
 * @param {Function} [callback]
 *
 * @return {Object}
 */
$.fn.onceOnTransitionEnd = function(callback) {
    var $el = $(this),
        classes = 'webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend';

    $el.off(classes).on(classes, function() {
        $el.off(classes);

        if (typeof callback === "function") {
            callback();
        }
    });

    return this;
};

/**
 * Changes css 'display' property for a node (@see jquery docs) and adds css classes after that.
 * If there is any transition defined executes callback function at the end of it.
 *
 * @param {Function} [callback]
 *
 * @return {Object}
 */
$.fn.showElement = function(callback) {
    var $el = $(this);

    $el.onceOnTransitionEnd(callback);

    //If "show" class is applied directly after show, then opacity effects are not shown
    $el.show(10, function() {
        $el.addClass('show show-element');
    });

    return this;
};

/**
 * Removes css classes (@see function below) and executes callback function if exists. If css transition is defined
 * for this element, then callback will be executed after it ends
 *
 * @param {Function} [callback]
 *
 * @return {Object}
 */
$.fn.hideElement = function(callback) {
    var $el = $(this),
        inner_callback = function() {
            $el.hide();

            if (typeof callback === "function") {
                callback();
            }
        };

    $el.removeClass('show show-element');
    $el.onceOnTransitionEnd(inner_callback);

    return this;
};