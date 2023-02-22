/*globals GameControllers, GameViews, GameEvents */
(function() {
    "use strict";

    var LayoutConstructionQueueContainerController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            this.l10n = options.l10n;

            var construction_queue_controller = this.registerController('construction_queue', options.layout_main_controller.getConstructionQueueControllerObject(
                this.$el.find('.construction_queue_order_container'),
                this.templates.construction_queue,
                'layout_construction_queue'
            ));

            construction_queue_controller.renderPage();

            this.initializeEventsListeners();
        },

        initializeEventsListeners: function() {
            //Listen on the city overview initialization
            this.observeEvent(GameEvents.building.city_overview.initialized, this.show.bind(this));
            this.observeEvent(GameEvents.building.city_overview.destroyed, this.hide.bind(this));
        },

        renderPage: function() {
            this.view = new GameViews.LayoutConstructionQueueContainer({
                el: this.$el,
                controller: this,
                l10n: this.l10n
            });

            this.show();

            return this;
        },

        /**
         * Shows view container
         */
        show: function() {
            this.view.show();
        },

        /**
         * Hides view container
         */
        hide: function() {
            this.view.hide();
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutConstructionQueueContainerController = LayoutConstructionQueueContainerController;
}());