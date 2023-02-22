/*globals GameControllers, GameViews, NotesWindowFactory */
(function() {
    'use strict';

    var LayoutButtonNotepadController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.LayoutButtonNotepad({
                el: this.$el,
                controller: this
            });

            return this;
        },

        handleClickEvent: function() {
            // old notepad
            //NotesWindowFactory.openOldNotesWindow();
            // new notepad
            NotesWindowFactory.openNotesWindow();
        },

        destroy: function() {

        }
    });

    window.GameControllers.LayoutButtonNotepadController = LayoutButtonNotepadController;
}());