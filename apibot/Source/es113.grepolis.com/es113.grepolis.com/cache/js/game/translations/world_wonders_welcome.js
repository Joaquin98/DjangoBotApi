(function() {
    "use strict";

    DM.loadData({
        l10n: {
            world_wonders_welcome: {
                window_title: _('A new age has begun!'),
                tabs: [],

                btn_lets_go: _("Let's go!"),
                descr_1: function(age_of_world_wonders_started) {
                    return s(_('Age of World Wonders start date: %1.'), age_of_world_wonders_started);
                },
                descr_2: _('Each island has construction sites that can be used to build the Wonders of the World.'),
                descr_3: _('All alliance members can participate in the construction of a World Wonder by providing resources. Your alliance gets a unique bonus for each fully upgraded World Wonder. A special reward will be given to the first alliance to control four of the seven World Wonders!')
            },
            world_wonder_tooltips: {
                great_pyramid_of_giza: {
                    title: _('The Pyramids of Giza in Egypt'),
                    description: function(value) {
                        return s(_('All the cities within your alliance receive a %1 bonus to their maximum warehouse storage capability.'), value);
                    }
                },
                hanging_gardens_of_babylon: {
                    title: _('The Hanging Gardens of Semiramis in Babylon'),
                    description: function(value) {
                        return s(_('The resource production of all cities in your alliance is increased by %1%.'), value);
                    }
                },
                statue_of_zeus_at_olympia: {
                    title: _('The Statue of Zeus by Phidias in Olympia'),
                    description: function(value) {
                        return s(_('Favor production with Zeus is increased by %1% for all members of your alliance.'), value);
                    }
                },
                temple_of_artemis_at_ephesus: {
                    title: _('The Temple of Artemis at Ephesus'),
                    description: function(value) {
                        return s(_('Favor production with all gods is increased by %1% for all members of your alliance.'), value);
                    }
                },
                mausoleum_of_halicarnassus: {
                    title: _('The Tomb of King Mausolus II at Halicarnassus'),
                    description: function(value) {
                        return s(_('All members of your alliance can purchase mythical units for %1% less.'), value);
                    }
                },
                colossus_of_rhodes: {
                    title: _('The Colossus of Rhodes'),
                    description: function(value) {
                        return s(_('All victory processions initiated by your alliance require %1% less time.'), value);
                    }
                },
                lighthouse_of_alexandria: {
                    title: _('The Lighthouse on the Island of Pharos at Alexandria'),
                    description: function(value) {
                        return s(_('All members of your alliance receive a special discount from the Phoenician Merchant of %1%.'), value);
                    }
                }
            }
        }
    });
}());