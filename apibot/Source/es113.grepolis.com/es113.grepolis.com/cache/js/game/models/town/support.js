/* global MM, Timestamp */

define('models/town/support', function() {
    'use strict';

    var GrepolisModel = require_legacy('GrepolisModel');
    var Support = GrepolisModel.extend({
        urlRoot: 'Support'
    });

    GrepolisModel.addAttributeReader(Support.prototype,
        'id',
        'town_id',
        'incoming'
    );

    window.GameModels.Support = Support;
    return Support;
});