/*global window */

define('collections/hide/last_spy_reports', function(require) {
    'use strict';

    var Collection = window.GrepolisCollection;
    var ModelClass = require('models/hide/spy_report');

    var CollectionClass = Collection.extend({
        model: ModelClass,
        model_class: 'SpyReport'
    });

    CollectionClass.prototype.onNewSpyReport = function(obj, callback) {
        obj.listenTo(this, 'change', callback);
    };

    window.GameCollections.LastSpyReports = CollectionClass;
    return CollectionClass;
});