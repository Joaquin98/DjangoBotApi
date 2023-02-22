/*global GameData */

/*
 * Sound definitions
 * this file defines sounds used in game.
 * former: modules/audio.js
 *
 */

(function() {
    "use strict";

    var Sounds,
        load = function(Audio) {

            var Sounds = {
                background: {
                    theme_1_1: {
                        path: '100001_BGmusic01_Version_02',
                        category: 'background',

                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_2: {
                        path: '100002_BGmusic02_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_3: {
                        path: '100003_BGmusic03_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_4: {
                        path: '100004_BGmusic04_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_5: {
                        path: '100005_BGmusic05_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_6: {
                        path: '100006_BGmusic06_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_7: {
                        path: '100007_BGmusic07_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_8: {
                        path: '100008_BGmusic08_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_9: {
                        path: '100009_BGmusic09_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_10: {
                        path: '100010_BGmusic10_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_11: {
                        path: '100011_BGmusic11_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_12: {
                        path: '100012_BGmusic12_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_13: {
                        path: '100013_BGmusic13_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_14: {
                        path: '100014_BGmusic14_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_15: {
                        path: '100015_BGmusic15_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    theme_1_16: {
                        path: '100016_BGmusic16_Version_01',
                        category: 'background',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_zeus_1: {
                        path: '101001_Zeus01_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_zeus_2: {
                        path: '101002_Zeus02_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_zeus_3: {
                        path: '101003_Zeus03_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_zeus_4: {
                        path: '101004_Zeus04_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_poseidon_1: {
                        path: '101006_Poseidon01_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_poseidon_2: {
                        path: '101007_Poseidon02_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_poseidon_3: {
                        path: '101007_Poseidon03_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_poseidon_4: {
                        path: '101007_Poseidon04_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_hera_1: {
                        path: '101011_Hera01_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_hera_2: {
                        path: '101012_Hera02_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_hera_3: {
                        path: '101013_Hera03_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_hera_4: {
                        path: '101014_Hera04_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_athene_1: {
                        path: '101016_Athene01_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_athene_2: {
                        path: '101017_Athene02_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_athene_3: {
                        path: '101018_Athene03_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_athene_4: {
                        path: '101019_Athene04_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_hades_1: {
                        path: '101021_Hades01_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_hades_2: {
                        path: '101022_Hades02_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_hades_3: {
                        path: '101023_Hades03_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_hades_4: {
                        path: '101024_Hades04_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_artemis_1: {
                        path: '101026_Artemis01_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_artemis_2: {
                        path: '101027_Artemis02_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_artemis_3: {
                        path: '101028_Artemis03_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_artemis_4: {
                        path: '101029_Artemis04_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_mehrere_1: {
                        path: '101031_mehrere_Goetter01_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_mehrere_2: {
                        path: '101032_mehrere_Goetter02_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_mehrere_3: {
                        path: '101033_mehrere_Goetter03_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    },
                    god_mehrere_4: {
                        path: '101034_mehrere_Goetter04_Version_01',
                        category: 'gods',
                        options: {
                            volume: 0.5,
                            callbacks: {
                                ended: function() {
                                    Audio.playBackground();
                                }
                            }
                        }
                    }
                },
                button: {
                    buy_gold: {
                        click: {
                            path: '005009_Gold_kaufen_Version_01',
                            category: 'click',
                            preload: true,
                            options: {
                                volume: 0.85,
                                max_players: 1
                            }
                        }
                    }
                },

                click: {
                    path: '001001_Klick_Version_01',
                    category: 'click',
                    preload: true,
                    options: {
                        volume: 0.15
                    }
                },

                attack: {
                    incoming: {
                        path: '000001_Angriff_Version_01',
                        category: 'effects',
                        preload: true,
                        play_on_load: true,
                        options: {
                            max_players: 1
                        }
                    }
                },

                command: {
                    build_unit: {
                        /** land **/
                        sword: {
                            path: '010001_Schwertkaempfer_ausbilden_Version_01',
                            category: 'effects'
                        },
                        slinger: {
                            path: '010002_Schleuderer_ausbilden_Version_02',
                            category: 'effects'
                        },
                        archer: {
                            path: '010003_Bogenschuetze_ausbilden_Version_02',
                            category: 'effects'
                        },
                        hoplite: {
                            path: '010004_Hoplit_ausbilden_Version_02',
                            category: 'effects'
                        },
                        rider: {
                            path: '010005_Reiter_ausbilden_Version_02',
                            category: 'effects'
                        },
                        chariot: {
                            path: '010006_Streitwagen_ausbilden_Version_02',
                            category: 'effects'
                        },
                        catapult: {
                            path: '010007_Katapult_ausbilden_Version_02',
                            category: 'effects'
                        },
                        /** naval **/
                        big_transporter: {
                            path: '011001_Transportschiff_bauen_Version_01',
                            category: 'effects'
                        },
                        bireme: {
                            path: '011002_Bireme_bauen_Version_01',
                            category: 'effects'
                        },
                        attack_ship: {
                            path: '011003_Feuerschiff_bauen_Version_01',
                            category: 'effects'
                        },
                        demolition_ship: {
                            path: '011004_Brander_bauen_Version_01',
                            category: 'effects'
                        },
                        small_transporter: {
                            path: '011005_Schnelles_Transportschiff_bauen_Version_01',
                            category: 'effects'
                        },
                        trireme: {
                            path: '011006_Tireme_bauen_Version_01',
                            category: 'effects'
                        },
                        colonize_ship: {
                            path: '011007_Kolonieschiff_bauen_Version_01',
                            category: 'effects'
                        },
                        /** special **/
                        minotaur: {
                            path: '013001_Minotaurus_Version_01',
                            category: 'effects'
                        },
                        manticore: {
                            path: '013002_Mantikor_Version_01',
                            category: 'effects'
                        },
                        zyklop: {
                            path: '013003_Zyklop_Version_01',
                            category: 'effects'
                        },
                        sea_monster: {
                            path: '013004_Hydra_Version_02',
                            category: 'effects'
                        },
                        harpy: {
                            path: '013005_Harpie_Version_01',
                            category: 'effects'
                        },
                        medusa: {
                            path: '013006_Medusa_Version_01',
                            category: 'effects'
                        },
                        centaur: {
                            path: '013007_Zentaure_Version_01',
                            category: 'effects'
                        },
                        pegasus: {
                            path: '013008_Pegasus_Version_01',
                            category: 'effects'
                        },
                        cerberus: {
                            path: '013009_Zerberus_Version_01',
                            category: 'effects'
                        },
                        fury: {
                            path: '013010_Eriniys_Version_01',
                            category: 'effects'
                        },
                        griffin: {
                            path: '013011_Greif_Version_01',
                            category: 'effects'
                        },
                        calydonian_boar: {
                            path: '013012_Kalydonischer_Eber_Version_01',
                            category: 'effects'
                        },
                        godsent: {
                            path: '021001_Rekrutierung_Gottgesandter_Version_01',
                            category: 'effects'
                        },
                        siren: {
                            path: 'aphrodite/Unit_Recruit_Siren',
                            category: 'effects'
                        },
                        satyr: {
                            path: 'aphrodite/Unit_Recruit_Satyr',
                            category: 'effects'
                        },
                        spartoi: {
                            path: 'ares/Unit_Recruit_Spartoi',
                            category: 'effects'
                        },
                        ladon: {
                            path: 'ares/Unit_Recruit_Ladon',
                            category: 'effects'
                        }
                    },
                    cast_power: {
                        divine_sign: {
                            path: '015001_Zeus_Goettliches_Zeichen_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        bolt: {
                            path: '015002_Zeus_Blitz_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        fair_wind: {
                            path: '015003_Zeus_Guenstiger_Wind_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        transformation: {
                            path: '015004_Zeus_Zeus_Zorn_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        kingly_gift: {
                            path: '015005_Poseidon_Geschenk_der_See_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        call_of_the_ocean: {
                            path: '015006_Poseidon_Ruf_des_Meeres_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        earthquake: {
                            path: '015007_Poseidon_Erdbeben_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        sea_storm: {
                            path: '015008_Poseidon_Seesturm_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        wedding: {
                            path: '015009_Hera_Hochzeit_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        happiness: {
                            path: '015010_Hera_Zufriedenheit_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        fertility_improvement: {
                            path: '015011_Hera_Geburtenzuwachs_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        desire: {
                            path: '015012_Hera_Sehnsucht_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        patroness: {
                            path: '015013_Athene_Schutzgoettin_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        wisdom: {
                            path: '015014_Athene_Weisheit_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        town_protection: {
                            path: '015015_Athene_Schutz_der_Stadt_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        strength_of_heroes: {
                            path: '015016_Athene_Heldenkraft_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        pest: {
                            path: '015017_Hades_Pest_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        resurrection: {
                            path: '015018_Hades_Rueckkehr_aus_der_Unterwelt_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        underworld_treasures: {
                            path: '015019_Hades_Schaetze_der_Unterwelt_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        cap_of_invisibility: {
                            path: '015020_Hades_Helm_der_Unsichtbarkeit_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        natures_gift: {
                            path: '015021_Artemis_Geschenk_der_Natur_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        effort_of_the_huntress: {
                            path: '015022_Artemis_Bestreben_der_Jaegerin_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        illusion: {
                            path: '015023_Artemis_Illusion_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        cleanse: {
                            path: '015024_Artemis_Laauterung_Version_01',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        narcissism: {
                            path: 'aphrodite/Spell_Cast_Narcissism',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        pygmalion: {
                            path: 'aphrodite/Spell_Cast_Pygmalion',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        hymn_to_aphrodite: {
                            path: 'aphrodite/Spell_Cast_Hymn_To_Aphrodite',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        charitable_festival: {
                            path: 'aphrodite/Spell_Cast_Charitable_Festival',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        ares_army: {
                            path: 'ares/Spell_Cast_Ares_Army',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        bloodlust: {
                            path: 'ares/Spell_Cast_Bloodlust',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        ares_sacrifice: {
                            path: 'ares/Spell_Cast_Ares_Sacrifice',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        spartan_training: {
                            path: 'ares/Spell_Cast_Spartan_Training',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        }
                    },
                    cancel: {
                        troops: {
                            path: '020003_Rekrutierung_abbrechen_(Truppen)_Version_01',
                            category: 'effects'
                        },
                        ships: {
                            path: '020004_Rekrutierung_abbrechen_(Schiffe)_Version_01',
                            category: 'effects'
                        }
                    },
                    send_unit: {
                        troops: {
                            path: '009001_Angreifen_fremde_Stadt_kleine_Armee_Version_01',
                            category: 'effects'
                        },
                        ships: {
                            path: '009004_Angreifen_mit_kleiner_Flotte_Version_01',
                            category: 'effects'
                        }
                    }
                },

                god: {
                    change: {
                        zeus: {
                            path: '006045_Gottesauswahl_Tempel_Zeus_Version_01',
                            category: 'effects'
                        },
                        poseidon: {
                            path: '006046_Gottesauswahl_Tempel_Poseidon_Version_01',
                            category: 'effects'
                        },
                        hera: {
                            path: '006047_Gottesauswahl_Tempel_Hera_Version_01',
                            category: 'effects'
                        },
                        athena: {
                            path: '006048_Gottesauswahl_Tempel_Athena_Version_01',
                            category: 'effects'
                        },
                        hades: {
                            path: '006049_Gottesauswahl_Tempel_Hades_Version_01',
                            category: 'effects'
                        },
                        artemis: {
                            path: '006050_Gottesauswahl_Tempel_Artemis_Version_01',
                            category: 'effects'
                        },
                        aphrodite: {
                            path: 'aphrodite/God_Change_Aphrodite',
                            category: 'effects'
                        },
                        ares: {
                            path: 'ares/God_Change_Ares',
                            category: 'effects'
                        }
                    }
                },

                map: {
                    jump: {
                        path: '003001_Zu_Koordinaten_springen_Version_03',
                        category: 'click',
                        preload: true,
                        options: {
                            volume: 0.85
                        }
                    },
                    zoom_in: {
                        path: '003012_Reinzoomen_Version_01',
                        category: 'click',
                        preload: true,
                        options: {
                            volume: 0.85
                        }
                    },
                    zoom_out: {
                        path: '003013_Rauszoomen_Version_01',
                        category: 'click',
                        preload: true,
                        options: {
                            volume: 0.85
                        }
                    },
                    town: {
                        click: {
                            own: {
                                path: '007001_Eigene_Stadt_Stufe_1_Version_01',
                                category: 'click',
                                preload: true,
                                options: {
                                    volume: 0.85
                                }
                            },
                            alliance: {
                                path: '007006_Fremde_Stadt_Eigene_Allianz_Stufe_1_Version_01',
                                category: 'click',
                                preload: true,
                                options: {
                                    volume: 0.85
                                }
                            },
                            enemy: {
                                path: '007011_Fremde_Stadt_feindliche_Allianz_Stufe_1_Version_01',
                                category: 'click',
                                preload: true,
                                options: {
                                    volume: 0.85
                                }
                            },
                            ghost_city: {
                                path: '007022_Ruinen_Version_01',
                                category: 'click',
                                preload: true,
                                options: {
                                    volume: 0.85
                                }
                            }
                        }
                    },
                    /*farm: {
                    	click: {
                    		mood50: {
                    			path: '007018_Bauerndorf_bis_50_Stimmung_Version_01',
                    			category: 'click',
                    			preload: true
                    		},
                    		mood80: {
                    			path: '007017_Bauerndorf_bis_80_Stimmung_Version_01',
                    			category: 'click',
                    			preload: true
                    		},
                    		mood100: {
                    			path: '007016_Bauerndorf_bis_100_Stimmung_Version_01',
                    			category: 'click',
                    			preload: true
                    		}
                    	}
                    },*/
                    context_menu: {
                        click: {
                            spells: {
                                path: '007020_Zauber_Version_02',
                                category: 'click',
                                options: {
                                    volume: 0.85
                                }
                            },
                            overview: {
                                path: '007021_Stadtinfo_Version_01',
                                category: 'click',
                                preload: true,
                                options: {
                                    volume: 0.85
                                }
                            },
                            espionage: {
                                path: '020001_Spionage_fremde_Stadt_Version_01',
                                category: 'click',
                                options: {
                                    volume: 0.85
                                }
                            }
                        }
                    }
                },

                menu: {
                    messages: {
                        click: {
                            path: '003002_Nachrichten_und_Berichte_Version_01',
                            category: 'effects',
                            preload: true
                        }
                    },
                    alliance: {
                        click: {
                            path: '003003_Allianz_Version_02',
                            category: 'effects',
                            preload: true
                        }
                    },
                    alliance_forum: {
                        click: {
                            path: '003004_Allianz_Forum_Version_01',
                            category: 'effects',
                            preload: true
                        }
                    },
                    settings: {
                        click: {
                            path: '003005_Einstellungen_Version_01',
                            category: 'effects',
                            preload: true
                        }
                    },
                    profile: {
                        click: {
                            path: '003006_Profil_Version_01',
                            category: 'effects',
                            preload: true
                        }
                    },
                    ranking: {
                        click: {
                            path: '003007_Rangliste_Version_01',
                            category: 'effects',
                            preload: true
                        }
                    },
                    help: {
                        click: {
                            path: '003008_Hilfe_Version_01',
                            category: 'effects',
                            preload: true
                        }
                    },
                    forum: {
                        click: {
                            path: '003009_Forum_und_Chat_Version_01',
                            category: 'effects',
                            preload: true
                        }
                    },
                    premium: {
                        click: {
                            path: '003010_Premium_Version_02',
                            category: 'effects',
                            preload: true
                        }
                    },
                    invite_friends: {
                        click: {
                            path: '003011_Freunde_einladen_Version_02',
                            category: 'effects',
                            preload: true
                        }
                    }
                },

                notification: {
                    /*building_finished: {
                    	arrive: {
                    		path: '002001_Gebaeude_fertiggestellt_Version_02', //check if it realy works | building_finished
                    		category: 'effects',
                    		preload: true
                    	}
                    },
                    building_upgraded: {
                    	arrive: {
                    		path: '002002_Ausbau_abgeschlossen_Version_01',
                    		category: 'effects',
                    		preload: true
                    	}
                    },*/

                    message: {
                        arrive: {
                            path: '002004_Nachricht_erhalten_Version_02', // message_received
                            category: 'effects',
                            preload: true
                        }
                    }
                },

                /*town: {
                	research : {
                		done : {
                			path : '002003_Forschung_abgeschlossen_Version_02',
                			category: 'effects',
                			preload: true
                		}
                	}
                },*/

                celebration: {
                    start: {
                        party: {
                            path: '004001_Stadtfest_Version_02',
                            category: 'effects'
                        },
                        triumph: {
                            path: '004002_Triumphzug_Version_01',
                            category: 'effects'
                        },
                        theater: {
                            path: '004003_Theaterspiele_Version_01',
                            category: 'effects'
                        },
                        games: {
                            path: '005006_Olympische_Spiele_Version_02',
                            category: 'effects'
                        }
                    }
                },

                quest: {
                    /*add: {
                    	path: '018007_Neuer_Quest_verfuegbar_Version_01',
                    	category: 'effects',
                    	preload: true
                    },*/
                    /*accept: {
                    	path: '018001_Quest_annehmen_Version_01',
                    	category: 'effects'
                    },*/
                    /*completed: {
                    	path: '018006_Quest_erfolgreich_abgeschlossen_Version_01',
                    	category: 'effects',
                    	preload: true
                    },*/
                    claim_reward: {
                        // changed in GP-7284
                        // path: '018002_Belohnung_einsammeln_(fuer_Quest)_Version_01',
                        path: '017004_Belohnung_2_Version_01',
                        category: 'effects'
                    }
                },

                premium: {
                    adviser: {
                        activate: {
                            commander: {
                                path: '005001_Befehlshaber_aktivieren_Version_01',
                                category: 'effects'
                            },
                            captain: {
                                path: '005002_Kapitaen_aktivieren_Version_01',
                                category: 'effects'
                            },
                            curator: {
                                path: '005003_Verwalter_aktivieren_Version_01',
                                category: 'effects'
                            },
                            trader: {
                                path: '005004_Haendler_aktivieren_Version_01',
                                category: 'effects'
                            },
                            priest: {
                                path: '005005_Hohepriesterin_aktivieren_Version_01',
                                category: 'effects'
                            }
                        }
                    },
                    build_time_reduction: {
                        building: {
                            path: '005008_Bauzeithalbierung-Version_03',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        },
                        unit: {
                            path: '005007_Rekrutierungszeithalbierung_Version_02',
                            category: 'effects',
                            options: {
                                max_players: 1
                            }
                        }
                    },
                    merchant: {
                        immediate_call: {
                            path: '020002_Phoenizischen_Haendler_rufen_Version_01',
                            category: 'effects'
                        }
                    }
                },

                building: {
                    cancel: {
                        path: '020005_Gebaeudebau_abbrechen_Version_01',
                        category: 'effects'
                    }
                },

                window: {
                    minimize: {
                        path: '001005_Minimieren_Version_01',
                        category: 'click',
                        options: {
                            volume: 0.85
                        }
                    },
                    close: {
                        path: '001004_Schliessen_Version_01',
                        category: 'click',
                        options: {
                            volume: 0.85
                        }
                    },
                    building: {
                        open: {
                            main: {
                                path: '006001_Senat_Stufe_1_Version_02',
                                category: 'effects'
                            },
                            hide: {
                                path: '006004_Hoehle_Stufe_1_Version_02',
                                category: 'effects'
                            },
                            storage: {
                                path: '006007_Lager_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            farm: {
                                path: '006011_Bauernhof_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            place: {
                                path: '006015_Agora_Version_01',
                                category: 'effects'
                            },
                            lumber: {
                                path: '006016_Holzfaeller_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            stoner: {
                                path: '006019_Steinbruch_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            ironer: {
                                path: '006022_Silbermine_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            market: {
                                path: '006025_Marktplatz_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            docks: {
                                path: '006028_Hafen_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            barracks: {
                                path: '006031_Kaserne_Stufe_1_Version_02',
                                category: 'effects'
                            },
                            wall: {
                                path: '006034_Stadtmauer_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            academy: {
                                path: '006037_Akademie_Stufe_1_Version_02',
                                category: 'effects'
                            },
                            temple: {
                                path: '006041_Tempel_Stufe_1_Version_01',
                                category: 'effects'
                            },
                            theater: {
                                path: '006053_Theater_Version_01',
                                category: 'effects'
                            },
                            thermal: {
                                path: '006054_Therme_Version_01',
                                category: 'effects'
                            },
                            library: {
                                path: '006055_Bibliothek_Version_01',
                                category: 'effects'
                            },
                            lighthouse: {
                                path: '006056_Leuchtturm_Version_01',
                                category: 'effects'
                            },
                            tower: {
                                path: '006057_Turm_Version_01',
                                category: 'effects'
                            },
                            statue: {
                                path: '006058_Goetterstatue_Version_01',
                                category: 'effects'
                            },
                            oracle: {
                                path: '006059_Orakel_Version_01',
                                category: 'effects'
                            },
                            trade_office: {
                                path: '006060_Handelskontor_Version_02',
                                category: 'effects'
                            }
                        }
                    },

                    farm: {
                        claim_load: {
                            'normal': { //farm
                                lvl_1: {
                                    path: '014003_Fordern_Stufe_3_Version_01',
                                    category: 'effects'
                                },
                                lvl_2: {
                                    path: '014003_Fordern_Stufe_3_Version_01',
                                    category: 'effects'
                                },
                                lvl_3: {
                                    path: '014003_Fordern_Stufe_3_Version_01',
                                    category: 'effects'
                                },
                                lvl_4: {
                                    path: '014003_Fordern_Stufe_3_Version_01',
                                    category: 'effects'
                                },
                                lvl_5: {
                                    path: '014003_Fordern_Stufe_3_Version_01',
                                    category: 'effects'
                                },
                                lvl_6: {
                                    path: '014003_Fordern_Stufe_3_Version_01',
                                    category: 'effects'
                                }
                            },
                            'double': { //loot
                                lvl_1: {
                                    path: '014005_Pluendern_Stufe_1_Version_03',
                                    category: 'effects'
                                },
                                lvl_2: {
                                    path: '014006_Pluendern_Stufe_2_Version_02',
                                    category: 'effects'
                                },
                                lvl_3: {
                                    path: '014007_Pluendern_Stufe_3_Version_02',
                                    category: 'effects'
                                },
                                lvl_4: {
                                    path: '014008_Pluendern_Stufe_4_Version_02',
                                    category: 'effects'
                                },
                                lvl_5: {
                                    path: '014008_Pluendern_Stufe_4_Version_02',
                                    category: 'effects'
                                },
                                lvl_6: {
                                    path: '014008_Pluendern_Stufe_4_Version_02',
                                    category: 'effects'
                                }
                            }
                        },
                        trade: {
                            path: '014010_Handeln_Version_01',
                            category: 'effects'
                        },
                        send_resources: {
                            path: '014009_Rohstoffe_senden_Version_02',
                            category: 'effects'
                        },
                        request_militia: {
                            path: '010008_Miliz_einberufen_Version_01',
                            category: 'effects'
                        }
                    },
                    daily_bonus: {
                        accept: {
                            path: '017001_Taegliche_Belohnung_annehmen_Version_03',
                            category: 'effects',
                            preload: true
                        }
                    },
                    quest: {
                        open: {
                            socrates: {
                                path: 'Questfenster_oeffnen_Sokrates_3',
                                category: 'effects',
                                preload: true
                            },
                            captain: {
                                path: '018004_Questfenster_oeffnen_Militaerberater_Version_02',
                                category: 'effects',
                                preload: true
                            },
                            curator: {
                                path: '018005_Questfenster_oeffnen_Verwalter_Version_01',
                                category: 'effects',
                                preload: true
                            },
                            /** GP-7284 **/
                            hermes: {
                                path: '018002_Belohnung_einsammeln_(fuer_Quest)_Version_01',
                                category: 'effects',
                                preload: true
                            }
                        }
                    },
                    alliance: {
                        invite_friends: {
                            path: '003011_Freunde_einladen_Version_02',
                            category: 'effects'
                        }
                    },
                    /*townindex: {
                    	ambient: {
                    		path: '008001_Kleine_Stadt_Atmo_(LOOP)_Version_01',
                    		category: 'effects',
                    		options: {
                    			loop: true
                    		}
                    	}
                    },*/
                    academy: {
                        research: {
                            buy: {
                                town_guard: {
                                    path: '016001_Stadtwache_Version_01',
                                    category: 'effects'
                                },
                                diplomacy: {
                                    path: '016002_Diplomatie_Version_01',
                                    category: 'effects'
                                },
                                espionage: {
                                    path: '016003_Spionage_Version_01',
                                    category: 'effects'
                                },
                                booty: {
                                    path: '016004_Beute_Version_01',
                                    category: 'effects'
                                },
                                pottery: {
                                    path: '016005_Keramik_Version_02',
                                    category: 'effects'
                                },
                                architecture: {
                                    path: '016006_Architektur_Version_01',
                                    category: 'effects'
                                },
                                instructor: {
                                    path: '016007_Ausbildung_Version_02',
                                    category: 'effects'
                                },
                                building_crane: {
                                    path: '016008_Baukran_Version_01',
                                    category: 'effects'
                                },
                                meteorology: {
                                    path: '016009_Meteorologie_Version_01',
                                    category: 'effects'
                                },
                                conscription: {
                                    path: '016010_Wehrpflicht_Version_02',
                                    category: 'effects'
                                },
                                shipwright: {
                                    path: '016011_Schiffbauer_Version_01',
                                    category: 'effects'
                                },
                                cryptography: {
                                    path: '016012_Kryptographie_Version_01',
                                    category: 'effects'
                                },
                                democracy: {
                                    path: '016013_Demokratie_Version_02',
                                    category: 'effects'
                                },
                                plow: {
                                    path: '016014_Pflug_Version_01',
                                    category: 'effects'
                                },
                                berth: {
                                    path: '016015_Kojen_Version_01',
                                    category: 'effects'
                                },
                                phalanx: {
                                    path: '016016_Phalanx_Version_01',
                                    category: 'effects'
                                },
                                breach: {
                                    path: '016017_Durchbruch_Version_02',
                                    category: 'effects'
                                },
                                mathematics: {
                                    path: '016018_Mathematik_Version_01',
                                    category: 'effects'
                                },
                                ram: {
                                    path: '016019_Rammbock_Version_01',
                                    category: 'effects'
                                },
                                cartography: {
                                    path: '016020_Kartografie_Version_01',
                                    category: 'effects'
                                },
                                take_over: {
                                    path: '016021_Eroberung_Version_01',
                                    category: 'effects'
                                },
                                stone_storm: {
                                    path: '016022_Verbesserte_Katapulte_Version_01',
                                    category: 'effects'
                                },
                                temple_looting: {
                                    path: '016023_Tempel_Pluenderung_Version_01',
                                    category: 'effects'
                                },
                                divine_selection: {
                                    path: '016024_Goettliche_Auslese_Version_01',
                                    category: 'effects'
                                },
                                combat_experience: {
                                    path: '016025_Kampferfahrung_Version_01',
                                    category: 'effects'
                                },
                                strong_wine: {
                                    path: '016026_Starker_Wein_Version_01',
                                    category: 'effects'
                                },
                                set_sail: {
                                    path: '016027_Segel_setzen_Version_01',
                                    category: 'effects'
                                }
                            },
                            cancel: {
                                path: '020006_Forschung_abbrechen_Version_01',
                                category: 'effects'
                            }
                        }
                    },
                    events: {
                        advent: {
                            shard_collected: {
                                path: '017003_Belohnung_1_Version_01',
                                category: 'effects'
                            },
                            advisors_received: {
                                path: '004002_Triumphzug_Version_01',
                                category: 'effects'
                            }
                        },
                        crafting: {
                            crafted: {
                                path: '017004_Belohnung_2_Version_01',
                                category: 'effects'
                            }
                        },
                        turn_over_tokens: {
                            shot: {
                                assassins: {
                                    path: '03000_Arrow_and_impact_Version_01',
                                    category: 'click'
                                },
                                slingers: {
                                    path: '007022_Ruinen_Version_01',
                                    category: 'click'
                                }
                            }
                        }
                    }
                }
            };

            return Sounds;
        };

    var PreloadedSounds = {
        load: function(audio) {
            GameData.add({
                Sounds: load(audio)
            });
        },
        list: function() {
            return Sounds;
        }
    };

    window.PreloadedData.Sounds = PreloadedSounds;
}());