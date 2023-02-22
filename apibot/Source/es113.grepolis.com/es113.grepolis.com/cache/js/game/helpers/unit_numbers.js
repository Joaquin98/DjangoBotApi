define('helpers/unit_numbers', function() {
    'use strict';

    var ranges = [{
            value: 1E6,
            symbol_numeric_value: 1E6,
            symbol: 'M'
        },
        {
            value: 1E4,
            symbol_numeric_value: 1E3,
            symbol: 'k'
        },
        {
            value: 1E0,
            symbol_numeric_value: 1E0,
            symbol: ''
        }
    ];

    return {
        shortenNumber: function(value) {
            value = parseInt(value, 10);

            if (!value) {
                return 0;
            }

            var result_range = ranges.find(function(range) {
                    return value >= range.value;
                }),
                rounded_value = Math.round((value * 10) / result_range.symbol_numeric_value) / 10;

            if (rounded_value >= 100) {
                rounded_value = Math.trunc(rounded_value);
            }

            return rounded_value + result_range.symbol;
        },

        shortenUnitNumbers: function(units) {
            var result = {};

            Object.keys(units).forEach(function(id) {
                result[id] = this.shortenNumber(units[id]);
            }.bind(this));

            return result;
        }
    };
});