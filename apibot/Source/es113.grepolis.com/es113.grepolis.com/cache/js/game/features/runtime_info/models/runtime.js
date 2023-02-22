define('features/runtime_info/models/runtime', function(require) {
    'use strict';

    var GrepolisModel = require_legacy('GrepolisModel');

    var Runtime = GrepolisModel.extend({
        urlRoot: 'RuntimeSimulator',

        onDistanceChange: function(obj, callback) {
            obj.listenTo(this, 'change:distance', callback);
        },
        getTargetTownId: function() {
            return this.get('id');
        },
        isAttackspot: function() {
            return this.getIsAttackspot();
        },
        reFetchTargetData: function() {
            this.reFetch(null, {
                'island_coordinates': {
                    x: this.getIslandX(),
                    y: this.getIslandY(),
                    spot: this.getNumberOnIsland()
                }
            });
        }
    });

    GrepolisModel.addAttributeReader(Runtime.prototype,
        'id',
        'distance',
        'island_x',
        'island_y',
        'name',
        'is_attackspot',
        'number_on_island',
        'town_link'
    );

    window.GameModels.Runtime = Runtime;

    return Runtime;
});