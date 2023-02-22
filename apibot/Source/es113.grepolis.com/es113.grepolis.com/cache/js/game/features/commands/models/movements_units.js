/*global window, Timestamp, DM, Game */

define('features/commands/models/movements_units', function() {
    'use strict';

    var MovementsBase = require('features/commands/models/movements_base'),
        COMMAND_TYPES = require('enums/command_types'),
        CommandHelper = require('helpers/commands');

    /*
        arrival_at: 1377466083
        arrival_eta: 673
        arrived_human: "today at 23:28"
        cancelable: false
        command_name: "Returnee"
        id: 92
        incoming: true
        incoming_attack: false
        started_at: 1377464881
        town: {
            link: "<a href="#eyJpZCI6QifQ==" title="26. Jerry Does Stadt" class="gp_town_link">26. Jerr...</a>"
            name: "26. Jerry Does Stadt",
            is_attack_spot: false,
            is_farm: false,
            is_quest: false
        }
        type: "attack_land" (4 types)
         cap_of_invisibility_effective_until: 1377466083
    */

    var MovementsUnits = MovementsBase.extend({
        urlRoot: 'MovementsUnits',

        /**
         * Returns the time until the movement arrives
         *
         * @returns {Integer}
         */
        getTimeLeft: function() {
            return Math.max(0, this.getRealTimeLeft());
        },

        /**
         * Returns group id (Commands are splited to multiple groups like 'unit_movements',
         * 'spy_movements', 'colonization_movements', 'revolts', 'conquers_movements')
         *
         * @return {String}
         */
        getGroupId: function() {
            return 'unit_movements';
        },

        /**
         * Returns if this movement can be removed from the list
         *
         * @return {Boolean}
         */
        isRemovable: function() {
            return this.isCancelable() && !this.isIncommingMovement();
        },

        /**
         * Returns command name
         *
         * @return {String}
         */
        getCommandName: function() {
            return this.get('command_name');
        },

        /**
         * Returns the command id
         *
         * @return {Number}
         */
        getCommandId: function() {
            return this.get('command_id');
        },

        /**
         * Determinates whether movement is incoming or outgoing
         *
         * @return {Boolean}
         */
        isIncommingMovement: function() {
            return CommandHelper.isPlayersTown(this.getTargetTownId());
        },

        /**
         * Determinates if incoming movement is an attack
         *
         * @return {Boolean}
         */
        isIncommingAttack: function() {
            return this.getType() === COMMAND_TYPES.ATTACK && this.isIncommingMovement();
        },

        getHomeTownId: function() {
            return this.get('home_town_id');
        },

        getTargetTownId: function() {
            return this.get('target_town_id');
        },

        isReturning: function() {
            return this.getHomeTownId() === this.getTargetTownId();
        },

        getCancelableUntil: function() {
            return this.get('cancelable_until');
        },

        /**
         * Returns base64 link to the town - or non-clickable string (in case of attack spots)
         *
         * @return {String}
         */
        getTownLink: function() {
            return (this.getTargetTownId() === Game.townId && this.isIncommingMovement()) ? this.getLinkOrigin() : this.getLinkDestination();
        },

        getLinkDestination: function() {
            if (this.isAttackSpotAttack()) {
                return DM.getl10n('attack_spot').window_title;
            } else {
                return this.get('link_destination');
            }
        },

        getLinkOrigin: function() {
            if (this.isAttackSpotAttack()) {
                return DM.getl10n('attack_spot').window_title;
            } else {
                return this.get('link_origin');
            }
        },

        /**
         * Returns name of the town - or predefined name (e.g. 'bandits camp' for attack spots)
         *
         * @return {String}
         */
        getTownName: function() {
            return this.get('town_name');
        },

        /**
         * Returns movement type
         *     Possible types:
         *     - "attack_land"
         *     - "farm_attack"
         *
         * return {String}
         */
        getType: function() {
            return this.get('type');
        },

        /**
         * Returns the arrive time as human readable timestanp
         *
         * @returns {String}
         */
        getArrivedAtHuman: function() {
            return this.get('arrived_human');
        },

        /**
         * Returns time left until this command can not canceled any more
         *
         * @returns {Integer}
         */
        getCancelTimeLeft: function() {
            return Math.max(0, this.getCancelableUntil() - Timestamp.now());
        },

        /**
         * true if attack spot movement
         *
         * @returns {boolean}
         */
        isAttackSpotAttack: function() {
            return this.isReturning() ? this.get('origin_is_attack_spot') : this.get('destination_is_attack_spot');
        },

        /**
         * cap_of_invisibility spell is valid for the first 10% of travel time
         * This field is only available on outgoing commands
         */
        wouldCapOfInvisibilityStillBeEffective: function() {
            var effective_until = this.get('cap_of_invisibility_effective_until');
            return effective_until && Timestamp.now() < effective_until;
        },

        /**
         * used to get a css class string for rendering
         * @returns {string}
         */
        getAdditionalCss: function() {
            return (this.getTargetTownId() === Game.townId && this.isIncommingMovement()) ? 'returning' : 'outgoing';
        }
    });

    window.GameModels.MovementsUnits = MovementsUnits;

    return MovementsUnits;
});