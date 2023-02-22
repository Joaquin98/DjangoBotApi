/* global AttackPlanner, WndHandlerDefault, MM, hOpenWindow, GPWindowMgr, CM, InfoWindowFactory */

(function() {
    "use strict";

    function WndHandlerAttackPlaner(wndhandle) {
        this.wnd = wndhandle;

        this.controller = "attack_planer";
        this.action = "index";
    }

    WndHandlerAttackPlaner.inherits(WndHandlerDefault);

    WndHandlerAttackPlaner.prototype.getDefaultWindowOptions = function() {
        return {
            height: 570,
            width: 750,
            resizable: false,
            minimizable: true,
            fullwindow: true,
            help: true,
            title: 'Untitled Window'
        };
    };

    WndHandlerAttackPlaner.prototype.onInit = function(title, UIopts, action, params) {
        UIopts = UIopts || {};
        params = params || {};
        action = action || this.action;

        this.attackPlanner = new AttackPlanner(this.wnd);

        //Its a case when Attack Planner is opened from Attack window
        if (!UIopts.prevent_default_request) {
            this.wnd.requestContentGet(this.controller, action, params);
        }

        //Listen on the town group changes
        this.town_groups_collection = MM.getCollections().TownGroup[0];
        this.town_groups_collection.onTownGroupActivation(function(model) {
            hOpenWindow.refreshWindowIfOpened(GPWindowMgr.TYPE_ATTACK_PLANER);
        }, this);

        return true;
    };

    WndHandlerAttackPlaner.prototype.onRcvData = function(data, controller, action) {
        this.attackPlanner.destroyPage();
        this.attackPlanner.initialize(action, data);
    };

    WndHandlerAttackPlaner.prototype.onClose = function() {
        this.attackPlanner.destroy();
        delete this.attackPlanner;
        this.town_groups_collection.off(null, null, this);

        return true;
    };

    WndHandlerAttackPlaner.prototype.onBlur = function() {
        var $menu = CM.get(this.wnd.getContext(), 'btn_add_target');

        if ($menu) {
            $menu.hide();
        }
    };

    WndHandlerAttackPlaner.prototype.showAttack = function(attack_id) {
        this.wnd.requestContentGet(this.controller, 'attacks', {
            attack_id: attack_id
        });
    };

    WndHandlerAttackPlaner.prototype.showHelp = function() {
        InfoWindowFactory.openAttackPlanerInfo();
    };

    GPWindowMgr.addWndType('ATTACK_PLANER', 'link_planer', WndHandlerAttackPlaner, 1);
}());