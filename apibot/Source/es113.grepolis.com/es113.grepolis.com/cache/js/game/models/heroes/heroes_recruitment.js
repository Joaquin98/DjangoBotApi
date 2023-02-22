/*global define, GameData, Timestamp, DM, Game */

(function() {
    "use strict";

    function HeroesRecruitment() {} // never use this, becasue it will be overwritten

    HeroesRecruitment.urlRoot = 'HeroesRecruitment';

    HeroesRecruitment.getHeroRecruitmentData = function() {
        return this.get('hero_recruitment_data');
    };

    /**
     * Returns timstamp of the next free call
     *
     * @return {Number}
     */
    HeroesRecruitment.getNextFreeSwapTime = function() {
        return this.get('next_swap_time');
    };

    /**
     * Binds a listener which will be executed when hero call data will change
     *
     * @param {Object} obj          object which is listening on changes
     * @param {Function} callback
     */
    HeroesRecruitment.onHeroRecruitmentDataChange = function(obj, callback) {
        obj.listenTo(this, 'change:hero_recruitment_data', callback);
    };

    /**
     * call force update on the backend to force pushing of model
     *
     * @returns {void}
     */
    HeroesRecruitment.forceUpdate = function() {
        this.execute('forceUpdate', {});
    };

    window.GameModels.HeroesRecruitment = GrepolisModel.extend(HeroesRecruitment);
}());