/* global MM, Quickbar, GameData, PlayerInfo, us, gpAjax, HumanMessage, BuyForGoldWindowFactory, url, Game,
GPWindowMgr, JSON */
(function() {
    'use strict';

    function WndHandlerPlayerSettings(wndhandle) {
        this.wnd = wndhandle;

        this.controller = 'player';
        this.action = 'index';
    }
    WndHandlerPlayerSettings.inherits(window.AbstractWndHandlerEmailValidation);

    WndHandlerPlayerSettings.prototype.getDefaultWindowOptions = function() {
        return {
            height: 570,
            width: 850,
            resizable: false,
            minimizable: true,
            title: 'Untitled Window',
            'fullwindow': true
        };
    };

    /**
     *
     * Window Initialitation
     *
     * @param title window title
     * @param UIopts jQuery UI Options for the window
     * @param variant the window parameters passed to the GPWindowMgr.new() function
     *
     * @return boolean false would abort window creation
     **/
    WndHandlerPlayerSettings.prototype.onInit = function(title, UIopts, controller, action) {
        var args = UIopts || {};
        var index_controller = controller || 'player';
        var settings_action = action || 'index';

        if (!args.noInitRequest) {
            this.wnd.requestContentGet(index_controller, settings_action, args);
        }

        return true;
    };

    WndHandlerPlayerSettings.prototype.onClose = function() {
        var iframe = this.wnd.getJQElement().find('#player_settings iframe, .player_settings iframe');
        if (iframe.length > 0) {
            iframe.remove();
        }
        $('#version').appendTo('body').hide();
        return true;
    };

    WndHandlerPlayerSettings.prototype.onRcvData = function(data, controller, action) {
        var that = this;

        this.wnd.getJQElement().find('.settings-container').removeClass(this.action).addClass(action);

        this.controller = controller;
        this.action = action;

        if (this.wnd.getJQElement().find('.settings-menu').length === 0) {
            if (data.backbone && !GameData.settingsBackboneTemplate) {
                GameData.add({
                    settingsBackboneTemplate: data.backbone
                });
                GameData.add({
                    settingsBackboneLinks: data.links
                });
            }

            this.wnd.setContent2(us.template(data.backbone || GameData.settingsBackboneTemplate, {
                menu: JSON.parse(data.links || GameData.settingsBackboneLinks)
            }));

            //Click handler for the settings menu
            this.wnd.getJQElement().find('.settings-menu').off('click').on("click", function(e) {
                var target = $(e.target),
                    id, controller = that.controller,
                    action = that.action;

                //If user clicked on link from the menu
                if (target.hasClass('settings-link')) {
                    id = target.attr('id').split('-');

                    //highlight menu item
                    PlayerInfo.highlightMenuOption(id[0], id[1], id[2]);

                    //show proper content
                    if (id[2] && id[0] === controller && id[1] === action) {
                        PlayerInfo.showSubCategory(id[2]);
                    } else {
                        that.wnd.requestContentGet(id[0], id[1], {}, function() {
                            if (id[2]) {
                                PlayerInfo.showSubCategory(id[2]);
                            }

                            PlayerInfo.bindEvents(id[0], id[1], id[2]);
                        });
                    }
                }
            });

            this.addVersionInfo();
        }

        this.wnd.setContent3('.settings-container', data.html);

        // the data we get give no clue if we have the quickbar settings page at hand
        // Since I remove the Initialize call from the template we need to initialize the quickbar
        // again
        // What could possibly go wrong with a regex?
        var quickbar_regex = /settings_quickbar/gi;
        if (quickbar_regex.test(data.html)) {
            Quickbar.initialize({
                quickbar: MM.getModelByNameAndPlayerId('Quickbar')
            });
        }

        //Click handler for the night graphics option
        $('#player_settings input.night_gfx').each(function(i, elem) {
            $(elem).off('change').on('change', function() {
                var that_elem = $(this);
                $('#player_settings input.night_gfx').each(function(i, elem) {
                    if (that_elem.is(':checked')) {
                        $(elem).prop('checked', true);
                    } else {
                        $(elem).prop('checked', false);
                    }
                });
            });
        });

        var form = this.wnd.getJQElement().find('#validate_form [name=code]');
        form.off().on('keydown', function(e) {
            if (e.keyCode === 13 && form.val() !== '') { // Esc
                that.validateEmail();
            }
        });

        that.bindFilterSelectableTimezonesEvent();

        //the accounts settings shouldn't be visible for admins
        if (Game.admin) {
            $(".settings-menu b:nth-of-type(2)").empty();
            $(".settings-menu ul:nth-of-type(2)").empty();
            $(".settings-menu .with-icon").remove();
            $(".settings-menu #support").remove();
            $(".settings-menu #data_privacy_management").remove();
        }
    };

    WndHandlerPlayerSettings.prototype.changePassword = function() {
        this.wnd.requestContentPost('player', 'do_change_password');
    };

    //settings
    // TODO: check if it can be easily removed and remove that
    WndHandlerPlayerSettings.prototype.saveSettings = function(reload_grepo) {
        var root = this.wnd.getJQElement();
        var setting_types = [
            'timezone',
            'building_finished',
            'notification_all_building_finished',
            'notification_on_all_recruitment_finished',
            'new_report',
            'new_message',
            'use_localstore',
            'windowmgr_max_concurrent',
            'windowmgr_nav_scale',
            'build_from_town_index_enabled',
            'gfx_level',
            'auto_open_town_index_enabled',
            'map_arrow_show_always',
            'notification_building_finished',
            'notification_block_invitation',
            'show_confirmation_popups',
            'night_gfx',
            'center_town_on_map',
            'report_arriving_support',
            'report_support_from_others',
            'report_returning_support',
            'report_withdraw_support_own',
            'report_units_in_ghost_town',
            'notification_units_in_ghost_town',
            'notification_militia_popup',
            'notification_phoenician_salesman',
            'report_spells_from_myself',
            'notification_receive_daily_non_winner_messages',
            'map_show_supporting_units',
            'map_show_player_in_attackable_point_range',
            'webnotification_combat_attack_incoming',
            'webnotification_combat_attack_reminder',
            'webnotification_communication_report_arrived',
            'webnotification_communication_message_arrived',
            'webnotification_communication_alliance_message_arrived',
            'webnotification_communication_alliance_message_arrived_duration',
            'webnotification_island_island_quest_satisfied',
            'webnotification_island_island_quest_added',
            'webnotification_resources_storage_full',
            'webnotification_resources_favor_full',
            'webnotification_resources_trade_arrived',
            'webnotification_city_building_upgraded',
            'webnotification_city_building_upgraded_duration',
            'webnotification_city_barracks_unit_order_done',
            'webnotification_city_barracks_unit_order_done_duration',
            'webnotification_city_docks_unit_order_done',
            'webnotification_city_docks_unit_order_done_duration',
            'webnotification_city_research_completed',
            'webnotification_city_research_completed_duration',
            'webnotification_city_advisor_running_out',
            'webnotifications_in_foreground',
            'pause_attack_notifications',
            'push_notification_point_cutoff',
            'push_notification_minute_delay'
        ];
        var settings = {};

        $.each(setting_types, function(i, setting) {
            var input = root.find('#player_settings [name=' + setting + ']');
            if (input.length > 0) {
                settings[setting] = input.is('[type="checkbox"]') ? input.is(':checked') : input.val();
            }
        });

        this.wnd.ajaxRequestPost('player', 'save_reminders', settings, function() {
            if (reload_grepo) {
                location.reload();
            }
        });
    };

    // Shared internet connections
    WndHandlerPlayerSettings.prototype.insertSharedConnection = function() {
        var root = this.wnd.getJQElement();
        var params = {};
        params.name = root.find('#insert_shared_connection_player').val();

        if (!params.name) {
            HumanMessage.error(_('The player was not found'));
            return;
        }

        this.wnd.ajaxRequestPost('player', 'insert_shared_connection', params, function(window, data) {
            //insert html
            root.find('#shared_connection_table').append(data.insert_html);
            root.find('#shared_connections').show();

            //clear input field
            root.find('#insert_shared_connection_player').val('');
        });
    };

    WndHandlerPlayerSettings.prototype.deleteSharedConnection = function(shared_player_id) {
        var root = this.wnd.getJQElement();

        this.wnd.ajaxRequestPost('player', 'delete_shared_connection', {
            shared_player_id: shared_player_id
        }, function(window, data) {
            //insert html
            root.find('#shared_connection_' + data.shared_player_id).remove();
            //hide players table, if no player is inserted
            if (root.find('#shared_connection_table tr').length === 0) {
                root.find('#shared_connections').hide();
            }
        });

    };

    //vacation mode
    WndHandlerPlayerSettings.prototype.startVacation = function() {
        var wnd = this.wnd;

        gpAjax.ajaxPost('player', 'start_vacation', {}, true, function(data) {
            wnd.setContent3('.settings-container', data.html);
        });
    };
    //buy vacation days
    WndHandlerPlayerSettings.prototype.buyVacationDays = function(buy_vacation_days_gold, button) {
        var days = parseInt($('#vacation_order_input').val(), 10),
            disabled = 'inactive',
            confirm, that = this;

        button = $(button);
        if (!days || button.hasClass(disabled)) {
            return;
        }

        button.disable = function() {
            button.addClass('disabled');
        };
        button.enable = function() {
            button.removeClass('disabled');
        };

        confirm = function() {
            gpAjax.ajaxPost('player', 'buy_vacation_days', {
                days: days
            }, false, function(data) {
                that.wnd.setContent3('.settings-container', data.html);
            });
        };

        BuyForGoldWindowFactory.openBuyVacationDaysForGoldWindow(button, days, days * buy_vacation_days_gold, confirm);

    };

    WndHandlerPlayerSettings.prototype.sendDeleteAccountRequest = function() {
        var password = this.wnd.getJQElement().find('#delete_request_password').val();
        if (password === '') {
            HumanMessage.error(_('You have to enter your password to authorize the deletion of your account.'));
            return;
        }

        gpAjax.ajaxPost('player', 'do_delete_account', {
            password: password
        });
    };

    WndHandlerPlayerSettings.prototype.openPopup = function(action, width, height) {
        var popup_url = url('player', action),
            popup_window = window.open(popup_url, 'popup', 'width=' + width + ', height=' + height + ', resizable=yes, scrollbars=yes');

        popup_window.trigger("focus");
    };

    /**
     * Restart game
     */
    WndHandlerPlayerSettings.prototype.sendRestartMailRequest = function() {
        var root = this.wnd.getJQElement().find('#player_settings');
        var confirmed = root.find('input:checkbox').is(':checked');
        var password = root.find('input:password').val();
        if (!confirmed) {
            HumanMessage.error(_('You must confirm the restart first'));
            return;
        }

        gpAjax.ajaxPost('player', 'request_restart_email', {
            confirmed: confirmed,
            password: password
        }, true);
    };

    WndHandlerPlayerSettings.prototype.filterSelectableTimezones = function() {
        var root = this.wnd.getJQElement();
        var input = root.find('#player_settings [name=timezone_continent]');
        var list = root.find('#player_settings [name=timezone]');
        var foo = '';
        if (input.length > 0) {
            var value = input.is('[type="checkbox"]') ? input.is(':checked') : input.val();

            if (GameData.timezones && GameData.timezones[value]) {
                list.empty();
                $.each(GameData.timezones[value], function(key, timezone) {
                    foo += '<option value="' + timezone.value + '" ' + (Game.player_timezone === timezone.value ? 'selected="selected"' : '') + '>' + timezone.name + '</option>';
                });
                list.append(foo);
            }
        }
    };

    WndHandlerPlayerSettings.prototype.bindFilterSelectableTimezonesEvent = function() {
        var that = this;
        var root = this.wnd.getJQElement();
        var input = root.find('#player_settings [name=timezone_continent]');

        input.off('change').on("change", function() {
            that.filterSelectableTimezones();
        });
    };

    WndHandlerPlayerSettings.prototype.changeEmail = function() {
        var params = {};
        params.email = this.wnd.getJQElement().find('#change_email_form [name=email]').val();
        params.password = this.wnd.getJQElement().find('#change_email_form [name=password]').val();

        this.wnd.ajaxRequestPost('player', 'change_email', params, function(window, data) {
            this.wnd.setContent3('.settings-container', data.html);
        }.bind(this));
    };

    WndHandlerPlayerSettings.prototype.addVersionInfo = function() {
        var elm = $('#version');
        elm.appendTo(this.wnd.getJQElement().find('.settings-menu')).show();
    };

    GPWindowMgr.addWndType('PLAYER_SETTINGS', 'b_settings', WndHandlerPlayerSettings, 1);
}());