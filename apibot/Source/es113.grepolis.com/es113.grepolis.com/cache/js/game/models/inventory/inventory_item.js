/* global GrepolisModel, GameData, us, GameDataPowers */

(function() {
    'use strict';

    var InventoryItem = function() {}; // never use this, because it will be overwritten

    InventoryItem.urlRoot = 'InventoryItem';

    InventoryItem.initialize = function(attributes) {
        this.staticData = GameData.inventoryItems[attributes.type];
    };

    InventoryItem.utilize = function(error_callback) {
        this.execute(
            'utilize', {
                inventory_item_id: this.id
            }, {
                success: function(data) {
                    //console.log('successfully utilized:', data);
                },
                error: function(data) {
                    if (typeof error_callback === 'function') {
                        error_callback();
                    }
                    //console.log('error during utilization:', data);
                }
            }
        );
    };

    InventoryItem.trash = function() {
        this.execute('trash', {
            inventory_item_id: this.id
        }, {
            success: function(data) {
                //console.log('successfully trashed:', data);
            },
            error: function(data) {
                //console.log('error during trashing:', data);
            }
        });
    };

    InventoryItem.getName = function() {
        return this.staticData.name || this.getTooltipData().i_name;
    };

    /**
     * Returns an awards numeric level or null if none
     * @return {int|null}
     */
    InventoryItem.getLevel = function() {
        var configuration = this.getProperties().configuration;

        return configuration ? configuration.level : null;
    };

    InventoryItem.getType = function() {
        return this.get('type');
    };

    InventoryItem.getProperties = function() {
        return this.get('properties');
    };

    InventoryItem.getId = function() {
        return this.get('id');
    };

    InventoryItem.getCount = function() {
        return this.get('count');
    };

    InventoryItem.getPowerId = function() {
        return this.getProperties().power_id;
    };

    InventoryItem.getTooltipData = function() {
        var that = this,
            tooltip_data,
            power,
            type = this.getType();

        if (type === 'power_reward_effect_inventory_item') {
            // Quest power/effect rewards
            power = us.find(GameData.powers, function(item) {
                return (item.id === that.getProperties().power_id);
            });

            // Level is null here, because inventory items already have modified configuration
            tooltip_data = GameDataPowers.getTooltipPowerData(power, this.getProperties().configuration, null);
        } else {
            power = us.find(GameData.powers, function(item) {
                return (item.name === GameData.inventoryItems[type].name);
            });

            tooltip_data = {
                i_name: power ? power.name : _(GameData.inventoryItems[type].name),
                i_descr: power ? power.description : _(GameData.inventoryItems[type].description),
                i_effect: power ? power.effect : null,
                i_favor: power ? power.favor : null
            };
        }

        // Inventory
        return tooltip_data;
    };

    window.GameModels.InventoryItem = GrepolisModel.extend(InventoryItem);
}());