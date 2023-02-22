(function() {
    "use strict";

    var Wonder = function() {};

    Wonder.urlRoot = 'Wonder';

    Wonder.getType = function() {
        return this.get('wonder_type');
    };

    Wonder.getExpansionStage = function() {
        return this.get('expansion_stage');
    };

    Wonder.isMaxExpansionStage = function() {
        return this.getExpansionStage() >= Game.constants.wonder.max_expansion_stage;
    };

    window.GameModels.Wonder = GrepolisModel.extend(Wonder);
}());