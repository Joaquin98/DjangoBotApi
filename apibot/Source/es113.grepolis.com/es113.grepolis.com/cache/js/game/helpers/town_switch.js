/*globals BuildingWindowFactory, ConquestWindowFactory, Game, GameEvents, WMap, TownRelationProvider, MM, HelperTown, Backbone */

define('helpers/town_switch', function() {
    'use strict';

    function TownSwitch() {
        var town_relation = new TownRelationProvider(Game.townId);

        this.town = town_relation.getModel();
        this.town_groups = MM.getCollections().TownGroup[0];
        this.town_group_towns = MM.getCollections().TownGroupTown[0];
    }

    TownSwitch.prototype.switchToPreviousTown = function() {
        var active_group_id = this.town_groups.getActiveGroupId(),
            prev_town_id = this.town_group_towns.getPrevTownId(active_group_id, Game.townId);

        //It can be -1 when there are no towns in the group
        if (prev_town_id > 0) {
            this.townSwitch(prev_town_id);
        }
    };

    TownSwitch.prototype.switchToNextTown = function() {
        var active_group_id = this.town_groups.getActiveGroupId(),
            next_town_id = this.town_group_towns.getNextTownId(active_group_id, Game.townId);

        //It can be -1 when there are no towns in the group
        if (next_town_id > 0) {
            this.townSwitch(next_town_id);
        }
    };

    TownSwitch.prototype.updateWindows = function() {
        if (this.town.hasConqueror()) {
            ConquestWindowFactory.openConquestWindow();
            // refresh open windows = closing them in conquered towns
            // since the buildings are all in one window, you get an error message
            BuildingWindowFactory.refreshIfOpened();
        } else {
            //if you perform a switch from a conquered town
            ConquestWindowFactory.closeConquestWindow();

            BuildingWindowFactory.refreshIfOpened();
            BuildingWindowFactory.refreshAllWindows();
        }
    };

    TownSwitch.prototype.townSwitch = function(town_id) {
        var current_town = this.town,
            new_town, town_relation;

        // caused by clicking on 'No towns' within a new group
        if (typeof town_id === 'undefined') {
            return;
        }

        // don't switch if user clicks on active town'
        if (town_id === parseInt(Game.townId, 10)) {
            return;
        }

        town_relation = new TownRelationProvider(town_id);
        new_town = town_relation.getModel();

        if (!new_town) {
            return;
        }

        //Unbind all events from the previous town model
        if (current_town) {
            current_town.off(null, null, this);
        }

        new_town.onHasConquerorChange(this, this.updateWindows.bind(this));
        new_town.onAllResourcesFull(this, function() {
            $.Observer(GameEvents.town.resources.limit_reached_all).publish({});
        });

        // update the current town
        this.town = new_town;

        Game.townId = new_town.getId();
        Game.townName = new_town.getName();

        HelperTown.updateBrowserWindowTitle();

        this.updateWindows();

        //highlight current town on map
        WMap.setCurrentTown(Game.townId, {
            x: new_town.getAbsX(),
            y: new_town.getAbsY()
        }, {
            x: new_town.getIslandX(),
            y: new_town.getIslandY()
        });

        $.cookie('toid', town_id, {
            expires: 30,
            path: '/'
        });

        //trigger town switch event
        $.Observer(GameEvents.town.town_switch).publish({});
    };

    window.TownSwitch = TownSwitch;

    us.extend(window.TownSwitch.prototype, Backbone.Events);

    return TownSwitch;
});