define('collections/town/attacks', function(require) {

    'use strict';

    var Collection = require_legacy('GrepolisCollection');
    var Model = require('models/town/attack');

    var Attacks = Collection.extend({
        model: Model,
        model_class: 'Attack',

        getIncomingAttacksForTown: function(id) {
            return this.findWhere({
                town_id: id
            });
        },

        onEntriesChange: function(obj, callback) {
            obj.listenTo(this, 'add remove change', callback);
        },

        onIncomingAttackCountChange: function(obj, callback) {
            obj.listenTo(this, 'add remove change:incoming', callback);
        }
    });


    window.GameCollections.Attacks = Attacks;
    return Attacks;
});