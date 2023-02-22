/*globals jQuery, us, CM, Layout, hOpenWindow, HumanMessage, gpAjax, GrepoNotificationStack */

(function($) {
    "use strict";

    var model, view, controller;
    var templates = {},
        data = {},
        l10n = {};
    var wnd, root, at_model, at_controller;
    var cm_context, cm_search_by;
    var $content, $targets_list, $attacks_list;
    var AttackPlannerHelper = require('windows/attack_planner/helpers/attack_planner');

    /**
     * Model
     */
    model = {
        destroy: function() {

        },

        getPlayerTowns: function() {
            return data.player_towns;
        },

        isPlanShared: function() {
            return data.shared;
        },

        isPlanEditable: function() {
            return data.editable;
        },

        getTargetsList: function() {
            return data.target_list;
        },

        setTargetList: function(ret_data) {
            data.target_list = ret_data;
        },

        getSelectedTargetId: function() {
            var selected_target_id = at_model.getSelectedTargetId();

            //If target id is not specified, take the first target from the list
            if (!selected_target_id) {
                selected_target_id = parseInt(data.target_list.length ? data.target_list[0].town_id : 0, 10);
            }

            at_model.setSelectedTargetId(selected_target_id);

            return selected_target_id;
        },

        removeTarget: function(town_id) {
            var targets = data.target_list,
                l = targets.length;

            while (l--) {
                if (targets[l].town_id === town_id) {
                    targets.splice(l, 1);
                    return true;
                }
            }

            return false;
        },

        getTarget: function(town_id) {
            var targets = data.target_list,
                i, l = targets.length;

            for (i = 0; i < l; i++) {
                if (targets[i].town_id === town_id) {
                    return targets[i];
                }
            }

            return null;
        },

        getAttacksList: function() {
            return data.origin_town_list;
        },

        setAttackList: function(list) {
            data.origin_town_list = list;
        },

        getClonedAttacks: function() {
            return data.origin_town_list.clone();
        },

        deleteAttack: function(attack_id) {
            var attack, attacks = data.origin_town_list,
                l = attacks.length;

            while (l--) {
                attack = attacks[l];

                if (attack.id === attack_id) {
                    data.origin_town_list.splice(l, 1);
                }
            }
        },

        getAttack: function(attack_id) {
            var attack, attacks = data.origin_town_list,
                i, l = attacks.length;

            for (i = 0; i < l; i++) {
                attack = attacks[i];

                if (attack.id === attack_id) {
                    return attack;
                }
            }

            return null;
        },

        getFilteredAttacks: function(sort_by, state) {
            var filtered = this.getClonedAttacks(),
                order_by = state ? 'desc' : 'asc';

            //Sort towns by name
            filtered.sort(function(a, b) {
                var a_u = a[sort_by],
                    b_u = b[sort_by];

                return a_u === b_u ? 0 : (a_u < b_u ? -1 : 1);
            });

            //ASC DESC
            if (order_by === "desc") {
                filtered.reverse();
            }

            return filtered;
        }
    };

    /**
     * View
     */
    view = {
        initialize: function() {
            $content = root.find('.gpwindow_content');

            wnd.setTitle(l10n.attack_planner + ' - ' + data.plan_name);

            this.initializeMainLayout();
            this.initializeTargetsList();
            this.initializeAttacksList();
        },

        initializeMainLayout: function() {
            var _self = this;

            //This is a code which closes Select Town Menu
            root.parent().on('mousedown.fixSelectTownMenu', function(e) {
                var $target = $(e.target),
                    $menu = CM.get(cm_context, 'btn_add_target');

                if (!$target.hasClass('btn_add_target') && $menu) {
                    $menu.hide();
                }
            });

            //Load template
            $content.html(us.template(templates.plan, {
                l10n: l10n
            }));

            $targets_list = $content.find('.targets_list');
            $attacks_list = $content.find('.attacks_list');

            CM.unregisterGroup(cm_context);

            //Edit rights button
            CM.register(cm_context, 'btn_edit_rights', $content.find('.btn_edit_rights').button({
                caption: l10n.edit_rights,
                template: 'empty'
            }).on('btn:click', function() {
                at_controller.openEditRightsPage(at_model.getCurrentPlanId());
            }));

            //Sort radiobutton
            CM.register(cm_context, 'rbtn_sort_attack_list', $content.find(".rbtn_sort_attack_list").toggleStateRadiobutton({
                value: 'arrival_at',
                template: 'tpl_rb_sort_by',
                options: [{
                        value: 'town_name',
                        tooltip: l10n.order_by_town_name
                    },
                    {
                        value: 'send_at',
                        tooltip: l10n.order_by_send_at
                    },
                    {
                        value: 'arrival_at',
                        tooltip: l10n.order_by_arrival_at
                    }
                ]
            }).on("tsrb:change:value", function(e, _tsrb, new_val, old_val) {
                _self.renderAttacksList(new_val, _tsrb.getState());
            }).on("tsrb:change:state", function(e, _tsrb, state) {
                _self.renderAttacksList(_tsrb.getValue(), state);
            }));

            //Targets buttons
            CM.register(cm_context, 'btn_add_target', $content.find('.btn_add_target').menu({
                template: us.template(templates.select_town_group_popup_window, {
                    l10n: l10n,
                    predefiended_id: null,
                    admin_mode: false
                }),
                container_id: 'select_town_popup',
                hide_on_hover: false,
                hover: false
            }).on("menu:show", function(e, _menu) {
                var $el = _menu.getListHTMLElement(),
                    txt_search_by, rbtn_search_by;

                txt_search_by = AttackPlannerHelper.registerSearchTextBox(cm_search_by, $el.find('.txt_search_by'), l10n);
                rbtn_search_by = AttackPlannerHelper.registerRadioButtons(cm_search_by, $el.find('.rbtn_search_by'), l10n, txt_search_by);

                //Register button
                CM.unregister(cm_search_by, 'btn_confirm');
                CM.register(cm_search_by, 'btn_confirm', $el.find('.btn_confirm').button({

                }).on('btn:click', function() {
                    var value = txt_search_by.getLastSelectedSuggestion()[0] || txt_search_by.getValue(),
                        plan_id = at_model.getCurrentPlanId(),
                        town_id = parseInt(value, 10);

                    controller.addTarget(plan_id, town_id);
                    txt_search_by.clear();
                }));
            }).on("menu:hide", function(e, _menu) {
                CM.unregisterSubGroup(cm_search_by);
            }).tooltip(l10n.add_target));

            //Remove target
            CM.register(cm_context, 'btn_remove_target', $content.find('.btn_remove_target').button({
                template: 'empty',
                tooltips: [{
                    title: l10n.remove_target
                }]
            }).on('btn:click', function() {
                var is_shared = model.isPlanShared(),
                    question_msg = l10n.delete_target_in_plan[is_shared ? 'shared' : 'not_shared'];

                hOpenWindow.showConfirmDialog(l10n.are_you_sure, question_msg, function() {
                    //Remove target
                    controller.deleteTarget(at_model.getCurrentPlanId(), model.getSelectedTargetId());
                }, l10n[is_shared ? 'delete_all' : 'delete_item'], function() {}, l10n.cancel).setHeight(220);
            }));

            //Attacks buttons
            CM.register(cm_context, 'btn_add_attack', $content.find('.btn_add_attack').button({
                template: 'empty',
                tooltips: [{
                    title: l10n.add_attack
                }]
            }).on('btn:click', function() {
                at_controller.openAddAttackPage(at_model.getSelectedTargetId());
            }));

            CM.register(cm_context, 'btn_remove_attack', $content.find('.btn_remove_attack').button({
                template: 'empty',
                tooltips: [{
                    title: l10n.remove_attack
                }]
            }).on('btn:click', function() {
                controller.deleteAttack(at_model.getCurrentPlanId(), at_model.getSelectedAttackId());
            }));

            CM.register(cm_context, 'btn_go_to_plan_list', $content.find('.btn_go_to_plan_list').button({
                caption: l10n.go_to_plan_list,
                tooltips: [{
                    title: l10n.go_to_plan_list
                }],
                template: 'internal'
            }).on('btn:click', function() {
                controller.openPlanList();
            }));
        },

        initializeTargetsList: function() {
            //Load template
            this.renderTargetList();

            $targets_list.off('click.target_list').on('click.target_list', '.target_row', function(e) {
                var $row = $(e.currentTarget),
                    $target = $(e.target),
                    target_id = parseInt($row.attr('js-data'), 10),
                    current_target_id = at_model.getSelectedTargetId();

                //Fetch new rows, second condition prevents cliclcik on the links
                if (current_target_id !== target_id && $target.prop('tagName') !== 'A') {
                    //Save info about clicked row
                    at_model.setSelectedTargetId(target_id);

                    //Select row
                    $targets_list.find('.target_row').removeClass('selected');
                    $row.addClass('selected');

                    controller.fetchAttacksForTarget(at_model.getCurrentPlanId(), target_id);
                }
            });
        },

        renderTargetList: function(fetch_attacks) {
            $targets_list.html(us.template(templates.target_list, {
                selected_target_town_id: model.getSelectedTargetId(),
                targets_list: model.getTargetsList(),
                l10n: l10n
            }));

            if (fetch_attacks) {
                controller.fetchAttacksForTarget(at_model.getCurrentPlanId(), at_model.getSelectedTargetId());
            }
        },

        initializeAttacksList: function() {
            var radiobutton = CM.get(cm_context, 'rbtn_sort_attack_list');

            this.renderAttacksList(radiobutton.getValue(), radiobutton.getState());
            this.initializeAttackListComponents();
        },

        initializeAttackListComponents: function() {
            var _self = this;

            $attacks_list.off('click').on('click.attackList', 'li', function(e) {
                var $el = $(e.currentTarget),
                    $target = $(e.target),
                    attack_id = parseInt($el.attr('data-attackid'), 10);

                _self.selectAttackRow(attack_id);

                if ($target.hasClass('gp_alliance_link')) {
                    Layout.allianceProfile.open(addslashes($target.attr('data-allyname')), $target.attr('data-allyid'));
                } else if ($target.hasClass('show_units')) {
                    _self.addClassToRow(attack_id, 'active_row', true);
                } else if ($target.hasClass('edit_icon')) {
                    at_controller.openEditAttackPage(attack_id, 'show_plan');
                } else if ($target.hasClass('attack_icon')) {
                    controller.switchTownForAttack(attack_id);
                }
            });

            $attacks_list.find('.show_units').tooltip(l10n.show_all_units);
            $attacks_list.find('.edit_icon').tooltip(l10n.edit_attack);
        },

        selectAttackRow: function(attack_id) {
            if (!attack_id) {
                return;
            }

            var attack = model.getAttack(attack_id);

            CM.get(cm_context, 'btn_remove_attack')[attack.editable ? 'enable' : 'disable']();

            //Select row
            this.addClassToRow(attack_id, 'selected');

            //Save selected row id
            at_model.setSelectedAttackId(attack_id);
        },

        renderAttacksList: function(sort_by, state) {
            var filtered_towns = model.getFilteredAttacks(sort_by, state),
                attack_id = at_model.getSelectedAttackId() || (filtered_towns.length > 0 ? filtered_towns[0].id : 0),
                $btn_remove_attack = CM.get(cm_context, 'btn_remove_attack');

            //getAttacksList
            $attacks_list.html(us.template(templates.attacks_list, {
                player_towns: model.getPlayerTowns(),
                attacks_list: filtered_towns,
                editable: model.isPlanEditable(),
                l10n: l10n
            }));

            if (attack_id > 0) {
                this.selectAttackRow(attack_id);
                //Enable "remove attack" button
                $btn_remove_attack.enable();
            } else {
                //Disable "remove attack" button
                $btn_remove_attack.disable();
            }
        },

        addClassToRow: function(attack_id, class_name, toggle) {
            var $el_to_open = $attacks_list.find('.attacks_row_' + attack_id);

            if (toggle && $el_to_open.hasClass(class_name)) {
                $el_to_open.removeClass(class_name);
            } else {
                if (!toggle) {
                    $attacks_list.find('.attacks_row').removeClass(class_name);
                }

                $el_to_open.addClass(class_name);
            }
        },

        destroy: function() {
            if (root) {
                root.parent().off('.fixSelectTownMenu');
            }

            $content.off();
        }
    };

    /**
     * Controller
     */
    controller = {
        initialize: function(obj) {
            templates = obj.ret_data.templates;
            data = obj.ret_data.data;
            l10n = obj.ret_data.l10n;
            at_model = obj.at_model;
            at_model.setCurrentPlanId(data.plan_id);
            at_controller = obj.at_controller;

            wnd = obj.wnd;
            root = wnd.getJQElement();

            //Contexts
            cm_context = wnd.getContext();
            cm_search_by = {
                main: cm_context.main,
                sub: 'search_by'
            };

            view.initialize();
        },

        addTarget: function(plan_id, town_id) {
            if (plan_id > 0 && town_id > 0) {
                gpAjax.ajaxPost('attack_planer', 'add_target', {
                    plan_id: plan_id,
                    target_id: town_id
                }, true, function(data) {
                    //Update model
                    model.setTargetList(data.target_list);

                    //Reinitialize view
                    view.renderTargetList();
                });
            } else {
                HumanMessage.error(l10n.feelds_are_filled_incorrectly);
            }
        },

        deleteTarget: function(plan_id, target_id) {
            gpAjax.ajaxPost('attack_planer', 'delete_target', {
                plan_id: plan_id,
                target_id: target_id
            }, true, function(data) {
                //Remove target from the model
                model.removeTarget(target_id);
                //Select first row on the list
                at_model.setSelectedTargetId(0);
                //Rerender list
                view.renderTargetList(true);
            });
        },

        fetchAttacksForTarget: function(plan_id, target_id) {
            gpAjax.ajaxGet('attack_planer', 'fetch_origin_towns_for_target', {
                plan_id: plan_id,
                target_id: target_id
            }, true, function(data) {
                var radiobutton = CM.get(cm_context, 'rbtn_sort_attack_list');

                //Update Attacks list
                model.setAttackList(data.origin_town_list);
                //Reset Selected Attack ID
                at_model.setSelectedAttackId(0);
                //Rerender list
                view.renderAttacksList(radiobutton.getValue(), radiobutton.getState());
            });
        },

        openPlanList: function() {
            wnd.requestContentGet("attack_planer", "index", {});
        },

        deleteAttack: function(plan_id, attack_id) {
            gpAjax.ajaxPost('attack_planer', 'delete_origin_town', {
                plan_id: plan_id,
                id: attack_id
            }, true, function(data) {
                var radiobutton = CM.get(cm_context, 'rbtn_sort_attack_list');

                //Delete attack from the model
                model.deleteAttack(attack_id);
                //Reset Selected Attack ID
                at_model.setSelectedAttackId(0);
                //Rerender list
                view.renderAttacksList(radiobutton.getValue(), radiobutton.getState());
                //Delete notification
                GrepoNotificationStack.deleteAttackPlanerNotification(data.notification_id);
            });
        },

        switchTownForAttack: function(attack_id) {
            var attack = model.getAttack(attack_id),
                target_id = model.getSelectedTargetId(),
                target = model.getTarget(target_id),
                origin_town_id = attack.town_id,
                attack_type = attack.type,
                units = attack.units,
                target_town_name = target.town_name;

            at_controller.switchTownForAttack(attack_type, target_id, target_town_name, origin_town_id, units);
        },

        destroy: function() {
            model.destroy();
            view.destroy();

            templates = data = l10n = null;
            wnd = root = null;
            cm_context = null;

            at_model.setSelectedTargetId(0);
            at_model.setSelectedAttackId(0);
        }
    };

    //Make it globally visible
    window.AttackPlanner.controllers.show_plan = controller;
}(jQuery));