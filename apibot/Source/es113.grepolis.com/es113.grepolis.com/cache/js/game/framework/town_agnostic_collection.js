/*global Game, GameEvents, us, MM, Logger */

(function() {
    'use strict';

    var BaseEvents = window.Backbone.Events;
    var BaseCollection = window.Backbone.Collection;
    var GrepolisCollection = window.GrepolisCollection;
    var BaseModel = window.Backbone.Model;
    var FragmentCollectionPrototype = window.FragmentCollectionPrototype;
    var COMMANDS = require('enums/commands');
    var CommandsHelper = require('helpers/commands');

    /**
     * Special Collection like class (does NOT extend Backbone.Collection) that handles collection that can be group by one of
     * the models keys.
     * It has the possibility to have a current fragment that always contains the models for the currently selected town.
     * In addition to normal backbone collections, this collections also knows the following options:
     *
     * @class TownAgnosticCollection
     * @constructor
     * @param {[Object|Backbone.Model]} models
     * @param {Object} options
     *   @param {String} options.segmentation_key The name of the property of the models stored in this collection used to segment them
     *   @param {[String]} options.segmentation_keys The same as options.segmentation_key, but can contain more then one, which is ORed then
     *   @param {String} options.model_class Used by the model manager to detect which kind of model a collection takes
     *   @param {Constructor} [options.fragment_constructor] Constructor of a collection which is used to represent the fragments.
     *   @param {Object} [options.creation_arguments] If this collections data was requested with arguments, they should be passed in here
     */
    function TownAgnosticCollection(models, options) {
        // the check is here for inheritance, which naturally is done with Child.prototype = new Parent();
        if (arguments.length) {
            if (options && options.segmentation_key) {
                this.segmentation_keys = [options.segmentation_key];
            } else if (options && options.segmentation_keys && options.segmentation_keys instanceof Array) {
                this.segmentation_keys = options.segmentation_keys;
            } else {
                throw 'A TownAgnosticCollection always needs a segmentation_key[s] option';
            }

            this.fragments = {};
            this.fragment_constructor = this._extractFragmentConstructor(options);

            //this.workingCopy = this._createFragment(parseInt(Game.townId, 10), true);
            this.workingCopy = this._createFragmentInstance(parseInt(Game.townId, 10), true);
            this.workingCopy.on('change', this._triggerChange, this);
            this.workingCopy.on('add', this.trigger.bind(this, 'add', this.workingCopy));
            this.workingCopy.on('remove', this.trigger.bind(this, 'remove', this.workingCopy));

            // if the model was created for a window that was called with arguments for the backend, those arguments are stored here for later
            if (options.creation_arguments) {
                this.creationArguments = options.creation_arguments;
            }

            if (options.model_class) {
                this.model_class = options.model_class;
            }

            this.add(models, options);
        }

        /**
         * List of instances which are interested in fragment events additional to working copy events
         */
        this.interested_in_fragment_events = [];

        $.Observer(GameEvents.town.town_switch).subscribe(this, this._onTownSwitch.bind(this));
    }

    /**
     * see GrepolisCollection.unregisterFromModelManager
     *
     * @method unregisterFromModelManager
     */
    TownAgnosticCollection.prototype.unregisterFromModelManager = function() {
        MM.removeCollection(this);
    };

    /**
     * get the fragment that contains all the models for the current town
     *
     * @used_from_outside
     *
     * @method getCurrentFragment
     * @return {Backbone.Collection}
     */
    TownAgnosticCollection.prototype.getCurrentFragment = function() {
        return this.workingCopy;
    };

    /**
     * Get a specific fragment collection
     *
     * @method getFragment
     * @param {Ambigous} segmentation_value The value for that the returned collection should have all models
     *
     * @return {Backbone.Collection}
     */
    TownAgnosticCollection.prototype.getFragment = function(segmentation_value) {
        var fragment = this.fragments[segmentation_value];

        if (!fragment) {
            fragment = this._createFragment(segmentation_value);
        }

        return fragment;
    };

    /**
     *
     * @param segmentation_value
     * @param {true|undefined} created_as_current_collection   determines whether the collection is created as a 'current collection'
     * @returns {fragment_constructor}
     * @private
     */
    TownAgnosticCollection.prototype._createFragmentInstance = function(segmentation_value, created_as_current_collection) {
        return new this.fragment_constructor([], {
            segmentation_keys: this.segmentation_keys,
            segmentation_value: segmentation_value,
            created_as_current_collection: created_as_current_collection
        });
    };

    /**
     * Create AND SET a new fragment collection for the given segmentation value.
     * Will overwrite already existing fragments for the same value
     *
     * @private
     * @method _createFragment
     * @param {Ambigous} segmentation_value
     * @return {Backbone.Collection}
     */
    TownAgnosticCollection.prototype._createFragment = function(segmentation_value, created_as_current_collection) {
        var fragment = this._createFragmentInstance(segmentation_value, created_as_current_collection);

        fragment.on('change', this._triggerChange, this);
        fragment.on('add', this.trigger.bind(this, 'add', fragment));
        fragment.on('remove', this.trigger.bind(this, 'remove', fragment));

        this.fragments[segmentation_value] = fragment;

        return fragment;
    };

    /**
     * callback function that is called during a townswitch to update the current collection
     *
     * @private
     * @method onTownSwitch
     */
    TownAgnosticCollection.prototype._onTownSwitch = function() {
        var townId = parseInt(Game.townId, 10),
            models = this.getFragment(townId).models;

        this.workingCopy.changeSegmentationValue(townId);
        this.workingCopy.reset();

        // since 'models' can be a quite large array, we add the models silent and trigger a
        // add event manually -> this should be okay for most views to update
        if (models.length > 0) {
            this.workingCopy.add(models, {
                silent: true
            });
            this.workingCopy.trigger('add', models[0], this.workingCopy, {});
        }
        //If collection implements functionality to have automatic fetches from the backend when order is finished (all construction orders collections for example)
        //Call this function to analyze the data once again after switch and 'maybe' remove timer because there are no orders for the current town
        if (typeof this.workingCopy.onChangeAutomaticFetchHandler === 'function') {
            this.workingCopy.onChangeAutomaticFetchHandler();
        }
    };


    /**
     * given a couple of types: BaseCollection, array of models or single model
     * unify them for add remove into array
     * @param {BaseCollection | array | GrepolisModel} varying
     * @returns {array} array of models
     */
    TownAgnosticCollection.prototype._arrayFromVaryingTypes = function(varying) {
        var models;

        if (varying instanceof BaseCollection) {
            models = varying.toArray();
        } else if (us.isArray(varying)) {
            models = varying;
        } else {
            models = [varying];
        }
        return models;
    };

    /**
     * see Backbone.Collection.add
     *
     * @method add
     */
    TownAgnosticCollection.prototype.add = function(models, options) {
        this._addModels(this._arrayFromVaryingTypes(models), options);
    };
    /**
     * see Backbone.Collection.remove
     *
     * @method remove
     */
    TownAgnosticCollection.prototype.remove = function(models, options) {
        this._removeModels(this._arrayFromVaryingTypes(models), options);
    };

    /**
     * Overridden from parent class, do also add the passed models to the current fragment
     *
     * @private
     * @method addModels
     *
     * @param {[Backbone.Model]} models The models to add. Unlike Backbone.Model it has to be an array of Backbone.Models!
     * @param {object} [options] The same as Backbone.Model.add
     */
    TownAgnosticCollection.prototype._addModels = function(models, options) {
        var fragment,
            segmentation_value;

        us.each(models, function(model) {
            if (!model) {
                Logger.get('town_agnostic_collection').log('addModel', model);
                return;
            }
            var segmentation_keys_length = this.segmentation_keys.length;
            var segmentation_key;
            for (var segmentation_key_idx = 0; segmentation_key_idx < segmentation_keys_length; ++segmentation_key_idx) {
                segmentation_key = this.segmentation_keys[segmentation_key_idx];

                segmentation_value = typeof model.get === 'function' ? model.get(segmentation_key) : model[segmentation_key];

                if (model.urlRoot === COMMANDS.UNITS && !CommandsHelper.isPlayersTown(segmentation_value)) {
                    continue;
                }

                fragment = this.getFragment(segmentation_value);

                var silent_fragment_update = this.interested_in_fragment_events.length === 0;

                fragment.add(model, us.extend({}, options, {
                    silent: silent_fragment_update
                }));
                // working copy is being updated regularly by MM
            }

            model.on('change:' + segmentation_key, this.updateSegment, this);
        }.bind(this));

    };

    /**
     * Overridden from parent class, do also remove the passed models from the current fragment
     *
     * @protected
     * @method removeModels
     *
     * @param {[Backbone.Model]} models The models to remove. Unlike Backbone.Model it has to be an array of Backbone.Models!
     * @param {object} [options] The same as Backbone.Model.remove
     */
    TownAgnosticCollection.prototype._removeModels = function(models, options) {
        var collection,
            segmentation_value;

        us.each(models, function(model) {
            if (!model) {
                Logger.get('town_agnostic_collection').log('removeModel', model);
                return;
            }
            var segmentation_key_idx, segmentation_keys_length = this.segmentation_keys.length,
                segmentation_key;
            for (segmentation_key_idx = 0; segmentation_key_idx < segmentation_keys_length; ++segmentation_key_idx) {
                segmentation_key = this.segmentation_keys[segmentation_key_idx];

                segmentation_value = typeof model.get === 'function' ? model.get(segmentation_key) : model[segmentation_key];
                collection = this.fragments[segmentation_value];

                var silent_fragment_update = this.interested_in_fragment_events.length === 0;

                if (collection) {
                    collection.remove(model, us.extend({}, options, {
                        silent: silent_fragment_update
                    }));
                }
            }

            model.off('change:' + segmentation_key, this.updateSegment, this);
        }.bind(this));

    };


    /**
     * currently only supports models and cids as argument, CANNOT handle ids!
     */
    TownAgnosticCollection.prototype.get = function(model_cid) {
        if (model_cid === null) {
            return;
        } else if (model_cid instanceof BaseModel) {
            return this._getModel(model_cid);
        } else {
            return this._getByCid(model_cid);
        }
    };

    /**
     * Change events are handled like this:
     * When a model gets added to the town_agnostic_collection we add a listener for "change" (@see _addModels),
     * when change happens this listener is called.
     *
     * Changes to models are flowing down from MM directly here, without MM updating the workingCopy since it does
     * need to operate on collections for change.
     *
     * This handler therefore also triggers updates on the workingCopy
     *
     * @protected
     * @method updateSegment
     *
     * @param {GrepolisModel} model
     * @param {ambiguous} value
     * @param {object} changes
     */
    TownAgnosticCollection.prototype.updateSegment = function(model) {
        var old_segmentation_value, new_segmentation_value,
            old_fragment, new_fragment,
            segmentation_key_idx, segmentation_keys_length = this.segmentation_keys.length,
            segmentation_key;

        /**
         * check if we have a segmentation_key change and if the workingCopy is affected,
         * if so, update workingCopy
         *
         * Note: we do not call refreshWorkingCopy here to avoid a complete repopulation
         * @see fragement_collection_prototype:add
         */
        var updateWorkingCopyOnSegmentationValueChange = function(segmentation_key, old_segmentation_value, new_segmentation_value) {
            if (old_segmentation_value === new_segmentation_value) {
                return;
            }

            if (this.workingCopy.segmentation_keys.indexOf(segmentation_key) === -1) {
                return;
            }

            if (this.workingCopy.segmentation_value === old_segmentation_value || this.workingCopy.segmentation_value === new_segmentation_value) {
                // update the workingCopy: removing the model will do nothing if the model is not part of workingCopy
                // so it´s safe to call without checking.
                this.workingCopy.remove(model);

                // adding the model respects the segmentation_key for the workingCopy
                // so it will not add if the key is wrong and therefore safe to call here
                this.workingCopy.add(model);
            }
        }.bind(this);

        for (segmentation_key_idx = 0; segmentation_key_idx < segmentation_keys_length; ++segmentation_key_idx) {
            segmentation_key = this.segmentation_keys[segmentation_key_idx];

            old_segmentation_value = model.previous(segmentation_key);
            new_segmentation_value = model.get(segmentation_key);

            old_fragment = this.fragments[old_segmentation_value];
            new_fragment = this.fragments[new_segmentation_value];

            if (old_fragment) {
                old_fragment.remove(model);
            }

            if (new_segmentation_value) {
                if (!new_fragment) {
                    new_fragment = this._createFragment(new_segmentation_value);
                }

                new_fragment.add(model);
            }

            updateWorkingCopyOnSegmentationValueChange(segmentation_key, old_segmentation_value, new_segmentation_value);
        }

    };

    /**
     * on change of one of the fragments models don't only send 'change' also send 'change:attribute' events
     *
     * @private
     * @method _triggerChange
     * @param {Backbone.Collection} fragment
     * @param {Backbone.Model} model
     * @param {object} options
     */
    TownAgnosticCollection.prototype._triggerChange = function(model, options) {
        var changes = model.changedAttributes(),
            value, attribute;

        for (attribute in changes) {
            if (changes.hasOwnProperty(attribute)) {
                value = changes[attribute];
                this.trigger('change:' + attribute, model, value, options);
            }
        }

        this.trigger('change', model);
    };

    /**
     * Get the constructor for the fragment collections beeing created in this collection.
     * It will take the (optionally) given constructor and wrap it with a custom constructor and add method
     * that implemented the needed filtering of the segment_value
     *
     * @private
     * @method _extractFragmentConstructor
     * @param {Object} [options]
     *   @param {Constructor} [options.fragment_constructor] Constructor of a collection which is used to represent the fragment
     */
    TownAgnosticCollection.prototype._extractFragmentConstructor = function(options) {
        var fragment_constructor;

        if (options && options.fragment_constructor) {
            fragment_constructor = options.fragment_constructor;
            delete options.fragment_constructor;
        } else {
            fragment_constructor = GrepolisCollection;
        }

        return fragment_constructor.extend(new FragmentCollectionPrototype(fragment_constructor));
    };

    TownAgnosticCollection.prototype._getModel = function(model) {
        var stored_model,
            segmentation_value,
            fragment,
            segmentation_key_idx, segmentation_keys_length = this.segmentation_keys.length,
            segmentation_key;
        for (segmentation_key_idx = 0; segmentation_key_idx < segmentation_keys_length; ++segmentation_key_idx) {
            segmentation_key = this.segmentation_keys[segmentation_key_idx];

            segmentation_value = typeof model.get === 'function' ? model.get(segmentation_key) : model[segmentation_key];
            fragment = this.fragments[segmentation_value];

            if (fragment) {
                stored_model = fragment.get(model);

                if (stored_model) {
                    return stored_model;
                }
            }
        }
    };

    TownAgnosticCollection.prototype._getByCid = function(cid) {
        if (cid) {
            var fragments = this.fragments;

            for (var segmentation_value in fragments) {
                if (fragments.hasOwnProperty(segmentation_value)) {
                    var fragment = fragments[segmentation_value];
                    var stored_model = fragment.get(cid);

                    if (stored_model) {
                        return stored_model;
                    }
                }
            }
        }
    };


    /**
     * if the collection has a model class (which is standard),
     * MM loops through all models it has and calls 'add' on this collection
     * @see Grepolis_collection -> repopulate
     */
    TownAgnosticCollection.prototype.repopulate = function(options) {
        if (this.model_class) {
            var models = MM.getModelsForClass(this.model_class);

            us.each(models, function(model, model_id) {
                if (!model) {
                    Logger.get('town_agnostic_collection').log('repopulate', model);
                    return;
                }
                this.add(model, options);
            }.bind(this));
        }
        this._onTownSwitch();
    };

    /**
     * update the working copy from the fragments to make sure it is up to date
     * This is like a town switch event on the same town
     */
    TownAgnosticCollection.prototype.refreshWorkingCopy = function() {
        this._onTownSwitch();
    };


    /**
     * Anybody registering with this function enables backbone events on all updates for every fragment -
     * not just the working copy!
     *
     * E.g. overviews may want to listen to changes on all fragments, even if our default update strategy is to
     * update all fragments "silent".
     * This function overrides this behavior and triggers updates on all fragments
     *
     * Note: MM triggers Backbone events on the working_copy per default
     *
     * @param {object} listener object interested in fragment events
     */

    TownAgnosticCollection.prototype.registerFragmentEventSubscriber = function(listener) {
        this.interested_in_fragment_events.push(listener);
    };

    /**
     * @see registerFragmentEventSubscriber
     * removing the last listener turns the behavior off
     *
     * @param {object} listener object interested in fragment events
     */
    TownAgnosticCollection.prototype.unregisterFragmentEventSubscriber = function(listener) {
        if (this.interested_in_fragment_events.indexOf(listener) > -1) {
            this.interested_in_fragment_events.splice(this.interested_in_fragment_events.indexOf(listener), 1);
        }
    };

    us.extend(TownAgnosticCollection.prototype, BaseEvents);

    window.TownAgnosticCollection = TownAgnosticCollection;
}());