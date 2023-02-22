(function() {
    'use strict';

    var Quickbar = function() {};
    var GrepolisModel = require_legacy('GrepolisModel');
    var GameModels = window.GameModels;

    Quickbar.urlRoot = 'Quickbar';

    Quickbar.getOptions = function() {
        var options = this.get('options'),
            i, l = options.length,
            wrapped = [];

        for (i = 0; i < l; i++) {
            wrapped.push(new GameModels.QuickbarOption(options[i]));
        }

        return wrapped;
    };

    Quickbar.getOptionsObj = function() {
        var obj = {};
        this.get('options').forEach(function(option, idx) {
            obj[option.item.id] = option.item;
        });
        return obj;
    };

    Quickbar.getOptionsInRange = function(start, stop) {
        var options = this.getOptions(),
            i, l = options.length,
            range = [];

        for (i = 0; i < l; i++) {
            if (i >= start && i <= stop) {
                range.push(options[i]);
            }
        }

        return range;
    };

    Quickbar.getOption = function(option_id) {
        var options = this.getOptions(),
            i, l = options.length;

        for (i = 0; i < l; i++) {
            if (options[i].getId() === option_id) {
                return options[i];
            }
        }

        return false;
    };

    window.GameModels.Quickbar = GrepolisModel.extend(Quickbar);
}());