define('collections/town/takeovers',
    function(require) {

        'use strict';

        var Collection = require_legacy('GrepolisCollection');
        var Model = require('models/town/takeover');
        var TYPES = require('enums/map_extra_info_types');
        var Timestamp = require('misc/timestamp');

        var Takeovers = Collection.extend({
            model: Model,
            model_class: 'Takeover',

            onTakeoversChange: function(obj, callback) {
                obj.listenTo(this, 'add change remove', callback);
            },

            hasRevoltMovements: function(town_id) {
                return this.getAllRevoltsForSpecificTown(town_id).length > 0;
            },

            hasTakeOverMovements: function(town_id) {
                return this.getAllTakeOverForSpecificTown(town_id).length > 0;
            },

            getAllRevoltsForSpecificTown: function(town_id) {
                return this.filter(function(model) {
                    return model.getDestinationTown().id === town_id &&
                        model.getCommand().type === TYPES.REVOLT;
                });
            },

            getAllTakeOverForSpecificTown: function(town_id) {
                return this.filter(function(model) {
                    return model.getDestinationTown().id === town_id &&
                        model.getCommand().type === TYPES.TAKE_OVER;
                });
            },

            /**
             * If the town with town_id is currently being conquered, this function will return the model for the takeover
             * @param town_id
             * @returns single movement element or null
             */
            getIncomingTakeOverForSpecificTown: function(town_id) {
                var movement_list = this.filter(function(model) {
                    return model.getDestinationTown().id === town_id &&
                        model.getCommand().type === TYPES.TAKE_OVER &&
                        model.isIncomingTakeOver();
                });

                if (movement_list && movement_list.length > 0) {
                    return movement_list[0];
                }
                return null;
            },

            getAllIncomingRevoltsForSpecificTown: function(town_id) {
                return this.filter(function(model) {
                    return model.getDestinationTown().id === town_id &&
                        model.getCommand().type === TYPES.REVOLT &&
                        model.isIncomingRevolt();
                });
            },

            /**
             * If you are currently conquering the town with town_id, this function will return the model for the takeover
             * @param town_id
             * @returns single movement element or null
             */
            getOutgoingTakeOverForSpecificTown: function(town_id) {
                var takeover_list = this.filter(function(model) {
                    return model.getDestinationTown().id === town_id &&
                        model.getCommand().type === TYPES.TAKE_OVER &&
                        !model.getCommand().is_returning &&
                        !model.isIncomingTakeOver();
                });

                if (takeover_list && takeover_list.length > 0) {
                    return takeover_list[0];
                }
                return null;
            },

            getAllOutgoingRevoltsForSpecificTown: function(town_id) {
                return this.filter(function(model) {
                    return model.getDestinationTown().id === town_id &&
                        model.getCommand().type === TYPES.REVOLT &&
                        !model.isIncomingRevolt();
                });
            },

            hasRunningRevoltsForSpecificTown: function(town_id) {
                var movement_list = this.filter(function(model) {
                    return model.getDestinationTown().id === town_id &&
                        model.getCommand().type === TYPES.REVOLT &&
                        model.getCommand().started_at < Timestamp.now() &&
                        model.getCommand().arrival_at > Timestamp.now();
                });

                return movement_list && movement_list.length > 0;
            }
        });

        window.GameCollections.Takeovers = Takeovers;
        return Takeovers;
    });