/*globals jQuery, CM, hOpenWindow, us, GoToPageWindowFactory, gpAjax */

(function($) {
    "use strict";

    var model, view, controller;
    var templates = {},
        data = {},
        l10n = {};
    var wnd, root, at_model, at_view, at_controller;
    var cm_context, ctx_create_plan, ctx_plan_list;
    var $content, $curtain, $plan_list;
    var AttackPlannerHelper = require('windows/attack_planner/helpers/attack_planner');

    /**
     * Model
     */
    model = {
        getPlanList: function() {
            return data.plan_list;
        },

        getLastCreatedPlanId: function() {
            return this.getPlanByIndex(0).id;
        },

        getPlanIdByIndex: function(index) {
            return data.plan_list[index].id;
        },

        getPlanByIndex: function(index) {
            return data.plan_list[index];
        },

        isPlanShared: function(index) {
            return data.plan_list[index].shared;
        },

        getPlansCount: function() {
            return data.plan_list.length;
        },

        setPlanList: function(ret_data) {
            data.plan_list = ret_data;
        },

        removePlan: function(plan_id) {
            var plans = this.getPlanList(),
                i = plans.length;

            while (i--) {
                if (plans[i].id === plan_id) {
                    plans.splice(i, 1);
                    return true;
                }
            }

            return false;
        },

        destroy: function() {

        }
    };

    /**
     * View
     */
    view = {
        //Pager settings
        plan_list_start_page: 1,
        per_page: 11,

        initialize: function() {
            $content = root.find('.gpwindow_content');

            this.initializeMainLayout();
            this.initializePlansList(at_model.getCurrentPlanListPage());
        },

        initializeMainLayout: function() {
            var _self = this;

            //Load template
            $content.html(us.template(templates.index, {
                l10n: l10n
            }));

            $curtain = root.find('.window_inner_curtain');
            $plan_list = root.find('.plan_list');

            CM.unregisterGroup(cm_context);

            //Initialize components
            CM.register(cm_context, 'btn_open_new_plan_window', $content.find('.btn_open_new_plan_window').button({
                caption: l10n.create_new_plan
            }).on('btn:click', function() {
                view.openCreatePlanWindow();
            }));

            //Initialize pager
            CM.register(cm_context, 'pgr_plan_list', $content.find(".pgr_plan_list").pager({
                activepagenr: at_model.getCurrentPlanListPage(),
                per_page: this.per_page,
                total_rows: model.getPlansCount()
            }).on("pgr:page:switch", function(e, page_nr) {
                //Save page number
                at_model.setCurrentPlanListPage(page_nr);

                //Initialize selected page
                _self.initializePlansList(page_nr);
            }).on("pgr:page:select", function(e, _pager, activepagenr, number_of_pages) {
                GoToPageWindowFactory.openPagerGoToPageWindow(_pager, activepagenr + 1, number_of_pages);
            }));
        },

        initializePlansList: function(page_nr) {
            var plans = model.getPlanList();

            CM.unregisterSubGroup(ctx_plan_list);

            //Load template
            $plan_list.html(us.template(templates.plan_list, {
                l10n: l10n,
                plan_list: plans,
                item_start: page_nr * this.per_page,
                per_page: this.per_page
            }));

            //Register components & popups
            $content.find('.game_table .row_plan').each(function(i, el) {
                var $el = $(el),
                    index = parseInt($el.attr('js-data'), 10),
                    plan = plans[index];

                //Open Plan
                CM.register(ctx_plan_list, 'btn_open_plan_' + index, $el.find('.ap_caption_name').button({
                    template: 'empty',
                    caption: plan.name_short,
                    tooltips: [{
                        title: plan.name
                    }]
                }).on("btn:click", function() {
                    at_controller.showPlan(plan.id);
                }));

                $el.find('.attack_plan_description span').tooltip(plans[index].description || l10n.any_descr_available);

                //Remove Plan
                CM.register(ctx_plan_list, 'btn_remove_plan_' + index, $el.find('a.cancel').button({
                    tooltips: [{
                        title: l10n.popups.delete_plan
                    }]
                }).on('btn:click', function() {
                    var question_msg = l10n.delete_confirmation[model.isPlanShared(index) ? 'shared' : 'not_shared'];

                    hOpenWindow.showConfirmDialog(l10n.are_you_sure, question_msg, function() {
                        //Remove plan
                        controller.deletePlan(model.getPlanIdByIndex(index));
                    }, l10n.delete_item, function() {}, l10n.cancel);
                }));
            });

            $content.find('.attack_plan.target').tooltip(l10n.targets);
            $content.find('.attack_plan.attacks').tooltip(l10n.attacks);
            $content.find('.attack_plan.supports').tooltip(l10n.support);
        },

        openCreatePlanWindow: function() {
            var txt_plan_name, txta_plan_descr, txt_plan_target, rbtn_search_by;

            CM.unregisterSubGroup(ctx_create_plan);
            txt_plan_name = CM.register(ctx_create_plan, 'txt_plan_name', $content.find('.txt_plan_name').textbox({

            }));

            txt_plan_target = AttackPlannerHelper.registerSearchTextBox(ctx_create_plan, $content.find('.txt_plan_target'), l10n);
            rbtn_search_by = AttackPlannerHelper.registerRadioButtons(ctx_create_plan, $content.find('.rbtn_search_by'), l10n, txt_plan_target);

            txta_plan_descr = CM.register(ctx_create_plan, 'txta_plan_descr', $content.find('.txta_plan_descr').textarea({
                maxlength: 160,
                invalidmsg: l10n.too_long_description
            }));

            CM.register(ctx_create_plan, 'btn_cancel_plan', $content.find('.btn_cancel_plan').button({
                caption: l10n.cancel
            }).on('btn:click', function() {
                view.closeCreatePlanWindow();
            }));

            CM.register(ctx_create_plan, 'btn_create_plan', $content.find('.btn_create_plan').button({
                caption: l10n.create_plan
            }).on('btn:click', function(e, _btn) {
                var target_id = txt_plan_target.getLastSelectedSuggestion()[0] || txt_plan_target.getValue();
                controller.createPlan(txt_plan_name.getValue(), target_id, txta_plan_descr.getValue());
            }));

            $curtain.show();
        },

        closeCreatePlanWindow: function() {
            CM.unregisterSubGroup(ctx_create_plan);

            $curtain.hide();
        },

        destroy: function() {
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
            at_view = obj.at_view;
            at_controller = obj.at_controller;

            wnd = obj.wnd;
            root = wnd.getJQElement();

            //Contexts
            cm_context = wnd.getContext();
            ctx_create_plan = {
                main: cm_context.main,
                sub: 'wnd_create_plan'
            };
            ctx_plan_list = {
                main: cm_context.main,
                sub: 'plan_list'
            };

            view.initialize();
        },

        createPlan: function(name, target_id, description) {
            var btn = CM.get(ctx_create_plan, 'btn_create_plan').disable();

            gpAjax.ajaxPost('attack_planer', 'create_plan', {
                name: name,
                description: description,
                target_id: target_id,
                simple_plan_list: 1
            }, true, {
                success: function(Layout, data) {
                    //Save new plan ID
                    at_model.setCurrentPlanId(data.new_plan_id);

                    //Open Attack page
                    at_controller.openAddAttackPage(target_id);
                },
                error: function(Layout, data) {
                    btn.enable();
                }
            });
        },

        deletePlan: function(plan_id) {
            gpAjax.ajaxPost('attack_planer', 'delete_plan', {
                plan_id: plan_id
            }, true, function(data) {
                var curr_page_nr = CM.get(cm_context, 'pgr_plan_list').getActivePage();
                //Update data in the model
                model.removePlan(plan_id);
                //Update view
                view.initializePlansList(curr_page_nr);
                //Update number of items in pager component
                CM.get(cm_context, 'pgr_plan_list').setTotalRows(model.getPlansCount());
            });
        },

        destroy: function() {
            templates = data = l10n = null;
            wnd = root = null;
            cm_context = ctx_plan_list = null;

            model.destroy();
            view.destroy();
        }
    };

    //Make it globally visible
    window.AttackPlanner.controllers.index = controller;
    window.AttackPlanner.openCreatePlanWindow = view.openCreatePlanWindow;
}(jQuery));