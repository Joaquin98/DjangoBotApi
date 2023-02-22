define('alliance/models/alliance_pact', function() {
    'use strict';

    var GrepolisModel = window.GrepolisModel;

    function AlliancePact() {}

    AlliancePact.urlRoot = 'AlliancePact';

    GrepolisModel.addAttributeReader(AlliancePact,
        'alliance_1_id',
        'alliance_1_name',
        'alliance_2_id',
        'alliance_2_name',
        'creation_date',
        'invitation_pending',
        'relation'
    );

    window.GameModels.AlliancePact = GrepolisModel.extend(AlliancePact);
    return window.GameModels.AlliancePact;
});