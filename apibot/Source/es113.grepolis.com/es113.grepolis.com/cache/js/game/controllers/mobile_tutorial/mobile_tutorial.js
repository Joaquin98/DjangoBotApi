/*global GameViews, GameControllers */

(function() {
    'use strict';

    var FIRST_PAGE = 0,
        LAST_PAGE = 4;

    window.GameControllers.MobileTutorialController = GameControllers.TabController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
            this.acitve_tutorial_page = FIRST_PAGE;
        },

        renderPage: function() {
            new GameViews.MobileTutorialView({
                el: this.$el,
                controller: this
            });
            this.player_hints = this.getCollection('player_hints');

            return this;
        },

        onBtnDontShowTutorialAgainClick: function() {
            //Disable hint
            this.player_hints.disableHint('mobile_tutorial');
            //Close window
            this.closeWindow();
        },

        getCurrentPage: function() {
            return this.acitve_tutorial_page;
        },

        isFirstPageActive: function() {
            return this.acitve_tutorial_page === FIRST_PAGE;
        },

        isLastPageActive: function() {
            return this.acitve_tutorial_page === LAST_PAGE;
        },

        setTutorialPage: function(direction) {
            this.acitve_tutorial_page = this.acitve_tutorial_page + direction;
            if (this.acitve_tutorial_page < FIRST_PAGE) {
                this.acitve_tutorial_page = FIRST_PAGE;
            }
            if (this.acitve_tutorial_page > LAST_PAGE) {
                this.acitve_tutorial_page = LAST_PAGE;
            }
        },

        destroy: function() {

        }
    });
}());