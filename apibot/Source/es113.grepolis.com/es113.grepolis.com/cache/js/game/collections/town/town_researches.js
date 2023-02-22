(function() {
    "use strict";

    var GrepolisCollection = window.GrepolisCollection;
    var Researches = window.GameModels.Researches;

    var TownResearches = function() {}; // never use this, becasue it will be overwritten

    TownResearches.model = Researches;
    TownResearches.model_class = 'Researches';

    window.GameCollections.TownResearches = GrepolisCollection.extend(TownResearches);
}());