/*global Backbone */

(function(views, collections, models) {
    "use strict";

    collections.WindowsCollection = Backbone.Collection.extend({
        model: models.WindowModel,

        /**
         * Returns array of all window models
         *
         * @return {Array}
         */
        getOpenedWindows: function() {
            return this.models;
        },

        getOpenedClosableWindows: function() {
            var window, windows = this.models,
                i, l = windows.length,
                closable = [];

            for (i = 0; i < l; i++) {
                window = windows[i];

                if (window.isClosable() && !window.getIsImportant()) {
                    closable.push(window);
                }
            }

            return closable;
        },

        hasWindow: function(identifier) {
            return this.find(function(model) {
                return model.getIdentifier() === identifier;
            });
        },

        /**
         * Removes focus from the currently focused window and adds it to the new one given as a param
         *
         * @param {WindowModel} window_model
         */
        bringToFront: function(window_model) {
            var window, windows = this.getOpenedWindows();

            //Remove focus from all windows
            for (var i = 0, l = windows.length; i < l; i++) {
                window = windows[i];

                windows[i].removeFocus();
            }

            //Add focus to the current one
            window_model.setFocus(true);
        },

        /**
         * Listens on the 'focused' changes on the windows
         *
         * @param {Function} callback
         */
        onFocusChange: function(callback) {
            this.on("change:focused", callback);
        }
    });
}(window.WindowManagerViews, window.WindowManagerCollections, window.WindowManagerModels));