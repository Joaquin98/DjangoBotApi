/* global Backbone*/

(function() {
    "use strict";

    var SoundCategory = Backbone.Collection.extend({
        // Don't remove otherwise everything breaks
        initialize: function() {

        }
    });

    window.GameCollections.SoundCategory = SoundCategory;
}());