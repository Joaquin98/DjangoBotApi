define('models/common/town_id_list', function() {
    'use strict';

    var GrepolisModel = require_legacy('GrepolisModel');

    var TownIdList = GrepolisModel.extend({
        urlRoot: 'TownIdList'
    });

    GrepolisModel.addAttributeReader(TownIdList.prototype,
        'id',
        'town_ids'
    );

    window.GameModels.TownIdList = TownIdList;

    return TownIdList;
});