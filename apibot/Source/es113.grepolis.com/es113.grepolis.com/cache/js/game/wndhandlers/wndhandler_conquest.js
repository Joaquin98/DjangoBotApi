/* globals WndHandlerDefault, _ */

(function() {
    "use strict";

    /**
     * wndhandler for "your town is being conquered"
     */
    var WndHandlerConquest = function(wndhandle) {
        this.wnd = wndhandle;
        this.currenttownId = 0;
    };

    WndHandlerConquest.inherits(WndHandlerDefault);

    WndHandlerConquest.prototype.getDefaultWindowOptions = function() {
        return {
            height: 330,
            width: 480,
            resizable: false,
            closable: false,
            title: _('Your city is currently being conquered:')
        };
    };

    WndHandlerConquest.prototype.onInit = function(title, UIopts, town_id) {
        this.wnd.sendMessage('setTown', town_id);
        return true;
    };

    WndHandlerConquest.prototype.onRcvData = function(data) {
        var that = this,
            movements = data.json.movements;

        this.wnd.setContent2(data.html);

        // initialize countdowns
        if (movements) {
            var i = movements.length,
                mov,
                $conquest = $('#conquest'),
                $command_countdown;

            $conquest.tooltip($conquest.data('tooltip'));

            while (i--) {
                mov = movements[i];
                $command_countdown = $('#command_countdown_' + mov[0]);
                $command_countdown.countdown(mov[1]);
                $command_countdown.on('finish', function() {
                    that.wnd.requestContentGet('conquest_info', 'getinfo', {
                        'id': that.currenttownId
                    });
                });
            }
        }
    };

    WndHandlerConquest.prototype.onMessage = function(msgID, p1) {
        if (msgID === 'setTown' && p1 == this.currenttownId) {
            return;
        }

        this.currenttownId = p1;
        this.wnd.requestContentGet('conquest_info', 'getinfo', {
            'id': p1
        });
    };

    us.extend(WndHandlerConquest.prototype, Backbone.Events);

    window.WndHandlerConquest = WndHandlerConquest;
}());

GPWindowMgr.addWndType('CONQUEST', null, window.WndHandlerConquest, 1, true);