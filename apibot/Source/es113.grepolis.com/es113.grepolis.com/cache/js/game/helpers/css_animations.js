/**
 * Provides vendorized functions to listen for events of css3 animations.
 * Available methods:
 *  - onAnimationStart
 *  - onAnimationEnd
 *  - onAnimationIteration
 *
 * ExampleUsage:
 *
 *   HelperCssAnimations.onAnimationStart(this.$el, function(animation_name) {
 *     console.log('Animation finished:', animation_name);
 *   });
 *
 */

(function() {
    'use strict';

    var event_names = ['AnimationStart', 'AnimationEnd', 'AnimationIteration'];

    var HelperCssAnimations = {

        prefixedEvent: function(element, type, callback) {
            ['webkit', 'moz', 'MS', 'o', ''].forEach(function(prefix) {
                if (prefix === '') {
                    type = type.toLowerCase();
                }
                $(element).on(prefix + type, callback);
            });
        }

    };

    event_names.forEach(function(event_name) {
        HelperCssAnimations['on' + event_name] = function(element, callback) {
            HelperCssAnimations.prefixedEvent(element, event_name, function(e) {
                callback(e.originalEvent.animationName, e);
            });
        };
    });

    window.HelperCssAnimations = HelperCssAnimations;
}());