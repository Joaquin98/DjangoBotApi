define('models/casted_alliance_powers', function() {
    'use strict';

    var GrepolisModel = require_legacy('GrepolisModel');
    var CastedAlliancePowers = GrepolisModel.extend({
        urlRoot: 'CastedAlliancePowers'
    });

    GrepolisModel.addAttributeReader(CastedAlliancePowers.prototype,
        'id',
        'alliance_id',
        'power_id',
        'configuration',
        'origin'
    );

    window.GameModels.CastedAlliancePowers = CastedAlliancePowers;
    return CastedAlliancePowers;
});