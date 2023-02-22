(function() {
    "use strict";

    var GrepolisCollection = window.GrepolisCollection;
    var Buildings = window.GameModels.Buildings;

    var TownBuildings = function() {}; // never use this, becasue it will be overwritten

    TownBuildings.model = Buildings;
    TownBuildings.model_class = 'Buildings';

    window.GameCollections.TownBuildings = GrepolisCollection.extend(TownBuildings);
}());