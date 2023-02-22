/* global us, Promise */
/**
 * Singleton to handle error, success and award messages (toast notifications).
 *
 * Note from v2.115: The queue implementation has been cut short until time permits.
 * For now it will simply replace the current message if a new one arrives
 *
 * Messages will hide automatically after CLOSE_TIMEOUT_MS.
 * They can also be vanished before that by clicking on them.
 *
 * Example usage:
 *   HumanMessage.error("Attack not possible");
 *   HumanMessage.success("Upgrade successful");
 *   HumanMessage.award(award_model);
 *
 */

define('misc/humanmessage', function() {
    "use strict";

    var ANIMATIONS = !window.DEBUG;

    var close_timeout_timer = null;
    var $human_message = null;

    // FIFO containing message objects with string keys: text, theme, headline(only used for awards)
    var message_queue = [];
    // holds a promise of any pending operations
    var pending_operation = Promise.resolve();

    var HumanMessage = {

        CLOSE_TIMEOUT_MS: 3000,
        INTER_MESSAGE_DELAY_MS: 500,

        /**
         * Shows an error message
         *
         * @static
         * @param {String} message - Message to display
         */
        error: function(message) {
            message_queue.push({
                theme: HumanMessage.THEME.error,
                text: message
            });
            // return HumanMessage._processQueue();
            return HumanMessage._remove(true)
                .then(HumanMessage._display.bind(null, message, HumanMessage.THEME.error));
        },

        /**
         * Shows a positive message
         *
         * @static
         * @param {String} message - Message to display
         */
        success: function(message) {
            message_queue.push({
                theme: HumanMessage.THEME.success,
                text: message
            });
            // return HumanMessage._processQueue();
            return HumanMessage._remove(true)
                .then(HumanMessage._display.bind(null, message, HumanMessage.THEME.success));
        },

        /**
         * Shows a message indicating that the player earned a new award
         *
         * @static
         * @param {GameModels.PlayerAward} award
         */
        award: function(award) {
            var message = '+' + award.getPoints() + ' - ' + award.getName();
            message_queue.push({
                theme: HumanMessage.THEME.award,
                text: message,
                headline: _('Award unlocked!')
            });
            // return HumanMessage._processQueue();
            return HumanMessage._remove(true)
                .then(HumanMessage._display.bind(null, message, HumanMessage.THEME.award, _('Award unlocked!')));
        },

        _initialize: function() {
            if (!$human_message) {
                $human_message = $('#human_message');
            }
        },

        /**
         * @returns {Promise} that resolves when all elements in the queue have been shown
         * @private
         */
        _processQueue: function() {

            if (message_queue.length === 0) {
                return Promise.resolve();
            }

            var waitInterMessageDelay = function() {
                return new Promise(function(resolve) {
                    setTimeout(resolve, HumanMessage.INTER_MESSAGE_DELAY_MS);
                });
            };

            var oldest_message = message_queue.shift();
            pending_operation = pending_operation
                .then(HumanMessage._handleMessage.bind(null, oldest_message))
                .then(waitInterMessageDelay)
                .then(HumanMessage._processQueue);

            return pending_operation;
        },

        _handleMessage: function(message_object) {
            return HumanMessage._display(
                message_object.text,
                message_object.theme,
                message_object.headline
            );
        },

        /**
         * Displays any message.
         *
         * @private
         * @param {String} msg - Message to display
         * @param {String} className - css class for message
         * @return {Promise} resolves when this message is hidden again
         */
        _display: function(msg, className, headline) {
            return new Promise(function(resolve) {

                var removeAndResolve = function(event) {
                        HumanMessage._remove(false).then(resolve);
                    },
                    startTimer = function(time) {
                        clearTimeout(close_timeout_timer);
                        close_timeout_timer = setTimeout(removeAndResolve, time);
                    },
                    startAutoCloseTimer = function() {
                        startTimer(HumanMessage.CLOSE_TIMEOUT_MS);
                    },
                    closeImmediately = function() {
                        clearTimeout(close_timeout_timer);
                        HumanMessage._remove(true).then(resolve);
                    };

                HumanMessage._initialize();

                // hide again when moving over the message with a small delay,
                // so the user has a chance to read the message
                $human_message.off().on('mouseenter', closeImmediately);

                // Inject message
                $human_message.find('.text').html(msg);
                $human_message.find('.headline').text(headline);

                // show
                $human_message.css('display', 'inline-block');
                $human_message.attr('class', className);

                if (ANIMATIONS) {
                    // fade in..
                    $human_message.show();
                    $human_message.transition({
                        opacity: 1
                    }, {
                        duration: 200,
                        complete: startAutoCloseTimer
                    });
                } else {
                    startAutoCloseTimer();
                }
            });
        },

        /**
         * Removes the currently shown message
         * @return {Promise}
         */
        _remove: function(immediately) {
            var onMessageDisappeared = function() {
                $human_message.hide();
                $human_message.css('opacity', 0);
                $human_message.find('.text').text('');
                $human_message.find('.headline').text('');
            };

            HumanMessage._initialize();

            return new Promise(function(resolve) {
                var hideAndResolve = us.compose(onMessageDisappeared, resolve);
                clearTimeout(close_timeout_timer);

                if (ANIMATIONS && !immediately) {
                    $human_message.transition({
                        opacity: 0
                    }, 500, hideAndResolve);
                } else {
                    hideAndResolve();
                }
            });
        },

        THEME: {
            error: 'error_msg', // red
            success: 'success_msg', // green
            award: 'award_msg' // blue with icon
        }

    };

    window.HumanMessage = HumanMessage;

    return HumanMessage;
});