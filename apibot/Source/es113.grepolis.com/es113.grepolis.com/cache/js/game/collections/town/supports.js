define('collections/town/supports',
    function(require) {

        'use strict';

        var Collection = require_legacy('GrepolisCollection');
        var Model = require('models/town/support');

        /**
         * key: town_id -> value: amount of incoming supports
         */

        var Supports = Collection.extend({
            model: Model,
            model_class: 'Support',

            getIncomingSupportsForTown: function(id) {
                return this.findWhere({
                    town_id: id
                });
            },

            onEntriesChange: function(obj, callback) {
                obj.listenTo(this, 'add remove change', callback);
            }
        });


        window.GameCollections.Supports = Supports;
        return Supports;
    });