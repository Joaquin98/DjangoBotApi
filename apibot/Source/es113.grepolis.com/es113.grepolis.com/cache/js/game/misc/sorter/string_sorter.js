(function() {
    "use strict";

    var AbstractSorter = window.AbstractSorter;

    function StringSorter() {

    }

    StringSorter.prototype = new AbstractSorter();

    /**
     * Compare function for {Number} comparison
     *
     * @param {String} a
     * @param {String} b
     * @returns {Number}
     */
    StringSorter.prototype.compare = function(a, b) {
        /**
         * In newer browser versions there is the possibility to use Intl.Collator()
         * with special parameters for ignoring punctuation or specifying different locales, which would match
         * the sorting from the database better. But this slows the browser down, if big arrays/objects are sorted.
         *
         * So only strip whitespaces here for sorting, since the locale definition of en_US in postgres ignores them also.
         */
        if (a === null) {
            a = '';
        }

        if (b === null) {
            b = '';
        }

        a = a.toString().toLowerCase().replace(' ', '');
        b = b.toString().toLowerCase().replace(' ', '');

        return a.localeCompare(b);
    };

    window.StringSorter = StringSorter;
}());