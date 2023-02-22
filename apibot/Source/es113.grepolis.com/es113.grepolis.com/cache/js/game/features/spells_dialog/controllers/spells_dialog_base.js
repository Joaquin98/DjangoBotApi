/*global GameData, GodSelectionWindowFactory, hOpenWindow, GameEvents */
define('features/spells_dialog/controllers/spells_dialog_base', function() {
    'use strict';

    var BaseController = window.GameControllers.BaseController,
        SpellButtonHelper = require('helpers/spell_button'),
        TargetType = require('features/spells_dialog/enums/target_type');

    return BaseController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            BaseController.prototype.initialize.apply(this, arguments);

            this.target_id = options.target_id;
            this.town_name = options.town_name;
            this.target_type = options.target_type;
            this.is_own_town = options.is_own_town;

            this.player_gods = this.getModel('player_gods');
        },

        registerEventListeners: function() {
            this.stopListening(this.player_gods);
            this.player_gods.onGodChange(this, this.view.rerender.bind(this.view));
            this.player_gods.onGodsFavorChange(this, this.view.renderGodsFavor.bind(this.view));
        },

        getPossibleCastsCount: function(current_favor, power_id) {
            return parseInt(current_favor / GameData.powers[power_id].favor, 10);
        },

        getWorldAvailableGods: function() {
            return this.player_gods.getWorldAvailableGods();
        },

        getGodsInTowns: function() {
            return this.player_gods.getGodsInTowns();
        },

        hasAnyGod: function() {
            return this.getGodsInTowns().length > 0;
        },

        getCurrentFavorForGods: function() {
            return this.player_gods.getCurrentFavorForGods();
        },

        getCurrentFavorForGod: function(god_id) {
            return this.player_gods.getCurrentFavorForGod(god_id);
        },

        getCastablePowersForAllGods: function() {
            return this.getTargetType() === TargetType.TOWN ?
                this.player_gods.getCastablePowersOnTownForAllGods(this.is_own_town) :
                this.player_gods.getCastablePowersOnCommandForGods(this.player_gods.getWorldAvailableGods());
        },

        getCastablePowersForAvailableGods: function() {
            return this.getTargetType() === TargetType.TOWN ?
                this.player_gods.getCastablePowersOnTownForAvailableGods() :
                this.player_gods.getCastablePowersOnCommandForGods(this.player_gods.getPlayerAvailableGods());
        },

        btnSpellClickHandler: function(power_id, e, _btn) {
            var casted_power = this.getCastedPowerOnTheTargetTown(power_id);

            SpellButtonHelper.TownCastSpellHandler(this.target_id, this.town_name, casted_power, this.is_own_town, function(data) {
                var report_id = data.report_id;

                this.publishCastPowerEvent(power_id);

                if (report_id) {
                    this.showViewReportBox(report_id);
                }
            }.bind(this), _btn);
        },

        btnSpellMouseOverHandler: function(e) {
            SpellButtonHelper.TownSpellMouseOverHandler(e, this.is_own_town, this.target_id);
        },

        showViewReportBox: function(report_id) {
            this.view.showViewReportBox(report_id);
        },

        onBtnAnyGodClick: function() {
            GodSelectionWindowFactory.openWindow();
        },

        onBtnShowReportClick: function(report_id) {
            hOpenWindow.viewReport(report_id);
        },

        getTargetType: function() {
            return this.target_type;
        },

        publishCastPowerEvent: function(power_id) {
            $.Observer(GameEvents.command.cast_power).publish({
                power_id: power_id
            });
        }
    });
});