define('features/runtime_info/collections/runtime_infos', function(require) {
    'use strict';

    var Collection = require_legacy('GrepolisCollection');
    var Model = require('features/runtime_info/models/runtime');

    var Runtimes = Collection.extend({
        model: Model,
        model_class: 'Runtime'
    });

    window.GameCollections.Runtimes = Runtimes;
    return Runtimes;
});