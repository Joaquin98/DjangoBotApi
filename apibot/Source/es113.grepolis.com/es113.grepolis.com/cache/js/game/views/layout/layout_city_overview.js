/*global us, DM, Game, HelperBrowserEvents, HelperDragDrop, GameEvents, GameData */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;
    var BrowserHelper = require('helpers/browser');

    var overview_is_moving = false;
    var MAX_CLICK_TIME_MS = 100;
    var movement_timer_id = 0;

    /*
     * When the user drags the overview over an building,
     * the click is only fired when done within 300 ms
     */
    function _handleMapMovementOnBuildings(e) {
        if (!$(e.target).is('area') || movement_timer_id > 0) {
            return;
        }

        movement_timer_id = window.setTimeout(function() {
            overview_is_moving = true;
        }, MAX_CLICK_TIME_MS);
    }

    function _resetTimer() {
        if (movement_timer_id > 0) {
            window.clearTimeout(movement_timer_id);
            movement_timer_id = 0;
        }
    }

    function _resetMoving() {
        overview_is_moving = false;
        _resetTimer();
    }

    function _isMoving() {
        return overview_is_moving;
    }

    var LayoutCityOverview = BaseView.extend({
        $viewport: null,
        $draggable_layer: null,
        $buildings_container: null,

        center_point: {
            x: 966,
            y: 586
        },

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.render();
            this.center();
        },

        /**
         * Calls when city overview should be rerendered
         */
        rerender: function() {
            //Save position to restore it later (do this only for rerendering)
            var pos = this.$draggable_layer.css('translate');

            this.unregisterEventListeners();
            this.render();

            this.$draggable_layer.css('translate', pos);
        },

        render: function() {
            var controller = this.controller;

            this.$buildings_container = this.$el.find('.js-city-overview-buildings-container');

            this.$buildings_container.html(us.template(this.controller.getTemplate('main'), {
                buildings: controller.getBuildingObjects(),
                items: controller.getItemsObjects(),
                animations: controller.getBuildingAnimationsObjects()
            }));

            this.$el.show();

            this.$viewport = this.$el.find('.js-city-overview-viewport');
            this.$draggable_layer = this.$viewport.find('.js-city-overview-dragdrop');

            /* Internet explorers cursor is broken: it always shows the 'move' and overwrites the 'pointer' on the buildings,
             * so we default to 'auto' here - then the pointer gets applied correctly
             *  - does not affect all other browsers
             */
            if (BrowserHelper.isIE11OrLower()) {
                this.$draggable_layer.css('cursor', 'auto');
            }

            this.registerEventListeners();
            this.registerClickMap();

            this.setNightMode(Game.night_mode);
        },

        setNightMode: function(is_night) {
            if (this.controller.isCityNightModeEnabled()) {
                this.$el.toggleClass('night', is_night);
            }
        },

        /**
         * Registers events for the clicking map
         */
        registerClickMap: function() {
            var $map_town = this.$el.find('#map_town');
            var $map_image = this.$el.find('#index_map_image');
            var sub_context = this.controller.getSubContext();

            //Click
            $map_town.on(HelperBrowserEvents.getOnClickEventName(sub_context), 'area', function(e) {
                var $target = $(e.currentTarget),
                    building_id = $target.data('building'),
                    building_level = $target.data('level');

                // don´t do the click if the user is moving the overview on top
                // of a building
                if (_isMoving()) {
                    _resetMoving();
                    return false;
                }
                _resetMoving();

                $.Observer(GameEvents.window.townindex.building.click).publish({
                    building_id: building_id,
                    building_level: building_level
                });

                this.controller.openWindow(building_id);

            }.bind(this));

            //Mouseover
            $map_town.on(HelperBrowserEvents.getOnMouseOverEventName(sub_context), 'area', function(e) {
                var $target = $(e.currentTarget),
                    building_id = $target.data('building'),
                    building_level = $target.data('level'),
                    hover_text;

                if (building_id === 'trader') {
                    hover_text = DM.getl10n('docks').phoenician_trader.title;
                } else {
                    hover_text = s(_('%1 (level %2)'), GameData.buildings[building_id].name, building_level);
                }

                $map_image.toggleClass('area_hover', true);
                $target.tooltip(hover_text).showTooltip(e);
            });

            $map_town.on(HelperBrowserEvents.getOnLeaveEventName(sub_context), 'area', function(e) {
                $map_image.toggleClass('area_hover', false);
            });
        },

        /**
         * Centers city overview on specific point (determined by Game designers)
         */
        center: function() {
            var viewport = {
                    width: this.$viewport.outerWidth(),
                    height: this.$viewport.outerHeight()
                },
                draggable = {
                    width: this.$draggable_layer.outerWidth(),
                    height: this.$draggable_layer.outerHeight()
                };

            var center = this._calculateImageCenterOffset(this.center_point, viewport, draggable);

            this.$draggable_layer.css('translate', [center.x, center.y]);
        },

        /**
         * Registers event listeners
         */
        registerEventListeners: function() {
            HelperDragDrop.setTargetViewCursor(this.$viewport, this.$draggable_layer);
            var onStartEventName = HelperBrowserEvents.getOnStartEventName(this.controller.getSubContext()),
                dragDropHandler = HelperDragDrop.getDragDropEventHandler(this.$viewport, this.controller.getSubContext(), function(event) {
                    _handleMapMovementOnBuildings(event);
                });

            this.$viewport.on(onStartEventName, '.js-city-overview-dragdrop', dragDropHandler);
        },

        /**
         * Method executed when 'Construciton mode' is being activated
         */
        activateConstructionMode: function() {
            this.$el.addClass('construction_mode');
        },

        /**
         * Method executed when 'Construction mode' is being deactivated
         */
        deactivateConstructionMode: function() {
            this.$el.removeClass('construction_mode');
        },

        /**
         * Returns position of the viewport which will focus on the point specified as an argument
         *
         * @param {Object} center_point    returns coordinates of the point we want to center the overview on
         * @param {Object} viewport        returns dimension of the viewport
         *
         * @return {Object} {top: {Number}, left: {Number}}
         *
         * @private
         */
        _calculateImageCenterOffset: function(center_point, viewport, draggable) {
            var x = (viewport.width / 2) - center_point.x,
                y = (viewport.height / 2) - center_point.y;
            return {
                x: Math.round(x),
                y: Math.round(y)
            };
        },

        /**
         * Unregisters events binded to the viewport
         */
        unregisterEventListeners: function() {
            this.$viewport.off();
        },

        destroy: function() {
            this.deactivateConstructionMode();
            this.$el.hide();
            this.$buildings_container.empty();
        }
    });

    window.GameViews.LayoutCityOverview = LayoutCityOverview;
}());