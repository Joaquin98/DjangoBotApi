(function() {
    "use strict";

    /**
     * Sort by direction.
     *
     * @param {Object} sorted
     * @param {String} direction 'desc' for descending, 'asc' for ascending order
     * @returns {Object}
     */
    var orderByDirection = function(sorted, direction) {
        direction = direction || 'asc';

        if (direction === 'desc') {
            sorted.reverse();
        }

        return sorted;
    };

    /**
     * Compares the value given by a closure.
     *
     * @param {Object} a
     * @param {Object} b
     * @param {Function} closure
     * @returns {Object}
     */
    var compareFunction = function(a, b, closure) {
        a = closure(a);
        b = closure(b);

        return this.compare(a, b);
    };

    /**
     * Compares a attribute.
     * Supported types are {Number}s and Strings.
     *
     * @param {Object} a
     * @param {Object} b
     * @param {Array} atts
     * @returns {Object}
     */
    var compareAttributes = function(a, b, atts) {
        a = getAttributeValue(a, atts);
        b = getAttributeValue(b, atts);

        return this.compare(a, b);
    };

    /**
     * Get a the value from {Object} by given attributes.
     *
     * @param {Object} obj
     * @param {Array} attribute
     * @returns {Object}
     */
    var getAttributeValue = function(obj, attribute) {
        var i, l = attribute.length;

        for (i = 0; i < l; i++) {
            obj = obj[attribute[i]];
        }

        return obj;
    };

    var compareBasic = function(closure, objects, provider, direction) {
        var sorted = objects.sort(
            function(a, b) {
                return closure.call(this, a, b, provider);
            }.bind(this)
        );
        sorted = orderByDirection(sorted, direction);

        return sorted;
    };

    function AbstractSorter() {

    }

    /**
     * Sort {Object}s by given attribute.
     *
     * @param {Array} objects
     * @param {Array} attributes To step further put more attributes in.
     * @param {String} [direction] 'desc' for descending, 'asc' for ascending order
     *
     * Example:
     * AbstractSorter.compareObjectsByAttribute(groups, ['data', 'name']);
     * It will compare the objects by obj.data.name
     *
     * @returns {Object}
     */
    AbstractSorter.prototype.compareObjectsByAttribute = function(objects, attributes, direction) {
        return compareBasic.call(this, compareAttributes, objects, attributes, direction);
    };

    /**
     * Sorts Objects by given closure. Use this to get access to values within the Object. The parameter of the
     * closure will be the Object which is used for the compareBasic.
     *
     * Example:
     * AbstractSorter.compareObjectsByFunction(groups, function(group) {return group.getName();});
     *
     *
     * @param {Array} objects
     * @param {Function} closure
     * @param {String} [direction] 'desc' for descending, 'asc' for ascending order
     * @returns {Object}
     */
    AbstractSorter.prototype.compareObjectsByFunction = function(objects, closure, direction) {
        return compareBasic.call(this, compareFunction, objects, closure, direction);
    };

    window.AbstractSorter = AbstractSorter;
}());