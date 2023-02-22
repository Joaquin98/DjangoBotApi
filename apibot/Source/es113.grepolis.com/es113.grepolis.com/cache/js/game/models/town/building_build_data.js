define('models/town/building_build_data', function() {
    'use strict';

    var BuildingBuildData = function() {};
    var GrepolisModel = require_legacy('GrepolisModel');

    BuildingBuildData.urlRoot = 'BuildingBuildData';

    GrepolisModel.addAttributeReader(BuildingBuildData,
        'id',
        'is_building_order_queue_full',
        'building_data',
        'player_id',
        'town_id'
    );

    BuildingBuildData.forceUpdate = function(callback) {
        this.execute('forceUpdate', null, callback);
    };

    window.GameModels.BuildingBuildData = GrepolisModel.extend(BuildingBuildData);

    return window.GameModels.BuildingBuildData;
});