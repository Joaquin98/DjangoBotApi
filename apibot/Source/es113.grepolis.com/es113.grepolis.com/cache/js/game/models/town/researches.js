(function() {
    "use strict";

    var Researches = function() {};

    Researches.urlRoot = 'Researches';

    /**
     * Returns information if research is researched in the town
     *
     * @param {String} research_id   the id of a research
     *
     * @return {Boolean}
     */
    Researches.hasResearch = function(research_id) {
        return this.get(research_id) === true;
    };

    /**
     * Returns information if research is researched in the town
     *
     * @return {Boolean}
     */
    Researches.hasConscription = function() {
        return this.get('conscription') === true;
    };

    /**
     * Returns information if research is researched in the town
     *
     * @return {Boolean}
     */
    Researches.hasMathematics = function() {
        return this.get('mathematics') === true;
    };

    /**
     * Returns information if research is researched in the town
     *
     * @return {Boolean}
     */
    Researches.hasShipwright = function() {
        return this.get('shipwright') === true;
    };

    /**
     * Returns information if research is researched in the town
     *
     * @return {Boolean}
     */
    Researches.hasInstructor = function() {
        return this.get('instructor') === true;
    };

    /**
     * Returns information if research is researched in the town
     *
     * @return {Boolean}
     */
    Researches.hasBerth = function() {
        return this.get('berth') === true;
    };

    Researches.onResearchesChange = function(obj, callback) {
        obj.listenTo(this, 'change', callback);
    };

    Researches.finalize = function() {
        this.off();
        this.stopListening();
    };

    window.GameModels.Researches = GrepolisModel.extend(Researches);
}());