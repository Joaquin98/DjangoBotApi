/*globals Game*/

(function(window) {
    "use strict";

    window.GameDataNotes = {
        getMaxPossibeNotesCount: function() {
            return Game.constants.notes.max_notes;
        },

        getTitleMaxLength: function() {
            return Game.constants.notes.title_max_length;
        },

        getTextMaxLength: function() {
            return Game.constants.notes.text_max_length;
        }
    };
}(window));