/*globals GameDataInstantBuy, DM */

(function() {
    'use strict';

    function getBuildingQueueStrategyArguments(models, collections) {
        return {
            l10n: {
                construction_queue: DM.getl10n('construction_queue')
            },
            collections: {
                tutorial_quests: collections.tutorial_quests,
                building_orders: collections.building_orders,
                towns: collections.towns
            },
            models: {
                player_ledger: models.player_ledger
            }
        };
    }

    var ConstructionQueueStrategyFactory = {
        getBuildingQueueInstantBuyStrategyInstance: function(models, collections) {
            var Strategy = require('strategy/buildings_queue_instant_buy');

            return new Strategy(getBuildingQueueStrategyArguments(models, collections));
        },

        getBuildingQueueBuildTimeReductionStrategyInstance: function(models, collections) {
            var Strategy = require('strategy/buildings_queue_default');

            return new Strategy(getBuildingQueueStrategyArguments(models, collections));
        },

        getBuildingQueueStrategyInstance: function(models, collections) {
            if (GameDataInstantBuy.isEnabled()) {
                return this.getBuildingQueueInstantBuyStrategyInstance(models, collections);
            } else {
                return this.getBuildingQueueBuildTimeReductionStrategyInstance(models, collections);
            }
        },

        getUnitQueueStrategyInstance: function(town_id, building_type, models, collections) {
            var Strategy;

            if (GameDataInstantBuy.isEnabled()) {
                Strategy = require('strategy/units_queue_instant_buy');
            } else {
                Strategy = require('strategy/units_queue_default');
            }

            return new Strategy({
                l10n: {
                    construction_queue: DM.getl10n('construction_queue')
                },
                collections: {
                    feature_blocks: collections.feature_blocks,
                    remaining_unit_orders: collections.unit_orders,
                    towns: collections.towns
                },
                models: {
                    player_ledger: models.player_ledger
                },
                building_type: building_type,
                town_id: town_id
            });
        },

        getResearchQueueStrategyInstance: function(models, collections) {
            var Strategy;

            if (GameDataInstantBuy.isEnabled()) {
                Strategy = require('strategy/researches_queue_instant_buy');
            } else {
                Strategy = require('strategy/researches_queue_default');
            }

            return new Strategy({
                l10n: {
                    construction_queue: DM.getl10n('construction_queue')
                },
                models: {
                    player_ledger: models.player_ledger
                },
                collections: {
                    research_orders: collections.research_orders,
                    towns: collections.towns
                }
            });
        }
    };

    window.ConstructionQueueStrategyFactory = ConstructionQueueStrategyFactory;
}());