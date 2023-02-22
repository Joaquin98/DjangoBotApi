/*global GameEvents, DM, TM, GameControllers, us */

define('controllers/tab', function() {
    'use strict';

    var controllers = window.GameControllers;

    controllers.TabController = controllers.BaseController.extend({
        window_model: null,
        extended_window_manager: null,

        initialize: function(options) {
            controllers.BaseController.prototype.initialize.apply(this, arguments);

            this.window_model = options.window_model || null;
            this.extended_window_manager = options.extended_window_manager || null;

            //If parent controller is specified, redirect everything from it
            //see BaseController for more of this behavior
            if (this.parent_controller !== null) {
                this.window_model = this.parent_controller.getWindowModel();
                this.extended_window_manager = this.parent_controller.getExtendedWindowManager();
            }

            if (this.window_model) {
                this.tabs_collection = this.window_model.getTabsCollection();
            }

            this.renderPageProxy = function(data) {
                // new windows that are opened are always in the windows collection
                if (!this.isWindowModelInOpenWindowsCollection()) {
                    return;
                }
                var loaded_data = $.extend(true, {}, data);

                //TODO it calles DM.getl10n, but BaseController implements getl10n helper function
                loaded_data.l10n = DM.getl10n(this.window_model.getType()) || {};

                controllers.BaseController.prototype.initialize.apply(this, [loaded_data]);

                //TODO this.renderPage must be defined before renderPageProxy can be called,
                //but is never defined here or in BaseController
                this.renderPage(loaded_data);

                var event = this.window_model.isDialog() ? GameEvents.window.dialog.rendered : GameEvents.window.tab.rendered;

                $.Observer(event).publish({
                    window_model: this.window_model
                });
            }.bind(this);
        },

        // TODO render assumes that this.model exists on the controller
        // which is set outside of this controller and not enforced by TabController or BaseController
        render: function() {
            this.model.requestTabData(this.renderPageProxy, this.window_model);

            return this;
        },

        isWindowModelInOpenWindowsCollection: function() {
            var open_windows_collection = this.window_model.collection;
            return open_windows_collection && open_windows_collection.hasWindow(this.window_model.getIdentifier());
        },

        /**
         * @param data
         * {
         *     type: 'index',
         *     title: player_note.getTitle(),
         *     index : this.tab_index + 1,
         *     content_view_constructor: controllers.NotesController,
         *     hidden: false
         *	}
         */
        createNewWindowTab: function(data) {
            var tabs_collection = this.getWindowModel().getTabsCollection();
            var new_tab = new window.WindowManagerModels.TabModel(data);

            tabs_collection.add(new_tab);
        },

        /**
         * return the id of the current active tab
         *
         * @returns {number}
         */
        getActivePageNr: function() {
            return this.window_model.getActivePageNr();
        },

        /**
         * Changes active tab to one which is currently hidden
         *
         * @param {Number} tab_index
         */
        switchToHiddenTab: function(tab_index) {
            this.showTab(tab_index);
            this.switchTab(tab_index);
        },

        /**
         * Changes active tab in the window
         *
         * @param {Number} tab_index
         */
        switchTab: function(tab_index) {
            this.window_model.setActivePageNr(tab_index);
        },

        /**
         * Lets the tab glow to get attention
         * @param {number} tab_index
         * @param [options]
         * @param {boolean} options.permanent - if true, the highlight won't turn itself off after some seconds, but stay
         * @param {number} options.duration - the time in ms the tab should blink. Defaults to 4500
         */
        highlightTab: function(tab_index, options) {
            var tab = this.tabs_collection.getTabByNumber(tab_index),
                timer_id = 'tab_highlight_' + this.window_model.cid + '_' + tab_index,
                disableHighlight = tab.disableHighlight.bind(tab);

            // set defaults
            options = us.extend({
                permanent: false,
                duration: 4500
            }, options);

            tab.enableHighlight();

            if (!options.permanent) {
                TM.once(timer_id, options.duration, disableHighlight);
            }
        },

        unHighlightTab: function(tab_index) {
            this.tabs_collection.getTabByNumber(tab_index).disableHighlight();
        },

        setTabTitle: function(title, tab_index) {
            this.tabs_collection.setTabTitle(title, tab_index);
        },


        /**
         * Shows hidden tab
         *
         * @param {Number} tab_index
         */
        showTab: function(tab_index) {
            var tabs_collection = this.window_model.getTabsCollection();

            tabs_collection.showTab(tab_index);
        },

        /**
         * show all tabs in a window
         */
        showAllTabs: function() {
            var tabs_collection = this.window_model.getTabsCollection();

            tabs_collection.each(function(model, tab_index) {
                tabs_collection.showTab(tab_index);
            });
        },

        /**
         * Hides tab
         *
         * @param {Number} tab_index
         */
        hideTab: function(tab_index) {
            var tabs_collection = this.window_model.getTabsCollection();

            tabs_collection.hideTab(tab_index);
        },

        /**
         * hide all tabs
         */
        hideAllTabs: function() {
            var tabs_collection = this.window_model.getTabsCollection();

            tabs_collection.each(function(model, tab_index) {
                tabs_collection.hideTab(tab_index);
            });
        },

        setWindowTitle: function(title) {
            this.window_model.setTitle(title);
        },

        /**
         * Opens sub window, closes the current one, if it exists
         *
         * @param {Object} props
         *
         * @param {String} props.window_title          title which will be displaed in the sub window
         * @param {Controller} props.controller        @inherits BaseController
         * @param {String} props.css_classes           css classes which will be added on the main node (for example "class1 class2")
         *
         */
        openSubWindow: function(props) {
            if (this.sub_window) {
                this.sub_window.close();
            }

            var sub_window = new GameControllers.SubWindowController({
                $parent: this.$el,
                css_classes: props.skin_class_names,
                window_controller: this,
                l10n: {
                    title: props.title
                },
                cm_context: {
                    main: 'details_window',
                    sub: this.getWindowIdentifier()
                },
                closeable: props.closeable
            });

            // TODO remove the subwindow controller above. The one given in props should be sufficient
            // mean hack: we copy onBeforeClose callback from the props controller to the sub_window defined above
            sub_window.setOnBeforeClose(props.controller._onBeforeCloseCallback);
            sub_window.setOnAfterClose(props.controller._onAfterCloseCallback);

            this.disableTabs();
            this.sub_window = sub_window;
            sub_window.renderView(props.controller);

            return sub_window;
        },

        /**
         * Closes sub window if exists
         */
        closeSubWindow: function() {
            if (this.sub_window) {
                this.sub_window._destroy();
                this.sub_window = null;
            }
            this.enableTabs();
        },

        getSubWindowTitle: function() {
            return this.sub_window ? this.sub_window.getTitle() : undefined;
        },

        setSubWindowTitle: function(title) {
            if (this.sub_window) {
                this.sub_window.setTitle(title);
            }
        },

        reRenderSubWindow: function() {
            if (!this.sub_window) {
                return;
            }

            this.sub_window.reRender();
        },

        disableTabs: function() {
            if (this.window_model) {
                var tabs = this.window_model.getTabsCollection();
                tabs.disable();
            }
        },

        disableTab: function(tab_index) {
            var tabs_collection = this.window_model.getTabsCollection();

            tabs_collection.disableTab(tab_index);
        },

        enableTabs: function() {
            if (this.window_model) {
                var tabs = this.window_model.getTabsCollection();
                tabs.enable();
            }
        },

        enableTab: function(tab_index) {
            var tabs_collection = this.window_model.getTabsCollection();

            tabs_collection.enableTab(tab_index);
        },

        /**
         * It's maybe not the best place here, but I would say its good enough. Let me know if you find anything better
         *
         * This function opens tutorial window
         */
        openEventTutorialWindow: function(title, tutorial_sections_template) {
            var l10n = DM.getl10n('COMMON');

            var controller = new GameControllers.EventTutorialSubWindowController({
                l10n: {
                    prev: l10n.prev_lowercase,
                    next: l10n.next_lowercase,
                    close: l10n.close_lowercase
                },
                window_controller: this,
                templates: {
                    tutorial: tutorial_sections_template
                },
                cm_context: this.getContext('event_tutorial_sub_window')
            });

            this.openSubWindow({
                title: title,
                controller: controller,
                skin_class_names: 'classic_sub_window',
                center_top: true
            });
        },

        /**
         * Returns jQuery object of the HTML node which represents place where the content
         * for the sub window should be put
         *
         * @return {jQuery Object}
         */
        getSubWindowContentNode: function() {
            return this.$el.find('.js-details-window-content');
        },

        /**
         * Callback when X button on window is clicked
         * @param fn function to call onManualClose (if it returns false, window will not close)
         */
        setOnManualClose: function(fn) {
            this.
            window_model.setOnManualCloseCallback(fn);
        },

        setOnAfterClose: function(fn) {
            this.window_model.setOnAfterClose(fn);
        },

        setOnBeforeClose: function(fn) {
            this.window_model.setOnBeforeClose(fn);
        },

        getWindowModel: function() {
            return this.window_model;
        },

        getExtendedWindowManager: function() {
            return this.extended_window_manager;
        },

        getWindowIdentifier: function() {
            return this.getWindowModel().getIdentifier();
        },

        showLoading: function() {
            this.window_model.showLoading();
        },

        hideLoading: function() {
            this.window_model.hideLoading();
        },

        /**
         * Returns data which is loaded during opening window
         *
         * For instance:
         * return WF.open('world_wonders_welcome', {
         *		gift_data : gift_data
         *	});
         */
        getPreloadedData: function() {
            return this.window_model.getPreloadedData();
        },

        /**
         * Closes window
         */
        closeWindow: function() {
            this.window_model.close();
        },

        getArgument: function(arg_name) {
            return this.window_model.getArguments()[arg_name];
        },

        _destroy: function() {
            controllers.BaseController.prototype._destroy.call(this);

            //Destroy sub window
            this.closeSubWindow();
        }
    });
});