(function() {
    "use strict";

    var AbstractSorter = window.AbstractSorter;

    function NumberSorter() {

    }

    NumberSorter.prototype = new AbstractSorter();

    /**
     * Compare function for {Number} comparison
     *
     * @param {Number} a
     * @param {Number} b
     * @returns {Number}
     */
    NumberSorter.prototype.compare = function(a, b) {
        return parseFloat(a, 10) - parseFloat(b, 10);
    };

    window.NumberSorter = NumberSorter;
}());