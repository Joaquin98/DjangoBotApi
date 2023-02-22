define('helpers/browser', function() {
    'use strict';

    function isIEAndVersionLessThanOrEqual(version) {
        var userAgent = navigator.userAgent;
        var ua = userAgent.toLowerCase();

        var match = /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) || [];

        return (match[1] === 'msie' || match[1] === 'rv') && parseInt(match[2], 10) <= version;
    }

    return {
        // GP-25450 put browser checking functions here

        /**
         * @return {Boolean} true if the browser is any version of ie
         */
        isIE: function() {
            // GP-25450 should this also include edge?
            return isIEAndVersionLessThanOrEqual(11);
        },

        /**
         * @return {Boolean} true if the browser is <= ie11
         */
        isIE11OrLower: function() {
            return isIEAndVersionLessThanOrEqual(11);
        },

        /**
         * @return {Boolean} true if the browser is <= ie10
         */
        isIE10OrLower: function() {
            return isIEAndVersionLessThanOrEqual(10);
        }
    };
});