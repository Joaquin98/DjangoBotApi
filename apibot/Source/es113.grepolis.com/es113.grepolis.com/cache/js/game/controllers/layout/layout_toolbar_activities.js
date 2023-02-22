/*global us, GameControllers, GameViews, MM */

(function() {
    'use strict';

    var CommandsHelper = require('helpers/commands');
    var GameEvents = require('data/events');
    var Features = require('data/features');
    var OlympusHelper = require('helpers/olympus');

    var LayoutToolbarActivitiesController = GameControllers.BaseController.extend({
        //Keeps instance of the unit orders collection (depends on the current town id)
        unit_orders_collection: null,
        //Keeps instance of the trades collection (depends on the current town id)
        trades_collection: null,
        movements_spys: null,
        movements_units: null,
        movements_revolts_attacker: null,
        movements_revolts_defender: null,
        movements_colonizations: null,
        movements_conquerors: null,
        temple_commands: null,
        //Keeps instance of the main view of the toolbar activities
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
            this.is_olympus_endgame = Features.isOlympusEndgameActive();

            this.initializeCollections();
            this.bindEventsToPremiumFeaturesModel();
        },

        /**
         * Returns information whether user has curator or not
         */
        hasCurator: function() {
            return this.getModel('premium_features').hasCurator();
        },

        registerEventListeners: function() {
            //Bind Events
            this.bindEventsOnUnitOrdersCollection();
            this.bindEventsOnTradesCollection();
            this.unbindEventsOnMovementsCollections();
            this.bindEventsOnMovementsCollections();

            if (this.isOlympusEndgame()) {
                this.bindEventsOnTempleCommandsCollection();
            }

            this.stopObservingEvent(GameEvents.town.commands.bulk_update);
            this.observeEvent(GameEvents.town.commands.bulk_update, function() {
                this.changeCommandMovementIndicatorComponent();
                this.changeAttackIndicatorComponent();
            }.bind(this));
            this.observeEvent(GameEvents.attack.incoming, function(event, data) {
                this.changeCommandMovementIndicatorComponent();
                this.changeAttackIndicatorComponent(data.town_id, data.count);
            }.bind(this));
        },

        /**
         * Updates references to the collections when town is switched
         * and binds event listeners on them
         */
        initializeCollections: function() {
            this.unit_orders_collection = this.getCollection('unit_orders');
            this.trades_collection = this.getCollection('trades');
            this.movements_spys = this.getCollection('movements_spys');
            this.movements_units = this.getCollection('movements_units');
            this.movements_revolts_attacker = this.getCollection('movements_revolts_attacker');
            this.movements_revolts_defender = this.getCollection('movements_revolts_defender');
            this.movements_colonizations = this.getCollection('movements_colonizations');
            this.movements_conquerors = this.getCollection('movements_conquerors');

            if (this.isOlympusEndgame()) {
                this.temple_commands = this.getCollection('temple_commands');
            }

            this.premium_features_model = this.getModel('premium_features');

            this.registerEventListeners();
        },

        renderPage: function() {
            this.view = new GameViews.LayoutToolbarActivities({
                el: this.$el,
                controller: this
            });

            return this;
        },

        isOlympusEndgame: function() {
            return this.is_olympus_endgame;
        },

        getActivityTypes: function() {
            var activities = ['attack_indicator', 'recruits', 'commands', 'trades'];

            if (this.isOlympusEndgame()) {
                activities.push('temple_commands');
            }

            return activities;
        },

        /**
         * Returns array of unit order models
         *
         * @return {Array}
         */
        getUnitsOrders: function() {
            var collection = this.getUnitOrdersCollection(),
                orders = collection.getAllOrders();

            return orders;
        },

        /**
         * Returns count of unit orders
         *
         * @return {Number}
         */
        getUnitOrdersCount: function() {
            var collection = this.getUnitOrdersCollection(),
                count = collection.getAllOrdersCount();

            return count;
        },

        /**
         * Returns trades which are running for the current town
         *
         * @return {Array}
         */
        getTrades: function() {
            var collection = this.getTradesCollection();

            return collection.getTrades();
        },

        /**
         * Returns commands
         *
         * @return {Array}
         */
        getCommands: function() {
            var mdl_commands = this.getCommandsModel();

            return mdl_commands.getCommands();
        },

        /**
         * Returns number of trades which are running right now for the current town
         *
         * @return {Number}
         */
        getTradesCount: function() {
            var collection = this.getTradesCollection();

            return collection.getTradesCount();
        },

        /**
         * Returns number of commands for the current town
         *
         * @return {Number}
         */
        getCommandsCount: function() {
            var commands_count = this.movements_spys.length;
            commands_count += this.movements_units.length;
            commands_count += this.movements_colonizations.length;
            commands_count += this.movements_revolts_attacker.length;
            commands_count += this.movements_revolts_defender.length;
            commands_count += this.movements_conquerors.length;

            return commands_count;
        },

        getTempleCommands: function() {
            return this.temple_commands.reduce(function(result, command) {
                var temple_id = command.getTempleId(),
                    temple_link = OlympusHelper.generateTempleLinkByTempleId(temple_id).outerHTML,
                    attacks_count = command.getCountAttacks(),
                    supports_count = command.getCountSupports(),
                    revolts_arising_count = command.getCountRevoltsArising(),
                    revolts_active_count = command.getCountRevoltsActive();

                if ((attacks_count + supports_count + revolts_arising_count + revolts_active_count) > 0) {
                    result.push({
                        temple_id: temple_id,
                        attacks_count: attacks_count,
                        supports_count: supports_count,
                        revolts_arising: revolts_arising_count,
                        revolts_active: revolts_active_count,
                        temple_link: temple_link
                    });
                }

                return result;
            }, []);
        },

        /**
         * Returns collection which keeps unit order models
         *
         * @return {GameCollections.RemainingUnitOrders}
         */
        getUnitOrdersCollection: function() {
            return this.unit_orders_collection;
        },

        /**
         * Returns collection which keeps trades models
         *
         * @return {GameCollections.Trades}
         */
        getTradesCollection: function() {
            return this.trades_collection;
        },

        /**
         * Returns model which keeps information about commands for the
         * currently selected town
         *
         * @return {GameModels.CommandsMenuBubble}
         */
        getCommandsModel: function() {
            return this.commands_model;
        },

        getPremiumFeaturesModel: function() {
            return this.premium_features_model;
        },

        /**
         * Returns unit order depends on the specified id
         *
         * @return {GameModels.UnitOrder}
         */
        getUnitOrderById: function(order_id) {
            var collection = this.getUnitOrdersCollection();

            return collection.getOrderById(order_id);
        },

        /**
         * Returns trade model depends on the specified id
         *
         * @return {GameModels.Trade}
         */
        getTradeById: function(trade_id) {
            var collection = this.getTradesCollection();

            return collection.getTradeById(trade_id);
        },

        /**
         * Returns time left during which player is able to cancel order
         * for the first cancelable order
         *
         * @return {Number}
         */
        getFirstTimeout: function() {
            var trade, trades = this.getTrades(),
                i, l = trades.length,
                timeouts = [];

            for (i = 0; i < l; i++) {
                trade = trades[i];

                if (trade.getCancelTimeLeft() > 0 || trade.getTimeLeft() > 0) {
                    timeouts.push(
                        Math.min(trade.getCancelTimeLeft(), trade.getTimeLeft())
                    );
                }
            }

            return timeouts.length === 0 ? -1 : us.min(timeouts);
        },

        /**
         * Returns caption for incoming attack count indicator
         *
         * @return {String}
         */
        getIncomingAttacksCommandsCountCaption: function(only_for_current_town, changed_town_id, changed_count) {
            var attacks_count = only_for_current_town ?
                this.movements_units.getIncomingAttacksCount() + this.movements_revolts_defender.length :
                CommandsHelper.getTotalCountOfIncomingAttacks(changed_town_id, changed_count);

            return attacks_count > 0 ? '' + attacks_count : '';
        },

        isPlayerInAlliance: function() {
            return MM.getModelByNameAndPlayerId('Player').getAllianceId() !== null;
        },

        _getLayoutMainController: function() {
            return this.getController('layout_main');
        },

        /**
         * get an instance of the correct recruiting Controllers
         * for type (docks, barracks)
         * This instance is bound to the given DOM Element and has a
         * context of 'toolbar_activities_recruit'
         *
         * @private
         * @param {Object} $el
         * @param {string} type
         * @returns {GameController}
         */
        _getRecruitingQueueController: function($el, type) {
            var main_controller = this._getLayoutMainController(),
                context = {
                    main: 'toolbar_activities_recruit',
                    sub: type
                };

            return main_controller.getUnitsQueueControllerObject('right-top', $el, type, context);
        },

        /**
         * return the 'barrack' queue controller (new instance), bind to $el
         *
         * @param {Object} $el
         * @return {GameController}
         */
        getBarracksRecruitingQueueController: function($el) {
            return this._getRecruitingQueueController($el, 'barracks');
        },

        /**
         * return the 'docks' queue controller (new instance), bind to $el
         *
         * @param {Object} $el
         * @return {GameController}
         */
        getDocksRecruitingQueueController: function($el) {
            return this._getRecruitingQueueController($el, 'docks');
        },

        /**
         * return the length of given queue
         *
         * @param {string} type
         * @return {number}
         */
        getRecruitingQueueLength: function(type) {
            var collection = this.getUnitOrdersCollection();

            return collection.getCount(type);
        },

        /**
         * destroy a controller, makes sure that all its components
         * are unregistered
         *
         * @param {GameController} controller
         */
        destroyQueueController: function(controller) {
            controller._destroy();
        },

        /**
         * Binds events which listens on the changes on the trades collection
         */
        bindEventsOnTradesCollection: function() {
            var _self = this,
                collection = this.getTradesCollection(),
                //Function which updates list of options in the dropdown
                onCollectionChange = function() {
                    var wgt_trades = _self.getComponent('wgt_trades');

                    wgt_trades.setOptions(_self.getTrades());
                    wgt_trades.setCaption(_self.getTradesCount());
                    wgt_trades.updateDropDownListSize();
                };

            collection.on('add remove change reset', onCollectionChange, this);
        },

        /**
         * Binds events which listens on the changes on the unit orders collection
         */
        bindEventsOnUnitOrdersCollection: function() {
            var _self = this,
                collection = this.getUnitOrdersCollection(),
                //Function which updates list of options in the dropdown
                onCollectionChange = function() {
                    var wgt_recruits = _self.getComponent('wgt_recruits');

                    wgt_recruits.setOptions(_self.getUnitsOrders());
                    wgt_recruits.setCaption(_self.getUnitOrdersCount());
                    wgt_recruits.updateDropDownListSize();
                };

            collection.on('add remove change reset', onCollectionChange, this);
        },

        changeAttackIndicatorComponent: function(changed_town_id, changed_count) {
            var attack_indicator = this.getComponent('wgt_attacks'),
                caption = this.getIncomingAttacksCommandsCountCaption(false, changed_town_id, changed_count);

            attack_indicator.setState(caption > 0);
            attack_indicator.setCaption(caption);
        },


        changeCommandMovementIndicatorComponent: function() {
            var component = this.getComponent('btn_commands');
            component.setCaption(this.getCommandsCount());
            component.setState(this.getIncomingAttacksCommandsCountCaption(true) > 0);
        },

        bindEventsOnMovementsCollections: function() {

            var town_agnostic_movements_units = MM.getFirstTownAgnosticCollectionByName('MovementsUnits');

            town_agnostic_movements_units.unregisterFragmentEventSubscriber(this);
            town_agnostic_movements_units.registerFragmentEventSubscriber(this);

            CommandsHelper.onAddMovementsUnitsInAllTownsChange(this, this.changeAttackIndicatorComponent.bind(this));
            CommandsHelper.onRemoveMovementsUnitsInAllTownsChange(this, this.changeAttackIndicatorComponent.bind(this));


            this.movements_units.onAdd(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_units.onRemove(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_colonizations.onAdd(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_colonizations.onRemove(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_spys.onAdd(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_spys.onRemove(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_revolts_attacker.onAdd(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_revolts_attacker.onRemove(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_revolts_defender.onAdd(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_revolts_defender.onRemove(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_conquerors.onAdd(this, this.changeCommandMovementIndicatorComponent.bind(this));
            this.movements_conquerors.onRemove(this, this.changeCommandMovementIndicatorComponent.bind(this));

        },
        /**
         * Binds events to update some stuff when user buys curator or
         * if it expires
         */
        bindEventsToPremiumFeaturesModel: function() {
            var _self = this,
                mdl_premium_features = this.getModel('premium_features');

            mdl_premium_features.on('change', function(model) {
                _self.getComponent('wgt_recruits').setState(model.hasCurator());
                _self.getComponent('wgt_trades').setState(model.hasCurator());
            }, this);
        },

        updateTempleCommandsActivityCounter: function(temple_commands) {
            var has_attack = temple_commands.some(function(command) {
                return command.attacks_count > 0;
            });

            this.$el.find('.activity.temple_commands').toggleClass('has_attack', has_attack);
        },

        updateTempleCommandsActivity: function() {
            var temple_commands = this.getTempleCommands(),
                component = this.getComponent('wgt_temple_commands');

            component.setOptions(temple_commands);
            component.setCaption(temple_commands.length);
            this.updateTempleCommandsActivityCounter(temple_commands);
        },

        bindEventsOnTempleCommandsCollection: function() {
            this.temple_commands.onAddRemove(this, this.updateTempleCommandsActivity.bind(this));
            this.temple_commands.onCountAttacksChange(this, this.updateTempleCommandsActivity.bind(this));
            this.temple_commands.onCountSupportsChange(this, this.updateTempleCommandsActivity.bind(this));
            this.temple_commands.onCountRevoltsArisingChange(this, this.updateTempleCommandsActivity.bind(this));
            this.temple_commands.onCountRevoltsActiveChange(this, this.updateTempleCommandsActivity.bind(this));
        },

        /**
         * Removes all events binded to the premium features model
         */
        unbindEventsFromPremiumFeaturesModel: function() {
            //@todo try to use listenTo()
            this.getModel('premium_features').off(null, null, this);
        },

        unbindEventsOnMovementsCollections: function() {
            this.stopListening(this.movements_colonizations);
            this.stopListening(this.movements_revolts_attacker);
            this.stopListening(this.movements_revolts_defender);
            this.stopListening(this.movements_spys);
            this.stopListening(this.movements_units);
            this.stopListening(this.movements_conquerors);
        },

        /**
         * Unbinds all events from the trades collection
         */
        unbindEventsFromTradesCollection: function() {
            var collection = this.getTradesCollection();
            //@todo try to use listenTo()
            collection.off(null, null, this);
        },

        /**
         * Unbinds all events from the unit orders collection
         */
        unbindEventsFromUnitOrdersCollection: function() {
            var collection = this.getUnitOrdersCollection();
            //@todo try to use listenTo()
            collection.off(null, null, this);
        },

        destroy: function() {
            this.unbindEventsFromUnitOrdersCollection();
            this.unbindEventsFromTradesCollection();
            this.unbindEventsOnMovementsCollections();
            this.unbindEventsFromPremiumFeaturesModel();
        }
    });

    window.GameControllers.LayoutToolbarActivitiesController = LayoutToolbarActivitiesController;
}());