/*global console, Game */

/**
 * A class which makes managing components much simplier
 */
var ComponentsManager = function() {
    "use strict";

    //Keeps instances of all registered components
    var components = {};

    //Keeps informations about all errors
    var errors_msgs = [];

    function addErrorLog(error_obj) {
        errors_msgs[errors_msgs.length] = error_obj;
    }

    /**
     * Destroys objects which contains components
     */
    function destroyBunch(obj) {
        var id, item;

        for (id in obj) {
            if (obj.hasOwnProperty(id)) {
                item = obj[id];

                if (Game.dev && !item) {
                    throw "Registered component '" + id + "' is undefined. Check if the value you passed in the CM.register is correct.";
                }

                if (item.hasOwnProperty('destroy')) {
                    //Destroy if component
                    item.destroy();
                    delete obj[id];
                } else {
                    //Check subelements
                    destroyBunch(item);
                }
            }
        }
    }

    function checkArrayExistance(context) {
        var main = context.main,
            sub = context.sub;

        if (main && !components.hasOwnProperty(main)) {
            components[main] = {};
        }

        if (sub && !components[main].hasOwnProperty(sub)) {
            components[main][sub] = {};
        }
    }

    var Module = {
        /**
         * Registers component
         *
         * @param {Object} context   context under which component should be registered
         * @param {String} name      component name
         * @param {Object} obj       jQuery component object
         *
         * @return {Object}   jQuery component object
         *
         * ----------
         * Example:
         * ----------
         * var cm_ctx = {main : 100, sub : 'window_messages'};
         * CM.register(cm_ctx, 'component_name', compObject);
         *
         *
         * HINT
         * - Unregister component if you want to reinitialize it once again,
         *   components are automatically unregistered when you switch tab or close window.
         */
        register: function(context, name, obj) {
            var main = context.main,
                sub = context.sub;

            checkArrayExistance(context);

            if (!main || !sub || !name) {
                throw "You are trying to register component without specifying correct parameters (" + main + ", " + sub + ", " + name + ").";
            }

            if (components[main][sub][name]) {
                throw "Component " + name + " is already registered! ('" + main + "', '" + sub + "', '" + name + "')";
            }

            components[main][sub][name] = obj;

            return obj;
        },

        /**
         * Returns component instance depends on the specified context.
         *
         * @param {Object} context   context under which component should be registered
         * @param {String} name      component name
         *
         * @return {Object}  jQuery Component Object
         *
         * ----------
         * Example:
         * ----------
         * var cm_ctx = {main : 100, sub : 'window_messages'};
         * CM.get(cm_ctx, 'component_name');
         */
        get: function(context, name) {
            if (!components[context.main] || !components[context.main][context.sub]) {
                return false;
            }

            return components[context.main][context.sub][name];
        },

        /**
         * Looks in specific sub group for components which names matches regular expression
         *
         * @param {Object} context   context under which component should be registered
         * @param {String} regex     regular expression used with "test" function
         * @param {Function} fn      function which is executed for each component
         *							 found with one argument which is component jQuery object
         *
         * @return {Array}   an array which contains components which names mached the regular expression
         *
         * ----------
         * Example:
         * ----------
         * //In concrete context
         * var cm_ctx = {main : 100, sub : 'window_messages'};
         * CM.searchInSubGroupFor(cm_ctx, "txt_main_", function(_comp) {
         *    _comp.setValue('');
         * });
         *
         */
        searchInSubGroupFor: function(context, regex, fn) {
            var main = context.main,
                sub = context.sub;

            if (!components[main] || !components[main][sub]) {
                addErrorLog({
                    fn: 'searchInSubGroupFor',
                    params: arguments,
                    msg: 'Main or sub context can not be found'
                });
            }

            var elements = components[main][sub],
                id, returned = [];

            for (id in elements) {
                if (elements.hasOwnProperty(id) && new RegExp(regex).test(id)) {
                    returned[returned.length] = elements[id];

                    if (typeof fn === 'function') {
                        fn(elements[id]);
                    }
                }
            }

            return returned;
        },

        /**
         * Returns group of components
         *
         * @param {Object} context    context under which component should be registered
         * @param {String} sub        string which represents a subcontext name
         *
         * @return {Object}   A hash array which contains jQuery objects of components
         *
         */
        getSubGroup: function(context, sub) {
            var main = context.main;
            sub = sub || context.sub;

            if (!components[main] || !components[main][sub]) {
                if (Game.dev) {
                    console.warn("You are trying to get components from not existing subgroup.");
                }

                return {};
            }

            return components[main][sub];
        },

        /**
         * Use it in case when you registered components with the same name in
         * multiple subgroups. This function will return you an array with all of
         * them.
         *
         * @param {Object} context    context under which component should be registered
         * @param {String} name       component name
         *
         * @return {Object}   A hash array which contains jQuery objects of components
         *
         * ----------
         * Example:
         * ----------
         * var tabs = CM.getElementsFromSubGroups(context, 'tab_recruit_unit_types');
         *
         */
        getElementsFromSubGroups: function(context, name) {
            var elements = [],
                id,
                bunch = components[context.main];

            for (id in bunch) {
                if (bunch.hasOwnProperty(id) && bunch[id][name]) {
                    elements[elements.length] = bunch[id][name];
                }
            }

            return elements;
        },

        /**
         * Unregisters sub-group of components
         *
         * @param {Object} context   context under which component should be registered
         * @param {String} [sub]       string which represents a subcontext name
         *
         * ----------
         * Example 1:
         * ----------
         * CM.unregisterSubGroup(context); //will take "main" and "sub" from context
         *
         * ----------
         * Example 2:
         * ----------
         * CM.unregisterSubGroup(context, 'sub_group_name'); //will take "main" from context, and "sub" from sub
         *
         */
        unregisterSubGroup: function(context, sub) {
            var main = context.main;
            sub = sub || context.sub;

            if (!components[main] || !components[main][sub]) {
                return;
            }

            destroyBunch(components[main][sub]);
            delete components[main][sub];
        },

        /**
         * Unregisters group of components
         *
         * @param {String} main    string which represents a main context name
         *
         */
        unregisterGroup: function(main) {
            //Unregister components
            destroyBunch(components[main]);
            delete components[main];
        },

        unregister: function(context, name) {
            var main = context.main,
                sub = context.sub;

            if (!components[main] || !components[main][sub]) {
                return false;
            }

            if (components[main][sub][name]) {
                components[main][sub][name].destroy();
                delete components[main][sub][name];

                return true;
            }

            return false;
        },

        subGroupExist: function(context, sub) {
            var main = context.main;
            sub = sub || context.sub;

            return !!(components[main] && components[main][sub]);
        },

        /**
         * It is a helper function which displays currently registered components
         */
        showStatus: function() {
            var bunch_name, group_name, component_name, bunch, group, count = 0;

            console.group("COMPONENTS MANAGER (currently registered components)");

            for (bunch_name in components) {
                if (components.hasOwnProperty(bunch_name)) {
                    bunch = components[bunch_name];

                    console.group("Window ID: " + bunch_name);

                    for (group_name in bunch) {
                        if (bunch.hasOwnProperty(group_name)) {
                            group = bunch[group_name];

                            console.group("Group: " + group_name);

                            for (component_name in group) {
                                if (group.hasOwnProperty(component_name)) {
                                    count++;
                                    console.log("Component: " + component_name);
                                }
                            }
                            console.groupEnd();
                        }
                    }
                    console.groupEnd();
                }
            }

            if (count === 0) {
                console.log("None");
            }

            console.groupEnd();

            if (count > 0) {
                console.log("Summary: " + count + " component(s) registered.");
            }
        },

        showErrors: function() {
            var i, l = errors_msgs.length,
                error;

            console.group("ERROR LOG (" + l + " errors)");

            if (l > 0) {
                for (i = 0; i < l; i++) {
                    error = errors_msgs[i];

                    console.group("An error occured calling function: " + error.fn + " with following paremeters:");
                    console.log(error.params);
                    console.log("Hint: " + error.msg);
                    console.groupEnd();
                }
            } else {
                console.log("No errors found.");
            }

            console.groupEnd();
        }
    };

    return Module;
};