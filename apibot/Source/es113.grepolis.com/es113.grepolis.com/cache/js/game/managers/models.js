/* global Logger, GrepolisModel, GrepolisCollection, GameModels, GameCollections, us, difference, Game, GameControllers, GameViews, Timestamp, JSON */

(function() {
    'use strict';

    /**
     * Determining model name for collection only if last sign is letter 's' by removing it. This is used for
     * plain old Backbone Collections so that they are able to create models internally. The models created will
     * then be of this class. Eg. a FarmTowns backbone collection would contain FarmTown models, which in turn
     * could again be a basic Backbone Model, or a real class which was implemented by us.
     *
     * @private
     * @static
     * @method getModelNameForCollection
     * @param {String} collection_name
     * @return {String|Boolean} the name if it was determined and false when it wasn't possible
     */
    function getModelNameForCollection(collection_name) {
        var length = collection_name.length;
        if (collection_name[length - 1] === 's') {
            return collection_name.substr(0, length - 1);
        } else {
            return false;
        }
    }

    /**
     * Find the frontend model class for the given backend class name. This is declared in models as urlRoot.
     * @example
     * class Benefit {
     *   this.urlRoot = Benefit
     * }
     *
     * class LargeIcon extends Benefit {
     * }
     *
     * getBaseModelName('LargeIcon') => 'Benefit'
     */
    function getBaseModelName(backend_class_name) {
        return GameModels[backend_class_name] ? GameModels[backend_class_name].prototype.urlRoot : backend_class_name;
    }

    /**
     * internal model and collection store
     *
     * @type {{models: Window.GameModels[], collections: Window.GameCollections[]}}
     */
    var model_repository = {
        models: {},
        collections: {},
        town_agnostic_collections: {}
    };

    /**
     * avoid building up expensive Logger (us.clone) things when we actually discard them
     */
    var debug = Logger.isOn.bind(this, 'MM');

    /**
     * The model manager creates, stores and updates all synced models and collections
     *
     * @class MM
     * @constructor
     */
    function MM() {}

    MM.prototype.getModels = function() {
        return model_repository.models;
    };

    MM.prototype.getCollections = function() {
        return model_repository.collections;
    };

    /**
     * helper to access collections directly via name.
     * This is for the common case that only one collection exists in the system.
     * TownAgnostic or multiple collections lead to a MM warning
     * @param {string} collection_name
     * @returns {GrepolisCollection | null} collection;
     */
    MM.prototype.getOnlyCollectionByName = function(collection_name) {
        var collection = model_repository.collections[collection_name];

        if (!collection) {
            if (debug()) {
                Logger.get('MM').log('collection ' + collection_name + ' not found.');
            }
            return null;
        }
        if (collection.length > 1) {
            if (debug()) {
                Logger.get('MM').log('collection ' + collection_name + ' has multiple instances or is TownAgnostic.');
            }
        }
        return collection[0];
    };

    /**
     * returns a model via Game.player_id
     * Models are stored on keys send by the backend. Some are player_id, some are townId, some are just fixed.
     * You should prefer accessing models via collections!
     * @param {string} model_name
     * @returns {GrepolisModel | null} model
     */
    MM.prototype.getModelByNameAndPlayerId = function(model_name) {
        var model = model_repository.models[model_name],
            player_id = Game.player_id;

        if (!model) {
            if (debug()) {
                Logger.get('MM').log('model ' + model_name + ' not found.');
            }
            return null;
        }

        if (!model[player_id]) {
            if (debug()) {
                Logger.get('MM').log('model ' + model_name + ' can not be found for player_id ' + player_id);
            }
            return null;
        }

        return model[player_id];
    };

    /**
     * returns all models for a given model (class) name
     * they are stored with a additional key, so the caller has to care about that
     * @param {string} model_name e.g. model_class from collections
     * @returns {object} GrepolisModels
     */
    MM.prototype.getModelsForClass = function(model_name) {
        return this.getModels()[model_name];
    };

    /**
     * Inserts raw data as a new model to the modelmanager. It takes data in the format a Backbone.Model would take during creation
     * and either creates a new model and stores it or if this model is already known updates it.
     * It has two main uses:
     * <ul>
     *   <li>on received backbone notifications it will take the payload and processes it</li>
     *   <li>in other code it can be used to get a specific model from the manager and storing it if not existing (see Example).
     *		But caution is adviced, there is no specified way to check if the model is new or already was managed before!
     *   </li>
     * </ul>
     *
     * @method checkAndPublishRawModel
     *
     * @param {string} model_name Name of the model class the data belongs to
     * @param {object} modelJson The json object specifying the model attributes
     * @param {boolean} [silent] If set to true, collections getting the model added during its creation will not emit any event
     * @param {integer} [update_emergence_time] If set it will update the emergence time of the model (if the model was existing) to prevent
     *                                          out of order updates to it (see GrepolisModel.set)
     * @param {boolean} drop_if_no_collection_exists
     *
     * @return {GrepolisModel}
     *
     * @example
     * This will either get or create a new PlayerLedger model instance. It will be updated from the backend automagically.
     * <pre>
     * var player_ledger = MM.checkAndPublishRawModel('PlayerLedger', {id: Game.player_id});
     * </pre>
     */
    MM.prototype.checkAndPublishRawModel = function(model_name, modelJson, model_options) {
        model_options = model_options || {};

        var frontend_class = GameModels[model_name],
            frontend_model_name = frontend_class ? frontend_class.prototype.urlRoot : model_name;

        us.defaults(model_options, {
            silent: false,
            update_emergence_time: false
        });

        var models_of_class = this.getModels()[frontend_model_name];

        if (models_of_class && models_of_class[modelJson.id]) {
            return this._updateExistingModelFromJson(frontend_model_name, modelJson, model_options);
        } else if (typeof GameModels[model_name] === 'function') {
            return this._createModelFromJson(model_name, frontend_model_name, modelJson, model_options);
        }

        if (debug()) {
            Logger.get('error').log(
                'MM.checkAndPublishRawModel: you try to update or add a model which is not found in MM and/or has no constructor', model_name, modelJson
            );
        }
        return null;
    };

    /**
     * updates and @returns {GrepolisModel} and existing model from JSON
     * @param {string} frontend_model_name
     * @param {object} modelJson
     * @param {object} model_options
     */
    MM.prototype._updateExistingModelFromJson = function(frontend_model_name, modelJson, model_options) {
        var models_of_class = this.getModels()[frontend_model_name],
            model = models_of_class[modelJson.id];

        if (debug()) {
            Logger.get('MM').log(
                'MM.update', model.url(), us.clone(model.attributes), '->', difference(model.attributes, modelJson)
            );
        }

        model.set(modelJson, model_options);

        return model;
    };

    /**
     * creates and @returns {GrepolisModel} a new model and adds it to collections, if we have
     * @param {string} model_name
     * @param {string} frontend_model_name
     * @param {object} modelJson
     * @param {object} model_options (for collection.add)
     */
    MM.prototype._createModelFromJson = function(model_name, frontend_model_name, modelJson, model_options) {
        var model = new GameModels[model_name](modelJson);

        if (debug()) {
            Logger.get('MM').log(
                'MM.create', model.url(), model, model_options
            );
        }

        this.addModel(model);

        var modelCollections = this.getCollections()[frontend_model_name];

        if (modelCollections) {
            modelCollections.forEach(function(collection) {
                collection.add(model, model_options);
            });
        }

        var agnostic_collections = model_repository.town_agnostic_collections[frontend_model_name];

        if (agnostic_collections) {
            agnostic_collections.forEach(function(collection) {
                collection.add(model, model_options);
            });
        }

        return model;
    };

    /**
     * add a model to the model manager and populate it to its collections
     *
     * @param {Backbone.Model} model
     * @param {Boolean} drop_if_no_collection_exists
     * @param {Boolean} silent
     * @param {Boolean} update_emergence_time
     * @todo re-use this in checkAndPublishRawModel
     * @return {void}
     */
    MM.prototype.addModelAndPopulate = function(model, drop_if_no_collection_exists, silent, update_emergence_time) {
        var frontend_model_name = model.urlRoot,
            modelCollections = this.getCollections()[frontend_model_name],
            idx;

        drop_if_no_collection_exists = drop_if_no_collection_exists || false;
        silent = silent || false;
        update_emergence_time = update_emergence_time || Timestamp.now();

        if (modelCollections || !drop_if_no_collection_exists) {
            // only store the model, if we already have somebody interested in it
            this.addModel(model);
        }

        if (modelCollections) { // Is there a collection for this model class available
            for (idx in modelCollections) {
                if (modelCollections.hasOwnProperty(idx)) {
                    //Add model to collection
                    modelCollections[idx].add(model, {
                        silent: silent,
                        update_emergence_time: update_emergence_time
                    });
                }
            }
        }
    };

    /**
     * Getting object to be syncronized out of a backbone notification. It will parse the notification and then trigger
     * a delete, insert or update. Will be called from the notification system
     *
     * @method handleNotification
     *
     * @param {object} notification
     *
     * @return {boolean}
     */
    MM.prototype.handleNotification = function(notification) {
        var json = JSON.parse(notification.param_str),
            backend_model_name,
            modelJson;

        // Every notification should have a time field
        if (!notification.time && notification.time !== 0) {
            throw 'Notification must contain a field time!';
        }

        for (backend_model_name in json) {
            if (json.hasOwnProperty(backend_model_name)) {
                modelJson = json[backend_model_name];

                if (backend_model_name === 'DeletedModelNotification') {
                    this.deletedModelNotification(modelJson, {
                        update_emergence_time: notification.time
                    });
                } else {
                    this.checkAndPublishRawModel(backend_model_name, modelJson, {
                        update_emergence_time: notification.time
                    });
                }
            }
        }

        return true;
    };

    /**
     * removes a model from storage after a backbone delete notification was send. Will take the payload of the notification and
     * extracts what to delete. It will also go thru all collections that may hold a model of that class, and calls remove on them
     * which triggers a remove event on the collection
     *
     * @private
     * @method deletedModelNotification
     *
     * @param {object} request the paylod of a notification that pushed the deletion of a model
     *   @param {string} request.deleted_class_type name of the model class
     *   @param {integer} request.deleted_id id of the model instance
     * @param {Object} options
     */
    MM.prototype.deletedModelNotification = function(request, options) {
        var model_class = getBaseModelName(request.deleted_class_type),
            models = model_repository.models[model_class],
            town_agnostic_collections = model_repository.town_agnostic_collections[model_class] || [],
            // regular_collections & working copies (not auto-updated from town_agnostic_collections)
            regular_collections = model_repository.collections[model_class] || [],
            collections = town_agnostic_collections.concat(regular_collections);

        // if we have no models for this delete notification, we can safely bail
        // (the collecions are also empty)
        if (!models && Game.dev) {
            Logger.get('warn').log(
                'MM.delete ' + model_class + '#' + request.deleted_id + ' received, but no models exists with this id!');
            return;
        }

        var model = models[request.deleted_id];

        if (debug()) {
            Logger.get('MM').log(
                'MM.delete ' + model_class + '#' + request.deleted_id + ' from collection', collections, 'model:', model);
        }

        // first remove collections, the the model from the registry
        // otherwise collections won´t catch the 'remove' properly
        collections.forEach(function(collection) {
            collection.remove(model);
        });

        if (model) {
            model.unregisterFromModelManager();
        }
    };

    /**
     * Adds a model to the storage. Will print an error in dev mode, if the model is already stored. If that happens, there may be a
     * logic error. Stored models will be updated by notifications automagically, and will be added to GrepolisCollections if repopulate()
     * is called on them. <b>They are not added to the stored Collection automatically, that will only happen during
     * .checkAndPublishRawModel()!</b> There is a removeModel() method on the model manager.
     *
     * @private
     * @method addModel
     *
     * @param {GrepolisModel} model
     */
    MM.prototype.addModel = function(model) {
        var model_class = model.urlRoot,
            models_of_class;

        if (model_class) {
            if (model.id === undefined) {
                if (debug()) {
                    Logger.get('MM').log('MM.add() model "' + model_class + '" could not be saved, it had no ID', model);
                }
            } else {
                models_of_class = this.getModels()[model_class];
                if (models_of_class && models_of_class[model.id]) {
                    if (debug()) {
                        Logger.get('MM').log('"' + model_class + '/' + model.id + '" already managed [', model, ']');
                    }
                } else {
                    if (debug()) {
                        Logger.get('MM').log('MM.add() model "' + model_class + '/' + model.id + '"', us.clone(model.attributes));
                    }
                    if (!models_of_class) {
                        models_of_class = this.getModels()[model_class] = {};
                    }
                    models_of_class[model.id] = model;
                }
            }
        }
    };

    /**
     * Adds a collection to the storage. There can be several collections of the same type stored at the same time, because collections
     * do not have an ID. Stored collections will get models added and removed from if corresponding notifications about models come in.
     * There is a removeCollection() method on the model manager.
     *
     * @method addCollection
     *
     * @param {Backbone.Collection} collection_arg
     */
    MM.prototype.addCollection = function(collection_arg) {
        var collection,
            backend_model_class = collection_arg.model_class,
            model_class = getBaseModelName(backend_model_class);

        if (model_class) {
            collection = this.getCollections()[model_class];
            if (debug()) {
                Logger.get('MM').log('MM.add() collection for "' + model_class + '" models', collection_arg);
            }

            if (!collection) {
                this.getCollections()[model_class] = [collection_arg];
            } else {
                collection.push(collection_arg);
            }
        }
    };

    /**
     * add a TownAgnosticCollection to internal model_reprository
     * there can be multiple collections per name / id
     * the Name is taken from the 'model_class' collection attribute
     *
     * @param {GrepolisCollection} collection_arg
     */
    MM.prototype.addTownAgnosticCollection = function(collection_arg) {
        var collection,
            backend_model_class = collection_arg.model_class,
            model_class = getBaseModelName(backend_model_class);

        if (model_class) {
            collection = model_repository.town_agnostic_collections[model_class];
            if (debug()) {
                Logger.get('MM').log('MM.add() town agnostic collection for "' + model_class + '" models', collection_arg);
            }

            if (!collection) {
                model_repository.town_agnostic_collections[model_class] = [collection_arg];
            } else {
                collection.push(collection_arg);
            }
        }
    };

    /**
     * returns all TownAgnosticCollections for a given name
     *
     * @param {string} collection_name
     * @return {[TownAgnosticCollection]}
     */
    MM.prototype.getTownAgnosticCollectionsByName = function(collection_name) {
        var collections = model_repository.town_agnostic_collections[collection_name];

        if (!collections || collections.length === 0) {
            if (debug()) {
                Logger.get('error').log('MM.getTownAgnosticCollectionByName() has no collection named ' + collection_name);
            }
            return null;
        }

        return collections;
    };

    MM.prototype.getFirstTownAgnosticCollectionByName = function(collection_name) {
        var collections = this.getTownAgnosticCollectionsByName(collection_name);

        if (collections.length !== 1) {
            if (debug()) {
                Logger.get('error').log('MM.getFirstTownAgnosticCollectionByName() has multiple TownAgnosticCollections for ' + collection_name);
                return null;
            }
        }

        return collections[0];
    };

    /**
     * Is called in GrepolisModel during unregisterFromModelManager() and removes the model from the storage.
     * From then on there won't be any updates anymore to the model. Should the modelmanager receive a notification about the model
     * again, it will recreate it automatically.
     *
     * @method removeModel
     *
     * @param {Backbone.Model} model
     */
    MM.prototype.removeModel = function(model) {
        var model_class = model.urlRoot,
            models_of_class = this.getModels()[model_class],
            model_id = model.id;

        if (model_class && model_id !== undefined && model_id !== null && models_of_class && models_of_class[model_id]) {
            var to_be_deleted_instance = models_of_class[model_id];

            if (debug()) {
                Logger.get('MM').log('MM.delete() model "' + model_class + '/' + model_id + '"', model);
            }

            delete models_of_class[model_id];

            if (typeof to_be_deleted_instance.finalize === 'function') {
                to_be_deleted_instance.finalize();
            }

            to_be_deleted_instance.destroy();

        }
    };

    /**
     * Is called in GrepolisCollection during unregisterFromModelManager() and removes the collection from the storage.
     * All models in this collection will be checked, if they exist in any other collection for the same model class.
     * If they don't then they will be removed as well (by calling their unregisterFromModelManager() method)
     *
     * @method removeCollection
     * @param {Backbone.Collection|AgnosticCollection} collection
     * @param {Object} options Backbone options to pass in e.g. {silent: true}
     */
    MM.prototype.removeCollection = function(collection) {
        var model_class = collection.model_class,
            model_collections,
            to_be_preserved_models = {};

        if (!model_class) {
            if (debug()) {
                Logger.get('MM').warn('MM.removeCollection() models for class "' + model_class + '" not found!');
            }
            return;
        }

        model_collections = this.getCollections()[model_class];
        if (!model_collections) {
            if (debug()) {
                Logger.get('MM').log('MM.removeCollection() no collection found for "' + model_class);
            }
            return;
        }

        if (debug()) {
            Logger.get('MM').log('MM.removeCollection() removing collection for model class "' + model_class + '" collection: ', collection);
        }

        // find and memorize all models which are used in OTHER collections
        // and preserve them from deleting
        model_repository.collections[model_class] = model_collections.filter(function(a_collection) {
            if (a_collection === collection) {
                return false;
            } else {
                collection.each(function(model) {
                    if (a_collection.get(model.cid)) {
                        to_be_preserved_models[model.cid] = true;
                    }
                });
                return true;
            }
        });

        // collection.each does not work, since it would alter the array we are looping over (via delete)
        us.each(model_repository.models[model_class], function(model) {
            if (typeof model.unregisterFromModelManager === 'function' && !to_be_preserved_models[model.cid]) {
                if (debug()) {
                    Logger.get('MM').log('MM.removeCollection() REMOVING model', model, ' REASON: preserved:', to_be_preserved_models[model.cid]);
                }
                model.unregisterFromModelManager();
            } else {
                if (debug()) {
                    Logger.get('MM').log('MM.removeCollection() KEEPING model', model, ' REASON: preserved: ', to_be_preserved_models[model.cid]);
                }
            }
        });

        if (typeof collection.finalize === 'function') {
            collection.finalize();
        }
    };

    /**
     * .models and .collections can now be accessed directly
     *
     * @deprecated
     * @method status
     *
     * @return {object}
     *             models : Object
     *                 model_class : Object
     *                     model_id : Backbone.Model
     *             collections : Object
     *                 model_class_hold : [Backbone.Collection]
     */
    MM.prototype.status = function() {
        return {
            models: this.getModels(),
            collections: this.getCollections()
        };
    };

    /**
     * The window manager needs to know which models and collections are already loaded, so that he can tell the backend that he
     * doesn't need them again during page load. This works because all data request by the different page of a window will be cached
     * (if not specified otherwise in DataFrontendBridge.php) until the window is closed. This is helpfull because windows are often
     * about a specific topic, which means that data that is needed by one page in a window likely is needed in
     * another as well.
     *
     * @method getAlreadyLoadedData
     *
     * @param {object} window_spec The specification of the window which is a mirror of DataFrontendBridge.php
     *                 @todo create a window specification object that encapsulates the loops
     * @param {object} window_creation_arguments The object that will be passed to all Api .read() methods that create the data
     *                                           for the page. We need this because we only treat models/collections that got created
     *                                           by the same arguments as equal.
     *                 @todo check if the models/collections with different arguments get cleaned up during window close!
     *
     * @return {object}  result
     *  @param {[Backbone.Model]} result.models
     *  @param {[Backbone.Collection]} result.collections
     */
    MM.prototype.getAlreadyLoadedData = function(window_spec, window_creation_arguments) {
        var data = {
                models: {},
                collections: {}
            },
            tab_type, tab_spec,
            data_name, data_spec,
            data_type, datum,
            instance;

        for (tab_type in window_spec) {
            if (window_spec.hasOwnProperty(tab_type)) {
                for (data_type in data) {
                    if (data.hasOwnProperty(data_type)) {
                        datum = data[data_type];
                        tab_spec = window_spec[tab_type][data_type];
                        for (data_name in tab_spec) {
                            if (tab_spec.hasOwnProperty(data_name)) {
                                data_spec = tab_spec[data_name];
                                if (data_spec.hasOwnProperty('nofetch')) {
                                    instance = this.getInstanceForClass(data_type, data_name);
                                    data[data_type][data_name.snakeCase()] = instance;
                                }
                            }
                        }
                    }
                }
            }
        }

        return data;
    };

    /**
     * @param {string|function} collection_class_or_name either the string representation of the classname, of the constructor function
     */
    MM.prototype.getInstanceForCollectionClass = function(collection_class_or_name, window_creation_arguments) {
        return this.getInstanceForClass('collections', collection_class_or_name, window_creation_arguments);
    };

    /**
     * returns an instance for a class or collection, based on the data_type
     *
     * @param {string} data_type either models or collections
     * @param {string|function} class_or_name constructor function or name of the constructor function (eg class)
     * @param {object} [window_creation_arguments] options with which the window has been initialized
     */
    MM.prototype.getInstanceForClass = function(data_type, class_or_name, window_creation_arguments) {
        if (data_type === 'collections') {
            return this._getInstanceForCollection(class_or_name, window_creation_arguments);
        } else {
            return this._getInstanceForModel(class_or_name, window_creation_arguments);
        }
    };

    /**
     * @returns {GrepolisCollection} instance of a collection or undefined
     */
    MM.prototype._getInstanceForCollection = function(class_or_name, window_creation_arguments) {
        var data_class,
            idx, collections_length, collection,
            model_collections,
            collection_model;

        if (typeof class_or_name === 'function') {
            data_class = class_or_name;
        } else {
            data_class = GameCollections[class_or_name];
        }

        if (data_class) {
            collection_model = data_class.prototype.model_class;

            model_collections = this.getCollections()[collection_model];
            collections_length = model_collections ? model_collections.length : 0;

            for (idx = 0; idx < collections_length; ++idx) {
                collection = model_collections[idx];
                if (collection instanceof data_class) {
                    return collection;
                }
            }
        }
    };

    /**
     * @returns {GrepolisModel} instance of a model or undefined
     */
    MM.prototype._getInstanceForModel = function(class_or_name, window_creation_arguments) {
        var data_class,
            models_of_class,
            model_id;

        // if is model
        if (typeof class_or_name === 'string') {
            data_class = getBaseModelName(class_or_name);
        } else if (typeof class_or_name === 'function') {
            data_class = class_or_name.prototype.urlRoot;
        } else if (Game.dev) {
            throw 'class_or_name has to be a constructor or the name of a model constructor';
        }

        models_of_class = this.getModels()[data_class];
        if (models_of_class) {
            for (model_id in models_of_class) {
                if (models_of_class.hasOwnProperty(model_id)) {
                    return models_of_class[model_id];
                }
            }
        }
    };

    /**
     * Takes data in the format defined in the backend (e.g. FrontendModelToArrayConverter),
     * parses it and adds new data to MM or updates existing collection and models.
     * GP-14618:  Refactor this messy method! Maybe combine it with checkAndPublishRawModel
     *
     * @param {object} object_specs - {<model or collection name>: options}
     * @param {object} class_container - the namespace holding the constructors for strings in object_specs (usually GameModels or GameCollections)
     * @return array<string, GrepolisModel>
     */
    MM.prototype.createBackboneObjects = function(object_specs, class_container, creation_arguments) {
        var objects = {},
            object_id,
            object_data,
            object_class,
            object_name,
            object_constructor,
            object,
            model_name,
            options,
            model_class, model_id,
            existing_instance;

        for (object_id in object_specs) {
            if (object_specs.hasOwnProperty(object_id)) {
                if (creation_arguments) {
                    options = {
                        creation_arguments: creation_arguments
                    };
                } else {
                    options = {};
                }

                object_data = object_specs[object_id];
                object_name = object_id.snakeCase();
                if (object_data && object_data.class_name) {
                    object_class = object_data.class_name;
                    object_constructor = class_container[object_class];
                    if (object_constructor) {
                        object = new class_container[object_class](object_data.data, options);
                        if (class_container === GameModels) {
                            // check to prevent loaded data, which already exists, to create instances in the gamecode
                            model_class = object.urlRoot;
                            model_id = object.id;
                            existing_instance = this.getModels()[model_class] ? this.getModels()[model_class][model_id] : undefined;
                            if (existing_instance) {
                                // we already have a model, so update the attributes
                                existing_instance.set(object.attributes);
                                object = existing_instance;
                            } else {
                                object = this._createModelFromJson(object_class, model_class, object_data.data);
                            }
                        } else {
                            // is a collection
                            this.addCollection(object);
                        }
                    } else {
                        if (debug()) {
                            Logger.get('error').log('there is no constructor for "' + object_data.class_name + '" backbone data');
                        }
                    }
                } else {
                    if (class_container === GameCollections) {
                        if (class_container[object_id]) {
                            object = this.getInstanceForCollectionClass(object_id, creation_arguments);
                            if (!object) { // if an instance of this collection does not yet exist, create a new
                                object = new class_container[object_id](null, options);
                                this.addCollection(object);
                            }

                            if (object_data && object_data.data) {
                                var model_datas = object_data.data,
                                    model_data_idx, model_datas_length = model_datas.length,
                                    model_data,
                                    model_raw_data, model, models = [];

                                for (model_data_idx = 0; model_data_idx < model_datas_length; ++model_data_idx) {
                                    model_raw_data = model_datas[model_data_idx];
                                    // create a model_data hash either from the model class name and data (.c / .d) attributes send to us
                                    // or from our model_class attribute and the data itself
                                    model_data = {
                                        model: {
                                            class_name: model_raw_data.c || object.model_class,
                                            data: model_raw_data.d || model_raw_data
                                        }
                                    };
                                    if (!model_raw_data.c) {
                                        if (debug()) {
                                            Logger.get('warn').log('model class for collection ' + object_id + ' not send from backend, assuming it is ' + object.model_class);
                                        }
                                    }
                                    model = this.createBackboneObjects(model_data, GameModels).model;
                                    models.push(model);
                                }

                                object.set(models);
                            }
                        } else {
                            model_name = getModelNameForCollection(object_id);
                            if (model_name) {
                                if (GameModels[model_name]) {
                                    options.model = GameModels[model_name];
                                }
                                options.model_class = model_name;
                            }
                            object = new GrepolisCollection(object_data ? object_data.data : null, options);
                            this.addCollection(object);
                        }

                    } else if (object_name) {
                        object = new GrepolisModel(object_data.data, options);
                        this.addModel(object);
                    }
                }

                objects[object_name] = object;
                object = null;
            }
        } // for objects in object_specs

        return objects;
    };

    /**
     * Lists all events binded to the object (with .on and .listenTo)
     *
     * @param {Backbone.Model|Backbone.Collection|Backbone.View} obj
     */
    MM.prototype.listBindedEvents = function(obj) {
        var _self = this,
            listeners = obj._listeners,
            events = obj._events,
            is_controller = obj instanceof window.GameControllers.BaseController;

        console.log('%c==========================================', 'font-weight:bold;color:green;');
        console.log('%cBACKBONE EVENTS', 'font-weight:bold;color:green;');
        console.log('%c==========================================', 'font-weight:bold;color:green;');

        if (listeners) {
            console.group('%c' + this._getObjectName(obj) + '%c is listening on following events:', 'font-weight:normal', 'font-weight:bold', 'font-weight:normal');

            if (!is_controller) {
                console.log('%cPlease move all event listeners from View to Controller.', 'color:red');
            }

            us.each(listeners, function(item, listener_id) {
                console.group('%cListening on: ' + this._getObjectName(item), 'font-weight:normal', 'font-weight:bold');

                us.each(item._events, function(event, event_type) {
                    console.groupCollapsed('%cEvent "%c' + event_type + '" %c(' + event.length + ' instances)', 'font-weight:normal', 'color:blue;font-weight:normal', 'color:#303942;font-weight:normal');

                    us.each(event, function(el, index) {
                        console.log(el);
                    });

                    console.groupEnd();
                });

                console.groupEnd();
            }.bind(this));

            console.groupEnd();
        }

        if (events) {
            console.group(this._getObjectName(obj) + ' is watched on following events:');

            us.each(events, function(event_obj, event_name) {
                console.group(event_name);

                us.each(event_obj, function(observer, index) {
                    console.log('from', _self._getObjectName(observer.context));
                });

                console.groupEnd();
            });

            console.groupEnd();
        }

        if (!listeners && !events) {
            console.log('No backbone listeners found.');
        }

        if (is_controller) {
            $.Observer().status('.' + obj.getSubContext());
        }
    };

    /**
     * Checks for object name in predefined categories and returns class name or 'unknown'
     *
     * @param {Object} obj
     *
     * @return {String}
     * @private
     */
    MM.prototype._getObjectName = function(obj) {
        var name, type, types = [{
                name: 'collection',
                class_obj: GameCollections
            },
            {
                name: 'model',
                class_obj: GameModels
            },
            {
                name: 'controller',
                class_obj: GameControllers
            },
            {
                name: 'view',
                class_obj: GameViews
            }
        ];

        for (var i = 0, l = types.length; i < l; i++) {
            type = types[i];
            name = this._getObjectNameByType(obj, type.class_obj, type.name);

            if (name) {
                return name;
            }
        }

        return 'unknown';
    };

    /**
     * Loops trough the given object and checks if object given as a parameter is an instance of them,
     * if is then saves its names and returns it at the end
     *
     * @param {Object} obj
     * @param {Object} objects
     * @param {String} type_name
     *
     * @return {String}
     * @private
     */
    MM.prototype._getObjectNameByType = function(obj, objects, type_name) {
        var name, total_name = '',
            i = 0;

        for (name in objects) {
            if (objects.hasOwnProperty(name) && obj instanceof objects[name]) {
                total_name += (i > 0 ? '/' : type_name + ' %c') + name;

                i++;
            }
        }

        return total_name;
    };

    window.MM = new MM();
}());