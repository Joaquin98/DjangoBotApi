var DataManager = function() {
    'use strict';

    //Data types which are saved in the application
    var data_types = ['templates', 'staticdata', 'l10n'];

    //Stored data received from the server
    var storage = {
        templates: {},
        staticdata: {},
        l10n: {}
    };

    /**
     * Saves data in the game
     *
     * @param data_obj {Object}  Response object contains templates, static or dynamic data,
     *                       need to have the same structure as all our responces (all these params are optional)
     *                       {
     *							"data" : {...},
     *							"templates" : {},
     *							"staticdata" : {},
     *							"update" : {}
     *                       }
     */
    var saveData = function(data_obj) {
        var i, l = data_types.length,
            data_type, category, data;

        for (i = 0; i < l; i++) {
            data_type = data_types[i];
            data = data_obj[data_type];

            if (data) {
                for (category in data) {
                    if (data.hasOwnProperty(category)) {
                        //Save data for futher reuse
                        if (!storage[data_type][category]) {
                            storage[data_type][category] = {};
                        }

                        $.extend(true, storage[data_type][category], data[category]);
                    }
                }
            }
        }
    };

    function createObjectsPaths(obj, path) {
        if (path.length === 0) {
            return;
        }

        var name = path.shift();

        if (!obj[name]) {
            obj[name] = {};
        }

        createObjectsPaths(obj[name], path);
    }

    var Module = {
        get: function(type, category, name) {
            var bunch = storage[type][category];

            if (!bunch) {
                return {
                    error: "'" + type + "' '" + category + "-" + name + " doesn't exist. Please check settings.js for this window, and check if the correct action is called, or/and whether template file is not empty."
                };
            }

            return bunch[name] || bunch;
        },

        has: function(type, category, name) {
            var bunch = storage[type][category];

            return bunch && bunch[name];
        },

        hasTemplate: function(category, name) {
            return this.has('templates', category, name);
        },

        /**
         * Returns template which is stored in the cache
         *
         * @param {String} name
         *
         * @return {String}
         *
         */
        getTemplate: function(category, name) {
            return this.get('templates', category, name);
        },

        /**
         * Returns static data which is stored in the cache
         *
         * @param {String} name
         *
         * @return {Object}
         */
        getStaticData: function(category, name) {
            return this.get('staticdata', category, name);
        },

        /**
         * Returns translations which are stored in the cache
         *
         * @param {String} name
         *
         * @return {Object}
         */
        getl10n: function(category, name) {
            return this.get('l10n', category, name);
        },

        /**
         * Saves data in the game
         * @link   look to @private saveData for more informations
         */
        loadData: function(data) {
            saveData(data);
        },

        loadRelatedl10n: function(category, name, data) {
            var data_obj = {};

            createObjectsPaths(data_obj, ["l10n", category, name]);

            data_obj.l10n[category][name] = data;

            saveData(data_obj);
        },

        status: function(type) {
            return storage[type];
        }
    };

    // for compatibility reasons
    Module.showStatus = Module.status;

    return Module;
};

window.DM = new DataManager();