(function() {
    "use strict";

    var Celebration = GrepolisModel.extend({
        urlRoot: 'Celebration',

        getFinishedAt: function() {
            return this.get('finished_at');
        },

        /**
         * Returns the type of the celebration
         *
         * @return {String}
         */
        getCelebrationType: function() {
            return this.get('celebration_type');
        },

        getTownId: function() {
            return this.get('town_id');
        }
    });

    window.GameModels.Celebration = Celebration;
}());