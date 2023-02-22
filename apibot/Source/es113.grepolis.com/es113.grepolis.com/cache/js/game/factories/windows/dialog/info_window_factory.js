/*globals WF, InfoWindowData, AllTownsInOneGroupInfoWindowData, AttackPlanerInfoWindowData, ChangeGodInfoWindowData,
CreateFirstTownGroupInfoWindowData, CreateFirstTownGroupInfoWindowData, MassRecruitHelpInfoWindowData,
PhoenicianSalesmanHelpInfoWindowData, CapOfInvisibilityNotPossibleInfoWindowData */

window.InfoWindowFactory = (function() {
    'use strict';

    return {
        _openInfoWindow: function(data_object, settings) {
            var window_settings = $.extend({
                minheight: 126,
                width: 570,
                minimizable: false,
                modal: true,
                activepagenr: data_object.getType()
            }, settings);

            if (!(data_object instanceof InfoWindowData)) {
                throw 'To run InfoWindow you need to pass object which is instance of InfoWindowData';
            }

            return WF.open('dialog', {
                preloaded_data: {
                    data_object: data_object
                },
                window_settings: window_settings
            });
        },

        /**
         * Opens window which is shown in 'Town groups overview' when user moves all towns to one city group
         */
        openAllTownsInOneGroupInfoWindow: function() {
            this._openInfoWindow(new AllTownsInOneGroupInfoWindowData(), {
                minheight: 212,
                width: 420
            });
        },

        /**
         * Open attack planer info window
         */
        openAttackPlanerInfo: function() {
            this._openInfoWindow(new AttackPlanerInfoWindowData(), {
                minheight: 400
            });
        },

        /**
         * Open change god info window (in gods overview)
         *
         * IMPORTANT !!!: This window will work only when 'gods overview' is opened
         */
        openChangeGodInfoWindow: function(town_id, new_god_id, new_god_name) {
            this._openInfoWindow(new ChangeGodInfoWindowData({
                town_id: town_id,
                new_god_id: new_god_id,
                new_god_name: new_god_name
            }), {
                minheight: 242
            });
        },

        /**
         * Opens window which is shown in 'Town groups overview' when user creates first town group
         */
        openCreateFirstTownGroupInfoWindow: function() {
            this._openInfoWindow(new CreateFirstTownGroupInfoWindowData(), {
                minheight: 212,
                width: 420
            });
        },

        /**
         * Opens window which is shown in 'Town groups overview' when user moves all towns to one city group
         */
        openMassRecruitHelpInfoWindow: function() {
            this._openInfoWindow(new MassRecruitHelpInfoWindowData(), {
                minheight: 380,
                width: 530
            });
        },

        /**
         * Opens window which is shown in 'Town groups overview' when user moves all towns to one city group
         */
        openPhoenicianSalesmanHelpInfoWindow: function() {
            this._openInfoWindow(new PhoenicianSalesmanHelpInfoWindowData(), {
                minheight: 220,
                width: 430
            });
        },

        /**
         * Opens window telling the player Cap of Invisibility cannot be cast anymore
         */
        openCapOfInvisibilityInfoWindow: function() {
            this._openInfoWindow(new CapOfInvisibilityNotPossibleInfoWindowData(), {
                minheight: 100,
                width: 400
            });
        }
    };
}());