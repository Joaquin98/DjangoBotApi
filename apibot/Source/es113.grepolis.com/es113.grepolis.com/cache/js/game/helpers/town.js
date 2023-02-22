/*globals Game, ITowns, TownSwitch, document, GrepoNotificationStack, WMap, TownRelationProvider, MM, GameEvents,
GameData */

(function() {
    'use strict';

    var HelperTown = {
        _ts_prototype: null,

        _getTSPrototype: function() {
            if (!this._ts_prototype) {
                this._ts_prototype = new TownSwitch();
            }

            return this._ts_prototype;
        },

        _getTownModel: function() {
            var town = new TownRelationProvider(Game.townId);
            return town.getModel();
        },

        /**
         * Get god for current town
         *
         * @returns {String}
         */
        getGodForCurrentTown: function() {
            return this._getTownModel().getGod();
        },

        showFuryResourceForCurrentTown: function() {
            return GameData.gods.ares ? this.getGodForCurrentTown() === GameData.gods.ares.id : false;
        },

        /**
         * Changes town to the previous on the list
         */
        switchToPreviousTown: function() {
            if (MM.getModels().Town) {
                this._getTSPrototype().switchToPreviousTown();
            }
        },

        /**
         * Changes town to the next on the list
         */
        switchToNextTown: function() {
            if (MM.getModels().Town) {
                this._getTSPrototype().switchToNextTown();
            }
        },

        /**
         * Changes town depends on the given argument
         *
         * @param {Number} town_id
         */
        townSwitch: function(town_id) {
            this._getTSPrototype().townSwitch(town_id);
        },

        renameTown: function(town_name, callback_success, callback_error) {
            var town_model = this._getTownModel(),
                callback_success_decorator = function() {
                    ITowns.setName(town_name, Game.townId);
                    // update name in Game
                    Game.townName = town_name;

                    if (typeof callback_success === 'function') {
                        callback_success();
                    }
                };

            town_model.setTownName(town_name, {
                success: callback_success_decorator,
                error: callback_error
            });
        },

        updateBrowserWindowTitle: function() {
            var len = GrepoNotificationStack.length();

            document.title = _('Grepolis') + (len ? ' (' + len + ')' : '') + ' - ' + Game.townName;
        },

        /**
         * @see function getTownGroupsForDropdown from {GameCollections.TownGroups}
         *
         * @return {Array}
         */
        getTownGroupsForDropdown: function() {
            return MM.getCollections().TownGroup[0].getTownGroupsForDropdown();
        },

        /**
         * handle clicks on the 'jump to this town' button on the map and also check for
         * fullscreen city overview
         */
        handleInfoWindowJumpToTownClick: function(mapObj, windowsStayOpen, callback) {
            $.Observer(GameEvents.ui.bull_eye.radiobutton.island_view.click).publish();

            WMap.mapJump(mapObj, windowsStayOpen, callback);
        },

        // TODO get from Backend Game.constants
        getMaxTownNameLength: function() {
            return 20;
        },

        // TODO get from Backend Game.constants
        getMinTownNameLength: function() {
            return 3;
        }
    };

    window.HelperTown = HelperTown;
}());