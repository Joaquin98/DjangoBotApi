(function() {
    "use strict";

    var GrepolisCollection = window.GrepolisCollection;
    var Wonder = window.GameModels.Wonder;

    var FinishedWonders = function() {}; // never use this, becasue it will be overwritten

    FinishedWonders.model = Wonder;
    FinishedWonders.model_class = 'Wonder';

    FinishedWonders.initialize = function(models, options) {
        this.alliance_id = options.alliance_id;
    };

    /**
     * override Backbone.Collection.add
     * only models belonging to the set alliance_id will be accepted
     *
     * @param model
     * @param options
     *
     * @return void
     */
    FinishedWonders.add = function(model) {
        var alliance_id = typeof model.get === 'function' ? model.get('alliance_id') : model.alliance_id,
            finished = typeof model.get === 'function' ? model.get('finished') : model.finished;

        if (alliance_id === this.alliance_id && finished) {
            // single model added
            GrepolisCollection.prototype.add.apply(this, Array.prototype.slice.call(arguments));
        } else if (alliance_id === null || alliance_id === undefined) {
            // model collection
            GrepolisCollection.prototype.add.apply(this, Array.prototype.slice.call(arguments));
        }
    };

    FinishedWonders.hasWonder = function(wonder_id) {
        var wonders = this.models,
            i, l = wonders.length;

        for (i = 0; i < l; i++) {
            if (wonders[i].getType() === wonder_id) {
                return true;
            }
        }

        return false;
    };

    window.GameCollections.FinishedWonders = GrepolisCollection.extend(FinishedWonders);
}());