(function() {
    "use strict";

    var BaseCollection = window.Backbone.Collection;

    /**
     * This class is used to wrap Backbone.Collections. It enhances them with filtering functionalities to drop models
     * that are added automaticcly, if they doesn't contain a key with a spefic value.
     *
     * @example <pre>
     *  var FilteredUnits = Units.extend(new FragmentCollectionPrototype(Units));
     *  var units = new FilteredUnits([], {segmentation_key: 'town_id', segmentation_value: 5});
     *  units.add(unit_in_town_5);                 // the collection will now contain the model
     *  units.add(unit_in_town_66);                // the collection will NOT contain that model afterwards </pre>
     *
     * @constructor
     * @class FragmentCollectionPrototype
     * @param {Function} parent_constructor
     */
    var FragmentCollectionPrototype = function(parent_constructor) {
        this.parent_constructor = parent_constructor;
        // hack for backbone.extend, to find the constructor when initialising the collection
        this.constructor = function(models, options) {
            if (!options || !(options.segmentation_value || options.segmentation_keys)) {
                throw "There has to be 'segmentation_value' or 'segmentation_keys' options";
            }

            this.segmentation_value = options.segmentation_value;
            this.segmentation_keys = options.segmentation_keys;

            this.parent_constructor.call(this, models, options);
        };
    };

    /**
     * see Backbone.Collection.add
     *
     * @method add
     */
    FragmentCollectionPrototype.prototype.add = function(model_models_or_collection, options) {
        if (model_models_or_collection instanceof BaseCollection) {
            model_models_or_collection.each(function(model) {
                this.add(model, options);
            }.bind(this));
            return;
        } else if (us.isArray(model_models_or_collection)) {
            us.each(model_models_or_collection, function(model) {
                this.add(model, options);
            }.bind(this));
            return;
        } else if (model_models_or_collection) {
            var segmentation_key_idx, segmentation_keys_length = this.segmentation_keys.length,
                segmentation_key,
                model = model_models_or_collection,
                segmentation_value;

            for (segmentation_key_idx = 0; segmentation_key_idx < segmentation_keys_length; ++segmentation_key_idx) {
                segmentation_key = this.segmentation_keys[segmentation_key_idx];

                segmentation_value = typeof model.get === 'function' ? model.get(segmentation_key) : model[segmentation_key];

                if (segmentation_value === this.segmentation_value) {
                    this.parent_constructor.prototype.add.call(this, model, options);
                }
            }
        }
    };

    /**
     * We can dynamically change the value the fragment is for, for example for the TownAgnosticCollection.
     * This will NOT remove the models from this collection that do not have the correct value, YOU have to do that!!!
     *
     * @method changeSegmentationValue
     * @param {Object} new_value
     */
    FragmentCollectionPrototype.prototype.changeSegmentationValue = function(new_value) {
        this.segmentation_value = new_value;
    };

    window.FragmentCollectionPrototype = FragmentCollectionPrototype;
}());