/* global Game */
define('alliance/collections/alliance_pacts', function() {
    'use strict';

    var GrepolisCollection = window.GrepolisCollection;
    var AlliancePact = require('alliance/models/alliance_pact');

    var AlliancePacts = function() {}; // never use this, becasue it will be overwritten

    AlliancePacts.model = AlliancePact;
    AlliancePacts.model_class = 'AlliancePact';

    AlliancePacts.getAllianceIdsByRelation = function(relation) {
        return this.where({
            relation: relation
        });
    };

    AlliancePacts.isInPeacePact = function(alliance_id) {
        var pact_info = this.findWhere({
            alliance_1_id: alliance_id,
            relation: 'peace'
        });
        if (!pact_info) {
            pact_info = this.findWhere({
                alliance_2_id: alliance_id,
                relation: 'peace'
            });
        }
        return (pact_info) ? true : false;
    };

    AlliancePacts.isInWarPact = function(alliance_id) {
        var pact_info = this.findWhere({
            alliance_1_id: alliance_id,
            relation: 'war'
        });
        return (pact_info) ? true : false;
    };

    AlliancePacts.isAllianceWithCurrentAllianceInPeacePact = function(alliance_id) {
        var peace_pact;
        if (alliance_id !== Game.alliance_id) {
            peace_pact = this.findWhere({
                alliance_1_id: alliance_id,
                relation: 'peace'
            });
            if (!peace_pact) {
                peace_pact = this.findWhere({
                    alliance_2_id: alliance_id,
                    relation: 'peace'
                });
            }
        }
        return peace_pact;
    };

    AlliancePacts.isAllianceWithCurrentAllianceInWarPact = function(alliance_id) {
        return this.findWhere({
            alliance_2_id: alliance_id,
            relation: 'war'
        });
    };

    AlliancePacts.getListOfAllianceIdsByRelation = function(relation) {
        var alliances = [];
        if (relation === 'war') {
            var war_alliances = this.getAllianceIdsByRelation('war');
            war_alliances.forEach(function(alliance) {
                alliances.push(alliance.getAlliance2Id());
            });
        } else if (relation === 'peace') {
            var peace_alliances = this.getAllianceIdsByRelation('peace');
            peace_alliances.forEach(function(alliance) {
                if (alliance.getAlliance1Id() === Game.alliance_id) {
                    alliances.push(alliance.getAlliance2Id());
                } else if (alliance.getAlliance2Id() === Game.alliance_id) {
                    alliances.push(alliance.getAlliance1Id());
                }
            });
        }
        return alliances;
    };

    AlliancePacts.onAlliancePactChange = function(obj, callback) {
        obj.listenTo(this, 'add remove change:relation', callback);
    };

    window.GameCollections.AlliancePacts = GrepolisCollection.extend(AlliancePacts);
    return window.GameCollections.AlliancePacts;
});