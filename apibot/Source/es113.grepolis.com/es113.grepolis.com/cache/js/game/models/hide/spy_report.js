/*global window */

define('models/hide/spy_report', function(require) {
    'use strict';

    var GrepolisModel = window.GrepolisModel;
    var ModelClass = GrepolisModel.extend({
        urlRoot: 'SpyReport'
    });

    window.GameModels.SpyReport = ModelClass;
    return ModelClass;
});