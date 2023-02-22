/* globals GPWindowMgr, Timestamp, Layout, HelperTown, WndHandlerDefault */
var WndHandlerConqueror = function(wndhandle) {
    this.wnd = wndhandle;
    this.command_id = -1;
    this.other_town_id = -1;
};

WndHandlerConqueror.inherits(WndHandlerDefault);

WndHandlerConqueror.prototype.getDefaultWindowOptions = function() {
    return {
        height: 330,
        width: 480,
        resizable: false,
        title: _('Conquest information')
    };
};

WndHandlerConqueror.prototype.onInit = function(title, UIopts, command_id, other_town_id) {
    this.command_id = command_id;
    this.other_town_id = other_town_id;
    this.wnd.requestContentGet('command_info', 'conquest_info', {
        'command_id': this.command_id
    });
    return true;
};

WndHandlerConqueror.prototype.refresh = function(command_id, other_town_id) {
    // only refresh if command is different from the saved one
    if (this.command_id !== command_id) {
        this.command_id = command_id;
        this.other_town_id = other_town_id;
        this.wnd.requestContentGet('command_info', 'conquest_info', {
            'command_id': this.command_id
        });
        return true;
    }
    return false;
};

WndHandlerConqueror.prototype.onClose = function() {
    return true;
};


WndHandlerConqueror.prototype.onRcvData = function(data) {
    if ((!data.json.finished || data.json.finished <= 0) && !data.json.movements) {
        return;
    }
    this.wnd.setContent2(data.html);
    // initialize countdowns
    if (data.json.movements) {
        var movs = data.json.movements,
            i = movs.length,
            mov;

        while (i--) {
            mov = movs[i];
            //jshint ignore:start
            $('#command_countdown_' + mov[0]).countdown2({
                value: mov[1] - Timestamp.now(),
                name: 'command_countdown_' + mov[0]
            }).on('cd:finish', function(e) {
                $(e.target).parent().parent().hide();
            });
            //jshint ignore:end
        }
    }

    this.wnd.getJQElement().find('#conqueror_units_in_town span.eta').countdown2({
        value: data.json.finished - Timestamp.now()
    }).on('cd:finish', function() {
        if (Layout.conquestWindow.getWnd()) {
            // notice: in some cases this is not necessary, because the hole page are reloaded!
            Layout.conquestWindow.close();
            HelperTown.switchToNextTown();
        } else {
            Layout.conquerorWindow.close();
        }
    });
};


WndHandlerConqueror.prototype.showTroops = function() {
    this.wnd.getJQElement().find('span.countdown').countdown();

    this.wnd.requestContentGet('command_info', 'conquest_movements', {
        'town': this.other_town_id
    });
};

WndHandlerConqueror.prototype.publish = function() {
    var that = this;
    // send ajax request
    this.wnd.ajaxRequestPost('conquest_info', 'publish', {
        command_id: this.command_id
    }, function(window, data) {
        if (data.public_id) {
            that.wnd.getJQElement().find('.publish_conquest_public_id_wrap').css('display', 'block');
            that.wnd.getJQElement().find('#publish_conquest_public_id').val('[conquest]' + data.public_id + '[/conquest]');
            that.wnd.getJQElement().find('.publish_btn').css('display', 'none');
        }
    });
};

WndHandlerConqueror.prototype.unpublish = function() {
    var that = this;
    // send ajax request
    this.wnd.ajaxRequestPost('conquest_info', 'unpublish', {
        command_id: this.command_id
    }, function(window, data) {
        that.wnd.getJQElement().find('.publish_conquest_public_id_wrap').css('display', 'none');
        that.wnd.getJQElement().find('#publish_conquest_public_id').val('');
        that.wnd.getJQElement().find('.publish_btn').css('display', 'block');
    });
};

GPWindowMgr.addWndType('CONQUEROR', null, window.WndHandlerConqueror, 1);