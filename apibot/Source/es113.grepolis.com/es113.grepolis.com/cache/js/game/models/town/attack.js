define('models/town/attack', function() {
    'use strict';

    var GrepolisModel = require_legacy('GrepolisModel');
    var Attack = GrepolisModel.extend({
        urlRoot: 'Attack',

        getPreviousIncoming: function() {
            return this.previous('incoming') || 0;
        }
    });

    GrepolisModel.addAttributeReader(Attack.prototype,
        'id',
        'town_id',
        'incoming'
    );

    window.GameModels.Attack = Attack;
    return Attack;
});