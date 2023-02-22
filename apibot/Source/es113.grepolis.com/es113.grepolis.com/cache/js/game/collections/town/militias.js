(function() {
    "use strict";

    var GrepolisCollection = window.GrepolisCollection;
    var Militia = window.GameModels.Militia;

    var Militias = function() {}; // never use this, becasue it will be overwritten

    Militias.model = Militia;
    Militias.model_class = 'Militia';

    window.GameCollections.Militias = GrepolisCollection.extend(Militias);
}());