/* global GrepolisModel, Game */

(function() {
    'use strict';

    var PlayerSettings = function() {};

    PlayerSettings.urlRoot = 'PlayerSettings';

    PlayerSettings.constructor = function() {
        GrepolisModel.apply(this, arguments);
        // as long as player settings are not migrated to backbone we put them in here
        this.addStaticGamePlayerSettings();
    };

    PlayerSettings.addStaticGamePlayerSettings = function() {
        Object.keys(Game.player_settings).forEach(function(setting_name) {
            var setting_value = Game.player_settings[setting_name];
            this.set(setting_name, setting_value);
        }.bind(this));
    };

    PlayerSettings.isExtendingAdvisorEnabled = function(advisor_id) {
        return this.get('extend_premium_' + advisor_id) === true;
    };

    PlayerSettings.tutorialArrowActivatedByDefault = function() {
        return this.get('activate_tutorial_arrow_by_default');
    };

    PlayerSettings.isCityNightModeEnabled = function() {
        return this.get('night_gfx_city');
    };

    PlayerSettings.isMapNightModeEnabled = function() {
        return this.get('night_gfx');
    };

    PlayerSettings.isShowUnitsInTownTooltipEnabled = function() {
        return this.get('map_show_supporting_units');
    };

    PlayerSettings.areMapMovementsEnabled = function() {
        return this.get('map_movements');
    };

    PlayerSettings.isPlayerInAttackablePointRangeTooltipEnabled = function() {
        return this.get('map_show_player_in_attackable_point_range');
    };

    /**
     * Checks if a player has enabled a certain kind of web notification.
     * If the specific kind is not known, this function defaults to return a falsy value.
     * @param category - e.g. 'combat'
     * @param event_id - e.g. 'attack_incoming'
     * @returns {*}
     */
    PlayerSettings.isWebNotificationEnabled = function(category, event_id) {
        return this.get('webnotification_' + category + '_' + event_id);
    };

    PlayerSettings.showWebNotificationsInForegroundTab = function() {
        return this.get('webnotifications_in_foreground');
    };

    PlayerSettings.getCityBuildingUpgradedDuration = function() {
        return this.get('webnotification_city_building_upgraded_duration');
    };

    PlayerSettings.getCityBarracksUnitOrderDoneDuration = function() {
        return this.get('webnotification_city_barracks_unit_order_done_duration');
    };

    PlayerSettings.getCityDocksUnitOrderDoneDuration = function() {
        return this.get('webnotification_city_docks_unit_order_done_duration');
    };

    PlayerSettings.getCityResearchCompletedDuration = function() {
        return this.get('webnotification_city_research_completed_duration');
    };

    PlayerSettings.getCommunicationAllianceMessageArrivedDuration = function() {
        return this.get('webnotification_communication_alliance_message_arrived_duration');
    };

    PlayerSettings.isMuted = function() {
        return this.get('muted');
    };

    PlayerSettings.getSoundVolume = function() {
        return this.get('sound_volume');
    };

    PlayerSettings.isMilitiaPopupEnabled = function() {
        return this.get('notification_militia_popup');
    };

    window.GameModels.PlayerSettings = GrepolisModel.extend(PlayerSettings);
}());