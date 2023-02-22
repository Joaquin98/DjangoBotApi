/* global Game */
// inheritance:
(function() {
    'use strict';

    function AbstractWndHandlerEmailValidation(wndhandle) {
        this.wnd = wndhandle;
    }
    AbstractWndHandlerEmailValidation.inherits(window.WndHandlerDefault);

    //email
    AbstractWndHandlerEmailValidation.prototype.resendValidationEmail = function() {
        //to display the email validation dialog set parameter validate
        this.wnd.requestContentPost('player', 'resend_validation_email', {
            validate: 1
        });
    };

    AbstractWndHandlerEmailValidation.prototype.validateEmail = function() {
        var params = {};
        params.code = this.wnd.getJQElement().find('#validate_form [name=code]').val();

        this.wnd.ajaxRequestPost('player', 'validate_email', params, function(window, data) {
            Game.player_email_validated = true;
            this.wnd.setContent3('.settings-container', data.html);
        }.bind(this));
    };

    window.AbstractWndHandlerEmailValidation = AbstractWndHandlerEmailValidation;
}());