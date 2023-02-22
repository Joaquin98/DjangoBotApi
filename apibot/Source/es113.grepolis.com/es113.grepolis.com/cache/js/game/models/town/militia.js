/* globals GrepolisModel */
(function() {
    "use strict";

    var Militia = function() {}; // never use this, because it will be overwritten

    Militia.urlRoot = 'Militia';

    window.GameModels.Militia = GrepolisModel.extend(Militia);
}());