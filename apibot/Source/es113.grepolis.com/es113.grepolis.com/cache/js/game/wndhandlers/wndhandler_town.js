/* global TownInfoHelper, WndHandlerTowns, ITowns, gpAjax, GPWindowMgr, Game, Espionage, DM, us, GameEvents, CM,
GameData */

(function() {
    'use strict';

    // Used to store data for different trading targets /windows
    var TradeTabData = {
        spinners: {},
        progressbars: {}
    };

    // trading uses a different API, callback / action is handled here
    var trade_action_callbacK = function(target_id, wnd_typeinforefid) {
        //User can open more trading windows, we need to update them
        var wnds = GPWindowMgr.getOpen(GPWindowMgr.TYPE_TOWN);

        var sp_wood = TradeTabData.spinners[target_id].wood,
            sp_stone = TradeTabData.spinners[target_id].stone,
            sp_iron = TradeTabData.spinners[target_id].iron,
            pb_wood = TradeTabData.progressbars[target_id].wood,
            pb_stone = TradeTabData.progressbars[target_id].stone,
            pb_iron = TradeTabData.progressbars[target_id].iron,
            pb_capacity = TradeTabData.progressbars[target_id].capacity,

            wood = sp_wood.getValue(),
            stone = sp_stone.getValue(),
            iron = sp_iron.getValue(),
            sent_resources = parseInt(wood, 10) + parseInt(stone, 10) + parseInt(iron, 10),

            i, l = wnds.length,
            handler;

        gpAjax.ajaxPost('town_info', 'trade', {
            id: target_id,
            wood: parseInt(wood, 10),
            stone: parseInt(stone, 10),
            iron: parseInt(iron, 10)
        }, false, function(data) {
            sp_wood.setValue(0);
            sp_stone.setValue(0);
            sp_iron.setValue(0);

            pb_capacity.setValue(pb_capacity.getValue() - sent_resources);

            //When you send resources to different players these pb are not shown
            if (pb_wood) {
                pb_wood.changeValueBy('value2', wood);
                pb_stone.changeValueBy('value2', stone);
                pb_iron.changeValueBy('value2', iron);
            }

            //Update rest of windows
            for (i = 0; i < l; i++) {
                //Windows need to have the same type and... (check next condition)
                if (wnds[i].typeinforefid !== wnd_typeinforefid) {
                    handler = wnds[i].getHandler();

                    //... and the same action @see GP-10656
                    if (handler && handler.action === 'trading') {
                        wnds[i].requestContentGet('town_info', 'trading', {
                            id: handler.target_id
                        });
                    }
                }
            }
        }, {}, 'town_info_trade');
    };

    function WndHandlerTown(wndhandle) {
        this.currentTownID = -1;
        this.wnd = wndhandle;
        this.sameIsland = null;
        this.action = null;
        this.target_id = null;
    }

    WndHandlerTown.inherits(WndHandlerTowns);

    WndHandlerTown.prototype.getDefaultWindowOptions = function() {
        return {
            minHeight: 460,
            height: 460,
            width: 590,
            autoresize: false,
            minimizable: true,
            title: ''
        };
    };

    /**
     * Window Initialization
     *
     *  @param title String	=> window title
     *  @param UIopts Object	=> Jquery UI Options for the window
     *  variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * @return Boolean
     **/
    WndHandlerTown.prototype.onInit = function(title, UIopts, arg3) {
        this.wnd.requestContentGet('town_info', UIopts.action, arg3);

        return true;
    };

    WndHandlerTown.prototype.onBeforeReloadContent = function() {
        if (this.espionage_class) {
            this.espionage_class.destroy();
        }
    };

    WndHandlerTown.prototype.onReloadContentError = function() {
        this.registerEventListeners();
    };

    WndHandlerTown.prototype.onBeforeTabSwitch = function( /*tabSwitch*/ ) {
        if (this.espionage_class) {
            this.espionage_class.destroy();
        }

        this.unregisterEventListeners();

        return true;
    };

    WndHandlerTown.prototype.onClose = function() {

        //Call "onClose" method from the hanlder attack window
        this.parent.onClose.apply(this, arguments);

        if (this.espionage_class) {
            this.espionage_class.destroy();
        }

        this.unregisterEventListeners();
        return true;
    };

    WndHandlerTown.prototype.onRcvData = function(data, controller, action) {
        var html, town_name,
            root = this.wnd.getJQElement();

        this.action = action;
        if (data && data.json) {
            this.target_id = data.json.target_id ? data.json.target_id : null;
            town_name = data.json.town_name ? data.json.town_name : null;
        }

        this.unregisterEventListeners();
        switch (action) {
            case 'attack':
                //Call "onreceive" method from the hanlder attack window
                this.parent.parent.onRcvData.apply(this, arguments);
                this.registerEventListeners();
                TownInfoHelper.closeDuplicateOldStyleWindow('div.attack_support_tab_target_' + this.target_id);
                break;
            case 'espionage':
                this.target_id = data.target_id;
                //This window is opened when you click on the opponent's town and choose "Spy"
                this.espionage_class = new Espionage(this.target_id, this.wnd, data);

                this.registerEventListeners();
                TownInfoHelper.closeDuplicateOldStyleWindow('div.espionage_tab_target_' + this.target_id);
                break;
            case 'support':
                //Call "onreceive" method from the hanlder attack window
                this.parent.parent.onRcvData.apply(this, arguments);
                this.registerEventListeners();
                TownInfoHelper.closeDuplicateOldStyleWindow('div.attack_support_tab_target_' + this.target_id);
                break;
            case 'god':
                var CastSpellOnTown = require("strategy/cast_spell_own_town"),
                    SpellsDialogController = require('features/spells_dialog/controllers/spells_dialog_town'),
                    spells_dialog_controller = new SpellsDialogController({
                        el: root,
                        cm_context: this.wnd.getContext(),
                        target_id: this.target_id,
                        town_name: town_name,
                        models: this.wnd.getModels(),
                        strategies: {
                            cast_spell_own_town: new CastSpellOnTown()
                        },
                        collections: this.wnd.getCollections(),
                        templates: data.templates,
                        l10n: DM.getl10n('spells_dialog', 'cast_spell')
                    });

                spells_dialog_controller.renderPage();



                /*var tmpl = data.tmpl.split('|||'),
                powers = tmpl.shift(),
                descr = tmpl.pop();

                //Its just a quickfix for casting powers on the towns independently
                this.PowerDescriptionTemplate = descr;

                html = us.template(powers, data.json);
                this.wnd.setContent(html);*/
                TownInfoHelper.closeDuplicateOldStyleWindow('div.powers_tab_target_' + this.target_id);
                break;
            case 'trading':
                this.wnd.setContent(data.html);

                root = this.wnd.getJQElement();
                var that = this;

                var sdata = data.data,
                    target_id = sdata.target_id,
                    free_trade_capacity = sdata.available_capacity,
                    max_capacity = sdata.max_capacity,
                    origin_resources = ITowns.getTown(Game.townId).getCurrentResources(),
                    origin_wood = origin_resources.wood,
                    origin_stone = origin_resources.stone,
                    origin_iron = origin_resources.iron;

                this.target_id = target_id;

                //Initialize variables
                TradeTabData.spinners[target_id] = {};
                TradeTabData.progressbars[target_id] = {};

                var pb_capacity;

                root.find('#big_progressbar .caption').removeClass('negative');
                pb_capacity = TradeTabData.progressbars[target_id].capacity = root.find('#big_progressbar').singleProgressbar({
                    value: free_trade_capacity,
                    max: max_capacity,
                    caption: _('Capacity:')
                }).on('pb:change:value', function(e, new_val, old_val) {
                    var $el = $(this),
                        $caption = $el.find('.caption'),
                        btn_trade_button = CM.get(that.wnd.getContext(), 'btn_trade_button');

                    if (new_val < 0) {
                        $caption.addClass('negative');
                        btn_trade_button.disable();
                    } else {
                        $caption.removeClass('negative');
                        btn_trade_button.enable();
                    }
                });

                if (sdata.resources) {
                    var storage_volume = sdata.storage_volume,
                        wood = sdata.resources.wood,
                        stone = sdata.resources.stone,
                        iron = sdata.resources.iron,
                        inc_res = sdata.incoming_resources;

                    //Initialize progressbars
                    var pb_wood = TradeTabData.progressbars[target_id].wood = root.find('#town_capacity_wood').progressbar({
                            max: storage_volume,
                            value: wood,
                            value2: inc_res.wood,
                            value3: 0
                        }),
                        pb_stone = TradeTabData.progressbars[target_id].stone = root.find('#town_capacity_stone').progressbar({
                            max: storage_volume,
                            value: stone,
                            value2: inc_res.stone,
                            value3: 0
                        }),
                        pb_iron = TradeTabData.progressbars[target_id].iron = root.find('#town_capacity_iron').progressbar({
                            max: storage_volume,
                            value: iron,
                            value2: inc_res.iron,
                            value3: 0
                        });
                }

                //Initialize spinners
                TradeTabData.spinners[target_id].wood = root.find('#trade_type_wood').spinner({
                    value: 0,
                    step: 500,
                    max: origin_wood,
                    tabindex: 51
                }).on('sp:change:value', function(e, new_val, old_val) {
                    pb_capacity.decr(new_val - old_val);

                    if (pb_wood) {
                        pb_wood.setValue(null, null, new_val);
                    }
                });
                TradeTabData.spinners[target_id].stone = root.find('#trade_type_stone').spinner({
                    value: 0,
                    step: 500,
                    max: origin_stone,
                    tabindex: 52
                }).on('sp:change:value', function(e, new_val, old_val) {
                    pb_capacity.decr(new_val - old_val);

                    if (pb_stone) {
                        pb_stone.setValue(null, null, new_val);
                    }
                });
                TradeTabData.spinners[target_id].iron = root.find('#trade_type_iron').spinner({
                    value: 0,
                    step: 500,
                    max: origin_iron,
                    tabindex: 53
                }).on('sp:change:value', function(e, new_val, old_val, arg) {
                    pb_capacity.decr(new_val - old_val);

                    if (pb_iron) {
                        pb_iron.setValue(null, null, new_val);
                    }
                });

                //Initialize Trade button
                var ctx = this.wnd.getContext();
                CM.register(ctx, 'btn_trade_button', root.find('.btn_trade_button').button({
                    caption: _('Send resources')
                }).on('btn:click', function() {
                    trade_action_callbacK(target_id, that.wnd.typeinforefid);
                }));

                //Clicking on the res icons sets max in the spinners
                root.find('.content').off('click').on('click', function(e) {
                    var target = $(e.target);

                    if (target.hasClass('icon')) {
                        var name = target.attr('name'),
                            sp = TradeTabData.spinners[target_id][name],
                            pb_capacity = TradeTabData.progressbars[target_id].capacity,
                            value = pb_capacity.getValue(),
                            town_resources = ITowns.getTown(Game.townId).getCurrentResources(),
                            max_res = town_resources[name];

                        if (value > max_res) {
                            value = max_res;
                        }

                        // toggle between 0 and value
                        if (sp.getValue() > 0) {
                            sp.setValue(0);
                        } else {
                            sp.setValue(value);
                        }
                    }
                });
                this.registerEventListeners();
                TownInfoHelper.closeDuplicateOldStyleWindow('div.trade_tab_target_' + this.target_id);
                break;
            case 'city_skins':
                if (data.html) {
                    html = data.html;
                }

                this.wnd.setContent(html);

                this.player_city_skins = this.wnd.getCollections().player_city_skins;
                this.player_city_skins.onChange(this, this.rerenderSelectButtonAndLockOverlay);

                this.registerCitySkinOverviewComponents();
                break;
            default:
                if (data.html) {
                    html = data.html;
                }
                this.wnd.setContent(html);
                //set up click handler
                root.find('a.town_bbcode_link').on('click', function() {
                    root.find('input.town_bbcode_id').toggle().trigger("focus");
                });
                break;
        }
    };

    WndHandlerTown.prototype.getPage = function(arg1, arg2) {
        this.wnd.requestContentGet('town_info', arg1, {
            id: arg2
        });
        return null;
    };

    WndHandlerTown.prototype.showPowerDescription = function(power) {
        this.wnd.getJQElement().find('#power_casted').hide();
        this.descr = this.wnd.getJQElement().find('#towninfo_description');
        this.descr.empty().hide().html(us.template(this.PowerDescriptionTemplate, GameData.powers[power])).fadeIn('slow');
    };

    /*WndHandlerTown.prototype.trade = function(town_id) {
      gpAjax.ajaxPost('town_info', 'trade', {'id' : town_id, 'wood' : $('#trade_type_wood').val(), 'stone' : $('#trade_type_stone').val(), 'iron' : $('#trade_type_iron').val()}, false, function (data) {
      slider_trade_type_wood.setValue(0);
      slider_trade_type_stone.setValue(0);
      slider_trade_type_iron.setValue(0);
      }.bind(this), {}, 'town_info_trade');
      };*/

    WndHandlerTown.prototype.inviteIntoAlliance = function(player_name) {
        this.wnd.ajaxRequestPost('alliance', 'invite', {
            player_name: player_name
        }, function(_wnd, return_data) {

        });
    };

    // from town:attack
    WndHandlerTown.prototype.setAttackType = function(elm) {

        var type;
        var class_name_parts;
        var class_names = (elm.className).split(' ');
        var i = class_names.length;
        while (i--) {
            var class_name = class_names[i];
            //find attack type, don't match the 'active'-class
            if (class_name !== 'attack_type_active' && class_name !== 'attack_type') {
                class_name_parts = class_name.split('_');
                if (class_name_parts.length === 3) {
                    type = class_name_parts[2];
                    break;
                }
            }
        }

        $(elm.parentNode).find('.attack_type').removeClass('attack_type_active');
        $(elm).addClass('attack_type_active');
        $(elm.parentNode).find('.attack_strategy_input').val(type);
    };

    WndHandlerTown.prototype.registerEventListeners = function() {
        var that = this;

        $.Observer(GameEvents.town.hide.change).subscribe(['WndHandlerTown' + this.wnd.getID()], function(e, data) {
            that.handleEvents(e, that, data);
        });

        $.Observer(GameEvents.town.town_switch).subscribe(['WndHandlerTown' + this.wnd.getID()], function(e, data) {
            that.handleEvents(e, that);
        });

        $.Observer(GameEvents.town.units.change).subscribe(['WndHandlerTown' + this.wnd.getID()], function(e, data) {
            that.handleEvents(e, that);
        });
    };

    WndHandlerTown.prototype.unregisterEventListeners = function() {
        $.Observer().unsubscribe(['WndHandlerTown' + this.wnd.getID()]);
    };

    /**
     * handle events for town
     *
     * @param object event
     * @param object that -> actual wndhandler
     */
    WndHandlerTown.prototype.handleEvents = function(event, that) {
        if (event.type === GameEvents.town.units.change) {
            if (that.data) {
                // update unit count from Layout.town
                var root = that.wnd.getJQElement();
                var units = ITowns.getTown(Game.townId).units();
                var unit_name;

                for (unit_name in that.data.units) {
                    if (!that.data.units.hasOwnProperty(unit_name)) {
                        continue;
                    }

                    that.data.units[unit_name].count = units[unit_name] || 0;
                    root.find('a#' + unit_name).children('span').html(that.data.units[unit_name].count);
                }
            }
        }

        if (event.type === GameEvents.town.town_switch /*|| event.type === GameEvents.town.hide.change*/ ) {
            //When you fast open "attack windows" from "Attacks" in Attack Planner, there is an error
            if (this.action === null) {
                //if the action is specified backend will trigger an error message. As a result, the new opened window will stay empty. So we have to close it
                this.wnd.close();
                return;
            }

            //When you use attack planner, you can click on the "sword" and send already defined attack. In this case
            //we don't want to refresh this window (preselect_units keeps information about units defined in AP), so:
            if (this.action === 'attack' && this.data && this.data.preselect_units) {
                return;
            }

            this.wnd.requestContentGet('town_info', this.action, {
                'id': this.target_id
            });
        }
    };

    WndHandlerTown.prototype.registerSkinSelectButton = function(button) {
        var context = this.wnd.getContext(),
            l10n = DM.getl10n('COMMON', 'city_skins_overview'),
            $button = $(button),
            $skin_id = $button.data('id'),
            $skin = this.player_city_skins.get($skin_id),
            $button_properties = {
                caption: l10n.select
            };

        if ($skin.getSelected()) {
            $button_properties = {
                caption: l10n.active,
                disabled: 'disabled'
            };
        } else if (!$skin.getAvailable()) {
            $button_properties = {
                caption: l10n.locked,
                disabled: 'disabled'
            };
        }

        CM.unregister(context, 'btn_select_' + $skin_id);
        CM.register(
            context,
            'btn_select_' + $skin_id,
            $button.button($button_properties).on('btn:click', function(e, _btn) {
                this.player_city_skins.activate(
                    $skin_id, {
                        success: function() {
                            $.Observer(GameEvents.map.refresh.towns).publish({});
                        },
                        error: function() {}
                    }
                );
            }.bind(this)));
    };

    WndHandlerTown.prototype.registerLockOverlay = function(element) {
        var $element = $(element);

        if (!this.player_city_skins.get($element.data('id')).getAvailable()) {
            $element.addClass('locked');

            return;
        }

        $element.removeClass('locked');
    };

    WndHandlerTown.prototype.registerCitySkinOverviewComponents = function() {
        var context = this.wnd.getContext(),
            $root = this.wnd.getJQElement(),
            l10n = DM.getl10n('COMMON', 'city_skins_overview'),
            $viewport = $root.find('.js-scrollbar-viewport');

        CM.unregister(context, 'city_skins_scroll');
        CM.register(context, 'city_skins_scroll', $viewport.skinableScrollbar({
            template: 'tpl_skinable_scrollbar',
            skin: 'blue',
            elements_to_scroll: $root.find('.js-scrollbar-content'),
            element_viewport: $viewport
        }));

        $root.find('.skin_name').each(function(idx, element) {
            var $element = $(element);

            $element.text(l10n.skins[$element.data('id')]);
        });

        $root.find('.btn_select_skin').each(function(idx, button) {
            this.registerSkinSelectButton(button);
        }.bind(this));

        $root.find('.lock_overlay').each(function(idx, element) {
            this.registerLockOverlay(element);
        }.bind(this));
    };

    WndHandlerTown.prototype.rerenderSelectButtonAndLockOverlay = function(skin) {
        this.registerSkinSelectButton(this.wnd.getJQElement().find('.btn_select_skin[data-id=' + skin.getId() + ']'));
        this.registerLockOverlay(this.wnd.getJQElement().find('.lock_overlay[data-id=' + skin.getId() + ']'));
    };

    GPWindowMgr.addWndType('TOWN', 'taskbar_town_info', WndHandlerTown);

    window.WndHandlerTown = WndHandlerTown;
}());