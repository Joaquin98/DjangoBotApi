/*global Backbone, DM, CM, jQuery, us, GameControllers */

(function(views, collections, models, $) {
    'use strict';

    views.TabsView = Backbone.View.extend({
        current_page_controller: null,

        initialize: function(options) {
            this.extended_window_manager = options.extended_window_manager;
            this.window_model = options.window_model;

            //Find container where tabs should be placed
            this.$tabs = this.$el.find('.js-tabs_container');
            this.$content = this.$el.find('.js-window-content');

            this.collection.on('add', this.render, this);
            this.window_model.on('change:activepagenr', this.render, this);
            this.collection.on('change:hidden', this.renderTabs, this);

            this.collection.onTabVisibilityChange(this, this.renderTabs.bind(this));
            this.collection.onTabEnabledStateChange(this, this.renderTabs.bind(this));
            this.collection.onTabNameChange(this, this.renderTabs.bind(this));
            this.collection.onTabHighlightChange(this, this.renderTabs.bind(this));

            //this.window_model.on("data:replaced", this.render, this);
        },

        render: function() {
            var activepagenr = this.window_model.getActivePageNr();

            var tab_model = typeof activepagenr === 'string' ? this.collection.getTabByType(activepagenr) : this.collection.getTabByNumber(activepagenr),
                TabContentConstructor = tab_model.get('content_view_constructor');

            if (!TabContentConstructor) {
                throw 'Tab Content Constructor is not defined in settings.js for your window: ' + tab_model.getType();
            }

            //Clean up window content
            this._cleanUp();

            //Initialize controller of the current tab
            this.current_page_controller = new TabContentConstructor({
                el: this.$content,
                model: tab_model,
                window_model: this.window_model,
                extended_window_manager: this.extended_window_manager,
                cm_context: {
                    main: this.window_model.cid,
                    sub: tab_model.cid
                }
            }).render();

            this.renderTabs();
        },

        renderTabs: function() {
            var tab_head_template = DM.getTemplate('COMMON', 'wnd_skin_tabs'),
                activepagenr = this.window_model.getActivePageNr();

            this.$tabs.html(us.template(tab_head_template, {
                activepagenr: activepagenr,
                tabs: this.collection
            }));
        },

        /**
         * Destroys page object
         */
        _cleanUp: function() {
            //probably we can remove something, or move it to the BaseController
            var tab_controller = this.current_page_controller,
                ctx_main = this.window_model.getIdentifier();

            //Unregister components for the tab
            //this is important, for the ui we are unregistering only the subcontexts, but for windows entire main context
            CM.unregisterGroup(ctx_main);

            //Unsuscribe events
            $.Observer().unsubscribe('window_' + ctx_main);

            //Remove previous content
            this.$content.empty();

            //Remove all events from the tab container
            this.$content.off();

            //Window controllers should always inherit from TabController
            if (tab_controller && (tab_controller instanceof GameControllers.TabController)) {
                //Call only _destroy which is defined in BaseController
                //it will call destroy() itself
                if (typeof tab_controller._destroy === "function") {
                    tab_controller._destroy();
                }
            }

            this.current_page_controller = null;
        },

        /**
         * Destroys all stuff related with this subclass
         */
        _destroy: function() {
            //Destroy currently visible page
            this._cleanUp();

            this.collection.off(null, null, this);
            this.window_model.off(null, null, this);

            this.stopListening();
        }
    });
}(window.WindowManagerViews, window.WindowManagerCollections, window.WindowManagerModels, jQuery));