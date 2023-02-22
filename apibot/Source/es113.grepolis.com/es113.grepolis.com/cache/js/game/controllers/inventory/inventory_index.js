/*global DM, GameEvents, ConfirmationWindowFactory, Backbone, BuyForGoldWindowFactory */

(function() {
    'use strict';

    var Controller = window.GameControllers.TabController;

    var EmptySlotModel = Backbone.Model.extend({
        defaults: {
            id: 0,
            type: 'empty'
        },

        getType: function() {
            return this.get('type');
        },

        getId: function() {
            return this.get('id');
        },

        getLevel: function() {
            return undefined;
        },

        getCount: function() {
            return 0;
        }
    });

    var GroupedSlotModel = function(inventory_item, count) {
        this.inventory_item = inventory_item;
        this.count = count;
    };

    GroupedSlotModel.prototype = {
        getType: function() {
            return this.inventory_item.getType();
        },
        getId: function() {
            return this.inventory_item.getId();
        },
        getLevel: function() {
            return this.inventory_item.getLevel();
        },
        utilize: function(cb) {
            return this.inventory_item.utilize(cb);
        },
        trash: function() {
            return this.inventory_item.trash();
        },
        getName: function() {
            return this.inventory_item.name();
        },

        getProperties: function() {
            return this.inventory_item.getProperties();
        },

        getCount: function() {
            return this.count;
        },
        increaseCount: function() {
            this.count += 1;
        },
        getRealItem: function() {
            return this.inventory_item;
        }
    };

    var InventoryController = Controller.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            Controller.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.l10n = {
                'body': DM.getl10n('inventory', 'body')
            };

            this.view = new window.GameViews.InventoryMainView({
                el: this.$el,
                controller: this
            });

            this.registerEventsListeners();
        },

        /**
         * Registers events listeners
         */
        registerEventsListeners: function() {
            var refreshItems = function() {
                this.hideLoading();
                this.view.rerenderSlots();
            }.bind(this);

            var refreshPremiumItems = function() {
                this.hideLoading();
                this.view.rerenderPremiumSlots();
            }.bind(this);

            this.observeEvent(GameEvents.window.inventory.use, function(e, data) {
                this.useItem(data.id, data.options.town.slot_type);
            }.bind(this));

            this.observeEvent(GameEvents.window.inventory.trash, function(e, data) {
                this.trashItem(data.id, data.options.town.slot_type);
            }.bind(this));

            //Basic slots
            this.getModel('inventory').onChange(this, refreshItems);
            this.getCollection('inventory_items').onCountChange(this, refreshItems);

            //Premium slots
            this.getCollection('premium_inventory_items').onAdd(this, refreshPremiumItems);
            this.getCollection('premium_inventory_items').onRemove(this, refreshPremiumItems);
        },

        /**
         *
         * @param {Number} model_id
         * @param {String} slot_type
         *
         * @return {GameModels.InventoryItem}
         */
        getItemModel: function(model_id, slot_type) {
            if (slot_type === 'regular') {
                return this.getItemModelByModelId(model_id);
            } else if (slot_type === 'premium') {
                return this.getPremiumItemModelByModelId(model_id);
            }
        },

        /**
         * Returns inventory item model depends on the given model id
         *
         * @param {Number} model_id
         * @return {GameModels.InventoryItem}
         */
        getItemModelByModelId: function(model_id) {
            return this.getCollection('inventory_items').getItemByModelId(model_id);
        },

        getPremiumItemModelByModelId: function(model_id) {
            return this.getCollection('premium_inventory_items').getItemByModelId(model_id);
        },

        /**
         * Returns inventory item model depends on the given index
         *
         * @param {Number} index
         * @return {GameModels.InventoryItem}
         */
        getItemModelByIndex: function(index) {
            return this.getCollection('inventory_items').getItem(index) || new EmptySlotModel({});
        },

        getPremiumItems: function() {
            return this.getCollection('premium_inventory_items').getItems();
        },

        getGroupedPremiumItems: function() {
            var MAX_GROUP_COUNT = 99;
            var items = this.getPremiumItems();

            //Group items
            var grouped = us.reduce(items, function(result, item) {
                var group_id = item.getGroupIdentifier();

                result[group_id] = result[group_id] || {
                    item: item,
                    count: 0
                };
                result[group_id].count += 1;

                return result;
            }, {});

            //Split
            var splitted = us.reduce(grouped, function(result, group) {
                for (var i = 0; i < Math.ceil(group.count / MAX_GROUP_COUNT); i++) {
                    var cnt = Math.min(MAX_GROUP_COUNT, (group.count - i * MAX_GROUP_COUNT));
                    result.push(new GroupedSlotModel(group.item, cnt));
                }

                return result;
            }, []);

            return splitted;
        },

        /**
         * Handles situation when user click on the button to buy additional slot
         *
         * @param {jQuery Object} _btn
         * @param {Number} slot_number
         */
        onUnlockSlotButtonClick: function(_btn, slot_number) {
            var inventory_model = this.getModel('inventory');

            BuyForGoldWindowFactory.openBuyInventorySlotWindow(_btn, slot_number, function() {
                inventory_model.buyAdditionalSlot();
            });
        },

        /**
         * Returns total amount of slots
         *
         * @return {Number}
         */
        getTotalAmountOfSlots: function() {
            return this.getModel('inventory').getTotalAmountOfSlots();
        },

        /**
         * Returns amount of opened slots
         *
         * @return {Number}
         */
        getAmountOfAccessibleSlots: function() {
            return this.getModel('inventory').getAmountOfAccessibleSlots();
        },

        /**
         * Uses item on the current city
         *
         * @param {Number} model_id   item model id
         * @param {String} slot_type  'premium' or 'regular'
         */
        useItem: function(model_id, slot_type) {
            var item = this.getItemModel(model_id, slot_type),
                ResourceRewardDataFactory = require('factories/resource_reward_data_factory');

            this.showLoading();
            var hideLoading = this.hideLoading.bind(this),
                reward_data = ResourceRewardDataFactory.fromInventoryItemModel(item);

            ConfirmationWindowFactory.openConfirmationWastedResources(function() {
                item.utilize(hideLoading);
            }, hideLoading, reward_data);
        },

        /**
         * Removes item from the inventory
         *
         * @param {Number} model_id
         */
        trashItem: function(model_id, slot_type) {
            var item = this.getItemModel(model_id, slot_type);

            ConfirmationWindowFactory.openConfirmationRemoveItemFromInventory(function() {
                item.trash();
            }, null, item.getName());
        },

        destroy: function() {

        }
    });

    window.GameControllers.InventoryController = InventoryController;
}());