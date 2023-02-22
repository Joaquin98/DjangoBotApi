/*global GameViews, GameControllers, GameEvents, Minimap, WMap */

(function() {
    'use strict';

    var LayoutModes = require('enums/layout_modes');

    var LayoutBullEyeAreaController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            this.registerEventsListeners();
        },

        registerEventsListeners: function() {
            var player_map_favorites = this.getCollection('player_map_favorites');

            //@todo try to use .listenTo()
            player_map_favorites.on('add', function(e, collection) {
                //Update dropdown list
                this.getComponent('wgt_coordinates').setOptions(collection.getDropDownOptions());
            }, this);

            //@todo try to use .listenTo()
            player_map_favorites.on('remove', function(e, collection) {
                //Update dropdown list
                this.getComponent('wgt_coordinates').setOptions(collection.getDropDownOptions());
            }, this);

            //Map can be zoomed in multiple ways, so buttons should be updated accordingly
            this.observeEvent(GameEvents.map.zoom_out, function() {
                this.getComponent('rb_map').setValue(LayoutModes.STRATEGIC_MAP, {
                    silent: true
                });
            }.bind(this));

            //Map can be zoomed in multiple ways, so buttons should be updated accordingly
            this.observeEvent(GameEvents.map.zoom_in, function() {
                this.getComponent('rb_map').setValue(LayoutModes.ISLAND_VIEW, {
                    silent: true
                });
            }.bind(this));

            // events for the radio buttons may be triggerd from outside the component (e.g. goToTown in context menu)
            // so make sure the component is updated with correct state
            this.observeEvent(GameEvents.ui.bull_eye.radiobutton.city_overview.click, function() {
                Minimap.zoomIn();
                this.getComponent('rb_map').setValue(LayoutModes.CITY_OVERVIEW, {
                    silent: true
                });
            }.bind(this));

            this.observeEvent(GameEvents.ui.bull_eye.radiobutton.strategic_map.click, function() {
                Minimap.zoomOut();
                this.getComponent('rb_map').setValue(LayoutModes.STRATEGIC_MAP, {
                    silent: true
                });
            }.bind(this));

            this.observeEvent(GameEvents.ui.bull_eye.radiobutton.island_view.click, function() {
                Minimap.zoomIn();
                this.getComponent('rb_map').setValue(LayoutModes.ISLAND_VIEW, {
                    silent: true
                });
            }.bind(this));
        },

        renderPage: function() {
            this.view = new GameViews.LayoutBullEyeArea({
                el: this.$el,
                controller: this
            });

            return this;
        },

        /**
         * Returns 'Map Coordinates' formated compatible with Dropdown component
         *
         * @return {Array}
         * @see dropdown.js
         */
        getMapCoordinatesDropDownOptions: function() {
            return this.getCollection('player_map_favorites').getDropDownOptions();
        },

        /**
         * Moves map to the coordinates which are specified in the textboxes
         * in the UI
         */
        jumpToCoordinates: function() {
            WMap.mapJump();
            $.Observer(GameEvents.menu.click).publish({
                option_id: 'jump_to_coordinates'
            });
        },

        /**
         * Removes map coordinates bookmark
         */
        removeMapCoordinates: function(id) {
            var player_map_favorites_collection = this.getCollection('player_map_favorites');
            player_map_favorites_collection.deleteFavorite(id);
        },

        /**
         * Adds new 'map coordinates' bookmark
         */
        addMapCoordinates: function(title, x, y) {
            var player_map_favorites_collection = this.getCollection('player_map_favorites');
            player_map_favorites_collection.addFavorite(title, x, y);
        },

        destroy: function() {
            //@todo try to use .listenTo()
            this.getCollection('player_map_favorites').off(null, null, this);
        }
    });

    window.GameControllers.LayoutBullEyeAreaController = LayoutBullEyeAreaController;
}());