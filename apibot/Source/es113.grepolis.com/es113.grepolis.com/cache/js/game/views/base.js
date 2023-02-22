/* global Backbone */
(function() {
    'use strict';

    // standard functionalities passed to all templates
    var ViewHelper = require('view/helper');

    var BaseView = Backbone.View.extend({
        //Keeps reference to the controller
        controller: null,

        initialize: function(options) {
            this.controller = options.controller;
            this.options = options;
        },

        /**
         * @see BaseController
         */
        registerComponent: function(id, component, subcontext) {
            return this.controller.registerComponent(id, component, subcontext);
        },

        /**
         * @see BaseController
         */
        unregisterComponent: function(name, subcontext) {
            this.controller.unregisterComponent(name, subcontext);
        },

        /**
         * @see BaseController
         */
        unregisterComponents: function(subcontext) {
            this.controller.unregisterComponents(subcontext);
        },

        getComponent: function(name, subcontext) {
            return this.controller.getComponent(name, subcontext);
        },

        registerViewComponents: function() {

        },

        _getTemplate: function(template_name) {
            var template;
            var compiled_template = this.controller.getCompiledTemplate(template_name);

            if (compiled_template !== null) {
                template = compiled_template;
            } else {
                template = this.controller.compileTemplate(template_name);
            }

            return template;
        },

        getTemplate: function(template_name, data) {
            if (!data) {
                throw 'Please specify \'data\' parameter when you use getTemplate method from the View. ';
            }

            // make an object containing all partial templates pre-rendered {
            var partial_names = (data.partials || []),
                partials = partial_names.reduce(function(o, name) {
                    o[name] = o[name] || this._getTemplate(name)(data);
                    return o;
                }.bind(this), {}),
                template = this._getTemplate(template_name);

            // add ViewHelper to template
            data = $.extend({}, ViewHelper(partials), data);

            return template(data);
        },

        renderTemplate: function($el, template_name, data) {
            $el.empty().html(this.getTemplate(
                template_name, data
            ));
        },

        _destroy: function() {
            if (typeof this.destroy === 'function') {
                this.destroy();
            }
            this.$el.off();
        }
    });

    window.GameViews.BaseView = BaseView;
}());