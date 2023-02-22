/* global WndHandlerDefault, Backbone, ITowns, HumanMessage, DM, GameDataHeroes, s, CM, AttackPlannerWindowFactory */
/* global readableUnixTimestamp, Timestamp, Game, GameData, GameEvents, DateHelper, TooltipFactory */
/* global PlaceWindowFactory, HeroesWindowFactory, hOpenWindow, MousePopup, MM */

window.WndHandlerAttack = (function() {
    'use strict';

    var heroes_enum = require('enums/heroes');
    var town_types_enum = require('enums/town_types');
    var attack_enums = require('enums/attack_table_box_enums');
    var power_enums = require('enums/powers');
    var GameDataUnits = require('data/units');
    var ConfirmationWindowFactory = require('factories/windows/dialog/confirmation_window_factory');
    var OlympusHelper = require('helpers/olympus');
    var SubWindowHelper = require('helpers/sub_window');
    var SpellsDialogController = require('features/spells_dialog/controllers/spells_dialog_attack');
    var TargetType = require('features/spells_dialog/enums/target_type');
    var UnitNumbersHelper = require('helpers/unit_numbers');

    var select_all_toggle_state = false;
    var PORTAL_COMMAND_PREFIX = 'portal_';
    var PORTAL_COMMAND_SUFFIX = '_olympus';

    /**
     * Function for attack windows (send units and other things).
     */
    var WndHandlerAttack = function() {
        this.unitInputs = null;
        this.data = null; // Unit data, duration etc
        this.farm_town = false;
        this.same_island = null;
        this.origin_town_id = null;
    };

    WndHandlerAttack.inherits(WndHandlerDefault);
    //test to use .listenTo on the old windows
    us.extend(WndHandlerAttack.prototype, Backbone.View.prototype); //@todo inherit from Backbone.Events next time

    WndHandlerAttack.prototype.getDefaultWindowOptions = function() {
        return {
            height: 500,
            width: 500,
            resizable: false,
            title: 'Untitled Window'
        };
    };

    /**
     * Returns all unit input fields als jQuery-set.
     * Caches elements.
     */
    WndHandlerAttack.prototype.getUnitInputs = function() {
        return this.wnd.getJQElement().find('input.unit_input');
    };

    WndHandlerAttack.prototype.getSelectedUnits = function() {
        var result = {};

        this.getUnitInputs().each(function() {
            var name = this.name,
                value = parseInt(this.value, 10);
            if (name && value) {
                result[name] = value;
            }
        });

        return result;
    };

    WndHandlerAttack.prototype.needsGroundUnitsTransportation = function() {
        var selected_units = this.getSelectedUnits(),
            has_ground_units = GameDataUnits.hasGroundUnits(selected_units),
            has_naval_units = GameDataUnits.hasNavalUnits(selected_units),
            has_flying_units_only = GameDataUnits.hasFlyingUnitsOnly(selected_units);

        return !has_flying_units_only && ((has_ground_units && has_naval_units) || (has_ground_units && !this.same_island));
    };

    /**
     * Resets all user input fields
     */
    WndHandlerAttack.prototype.resetUnitInputs = function() {
        this.getUnitInputs().each(function() {
            this.value = '';
        });
    };

    /**
     * Select all units incl. assigned hero from current town
     */
    WndHandlerAttack.prototype.selectAllUnits = function() {
        var units = ITowns.getTown(Game.townId).units(),
            self = this,
            checkbox = CM.get(this.wnd.getContext(), 'cbx_include_hero');

        this.getUnitInputs().each(function() {
            var newVal = self.validateMaxPerAttack(
                this.name, units[this.name],
                self.wnd.getJQElement().find('form').data().type
            );

            if (!select_all_toggle_state) {
                newVal = '';
            }

            $(this).val(newVal);
        });

        if (checkbox && !checkbox.hasClass('disabled')) {
            checkbox.check(select_all_toggle_state);
        }
    };

    WndHandlerAttack.prototype.validateMaxPerAttack = function(unit_id, newVal, type) {
        var property_to_test = 'max_per_' + type;
        var data_unit = GameData.units[unit_id];

        if (data_unit[property_to_test] !== null && newVal > data_unit[property_to_test]) {
            newVal = data_unit[property_to_test];

            var name = data_unit.name;
            if (newVal > 1 || newVal === 0) {
                name = data_unit.name_plural;
            }

            HumanMessage.error(s(DM.getl10n('COMMON', 'error').msg_attack_unit_limitation, data_unit[property_to_test], name));
        }

        return newVal;
    };

    /**
     * Selects all units of a kind.
     * Unit count is taken from Layout.towns
     */
    WndHandlerAttack.prototype.selectUnit = function(elm) {
        elm = $(elm);
        var prev = parseInt(elm.next().val(), 10);
        var count = ITowns.getTown(Game.townId).units()[elm[0].id];
        var newVal = prev === count ? 0 : count;

        newVal = this.validateMaxPerAttack(elm[0].id, newVal, this.wnd.getJQElement().find('form').data().type);

        // toggle units if all units were selected
        var input = elm.next().val(newVal);
        if (newVal > 0) {
            input.addClass('with_value');
        } else {
            input.removeClass('with_value');
        }
    };

    WndHandlerAttack.prototype.sendUnits = function(sending_type, popup_type, target_id, confirmed) {
        var that = this;
        var player_hint = MM.getOnlyCollectionByName('PlayerHint').getForType('attacking_on_alliance_member');
        // show warning if same alliance
        if (this.data.same_alliance && !confirmed && !player_hint.isHidden()) {
            var onConfirm = function() {
                // call sendUnits again without same_alliance set:;
                that.sendUnits(sending_type, popup_type, target_id, true);
            };
            return ConfirmationWindowFactory.openConfirmationAttackingOnAllianceMember(onConfirm);
        }

        var params = this.getSelectedUnits();

        if (GameDataHeroes.areHeroesEnabled()) {
            var cbx_include_hero = CM.get(that.wnd.getContext(), 'cbx_include_hero');

            //because this component is only in the attack tab
            if (cbx_include_hero) {
                //Checkbox has to be selected
                if (cbx_include_hero.isChecked()) {
                    params.heroes = this.getHeroInTheTown().getId();
                    params.town_id = this.getHeroTownId();
                }
            }
        }

        params.id = target_id;

        if (this.is_portal_command) {
            params.type = this.getPortalCommandType(sending_type);
        } else {
            params.type = this.wnd.getJQElement().find('.attack_type.checked').data('attack') || sending_type;
        }

        if (this.wnd.getJQElement().find('.attack_strategy.checked').length) {
            var strategies = this.wnd.getJQElement().find('.attack_strategy.checked'),
                checked_strategies = [];
            $.each(strategies, function(index, strategy) {
                checked_strategies.push($(strategy).data('attack'));
            });
            params.attacking_strategy = checked_strategies;
        }

        if (this.wnd.getJQElement().find('#spells_1').data('attack') !== power_enums.NO_POWER) {
            params.power_id = this.wnd.getJQElement().find('#spells_1').data('attack');
        }

        // block the button BEFORE you do a request
        if (this.$btn_attack_town) {
            this.$btn_attack_town.disable();
        }

        this.wnd.ajaxRequestPost(popup_type, 'send_units', params, {
            success: function(window, data) {
                $.Observer(GameEvents.command.send_unit).publish({
                    sending_type: params.type,
                    target_id: target_id,
                    params: params
                }); //TODO - name it properly

                that.resetUnitInputs();
                that.bindDurationCounter();
                that.bindBootyCounter();
                that.updateCapacityAndTransport();

                if (that.$btn_attack_town) {
                    that.$btn_attack_town.enable();
                }
            }.bind(this),
            error: function() {
                if (that.$btn_attack_town) {
                    that.$btn_attack_town.enable();
                }
            }
        });
    };

    /**
     * render attack/support view of town
     */
    WndHandlerAttack.prototype.render = function(action) {
        var root, data = this.data,
            _self = this;
        select_all_toggle_state = false;

        //clear this.unitInputs
        delete this.unitInputs;

        data.active_player_supporting_units_short = UnitNumbersHelper.shortenUnitNumbers(
            data.active_player_supporting_units
        );

        // generate HTML from template + data
        var html = us.template(GameData.TownAttackTemplate, data);
        var that = this;

        //shortcut for jQ-root-element
        this.root = root = this.wnd.getJQElement();
        this.wnd.setContent(html);

        this.unregisterListeners();

        root.find('a.index_unit').on('click', function() {
            that.selectUnit(this);
        });

        if (action === 'attack') {
            this.$btn_attack_town = root.find('#btn_attack_town').button({
                disabled: true,
                icon: (data.reservation.state === 'reserved' && data.reservation.type !== 'own'),
                icon_position: 'right',
                icon_type: ''
            }).on('btn:click', function() {
                that.wnd.sendMessage('sendUnits', data.type, data.controller_type, data.target_id);
            }).addClass('reservation_tool ' + data.reservation.state + ' ' + data.reservation.state);
        }

        if (action === 'attack' || action === 'support') {
            var $btn_plan_attack = root.find('#btn_plan_attack_town'),
                has_captain = $btn_plan_attack.attr('data-hascaptain') === '1';

            $.Observer(GameEvents.premium.adviser.activate).subscribe(['buy_captain_for_attack_planner'], function(e, data) {
                if (data.adviser_id === 'captain' || data.all_advisers) {
                    has_captain = true;
                }
            });

            $btn_plan_attack.button({}).on('btn:click', function() {
                if (has_captain) {
                    AttackPlannerWindowFactory.openAttackPlannerForTarget(data.target_id);
                } else {
                    hOpenWindow.openActivateAdvisorWindow('captain');
                }
            });

            var l10n = DM.getl10n('runtime_info');
            this.$btn_runtime = root.find('#btn_runtime').button({
                caption: '',
                icon: true,
                icon_position: 'left',
                icon_type: 'runtime',
                tooltips: [{
                        title: l10n.window_title
                    },
                    null
                ]
            }).on('btn:click', function() {
                var FactoryRuntime = require('features/runtime_info/factories/runtime_info');
                FactoryRuntime.openWindow(data.target_id, {
                    is_portal_command: that.is_portal_command
                });
            });

            // add unit tooltips
            root.find('.unit_container:not(.heroes_pickup) a').each(function(i, el) {
                $(el).setPopup(el.id + '_details');
            });
        }

        root.find('a.select_all_units').on('click', function() {

            if (!select_all_toggle_state) {
                select_all_toggle_state = true;
            } else {
                select_all_toggle_state = false;
            }

            var l10n = DM.getl10n('attack_spot');
            if (select_all_toggle_state) {
                root.find('a.select_all_units').text(l10n.deselect_all_units);
            } else {
                root.find('a.select_all_units').text(l10n.select_all_units);
            }
            _self.selectAllUnits();
            _self.bindDurationCounter();
            _self.updateCapacityAndTransport();
            _self.bindBootyCounter();
        });
        root.find('a.index_unit').on('click', function() {
            _self.bindDurationCounter();
            _self.updateCapacityAndTransport();
            _self.bindBootyCounter();
        });
        root.find('.heroes_pickup .icon_border .icon').on('click', function() {
            if (_self.isHeroHealthyInTown()) {
                var cbx_include_hero = CM.get(_self.wnd.getContext(), 'cbx_include_hero');
                cbx_include_hero.check(!cbx_include_hero.isChecked());
            } else {
                HeroesWindowFactory.openHeroesWindow();
            }
        });

        this.getUnitInputs().on('keyup change', function() {
            _self.bindDurationCounter();
            _self.updateCapacityAndTransport();
            _self.bindBootyCounter();
            _self.bindMaxPerAttackValidate();
        });

        // bind keydown listener on document
        this.root.on('keydown.attack', function(ev) {
            //up 38, down 40
            var up = ev.keyCode === 38,
                down = ev.keyCode === 40,
                el = ev.target,
                value = us.isNaN(parseInt(el.value, 10)) ? 0 : parseInt(el.value, 10);

            if ((up || down) && el.nodeName === 'INPUT') {
                el.value = Math.max(0, value + (up ? 1 : -1));
            }
        });

        // bind setAttackType
        if (this.data.attack_types) {
            this.attType = this.root.find('div.attack_type');
            this.attType.on('click', function(e) {
                that.setAttackType(e.target);
            });
        }

        _self.bindDurationCounter();
        _self.bindBootyCounter();

        if (GameDataHeroes.areHeroesEnabled()) {
            this.getCollection('player_heroes').onAssignmentTypeChange(this, this.resetViewComponents); //Hero is attacking or is being assinged to town
            this.getCollection('player_heroes').onCuredAtChange(this, this.resetViewComponents); //Hero is injured
        }

        _self.registerViewComponents();
    };

    WndHandlerAttack.prototype.isHeroHealthyInTown = function() {
        return this.getCollection('player_heroes').isStateHealthyHeroInTown(this.getHeroTownId());
    };

    // we have to "restart" / cleanup the view before we re-register components
    WndHandlerAttack.prototype.resetViewComponents = function() {
        //Reinitialize Hero checkbox and icon
        this.initializeHeroCheckbox();

        this.bindDurationCounter();
        this.bindBootyCounter();
        this.registerCapacityBar();
    };

    WndHandlerAttack.prototype.getHeroTownId = function() {
        //if attack window was opened from attack planner, origin_town_id will be set
        return parseInt(this.origin_town_id || Game.townId, 10);
    };

    WndHandlerAttack.prototype.getHeroInTheTown = function() {
        var town_id = this.getHeroTownId();

        return this.getCollection('player_heroes').getHeroOfTown(town_id);
    };

    WndHandlerAttack.prototype.initializeHeroCheckbox = function() {
        var _self = this,
            root = this.wnd.getJQElement(),
            context = this.wnd.getContext(),
            l10n = DM.getl10n('heroes', 'attack_window');

        var hero_in_town = this.getHeroInTheTown(),
            hero_being_assinged = this.getHeroInTheTown(),
            is_hero_in_town = hero_in_town !== undefined,
            is_hero_being_assigned_to_town = hero_being_assinged !== undefined;

        var $portrait = root.find('.heroes_pickup .icon');

        //Reset Css classes
        $portrait.removeClass().addClass('icon');

        //If there is some hero in town
        if (is_hero_in_town || is_hero_being_assigned_to_town) {
            if (is_hero_in_town) {
                //Set his portrait
                $portrait.addClass('unit_icon40x40 ' + hero_in_town.getId());

                if (hero_in_town.isInjured()) {
                    $portrait.tooltip(l10n.can_not_attck_injured);
                } else if (hero_in_town.attacksTown()) {
                    $portrait.tooltip(l10n.can_not_attack_attacking);
                } else {
                    var existing_tooltip = $portrait.data('popup_obj');

                    if (existing_tooltip) {
                        existing_tooltip.destroyTooltip();
                    }
                    // add standard hero card
                    $portrait.tooltip(TooltipFactory.getHeroCard(hero_in_town.getId(), {
                        hero_level: hero_in_town.getLevel()
                    }), {}, false);
                }
            } else if (is_hero_being_assigned_to_town) {
                //Set his portrait
                $portrait.addClass('unit_icon40x40 ' + hero_being_assinged.getId());
                $portrait.tooltip(l10n.hero_is_being_assigned);
            }
        } else {
            $portrait.tooltip(l10n.no_hero_in_town);
        }

        CM.unregister(context, 'cbx_include_hero');
        CM.register(context, 'cbx_include_hero', root.find('.cbx_include_hero').checkbox({
            caption: '',
            checked: false,
            disabled: !_self.isHeroHealthyInTown()
        }).on('cbx:check', function() {
            _self.bindDurationCounter();
            _self.updateCapacityAndTransport();
            _self.bindBootyCounter();
        }));
    };

    WndHandlerAttack.prototype.getAttackTableBoxHeader = function(type) {
        var template = DM.getTemplate('attack_table_box', 'header'),
            l10n = DM.getl10n('attack_table_box');
        return us.template(template, {
            title: l10n.headers[type]
        });
    };

    WndHandlerAttack.prototype.getAttackBodyBoxTemplate = function(type, attack_data) {
        var body = '';
        var i = 1;

        function isChecked(attack) {
            return (type === attack_enums.ATTACK_TYPE && attack === attack_enums.ATTACK) ||
                (type === attack_enums.ATTACK_STRATEGY && attack === attack_enums.REGULAR);
        }

        Object.keys(attack_data).forEach(
            function(attack) {
                var checked = isChecked(attack) ? ' checked' : '';

                if (type !== attack_enums.ATTACK_STRATEGY && this.is_portal_command) {
                    attack = this.getPortalCommandType(attack);
                }

                body += us.template(DM.getTemplate('attack_table_box', 'body'), {
                    attack_css_classes: type + ' ' + attack + checked,
                    attack: attack,
                    id: type + '_' + i
                });
                i++;
            }.bind(this)
        );
        return body;
    };

    WndHandlerAttack.prototype.getAttackTemplate = function(type, attack_data) {
        var body = '<div class="wrap ' + type + '_wrap"><div class="attack_content">';

        if (type === attack_enums.SPELLS) {
            body += us.template(DM.getTemplate('attack_table_box', 'body'), {
                attack_css_classes: ' spells power power_icon45x45 ' + power_enums.NO_POWER,
                attack: power_enums.NO_POWER,
                id: attack_enums.SPELLS + '_' + 1
            });
        } else {
            body += this.getAttackBodyBoxTemplate(type, attack_data);
        }

        body += '</div></div>';

        return {
            head: this.getAttackTableBoxHeader(type),
            body: body
        };
    };

    WndHandlerAttack.prototype.getAttackDataTemplates = function() {
        var attackDataTemplates = [];
        attackDataTemplates.push(this.getAttackTemplate(attack_enums.ATTACK_TYPE, this.data.attack_types));

        if (Object.keys(this.data.attack_strategies).length > 1) {
            attackDataTemplates.push(this.getAttackTemplate(attack_enums.ATTACK_STRATEGY, this.data.attack_strategies));
        }

        attackDataTemplates.push(this.getAttackTemplate(attack_enums.SPELLS));
        return attackDataTemplates;
    };

    WndHandlerAttack.prototype.registerTableBoxTooltips = function() {
        var $main_elem = this.wnd.getJQElement(),
            tooltip_texts = DM.getl10n('attack_table_box', 'tooltips'),
            tooltip_attack_classes = [
                attack_enums.ATTACK_TYPE,
                attack_enums.ATTACK_STRATEGY,
                attack_enums.SPELLS
            ];
        tooltip_attack_classes.forEach(function(attack_class) {
            var info_btn = $main_elem.find('.' + attack_class + '_wrap').parent().parent().find('.head .info_icon');
            info_btn.tooltip(tooltip_texts[attack_class]);
        });
    };

    WndHandlerAttack.prototype.toggleAttackTypes = function($table_content_box, $elem) {
        var attack_types = $table_content_box.find('.' + attack_enums.ATTACK_TYPE);
        attack_types.removeClass('checked');
        $elem.addClass('checked');
    };

    WndHandlerAttack.prototype.toggleAttackStrategies = function($elem) {
        if ($elem.hasClass('checked')) {
            $elem.removeClass('checked');
        } else {
            $elem.addClass('checked');
        }
    };

    WndHandlerAttack.prototype.registerSpellDialogButton = function() {
        var $preselected_spells = this.wnd.getJQElement().find('.table_box_content #spells_1');
        CM.unregister(this.wnd.getContext(), 'preselected_spells_dropdown');
        CM.register(this.wnd.getContext(), 'preselected_spells_dropdown', $preselected_spells.button({
            template: 'none'
        }).on('btn:click', function() {
            SubWindowHelper.renderSubWindow(
                this.wnd.getJQElement().find('.gpwindow_content'),
                'dialog'
            );
            this.registerSpellsDialog();
        }.bind(this)));
    };

    WndHandlerAttack.prototype.registerTableBoxAttacksClicks = function() {
        var $table_content_box = this.wnd.getJQElement().find('.table_box_content');
        $table_content_box.off().on('click', function(event) {
            var $target = $(event.target);
            if ($target.hasClass(attack_enums.ATTACK_TYPE)) {
                this.toggleAttackTypes($table_content_box, $target);
            } else if ($target.hasClass(attack_enums.ATTACK_STRATEGY)) {
                this.toggleAttackStrategies($target);
            }
        }.bind(this));
    };

    WndHandlerAttack.prototype.registerViewComponents = function() {
        var _self = this,
            root = this.wnd.getJQElement(),
            context = this.wnd.getContext();

        this.registerCapacityBar();

        if (GameDataHeroes.areHeroesEnabled() && this.action === 'attack') {
            this.initializeHeroCheckbox();
        }

        if (this.action === 'support') {
            var supporting_units = this.data.active_player_supporting_units,
                l10n = DM.getl10n('place', 'support_overview');

            //Button which opens support overview in new building place
            CM.register(context, 'btn_open_support_window', root.find('.btn_open_support_window').button({
                disabled: us.isEmpty(supporting_units),
                tooltips: [{
                    title: l10n.show_troops,
                    hide_when_disabled: true
                }]
            }).on('btn:click', function() {
                PlaceWindowFactory.openSupportOverviewActivePlayerSupportsTown(_self.data.target_id);
            }));

            root.find('.troops_from_this_town .units_list').tooltip(TooltipFactory.getUnitListTooltip(supporting_units));
        } else {
            CM.unregister(context, 'attack_table_box');
            CM.register(context, 'attack_table_box', root.find('.attack_table_box').tableBox({
                content_html: this.getAttackDataTemplates()
            }));
            this.registerTableBoxTooltips();
            this.registerTableBoxAttacksClicks();
            this.registerSpellDialogButton();
        }
    };

    /**
     * handle rx for  attack/support view of town
     */
    WndHandlerAttack.prototype.onRcvData = function(data, controller, action, obj) {
        this.data = data.json;

        this.origin_town_id = obj.origin_town_id;
        this.is_portal_command = obj.is_portal_command || this.is_portal_command;

        this.data.preselect_units = this.data.preselect_units || false;
        this.same_island = data.json.same_island;

        //store unit count in current town
        var units = {};
        var i, data_json_units = data.json.units;
        for (i in data_json_units) {
            if (data_json_units.hasOwnProperty(i)) {
                units[i] = data.json.units[i].count;
            }
        }

        // if template was sent, add to cache
        if (data.tmpl) {
            GameData.add({
                'TownAttackTemplate': data.tmpl
            });
        }

        this.render(action);
    };

    WndHandlerAttack.prototype.bindDurationCounter = function() {
        //	var units = ITowns.getTown(Game.townId).units();
        var that = this;
        //cache elements for this window
        var elm = {};
        elm.root = that.wnd.getJQElement();
        elm.container = elm.root.find('div.duration_container');
        elm.error = elm.root.find('div.duration_error_container');
        elm.error_text = elm.root.find('div.duration_error_text');
        elm.duration = elm.root.find('span.way_duration');
        elm.portal_duration = elm.root.find('span.portal_duration');
        elm.arrival = elm.root.find('span.arrival_time');
        elm.night = elm.root.find('div.nightbonus');

        var sdata = that.data;

        function recalcDuration() {
            var $btn_attack_town = that.$btn_attack_town,
                reservation_message = '',
                popup,
                popup_msg;

            if (sdata.reservation && sdata.reservation.state !== 'free') {
                reservation_message += '<div>' +
                    '<span class="reservation_tool icon small ' + sdata.reservation.state + ' ' + sdata.reservation.type + '"></span>';

                if (sdata.reservation.state === 'added') {
                    if (sdata.reservation.type === 'ally') {
                        reservation_message += _('This city has been entered and can be reserved');
                    } else { // pact
                        reservation_message += _('This city was entered by a friendly alliance');
                    }

                } else if (sdata.reservation.state === 'reserved') {
                    if (sdata.reservation.type === 'own') {
                        reservation_message += _('Reserved for you');
                    } else if (sdata.reservation.type === 'ally') {
                        reservation_message += s(_('This city is reserved for %1'), sdata.reservation.data.player_link);
                    } else {
                        reservation_message += s(_('This city is reserved for %1 (%2)'), sdata.reservation.data.player_link, sdata.reservation.data.alliance_link);
                    }
                }
                reservation_message += '</div>';
            }

            popup_msg = (sdata.has_player_protection && sdata.protection_ends > Timestamp.server() ? sdata.has_player_protection : '') + reservation_message;
            popup = new MousePopup(popup_msg);
            popup.disable();

            //Initialize popup
            if ($btn_attack_town) {
                $btn_attack_town.mousePopup(popup);
            }

            var hero = null,
                hero_selected = false,
                inputs = that.getUnitInputs(),
                chosen_units = Object.keys(inputs).reduce(
                    function(units, key) {
                        var amount = parseInt(inputs[key].value, 10);

                        if (inputs[key].name !== undefined && amount) {
                            units[inputs[key].name] = amount;
                        }

                        return units;
                    }, {}
                ),
                runtimes = Object.keys(chosen_units).reduce(
                    function(runtimes, type) {
                        runtimes[type] = that.data.units[type].duration_without_bonus;

                        return runtimes;
                    }, {}
                );

            if (GameDataHeroes.areHeroesEnabled()) {
                var cbx_include_hero = CM.get(that.wnd.getContext(), 'cbx_include_hero');
                hero = that.getHeroInTheTown();

                if (hero && that.data.hasOwnProperty('heroes_durations')) {
                    runtimes[hero.attributes.type] = that.data.heroes_durations[hero.attributes.type].duration_without_bonus;
                }

                if (cbx_include_hero && cbx_include_hero.isChecked()) {
                    hero_selected = true;
                }
            }

            var duration = GameDataUnits.getSlowestRuntime(
                chosen_units,
                runtimes,
                hero_selected ? hero : null,
                that.farm_town ? town_types_enum.FARM_TOWN : false
            );

            // TODO: flying units?
            if (duration !== null) {
                var arrival = Timestamp.server() + duration;
                var full_duration = duration;

                // get root element
                var prefix = that.farm_town || that.support ? '' : '~';

                if (that.is_portal_command) {
                    var olympus = OlympusHelper.getOlympusModel(),
                        seconds = olympus.getPortalTempleTravelHours() * 3600;
                    elm.portal_duration.find('.text').text(DateHelper.readableSeconds(seconds));
                    elm.portal_duration.show();

                    arrival += seconds;
                    full_duration += seconds;
                }

                var arrival_in_server_timezone = new Date((arrival + Timestamp.serverGMTOffset()) * 1E3); // arrival time in timezone of the server!

                // change texts
                elm.container.show();
                elm.error.hide();
                elm.duration.text(prefix + DateHelper.readableSeconds(duration));
                elm.arrival.text(full_duration).updateTime();
                elm.arrival.text('~' + readableUnixTimestamp(arrival, 'no_offset'));

                var needs_ground_units_transportation = that.needsGroundUnitsTransportation(),
                    transport = GameDataUnits.hasTransportUnits(chosen_units),
                    is_missing_naval_units = needs_ground_units_transportation && !transport;

                // Don't show night bonus on farm towns attack window
                // Farm towns are not affected by night bonus
                if (that.farm_town) {
                    elm.night.hide();
                } else {
                    var is_night;
                    var starts_at = that.data.night_starts_at_hour; // night bonus starts_at in timezone of the server!!!
                    var night_duration = that.data.night_duration;

                    if (starts_at < 0) {
                        starts_at = 24 + starts_at;
                    }

                    if (night_duration === 0) {
                        is_night = false;
                    } else if (starts_at + night_duration > 24) {
                        is_night = arrival_in_server_timezone.getUTCHours() <= (starts_at + night_duration - 1) % 24 || arrival_in_server_timezone.getUTCHours() >= starts_at;
                    } else {
                        is_night = arrival_in_server_timezone.getUTCHours() <= (starts_at + night_duration - 1) && arrival_in_server_timezone.getUTCHours() >= starts_at;
                    }

                    if (is_night) {
                        elm.night.show();
                    } else {
                        elm.night.hide();
                    }

                    if (is_missing_naval_units) {
                        elm.error_text.text(
                            (!transport && !GameDataUnits.hasNavalUnits(chosen_units)) ?
                            _('You have to send along ships across the ocean.') :
                            _('You have to send transport boats along.')
                        );
                        elm.error.show();
                        elm.duration.hide();
                        elm.arrival.hide();
                        elm.container.hide();
                        elm.night.hide();
                    } else {
                        elm.error_text.text('');
                        elm.error.hide();
                        elm.duration.show();
                        elm.arrival.show();
                        elm.container.show();
                    }
                }

                // If attacked player is in the protection mode, the button
                // should be deactivated, so player can not attack
                if (sdata.type === 'attack') {
                    if (sdata.has_player_protection) {
                        $btn_attack_town.disable();
                        if (popup_msg.length > 0) {
                            popup.enable();
                        }
                    } else if (is_missing_naval_units) {
                        $btn_attack_town.disable();
                        popup.disable();
                    } else {
                        $btn_attack_town.enable();
                        popup.disable();
                    }
                    if ((sdata.reservation && sdata.reservation.state !== 'free')) {
                        if (popup_msg.length > 0) {
                            popup.enable();
                        }
                        $btn_attack_town.enableIcon();
                    }
                }
            } else {
                elm.container.hide();
                elm.night.hide();

                if (sdata.type === 'attack') {
                    $btn_attack_town.disable();
                    if ((sdata.has_player_protection || (sdata.reservation && sdata.reservation.state !== 'free')) && popup_msg.length > 0) {
                        popup.enable();
                    }
                    if ((sdata.reservation && sdata.reservation.state !== 'free')) {
                        $btn_attack_town.enableIcon();
                    }
                }
            }
        }
        recalcDuration();
    };

    WndHandlerAttack.prototype.bindBootyCounter = function() {
        var that = this;
        //cache elements for this window
        var elm = {};
        elm.root = that.wnd.getJQElement();
        elm.container = elm.root.find('div.duration_container');
        elm.max_booty = elm.root.find('span.max_booty');

        function recalcBooty() {
            var total_capacity = 0;
            var u = GameData.units;
            var booty = true;
            var booty_factor = 1;

            // iterate over all unit input  ields ...
            that.getUnitInputs().each(function() {
                var i = this.name,
                    // parse input value, ignore if ==0
                    count = parseInt($(this).val(), 10);

                booty = u[i].hasOwnProperty('booty');

                if (count && booty) {
                    total_capacity += u[i].booty * count;
                }
            });

            if (GameDataHeroes.areHeroesEnabled()) {
                var cbx_include_hero = CM.get(that.wnd.getContext(), 'cbx_include_hero');

                if (cbx_include_hero && cbx_include_hero.isChecked()) {
                    var hero_in_town = that.getHeroInTheTown(),
                        hero_id = hero_in_town.getId();

                    total_capacity += GameData.heroes[hero_id].booty;

                    if (hero_id === heroes_enum.IASON) {
                        booty_factor += hero_in_town.getCalculatedBonusForLevel();
                    }
                }
            }

            elm.max_booty.text('~' + Math.floor(total_capacity * booty_factor)).show();
        }
        recalcBooty();
    };

    WndHandlerAttack.prototype.bindMaxPerAttackValidate = function() {
        var self = this;

        this.getUnitInputs().each(function(i, el) {
            var $el = $(el);

            if ($el.val()) {
                var newVal = $el.val();
                var unit_id = $el.attr('name');

                newVal = self.validateMaxPerAttack(unit_id, newVal, self.wnd.getJQElement().find('form').data().type);
                $el.val(newVal);
            }
        });
    };

    WndHandlerAttack.prototype.registerCapacityBar = function() {
        var $progress = this.wnd.getJQElement().find('.capacity_progressbar'),
            l10n = DM.getl10n('common');

        CM.unregister(this.wnd.getContext(), 'pb_capacity');
        CM.register(this.wnd.getContext(), 'pb_capacity', $progress.singleProgressbar({
            extra: 0,
            min: 0,
            max: 0,
            value: 0,
            animate: false,
            caption: l10n.capacity_bar
        }));

        this.updateCapacityAndTransport();
    };

    WndHandlerAttack.prototype.updateCapacityAndTransport = function() {
        var progress = CM.get(this.wnd.getContext(), 'pb_capacity'),
            $ship_count = this.wnd.getJQElement().find('.ship_count'),
            capacity = GameDataUnits.calculateCapacity(Game.townId, this.getSelectedUnits()),
            show_overloading = this.needsGroundUnitsTransportation();

        if (!capacity) {
            return;
        }

        if (progress) {
            progress.setShowOverloading(show_overloading);
            progress.setExtra(capacity.needed_capacity);
            progress.setMax(capacity.total_capacity);
        }

        if ($ship_count.length > 0 && show_overloading) {
            $ship_count.find('.slow_boats_needed').text(capacity.slow_boats_needed);
            $ship_count.find('.fast_boats_needed').text(capacity.fast_boats_needed);
        }
    };

    WndHandlerAttack.prototype.registerSpellsDialog = function() {
        var $subwindow = this.wnd.getJQElement().find('.sub_window'),
            $content = $subwindow.find('.content'),
            onSpellSelect = function(power_id) {
                var $spell_selection = this.wnd.getJQElement().find('.table_box_content #spells_1');
                $spell_selection.removeClass($spell_selection.data('attack'));
                $spell_selection.addClass(power_id);
                $spell_selection.data('attack', power_id);
                $subwindow.remove();
            }.bind(this);

        var controller = new SpellsDialogController({
            el: $content,
            cm_context: this.wnd.getContext(),
            models: {
                player_gods: this.getModels().player_gods
            },
            collections: {
                movements_units: this.getCollections().movements_units
            },
            l10n: DM.getl10n('spells_dialog', 'cast_spell'),
            onSpellSelect: onSpellSelect,
            target_type: TargetType.ATTACK
        });

        controller.renderPage();
    };

    WndHandlerAttack.prototype.getPortalCommandType = function(type) {
        return PORTAL_COMMAND_PREFIX + type + PORTAL_COMMAND_SUFFIX;
    };

    WndHandlerAttack.prototype.onClose = function() {
        this.unregisterListeners();

        return true;
    };

    WndHandlerAttack.prototype.unregisterListeners = function() {
        this.wnd.getJQElement().find('*').off();
        this.wnd.getJQElement().off('keydown.attack');

        $.Observer(GameEvents.premium.adviser.activate).unsubscribe(['buy_captain_for_attack_planner']);

        this.stopListening();
    };

    return WndHandlerAttack;
}());