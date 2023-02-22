/* globals WM */

/**
 * This Object uses pre-defined settings to create/open windows
 */
window.WF = (function(views, collections, models, settings) {
    'use strict';

    var Module = {
        /**
         * Opens window depends on the window type
         *
         * @param {String} window_type   window type defined in WindowsFactory
         * @param {Object} [props]       an hash array which contains additional settings
         *     models             already initialized Backbone.Model, key identifies it in the view
         *     collections        already initialized Backbone.Collection, key identifies it in the view
         *     args               will be send to the backend and passed to Api.read() as argument
         *     window_settings    window settings which may be used to overwrite the default ones
         *
         * @return {Object}   Backbone.Model of window
         */
        open: function(window_type, props) {
            props = props || {};

            var settings = this.getSettings(window_type, props.window_settings);

            if (settings.execute) {
                return settings.execute();
            } else {
                return WM.openWindow(settings, props);
            }
        },

        /**
         * Returns settings for specific type of window
         *
         * @param {String} window_type   window type defined in WindowsFactory
         * @param {Object} wnd_sett         window settings which may be used to overwrite the default ones
         *
         * @return {Object}
         */
        getSettings: function(window_type, props) {
            if (!settings[window_type]) {
                throw 'Please check whether you specified window settings for ' + window_type + ' and if you updated windows/ids.js';
            }

            return settings[window_type](props);
        }
    };

    return Module;
}(window.GameViews, window.GameCollections, window.GameModels, window.WindowFactorySettings));