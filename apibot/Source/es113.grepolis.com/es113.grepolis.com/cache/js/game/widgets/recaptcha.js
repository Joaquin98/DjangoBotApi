/*global jQuery, DM, us, Game, Timestamp, HumanMessage, _, debug */

/**
 * ReCaptcha Widget
 *
 * Displays recaptcha window to user with one buttons.
 * Button is to confirm typed text in texbox
 *
 * @param {Object} params
 *     @param {String} params.template   a name of template which is saved in
 *                                       DataManager in "COMMON" group
 *
 * -----------------------------------------------------------------------------
 * Example:
 *
 * ReCaptcha can be initialized on any element, but usually we want to have it on
 * root node.
 *
 * $('body').recaptcha({
 * }).on("recaptcha:btn_confirm:click", function(e, _captcha) {
 *     //Actions which should be done when user will click on the "Confirm" button
 * });
 */
(function($) {
    "use strict";

    $.fn.recaptcha = function(params) {
        var settings = $.extend({
            template: 'recaptcha'
        }, params);

        var _self = this,
            //Reference to the root node
            $el = $(this),
            $window, $curtain, $textbox, $btn_reload, $btn_confirm, $btn_audio, $img,
            template = us.template(
                DM.getTemplate('COMMON', settings.template), {
                    'site_key': Game.recaptcha2.site_key
                }
            ),
            audio_state;

        /**
         * Removes all binded events from component
         */
        function unbindEvents() {
            $el.off('recaptcha:btn_confirm:click');
        }

        /**
         * Clears up stuff before component will be removed
         *
         * @method destroy
         */
        function destroy() {
            $btn_confirm.destroy();

            $curtain.remove();
            $window.remove();

            unbindEvents();
        }

        this.getIdentifier = function() {
            return 'recaptcha';
        };

        /**
         * Makes captcha visible
         *
         * @method show
         * @chainable
         *
         * @return {Object} jQuery Component Object
         */
        this.show = function() {
            $curtain.fadeTo(400, 0.5);
            $window.fadeIn();

            return this;
        };

        /**
         * Makes captcha invisible
         *
         * @method hide
         * @chainable
         *
         * @return {Object} jQuery Component Object
         */
        this.hide = function() {
            $curtain.hide();
            $window.hide();

            return this;
        };

        this.close = function() {
            _self.hide();

            destroy();
        };

        //Initialize
        (function() {
            //Cache HTMLElements
            $el.append(template);
            $curtain = $('#captcha_curtain');
            $window = $('#recaptcha_window');

            unbindEvents();

            //Confirm button
            $btn_confirm = $window.find(".btn_confirm").button({
                template: 'empty'
            }).on('btn:click', function(e) {
                //Trigger an event
                $el.trigger('recaptcha:btn_confirm:click', [_self]);
            });


            //Show captcha as default
            _self.show();
        }());

        return this;
    };
}(jQuery));