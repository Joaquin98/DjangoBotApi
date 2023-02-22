/*global WMap, Game, SaveCoordinatesWindowFactory, ConfirmationWindowFactory, GameEvents, HelperGame */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;
    var CustomColorOverviewFactory = require('features/custom_colors/factories/custom_colors');
    var LayoutModes = require('enums/layout_modes');

    var LayoutBullEyeArea = BaseView.extend({
        button_events: (function() {
            var obj = {};
            obj[LayoutModes.STRATEGIC_MAP] = GameEvents.ui.bull_eye.radiobutton.strategic_map.click;
            obj[LayoutModes.ISLAND_VIEW] = GameEvents.ui.bull_eye.radiobutton.island_view.click;
            obj[LayoutModes.CITY_OVERVIEW] = GameEvents.ui.bull_eye.radiobutton.city_overview.click;
            return obj;
        })(),

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.registerViewComponents();
        },

        registerViewComponents: function() {
            this.initializeRadiobuttonStrategicMap();
            this.initializeButtonJumpToCurrentTown();
            this.initializeButtonJumpToCoordinates();
            this.initializeButtonSaveCoordinates();
            this.initializeButtonColorTable();

            this.initializeMapCoordinatesWidget();

            this.$el.find('.ocean_number_box').tooltip(this.l10n.ocean_number_tooltip);
        },

        /**
         * Initializes Map Coordinates Widget
         */
        initializeMapCoordinatesWidget: function() {
            var controller = this.controller;

            controller.registerComponent('wgt_coordinates', this.$el.find('.wgt_coordinates').mapCoordinates({
                options: this.controller.getMapCoordinatesDropDownOptions(),
                l10n: {
                    no_results: this.l10n.no_coordinates_saved
                }
            }).on('wgtmc:btn:click', function() {}).on('wgtmc:move:map', function() {
                controller.jumpToCoordinates();
            }).on('wgtmc:row:delete', function(e, _wgtmc, option) {
                //Remove bookmark
                ConfirmationWindowFactory.openConfirmationDeleteMapBookmarkWindow(function() {
                    controller.removeMapCoordinates(option.value);
                }, null, {
                    bookmark_name: option.name
                });
            }));
        },

        initializeButtonSaveCoordinates: function() {
            var controller = this.controller;

            controller.registerComponent('btn_save_location', this.$el.find('.btn_save_location').button({
                template: 'internal',
                tooltips: [{
                    title: this.l10n.save_coordinates
                }]
            }).on('btn:click', function() {
                SaveCoordinatesWindowFactory.openSaveCoordinatesWindow(function(title, x, y) {
                    controller.addMapCoordinates(title, x, y);
                });
            }));
        },

        /**
         * Initializes button Jump to Coordinates
         */
        initializeButtonJumpToCoordinates: function() {
            var controller = this.controller;

            controller.registerComponent('btn_jump_to_coordination', this.$el.find('.btn_jump_to_coordination').button({
                template: 'internal',
                tooltips: [{
                    title: this.l10n.jump_to_coordinates
                }]
            }).on('btn:click', function() {
                controller.jumpToCoordinates();
            }));
        },

        /**
         * Initializes radiobutton Strategic Map
         */
        initializeRadiobuttonStrategicMap: function() {
            var value = HelperGame.showCityOverviewOnGameLoad() ? LayoutModes.CITY_OVERVIEW : LayoutModes.ISLAND_VIEW,
                button_events = this.button_events,
                controller = this.controller,
                options = [{
                        value: LayoutModes.ISLAND_VIEW,
                        tooltip: this.l10n.island_view
                    },
                    {
                        value: LayoutModes.STRATEGIC_MAP,
                        tooltip: this.l10n.strategic_map
                    },
                    {
                        value: LayoutModes.CITY_OVERVIEW,
                        tooltip: this.l10n.town_overview
                    }
                ];

            this.controller.registerComponent('rb_map', this.$el.find('.rb_map').radiobutton({
                value: value,
                options: options,
                template: 'tpl_radiobutton_nocaption',
                css_classes: {
                    option: 'circle_button'
                }
            }).on('rb:change:value', function(e, value) {
                var event = button_events[value];

                if (event) {
                    controller.publishEvent(event, {});
                }
            }));
        },

        /**
         * Initializes button Jump to Current Town
         */
        initializeButtonJumpToCurrentTown: function() {
            //Jump to town button
            this.controller.registerComponent('btn_jump_to_town', this.$el.find('.btn_jump_to_town').button({
                template: 'internal',
                tooltips: [{
                    title: this.l10n.jump_to_current_town
                }]
            }).on('btn:click', function() {
                WMap.mapJump({
                    id: parseInt(Game.townId, 10),
                    ix: WMap.islandPosition.x,
                    iy: WMap.islandPosition.y
                });
            }));
        },

        /**
         * Initializes button Open Color Table window
         */
        initializeButtonColorTable: function() {
            //Change colors button
            this.controller.registerComponent('btn_change_colors', this.$el.find('.btn_change_colors').button({
                template: 'internal',
                tooltips: [{
                    title: this.l10n.wnd_color_table.btn_tooltip
                }]
            }).on('btn:click', function() {
                CustomColorOverviewFactory.openWindow();
            }));
        }
    });

    window.GameViews.LayoutBullEyeArea = LayoutBullEyeArea;
}());