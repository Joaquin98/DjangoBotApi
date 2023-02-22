/* global WndHandlerDefault, WndHandlerTown, DM, GPWindowMgr */
(function() {
    'use strict';

    var SpellsDialogController = require('features/spells_dialog/controllers/spells_dialog_command'),
        TargetType = require('features/spells_dialog/enums/target_type');

    var WndHandlerAtkCommand = function(window) {
        this.wnd = window;
        this.command_id = -1;
        this.own_command = false;
    };

    WndHandlerAtkCommand.inherits(WndHandlerDefault);

    WndHandlerAtkCommand.prototype.getDefaultWindowOptions = function() {
        return {
            height: 440,
            width: 590,
            resizable: true,
            minimizable: true,
            title: 'Untitled Window'
        };
    };

    WndHandlerAtkCommand.prototype.onInit = function(title, UIopts, commandID) {
        this.wnd.requestContentGet('command_info', 'info', {
            'command_id': commandID
        });

        return true;
    };

    WndHandlerAtkCommand.prototype.onRcvData = function(data) {
        var that = this;

        this.command_id = data.command_id;

        if (typeof data.own_command === 'boolean') {
            this.own_command = data.own_command;
        }

        if (data.html) {
            this.wnd.setContent2(data.html);
        } else {
            this.showSpellsDialogTab();
        }

        $('.arrival_at_countdown#arrival_' + this.command_id).countdown2({
            display: 'readable_seconds',
            timestamp_end: data.arrival_at
        }).on('cd:finish', function() {
            that.wnd.close();
        });

        $('#cancel_command_' + this.command_id).on("click", function() {
            that.cancel();
        });
    };

    WndHandlerAtkCommand.prototype.showSpellsDialogTab = function() {
        var controller = new SpellsDialogController({
            el: this.wnd.getJQElement().find('.gpwindow_content'),
            cm_context: this.wnd.getContext(),
            target_id: this.command_id,
            target_type: TargetType.COMMAND,
            is_own_command: this.own_command,
            models: {
                player_gods: this.getModels().player_gods
            },
            collections: {
                movements_units: this.getCollections().movements_units
            },
            l10n: DM.getl10n('spells_dialog', 'cast_spell')
        });

        controller.renderPage();
    };

    WndHandlerAtkCommand.prototype.showPowerDescription = function(power) {
        WndHandlerTown.prototype.showPowerDescription.call(this, power);
    };

    WndHandlerAtkCommand.prototype.cancel = function() {
        this.wnd.ajaxRequestPost('command_info', 'cancel_command', {
            'id': this.command_id
        }, function(wnd, data) {
            if (data.success) {
                if (data.command_deleted) {
                    wnd.close();
                } else {
                    wnd.requestContentGet('command_info', 'info', {
                        'command_id': this.command_id
                    });
                }
            }
        }.bind(this));
    };

    GPWindowMgr.addWndType('ATK_COMMAND', null, WndHandlerAtkCommand);
}());