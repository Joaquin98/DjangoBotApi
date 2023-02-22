/* global MM, us, gpAjax, GrepoApiHelper, Game */

(function() {
    'use strict';

    var BaseCollection = window.Backbone.Collection;
    var InternalMarkets = require('helpers/internal_markets');

    var GrepolisCollection = BaseCollection.extend({
        constructor: function(models, options) {
            this.update_emergence_time = 0;

            // if the model was created for a window that was called with arguments for the backend, those arguments are stored here for later
            if (options && options.creation_arguments) {
                this.creationArguments = options.creation_arguments;
                delete options.creation_arguments;
            }

            BaseCollection.prototype.constructor.call(this, models, options);

            if (options && options.model_class) {
                this.model_class = options.model_class;
                this.url_root = options.url_root;
            }
        },

        url: function() {
            if (this.url_root) {
                return this.url_root + 's';
            }
            return this.model_class + 's';
        },

        /**
         * @param {Object|Array} models
         * @param {Object} [options]
         */
        add: function(models, options) {
            options = options || {};

            // Handle both
            if (options.update_emergence_time) {
                if (this.update_emergence_time > options.update_emergence_time) {
                    // if this collection got updated already by a newer message, then don't do it again!
                    return;
                }

                this.update_emergence_time = options.update_emergence_time;
            }

            BaseCollection.prototype.add.apply(this, arguments);
        },

        /**
         * @param {Array} models
         * @param {Object} [options]
         */
        remove: function(models, options) {
            options = options || {};

            // Handle both
            if (options.update_emergence_time) {
                if (this.update_emergence_time > options.update_emergence_time) {
                    // if this collection got updated already by a newer message, then don't do it again!
                    return;
                }

                this.update_emergence_time = options.update_emergence_time;
            }

            BaseCollection.prototype.remove.apply(this, arguments);
        },

        repopulate: function(options) {
            if (this.model_class) {
                this.reset();
                var models = MM.getModelsForClass(this.model_class);

                us.each(models, function(model, model_id) {
                    this.add(model, options);
                }.bind(this));
            }
        },

        /**
         * Manually refreshes the collection by calling the backend.
         * Uses the GameFrontendBridgeController to call collection APIs 'read' method.
         * @param {function} [cb] - success callback
         */
        reFetch: function(cb, options) {
            var show_loader = false,
                model_class = this.model_class,
                api_name = this.url(),
                success = function(resp) {
                    if (!resp.collections[api_name]) {
                        if (Game.dev || InternalMarkets.isInternalMarket(Game.market_id)) {
                            throw 'Collection with the name ' + api_name + ' is missing. (Maybe feature flag is not set.)';
                        }
                        return;
                    }
                    var models = resp.collections[api_name].data;

                    us.each(models, function(model) {
                        MM.checkAndPublishRawModel(model_class, model.d, options);
                    });

                    if (cb) {
                        cb();
                    }
                },
                collection_definition = {};

            collection_definition[api_name] = [];

            model_class = model_class === 'Unit' ? 'Units' : model_class;


            return gpAjax.ajaxGet('frontend_bridge', 'refetch', {
                collections: collection_definition
            }, show_loader, success.bind(this));
        },

        execute: function(action_name, props, callback_arg) {
            return GrepoApiHelper.execute.call(this, this.url(), action_name, props, callback_arg);
        },

        unregisterFromModelManager: function() {
            MM.removeCollection(this);
        },

        /**
         * Returns first model from the collection
         *
         * @return {Backbone.Model|null}
         */
        getFirstModel: function() {
            if (this.models.length > 0) {
                return this.models[0];
            }

            return null;
        },

        /**
         * Binds a listener which will be executed when a new model will be added to this collection
         *
         * @param {Backbone.Events} obj object which is listening on changes
         * @param {Function} callback
         */
        onAdd: function(obj, callback) {
            obj.listenTo(this, 'add', callback);
        },

        /**
         * Binds a listener which will be executed when a new model will be change in this collection
         *
         * @param {Backbone.Events} obj object which is listening on changes
         * @param {Function} callback
         */
        onChange: function(obj, callback) {
            obj.listenTo(this, 'change', callback);
        },

        /**
         * Binds a listener which will be executed when a new model will be removed from this collection
         *
         * @param {Backbone.Events} obj object which is listening on changes
         * @param {Function} callback
         */
        onRemove: function(obj, callback) {
            obj.listenTo(this, 'remove', callback);
        },

        /**
         * Binds a listener which will be executed when the collection is resetted
         *
         * @param {Backbone.Events} obj object which is listening on changes
         * @param {Function} callback
         */
        onReset: function(obj, callback) {
            obj.listenTo(this, 'reset', callback);
        }
    });

    window.GrepolisCollection = GrepolisCollection;
}());