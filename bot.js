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
    ffarms_manager() {
        ! function(farms_manager, farms_manager) {
            if (!(farms_manager instanceof farms_manager)) throw new TypeError('Cannot call a class as a function');
        }(this, farms_manager);
    },

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
        game.farm_town_overviews(farms_manager.town.id, function(_0x46bbcb) {
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
                farms_manager.settings.autostart = void 0 !== _0x56067b.autofarm_autostart, farms_manager.settings.method = parseInt(_0x56067b.autofarm_method), farms_manager.settings.timebetween = parseInt(_0x56067b.autofarm_bewteen), farms_manager.settings.skipwhenfull = void 0 !== _0x56067b.autofarm_warehousefull, farms_manager.settings.lowresfirst = void 0 !== _0x56067b.autofarm_lowresfirst, farms_manager.settings.stoplootbelow = void 0 !== _0x56067b.autofarm_loot, game.Auth('saveAutofarm', {
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


let main_module = {

    init() {
        Console.Log('Initialize Autoculture', 0x2), main_module.initButton();
    },
    initButton() {
        jugador.initButtons('Autoculture');
    },
    setSettings(new_settings) {
        '' !== new_settings && null != new_settings && $.extend(main_module.settings, new_settings);
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
        return !ITowns.towns[town.id].hasConqueror() && !!jugador.modules.Autoculture.isOn && (town.modules.Autoculture.isReadyTime >= Timestamp.now() ? town.modules['Autoculture'].isReadyTime : !(void 0 === main_module.settings['towns'][town.id] || !(main_module.settings.towns[town.id].party && main_module.checkAvailable(town.id).party || main_module.settings['towns'][town.id].triumph && main_module.checkAvailable(town.id).triumph || main_module.settings.towns[town.id].theater && main_module.checkAvailable(town.id).theater)));
    },
    startCulture(_0x535266) {
        return !!main_module.checkEnabled() && (jugador.modules.Autoculture.isOn ? (main_module.town = _0x535266, main_module.iTown = ITowns.towns[main_module.town.id], void(jugador.currentTown !== main_module.town.key ? (Console.Log(main_module.town.name + ' move to town.', 0x2), game.switch_town(main_module.town.id, function() {
            if (!main_module.checkEnabled()) return false;
            jugador.currentTown = main_module.town['key'], main_module.start();
        })) : main_module.start())) : (main_module.finished(0), false));
    },
    start() {
        if (!main_module.checkEnabled()) return false;
        main_module.interval = setTimeout(function() {
            void 0 !== main_module.settings['towns'][main_module.town.id] && (Console.Log(main_module.town.name + ' getting event information.', 0x2), basic_actions.building_place(main_module.town.id, function(response) {
                if (!main_module.checkEnabled()) return false;
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
                    if (0x3 === _0x6816b2) return _0x112f0d || Console.Log(main_module.town.name + ' not ready yet.', 0x2), main_module.finished(_0x172121), false;
                    if ('triumph' === _0x31c5ce.name && (!main_module.settings['towns'][main_module.town.id].triumph || !main_module.checkAvailable(main_module.town.id).triumph || MM.getModelByNameAndPlayerId('PlayerKillpoints').getUnusedPoints() < 0x12c)) return _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false;
                    if (!('party' !== _0x31c5ce.name || main_module.settings.towns[main_module.town.id].party && main_module.checkAvailable(main_module.town.id).party)) return _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false;
                    if (!('theater' !== _0x31c5ce.name || main_module.settings['towns'][main_module.town.id].theater && main_module.checkAvailable(main_module.town.id).theater)) return _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false;
                    if (_0x31c5ce.element.find('#countdown_' + _0x31c5ce.name).length) {
                        var _0x135475 = data.timeToSeconds(_0x31c5ce.element.find('#countdown_' + _0x31c5ce.name).html());
                        return (0x12c === _0x172121 || _0x172121 > _0x135475) && (_0x172121 = _0x135475), _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false;
                    }
                    return '1' !== _0x31c5ce.element.find('.button, .button_new').data('enabled') ? (_0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]), false) : '1' === _0x31c5ce.element['find']('.button, .button_new').data('enabled') ? (main_module.interval = setTimeout(function() {
                        _0x112f0d = true, main_module.startCelebration(_0x31c5ce, function(_0x1f94e1) {
                            if (main_module.isPauzed) return false;
                            (0x12c === _0x172121 || _0x172121 >= _0x1f94e1) && (_0x172121 = _0x1f94e1), _0x6816b2++, _0x2213c3(celebration_list[_0x6816b2]);
                        });
                    }, (_0x6816b2 + 0x1) * data.randomize(0x3e8, 0x7d0)), false) : (_0x6816b2++, void _0x2213c3(celebration_list[_0x6816b2]));
                }(celebration_list[_0x6816b2]);
            }));
        }, data.randomize(2000, 4000));
    },

    startCelebration(_0x4e6929, _0x1cfbb7) {
        if (!main_module.checkEnabled()) return false;
        game.start_celebration(main_module.town.id, _0x4e6929.name, function(_0x126142) {
            if (!main_module.checkEnabled()) return false;
            var _0x50d2c2 = 0;
            if (void 0 === _0x126142.json['error']) {
                var _0x3196b3 = {};
                if ($.each(_0x126142.json.notifications, function(_0x245214, _0x52a18a) {
                        'Celebration' === _0x52a18a.subject && (_0x3196b3 = JSON.parse(_0x52a18a.param_str));
                    }), main_module.town.id === Game.townId)
                    for (var _0x7b7550 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0xf15587 = 0; _0x7b7550.length > _0xf15587; _0xf15587++) _0x7b7550[_0xf15587].getHandler().refresh();
                void 0 !== _0x3196b3.Celebration && (Console.Log('<span style="color: #fff;">' + PopupFactory.texts[_0x3196b3.Celebration.celebration_type] + ' is started.</span>', 0x2), _0x50d2c2 = _0x3196b3.Celebration.finished_at - Timestamp.now());
            } else Console.Log(main_module.town.name + ' ' + _0x126142.json['error'], 0x2);
            _0x1cfbb7(_0x50d2c2);
        });
    },

    stop() {
        clearInterval(main_module.interval), main_module.isStopped = true;
    },

    finished(_0x55d757) {
        if (!main_module.checkEnabled()) return false;
        main_module.town.modules.Autoculture.isReadyTime = Timestamp.now() + _0x55d757, jugador.Queue.next();
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
                'checked': _0x29a967.id in main_module.settings['towns'] && main_module.settings.towns[_0x29a967.id].party,
                'disabled': !main_module.checkAvailable(_0x29a967.id).party
            })), _0x1650b5.find('#culture_triumph_' + _0x29a967.id).html(_0x257397.checkbox({
                'id': 'bot_culture_triumph_' + _0x29a967.id,
                'name': 'bot_culture_triumph_' + _0x29a967.id,
                'checked': _0x29a967.id in main_module.settings.towns && main_module.settings.towns[_0x29a967.id].triumph,
                'disabled': !main_module.checkAvailable(_0x29a967.id).triumph
            })), _0x1650b5.find('#culture_theater_' + _0x29a967.id).html(_0x257397.checkbox({
                'id': 'bot_culture_theater_' + _0x29a967.id,
                'name': 'bot_culture_theater_' + _0x29a967.id,
                'checked': _0x29a967.id in main_module.settings.towns && main_module.settings.towns[_0x29a967.id].theater,
                'disabled': !main_module.checkAvailable(_0x29a967.id).theater
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
                    main_module.settings.towns[_0x4e30f7.id] = {
                        'party': false,
                        'triumph': false,
                        'theater': false
                    };
                }), $.each(_0x4fc462, function(_0x3def6b, _0x5ad879) {
                    _0x3def6b.indexOf('bot_culture_party_') >= 0 ? main_module.settings.towns[_0x3def6b.replace('bot_culture_party_', '')].party = void 0 !== _0x5ad879 : _0x3def6b.indexOf('bot_culture_triumph_') >= 0 ? main_module.settings.towns[_0x3def6b.replace('bot_culture_triumph_', '')].triumph = void 0 !== _0x5ad879 : _0x3def6b.indexOf('bot_culture_theater_') >= 0 && (main_module.settings['towns'][_0x3def6b.replace('bot_culture_theater_', '')].theater = void 0 !== _0x5ad879);
                }), main_module.settings.autostart = $('#autoculture_autostart').prop('checked'), game.Auth('saveCulture', {
                    'player_id': data.Account.player_id,
                    'world_id': data.Account.world_id,
                    'csrfToken': data.Account.csrfToken,
                    'autoculture_settings': data.stringify(main_module.settings)
                }, main_module.callbackSave);
            });
            return jugador.hasPremium || _0x5748c9.mousePopup(new MousePopup(jugador.requiredPrem)), _0x5748c9;
        }).append(_0x257397.checkbox({
            'text': 'AutoStart AutoCulture.',
            'id': 'autoculture_autostart',
            'name': 'autoculture_autostart',
            'checked': main_module.settings['autostart']
        })), _0x257397.gameWrapper('AutoCulture', 'bot_townsoverview', _0x1650b5, 'margin-bottom:9px;', !jugador.hasPremium);
    },

    callbackSave() {
        Console.Log('Settings saved', 0x2), HumanMessage.success('The settings were saved!');
    }
}
Object.defineProperty(main_module, 'settings', {
    'enumerable': true,
    'writable': true,
    'value': {
        'autostart': false,
        'towns': {}
    }
}), Object.defineProperty(main_module, 'town', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(main_module, 'iTown', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(main_module, 'interval', {
    'enumerable': true,
    'writable': true,
    'value': null
}), Object.defineProperty(main_module, 'isStopped', {
    'enumerable': true,
    'writable': true,
    'value': false
});




let jugador = {
        'key': 'init',
        'value': function () {
            jugador.loadPlayerTowns(), jugador.initButtons(), jugador.initTimer();
        }
    }, {
        'key': 'start',
        'value': function () {
            var _0x36c75b = false,
                _0x497d31 = null;
            if ($.each(jugador.playerTowns, function (_0x3a949a, _0x5e32b2) {
                    var _0x5dfd05 = farms_manager.checkReady(_0x5e32b2);
                    true === _0x5dfd05 ? (_0x36c75b = true, jugador.Queue.add({
                        'townId': _0x5e32b2.id,
                        'fx': function () {
                            _0x5e32b2.startFarming();
                        }
                    })) : false !== _0x5dfd05 && (null == _0x497d31 || _0x5dfd05 < _0x497d31) && (_0x497d31 = _0x5dfd05);
                    var _0x1e0783 = _0x3e7923.checkReady(_0x5e32b2);
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
        }
    }, {
        stop () {
            clearInterval(jugador.interval), jugador.Queue.stop(), $('#time_autobot .caption .value_container .curr').html('Stopped');
        }
    }, {
        finished () {
            jugador.start();
        }
    }, {
        initTimer () {
            $('.nui_main_menu').css('top', '275px'), $('#time_autobot').append(_0x257397.timerBoxSmall({
                'id': 'Autofarm_timer',
                'styles': '',
                'text': 'Start Autobot'
            })).show();
        }
    }, {
        updateTimer (_0x17eb87, _0x273027) {
            var _0x4716cc = 0;
            _0x4716cc = void 0 !== _0x17eb87 && void 0 !== _0x273027 ? (jugador.Queue.total - (jugador.Queue.queue.length + 0x1) + _0x273027 / _0x17eb87) / jugador.Queue.total * 0x64 : (jugador.Queue.total - jugador.Queue.queue.length) / jugador.Queue.total * 0x64, isNaN(_0x4716cc) || ($('#time_autobot .progress .indicator').width(_0x4716cc + '%'), $('#time_autobot .caption .value_container .curr').html(Math.round(_0x4716cc) + '%'));
        }
    }, {
        checkAutostart () {
            if (farms_manager.settings.autostart) {
                jugador.modules.Autofarm['isOn'] = true;
                var _0x14943a = $('#Autofarm_onoff');
                _0x14943a.addClass('on'), _0x14943a.find('span').mousePopup(new MousePopup('Stop Autofarm'));
            }
            if (_0x3e7923.settings['autostart']) {
                jugador.modules['Autoculture'].isOn = true;
                var _0xb1db21 = $('#Autoculture_onoff');
                _0xb1db21.addClass('on'), _0xb1db21.find('span').mousePopup(new MousePopup('Stop Autoculture'));
            }
            if (_0x12eddf.settings['autostart']) {
                jugador.modules.Autobuild.isOn = true;
                var _0xe53eb6 = $('#Autobuild_onoff');
                _0xe53eb6.addClass('on'), _0xe53eb6.find('span').mousePopup(new MousePopup('Stop Autobuild'));
            }(farms_manager.settings.autostart || _0x3e7923.settings.autostart || _0x12eddf.settings['autostart']) && jugador.start();
        }
    }, {
        'key': 'startTimer',
        'value': function (_0x127196, _0x227a94) {
            var _0x4dec49 = _0x127196;
            jugador.interval = setInterval(function () {
                $('#time_autobot .caption .value_container .curr').html(data.toHHMMSS(_0x127196)), $('#time_autobot .progress .indicator').width((_0x4dec49 - _0x127196) / _0x4dec49 * 0x64 + '%'), --_0x127196 < 0 && (clearInterval(jugador.interval), _0x227a94());
            }, 0x3e8);
        }
    }, {
        initButtons(_0x89fea) {
            var _0x232241 = $('#' + _0x89fea + '_onoff');
            _0x232241.removeClass('disabled'), _0x232241.on('click', function (_0x3470ce) {
                if (_0x3470ce.preventDefault(), 'Autoattack' === _0x89fea && !data.checkPremium('captain')) return HumanMessage.error(Game.premium_data.captain.name + ' ' + DM.getl10n('premium').advisors.not_activated['toLowerCase']() + '.'), false;
                true === jugador.modules[_0x89fea].isOn ? (jugador.modules[_0x89fea].isOn = false, _0x232241.removeClass('on'), _0x232241.find('span').mousePopup(new MousePopup('Start ' + _0x89fea)), HumanMessage.success(_0x89fea + ' is deactivated.'), Console.Log(_0x89fea + ' is deactivated.', 0), 'Autofarm' === _0x89fea ? farms_manager.stop() : 'Autoculture' === _0x89fea ? _0x3e7923.stop() : 'Autobuild' === _0x89fea ? _0x12eddf.stop() : 'Autoattack' === _0x89fea && attack_manager.stop()) : false === jugador.modules[_0x89fea].isOn && (_0x232241.addClass('on'), HumanMessage.success(_0x89fea + ' is activated.'), Console.Log(_0x89fea + ' is activated.', 0), _0x232241.find('span').mousePopup(new MousePopup('Stop ' + _0x89fea)), jugador.modules[_0x89fea].isOn = true, 'Autoattack' === _0x89fea && attack_manager.start()), 'Autoattack' !== _0x89fea && jugador.checkWhatToStart();
            }), _0x232241.find('span').mousePopup(new MousePopup('Start ' + _0x89fea));
        }
    }, {
        checkWhatToStart () {
            var _0x335074 = 0;
            $.each(jugador.modules, function (_0x32c7a4, _0x3f5cd9) {
                _0x3f5cd9.isOn && 'Autoattack' !== _0x3f5cd9 && _0x335074++;
            }), 0 === _0x335074 ? jugador.stop() : _0x335074 >= 0 && !jugador.Queue.isRunning() && (clearInterval(jugador.interval), jugador.start());
        }
    }, {
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
        }
    }, {
        callbackAuth (argumento) {
            data.isLogged = true,
            data.trial_time = argumento.trial_time,
            data.premium_time = argumento.premium_time,
            data.facebook_like = argumento.facebook_like,
            '' !== argumento.assistant_settings && configurations.setSettings(argumento.assistant_settings),
            data.trial_time - Timestamp.now() >= 0 || data.premium_time - Timestamp.now() >= 0 ? (jugador.hasPremium = true, jugador.init(), farms_manager.init(), farms_manager.setSettings(argumento.autofarm_settings), _0x3e7923.init(), _0x3e7923.setSettings(argumento.autoculture_settings), _0x12eddf.init(),
             _0x12eddf.setSettings(argumento.autobuild_settings), _0x12eddf.setQueue(argumento.building_queue,
                 argumento.units_queue, argumento.ships_queue), attack_manager.init(), jugador.checkAutostart()) :
                  (jugador.hasPremium = false, jugador.init(), farms_manager.init(), $('#Autoculture_onoff').mousePopup(new MousePopup(jugador.requiredPrem)),
                   $('#Autobuild_onoff').mousePopup(new MousePopup(jugador.requiredPrem)), $('#Autoattack_onoff').mousePopup(new MousePopup(jugador.requiredPrem)),
                    data.createNotification('getPremiumNotification', 'Unfortunately your premium membership is over. Please upgrade now!'));
        }
    }], (_0x5e934f = null) && _0x6823f(_0xc61fd5.prototype, _0x5e934f), _0x48ecbd && _0x6823f(_0xc61fd5, _0x48ecbd), jugador;
}();
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
                _0x3e7923.startCulture(this);
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
