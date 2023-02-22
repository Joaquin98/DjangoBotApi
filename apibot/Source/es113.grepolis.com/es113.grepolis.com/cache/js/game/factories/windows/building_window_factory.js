/*globals $, GameEvents, GPWindowMgr, GameDataBuildings, WF, WndHandlerBuilding, GameData, Game, MM, GodSelectionWindowFactory */

window.BuildingWindowFactory = (function() {
    'use strict';

    var Buildings = require('enums/buildings');

    return {
        open: function(building_type, action, params) {
            var w = this.getWnd(),
                type, title, handler, options = {};

            $.Observer(GameEvents.window.building.open).publish({
                building_id: building_type
            });

            // redirect some new windows to WindowFactory, to avoid patching the main.tpl.php template in the senate
            switch (building_type) {
                case Buildings.ACADEMY:
                case Buildings.MARKET:
                    return WF.open(building_type);
                case Buildings.TEMPLE:
                    return GodSelectionWindowFactory.openWindow();
                case Buildings.HIDE:
                case Buildings.STORAGE:
                    // @todo not a good style to directly access MM.getCollections() but we don't have a choice
                    // injecting via DataFrontendBridge would query all towns again, although they are already here
                    return WF.open(building_type, {
                        collections: {
                            towns: MM.getCollections().Town[0]
                        }
                    });
                case Buildings.BARRACKS:
                case Buildings.DOCKS:
                    if (GameDataBuildings.areNewBarracksAndDocksEnabled()) {
                        return WF.open(building_type, {
                            building_type: building_type
                        });
                    }
                    break;
                default:
                    break;
            }

            action = action || this._getDefaultAction(building_type);

            // Simulator hack:
            // allows us to put remaining units to the simulator by report's
            if (building_type === 'place' && action === 'simulator') {
                options.units = params.units || params;

                if (params.defender_town_id) {
                    options.defender_town_id = params.defender_town_id;
                }
            } else {
                options = params;
            }

            if (w) {
                w.toTop();
                // check if the correct WndHandler is attached:
                handler = w.getHandler();

                w.setHandler(new WndHandlerBuilding(w));

                // clear old menu
                w.clearMenuNow();
                // get new content
                w.requestContentGet(GameData.buildings[building_type].controller, action, options, function() {});

                return w;
            } else {
                title = GameData.buildings[building_type].name + ' (' + Game.townName + ')';
                type = GPWindowMgr.TYPE_BUILDING;

                return GPWindowMgr.Create(type, title, {}, building_type, action, options);
            }
        },

        refreshAllWindows: function() {
            //I want to refresh more windows
            var all_opened_windows = GPWindowMgr.getAllOpen(),
                i, l = all_opened_windows.length,
                wnd, handler;

            for (i = 0; i < l; i++) {
                wnd = all_opened_windows[i];
                handler = wnd.getHandler();

                if (handler.switchTownRefresh && handler.refresh) {
                    handler.refresh();
                }
            }
        },

        getWnd: function() {
            return GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_BUILDING);
        },

        refresh: function() {
            var wnd = this.getWnd(),
                handler = wnd ? wnd.getHandler() : null;

            if (handler) {
                handler.refresh();
            }
        },

        refreshIfOpened: function() {
            this.refresh();
        },

        _getDefaultAction: function(building) {
            return building === 'place' ? 'culture' : 'index';
        }
    };
}());