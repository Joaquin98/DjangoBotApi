/*global Timestamp*/
define('features/commands/models/movements_colonization', function(require) {
    'use strict';

    var MovementsBase = require('features/commands/models/movements_base');
    var GrepolisModel = require_legacy('GrepolisModel');

    var MovementsColonization = MovementsBase.extend({
        urlRoot: 'MovementsColonization',

        /**
         * Returns time left until colonization is finished
         *
         * @return {Integer} seconds
         */
        getTimeLeft: function() {
            var finished_time = this.getCommandFinishTimestamp();

            return Math.max(0, finished_time - Timestamp.now());
        },

        getRealTimeLeft: function() {
            var finished_time = this.getCommandFinishTimestamp();
            return finished_time - Timestamp.now();
        },

        getOriginTownName: function() {
            var origin_town = this.getOriginTown();
            return origin_town.name;
        },

        /**
         * Returns group id (Commands are splited to multiple groups like 'unit_movements',
         * 'spy_movements', 'colonization_movements', 'revolts', 'conquers_movements')
         */
        getGroupId: function() {
            return 'colonizations';
        },

        hasFoundationStarted: function() {
            return this.getColonizationFinishedAt() !== null;
        },

        /**
         * Returns whether coloship already arrived
         *
         * @return {Boolean}
         */
        hasArrived: function() {
            return this.getColonizationFinishedAt() !== null;
        },

        /**
         * Returns the colonization id
         *
         * @return {Number}
         */
        getColonizationId: function() {
            return this.get('colonization_id');
        },

        /**
         * time when colonization will be finished, is null if ship is till on the way
         *
         * @return {Number}
         */
        getColonizationFinishedAt: function() {
            return this.get('colonization_finished_at');
        },

        /**
         * Returns command type
         *
         * return {String} conqueror
         */
        getType: function() {
            return 'colonization';
        },

        /**
         * Returns information that the colonization can not be canceled
         *
         * @return {Boolean}
         */
        isCancelable: function() {
            return false;
        },

        /**
         * The Town link for a colonization is the island link
         *
         * @return {String}
         */
        getTownLink: function() {
            return this.get('island_link');
        },

        /**
         * returns the unified, state aware finish timestamp
         * @returns {*|Number}
         */
        getCommandFinishTimestamp: function() {
            return this.hasArrived() ? this.getColonizationFinishedAt() : this.getArrivalAt();
        },

        /**
         * used to get a css class string for rendering
         * @returns {string}
         */
        getAdditionalCss: function() {
            return this.hasArrived() ? 'foundation' : 'colonization';
        }

    });

    GrepolisModel.addAttributeReader(MovementsColonization.prototype,
        'id',
        'arrival_at',
        'colonization_finished_at',
        'island_x',
        'island_y',
        'number_on_island',
        'origin_town',
        'origin_town_id',
        'started_at',
        'units_id'
    );

    window.GameModels.MovementsColonization = MovementsColonization;

    return MovementsColonization;
});