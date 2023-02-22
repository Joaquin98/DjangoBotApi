/*global GameControllers */
(function() {
    "use strict";

    var IslandController = GameControllers.TabController.extend({
        view: null,

        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function(data) {
            console.log(data);

            return this;
        },

        destroy: function() {

        }
    });

    window.GameControllers.IslandController = IslandController;
}());