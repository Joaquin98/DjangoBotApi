/*globals Recaptcha, gpAjax, GrepoNotificationStack, GameEvents */

window.RecaptchaWindowFactory = (function() {
    'use strict';

    return {
        captcha_window_opened: false,

        isCaptchaWindowOpened: function() {
            return this.captcha_window_opened === true;
        },

        /**
         * Opens 'Recaptcha' window
         */
        openRecaptchaWindowBotCheck: function() {
            var _self = this;

            if (!this.isCaptchaWindowOpened()) {
                this.captcha_window_opened = true;

                return $('body').recaptcha({}).on('recaptcha:btn_confirm:click', function(e, _captcha) {
                    //Actions which should be done when user will click on the 'Confirm' button
                    var params = {
                        response: grecaptcha.getResponse()
                    };

                    gpAjax.post('bot_check', 'confirm', params, true, {
                        success: function( /*data*/ ) {
                            _captcha.close();
                            _self.captcha_window_opened = false;
                            GrepoNotificationStack.deleteBotCheckNotification();
                        },
                        error: function() {
                            _captcha.close();
                            _self.captcha_window_opened = false;
                            _self.openRecaptchaWindowBotCheck();
                        }
                    });
                });
            }

            return null;
        },

        /**
         * Opens 'Recaptcha' window
         */
        openRecaptchaWindow: function(callback) {
            var _self = this;

            if (!this.isCaptchaWindowOpened()) {
                this.captcha_window_opened = true;

                return $('body').recaptcha({}).on('recaptcha:btn_confirm:click', function(e, _captcha) {

                    var payload = JSON.stringify({
                        response: grecaptcha.getResponse()
                    });

                    _captcha.close();
                    _self.captcha_window_opened = false;
                    callback(payload);
                });
            }

            return null;
        }
    };
}());