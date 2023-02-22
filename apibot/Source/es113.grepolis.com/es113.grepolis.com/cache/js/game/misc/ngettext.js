// in case it gets merged twice
(function() {
    'use strict';

    if (typeof window.ngettext !== 'function') {
        /**
         * Takes plural or singular form depends on the number
         *
         * @param {String} s   singular form
         * @param {String} p   plural form
         * @param {Number} n   count
         *
         */
        window.ngettext = function(s, p, n) {
            s = (n === 1) ? s : (p instanceof Array) ? p[0] : p;

            if (DebugTranslations.isEnabled()) {
                return DebugTranslations.markString(s);
            }

            return s;
        };
    }
}());