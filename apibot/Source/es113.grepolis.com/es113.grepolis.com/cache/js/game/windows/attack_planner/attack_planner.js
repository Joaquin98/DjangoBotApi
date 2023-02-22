/* global HelperTown, GPWindowMgr */
(function() {
    'use strict';

    var wnd, sub_controller;
    var data = {
        //plan list page number
        current_plan_list_page: 0,
        //Currently opened plan (0 if noting is opened)
        current_plan_id: 0,
        //Keeps information about the currently selected target on the list
        selected_target_id: 0,
        selected_attack_id: 0,
        last_action: null
    };
    var cm_context, ctx_create_plan;
    var OlympusHelper = require('helpers/olympus');

    var model = {
        destroy: function() {
            data = {
                //plan list page number
                current_plan_list_page: 0,
                //Currently opened plan (0 if noting is opened)
                current_plan_id: 0,
                //Keeps information about the currently selected target on the list
                selected_target_id: 0,
                selected_attack_id: 0,
                last_action: null
            };
        },

        setCurrentPlanListPage: function(page_nr) {
            data.current_plan_list_page = page_nr;
        },

        getCurrentPlanListPage: function() {
            return data.current_plan_list_page;
        },

        //Plan ID
        setCurrentPlanId: function(plan_id) {
            data.current_plan_id = plan_id;
        },

        getCurrentPlanId: function() {
            return data.current_plan_id;
        },

        //Target ID
        getSelectedTargetId: function() {
            return data.selected_target_id;
        },

        setSelectedTargetId: function(town_id) {
            data.selected_target_id = parseInt(town_id, 10);
        },

        //Attack ID
        getSelectedAttackId: function() {
            return data.selected_attack_id;
        },

        setSelectedAttackId: function(attack_id) {
            data.selected_attack_id = attack_id;
        },

        //Last action
        setLastAction: function(action_name) {
            data.last_action = action_name;
        },

        getLastAction: function() {
            return data.last_action;
        }
    };

    var view = {};

    var controller = {
        showPlan: function(plan_id) {
            // Reset target id, to select the first on from the list
            model.setSelectedTargetId(0);

            // Open plan window
            wnd.requestContentGet('attack_planer', 'show_plan', {
                plan_id: plan_id
            });
        },

        switchTownForAttack: function(attack_type, target_id, target_town_name, origin_town_id, units) {
            HelperTown.townSwitch(origin_town_id);
            if (attack_type === 'attack' || attack_type === 'support') {
                GPWindowMgr.Create(GPWindowMgr.TYPE_TOWN, target_town_name, {
                    action: attack_type
                }, {
                    origin_town_id: origin_town_id,
                    id: target_id,
                    preselect: true,
                    preselect_units: units
                });
            } else {
                OlympusHelper.openPortalActionWindow(attack_type, target_id, {
                    preselect: true,
                    preselect_units: units
                });
            }
        },

        openEditRightsPage: function(plan_id) {
            wnd.requestContentGet('attack_planer', 'rights', {
                plan_id: plan_id
            });
        },

        openEditAttackPage: function(attack_id, last_action) {
            model.setLastAction(last_action);

            wnd.requestContentGet('attack_planer', 'show_attack_dialog', {
                attack_id: attack_id
            });
        },

        openAddAttackPage: function(target_id) {
            model.setLastAction('show_plan');

            wnd.requestContentGet('attack_planer', 'show_attack_dialog', {
                target_id: target_id
            });
        },

        openAttacksPage: function() {
            wnd.requestContentGet('attack_planer', 'attacks', {});
        },

        destroy: function() {

        }
    };

    /**
     * Attack Planner class
     */
    function AttackPlanner(wnd_handler) {
        wnd = wnd_handler;
    }

    AttackPlanner.controllers = {};

    AttackPlanner.prototype.initialize = function(action, ret_data) {
        sub_controller = AttackPlanner.controllers[action];
        sub_controller.initialize({
            wnd: wnd,
            at_model: model,
            at_view: view,
            at_controller: controller,
            ret_data: ret_data
        });

        cm_context = wnd.getContext();
        ctx_create_plan = {
            main: cm_context.main,
            sub: 'wnd_create_plan'
        };
    };

    AttackPlanner.prototype.destroyPage = function() {
        if (sub_controller) {
            sub_controller.destroy();
        }
    };

    AttackPlanner.prototype.destroy = function() {
        this.destroyPage();
        model.destroy();
        controller.destroy();
    };

    window.AttackPlanner = AttackPlanner;
}());