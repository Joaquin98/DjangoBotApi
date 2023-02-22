/*global GameViews, GameDataPremium, DM, Game, GameControllers, ConfirmationWindowFactory, GrepoApiHelper */

(function() {
    "use strict";

    var modes = {
        //Represents all supports which are for the currenlty selected town
        SUPPORT_FOR_ACTIVE_TOWN: 'support_overview_support_for_active_town', //old agora first tab
        //Represents all supports which are given by currently selected town
        ACTIVE_TOWN_SUPPORTS_TOWNS: 'support_overview_active_town_supports_towns', //old agora second tab
        //Represents supports from all towns from active player given to different players
        ACTIVE_PLAYER_SUPPORTS_TOWNS: 'support_overview_active_player_supports_towns', //troops outside overview
        //Represents all supports from all towns from active plater given to specific town
        ACTIVE_PLAYER_SUPPORTS_TOWN: 'support_overview_active_player_supports_town' // new agora
    };

    var SupportOverviewController = GameControllers.TabController.extend({
        //Active mode for this instance
        mode: null,

        main_view: null,

        //Its needed to run this code also in old windows
        old_window: false,

        renderPage: function(data) {
            if (data.old_window) {
                this.old_window = true;
            }

            if (this.getArgumentMode()) {
                this.setMode(this.getArgumentMode());
            }

            this.models = data.models;
            this.collections = data.collections;
            this.templates = data.templates;
            this.l10n = DM.getl10n('place', 'support_overview');

            //Throw an error to let know that something went wrong
            if (!this.getSelectedTownId()) {
                throw "To open SupportOverview you need to specify town_id, for example: WF.open('place', {args: {town_id: 154}});";
            }

            //Change window title
            if (this.window_model) {
                this.window_model.setTitle(this.l10n.title + ' - Agora (' + this.getModel('constrained_town').getTownName() + ')');
            }

            //Initialize main view
            this.main_view = new GameViews.SupportOverviewMainView({
                el: this.$el,
                controller: this
            });

            return this;
        },

        /**
         * Returns collection with supports inside (its different for different
         * modes @see top of the file)
         *
         * @return {GameCollections.Units}
         */
        getSupportsCollection: function() {
            return this.getCollection(this.getCollectionName());
        },

        /**
         * Returns option which is preselected in the "sort by" dropdown
         *
         * @return {String}
         */
        getDefaultSortOption: function() {
            return 'origin_town_name';
        },

        /**
         * Returns options which are available in the "sort by" dropdown
         *
         * @see dropdown component specification for more details about its
         * structure
         *
         * @return {Array}  an array of objects
         */
        getSortDropdownOptions: function() {
            var l10n = this.l10n.options;

            return [{
                    value: 'origin_town_name',
                    name: l10n.origin_town_name
                },
                {
                    value: 'destination_town_name',
                    name: l10n.destination_town_name
                },
                {
                    value: 'player_name',
                    name: l10n.player_name
                },
                {
                    value: 'troop_count',
                    name: l10n.troop_count
                }
            ];
        },

        /**
         * Determinates if 'sort' options should be displayed
         *
         * @return {Boolean}
         */
        isSortOptionVisible: function() {
            //Display when user has curator and if it's overview
            return GameDataPremium.hasCurator() && this.getMode() === modes.ACTIVE_PLAYER_SUPPORTS_TOWNS;
        },

        /**
         * Returns id of the town which window has been opened with
         *
         * @return {Number}
         */
        getSelectedTownId: function() {
            return this.old_window ? Game.townId : this.getArgument('town_id');
        },

        /**
         * Returns information about which mode has been choosen during
         * opening the window
         *
         * @return {String}
         */
        getArgumentMode: function() {
            return this.old_window ? '' : this.getArgument('mode');
        },

        /**
         * Returns array of supports represented as GameModels.Units
         * additionaly in specific cases the total amount of units is addded
         *
         * @return {Array}
         */
        getSupports: function() {
            return this.getCollection(this.getCollectionName()).getSupports();
        },

        /**
         * Returns number of supports for the town (town is preselected when window is opened)
         *
         * @return {Number}
         */
        getSupportsCount: function() {
            return this.getSupports().length;
        },

        /**
         * Returns GameModels.Units model which represents units in the town
         *
         * @return {GameModels.Units}
         */
        getUnitsInTown: function() {
            return this.getCollection(this.getCollectionName()).getUnitsInTown(this.getSelectedTownId());
        },

        /**
         * Returns key-value array with 'unit_id' as a key and calculated
         * total amount of units as a value which is sum of units in
         * the town (if player who opens the window is owner of the town) and
         * sum of all his supports for this town
         *
         * @return {Object}
         */
        getTotalAmountOfUnits: function() {
            return this.getCollection(this.getCollectionName()).calculateTotalAmountOfUnits();
        },

        /**
         * Returns mode which represents way of displaying and organizing data
         *
         * @return {String}
         */
        getMode: function() {
            return this.mode;
        },

        /**
         * Sets current mode to the specified as an argument
         *
         * @param {String} name
         */
        setMode: function(name) {
            this.mode = name;
        },

        /**
         * Returns associative array of all possible modes for this overview
         *
         * @return {Object}
         */
        getModes: function() {
            return modes;
        },

        /**
         * Returns supports collection name based on the mode name
         *
         * @return {String}
         */
        getCollectionName: function() {
            //remove 'support_overview_'
            return this.mode.substr(17);
        },

        /**
         * Returns title which is displayed in the box title in the main view
         *
         * @return {String}
         */
        getBoxTitle: function() {
            var l10n = this.l10n.titles,
                mode = this.getMode();

            return mode === modes.ACTIVE_PLAYER_SUPPORTS_TOWNS || mode === modes.ACTIVE_TOWN_SUPPORTS_TOWNS ? l10n.troops_outside :
                (mode === modes.SUPPORT_FOR_ACTIVE_TOWN ? l10n.defensive_troops : l10n.own_troops_in_this_city);
        },

        /**
         * Sends back units from specific support
         *
         * @param {GameModels.Units}
         */
        sendBack: function(support_model) {
            ConfirmationWindowFactory.openConfirmationReturnAllUnitsFromTown(support_model.sendBack.bind(support_model));
        },

        /**
         * Sends back part or all of units to the origin town
         *
         * @param {GameModels.Units} support_model
         * @param {String} sub_context               sub context from the current window which keeps spinners with data
         *
         */
        sendBackPart: function(support_model, sub_context) {
            var units_to_send = {},
                spinner, spinners = this.searchInSubGroupFor(sub_context, "spinner_"),
                i, l = spinners.length,
                count;

            //Check which units user want to send back
            for (i = 0; i < l; i++) {
                spinner = spinners[i];
                count = spinner.getValue();

                if (count > 0) {
                    units_to_send[spinner.getDetails()] = count;
                }
            }

            support_model.sendBackPart(units_to_send);
        },

        returnAllUnits: function() {
            ConfirmationWindowFactory.openConfirmationReturnAllUnits(this.onConfirmReturnAllUnits.bind(this));
        },

        onConfirmReturnAllUnits: function() {
            GrepoApiHelper.execute('Units', 'sendBackAllUnitsByTown', {
                town_id: this.getSelectedTownId()
            }, function(data) {
                this.closeWindow();
            }.bind(this));
        },

        destroy: function() {
            this.getCollection(this.getCollectionName()).off(null, null, this);

            if (this.main_view) {
                this.main_view.destroy();
                this.main_view = null;
            }
        }
    });

    window.GameControllers.SupportOverviewController = SupportOverviewController;
}());