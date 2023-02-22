(function() {
    "use strict";

    var MassRecruitUnit = function(data) {
        this.data = data;
    };

    MassRecruitUnit.prototype.setMax = function(value) {
        this.data.max = value;
    };

    MassRecruitUnit.prototype.getId = function() {
        return this.data.id;
    };

    MassRecruitUnit.prototype.getMax = function() {
        return this.data.max;
    };

    MassRecruitUnit.prototype.getAmount = function(type) {
        return type === "count" || type === "all" || type === "total" ? this.data[type] || 0 : this.data.count;
    };

    MassRecruitUnit.prototype.hasNoDependencies = function() {
        return this.data.dep;
    };

    MassRecruitUnit.prototype.hasDependencies = function() {
        return !this.hasNoDependencies();
    };

    MassRecruitUnit.prototype.updateCount = function(value) {
        this.data.count = value;
    };

    MassRecruitUnit.prototype.updateTotal = function(value) {
        this.data.total = value;
    };

    /**
     * Returns data object
     *
     * @return {Object}
     */
    MassRecruitUnit.prototype.getData = function() {
        return this.data;
    };

    /**
     * Sets research factor
     *
     * @param {Number} value
     */
    MassRecruitUnit.prototype.setResearchFactor = function(value) {
        this.data.research_factor = value;
    };

    /**
     * Returns research factor
     *
     * @return {Number}
     */
    MassRecruitUnit.prototype.getResearchFactor = function() {
        return this.data.research_factor;
    };

    window.MassRecruitUnit = MassRecruitUnit;
}());