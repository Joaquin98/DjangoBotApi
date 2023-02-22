/*globals Game, DateHelper */

(function() {
    'use strict';

    var Order = window.GameModels.Order;

    var UnitOrder = function() {},
        ExtendedUnitOrder;

    UnitOrder.urlRoot = 'UnitOrder';

    /**
     * Returns build time for the order
     *
     * @return {Number}
     */
    UnitOrder.getBuildTime = Order.prototype.getBuildTime;

    /**
     * Returns time which left till the end of the build order
     *
     * @return {Number}
     */
    UnitOrder.getTimeLeft = Order.prototype.getTimeLeft;

    /**
     * Returns build time for single unit (unit which has been choosen for this specific order)
     *
     * @return {Number}
     */
    UnitOrder.getSingleUnitBuildTime = Order.prototype.getBuildTimePerPart;

    /**
     * Returns number of units which left to build
     *
     * @return {Number}
     */
    UnitOrder.getUnitsToBuildLeft = Order.prototype.countPartsLeft;

    /**
     * Returns type of the unit (ground or naval)
     *
     * @return {String}
     */
    UnitOrder.isGroundUnit = function() {
        return this.get('kind') === 'ground';
    };

    UnitOrder.getToBeCompletedAt = function() {
        return this.get('to_be_completed_at');
    };

    UnitOrder.getCreatedAt = function() {
        return this.get('created_at');
    };

    UnitOrder.getDuration = function() {
        return Math.max(0, this.getToBeCompletedAt() - this.getCreatedAt());
    };

    /**
     * Returns building type which produces these units
     *
     * @return {String}
     */
    UnitOrder.getProductionBuildingType = function() {
        return this.isGroundUnit() ? 'barracks' : 'docks';
    };

    /**
     * Returns model which represents previous order related to the one
     * which this model represents
     *
     * @return {GameModels.UnitOrder}
     */
    UnitOrder.getPreviousOrder = function() {
        if (Game.dev) {
            (console.warn || console.log).call(console, ('UnitOrder.getPreviousOrder has to be refactored. Model.collection is not to be used!!'));
        }
        return this.collection.getPreviousOrderById(this.getId(), this.getProductionBuildingType());
    };

    /**
     * get the type of order
     *
     * @returns {String} ground or naval
     */
    UnitOrder.getKind = function() {
        return this.get('kind');
    };

    /**
     * Returns number of units which has been selected to build
     * (at the begining, this number does not change over the time)
     *
     * @return {Number}
     */
    UnitOrder.getCount = UnitOrder.countParts = function() {
        return this.get('count');
    };

    /**
     * Returns unit id
     *
     * @return {String}
     */
    UnitOrder.getUnitId = function() {
        return this.get('unit_type');
    };

    /**
     * @alias
     */
    UnitOrder.getType = function() {
        return this.getUnitId();
    };

    /**
     * Returns timestamp which determinates when order has been created
     *
     * @return {Number}
     */
    UnitOrder.getCreatedAt = Order.prototype.getStartedAt;

    /**
     * Returns if of the order
     *
     * @return {Number}
     */
    UnitOrder.getId = function() {
        return this.id;
    };

    UnitOrder.getCancelRefund = function() {
        var refund_for_single_unit = this.get('refund_for_single_unit'),
            units_left = this.getUnitsToBuildLeft(),
            refund = {},
            res_id;

        for (res_id in refund_for_single_unit) {
            if (refund_for_single_unit.hasOwnProperty(res_id)) {
                refund[res_id] = refund_for_single_unit[res_id] * units_left;
            }
        }

        return refund;
    };

    UnitOrder.getCompletedAtHuman = function() {
        return DateHelper.formatDateTimeNice(this.getToBeCompletedAt(), true);
    };

    /**
     * The backend code that handles currently running unit orders has some tricky handlePartial behaviour.
     * It does calculate the already build units at a time and adds them to the unit model belonging to the same town.
     * Because this doesn't have to be correctly at the time the unit is done (it happens, if the backend does not the
     * new real unit numbers) we may need to improvise in the frontend.
     *
     * To get all units currently residing in a town without fetching the backend for partial calculations (pseudo code):
     *
     * town.home_units.getSword() + currently_running_town_unit_order_that_happens_to_build_swords.getBuildUnitsNotYetConsideredInUnit()
     *
     * @method getBuildUnitsAlreadyConsideredInUnit
     * @return {Integer}
     */
    UnitOrder.getBuildUnitsNotYetConsideredInUnit = function() {
        return this.get('units_left') - this.countPartsLeft();
    };

    UnitOrder.hasTearDown = function() {
        return false;
    };

    UnitOrder.isBeingTearingDown = function() {
        return this.hasTearDown() === true;
    };

    /**
     * Cancels an order
     */
    UnitOrder.cancelOrder = function() {
        var params = {
            unit_type: this.getKind()
        };

        this.execute('cancelOrder', params);
    };

    /**
     * Uses premium feature to reduct time of the build
     */
    UnitOrder.buildTimeReduct = function(callbacks) {
        var params = {
            order_id: this.getId()
        };

        this.execute('speedUpForGold', params, callbacks);
    };

    UnitOrder.buyInstant = function(callbacks) {
        var params = {
            order_id: this.getId()
        };

        this.execute('buyInstant', params, callbacks);
    };

    ExtendedUnitOrder = Order.extend(UnitOrder);

    window.GameModels.UnitOrder = ExtendedUnitOrder;
}());