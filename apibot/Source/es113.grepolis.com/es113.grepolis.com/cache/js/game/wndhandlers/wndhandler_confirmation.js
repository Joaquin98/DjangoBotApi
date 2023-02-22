/* globals debug, GameEvents, GPWindowMgr */

(function() {
    'use strict';

    function WndHandlerConfirmation(wndhandle) {
        this.wnd = wndhandle;
        this.settings = {
            template: 'tpl_window_confirm'
        };

        this.cnt = {};
    }

    WndHandlerConfirmation.inherits(window.WndHandlerDefault);

    WndHandlerConfirmation.prototype.getDefaultWindowOptions = function(options) {
        var window_options = {
            width: 400,
            resizable: false,
            autoresize: false,
            title: ''
        };

        //Of course workaround for that easy thing which should work as default
        //this is sick !
        switch (options.type) {
            case "confirm":
                window_options.height = 208;
                break;
            case "buy_gold":
                window_options.height = 222;
                break;
        }

        return window_options;
    };

    WndHandlerConfirmation.prototype.onInit = function(title, options) {
        this.settings = $.extend(this.settings, options);

        var $tmpl = $("#" + this.settings.template).html();

        this.wnd.setContent(us.template($tmpl, {
            options: options.options || {},
            lang: options.lang || {}
        }));

        if (this.initialize.hasOwnProperty(options.type)) {
            this.initialize[options.type](this);
        } else {
            debug("Missing initialize function for Confirmation window: " + options.type);
        }

        return true;
    };

    WndHandlerConfirmation.prototype.initialize = {
        confirm: function(ctx) {
            var root = ctx.wnd.getJQElement(),
                cnt = ctx.cnt,
                settings = ctx.settings,
                lang = settings.lang;

            //Initialize buttons
            cnt.btn_decision_confirm = root.find("#btn_decision_confirm").button({
                caption: lang.btn_confirm
            }).on("btn:click", settings.onConfirm);
            cnt.btn_decision_cancel = root.find("#btn_decision_cancel").button({
                caption: lang.btn_cancel
            }).on("btn:click", settings.onCancel);

            //Initialize checkbox
            cnt.cbx_hide_confirmation_window = root.find("#cbx_hide_confirmation_window").checkbox({
                caption: lang.cbx_caption
            }).on("cbx:check", settings.onCheck);
        },

        buy_gold: function(ctx) {
            var root = ctx.wnd.getJQElement(),
                cnt = ctx.cnt,
                settings = ctx.settings,
                lang = settings.lang;

            //Initialize buy gold button
            cnt.btn_buy_gold = root.find("#btn_buy_gold").button({
                caption: lang.btn_caption,
                template: 'tpl_large_button'
            }).on("btn:click", function() {
                $.Observer(GameEvents.button.buy_gold.click).publish({});
                settings.onConfirm();
            });
        }
    };

    WndHandlerConfirmation.prototype.destroy = function() {
        var name, cnt = this.cnt;

        for (name in cnt) {
            if (cnt.hasOwnProperty(name)) {
                cnt[name].destroy();
            }
        }
    };

    WndHandlerConfirmation.prototype.onClose = function() {
        this.destroy();

        return true;
    };

    GPWindowMgr.addWndType('CONFIRMATION', null, WndHandlerConfirmation, 1, true);
}());