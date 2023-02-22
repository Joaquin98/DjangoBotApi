/* global GPWindowMgr, WndHandlerDefault */
(function() {
    'use strict';

    var WndHandlerColonizationCommand = function(window) {
        this.wnd = window;
        this.command_id = -1;
        this.own_command = false;
    };

    WndHandlerColonizationCommand.inherits(WndHandlerDefault);

    WndHandlerColonizationCommand.prototype.getDefaultWindowOptions = function() {
        return {
            height: 440,
            width: 468,
            resizable: true,
            title: 'Untitled Window'
        };
    };

    WndHandlerColonizationCommand.prototype.onInit = function(title, UIopts, commandID) {
        this.wnd.requestContentGet('command_info', 'colonization_info', {
            'command_id': commandID
        });

        return true;
    };

    WndHandlerColonizationCommand.prototype.onRcvData = function(data) {
        var html,
            tmpl,
            powers,
            descr,
            that = this;

        // remove the tab menu
        this.wnd.clearMenuNow();

        this.command_id = data.command_id;
        if (typeof data.own_command === 'boolean') {
            this.own_command = data.own_command;
        }
        if (data.html) {
            this.wnd.setContent2(data.html);
        } else {
            tmpl = data.tmpl.split('|||');
            powers = tmpl.shift();
            descr = tmpl.pop();

            this.PowerDescriptionTemplate = descr;

            html = us.template(powers, data.json);
            this.wnd.setContent(html);
        }

        try {
            $('#eta-command-' + this.command_id).countdownAddElement($('#arrival_at_countdown'));
        } catch (e) {
            $('#arrival_' + this.command_id).countdown(data.arrival_at).on('finish', function() {
                that.wnd.close();
            });
        }
    };

    GPWindowMgr.addWndType('COLONIZATION_COMMAND', null, WndHandlerColonizationCommand);
}());