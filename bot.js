var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

function Auth(action, account_info, callback_fun) {
    $.ajax({
        'method': 'POST',
        'jsonpCallback': callback_fun,
        'url': data.domain + 'api',
        'dataType': 'json',
        'data': $.extend({
            'action': action
        }, account_info),
        'success': function(x) {
            callback_fun(x);
        }
    });
}

$.ajax({
    'method': 'GET',
    'url': "https://worldtimeapi.org/api/timezone/Europe"
}).responseJSON


Game = {
    csrfToken: "dsfsdf"
}

function default_handler(_0x735f65, default_handler) {
    return function(data) {
        default_handler = void 0 !== default_handler;
        var _0x1a27ff = data.json;
        return _0x1a27ff.redirect ? (window.location.href = _0x1a27ff.redirect, void delete _0x1a27ff.redirect) : _0x1a27ff.maintenance ? MaintenanceWindowFactory.openMaintenanceWindow(_0x1a27ff.maintenance) : (_0x1a27ff.notifications && NotificationLoader && (NotificationLoader.recvNotifyData(_0x1a27ff, 'data'), delete _0x1a27ff.notifications, delete _0x1a27ff.next_fetch_in), _0x735f65(default_handler ? data : _0x1a27ff));
    };
}


let basic_actions = {
    Auth (action, account_info, callback_fun) {
        $.ajax({
            'method': 'POST',
            'jsonpCallback': callback_fun,
            'url': data.domain + 'api',
            'dataType': 'json',
            'data': $.extend({
                'action': action
            }, account_info),
            'success': function (x) {
                callback_fun(x);
            }
        });
    }
, 
    PaymentOptions (_0x39c1c9) {
        $.ajax({
            'method': 'GET',
            'url': data.domain + 'paymentOptions',
            'dataType': 'json',
            'success': function (_0xc2234d) {
                _0x39c1c9(_0xc2234d);
            }
        });
    }
, 
    // Obtiene toda la información de la ciudad
    game_data(town_id, default_handler) {
        let url = window.location['protocol'] + '//' + document.domain + '/game/data?' + $.param({
            'town_id': town_id,
            'action': 'get',
            'h': Game.csrfToken
        });
        let data = {
            'json': JSON.stringify({
                'types': [{
                    'type': 'map',
                    'param': {
                        'x': 0,
                        'y': 0
                    }
                }, {
                    'type': 'bar'
                }, {
                    'type': 'backbone'
                }],
                'town_id': town_id,
                'nl_init': false
            })
        };
        $.ajax({
            'url': url,
            'data': data,
            'method': 'POST',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },

    // Ir a una ciudad
    switch_town(town_id, default_handler) {
        let url = window.location['protocol'] + '//' + document.domain + '/game/index?' + $.param({
            'town_id': town_id,
            'action': 'switch_town',
            'h': Game.csrfToken
        });
        $.ajax({
            'url': url,
            'method': 'GET',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },

    // Funcion para saquear/pedir soldados a una granja
    claim_load(town_id, claim_type, time, target_id, default_handler) {
        let url = window.location['protocol'] + '//' + document.domain + '/game/farm_town_info?' + $.param({
            'town_id': town_id,
            'action': 'claim_load',
            'h': Game.csrfToken
        });
        let data = {
            'json': JSON.stringify({
                'target_id': target_id,
                'claim_type': claim_type,
                'time': time,
                'town_id': town_id,
                'nl_init': true
            })
        };
        $.ajax({
            'url': url,
            'data': data,
            'method': 'POST',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },


    farm_town_overviews(_0x4eaf5c, _0x3ebe11) {
        var _0x1546c3, _0x36f853, _0x36650a = _0x4eaf5c;
        _0x36f853 = {
            'town_id': Game.townId,
            'action': 'get_farm_towns_for_town',
            'h': Game.csrfToken,
            'json': JSON.stringify({
                'island_x': ITowns.towns[_0x36650a].getIslandCoordinateX(),
                'island_y': ITowns.towns[_0x36650a].getIslandCoordinateY(),
                'current_town_id': _0x36650a,
                'booty_researched': !!ITowns.towns[_0x36650a].researches().attributes.booty || '',
                'diplomacy_researched': !!ITowns.towns[_0x36650a].researches().attributes['diplomacy'] || '',
                'itrade_office': ITowns.towns[_0x36650a].buildings().attributes.trade_office,
                'town_id': Game.townId,
                'nl_init': true
            })
        }, _0x1546c3 = window.location['protocol'] + '//' + document.domain + '/game/farm_town_overviews', $.ajax({
            'url': _0x1546c3,
            'data': _0x36f853,
            'method': 'GET',
            'dataType': 'json',
            'success': _0x39a961.default_handler(_0x3ebe11)
        });
    },

    // Creo que es el farmeo con premium, que se pueden elegir las ciudades y el tiempo
    claim_loads(current_town_id, farm_town_ids, claim_factor, time_option, default_handler) {
        $.ajax({
            'url': window.location.protocol + '//' + document.domain + '/game/farm_town_overviews?' + $.param({
                'town_id': Game.townId,
                'action': 'claim_loads',
                'h': Game.csrfToken
            });,
            'data': {
                'json': JSON.stringify({
                    'farm_town_ids': farm_town_ids,
                    'time_option': time_option,
                    'claim_factor': claim_factor,
                    'current_town_id': current_town_id,
                    'town_id': Game.townId,
                    'nl_init': true
                })
            },
            'method': 'POST',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },


    building_place(town_id, default_handler) {
        let data = {
            'town_id': town_id,
            'action': 'culture',
            'h': Game.csrfToken,
            'json': JSON.stringify({
                'town_id': town_id,
                'nl_init': true
            })
        };
        let url = window.location['protocol'] + '//' + document.domain + '/game/building_place';
        $.ajax({
            'url': url,
            'data': data,
            'method': 'GET',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler, true)
        });
    },

    building_main(town_id, default_handler) {
        let data = {
            'town_id': town_id,
            'action': 'index',
            'h': Game.csrfToken,
            'json': JSON.stringify({
                'town_id': town_id,
                'nl_init': true
            })
        };
        let url = window.location.protocol + '//' + document.domain + '/game/building_main';
        $.ajax({
            'url': url,
            'data': data,
            'method': 'GET',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },


    start_celebration(town_id, celebration_type, default_handler) {
        let url = window.location['protocol'] + '//' + document.domain + '/game/building_place?' + $.param({
            'town_id': town_id,
            'action': 'start_celebration',
            'h': Game.csrfToken
        });
        let data = {
            'json': JSON.stringify({
                'celebration_type': celebration_type,
                'town_id': town_id,
                'nl_init': true
            })
        };
        $.ajax({
            'url': url,
            'data': data,
            'method': 'POST',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler, true)
        });
    },

    email_validation(default_handler) {
        let data = {
            'town_id': Game.townId,
            'action': 'email_validation',
            'h': Game.csrfToken,
            'json': JSON.stringify({
                'town_id': Game.townId,
                'nl_init': true
            })
        };
        let url = window.location['protocol'] + '//' + document.domain + '/game/player';
        $.ajax({
            'url': url,
            'data': data,
            'method': 'GET',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler, true)
        });
    },

    members_show(default_handler) {
        let data = {
            'town_id': Game.townId,
            'action': 'members_show',
            'h': Game.csrfToken,
            'json': JSON.stringify({
                'town_id': Game.townId,
                'nl_init': true
            })
        };
        let url = window.location.protocol + '//' + document.domain + '/game/alliance';
        $.ajax({
            'url': url,
            'data': data,
            'method': 'GET',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },

    login_to_game_world(world) {
        $.redirect(window.location.protocol + '//' + document.domain + '/start?' + $.param({
            'action': 'login_to_game_world'
        }), {
            'world': world,
            'facebook_session': '',
            'facebook_login': '',
            'portal_sid': '',
            'name': '',
            'password': ''
        });
    },

    frontend_bridge(town_id, data_input, default_handler) {
        let url = window.location['protocol'] + '//' + document.domain + '/game/frontend_bridge?' + $.param({
            'town_id': town_id,
            'action': 'execute',
            'h': Game.csrfToken
        });

        let data = {
            'json': JSON.stringify(data_input)
        };
        $.ajax({
            'url': url,
            'data': data,
            'method': 'POST',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },

    building_barracks(town_id, data_input, _0x405da2) {
        let url = window.location.protocol + '//' + document.domain + '/game/building_barracks?' + $.param({
            'town_id': town_id,
            'action': 'build',
            'h': Game.csrfToken
        });
        let data = {
            'json': JSON.stringify(data_input)
        };
        $.ajax({
            'url': url,
            'data': data,
            'method': 'POST',
            'dataType': 'json',
            'success': _0x39a961.default_handler(_0x405da2)
        });
    },

    attack_planner(town_id, default_handler) {
        let data = {
            'town_id': town_id,
            'action': 'attacks',
            'h': Game.csrfToken,
            'json': JSON.stringify({
                'town_id': town_id,
                'nl_init': true
            })
        };
        let url = window.location.protocol + '//' + document.domain + '/game/attack_planer';
        $.ajax({
            'url': url,
            'data': data,
            'method': 'GET',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },

    town_info_attack(town_id, attack, default_handler) {
        let data = {
            'town_id': town_id,
            'action': 'attack',
            'h': Game.csrfToken,
            'json': JSON.stringify({
                'id': attack.target_id,
                'nl_init': true,
                'origin_town_id': attack.town_id,
                'preselect': true,
                'preselect_units': attack.units,
                'town_id': Game.townId
            })
        };
        let url = window.location.protocol + '//' + document.domain + '/game/town_info';
        $.ajax({
            'url': url,
            'data': data,
            'method': 'GET',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    },

    send_units(town_id, type, id, data_input, default_handler) {
        let url = window.location.protocol + '//' + document.domain + '/game/town_info?' + $.param({
            'town_id': town_id,
            'action': 'send_units',
            'h': Game.csrfToken
        });

        let data = {
            'json': JSON.stringify($.extend({
                'id': id,
                'type': type,
                'town_id': town_id,
                'nl_init': true
            }, data_input))
        };
        $.ajax({
            'url': url,
            'data': data,
            'method': 'POST',
            'dataType': 'json',
            'success': _0x39a961.default_handler(default_handler)
        });
    }
};



let farms_manager = {

    checkReady(_0x12de32) {
        var _0x7ca83a = ITowns.towns[_0x12de32.id];
        if (_0x7ca83a.hasConqueror()) return false;
        if (!farms_manager.checkEnabled()) return false;
        if (_0x12de32.modules.Autofarm['isReadyTime'] >= Timestamp.now()) return _0x12de32.modules.Autofarm.isReadyTime;
        var _0x4b62f6 = _0x7ca83a.resources();
        if (_0x4b62f6.wood === _0x4b62f6.storage && _0x4b62f6.stone === _0x4b62f6.storage && _0x4b62f6.iron === _0x4b62f6.storage && farms_manager.settings.skipwhenfull) return false;
        var _0x332894 = false;
        return $.each(jugador.Queue.queue, function(_0x4cd034, _0x33bc0a) {
            if ('Autofarm' === _0x33bc0a.module && -0x1 !== _0x12de32.relatedTowns.indexOf(_0x33bc0a.townId)) return _0x332894 = true, false;
        }), farms_manager.settings.lowresfirst && _0x12de32.relatedTowns.length > 0 && (_0x332894 = false, $.each(_0x12de32.relatedTowns, function(_0x5e6530, _0x480fa6) {
            var _0x294ce5 = _0x7ca83a.resources(),
                _0x384e5a = ITowns.towns[_0x480fa6].resources();
            if (_0x294ce5.wood + _0x294ce5.stone + _0x294ce5.iron > _0x384e5a.wood + _0x384e5a.stone + _0x384e5a.iron) return _0x332894 = true, false;
        })), !_0x332894;
    },

    disableP() {
        attack_manager.settings = {
            'autostart': !false,
            'method': 300,
            'timebetween': true,
            'skipwhenfull': true,
            'lowresfirst': true,
            'stoplootbelow': true
        };
    },
    checkEnabled() {
        return jugador.modules['Autofarm'].isOn;
    },


    // Se fija si esta en la ciudad solicitada y si se tiene capitan o no
    // llamando asi al farmeo clasico o con capitan
    startFarming(town) {
        if (!farms_manager.checkEnabled()) return false;
        farms_manager.town = town, farms_manager.shouldFarm = [], farms_manager.iTown = ITowns.towns[farms_manager.town.id];
        var funInt = function() {
            farms_manager.interval = setTimeout(function() {
                Console.Log(farms_manager.town.name + ' getting farm information.', 0x1), farms_manager.isCaptain ? farms_manager.initFarmTownsCaptain(function() {
                    if (!farms_manager.checkEnabled()) return false;
                    farms_manager.claimResources();
                }) : farms_manager.initFarmTowns(function() {
                    if (!farms_manager.checkEnabled()) return false;
                    farms_manager.town['currentFarmCount'] = 0, farms_manager.claimResources();
                });
            }, data.randomize(1000, 2000));
        };
        jugador.currentTown !== farms_manager.town.key ? farms_manager.interval = setTimeout(function() {
            Console.Log(farms_manager.town.name + ' move to town.', 0x1), basic_actions.switch_town(farms_manager.town.id, function() {
                if (!farms_manager.checkEnabled()) return false;
                jugador.currentTown = farms_manager.town.key, funInt();
            }), farms_manager.town.isSwitched = true;
        }, data.randomize(1000, 2000)) : funInt();
    },

    initFarmTowns(funX) {
        basic_actions.game_data(farms_manager.town.id, function(_0x6c5c94) {
            if (!farms_manager.checkEnabled()) return false;
            var _0x337862 = _0x6c5c94.map.data['data'].data;
            $.each(_0x337862, function(_0x3501c6, _0x43b144) {
                var _0x216af2 = [];
                $.each(_0x43b144.towns, function(_0x683a89, _0x295289) {
                    _0x295289.x === farms_manager.iTown.getIslandCoordinateX() && _0x295289.y === farms_manager.iTown['getIslandCoordinateY']() && 0x1 === _0x295289.relation_status && _0x216af2.push(_0x295289);
                }), farms_manager.town.farmTowns = _0x216af2;
            }), $.each(farms_manager.town.farmTowns, function(_0x2bf068, _0x5266c9) {
                _0x5266c9.loot - Timestamp.now() <= 0 && farms_manager.shouldFarm.push(_0x5266c9);
            }), funX(true);
        });
    },
    initFarmTownsCaptain(funX) {
        basic_actions.farm_town_overviews(farms_manager.town.id, function(_0x46bbcb) {
            if (!farms_manager.checkEnabled()) return false;
            var _0x307bbe = [];
            $.each(_0x46bbcb.farm_town_list, function(_0x19002a, _0x158e8e) {
                _0x158e8e.island_x === farms_manager.iTown['getIslandCoordinateX']() && _0x158e8e.island_y === farms_manager.iTown['getIslandCoordinateY']() && 0x1 === _0x158e8e.rel && _0x307bbe.push(_0x158e8e);
            }), farms_manager.town.farmTowns = _0x307bbe, $.each(farms_manager.town.farmTowns, function(_0x54ee1e, _0x498069) {
                _0x498069.loot - Timestamp.now() <= 0 && farms_manager.shouldFarm.push(_0x498069);
            }), funX(true);
        });
    },
    claimResources() {
        if (!farms_manager.town.farmTowns[0])
            return Console.Log(farms_manager.town.name + ' has no farm towns.', 0x1), farms_manager.finished(1800), false;
        if (farms_manager.town.currentFarmCount < farms_manager.shouldFarm['length']) farms_manager.interval = setTimeout(function() {
            var _0x15851d = 'normal';
            if (Game.features.battlepoint_villages || (farms_manager.shouldFarm[farms_manager.town['currentFarmCount']].mood >= 0x56 && farms_manager.settings.stoplootbelow && (_0x15851d = 'double'), farms_manager.settings.stoplootbelow || (_0x15851d = 'double')), farms_manager.isCaptain) {
                var _0x3c2989 = [];
                $.each(farms_manager.shouldFarm, function(_0x480d80, _0x330feb) {
                    _0x3c2989.push(_0x330feb.id);
                }), farms_manager.claimLoads(_0x3c2989, _0x15851d, function() {
                    if (!farms_manager.checkEnabled()) return false;
                    farms_manager.finished(farms_manager.getMethodTime(farms_manager.town.id));
                });
            } else farms_manager.claimLoad(farms_manager.shouldFarm[farms_manager.town['currentFarmCount']].id, _0x15851d, function() {
                if (!farms_manager.checkEnabled()) return false;
                farms_manager.shouldFarm[farms_manager.town.currentFarmCount].loot = Timestamp.now() + farms_manager.getMethodTime(farms_manager.town.id), jugador.updateTimer(farms_manager.shouldFarm.length, farms_manager.town['currentFarmCount']), farms_manager.town.currentFarmCount++, farms_manager.claimResources();
            });
        }, data.randomize(1000 * farms_manager.settings.timebetween, 1000 * farms_manager.settings.timebetween + 1000));
        else {
            var _0x86b50f = null;
            $.each(farms_manager.town.farmTowns, function(_0x16e034, _0x2d73c5) {
                var _0x2d608a = _0x2d73c5.loot - Timestamp.now();
                (null == _0x86b50f || _0x2d608a <= _0x86b50f) && (_0x86b50f = _0x2d608a);
            }), farms_manager.shouldFarm.length > 0 ? $.each(farms_manager.shouldFarm, function(_0x5c74d2, _0x464317) {
                var _0x13cc92 = _0x464317.loot - Timestamp.now();
                (null == _0x86b50f || _0x13cc92 <= _0x86b50f) && (_0x86b50f = _0x13cc92);
            }) : Console.Log(farms_manager.town.name + ' not ready yet.', 0x1), farms_manager.finished(_0x86b50f);
        }
    },
    claimLoad(town_id, claim_type, _0x3e2e28) {
        Game.features.battlepoint_villages ? basic_actions.frontend_bridge(farms_manager.town.id, {
            'model_url': 'FarmTownPlayerRelation/' + MM.getOnlyCollectionByName('FarmTownPlayerRelation').getRelationForFarmTown(town_id).id,
            'action_name': 'claim',
            'arguments': {
                'farm_town_id': town_id,
                'type': 'resources',
                'option': 1
            }
        }, function(_0x51f40e) {
            farms_manager.claimLoadCallback(town_id, _0x51f40e), _0x3e2e28(_0x51f40e);
        }) : basic_actions.claim_load(farms_manager.town.id, claim_type, farms_manager.getMethodTime(farms_manager.town.id), town_id, function(_0x507810) {
            farms_manager.claimLoadCallback(town_id, _0x507810), _0x3e2e28(_0x507810);
        });
    },
    claimLoadCallback(_0x93b056, _0x7f95bc) {
        if (_0x7f95bc.success) {
            var _0xe3f769 = _0x7f95bc.satisfaction,
                _0x5082a4 = _0x7f95bc.lootable_human;
            0x2 === _0x7f95bc.relation_status ? (WMap.updateStatusInChunkTowns(_0x93b056.id, _0xe3f769, Timestamp.now() + farms_manager.getMethodTime(farms_manager.town.id), Timestamp.now(), _0x5082a4, 0x2), WMap.pollForMapChunksUpdate()) : WMap.updateStatusInChunkTowns(_0x93b056.id, _0xe3f769, Timestamp.now() + farms_manager.getMethodTime(farms_manager.town.id), Timestamp.now(), _0x5082a4), Layout.hideAjaxLoader(), Console.Log('<span style="color: #6FAE30;">' + _0x7f95bc.success + '</span>', 0x1);
        } else _0x7f95bc.error && Console.Log(farms_manager.town.name + ' ' + _0x7f95bc.error, 0x1);
    },
    claimLoads(_0x19be7e, _0x112363, _0x55b282) {
        basic_actions.claim_loads(farms_manager.town.id, _0x19be7e, _0x112363, farms_manager.getMethodTime(farms_manager.town.id), function(_0x312a59) {
            farms_manager.claimLoadsCallback(_0x312a59), _0x55b282(_0x312a59);
        });
    },
    getMethodTime(_0x2dd44b) {
        if (Game.features['battlepoint_villages']) {
            var _0x4cea9b = farms_manager.settings.method;
            return $.each(MM.getOnlyCollectionByName('Town').getTowns(), function(_0x555769, _0x559c78) {
                if (_0x559c78.id === _0x2dd44b && _0x559c78.getResearches().hasResearch('booty')) return _0x4cea9b = 0x2 * farms_manager.settings['method'], false;
            }), _0x4cea9b;
        }
        return farms_manager.settings.method;
    },
    claimLoadsCallback(_0x42ccc7) {
        if (_0x42ccc7.success) {
            var _0x1f8dff = _0x42ccc7.handled_farms;
            $.each(_0x1f8dff, function(_0x58f512, _0x7c9130) {
                0x2 === _0x7c9130.relation_status ? (WMap.updateStatusInChunkTowns(_0x58f512, _0x7c9130.satisfaction, Timestamp.now() + farms_manager.getMethodTime(farms_manager.town.id), Timestamp.now(), _0x7c9130.lootable_at, 0x2), WMap.pollForMapChunksUpdate()) : WMap.updateStatusInChunkTowns(_0x58f512, _0x7c9130.satisfaction, Timestamp.now() + farms_manager.getMethodTime(farms_manager.town.id), Timestamp.now(), _0x7c9130.lootable_at);
            }), Console.Log('<span style="color: #6FAE30;">' + _0x42ccc7.success + '</span>', 0x1);
        } else _0x42ccc7.error && Console.Log(farms_manager.town.name + ' ' + _0x42ccc7.error, 0x1);
    },
    finished(_0xec133c) {
        if (!farms_manager.checkEnabled()) return false;
        $.each(jugador.playerTowns, function(_0x65227, _0x27c152) {
            -0x1 !== farms_manager.town.relatedTowns['indexOf'](_0x27c152.id) && (_0x27c152.modules.Autofarm.isReadyTime = Timestamp.now() + _0xec133c);
        }), farms_manager.town.modules.Autofarm['isReadyTime'] = Timestamp.now() + _0xec133c, jugador.Queue.next();
    },
    stop() {
        clearInterval(farms_manager.interval);
    },
    init() {
        Console.Log('Initialize AutoFarm', 0x1), farms_manager.initButton(), farms_manager.checkCaptain();
    },
    initButton() {
        jugador.initButtons('Autofarm');
    },
    checkCaptain() {
        $('.advisor_frame.captain div').hasClass('captain_active') && (farms_manager.isCaptain = true);
    },
    setSettings(_0x42f705) {
        '' !== _0x42f705 && null != _0x42f705 && $.extend(farms_manager.settings, _0x42f705);
    },
    contentSettings() {
        return $('<fieldset/>', {
            'id': 'Autofarm_settings',
            'style': 'float:left; width:472px;height: 270px;'
        }).append($('<legend/>').html(farms_manager.title)).append(_0x257397.checkbox({
            'text': 'AutoStart AutoFarm.',
            'id': 'autofarm_autostart',
            'name': 'autofarm_autostart',
            'checked': farms_manager.settings['autostart'],
            'disabled': !jugador.hasPremium
        })).append(function() {
            var _0x1c9ebb = {
                'id': 'autofarm_method',
                'name': 'autofarm_method',
                'label': 'Farm method: ',
                'styles': 'width: 120px;',
                'value': farms_manager.settings['method'],
                'options': [{
                    'value': '300',
                    'name': '5 minute farm'
                }, {
                    'value': '1200',
                    'name': '20 minute farm'
                }, {
                    'value': '5400',
                    'name': '90 minute farm'
                }, {
                    'value': '14400',
                    'name': '240 minute farm'
                }],
                'disabled': false
            };
            jugador.hasPremium || (_0x1c9ebb = $.extend(_0x1c9ebb, {
                'disabled': true
            }));
            var _0x475db5 = _0x257397.selectBox(_0x1c9ebb);
            return jugador.hasPremium || _0x475db5.mousePopup(new MousePopup(jugador.requiredPrem)), _0x475db5;
        }).append(function() {
            var _0x504e0d = {
                'id': 'autofarm_bewteen',
                'name': 'autofarm_bewteen',
                'label': 'Time before next farm: ',
                'styles': 'width: 120px;',
                'value': farms_manager.settings.timebetween,
                'options': [{
                    'value': '1',
                    'name': '1-2 seconds'
                }, {
                    'value': '3',
                    'name': '3-4 seconds'
                }, {
                    'value': '5',
                    'name': '5-6 seconds'
                }, {
                    'value': '7',
                    'name': '7-8 seconds'
                }, {
                    'value': '9',
                    'name': '9-10 seconds'
                }]
            };
            jugador.hasPremium || (_0x504e0d = $.extend(_0x504e0d, {
                'disabled': true
            }));
            var _0x1b2a10 = _0x257397.selectBox(_0x504e0d);
            return jugador.hasPremium || _0x1b2a10.mousePopup(new MousePopup(jugador.requiredPrem)), _0x1b2a10;
        }).append(_0x257397.checkbox({
            'text': 'Skip farm when warehouse is full.',
            'id': 'autofarm_warehousefull',
            'name': 'autofarm_warehousefull',
            'checked': farms_manager.settings.skipwhenfull,
            'disabled': !jugador.hasPremium
        })).append(_0x257397.checkbox({
            'text': 'Lowest resources first with more towns on one island.',
            'id': 'autofarm_lowresfirst',
            'name': 'autofarm_lowresfirst',
            'checked': farms_manager.settings.lowresfirst,
            'disabled': !jugador.hasPremium
        })).append(_0x257397.checkbox({
            'text': 'Stop loot farm until mood is below 80%.',
            'id': 'autofarm_loot',
            'name': 'autofarm_loot',
            'checked': farms_manager.settings.stoplootbelow,
            'disabled': !jugador.hasPremium
        })).append(function() {
            var _0x54f8df = _0x257397.button({
                'name': DM.getl10n('notes').btn_save,
                'class': jugador.hasPremium ? '' : ' disabled',
                'style': 'top: 62px;'
            }).on('click', function() {
                if (!jugador.hasPremium) return false;
                var _0x56067b = $('#Autofarm_settings').serializeObject();
                farms_manager.settings.autostart = void 0 !== _0x56067b.autofarm_autostart, farms_manager.settings.method = parseInt(_0x56067b.autofarm_method), farms_manager.settings.timebetween = parseInt(_0x56067b.autofarm_bewteen), farms_manager.settings.skipwhenfull = void 0 !== _0x56067b.autofarm_warehousefull, farms_manager.settings.lowresfirst = void 0 !== _0x56067b.autofarm_lowresfirst, farms_manager.settings.stoplootbelow = void 0 !== _0x56067b.autofarm_loot, basic_actions.Auth('saveAutofarm', {
                    'player_id': data.Account.player_id,
                    'world_id': data.Account.world_id,
                    'csrfToken': data.Account.csrfToken,
                    'autofarm_settings': data.stringify(farms_manager.settings)
                }, farms_manager.callbackSave);
            });
            return jugador.hasPremium || _0x54f8df.mousePopup(new MousePopup(jugador.requiredPrem)), _0x54f8df;
        });
    },
    callbackSave() {
        Console.Log('Settings saved', 0x1), HumanMessage.success('The settings were saved!');
    }
};

Object.defineProperty(farms_manager, 'settings', {
    'enumerable': true,
    'writable': true,
    'value': {
        'autostart': false,
        'method': 0x4b0,
        'timebetween': 0x9,
        'skipwhenfull': true,
        'lowresfirst': true,
        'stoplootbelow': true
    }
}), Object.defineProperty(farms_manager, 'title', {
    'enumerable': true,
    'writable': true,
    'value': 'Autofarm settings'
}), Object.defineProperty(farms_manager, 'town', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(farms_manager, 'isPauzed', {
    'enumerable': true,
    'writable': true,
    'value': false
}), Object.defineProperty(farms_manager, 'iTown', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(farms_manager, 'interval', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(farms_manager, 'isCaptain', {
    'enumerable': true,
    'writable': true,
    'value': false
}), Object.defineProperty(farms_manager, 'shouldFarm', {
    'enumerable': true,
    'writable': true,
    'value': []
});


let module_auto_culture = {

    init() {
        Console.Log('Initialize Autoculture', 0x2), module_auto_culture.initButton();
    },
    initButton() {
        jugador.initButtons('Autoculture');
    },
    setSettings(new_settings) {
        '' !== new_settings && null != new_settings && $.extend(module_auto_culture.settings, new_settings);
    },

    checkAvailable(town) {
        var celebration_list = {
                'party': false,
                'triumph': false,
                'theater': false
            },
            buildings = ITowns.towns[town].buildings().attributes,
            resources = ITowns.towns[town].resources();
        return building.academy >= 0x1e && resources.wood >= 0x3a98 && resources.stone >= 0x4650 && resources.iron >= 0x3a98 && (celebration_list.party = true), 0x1 === building.theater && resources.wood >= 0x2710 && resources.stone >= 0x2ee0 && resources.iron >= 0x2710 && (celebration_list.theater = true), MM.getModelByNameAndPlayerId('PlayerKillpoints').getUnusedPoints() >= 0x12c && (celebration_list.triumph = true), celebration_list;
    },
    checkReady(town) {
        return !ITowns.towns[town.id].hasConqueror() && !!jugador.modules.Autoculture.isOn && (town.modules.Autoculture.isReadyTime >= Timestamp.now() ? town.modules['Autoculture'].isReadyTime : !(void 0 === module_auto_culture.settings['towns'][town.id] || !(module_auto_culture.settings.towns[town.id].party && module_auto_culture.checkAvailable(town.id).party || module_auto_culture.settings['towns'][town.id].triumph && module_auto_culture.checkAvailable(town.id).triumph || module_auto_culture.settings.towns[town.id].theater && module_auto_culture.checkAvailable(town.id).theater)));
    },
    startCulture(_0x535266) {
        return !!module_auto_culture.checkEnabled() && (jugador.modules.Autoculture.isOn ? (module_auto_culture.town = _0x535266, module_auto_culture.iTown = ITowns.towns[module_auto_culture.town.id], void(jugador.currentTown !== module_auto_culture.town.key ? (Console.Log(module_auto_culture.town.name + ' move to town.', 0x2), basic_actions.switch_town(module_auto_culture.town.id, function() {
            if (!module_auto_culture.checkEnabled()) return false;
            jugador.currentTown = module_auto_culture.town['key'], module_auto_culture.start();
        })) : module_auto_culture.start())) : (module_auto_culture.finished(0), false));
    },
    start() {
        if (!module_auto_culture.checkEnabled()) return false;
        module_auto_culture.interval = setTimeout(function() {
            void 0 !== module_auto_culture.settings['towns'][module_auto_culture.town.id] && (Console.Log(module_auto_culture.town.name + ' getting event information.', 0x2), basic_actions.building_place(module_auto_culture.town.id, function(response) {
                if (!module_auto_culture.checkEnabled()) return false;
                var celebration_list = [];
                celebration_list.push({
                    'name': 'triumph',
                    'waiting': 19200,
                    'element': $(response.plain.html).find('#place_triumph')
                }), celebration_list.push({
                    'name': 'party',
                    'waiting': 57600,
                    'element': $(response.plain.html).find('#place_party')
                }), celebration_list.push({
                    'name': 'theater',
                    'waiting': 285120,
                    'element': $(response.plain.html).find('#place_theater')
                });
                var _0x112f0d = false,
                    _0x6816b2 = 0,
                    _0x172121 = 0x12c;
                ! function _0x2213c3(_0x31c5ce) {
                    if (0x3 === _0x6816b2) return _0x112f0d || Console.Log(module_auto_culture.town.name + ' not ready yet.', 0x2), module_auto_culture.finished(_0x172121), false;
                    if ('triumph' === _0x31c5ce.name && (!module_auto_culture.settings['towns'][module_auto_culture.town.id].triumph || !module_auto_culture.checkAvailable(module_auto_culture.town.id).triumph || MM.getModelByNameAndPlayerId('PlayerKillpoints').getUnusedPoints() < 0x12c)) return _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false;
                    if (!('party' !== _0x31c5ce.name || module_auto_culture.settings.towns[module_auto_culture.town.id].party && module_auto_culture.checkAvailable(module_auto_culture.town.id).party)) return _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false;
                    if (!('theater' !== _0x31c5ce.name || module_auto_culture.settings['towns'][module_auto_culture.town.id].theater && module_auto_culture.checkAvailable(module_auto_culture.town.id).theater)) return _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false;
                    if (_0x31c5ce.element.find('#countdown_' + _0x31c5ce.name).length) {
                        var _0x135475 = data.timeToSeconds(_0x31c5ce.element.find('#countdown_' + _0x31c5ce.name).html());
                        return (0x12c === _0x172121 || _0x172121 > _0x135475) && (_0x172121 = _0x135475), _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false;
                    }
                    return '1' !== _0x31c5ce.element.find('.button, .button_new').data('enabled') ? (_0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false) : '1' === _0x31c5ce.element['find']('.button, .button_new').data('enabled') ? (module_auto_culture.interval = setTimeout(function() {
                        _0x112f0d = true, module_auto_culture.startCelebration(_0x31c5ce, function(_0x1f94e1) {
                            if (module_auto_culture.isPauzed) return false;
                            (0x12c === _0x172121 || _0x172121 >= _0x1f94e1) && (_0x172121 = _0x1f94e1), _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]);
                        });
                    }, (_0x6816b2 + 0x1) * data.randomize(0x3e8, 0x7d0)), false) : (_0x6816b2++, void _0x2213c3(celebration_list[_0x6816b2]));
                }(celebration_list[_0x6816b2]);
            }));
        }, data.randomize(2000, 4000));
    },

    startCelebration(_0x4e6929, _0x1cfbb7) {
        if (!module_auto_culture.checkEnabled()) return false;
        basic_actions.start_celebration(module_auto_culture.town.id, _0x4e6929.name, function(_0x126142) {
            if (!module_auto_culture.checkEnabled()) return false;
            var _0x50d2c2 = 0;
            if (void 0 === _0x126142.json['error']) {
                var _0x3196b3 = {};
                if ($.each(_0x126142.json.notifications, function(_0x245214, _0x52a18a) {
                        'Celebration' === _0x52a18a.subject && (_0x3196b3 = JSON.parse(_0x52a18a.param_str));
                    }), module_auto_culture.town.id === Game.townId)
                    for (var _0x7b7550 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0xf15587 = 0; _0x7b7550.length > _0xf15587; _0xf15587++) _0x7b7550[_0xf15587].getHandler().refresh();
                void 0 !== _0x3196b3.Celebration && (Console.Log('<span style="color: #fff;">' + PopupFactory.texts[_0x3196b3.Celebration.celebration_type] + ' is started.</span>', 0x2), _0x50d2c2 = _0x3196b3.Celebration.finished_at - Timestamp.now());
            } else Console.Log(module_auto_culture.town.name + ' ' + _0x126142.json['error'], 0x2);
            _0x1cfbb7(_0x50d2c2);
        });
    },

    stop() {
        clearInterval(module_auto_culture.interval), module_auto_culture.isStopped = true;
    },

    finished(_0x55d757) {
        if (!module_auto_culture.checkEnabled()) return false;
        module_auto_culture.town.modules.Autoculture.isReadyTime = Timestamp.now() + _0x55d757, jugador.Queue.next();
    },

    checkEnabled() {
        return jugador.modules.Autoculture['isOn'];
    },

    contentSettings() {
        var _0x35b0b1 = '<ul class="game_list" id="townsoverview"><li class="even">';
        _0x35b0b1 += '<div class=\"towninfo small tag_header col w80 h25\" id=\"header_town\"></div>', _0x35b0b1 += '<div class=\"towninfo small tag_header col w40\" id=\"header_island\"> Island</div>', _0x35b0b1 += '<div class="towninfo small tag_header col w35" id="header_wood"><div class="col header wood"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w40" id="header_stone"><div class="col header stone"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w40" id="header_iron"><div class="col header iron"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w35" id="header_free_pop"><div class="col header free_pop"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w40" id="header_storage"><div class="col header storage"></div></div>', _0x35b0b1 += '<div class=\"towninfo small tag_header col w50\" id=\"header_storage\"><div class=\"col header celebration party\"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration triumph"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration theater"></div></div>', _0x35b0b1 += '<div style="clear:both;"></div>', _0x35b0b1 += '</li></ul><div id=\"bot_townsoverview_table_wrapper\">', _0x35b0b1 += '<ul class="game_list scroll_content">';
        var _0xdceffd = 0;
        $.each(jugador.playerTowns, function(_0x4d1c39, _0x91954e) {
            var _0x44bc70 = ITowns.towns[_0x91954e.id],
                _0x3e364f = _0x44bc70.getIslandCoordinateX(),
                _0x58fc52 = _0x44bc70.getIslandCoordinateY(),
                _0xa0da5c = _0x44bc70.resources();
            _0x35b0b1 += '<li class="' + (_0xdceffd % 0x2 ? 'even' : 'odd') + ' bottom" id="ov_town_' + _0x44bc70.id + '\">', _0x35b0b1 += '<div class="towninfo small townsoverview col w80">', _0x35b0b1 += '<div>', _0x35b0b1 += '<span><a href="#' + _0x44bc70.getLinkFragment() + '" class="gp_town_link">' + _0x44bc70.name + '</a></span><br>', _0x35b0b1 += '<span>(' + _0x44bc70.getPoints() + ' Ptn.)</span>', _0x35b0b1 += '</div></div>', _0x35b0b1 += '<div class="towninfo small townsoverview col w40">', _0x35b0b1 += '<div>', _0x35b0b1 += '<span>' + _0x3e364f + ',' + _0x58fc52 + '</span>', _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div class="towninfo small townsoverview col w40">', _0x35b0b1 += '<div class="wood' + (_0xa0da5c.wood === _0xa0da5c.storage ? ' town_storage_full' : '') + '\">', _0x35b0b1 += _0xa0da5c.wood, _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div class=\"towninfo small townsoverview col w40\">', _0x35b0b1 += '<div class=\"stone' + (_0xa0da5c.stone === _0xa0da5c.storage ? ' town_storage_full' : '') + '\">', _0x35b0b1 += _0xa0da5c.stone, _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div class="towninfo small townsoverview col w40">', _0x35b0b1 += '<div class=\"iron' + (_0xa0da5c.iron === _0xa0da5c.storage ? ' town_storage_full' : '') + '\">', _0x35b0b1 += _0xa0da5c.iron, _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div class="towninfo small townsoverview col w35">', _0x35b0b1 += '<div>', _0x35b0b1 += '<span class="town_population_count">' + _0xa0da5c.population + '</span>', _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div class="towninfo small townsoverview col w40">', _0x35b0b1 += '<div>', _0x35b0b1 += '<span class=\"storage\">' + _0xa0da5c.storage + '</span>', _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div class="towninfo small townsoverview col w50">', _0x35b0b1 += '<div class=\"culture_party_row\" id=\"culture_party_' + _0x44bc70.id + '\">', _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div class=\"towninfo small townsoverview col w50\">', _0x35b0b1 += '<div class="culture_triumph_row" id="culture_triumph_' + _0x44bc70.id + '\">', _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div class="towninfo small townsoverview col w50">', _0x35b0b1 += '<div class="culture_theater_row" id="culture_theater_' + _0x44bc70.id + '\">', _0x35b0b1 += '</div>', _0x35b0b1 += '</div>', _0x35b0b1 += '<div style=\"clear:both;\"></div>', _0x35b0b1 += '</li>', _0xdceffd++;
        }), _0x35b0b1 += '</ul></div>', _0x35b0b1 += '<div class=\"game_list_footer\">', _0x35b0b1 += '<div id="bot_culture_settings"></div>', _0x35b0b1 += '</div>';
        var _0x495a43 = {};

        function _0x4610ba(_0xded280) {
            var _0x5b0cd = $(_0xded280 + ' .checkbox_new');
            _0x495a43[_0xded280] ? (_0x5b0cd.removeClass('checked'), _0x5b0cd.find('input[type="checkbox"]').prop('checked', false), _0x495a43[_0xded280] = false) : (_0x5b0cd.addClass('checked'), _0x5b0cd.find('input[type="checkbox"]').prop('checked', true), _0x495a43[_0xded280] = true);
        }
        var _0x1650b5 = $(_0x35b0b1);
        return _0x1650b5.find('.celebration.party').mousePopup(new MousePopup('Auto ' + PopupFactory.texts['party'])).on('click', function() {
            _0x4610ba('.culture_party_row');
        }), _0x1650b5.find('.celebration.triumph').mousePopup(new MousePopup('Auto ' + PopupFactory.texts.triumph)).on('click', function() {
            _0x4610ba('.culture_triumph_row');
        }), _0x1650b5.find('.celebration.theater').mousePopup(new MousePopup('Auto ' + PopupFactory.texts.theater)).on('click', function() {
            _0x4610ba('.culture_theater_row');
        }), $.each(jugador.playerTowns, function(_0x4a64b0, _0x29a967) {
            _0x1650b5.find('#culture_party_' + _0x29a967.id).html(_0x257397.checkbox({
                'id': 'bot_culture_party_' + _0x29a967.id,
                'name': 'bot_culture_party_' + _0x29a967.id,
                'checked': _0x29a967.id in module_auto_culture.settings['towns'] && module_auto_culture.settings.towns[_0x29a967.id].party,
                'disabled': !module_auto_culture.checkAvailable(_0x29a967.id).party
            })), _0x1650b5.find('#culture_triumph_' + _0x29a967.id).html(_0x257397.checkbox({
                'id': 'bot_culture_triumph_' + _0x29a967.id,
                'name': 'bot_culture_triumph_' + _0x29a967.id,
                'checked': _0x29a967.id in module_auto_culture.settings.towns && module_auto_culture.settings.towns[_0x29a967.id].triumph,
                'disabled': !module_auto_culture.checkAvailable(_0x29a967.id).triumph
            })), _0x1650b5.find('#culture_theater_' + _0x29a967.id).html(_0x257397.checkbox({
                'id': 'bot_culture_theater_' + _0x29a967.id,
                'name': 'bot_culture_theater_' + _0x29a967.id,
                'checked': _0x29a967.id in module_auto_culture.settings.towns && module_auto_culture.settings.towns[_0x29a967.id].theater,
                'disabled': !module_auto_culture.checkAvailable(_0x29a967.id).theater
            }));
        }), _0x1650b5.find('#bot_culture_settings').append(function() {
            var _0x5748c9 = _0x257397.button({
                'name': DM.getl10n('notes').btn_save,
                'style': 'float: left;',
                'class': jugador.hasPremium ? '' : ' disabled'
            }).on('click', function() {
                if (!jugador.hasPremium) return false;
                var _0x4fc462 = $('#bot_townsoverview_table_wrapper input').serializeObject();
                $.each(jugador.playerTowns, function(_0x51ecfa, _0x4e30f7) {
                    module_auto_culture.settings.towns[_0x4e30f7.id] = {
                        'party': false,
                        'triumph': false,
                        'theater': false
                    };
                }), $.each(_0x4fc462, function(_0x3def6b, _0x5ad879) {
                    _0x3def6b.indexOf('bot_culture_party_') >= 0 ? module_auto_culture.settings.towns[_0x3def6b.replace('bot_culture_party_', '')].party = void 0 !== _0x5ad879 : _0x3def6b.indexOf('bot_culture_triumph_') >= 0 ? module_auto_culture.settings.towns[_0x3def6b.replace('bot_culture_triumph_', '')].triumph = void 0 !== _0x5ad879 : _0x3def6b.indexOf('bot_culture_theater_') >= 0 && (module_auto_culture.settings['towns'][_0x3def6b.replace('bot_culture_theater_', '')].theater = void 0 !== _0x5ad879);
                }), module_auto_culture.settings.autostart = $('#autoculture_autostart').prop('checked'), basic_actions.Auth('saveCulture', {
                    'player_id': data.Account.player_id,
                    'world_id': data.Account.world_id,
                    'csrfToken': data.Account.csrfToken,
                    'autoculture_settings': data.stringify(module_auto_culture.settings)
                }, module_auto_culture.callbackSave);
            });
            return jugador.hasPremium || _0x5748c9.mousePopup(new MousePopup(jugador.requiredPrem)), _0x5748c9;
        }).append(_0x257397.checkbox({
            'text': 'AutoStart AutoCulture.',
            'id': 'autoculture_autostart',
            'name': 'autoculture_autostart',
            'checked': module_auto_culture.settings['autostart']
        })), _0x257397.gameWrapper('AutoCulture', 'bot_townsoverview', _0x1650b5, 'margin-bottom:9px;', !jugador.hasPremium);
    },

    callbackSave() {
        Console.Log('Settings saved', 0x2), HumanMessage.success('The settings were saved!');
    }
}
Object.defineProperty(module_auto_culture, 'settings', {
    'enumerable': true,
    'writable': true,
    'value': {
        'autostart': false,
        'towns': {}
    }
}), Object.defineProperty(module_auto_culture, 'town', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(module_auto_culture, 'iTown', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(module_auto_culture, 'interval', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(module_auto_culture, 'isStopped', {
    'enumerable': true,
    'writable': true,
    'value': false
});


let jugador = {
        init() {
            jugador.loadPlayerTowns(), jugador.initButtons(), jugador.initTimer();
        }, 
        start () {
            var _0x36c75b = false,
                _   0x497d31 = null;
            if ($.each(jugador.playerTowns, function (_0x3a949a, _0x5e32b2) {
                    var _0x5dfd05 = farms_manager.checkReady(_0x5e32b2);
                    true === _0x5dfd05 ? (_0x36c75b = true, jugador.Queue.add({
                        'townId': _0x5e32b2.id,
                        'fx': function () {
                            _0x5e32b2.startFarming();
                        }
                    })) : false !== _0x5dfd05 && (null == _0x497d31 || _0x5dfd05 < _0x497d31) && (_0x497d31 = _0x5dfd05);
                    var _0x1e0783 = module_auto_culture.checkReady(_0x5e32b2);
                    true === _0x1e0783 ? (_0x36c75b = true, jugador.Queue.add({
                        'townId': _0x5e32b2.id,
                        'fx': function () {
                            _0x5e32b2.startCulture();
                        }
                    })) : false !== _0x1e0783 && (null == _0x497d31 || _0x1e0783 < _0x497d31) && (_0x497d31 = _0x1e0783);
                    var _0x3dab92 = _0x12eddf.checkReady(_0x5e32b2);
                    true === _0x3dab92 ? (_0x36c75b = true, jugador.Queue.add({
                        'townId': _0x5e32b2.id,
                        'fx': function () {
                            _0x5e32b2.startBuild();
                        }
                    })) : false !== _0x3dab92 && (null == _0x497d31 || _0x3dab92 < _0x497d31) && (_0x497d31 = _0x3dab92);
                }), null !== _0x497d31 || _0x36c75b)
                if (_0x36c75b) jugador.Queue.start();
                else {
                    var _0x360e83 = _0x497d31 - Timestamp.now() + 0xa;
                    jugador.startTimer(_0x360e83, function () {
                        jugador.start();
                    });
                }
            else Console.Log('Nothing is ready yet!', 0), jugador.startTimer(0x1e, function () {
                jugador.start();
            });
        }, 
        stop () {
            clearInterval(jugador.interval), jugador.Queue.stop(), $('#time_autobot .caption .value_container .curr').html('Stopped');
        },
        finished () {
            jugador.start();
        }, 
        initTimer () {
            $('.nui_main_menu').css('top', '275px'), $('#time_autobot').append(_0x257397.timerBoxSmall({
                'id': 'Autofarm_timer',
                'styles': '',
                'text': 'Start Autobot'
            })).show();
        }, 
        updateTimer (_0x17eb87, _0x273027) {
            var _0x4716cc = 0;
            _0x4716cc = void 0 !== _0x17eb87 && void 0 !== _0x273027 ? (jugador.Queue.total - (jugador.Queue.queue.length + 0x1) + _0x273027 / _0x17eb87) / jugador.Queue.total * 0x64 : (jugador.Queue.total - jugador.Queue.queue.length) / jugador.Queue.total * 0x64, isNaN(_0x4716cc) || ($('#time_autobot .progress .indicator').width(_0x4716cc + '%'), $('#time_autobot .caption .value_container .curr').html(Math.round(_0x4716cc) + '%'));
        }, 
        checkAutostart () {
            if (farms_manager.settings.autostart) {
                jugador.modules.Autofarm['isOn'] = true;
                var _0x14943a = $('#Autofarm_onoff');
                _0x14943a.addClass('on'), _0x14943a.find('span').mousePopup(new MousePopup('Stop Autofarm'));
            }
            if (module_auto_culture.settings['autostart']) {
                jugador.modules['Autoculture'].isOn = true;
                var _0xb1db21 = $('#Autoculture_onoff');
                _0xb1db21.addClass('on'), _0xb1db21.find('span').mousePopup(new MousePopup('Stop Autoculture'));
            }
            if (_0x12eddf.settings['autostart']) {
                jugador.modules.Autobuild.isOn = true;
                var _0xe53eb6 = $('#Autobuild_onoff');
                _0xe53eb6.addClass('on'), _0xe53eb6.find('span').mousePopup(new MousePopup('Stop Autobuild'));
            }(farms_manager.settings.autostart || module_auto_culture.settings.autostart || _0x12eddf.settings['autostart']) && jugador.start();
        }, 
        startTimer (_0x127196, _0x227a94) {
            var _0x4dec49 = _0x127196;
            jugador.interval = setInterval(function () {
                $('#time_autobot .caption .value_container .curr').html(data.toHHMMSS(_0x127196)), $('#time_autobot .progress .indicator').width((_0x4dec49 - _0x127196) / _0x4dec49 * 0x64 + '%'), --_0x127196 < 0 && (clearInterval(jugador.interval), _0x227a94());
            }, 0x3e8);
        }, 

        initButtons(_0x89fea) {
            var _0x232241 = $('#' + _0x89fea + '_onoff');
            _0x232241.removeClass('disabled'), _0x232241.on('click', function (_0x3470ce) {
                if (_0x3470ce.preventDefault(), 'Autoattack' === _0x89fea && !data.checkPremium('captain')) return HumanMessage.error(Game.premium_data.captain.name + ' ' + DM.getl10n('premium').advisors.not_activated['toLowerCase']() + '.'), false;
                true === jugador.modules[_0x89fea].isOn ? (jugador.modules[_0x89fea].isOn = false, _0x232241.removeClass('on'), _0x232241.find('span').mousePopup(new MousePopup('Start ' + _0x89fea)), HumanMessage.success(_0x89fea + ' is deactivated.'), Console.Log(_0x89fea + ' is deactivated.', 0), 'Autofarm' === _0x89fea ? farms_manager.stop() : 'Autoculture' === _0x89fea ? module_auto_culture.stop() : 'Autobuild' === _0x89fea ? _0x12eddf.stop() : 'Autoattack' === _0x89fea && attack_manager.stop()) : false === jugador.modules[_0x89fea].isOn && (_0x232241.addClass('on'), HumanMessage.success(_0x89fea + ' is activated.'), Console.Log(_0x89fea + ' is activated.', 0), _0x232241.find('span').mousePopup(new MousePopup('Stop ' + _0x89fea)), jugador.modules[_0x89fea].isOn = true, 'Autoattack' === _0x89fea && attack_manager.start()), 'Autoattack' !== _0x89fea && jugador.checkWhatToStart();
            }), _0x232241.find('span').mousePopup(new MousePopup('Start ' + _0x89fea));
        }, 
        checkWhatToStart () {
            var _0x335074 = 0;
            $.each(jugador.modules, function (_0x32c7a4, _0x3f5cd9) {
                _0x3f5cd9.isOn && 'Autoattack' !== _0x3f5cd9 && _0x335074++;
            }), 0 === _0x335074 ? jugador.stop() : _0x335074 >= 0 && !jugador.Queue.isRunning() && (clearInterval(jugador.interval), jugador.start());
        }, 
        loadPlayerTowns () {
            var _0xa8e110 = 0;
            $.each(ITowns.towns, function (_0x5d6913, _0xe12385) {
                var _0x11009d = new jugador.models.Town();
                _0x11009d.key = _0xa8e110, _0x11009d.id = _0xe12385.id, _0x11009d.name = _0xe12385.name, $.each(ITowns.towns, function (_0x4296f0, _0x46672c) {
                    _0xe12385.getIslandCoordinateX() === _0x46672c.getIslandCoordinateX() && _0xe12385.getIslandCoordinateY() === _0x46672c.getIslandCoordinateY() && _0xe12385.id !== _0x46672c.id && _0x11009d.relatedTowns['push'](_0x46672c.id);
                }), jugador.playerTowns.push(_0x11009d), _0xa8e110++;
            }), jugador.playerTowns['sort'](function (_0x52161f, _0x570499) {
                var _0xe14144 = _0x52161f.name,
                    _0x1fae73 = _0x570499.name;
                return _0xe14144 === _0x1fae73 ? 0 : _0xe14144 > _0x1fae73 ? 0x1 : -0x1;
            });
        }, 
        callbackAuth (argumento) {
            data.isLogged = true,
            data.trial_time = argumento.trial_time,
            data.premium_time = argumento.premium_time,
            data.facebook_like = argumento.facebook_like,
            '' !== argumento.assistant_settings && module_auto_builds.setSettings(argumento.assistant_settings),
            data.trial_time - Timestamp.now() >= 0 || data.premium_time - Timestamp.now() >= 0 ? (jugador.hasPremium = true, jugador.init(), farms_manager.init(), farms_manager.setSettings(argumento.autofarm_settings), module_auto_culture.init(), module_auto_culture.setSettings(argumento.autoculture_settings), _0x12eddf.init(),
             _0x12eddf.setSettings(argumento.autobuild_settings), _0x12eddf.setQueue(argumento.building_queue,
                 argumento.units_queue, argumento.ships_queue), attack_manager.init(), jugador.checkAutostart()) :
                  (jugador.hasPremium = false, jugador.init(), farms_manager.init(), $('#Autoculture_onoff').mousePopup(new MousePopup(jugador.requiredPrem)),
                   $('#Autobuild_onoff').mousePopup(new MousePopup(jugador.requiredPrem)), $('#Autoattack_onoff').mousePopup(new MousePopup(jugador.requiredPrem)),
                    data.createNotification('getPremiumNotification', 'Unfortunately your premium membership is over. Please upgrade now!'));
        }
    }

Object.defineProperty(jugador, 'models', {
    'enumerable': true,
    'writable': true,
    'value': {
        'Town': function () {
            this.key = null, this.id = null, this.name = null, this.farmTowns = {}, this.relatedTowns = [], this.currentFarmCount = 0, this.modules = {
                'Autofarm': {
                    'isReadyTime': 0
                },
                'Autoculture': {
                    'isReadyTime': 0
                },
                'Autobuild': {
                    'isReadyTime': 0
                }
            }, this.startFarming = function () {
                farms_manager.startFarming(this);
            }, this.startCulture = function () {
                module_auto_culture.startCulture(this);
            }, this.startBuild = function () {
                _0x12eddf.startBuild(this);
            };
        }
    }
}), Object.defineProperty(jugador, 'Queue', {
    'enumerable': true,
    'writable': true,
    'value': {
        'total': 0,
        'queue': [],
        'add': function (_0x48b820) {
            this.total++, this.queue.push(_0x48b820);
        },
        'start': function () {
            this.next();
        },
        'stop': function () {
            this.queue = [];
        },
        'isRunning': function () {
            return this.queue.length > 0 || this.total > 0;
        },
        'next': function () {
            jugador.updateTimer();
            var _0x1e567e = this.queue['shift']();
            _0x1e567e ? _0x1e567e.fx() : this.queue.length <= 0 && (this.total = 0, jugador.finished());
        }
    }
}), Object.defineProperty(jugador, 'currentTown', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(jugador, 'playerTowns', {
    'enumerable': true,
    'writable': true,
    'value': []
}), Object.defineProperty(jugador, 'interval', {
    'enumerable': true,
    'writable': true,
    'value': false
}), Object.defineProperty(jugador, 'hasPremium', {
    'enumerable': true,
    'writable': true,
    'value': false
}), Object.defineProperty(jugador, 'modules', {
    'enumerable': true,
    'writable': true,
    'value': {
        'Autofarm': {
            'isOn': false
        },
        'Autoculture': {
            'isOn': false
        },
        'Autobuild': {
            'isOn': false
        },
        'Autoattack': {
            'isOn': false
        }
    }
}), Object.defineProperty(jugador, 'requiredPrem', {
    'enumerable': true,
    'writable': true,
    'value': DM.getl10n('tooltips').requirements.replace('.', '') + ' premium'
});




let module_autobot = {
     info() {
        ! function (_0x4ad9aa, _0x523b59) {
            if (!(_0x4ad9aa instanceof _0x523b59)) throw new TypeError('Cannot call a class as a function');
        }(this, info), Object.defineProperty(this, 'trial_time', {
            'enumerable': true,
            'writable': true,
            'value': 0
        }), Object.defineProperty(this, 'premium_time', {
            'enumerable': true,
            'writable': true,
            'value': 0
        }), Object.defineProperty(this, 'facebook_like', {
            'enumerable': true,
            'writable': true,
            'value': 0
        }), Object.defineProperty(this, 'toolbox_element', {
            'enumerable': true,
            'writable': true,
            'value': null
        });
    },
        init () {
            Console.Log('Initialize Autobot', 0), module_autobot.authenticate(), module_autobot.obServer(), module_autobot.isActive(), module_autobot.setToolbox(), module_autobot.initAjax(), module_autobot.initMapTownFeature(), module_autobot.fixMessage(), module_auto_builds.init();
        }, 
        setToolbox () {
            module_autobot.toolbox_element = $('.nui_bot_toolbox');
        }, 
        authenticate () {
            basic_actions.Auth('login', module_autobot.Account, jugador.callbackAuth);
        },
        obServer () {
            $.Observer(GameEvents.notification.push).subscribe('GRCRTNotification', function () {
                $('#notification_area>.notification.getPremiumNotification').on('click', function () {
                    module_autobot.getPremium();
                });
            });
        }, 
        initWnd () {
            if (module_autobot.isLogged) {
                if (void 0 !== module_autobot.botWnd) {
                    try {
                        module_autobot.botWnd.close();
                    } catch (_0x481090) {}
                    module_autobot.botWnd = void 0;
                }
                if (void 0 !== module_autobot.botPremWnd) {
                    try {
                        module_autobot.botPremWnd.close();
                    } catch (_0x2df9e8) {}
                    module_autobot.botPremWnd = void 0;
                }
                module_autobot.botWnd = Layout.dialogWindow.open('', module_autobot.title + ' v<span style="font-size: 10px;">' + module_autobot.version + '</span>', 0x1f4, 0x15e, '', false), module_autobot.botWnd.setHeight([0x15e]), module_autobot.botWnd.setPosition(['center', 'center']);
                var _0x2ecea2 = module_autobot.botWnd.getJQElement();
                _0x2ecea2.append($('<div/>', {
                    'class': 'menu_wrapper',
                    'style': 'left: 78px; right: 14px'
                }).append($('<ul/>', {
                    'class': 'menu_inner'
                }).prepend(module_autobot.addMenuItem('AUTHORIZE', 'Account', 'Account')).prepend(module_autobot.addMenuItem('CONSOLE', 'Assistant', 'Assistant')).prepend(module_autobot.addMenuItem('ASSISTANT', 'Console', 'Console')).prepend(module_autobot.addMenuItem('SUPPORT', 'Support', 'Support')))), _0x2ecea2.find('.menu_inner li:last-child').before(module_autobot.addMenuItem('ATTACKMODULE', 'Attack', 'Autoattack')), _0x2ecea2.find('.menu_inner li:last-child').before(module_autobot.addMenuItem('CONSTRUCTMODULE', 'Build', 'Autobuild')), _0x2ecea2.find('.menu_inner li:last-child').before(module_autobot.addMenuItem('CULTUREMODULE', 'Culture', 'Autoculture')), _0x2ecea2.find('.menu_inner li:last-child').before(module_autobot.addMenuItem('FARMMODULE', 'Farm', 'Autofarm')), $('#Autobot-AUTHORIZE').click();
            }
        }, 
        addMenuItem (_0x323aaf, _0x2a8beb, _0x321554, _0x9a8b2a) {
            return $('<li/>').append($('<a/>', {
                'class': 'submenu_link',
                'href': '#',
                'id': 'Autobot-' + _0x323aaf,
                'rel': _0x321554
            }).click(function () {
                if (_0x9a8b2a) return false;
                if (module_autobot.botWnd.getJQElement().find('li a.submenu_link').removeClass('active'), $(this).addClass('active'), module_autobot.botWnd.setContent2(module_autobot.getContent($(this).attr('rel'))), 'Console' === $(this).attr('rel')) {
                    var _0x6228f6 = $('.terminal'),
                        _0x4867f1 = $('.terminal-output')[0].scrollHeight;
                    _0x6228f6.scrollTop(_0x4867f1);
                }
            }).append(function () {
                return 'Support' !== _0x321554 ? $('<span/>', {
                    'class': 'left'
                }).append($('<span/>', {
                    'class': 'right'
                }).append($('<span/>', {
                    'class': 'middle'
                }).html(_0x2a8beb))) : '<a id="help-button" onclick="return false;" class="confirm"></a>';
            }));
        }, 
        getContent (_0x4d0bfc) {
            return 'Console' === _0x4d0bfc ? Console.contentConsole() : 'Account' === _0x4d0bfc ? module_autobot.contentAccount() : 'Support' === _0x4d0bfc ? module_autobot.contentSupport() : 'Autofarm' === _0x4d0bfc ? farms_manager.contentSettings() : 'Autobuild' === _0x4d0bfc ? _0x12eddf.contentSettings() : 'Autoattack' === _0x4d0bfc ? attack_manager.contentSettings() : 'Autoculture' === _0x4d0bfc ? module_auto_culture.contentSettings() : 'Assistant' === _0x4d0bfc ? module_auto_builds.contentSettings() : void 0;
        }, 
        //Contenidos de cada TAB
        contentAccount () {
            var _0x2b96f2 = {
                    'Name:': Game.player_name,
                    'World:': Game.world_id,
                    'Rank:': Game.player_rank,
                    'Towns:': Game.player_villages,
                    'Language:': Game.locale_lang
                },
                _0x5298c8 = $('<table/>', {
                    'class': 'game_table layout_main_sprite',
                    'cellspacing': '0',
                    'width': '100%'
                }).append(function () {
                    var _0xa38a24 = 0,
                        _0x3bb040 = $('<tbody/>');
                    return $.each(_0x2b96f2, function (_0x5501da, _0x207de7) {
                        _0x3bb040.append($('<tr/>', {
                            'class': _0xa38a24 % 0x2 ? 'game_table_even' : 'game_table_odd'
                        }).append($('<td/>', {
                            'style': 'background-color: #DFCCA6;width: 30%;'
                        }).html(_0x5501da)).append($('<td/>').html(_0x207de7))), _0xa38a24++;
                    }), _0x3bb040.append($('<tr/>', {
                        'class': 'game_table_even'
                    }).append($('<td/>', {
                        'style': 'background-color: #DFCCA6;width: 30%;'
                    }).html('Premium:')).append($('<td/>').append(module_autobot.premium_time - Timestamp.now() >= 0 ? module_autobot.secondsToTime(module_autobot.premium_time - Timestamp.now()) : 'No premium').append($('<div/>', {
                        'id': 'premium-bot'
                    }).append($('<div/>', {
                        'class': 'js-caption'
                    }).html(module_autobot.premium_time - Timestamp.now() >= 0 ? 'Add days' : 'Get Premium')).on('click', function () {
                        return module_autobot.getPremium();
                    })))), _0x3bb040.append($('<tr/>', {
                        'class': 'game_table_odd'
                    }).append($('<td/>', {
                        'style': 'background-color: #DFCCA6;width: 30%;'
                    }).html('Trial:')).append($('<td/>').append(function () {
                        return module_autobot.trial_time - Timestamp.now() >= 0 ? module_autobot.secondsToTime(module_autobot.trial_time - Timestamp.now()) : 'Trial is over';
                    }).append(function () {
                        return 0 === module_autobot.facebook_like ? $('<a/>', {
                            'id': 'get_7days'
                        }).html('Get 3 free days!').click('on', function () {
                            return module_autobot.botFacebookWnd();
                        }) : null;
                    }))), _0x3bb040;
                });
            return _0x257397.gameWrapper('Account', 'account_property_wrapper', _0x5298c8, 'margin-bottom:9px;').append($('<div/>', {
                'id': 'grepobanner',
                'style': ''
            }));
        }, 
        contentSupport () {
            return $('<fieldset/>', {
                'id': 'Support_tab',
                'style': 'float:left; width:472px;height: 270px;'
            }).append($('<legend/>').html('Grepobot Support')).append($('<div/>', {
                'style': 'float: left;'
            }).append(_0x257397.selectBox({
                'id': 'support_type',
                'name': 'support_type',
                'label': 'Type: ',
                'styles': 'width: 167px;margin-left: 18px;',
                'value': 'Bug report',
                'options': [{
                    'value': 'Bug report',
                    'name': 'Bug report'
                }, {
                    'value': 'Feature request',
                    'name': 'Feature request'
                }, {
                    'value': 'Financial',
                    'name': 'Financial'
                }, {
                    'value': 'Other',
                    'name': 'Other'
                }]
            })).append(_0x257397.input({
                'id': 'support_input_email',
                'name': 'Email',
                'style': 'margin-left: 12px;width: 166px;',
                'value': '',
                'type': 'email'
            })).append(_0x257397.input({
                'id': 'support_input_subject',
                'name': 'Subject',
                'style': 'margin-top: 0;width: 166px;',
                'value': '',
                'type': 'text'
            })).append(_0x257397.textarea({
                'id': 'support_textarea',
                'name': 'Message',
                'value': ''
            })).append(_0x257397.button({
                'name': 'Send',
                'style': 'margin-top: 0;'
            }).on('click', function () {
                var _0x1531b8 = $('#Support_tab').serializeObject(),
                    _0x360978 = false;
                void 0 === _0x1531b8.support_input_email || '' === _0x1531b8.support_input_email ? _0x360978 = 'Please enter your email.' : void 0 === _0x1531b8.support_input_subject || '' === _0x1531b8.support_input_subject ? _0x360978 = 'Please enter a subject.' : void 0 === _0x1531b8.support_textarea || '' === _0x1531b8.support_textarea ? _0x360978 = 'Please enter a message.' : void 0 === _0x1531b8.support_input_email || /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/ ['test'](_0x1531b8.support_input_email) || (_0x360978 = 'Your email is not valid!'), _0x360978 ? HumanMessage.error(_0x360978) : basic_actions.Auth('supportEmail', $.extend({
                    'csrfToken': module_autobot.Account.csrfToken,
                    'player_name': module_autobot.Account.player_name,
                    'player_id': module_autobot.Account['player_id'],
                    'world_id': module_autobot.Account.world_id
                }, _0x1531b8), function (_0x5757b7) {
                    if (_0x5757b7.success) {
                        if (void 0 !== module_autobot.botWnd) {
                            try {
                                module_autobot.botWnd.close();
                            } catch (_0xfee7fb) {}
                            module_autobot.botWnd = void 0;
                        }
                        HumanMessage.success('Thank you, your email has been send!');
                    }
                });
            }))).append($('<div/>', {
                'style': 'float: right; width: 215px;'
            }).append($('<a/>', {
                'id': 'Facebook_grepobot',
                'target': '_blank',
                'href': 'https://www.facebook.com/BotForGrepolis/'
            }).html('<img src=\"https://bot.grepobot.com/images/facebook_page.png\" title=\"Facebook Grepobot\"/>')));
        }, 
        checkAlliance () {
            $('.allianceforum.main_menu_item').hasClass('disabled') || basic_actions.members_show(function (_0x23fa5a) {
                void 0 !== _0x23fa5a.plain.html && $.each($(_0x23fa5a.plain.html).find('#ally_members_body .ally_name a'), function () {
                    var _0x161826 = atob($(this).attr('href'));
                    console.log(JSON.parse(_0x161826.substr(0, _0x161826.length - 0x3)));
                });
            });
        }, 
        fixMessage () {
            var _0x21d00b;
            HumanMessage._initialize = (_0x21d00b = HumanMessage._initialize, function () {
                _0x21d00b.apply(this, arguments), $(window).unbind('click');
            });
        }, 
        getPremium () {
            var _0x53133a = this;
            if (module_autobot.isLogged) {
                if ($.Observer(GameEvents.menu.click).publish({
                        'option_id': 'premium'
                    }), void 0 !== module_autobot.botPremWnd) {
                    try {
                        module_autobot.botPremWnd['close']();
                    } catch (_0x7923ce) {}
                    module_autobot.botPremWnd = void 0;
                }
                if (void 0 !== module_autobot.botWnd) {
                    try {
                        module_autobot.botWnd.close();
                    } catch (_0x20b49d) {}
                    module_autobot.botWnd = void 0;
                }
                module_autobot.botPremWnd = Layout.dialogWindow.open('', 'Autobot v' + module_autobot.version + ' - Premium', 0x1f4, 0x15e, '', false), module_autobot.botPremWnd.setHeight([0x15e]), module_autobot.botPremWnd.setPosition(['center', 'center']);
                var _0x2c9709 = $('<div/>', {
                    'id': 'payment'
                }).append($('<div/>', {
                    'id': 'left'
                }).append($('<ul/>', {
                    'id': 'time_options'
                }).append($('<li/>', {
                    'class': 'active'
                }).append($('<span/>', {
                    'class': 'amount'
                }).html('1 Month')).append($('<span/>', {
                    'class': 'price'
                }).html('€&nbsp;4,99'))).append($('<li/>').append($('<span/>', {
                    'class': 'amount'
                }).html('2 Month')).append($('<span/>', {
                    'class': 'price'
                }).html('€&nbsp;9,99')).append($('<div/>', {
                    'class': 'referenceAmount'
                }).append($('<div/>', {
                    'class': 'reference',
                    'style': 'transform: rotate(17deg);'
                }).html('+12 Days&nbsp;')))).append($('<li/>').append($('<span/>', {
                    'class': 'amount'
                }).html('4 Months')).append($('<span/>', {
                    'class': 'price'
                }).html('€&nbsp;19,99')).append($('<div/>', {
                    'class': 'referenceAmount'
                }).append($('<div/>', {
                    'class': 'reference',
                    'style': 'transform: rotate(17deg);'
                }).html('+36 Days&nbsp;')))).append($('<li/>').append($('<span/>', {
                    'class': 'amount'
                }).html('10 Months')).append($('<span/>', {
                    'class': 'price'
                }).html('€&nbsp;49,99')).append($('<div/>', {
                    'class': 'referenceAmount'
                }).append($('<div/>', {
                    'class': 'reference',
                    'style': 'transform: rotate(17deg);'
                }).html('+120 Days&nbsp;')))))).append($('<div/>', {
                    'id': 'right'
                }).append($('<div/>', {
                    'id': 'pothead'
                })).append($('<div/>', {
                    'id': 'information'
                })));
                module_autobot.botPremWnd['setContent2'](_0x2c9709), $('#time_options li').on('click', function () {
                    $('#time_options li').removeClass('active'), $(this).addClass('active');
                }), basic_actions.PaymentOptions(function (_0x7b4639) {
                    _0x53133a.makeSelectbox(_0x7b4639);
                });
            }
        }, 

        makeSelectbox (_0x291a1e) {
            var _0x2a004f = {},
                _0x157f3d = $('<select/>', {
                    'id': 'paymentSelect'
                }).append(function () {
                    for (var _0x1a4922 = [], _0x3a3544 = 0; _0x3a3544 < _0x291a1e.length; _0x3a3544++) {
                        var _0x49a91a = _0x291a1e[_0x3a3544];
                        _0x2a004f[_0x49a91a.id] = {
                            'small': _0x49a91a.image.size1x,
                            'big': _0x49a91a.image.size2x
                        }, _0x1a4922.push($('<option/>', {
                            'value': _0x49a91a.id
                        }).html(_0x49a91a.description.replace('Button', '')));
                    }
                    return _0x1a4922;
                });
            $('#payment #information').append(_0x157f3d);
            var _0x91564a = _0x157f3d,
                _0x3a980f = _0x157f3d.children('option').length;
            _0x157f3d.addClass('s-hidden'), _0x91564a.wrap('<div class="select"></div>'), _0x91564a.after('<div class="styledSelect"></div>');
            var _0x5d44d5 = _0x91564a.next('div.styledSelect');
            _0x5d44d5.text(_0x91564a.children('option').eq(0).text()), $('#payment #information').append(function () {
                var _0x27a71e = _0x91564a.children('option').eq(0).val();
                return $('<div/>', {
                    'id': 'payment-button',
                    'style': "background-image: url('" ['concat'](_0x2a004f[_0x27a71e].big, '\')')
                }).on('click', function () {
                    return module_autobot.doPayment($('#time_options').children('.active').index() + 0x1, _0x27a71e);
                });
            });
            for (var _0x3c733a = $('<ul />', {
                    'class': 'options'
                }).insertAfter(_0x5d44d5), _0x2cfc69 = 0; _0x2cfc69 < _0x3a980f; _0x2cfc69++) {
                var _0x4a20d5 = _0x91564a.children('option').eq(_0x2cfc69).val();
                $('<li />', {
                    'text': _0x91564a.children('option').eq(_0x2cfc69).text(),
                    'rel': _0x4a20d5
                }).append($('<div/>', {
                    'class': 'payment-option',
                    'style': "background-image: url('" ['concat'](_0x2a004f[_0x4a20d5].small, '\')')
                })).appendTo(_0x3c733a);
            }
            var _0x2faae5 = _0x3c733a.children('li');
            _0x5d44d5.click(function (_0x5f272d) {
                _0x5f272d.stopPropagation(), $('div.styledSelect.active').each(function () {
                    $(this).removeClass('active').next('ul.options').hide();
                }), $(this).toggleClass('active').next('ul.options').toggle();
            }), _0x2faae5.click(function (_0x17b5e5) {
                var _0x473776 = this;
                _0x17b5e5.stopPropagation(), $('#payment-button').remove(), _0x5d44d5.text($(this).text()).removeClass('active'), $('#payment #information').append($('<div/>', {
                    'id': 'payment-button',
                    'style': "background-image: url('" ['concat'](_0x2a004f[$(this).attr('rel')].big, '\')')
                }).on('click', function () {
                    return module_autobot.doPayment($('#time_options').children('.active').index() + 0x1, $(_0x473776).attr('rel'));
                })), _0x91564a.val($(this).attr('rel')), _0x3c733a.hide();
            }), $(document).click(function () {
                _0x5d44d5.removeClass('active'), _0x3c733a.hide();
            });
        }, 
        doPayment (_0x16b1c1, _0x12a284) {
            window.open(module_autobot.domain + 'payment?option=' + _0x16b1c1 + '&method=' + _0x12a284 + '&player_id=' + module_autobot.Account.player_id, 'grepolis_payment', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,height=650,width=800');
        }, 
        botFacebookWnd () {
            if (module_autobot.isLogged && 0 === module_autobot.facebook_like) {
                if (void 0 !== module_autobot.facebookWnd) {
                    try {
                        module_autobot.facebookWnd['close']();
                    } catch (_0x4b7c28) {}
                    module_autobot.facebookWnd = void 0;
                }
                module_autobot.facebookWnd = Layout.dialogWindow.open('', 'Autobot v' + module_autobot.version + ' - Get 3 days free!', 0x113, 0x7d, '', false), module_autobot.facebookWnd['setHeight']([0x7d]), module_autobot.facebookWnd.setPosition(['center', 'center']);
                var _0x331c0b = $('<div/>', {
                    'id': 'facebook_wnd'
                }).append('<span class=\"like-share-text\">Like & share and get <b>3 days</b> free premium.</span><a href=\"#\" class=\"fb-share\"><span class=\"fb-text\">Share</spanclass></a><div class=\"fb_like\"><div class=\"fb-like\" data-href=\"https://www.facebook.com/BotForGrepolis/\" data-layout=\"button\" data-action=\"like\" data-show-faces=\"false\" data-share=\"false\"></div></div>');
                module_autobot.facebookWnd.setContent2(_0x331c0b), $('.ui-dialog #facebook_wnd').closest('.gpwindow_content').css({
                    'left': '-9px',
                    'right': '-9px',
                    'top': '35px'
                });
                var _0x4a7adf = false,
                    _0x503fb1 = false,
                    _0x3b4791 = function () {
                        if ((_0x4a7adf || _0x503fb1) && module_autobot.upgrade3Days(), _0x4a7adf && _0x503fb1) {
                            if ($.Observer(GameEvents.window['quest'].open).publish({
                                    'quest_type': 'hermes'
                                }), HumanMessage.success('You have received 3 days premium! Thank you for sharing.'), void 0 !== module_autobot.facebookWnd) {
                                try {
                                    module_autobot.facebookWnd.close();
                                } catch (_0x21e7fb) {}
                                module_autobot.facebookWnd = void 0;
                            }
                            if (void 0 !== module_autobot.botWnd) {
                                try {
                                    module_autobot.botWnd['close']();
                                } catch (_0x40a9d3) {}
                                module_autobot.botWnd = void 0;
                            }
                        }
                    };
                void 0 === window.fbAsyncInit && (window.fbAsyncInit = function () {
                    FB.init({
                        'appId': '1505555803075328',
                        'xfbml': true,
                        'version': 'v2.4'
                    }), FB.Event.subscribe('edge.create', function () {
                        _0x503fb1 = true, _0x3b4791();
                    }), FB.Event['subscribe']('edge.remove', function () {
                        _0x503fb1 = false;
                    });
                }), $('#facebook-jssdk').length <= 0 ? (_0x127caa = document, _0x40ccaa = 'script', _0x54267b = 'facebook-jssdk', _0xf55cce = _0x127caa.getElementsByTagName(_0x40ccaa)[0], _0x127caa.getElementById(_0x54267b) || ((_0x3dc931 = _0x127caa.createElement(_0x40ccaa)).id = _0x54267b, _0x3dc931.src = '//connect.facebook.net/en_US/sdk.js', _0xf55cce.parentNode.insertBefore(_0x3dc931, _0xf55cce))) : FB.XFBML.parse(), $('#facebook_wnd .fb-share').on('click', function () {
                    FB.ui({
                        'method': 'share',
                        'href': 'https://www.facebook.com/BotForGrepolis/'
                    }, function (_0x155b31) {
                        _0x155b31 && !_0x155b31.error_code && (_0x4a7adf = true, _0x3b4791());
                    });
                });
            }
            var _0x127caa, _0x40ccaa, _0x54267b, _0x3dc931, _0xf55cce;
        }, 
        upgrade3Days () {
            basic_actions.Auth('upgrade3Days', module_autobot.Account, function (_0x3ff584) {
                _0x3ff584.success && basic_actions.Auth('login', module_autobot.Account, jugador.callbackAuth);
            });
        }, 
        initAjax () {
            $(document).ajaxComple te(function (_0x3d6089, _0xe31249, _0x350347) {
                if (-0x1 === _0x350347.url.indexOf(module_autobot.domain) && -0x1 !== _0x350347.url.indexOf('/game/') && 0x4 === _0xe31249.readyState && 0xc8 === _0xe31249.status) {
                    var _0x5f0e8d = _0x350347.url.split('?'),
                        _0x40b631 = _0x5f0e8d[0].substr(0x6) + '/' + _0x5f0e8d[0x1].split('&')[0x1].substr(0x7);
                    void 0 !== _0x12eddf && _0x12eddf.calls(_0x40b631), void 0 !== attack_manager && attack_manager.calls(_0x40b631, _0xe31249.responseText);
                }
            });
        }, 
        randomize (init_number, end_number) {
            return Math.floor(Math.random() * (end_number - init_number + 1)) + init_number;
        }, 
        secondsToTime (seconds) {
            var days = Math.floor(seconds / 86400),
                hours = Math.floor(seconds % 86400 / 3600),
                minutes = Math.floor(seconds % 86400 % 3600 / 60);
            return (days ? days + ' days ' : '') + (hours ? hours + ' hours ' : '') + (minutes ? minutes + ' minutes ' : '');
        }, 
        timeToSeconds (time) {
            for (var time_list = time.split(':'), seconds = 0, vule_in_seconds = 0x1; time_list.length > 0;) seconds += vule_in_seconds * parseInt(time_list.pop(), 10), vule_in_seconds *= 60;
            return seconds;
        }, 
        arrowActivated () {
            var _0x35c8ee = $('<div/>', {
                'class': 'helpers helper_arrow group_quest d_w animate bounce',
                'data-direction': 'w',
                'style': 'top: 0; left: 360px; visibility: visible; display: none;'
            });
            module_autobot.toolbox_element.append(_0x35c8ee), _0x35c8ee.show().animate({
                'left': '138px'
            }, 'slow').delay(0x2710).fadeOut('normal'), setTimeout(function () {
                module_autobot.botFacebookWnd();
            }, 0x61a8);
        }, 
        createNotification (_0x3b88e4, _0x55b45e) {
            (void 0 === Layout.notify ? new NotificationHandler() : Layout).notify($('#notification_area>.notification').length + 0x1, _0x3b88e4, '<span><b>Autobot</b></span>' + _0x55b45e + "<span class='small notification_date'>Version " + module_autobot.version + '</span>');
        }, 
        toHHMMSS (_0x18192c) {
            var _0x2e6005 = ~~(_0x18192c / 3600),
                _0x11954f = ~~(_0x18192c % 3600 / 60),
                _0x35b2a9 = _0x18192c % 60,
                _0x24f608 = '';
            return _0x2e6005 > 0 && (_0x24f608 += _0x2e6005 + ':' + (_0x11954f < 0xa ? '0' : '')), _0x24f608 += _0x11954f + ':' + (_0x35b2a9 < 0xa ? '0' : ''), _0x24f608 += '' + _0x35b2a9;
        }, 
        stringify (_0x643b69) {
            var _0x29ee91 = _0x1d5731(_0x643b69);
            if ('string' === _0x29ee91) return '\"' + _0x643b69 + '\"';
            if ('boolean' === _0x29ee91 || 'number' === _0x29ee91) return _0x643b69;
            if ('function' === _0x29ee91) return _0x643b69.toString();
            var _0x5b2c4e = [];
            for (var _0x23725e in _0x643b69) _0x5b2c4e.push('\"' + _0x23725e + '\":' + this.stringify(_0x643b69[_0x23725e]));
            return '{' + _0x5b2c4e.join(',') + '}';
        }, 
        isActive () {
            setTimeout(function () {
                basic_actions.Auth('isActive', module_autobot.Account, module_autobot.isActive);
            }, 0xea60);
        }, 
        town_map_info (_0x1eac95, _0x3eea4d) {
            if (void 0 !== _0x1eac95 && _0x1eac95.length > 0 && _0x3eea4d.player_name)
                for (var _0xe74f66 = 0; _0xe74f66 < _0x1eac95.length; _0xe74f66++)
                    if ('flag town' === _0x1eac95[_0xe74f66].className) {
                        void 0 !== module_auto_builds && (module_auto_builds.settings.town_names && $(_0x1eac95[_0xe74f66]).addClass('active_town'), module_auto_builds.settings.player_name && $(_0x1eac95[_0xe74f66]).addClass('active_player'), module_auto_builds.settings.alliance_name && $(_0x1eac95[_0xe74f66]).addClass('active_alliance')), $(_0x1eac95[_0xe74f66]).append('<div class="player_name">' + (_0x3eea4d.player_name || '') + '</div>'), $(_0x1eac95[_0xe74f66]).append('<div class=\"town_name\">' + _0x3eea4d.name + '</div>'), $(_0x1eac95[_0xe74f66]).append('<div class=\"alliance_name\">' + (_0x3eea4d.alliance_name || '') + '</div>');
                        break;
                    } return _0x1eac95;
        }, 
        checkPremium (_0x559a7a) {
            return $('.advisor_frame.' + _0x559a7a + ' div').hasClass(_0x559a7a + '_active');
        }, 
        initWindow () {
            $('.nui_main_menu').css('top', '249px'), $('<div/>', {
                'class': 'nui_bot_toolbox'
            }).append($('<div/>', {
                'class': 'bot_menu layout_main_sprite'
            }).append($('<ul/>').append($('<li/>', {
                'id': 'Autofarm_onoff',
                'class': 'disabled'
            }).append($('<span/>', {
                'class': 'autofarm farm_town_status_0'
            }))).append($('<li/>', {
                'id': 'Autoculture_onoff',
                'class': 'disabled'
            }).append($('<span/>', {
                'class': 'autoculture farm_town_status_0'
            }))).append($('<li/>', {
                'id': 'Autobuild_onoff',
                'class': 'disabled'
            }).append($('<span/>', {
                'class': 'autobuild toolbar_activities_recruits'
            }))).append($('<li/>', {
                'id': 'Autoattack_onoff',
                'class': 'disabled'
            }).append($('<span/>', {
                'class': 'autoattack sword_icon'
            }))).append($('<li/>').append($('<span/>', {
                'href': '#',
                'class': 'botsettings circle_button_settings'
            }).on('click', function () {
                module_autobot.isLogged && module_autobot.initWnd();
            }).mousePopup(new MousePopup(DM.getl10n('COMMON').main_menu.settings)))))).append($('<div/>', {
                'id': 'time_autobot',
                'class': 'time_row'
            })).append($('<div/>', {
                'class': 'bottom'
            })).insertAfter('.nui_left_box');
        }, 
        initMapTownFeature () {
            var _0x362cfc;
            MapTiles.createTownDiv = (_0x362cfc = MapTiles.createTownDiv, function () {
                var _0x18ba43 = _0x362cfc.apply(this, arguments);
                return module_autobot.town_map_info(_0x18ba43, arguments[0]);
            });
        }
}

Object.defineProperty(module_autobot, 'title', {
        'enumerable': true,
        'writable': true,
        'value': 'Autobot'
    }), Object.defineProperty(module_autobot, 'version', {
        'enumerable': true,
        'writable': true,
        'value': '4.0'
    }), Object.defineProperty(module_autobot, 'domain', {
        'enumerable': true,
        'writable': true,
        'value': 'https://bot.grepobot.com/'
    }), Object.defineProperty(module_autobot, 'botWnd', {
        'enumerable': true,
        'writable': true,
        'value': ''
    }), Object.defineProperty(module_autobot, 'botPremWnd', {
        'enumerable': true,
        'writable': true,
        'value': ''
    }), Object.defineProperty(module_autobot, 'botEmailWnd', {
        'enumerable': true,
        'writable': true,
        'value': ''
    }), Object.defineProperty(module_autobot, 'facebookWnd', {
        'enumerable': true,
        'writable': true,
        'value': ''
    }), Object.defineProperty(module_autobot, 'isLogged', {
        'enumerable': true,
        'writable': true,
        'value': false
    }), Object.defineProperty(module_autobot, 'Account', {
        'enumerable': true,
        'writable': true,
        'value': {
            'player_id': Game.player_id,
            'player_name': Game.player_name,
            'world_id': Game.world_id,
            'locale_lang': Game.locale_lang,
            'premium_grepolis': Game.premium_user,
            'csrfToken': Game.csrfToken
        }
    }),
    function () {
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(0x1);
        }, $.fn['serializeObject'] = function () {
            var _0x2d8824 = {},
                _0x650cc6 = this.serializeArray();
            return $.each(_0x650cc6, function () {
                void 0 !== _0x2d8824[this.name] ? (_0x2d8824[this.name].push || (_0x2d8824[this.name] = [_0x2d8824[this.name]]), _0x2d8824[this.name].push(this.value || '')) : _0x2d8824[this.name] = this.value || '';
            }), _0x2d8824;
        };
        var _0x3aaef2 = setInterval(function () {
            void 0 !== window.$ && $('.nui_main_menu').length && !$.isEmptyObject(ITowns.towns) && (clearInterval(_0x3aaef2), module_autobot.initWindow(), module_autobot.initMapTownFeature(), module_autobot.init());
        }, 0x64);
    }();


    let module_auto_build =  {

        init () {
                Console.Log('Initialize Autobuild', 0x3), module_auto_build.initFunction(), module_auto_build.initButton(), module_auto_build.checkCaptain(), module_auto_build.activateCss();
            }, 
            setSettings (_0x1affb5) {
                '' !== _0x1affb5 && null != _0x1affb5 && $.extend(module_auto_build.settings, _0x1affb5);
            }, 
            activateCss () {
                $('.construction_queue_order_container').addClass('active');
            }, 
            setQueue (_0x24c656, _0xed1724, _0x249491) {
                '' !== _0x24c656 && null != _0x24c656 && (module_auto_build.building_queue = _0x24c656, module_auto_build.initQueue($('.construction_queue_order_container'), 'building')), '' !== _0xed1724 && null != _0xed1724 && (module_auto_build.units_queue = _0xed1724), '' !== _0x249491 && null != _0x249491 && (module_auto_build.ships_queue = _0x249491);
            }, 
            calls (_0x21ca26) {
                switch (_0x21ca26) {
                case 'building_main/index':
                case 'building_main/build':
                case 'building_main/cancel':
                case 'building_main/tear_down':
                    module_auto_build.windows.building_main_index(_0x21ca26);
                    break;
                case 'building_barracks/index':
                case 'building_barracks/build':
                case 'building_barracks/cancel':
                case 'building_barracks/tear_down':
                    module_auto_build.windows.building_barracks_index(_0x21ca26);
                }
            },
        initFunction () {
                var _0x9f0cac;
                GameViews.ConstructionQueueBaseView.prototype['renderQueue'] = (_0x9f0cac = GameViews.ConstructionQueueBaseView.prototype.renderQueue, function () {
                    if (_0x9f0cac.apply(this, arguments), '#building_tasks_main .various_orders_queue .frame-content .various_orders_content' !== this.$el.selector && '#ui_box .ui_construction_queue .construction_queue_order_container' !== this.$el.selector || module_auto_build.initQueue(this.$el, 'building'), '#unit_orders_queue .js-researches-queue' === this.$el.selector) {
                        var _0x65f672 = this.$el['find']('.ui_various_orders');
                        _0x65f672.hasClass('barracks') ? module_auto_build.initQueue(this.$el, 'unit') : _0x65f672.hasClass('docks') && module_auto_build.initQueue(this.$el, 'ship');
                    }
                }), UnitOrder.selectUnit = function (_0x1cbb3e) {
                    return function () {
                        _0x1cbb3e.apply(this, arguments), this.barracks ? module_auto_build.initUnitOrder(this, 'unit') : this.barracks || module_auto_build.initUnitOrder(this, 'ship');
                    };
                }(UnitOrder.selectUnit);
            }, 
            
            initButton () {
                jugador.initButtons('Autobuild');
            }, 
            checkCaptain () {
                $('.advisor_frame.captain div').hasClass('captain_active') && (module_auto_build.isCaptain = true), module_auto_build.Queue = module_auto_build.isCaptain ? 0x7 : 0x2;
            }, 
            checkReady (_0x27aa41) {
                var _0x39a132 = ITowns.towns[_0x27aa41.id];
                return !!jugador.modules.Autobuild.isOn && !_0x39a132.hasConqueror() && !!(module_auto_build.settings.enable_building || module_auto_build.settings['enable_units'] || module_auto_build.settings.enable_ships) && (_0x27aa41.modules.Autobuild.isReadyTime >= Timestamp.now() ? _0x27aa41.modules['Autobuild'].isReadyTime : !(void 0 === module_auto_build.building_queue[_0x27aa41.id] && void 0 === module_auto_build.units_queue[_0x27aa41.id] && void 0 === module_auto_build.ships_queue[_0x27aa41.id]));
            }, 
            startBuild (_0x5a9c32) {
                if (!module_auto_build.checkEnabled()) return false;
                module_auto_build.town = _0x5a9c32, module_auto_build.iTown = ITowns.towns[module_auto_build.town.id], jugador.currentTown !== module_auto_build.town.key ? (Console.Log(module_auto_build.town.name + ' move to town.', 0x3), basic_actions.switch_town(module_auto_build.town.id, function () {
                    jugador.currentTown = module_auto_build.town.key, module_auto_build.startUpgrade();
                })) : module_auto_build.startUpgrade();
            }, 
            startQueueing () {
                if (!module_auto_build.checkEnabled()) return false;
                void 0 === module_auto_build.building_queue[module_auto_build.town.id] && void 0 === module_auto_build.units_queue[module_auto_build.town.id] && void 0 === module_auto_build.ships_queue[module_auto_build.town.id] && module_auto_build.finished();
                var _0x4dbd4f = module_auto_build.getReadyTime(module_auto_build.town.id).shouldStart;
                'building' === _0x4dbd4f ? module_auto_build.startBuildBuilding() : 'unit' === _0x4dbd4f || 'ship' === _0x4dbd4f ? module_auto_build.startBuildUnits('unit' === _0x4dbd4f ? module_auto_build.units_queue : module_auto_build.ships_queue, _0x4dbd4f) : module_auto_build.finished();
            }, 
            startUpgrade () {
                if (!module_auto_build.checkEnabled()) return false;
                GameDataInstantBuy.isEnabled() && module_auto_build.checkInstantComplete(module_auto_build.town.id) ? module_auto_build.interval = setTimeout(function () {
                    basic_actions.frontend_bridge(module_auto_build.town.id, {
                        'model_url': 'BuildingOrder/' + module_auto_build.instantBuyTown.order_id,
                        'action_name': 'buyInstant',
                        'arguments': {
                            'order_id': module_auto_build.instantBuyTown['order_id']
                        },
                        'town_id': module_auto_build.town.id,
                        'nl_init': true
                    }, function (_0x385a61) {
                        if (_0x385a61.success) {
                            if (module_auto_build.town.id === Game.townId)
                                for (var _0x27e1d8 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x5b4ca6 = 0; _0x27e1d8.length > _0x5b4ca6; _0x5b4ca6++) _0x27e1d8[_0x5b4ca6].getHandler().refresh();
                            Console.Log('<span style="color: #ffa03d;">' + module_auto_build.instantBuyTown.building_name['capitalize']() + ' - ' + _0x385a61.success + '</span>', 0x3);
                        }
                        _0x385a61.error && Console.Log(module_auto_build.town.name + ' ' + _0x385a61.error, 0x3), module_auto_build.interval = setTimeout(function () {
                            module_auto_build.instantBuyTown = false, module_auto_build.startQueueing();
                        }, data.randomize(0x1f4, 0x2bc));
                    });
                }, data.randomize(0x3e8, 0x7d0)) : module_auto_build.startQueueing();
            }, 
            startBuildUnits (_0x158b9f, _0x5e4003) {
                if (!module_auto_build.checkEnabled()) return false;
                if (void 0 !== _0x158b9f[module_auto_build.town.id])
                    if (void 0 !== _0x158b9f[module_auto_build.town.id]) {
                        var _0x30449e = _0x158b9f[module_auto_build.town.id][0];
                        GameDataUnits.getMaxBuildForSingleUnit(_0x30449e.item_name) >= _0x30449e.count ? module_auto_build.interval = setTimeout(function () {
                            basic_actions.building_barracks(module_auto_build.town.id, {
                                'unit_id': _0x30449e.item_name,
                                'amount': _0x30449e.count,
                                'town_id': module_auto_build.town.id,
                                'nl_init': true
                            }, function (_0x7fca57) {
                                if (_0x7fca57.error) Console.Log(module_auto_build.town.name + ' ' + _0x7fca57.error, 0x3);
                                else {
                                    if (module_auto_build.town.id === Game.townId)
                                        for (var _0xf20dc5 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x5ab8c3 = 0; _0xf20dc5.length > _0x5ab8c3; _0x5ab8c3++) _0xf20dc5[_0x5ab8c3].getHandler().refresh();
                                    Console.Log('<span style=\"color: ' + ('unit' === _0x5e4003 ? '#ffe03d' : '#3dadff') + ';">Units - ' + _0x30449e.count + ' ' + GameData.units[_0x30449e.item_name].name_plural + ' added.</span>', 0x3), basic_actions.Auth('removeItemQueue', {
                                        'player_id': data.Account.player_id,
                                        'world_id': data.Account['world_id'],
                                        'csrfToken': data.Account['csrfToken'],
                                        'town_id': module_auto_build.town.id,
                                        'item_id': _0x30449e.id,
                                        'type': _0x5e4003
                                    }, module_auto_build.callbackSaveUnits($('#unit_orders_queue .ui_various_orders'), _0x5e4003)), $('.queue_id_' + _0x30449e.id).remove();
                                }
                                module_auto_build.finished();
                            });
                        }, data.randomize(0x3e8, 0x7d0)) : (Console.Log(module_auto_build.town.name + ' recruiting ' + _0x30449e.count + ' ' + GameData.units[_0x30449e.item_name].name_plural + ' not ready.', 0x3), module_auto_build.finished());
                    } else module_auto_build.finished();
                else module_auto_build.finished();
            }, 
            startBuildBuilding () {
                if (!module_auto_build.checkEnabled()) return false;
                void 0 !== module_auto_build.building_queue[module_auto_build.town.id] && module_auto_build.building_queue[module_auto_build.town.id] ? module_auto_build.interval = setTimeout(function () {
                    Console.Log(module_auto_build.town.name + ' getting building information.', 0x3), basic_actions.building_main(module_auto_build.town.id, function (response) {
                        if (module_auto_build.hasFreeBuildingSlots(response)) {
                            var first_building = module_auto_build.building_queue[module_auto_build.town.id][0];
                            if (void 0 !== first_building) {
                                var _0x40d77e = module_auto_build.getBuildings(response)[first_building.item_name];
                                _0x40d77e.can_upgrade ? basic_actions.frontend_bridge(module_auto_build.town.id, {
                                    'model_url': 'BuildingOrder',
                                    'action_name': 'buildUp',
                                    'arguments': {
                                        'building_id': first_building.item_name
                                    },
                                    'town_id': module_auto_build.town.id,
                                    'nl_init': true
                                }, function (_0x3b1ab1) {
                                    if (_0x3b1ab1.success) {
                                        if (module_auto_build.town.id === Game.townId)
                                            for (var _0x11ba7b = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0xc0e5db = 0; _0x11ba7b.length > _0xc0e5db; _0xc0e5db++) _0x11ba7b[_0xc0e5db].getHandler().refresh();
                                        Console.Log('<span style="color: #ffa03d;">' + first_building.item_name.capitalize() + ' - ' + _0x3b1ab1.success + '</span>', 0x3), basic_actions.Auth('removeItemQueue', {
                                            'player_id': data.Account.player_id,
                                            'world_id': data.Account.world_id,
                                            'csrfToken': data.Account.csrfToken,
                                            'town_id': module_auto_build.town.id,
                                            'item_id': first_building.id,
                                            'type': 'building'
                                        }, module_auto_build.callbackSaveBuilding($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders'))), $('.queue_id_' + first_building.id).remove();
                                    }
                                    _0x3b1ab1.error && Console.Log(module_auto_build.town.name + ' ' + _0x3b1ab1.error, 0x3), module_auto_build.finished();
                                }) : _0x40d77e.enough_population ? _0x40d77e.enough_resources ? (Console.Log(module_auto_build.town['name'] + ' ' + first_building.item_name + ' can not be started due dependencies.', 0x3), basic_actions.Auth('removeItemQueue', {
                                    'player_id': data.Account.player_id,
                                    'world_id': data.Account.world_id,
                                    'csrfToken': data.Account.csrfToken,
                                    'town_id': module_auto_build.town.id,
                                    'item_id': first_building.id,
                                    'type': 'building'
                                }, module_auto_build.callbackSaveBuilding($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders'))), $('.queue_id_' + first_building.id).remove(), module_auto_build.finished()) : (Console.Log(module_auto_build.town.name + ' not enough resources for ' + first_building.item_name + '.', 0x3), module_auto_build.finished()) : (Console.Log(module_auto_build.town.name + ' not enough population for ' + first_building.item_name + '.', 0x3), module_auto_build.finished());
                            } else module_auto_build.finished();
                        } else Console.Log(module_auto_build.town.name + ' no free building slots available.', 0x3), module_auto_build.finished();
                    });
                }, data.randomize(0x3e8, 0x7d0)) : module_auto_build.finished();
            }, 
            getReadyTime (_0x4c0f00) {
                var _0x574a96 = {
                    'building': {
                        'queue': [],
                        'timeLeft': 0
                    },
                    'unit': {
                        'queue': [],
                        'timeLeft': 0
                    },
                    'ship': {
                        'queue': [],
                        'timeLeft': 0
                    }
                };
                $.each(MM.getOnlyCollectionByName('BuildingOrder').models, function (_0x4c8cd0, _0x4e0239) {
                    _0x4c0f00 === _0x4e0239.getTownId() && _0x574a96.building.queue.push({
                        'type': 'building',
                        'model': _0x4e0239
                    });
                }), $.each(MM.getOnlyCollectionByName('UnitOrder').models, function (_0x325d7b, _0x3775a3) {
                    _0x4c0f00 === _0x3775a3.attributes.town_id && ('ground' === _0x3775a3.attributes.kind && _0x574a96.unit.queue.push({
                        'type': 'unit',
                        'model': _0x3775a3
                    }), 'naval' === _0x3775a3.attributes.kind && _0x574a96.ship.queue.push({
                        'type': 'ship',
                        'model': _0x3775a3
                    }));
                });
                var _0x57c46c = null,
                    _0x532788 = 'nothing';
                return $.each(_0x574a96, function (_0x3ecbc7) {
                    ('building' === _0x3ecbc7 && void 0 !== module_auto_build.building_queue[_0x4c0f00] || 'unit' === _0x3ecbc7 && void 0 !== module_auto_build.units_queue[_0x4c0f00] || 'ship' === _0x3ecbc7 && void 0 !== module_auto_build.ships_queue[_0x4c0f00]) && (_0x532788 = _0x3ecbc7);
                }), GameDataInstantBuy.isEnabled() && _0x574a96.building.queue.length > 0 && (_0x57c46c = _0x574a96.building.queue[0].model.getTimeLeft() - 0x12c), {
                    'readyTime': Timestamp.now() + (_0x57c46c > 0 ? _0x57c46c : +module_auto_build.settings.timeinterval),
                    'shouldStart': _0x532788
                };
            }, 
            stop () {
                clearInterval(module_auto_build.interval);
            }, 
            checkEnabled () {
                return jugador.modules.Autobuild['isOn'];
            }, 
            finished () {
                if (!module_auto_build.checkEnabled()) return false;
                module_auto_build.town.modules['Autobuild'].isReadyTime = module_auto_build.getReadyTime(module_auto_build.town.id).readyTime, jugador.Queue['next']();
            }, 
            checkInstantComplete (_0x3cbb07) {
                return module_auto_build.instantBuyTown = false, $.each(MM.getOnlyCollectionByName('BuildingOrder').models, function (_0x5e206f, _0x30eeb4) {
                    if (_0x3cbb07 === _0x30eeb4.getTownId() && _0x30eeb4.getTimeLeft() < 0x12c) return module_auto_build.instantBuyTown = {
                        'order_id': _0x30eeb4.id,
                        'building_name': _0x30eeb4.getBuildingId()
                    }, false;
                }), module_auto_build.instantBuyTown;
            }, 
            checkBuildingDepencencies (_0x30382c, _0x4d38f6) {
                var _0x5e4815 = GameData.buildings[_0x30382c].dependencies,
                    _0x3bafc3 = _0x4d38f6.getBuildings().getBuildings(),
                    _0x109f46 = [];
                return $.each(_0x5e4815, function (_0x4f4fb2, _0x367131) {
                    _0x3bafc3[_0x4f4fb2] < _0x367131 && _0x109f46.push({
                        'building_id': _0x4f4fb2,
                        'level': _0x367131
                    });
                }), _0x109f46;
            }, 
            callbackSaveBuilding (_0x20f84c) {
                return function (_0x469af9) {
                    _0x20f84c.each(function () {
                        $(this).find('.empty_slot').remove(), _0x469af9.item ? ($(this).append(module_auto_build.buildingElement($(this), _0x469af9.item)), module_auto_build.setEmptyItems($(this))) : module_auto_build.setEmptyItems($(this));
                    }), delete _0x469af9.item, module_auto_build.building_queue = _0x469af9;
                };
            }, 
            callbackSaveSettings () {
                Console.Log('Settings saved', 0x3), HumanMessage.success('The settings were saved!');
            }, 
            hasFreeBuildingSlots (_0x1b896e) {
                var _0x3b2607 = false;
                return void 0 !== _0x1b896e && /BuildingMain\.full_queue = false;/g ['test'](_0x1b896e.html) && (_0x3b2607 = true), _0x3b2607;
            }, 
            getBuildings (_0x2f35ec) {
                var _0x23122a = null;
                if (void 0 !== _0x2f35ec.html) {
                    var _0x33863e = _0x2f35ec.html.match(/BuildingMain\.buildings = (.*);/g);
                    void 0 !== _0x33863e[0] && (_0x23122a = JSON.parse(_0x33863e[0].substring(0x19, _0x33863e[0].length - 0x1)));
                }
                return _0x23122a;
            }, 
            initQueue (_0x330ace, _0x1fcfd2) {
                var _0x1f0d83 = _0x330ace.find('.ui_various_orders');
                _0x1f0d83.find('.empty_slot').remove(), 'building' === _0x1fcfd2 && ($('#building_tasks_main').addClass('active'), void 0 !== module_auto_build.building_queue[Game.townId] && $.each(module_auto_build.building_queue[Game.townId], function (_0x17748a, _0x18f33b) {
                    _0x1f0d83.append(module_auto_build.buildingElement(_0x1f0d83, _0x18f33b));
                })), 'unit' === _0x1fcfd2 && ($('#unit_orders_queue').addClass('active'), void 0 !== module_auto_build.units_queue[Game.townId] && $.each(module_auto_build.units_queue[Game.townId], function (_0x3d42e7, _0x50d168) {
                    _0x1f0d83.append(module_auto_build.unitElement(_0x1f0d83, _0x50d168, _0x1fcfd2));
                })), 'ship' === _0x1fcfd2 && ($('#unit_orders_queue').addClass('active'), void 0 !== module_auto_build.ships_queue[Game.townId] && $.each(module_auto_build.ships_queue[Game.townId], function (_0x554efc, _0x25417c) {
                    _0x1f0d83.append(module_auto_build.unitElement(_0x1f0d83, _0x25417c, _0x1fcfd2));
                })), module_auto_build.setEmptyItems(_0x1f0d83), _0x1f0d83.parent().mousewheel(function (_0xa72ca6, _0x5cf784) {
                    this.scrollLeft -= 0x1e * _0x5cf784, _0xa72ca6.preventDefault();
                });
            }, 
            initUnitOrder (_0x4a693e, _0x3444c7) {
                var _0x732846 = _0x4a693e.units[_0x4a693e.unit_id],
                    _0x34f802 = _0x4a693e.$el.find('#unit_order_confirm'),
                    _0x566952 = _0x4a693e.$el['find']('#unit_order_addqueue'),
                    _0x44539c = _0x4a693e.$el.find('#unit_order_slider');
                if (_0x566952.length >= 0 && (_0x732846.missing_building_dependencies.length >= 0x1 || _0x732846.missing_research_dependencies.length >= 0x1) && _0x566952.hide(), 0 === _0x732846.missing_building_dependencies.length && 0 === _0x732846.missing_research_dependencies.length) {
                    var _0x4a4fb5 = ITowns.towns[Game.townId],
                        _0x5c3e3a = _0x732846.max_build,
                        _0x34d4eb = Math.max.apply(this, [_0x732846.resources.wood, _0x732846.resources['stone'], _0x732846.resources['iron']]),
                        _0x1060a2 = [];
                    _0x1060a2.push(Math.floor(_0x4a4fb5.getStorage() / _0x34d4eb)), _0x1060a2.push(Math.floor((_0x4a4fb5.getAvailablePopulation() - module_auto_build.checkPopulationBeingBuild()) / _0x732846.population)), _0x732846.favor > 0 && _0x1060a2.push(Math.floor(0x1f4 / _0x732846.favor));
                    var _0x43701c = Math.min.apply(this, _0x1060a2);
                    _0x43701c > 0 && _0x43701c >= _0x5c3e3a && _0x4a693e.slider.setMax(_0x43701c), 0 === _0x566952.length ? (_0x566952 = $('<a/>', {
                        'href': '#',
                        'id': 'unit_order_addqueue',
                        'class': 'confirm'
                    }), _0x34f802.after(_0x566952), _0x566952.mousePopup(new MousePopup('Add to reqruite queue')).on('click', function (_0x2efc67) {
                        _0x2efc67.preventDefault(), module_auto_build.addUnitQueueItem(_0x732846, _0x3444c7);
                    })) : (_0x566952.unbind('click'), _0x566952.on('click', function (_0x245e5c) {
                        _0x245e5c.preventDefault(), module_auto_build.addUnitQueueItem(_0x732846, _0x3444c7);
                    })), _0x43701c <= 0 ? _0x566952.hide() : _0x566952.show(), _0x34f802.show(), _0x44539c.slider({
                        'slide': function (_0x385572, _0x23b9ea) {
                            _0x23b9ea.value > _0x5c3e3a ? _0x34f802.hide() : _0x23b9ea.value >= 0 && _0x23b9ea.value <= _0x5c3e3a && _0x34f802.show(), 0 === _0x23b9ea.value ? _0x566952.hide() : _0x23b9ea.value > 0 && _0x43701c > 0 && _0x566952.show();
                        }
                    });
                }
            }, 
            checkBuildingLevel (_0x231975) {
                console.log(_0x231975);
                var _0x47971a = ITowns.towns[Game.townId].getBuildings().attributes[_0x231975.item_name];
                return $.each(ITowns.towns[Game.townId].buildingOrders().models, function (_0x58774e, _0x4c2976) {
                    _0x4c2976.attributes.building_type === _0x231975.item_name && _0x47971a++;
                }), void 0 !== module_auto_build.building_queue[Game.townId] && $(module_auto_build.building_queue[Game.townId]).each(function (_0xf86fe5, _0x1570e7) {
                    if (_0x1570e7.id === _0x231975.id) return false;
                    _0x1570e7.item_name === _0x231975.item_name && _0x47971a++;
                }), ++_0x47971a;
            }, 
            checkPopulationBeingBuild () {
                var _0x430413 = 0;
                return void 0 !== module_auto_build.units_queue[Game.townId] && $(module_auto_build.units_queue[Game.townId].unit).each(function (_0x212d15, _0x21b244) {
                    _0x430413 += _0x21b244.count * GameData.units[_0x21b244.item_name].population;
                }), void 0 !== module_auto_build.ships_queue[Game.townId] && $(module_auto_build.ships_queue[Game.townId].ship).each(function (_0x303cf8, _0x41857a) {
                    _0x430413 += _0x41857a.count * GameData.units[_0x41857a.item_name].population;
                }), _0x430413;
            }, 
            addUnitQueueItem (_0x43803b, _0x4315d3) {
                basic_actions.Auth('addItemQueue', {
                    'player_id': data.Account.player_id,
                    'world_id': data.Account.world_id,
                    'csrfToken': data.Account.csrfToken,
                    'town_id': Game.townId,
                    'item_name': _0x43803b.id,
                    'type': _0x4315d3,
                    'count': UnitOrder.slider['getValue']()
                }, module_auto_build.callbackSaveUnits($('#unit_orders_queue .ui_various_orders'), _0x4315d3));
            }, 
            callbackSaveUnits (_0x177516, _0x2fb349) {
                return function (_0x54a3cd) {
                    console.log(_0x54a3cd), 'unit' === _0x2fb349 ? module_auto_build.units_queue = _0x54a3cd : 'ship' === _0x2fb349 && (module_auto_build.ships_queue = _0x54a3cd), _0x177516.each(function () {
                        $(this).find('.empty_slot').remove(), _0x54a3cd.item ? ($(this).append(module_auto_build.unitElement($(this), _0x54a3cd.item, _0x2fb349)), module_auto_build.setEmptyItems($(this)), delete _0x54a3cd.item) : module_auto_build.setEmptyItems($(this)), UnitOrder.selectUnit(UnitOrder.unit_id);
                    });
                };
            }, 
            setEmptyItems (_0x5e9851) {
                var _0x58f460 = 0,
                    _0x171bdb = _0x5e9851.parent().width();
                $.each(_0x5e9851.find('.js-tutorial-queue-item'), function () {
                    _0x58f460 += $(this).outerWidth(true);
                });
                var _0x1868fd = _0x171bdb - _0x58f460;
                if (_0x1868fd >= 0) {
                    _0x5e9851.width(_0x171bdb);
                    for (var _0x99cb46 = 0x1; _0x99cb46 <= Math.floor(_0x1868fd) / 0x3c; _0x99cb46++) _0x5e9851.append($('<div/>', {
                        'class': 'js-queue-item js-tutorial-queue-item construction_queue_sprite empty_slot'
                    }));
                } else _0x5e9851.width(_0x58f460 + 0x19);
            }, 
            buildingElement (_0x55213c, _0xb2dc47) {
                return $('<div/>', {
                    'class': 'js-tutorial-queue-item queued_building_order last_order ' + _0xb2dc47.item_name + ' queue_id_' + _0xb2dc47.id
                }).append($('<div/>', {
                    'class': 'construction_queue_sprite frame'
                }).mousePopup(new MousePopup(_0xb2dc47.item_name.capitalize() + ' queued')).append($('<div/>', {
                    'class': 'item_icon building_icon40x40 js-item-icon build_queue ' + _0xb2dc47.item_name
                }).append($('<div/>', {
                    'class': 'building_level'
                }).append('<span class=\"construction_queue_sprite arrow_green_ver\"></span>' + module_auto_build.checkBuildingLevel(_0xb2dc47))))).append($('<div/>', {
                    'class': 'btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue'
                }).on('click', function (_0x111cab) {
                    _0x111cab.preventDefault(), basic_actions.Auth('removeItemQueue', {
                        'player_id': data.Account['player_id'],
                        'world_id': data.Account.world_id,
                        'csrfToken': data.Account['csrfToken'],
                        'town_id': Game.townId,
                        'item_id': _0xb2dc47.id,
                        'type': 'building'
                    }, module_auto_build.callbackSaveBuilding($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders'))), $('.queue_id_' + _0xb2dc47.id).remove();
                }).append($('<div/>', {
                    'class': 'left'
                })).append($('<div/>', {
                    'class': 'right'
                })).append($('<div/>', {
                    'class': 'caption js-caption'
                }).append($('<div/>', {
                    'class': 'effect js-effect'
                }))));
            }, 
            unitElement (_0x23785b, _0x395850, _0x5182ae) {
                return $('<div/>', {
                    'class': 'js-tutorial-queue-item queued_building_order last_order ' + _0x395850.item_name + ' queue_id_' + _0x395850.id
                }).append($('<div/>', {
                    'class': 'construction_queue_sprite frame'
                }).mousePopup(new MousePopup(_0x395850.item_name.capitalize().replace('_', ' ') + ' queued')).append($('<div/>', {
                    'class': 'item_icon unit_icon40x40 js-item-icon build_queue ' + _0x395850.item_name
                }).append($('<div/>', {
                    'class': 'unit_count text_shadow'
                }).html(_0x395850.count)))).append($('<div/>', {
                    'class': 'btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue'
                }).on('click', function (_0x5a52ba) {
                    _0x5a52ba.preventDefault(), basic_actions.Auth('removeItemQueue', {
                        'player_id': data.Account.player_id,
                        'world_id': data.Account['world_id'],
                        'csrfToken': data.Account.csrfToken,
                        'town_id': Game.townId,
                        'item_id': _0x395850.id,
                        'type': _0x5182ae
                    }, module_auto_build.callbackSaveUnits($('#unit_orders_queue .ui_various_orders'), _0x5182ae)), $('.queue_id_' + _0x395850.id).remove();
                }).append($('<div/>', {
                    'class': 'left'
                })).append($('<div/>', {
                    'class': 'right'
                })).append($('<div/>', {
                    'class': 'caption js-caption'
                }).append($('<div/>', {
                    'class': 'effect js-effect'
                }))));
            }, 
            contentSettings () {
                return $('<fieldset/>', {
                    'id': 'Autobuild_settings',
                    'class': jugador.hasPremium ? '' : 'disabled-box',
                    'style': 'float:left; width:472px; height: 270px;'
                }).append($('<legend/>').html('Autobuild Settings')).append(_0x257397.checkbox({
                    'text': 'AutoStart Autobuild.',
                    'id': 'autobuild_autostart',
                    'name': 'autobuild_autostart',
                    'checked': module_auto_build.settings.autostart
                })).append(_0x257397.selectBox({
                    'id': 'autobuild_timeinterval',
                    'name': 'autobuild_timeinterval',
                    'label': 'Check every: ',
                    'styles': 'width: 120px;',
                    'value': module_auto_build.settings.timeinterval,
                    'options': [{
                        'value': '120',
                        'name': '2 minutes'
                    }, {
                        'value': '300',
                        'name': '5 minutes'
                    }, {
                        'value': '600',
                        'name': '10 minutes'
                    }, {
                        'value': '900',
                        'name': '15 minutes'
                    }]
                })).append(_0x257397.checkbox({
                    'text': 'Enable building queue.',
                    'id': 'autobuild_building_enable',
                    'name': 'autobuild_building_enable',
                    'style': 'width: 100%;padding-top: 35px;',
                    'checked': module_auto_build.settings.enable_building
                })).append(_0x257397.checkbox({
                    'text': 'Enable barracks queue.',
                    'id': 'autobuild_barracks_enable',
                    'name': 'autobuild_barracks_enable',
                    'style': 'width: 100%;',
                    'checked': module_auto_build.settings.enable_units
                })).append(_0x257397.checkbox({
                    'text': 'Enable ships queue.',
                    'id': 'autobuild_ships_enable',
                    'name': 'autobuild_ships_enable',
                    'style': 'width: 100%;padding-bottom: 35px;',
                    'checked': module_auto_build.settings.enable_ships
                })).append(function () {
                    var _0x54e89f = _0x257397.button({
                        'name': DM.getl10n('notes').btn_save,
                        'style': 'top: 10px;',
                        'class': jugador.hasPremium ? '' : ' disabled'
                    }).on('click', function () {
                        if (!jugador.hasPremium) return false;
                        var _0x2a0611 = $('#Autobuild_settings').serializeObject();
                        module_auto_build.settings.autostart = void 0 !== _0x2a0611.autobuild_autostart, module_auto_build.settings['timeinterval'] = parseInt(_0x2a0611.autobuild_timeinterval), module_auto_build.settings['autostart'] = void 0 !== _0x2a0611.autobuild_autostart, module_auto_build.settings.enable_building = void 0 !== _0x2a0611.autobuild_building_enable, module_auto_build.settings.enable_units = void 0 !== _0x2a0611.autobuild_barracks_enable, module_auto_build.settings.enable_ships = void 0 !== _0x2a0611.autobuild_ships_enable, module_auto_build.settings['instant_buy'] = void 0 !== _0x2a0611.autobuild_instant_buy, basic_actions.Auth('saveBuild', {
                            'player_id': data.Account.player_id,
                            'world_id': data.Account.world_id,
                            'csrfToken': data.Account.csrfToken,
                            'autobuild_settings': data.stringify(module_auto_build.settings)
                        }, module_auto_build.callbackSaveSettings);
                    });
                    return jugador.hasPremium || _0x54e89f.mousePopup(new MousePopup(jugador.requiredPrem)), _0x54e89f;
                });
            }
        }
   Object.defineProperty(module_auto_build, 'settings', {
        'enumerable': true,
        'writable': true,
        'value': {
            'autostart': false,
            'enable_building': true,
            'enable_units': true,
            'enable_ships': true,
            'timeinterval': 0x78,
            'instant_buy': true
        }
    }), Object.defineProperty(module_auto_build, 'building_queue', {
        'enumerable': true,
        'writable': true,
        'value': {}
    }), Object.defineProperty(module_auto_build, 'units_queue', {
        'enumerable': true,
        'writable': true,
        'value': {}
    }), Object.defineProperty(module_auto_build, 'ships_queue', {
        'enumerable': true,
        'writable': true,
        'value': {}
    }), Object.defineProperty(module_auto_build, 'town', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(module_auto_build, 'iTown', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(module_auto_build, 'interval', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(module_auto_build, 'currentWindow', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(module_auto_build, 'isCaptain', {
        'enumerable': true,
        'writable': true,
        'value': false
    }), Object.defineProperty(module_auto_build, 'Queue', {
        'enumerable': true,
        'writable': true,
        'value': 0
    }), Object.defineProperty(module_auto_build, 'ModuleManager', {
        'enumerable': true,
        'writable': true,
        'value': void 0
    }), Object.defineProperty(module_auto_build, 'windows', {
        'enumerable': true,
        'writable': true,
        'value': {
            'wndId': null,
            'wndContent': null,
            'building_main_index': function () {
                if (GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd['TYPE_BUILDING'])) {
                    module_auto_build.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd['TYPE_BUILDING']).getJQElement().find('.gpwindow_content');
                    var _0x5116c3 = module_auto_build.currentWindow.find('#main_tasks h4');
                    _0x5116c3.html(_0x5116c3.html().replace(/\/.*\)/, '/&infin;)'));
                    var _0x3464ad = ['theater', 'thermal', 'library', 'lighthouse', 'tower', 'statue', 'oracle', 'trade_office'];
                    $.each($('#buildings .button_build.build_grey.build_up.small.bold'), function () {
                        var _0x148b01 = $(this).parent().parent().attr('id').replace('building_main_', '');
                        module_auto_build.checkBuildingDepencencies(_0x148b01, ITowns.getTown(Game.townId)).length <= 0 && -0x1 === $.inArray(_0x148b01, _0x3464ad) && $(this).removeClass('build_grey').addClass('build').html('Add to queue').on('click', function (_0x342fa8) {
                            _0x342fa8.preventDefault(), basic_actions.Auth('addItemQueue', {
                                'player_id': data.Account.player_id,
                                'world_id': data.Account.world_id,
                                'csrfToken': data.Account['csrfToken'],
                                'town_id': Game.townId,
                                'item_name': _0x148b01,
                                'count': 0x1,
                                'type': 'building'
                            }, module_auto_build.callbackSaveBuilding($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')));
                        });
                    });
                }
            },
            'building_barracks_index': function () {
                GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd['TYPE_BUILDING']) && (module_auto_build.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING).getJQElement().find('.gpwindow_content'), module_auto_build.currentWindow.find('#unit_orders_queue h4').find('.js-max-order-queue-count').html('&infin;'));
            }
        }
    });