/* globals WndHandlerDefault, WorldWonders, WMap, GameEvents, DM, GPWindowMgr, JSON, Game, CM, Timestamp */
(function() {
    'use strict';

    var GameDataFeatureFlags = require('data/features'),
        GameDataWorldWonders = require('data/world_wonders'),
        GREAT_PYRAMID_OF_GIZA = 'great_pyramid_of_giza',
        HANGING_GARDENS_OF_BABYLON = 'hanging_gardens_of_babylon',
        COLOSSUS_OF_RHODES = 'colossus_of_rhodes';

    function WndHandlerWonders(wndhandle) {
        this.wnd = wndhandle;
        this.island_x = 0;
        this.island_y = 0;
        this.wonder = null;
    }

    WndHandlerWonders.inherits(WndHandlerDefault);

    WndHandlerWonders.prototype.getDefaultWindowOptions = function() {
        var is_new_endgame = GameDataFeatureFlags.isNewWorldWonderEndgameEnabled(),
            dialog_class = is_new_endgame ? 'world_wonders' : '',
            height = is_new_endgame ? 570 : 520,
            width = is_new_endgame ? 800 : 762;

        return {
            height: height,
            width: width,
            resizable: false,
            minimizable: true,
            title: _('Construction site for a World Wonder'),
            dialogClass: dialog_class
        };
    };

    WndHandlerWonders.prototype.onInit = function(title, UIopts, island_x, island_y) {
        this.island_x = island_x;
        this.island_y = island_y;

        this.wnd.requestContentGet(
            'wonders',
            GameDataFeatureFlags.isNewWorldWonderEndgameEnabled() && !Game.age_of_wonder_started_at ? 'info' : 'index', {
                island_x: island_x,
                island_y: island_y
            }
        );

        return true;
    };

    WndHandlerWonders.prototype.registerComponents = function() {
        require('helpers/wonder').registerGracePeriodProgressBar(this.wnd);
    };

    WndHandlerWonders.prototype.onRcvData = function(data, controller, action) {
        var html = data.html ? data.html : null,
            menu = data.menu ? JSON.parse(data.menu) : false,
            wonder_data = data.data;

        if (menu && action === 'index' && menu['wonders-index'].disabled) {
            return;
        }

        if (wonder_data && wonder_data.wonder_name) {
            this.wnd.setTitle(wonder_data.wonder_name);
        }

        if (html) {
            this.wnd.setContent(html);

            if (action === 'info') {
                return;
            }
        }

        this.registerComponents();
        this.registerEventListeners();

        // Handle the send resources to WW window
        if ((action === 'index' ||
                action === 'start_next_building_phase' ||
                action === 'decrease_build_time_with_favor'
            ) && wonder_data.created_at) {
            WorldWonders.initiateSendResourcesTab(this, wonder_data, {
                x: this.island_x,
                y: this.island_y
            });
        }

        if (wonder_data && wonder_data.upgrade_cooldown && wonder_data.expansion_stage === 9) {
            this.initializeUpgradeCooldown(wonder_data.upgrade_cooldown, wonder_data.upgrade_cooldown_start);
        }

        var inactive_send_resources_btn = $('a.button.inactive_send_resources_btn'),
            inactive_reduce_build_time_btn = $('a.button.inactive_reduce_build_time_btn');

        inactive_send_resources_btn.tooltip(inactive_send_resources_btn.attr('data-tooltip'));
        inactive_reduce_build_time_btn.tooltip(inactive_reduce_build_time_btn.attr('data-tooltip'));

        this.registerTooltips();
    };

    WndHandlerWonders.prototype.onMessage = function() {
        return null;
    };

    WndHandlerWonders.prototype.buildWonder = function() {
        this.wnd.ajaxRequestPost('wonders', 'build_wonder', {
            island_x: this.island_x,
            island_y: this.island_y,
            wonder_type: this.wonder
        }, function(wnd) {
            WMap.pollForMapChunksUpdate();
            wnd.requestContentGet('wonders', 'index', {
                island_x: this.island_x,
                island_y: this.island_y
            });
        }.bind(this));
    };

    WndHandlerWonders.prototype.decreaseBuildTimeWithFavor = function() {
        // Deactivate the button after spending favor
        this.wnd.getJQElement().find('#ww_accelerate_construction_button').addClass('inactive').removeAttr('onclick');

        this.wnd.requestContentPost('wonders', 'decrease_build_time_with_favor', {
            island_x: this.island_x,
            island_y: this.island_y
        });
    };

    WndHandlerWonders.prototype.chooseWonder = function(wonder_type) {
        var root = this.wnd.getJQElement(),
            descriptions = root.find('div.wonder_descriptions'),
            confirm_button = root.find('div.confirm_wonder_button');

        if (this.wonder !== null) {
            descriptions.find('li.' + this.wonder).hide();
        }

        this.wonder = wonder_type;

        root.find('div.wonder_info_text_wrapper').hide();
        root.find('ul.wonder_building_options > li')
            .removeClass('selected')
            .filter('li.' + wonder_type)
            .addClass('selected');
        descriptions.show().find('li.' + wonder_type).show();
        descriptions.append(confirm_button.show());
    };

    WndHandlerWonders.prototype.startNextBuildingPhase = function() {
        this.wnd.requestContentPost('wonders', 'start_next_building_phase', {
            island_x: this.island_x,
            island_y: this.island_y
        });
    };

    WndHandlerWonders.prototype.toggleInfoText = function() {
        var root = this.wnd.getJQElement(),
            wonder_info_text = root.find('div.wonder_info_text'),
            container = root.find('div.gpwindow_content'),
            wonder_controls = root.find('.wonder_controls');

        wonder_info_text.toggle();
        root.find('a.toggle_wonder_info_text').toggleClass('open closed');

        if (wonder_info_text.css("display") === "block") {
            container.scrollTop(parseInt(wonder_controls.outerHeight(true), 10));
        }
    };

    WndHandlerWonders.prototype.refresh = function() {
        this.wnd.requestContentGet('wonders', 'index', {
            island_x: this.island_x,
            island_y: this.island_y
        });
    };

    WndHandlerWonders.prototype.registerEventListeners = function() {
        var that = this,
            cm_context = this.wnd.getContext();

        this.unregisterEventListeners();

        $.Observer(GameEvents.town.town_switch).subscribe(['WndHandlerWonders', 'WndHandlerWonders' + cm_context.main],
            function() {
                that.wnd.requestContentGet('wonders', 'index', {
                    island_x: that.island_x,
                    island_y: that.island_y
                });
            }
        );
    };

    WndHandlerWonders.prototype.registerTooltips = function() {
        var root = this.wnd.getJQElement(),
            wonders = root.find('.wonder_building_options').children();

        for (var i = 0; i < wonders.length; i++) {
            $(wonders[i]).tooltip(this.getWorldWonderTooltip(wonders[i].getAttribute('data-type')));
        }
    };

    WndHandlerWonders.prototype.getWorldWonderTooltip = function(data_type) {
        var tooltip_title = this.getWonderTooltipTitle(data_type),
            tooltip_description = this.getWonderTooltipDescription(data_type);

        return tooltip_title + '<br/>' + tooltip_description;
    };

    WndHandlerWonders.prototype.getWonderTooltipTitle = function(data_type) {
        return '<b>' + DM.getl10n('world_wonder_tooltips')[data_type].title + '</b>';
    };

    WndHandlerWonders.prototype.getWonderTooltipDescription = function(data_type) {
        var modification_value = 0;

        switch (data_type) {
            case COLOSSUS_OF_RHODES:
                modification_value = GameDataWorldWonders.getMaxExpansionStage();
                break;
            case GREAT_PYRAMID_OF_GIZA:
                modification_value = GameDataWorldWonders.getStorageModificationForPyramid();
                break;
            case HANGING_GARDENS_OF_BABYLON:
                modification_value = GameDataWorldWonders.getResourceProductionModificationForHangingGardens() * 100;
                break;
            default:
                modification_value = GameDataWorldWonders.getMythUnitsModificationForMausoleum() * 100;
                break;
        }

        return DM.getl10n('world_wonder_tooltips')[data_type].description(modification_value);
    };

    WndHandlerWonders.prototype.initializeUpgradeCooldown = function(upgrade_cooldown, upgrade_cooldown_start) {
        var $progress = this.wnd.getJQElement().find('#ww_cooldown_progressbar'),
            cm_context = this.wnd.getContext();

        if ($progress.length && upgrade_cooldown > Timestamp.now()) {
            CM.unregister(cm_context, 'cooldown_progress');
            CM.register(cm_context, 'cooldown_progress', $progress.singleProgressbar({
                max: upgrade_cooldown - upgrade_cooldown_start,
                value: upgrade_cooldown - Timestamp.now(),
                type: 'time',
                caption: _('Cooldown'),
                countdown: true,
                template: 'tpl_pb_single_nomax',
                reverse_progress: true,
                liveprogress: true,
                liveprogress_interval: 1,
                countdown_settings: {
                    display_days: true
                }
            }).on('pb:cd:finish', this.refresh.bind(this)));
        }
    };

    WndHandlerWonders.prototype.unregisterEventListeners = function() {
        var cm_context = this.wnd.getContext();

        $.Observer().unsubscribe(['WndHandlerWonders', 'WndHandlerWonders' + cm_context.main]);
    };

    WndHandlerWonders.prototype.onClose = function() {
        this.unregisterEventListeners();

        return true;
    };

    GPWindowMgr.addWndType('WONDERS', null, WndHandlerWonders);
}());