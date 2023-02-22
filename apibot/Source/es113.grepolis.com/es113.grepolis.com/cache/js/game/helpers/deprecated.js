(function() {
    'use strict';

    var DeprecatedHelper = {
        /**
         * @deprecated
         */
        parseToValidNumericValue: function(ele) {
            var value = $(ele).val();
            value = value.replace(/[^\d\.]/g, '');
            value = parseInt(value, 10);

            if (isNaN(value)) {
                value = '';
            }

            $(ele).val(value);
        }
    };

    window.DeprecatedHelper = DeprecatedHelper;
}());