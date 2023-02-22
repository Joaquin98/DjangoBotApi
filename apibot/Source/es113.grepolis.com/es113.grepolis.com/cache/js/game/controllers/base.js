/*global CM, us, Game, TM, MM, GameControllers, GameViews, debug */

define('controllers/base', function() {
    'use strict';

    var controllers = window.GameControllers;

    /**
     * BaseController has the following responsibilities:
     *  - automated initialization and destruction
     *  - component registration and context management
     *  - template management
     *  - event handling
     *  - timer management
     *  - models, collection and strategies management
     *  - subcontrollers
     *  - utility functions: l10n, status display
     *
     * It can be a subcontroller (controlled via options.parent_controller != null)
     * In this case it inherits everything from the parent_controller
     */
    controllers.BaseController = controllers.WithMultiEventsListener.extend({
        view: null,
        //component manager context
        cm_context: {},
        parent_controller: null,
        //keeps reference to the window controller (used with sub windows)
        window_controller: null,
        //Translations
        l10n: {},
        //Models
        models: {},
        //Collections
        collections: {},
        //Templates
        templates: {},
        controllers: {},
        strategies: {},
        compiled_templates: {},
        //Sub-window which can be opened inside the window
        sub_window: null,

        /**
         * @constructor
         * @param {object} options must at least be {}
         */
        initialize: function(options) {
            controllers.WithMultiEventsListener.prototype.initialize.apply(this, arguments);

            this.options = options;

            this.parent_controller = options.parent_controller || null;
            this.window_controller = options.window_controller || null;
            this.cm_context = options.cm_context || {};
            this.l10n = options.l10n || {};
            this.models = options.models || {};
            this.collections = options.collections || {};
            this.templates = options.templates || {};
            this.controllers = options.controllers || {};
            this.strategies = options.strategies || {};
            this.compiled_templates = options.compiled_templates || {};
            this.timers = {};

            //If parent controller is specified, redirect everything from it
            if (this.parent_controller !== null) {
                this.cm_context = this.parent_controller.getContext();
                this.l10n = this.parent_controller.getl10n();
                this.models = this.parent_controller.getModels();
                this.collections = this.parent_controller.getCollections();
                this.controllers = this.parent_controller.getControllers();
                this.strategies = this.parent_controller.getStrategies();
                this.templates = this.parent_controller.getTemplates();
            }

            if (!this.cm_context.main || !this.cm_context.sub) {
                // Debug used instead of throw because of unit testing
                debug('Please specify "cm_context" during controller initialization.');
            }
        },

        /**
         * Registers component under the window context
         *
         * @see CM.register()
         */
        registerComponent: function(id, component, subcontext) {
            var ctx = {
                main: this.cm_context.main,
                sub: subcontext || this.cm_context.sub
            };

            return CM.register(ctx, id, component);
        },

        /**
         * Returns window component manager context. If sub_context parameter is specified returns main context from
         * window and sub-context given as a param
         *
         * @param {String} sub_context
         * @return {Object}
         */
        getContext: function(sub_context) {
            if (sub_context) {
                return {
                    main: this.getMainContext(),
                    sub: sub_context
                };
            } else {
                return this.cm_context;
            }
        },

        /**
         * Returns name of the main context of the window
         *
         * @return {String}
         */
        getMainContext: function() {
            return this.cm_context.main;
        },

        /**
         * Returns name of the sub context of the window
         *
         * @return {String}
         */
        getSubContext: function() {
            return this.cm_context.sub;
        },

        /**
         * Returns component object register in the context of this window
         *
         * @return {jQuery Object}
         */
        getComponent: function(name, subcontext) {
            var ctx = {
                main: this.cm_context.main,
                sub: subcontext || this.cm_context.sub
            };

            return CM.get(ctx, name);
        },

        /**
         * returns a compiled name by name
         * @param {string} name
         * @returns {function} underscore template
         */
        getCompiledTemplate: function(name) {
            return this.compiled_templates[name] || null;
        },

        /**
         * compiles and stores a template with given name
         * @param {string} name
         * @returns {function} underscore template
         */
        compileTemplate: function(template_name) {
            if (!this.templates[template_name]) {
                throw 'No such template: ' + template_name;
            }
            this.compiled_templates[template_name] = us.template(this.templates[template_name]);
            return this.compiled_templates[template_name];
        },

        /**
         * Returns template
         *
         * @param {String} [name]      template name
         * @param {String} [subpart]   jquery matcher to get subpart of template
         *
         * @return {String|Array}
         */
        getTemplate: function(name, subpart) {
            var template = this.templates[name] || null;

            if (template && subpart) {
                template = $(template).find(subpart).html();
            }

            return template;
        },

        /**
         * Returns all templates
         *
         * @return {Array}
         */
        getTemplates: function() {
            return this.templates;
        },

        /**
         * add a template, throws an error if game.dev and template already exists
         * @param {string} name
         * @param {string} template
         */
        addTemplate: function(name, template) {
            if (Game.dev && this.templates[name]) {
                throw 'Template you are trying to add already exists';
            }

            this.templates[name] = template;
        },

        /**
         * Registers event listener 'binded' directly with controller, so can be removed when its destroyed.
         *
         * @param {String} event_name   @see GameEvents
         * @param {Function} callback
         */
        observeEvent: function(event_name, callback) {
            $.Observer(event_name).subscribe([this.getMainContext(), this.getSubContext()], callback);
        },
        /**
         * Unregisters event listener 'binded' directly to controller
         *
         * @param {String} event_name   @see GameEvents
         */
        stopObservingEvent: function(event_name) {
            $.Observer(event_name).unsubscribe([this.getMainContext(), this.getSubContext()]);
        },

        /**
         * Unregisters event listeners
         */
        stopObservingEvents: function() {
            $.Observer().unsubscribe([this.getMainContext(), this.getSubContext()]);
        },

        /**
         * Triggers event defined in events.js
         *
         * @param {String} event_name   @see GameEvents
         * @param {Object} data
         */
        publishEvent: function(event_name, data) {
            data = typeof data !== 'undefined' ? data : {};

            $.Observer(event_name).publish(data);
        },

        /**
         * Returns all components from the context
         *
         * @param {String} subcontext
         * @return {Object}
         */
        getComponents: function(subcontext) {
            var ctx = {
                main: this.getMainContext(),
                sub: subcontext || this.getSubContext()
            };

            return CM.getSubGroup(ctx);
        },

        searchInSubGroupFor: function(subcontext, regex, fn) {
            var ctx = {
                main: this.getMainContext(),
                sub: subcontext || this.getSubContext()
            };

            return CM.searchInSubGroupFor(ctx, regex, fn);
        },

        getElementsFromSubGroups: function(subcontext, name) {
            var ctx = {
                main: this.getMainContext(),
                sub: subcontext || this.getSubContext()
            };

            return CM.getElementsFromSubGroups(ctx, name);
        },

        /**
         * Unregister single component
         *
         * @param {String} name         components name
         * @param {String} subcontext   subcontext name
         */
        unregisterComponent: function(name, subcontext) {
            var ctx = {
                main: this.getMainContext(),
                sub: subcontext || this.getSubContext()
            };

            CM.unregister(ctx, name);
        },

        unregisterComponents: function(subcontext) {
            var ctx = {
                main: this.getMainContext(),
                sub: subcontext || this.getSubContext()
            };

            CM.unregisterSubGroup(ctx);
        },

        createContextTimerName: function(name) {
            return this.getMainContext() + ':' + this.getSubContext() + ':' + name;
        },

        //TODO
        //does not warn when registering a timer with same name twice
        registerTimer: function(name, interval, callback, options) {
            var timer_name = this.createContextTimerName(name);
            TM.register(timer_name, interval, callback, options || {});

            this.timers[timer_name] = true;
        },

        // TODO:
        // register a timer once, and updates local bookkeeping
        // but the timer does not get removed from this.timer after
        // it is fired (once)
        registerTimerOnce: function(name, interval, callback) {
            var timer_name = this.createContextTimerName(name);
            TM.once(timer_name, interval, callback);

            this.timers[timer_name] = true;
        },

        unregisterTimer: function(name) {
            var timer_name = this.createContextTimerName(name);
            TM.unregister(timer_name);

            delete this.timers[timer_name];
        },

        unregisterTimers: function() {
            var timers = this.timers;

            for (var timer_name in timers) {
                if (timers.hasOwnProperty(timer_name)) {
                    TM.unregister(timer_name);
                }
            }
            this.timers = {};
        },

        /**
         * Returns model
         *
         * @param {String} name
         * @return {Backbone.Model}
         */
        getModel: function(name) {
            return this.models[name];
        },

        getModels: function() {
            return this.models;
        },

        getStrategy: function(name) {
            return this.strategies[name];
        },

        addStrategy: function(name, strategy) {
            this.strategies[name] = strategy;
        },

        getStrategies: function() {
            return this.strategies;
        },

        /**
         * Returns collection
         *
         * @param {String} name
         * @return {Backbone.Collection}
         */
        getCollection: function(name) {
            return this.collections[name];
        },

        getCollections: function() {
            return this.collections;
        },

        /**
         * Returns translations
         *
         * @param {String} name
         * @return {Object}
         */
        getl10n: function(name) {
            return name ? this.l10n[name] : this.l10n;
        },

        /**
         * Displays all events which are binded to the controller
         */
        status: function() {
            MM.listBindedEvents(this);
        },

        /**
         * Registers controller as a sub controller, which ables to clean up it when parent
         * controller is being destroyed
         *
         * @param {String} name
         * @param {Object} obj
         *
         * @return {Object} obj
         */
        registerController: function(name, obj) {
            this.controllers[name] = obj;

            return obj;
        },

        unregisterController: function(name) {
            //Saving controller in the variable, and deleting it before destroying, because if you do that
            //after destroy it will 'call stack exceed'
            var controller_to_delete = this.controllers[name];

            if (!controller_to_delete) {
                return;
            }

            delete this.controllers[name];

            controller_to_delete._destroy();
        },

        /**
         * @alias
         */
        destroyController: function(name) {
            this.unregisterController(name);
        },

        destroyControllers: function() {
            var controllers = this.controllers,
                controller_name;

            //Destroy also sub-controllers used by this controller
            for (controller_name in controllers) {
                if (controllers.hasOwnProperty(controller_name)) {
                    this.destroyController(controller_name);
                }
            }
        },

        /**
         * Returns instance of the controller
         *
         * @param {String} name
         * @return {Object}
         */
        getController: function(name) {
            return this.controllers[name];
        },

        getControllers: function() {
            return this.controllers;
        },

        destroyView: function() {
            //Destroy view
            if (this.view) {
                if (this.view instanceof GameViews.BaseView) {
                    this.view._destroy();
                } else {
                    if (typeof this.view.destroy === 'function') {
                        this.view.destroy();
                    }
                }
            }
        },

        _destroy: function() {
            GameControllers.WithMultiEventsListener.prototype._destroy.call(this, arguments);

            this.destroyControllers();

            //Stop triggering multievents
            this.unregisterMultiEventsListeners();

            this.unregisterTimers();

            //Stop listening on the models and collections (does not handle events binded with .on())
            this.stopListening();

            //Unregister all components
            this.unregisterComponents();

            //Unsubscribe all observed events
            this.stopObservingEvents();

            //Destroy view
            this.destroyView();

            //Check if the controller implements its own destroy method - it should...
            if (typeof this.destroy === 'function') {
                //Call custom destroy method
                this.destroy();
            }

            //Clean variable - keep it as last one, maybe controller will want to do some stuff
            this.view = null;
        }
    });
});