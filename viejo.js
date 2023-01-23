! function (_0x249cbf) {
    var _0x57c176 = {};

    function _0x196241(_0x4751b1) {
        if (_0x57c176[_0x4751b1]) return _0x57c176[_0x4751b1].exports;
        var _0x695dd1 = _0x57c176[_0x4751b1] = {
            'i': _0x4751b1,
            'l': false,
            'exports': {}
        };
        return _0x249cbf[_0x4751b1].call(_0x695dd1.exports, _0x695dd1, _0x695dd1.exports, _0x196241), _0x695dd1.l = true, _0x695dd1.exports;
    }
    _0x196241.m = _0x249cbf, _0x196241.c = _0x57c176, _0x196241.d = function (_0x142751, _0x45b347, _0x56dbec) {
        _0x196241.o(_0x142751, _0x45b347) || Object.defineProperty(_0x142751, _0x45b347, {
            'enumerable': true,
            'get': _0x56dbec
        });
    }, _0x196241.r = function (_0x3aa55a) {
        'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(_0x3aa55a, Symbol.toStringTag, {
            'value': 'Module'
        }), Object.defineProperty(_0x3aa55a, '__esModule', {
            'value': true
        });
    }, _0x196241.t = function (_0x1bd391, _0x4b7df6) {
        if (0x1 & _0x4b7df6 && (_0x1bd391 = _0x196241(_0x1bd391)), 0x8 & _0x4b7df6) return _0x1bd391;
        if (0x4 & _0x4b7df6 && 'object' == typeof _0x1bd391 && _0x1bd391 && _0x1bd391.__esModule) return _0x1bd391;
        var _0x1aa231 = Object.create(null);
        if (_0x196241.r(_0x1aa231), Object.defineProperty(_0x1aa231, 'default', {
                'enumerable': true,
                'value': _0x1bd391
            }), 0x2 & _0x4b7df6 && 'string' != typeof _0x1bd391)
            for (var _0x122f6d in _0x1bd391) _0x196241.d(_0x1aa231, _0x122f6d, function (_0x2417eb) {
                return _0x1bd391[_0x2417eb];
            } ['bind'](null, _0x122f6d));
        return _0x1aa231;
    }, _0x196241.n = function (_0x3ca7a7) {
        var _0x4cab5b = _0x3ca7a7 && _0x3ca7a7.__esModule ? function () {
            return _0x3ca7a7.default;
        } : function () {
            return _0x3ca7a7;
        };
        return _0x196241.d(_0x4cab5b, 'a', _0x4cab5b), _0x4cab5b;
    }, _0x196241.o = function (_0x2aa0c1, _0x4fe1ca) {
        return Object.prototype.hasOwnProperty.call(_0x2aa0c1, _0x4fe1ca);
    }, _0x196241.p = '/', _0x196241(_0x196241.s = 0);
}([function (_0x23580a, _0x59fe65, _0x2dc19a) {
    'use strict';

  /*   function _0x506e7e(_0x482f3d, _0x432bd6) {
        for (var _0x4a107a = 0; _0x4a107a < _0x432bd6.length; _0x4a107a++) {
            var _0x5c7ff9 = _0x432bd6[_0x4a107a];
            _0x5c7ff9.enumerable = _0x5c7ff9.enumerable || false, _0x5c7ff9.configurable = true, 'value' in _0x5c7ff9 && (_0x5c7ff9.writable = true), Object.defineProperty(_0x482f3d, _0x5c7ff9.key, _0x5c7ff9);
        }
    }
    _0x2dc19a.r(_0x59fe65);
    var game = function () {
        function _0x39a961() {
            ! function (_0x1649df, _0x6d199c) {
                if (!(_0x1649df instanceof _0x6d199c)) throw new TypeError('Cannot call a class as a function');
            }(this, _0x39a961);
        }
        var _0x47c50f, _0x467d42, _0x131950;
        return _0x47c50f = _0x39a961, _0x131950 = [
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
        ,  */
/*             default_handler (_0x735f65, _0xc804a3) {
                return function (_0x27cb76) {
                    _0xc804a3 = void 0 !== _0xc804a3;
                    var _0x1a27ff = _0x27cb76.json;
                    return _0x1a27ff.redirect ? (window.location.href = _0x1a27ff.redirect, void delete _0x1a27ff.redirect) : _0x1a27ff.maintenance ? MaintenanceWindowFactory.openMaintenanceWindow(_0x1a27ff.maintenance) : (_0x1a27ff.notifications && NotificationLoader && (NotificationLoader.recvNotifyData(_0x1a27ff, 'data'), delete _0x1a27ff.notifications, delete _0x1a27ff.next_fetch_in), _0x735f65(_0xc804a3 ? _0x27cb76 : _0x1a27ff));
                };
            } */
/*         , {
            game_data (town_id, default_handler) {
                var url, data, town_id = town_id;
                url = window.location['protocol'] + '//' + document.domain + '/game/data?' + $.param({
                    'town_id': town_id,
                    'action': 'get',
                    'h': Game.csrfToken
                }), data = {
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
                }, $.ajax({
                    'url': url,
                    'data': data,
                    'method': 'POST',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(default_handler)
                });
            } */
/*         }, { */
/*             switch_town (_0x5ae319, _0x30eeef) {
                var _0x32d5d3;
                _0x32d5d3 = window.location['protocol'] + '//' + document.domain + '/game/index?' + $.param({
                    'town_id': _0x5ae319,
                    'action': 'switch_town',
                    'h': Game.csrfToken
                }), $.ajax({
                    'url': _0x32d5d3,
                    'method': 'GET',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0x30eeef)
                });
            } */
      /*   }, {
            claim_load (town_id, claim_type, time, target_id, default_handler) {
                var url, data, 
                    target_id
                url = window.location['protocol'] + '//' + document.domain + '/game/farm_town_info?' + $.param({
                    'town_id': town_id,
                    'action': 'claim_load',
                    'h': Game.csrfToken
                }), data = {
                    'json': JSON.stringify({
                        'target_id': target_id,
                        'claim_type': claim_type,
                        'time': time,
                        'town_id': town_id,
                        'nl_init': true
                    })
                }, $.ajax({
                    'url': url,
                    'data': data,
                    'method': 'POST',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(default_handler)
                });
            }
        }, */ /* {
            farm_town_overviews (_0x4eaf5c, _0x3ebe11) {
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
            }
        }, */ {
            /* claim_loads (_0x2c4b1c, _0x54a416, _0x77423, _0x476742, _0x1eb31a) {
                $.ajax({
                    'url': window.location.protocol + '//' + document.domain + '/game/farm_town_overviews?' + $.param({
                        'town_id': Game.townId,
                        'action': 'claim_loads',
                        'h': Game.csrfToken
                    });,
                    'data': {
                        'json': JSON.stringify({
                            'farm_town_ids': _0x54a416,
                            'time_option': _0x476742,
                            'claim_factor': _0x77423,
                            'current_town_id': _0x2c4b1c,
                            'town_id': Game.townId,
                            'nl_init': true
                        })
                    },
                    'method': 'POST',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0x1eb31a)
                });
            } */
       /*  }, {
            building_place (town_id, default_handler) {
                data = {
                    'town_id': town_id,
                    'action': 'culture',
                    'h': Game.csrfToken,
                    'json': JSON.stringify({
                        'town_id': town_id,
                        'nl_init': true
                    })
                }, url = window.location['protocol'] + '//' + document.domain + '/game/building_place', $.ajax({
                    'url': url,
                    'data': data,
                    'method': 'GET',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(default_handler, true)
                });
            }
        },  */{
/*             building_main (town_id, default_handler) {
                var url, data, town_id = town_id;
                data = {
                    'town_id': town_id,
                    'action': 'index',
                    'h': Game.csrfToken,
                    'json': JSON.stringify({
                        'town_id': town_id,
                        'nl_init': true
                    })
                }, url = window.location.protocol + '//' + document.domain + '/game/building_main', $.ajax({
                    'url': url,
                    'data': data,
                    'method': 'GET',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(default_handler)
                });
            }
        } *//* , {
            start_celebration (_0x3d36eb, _0x2807a7, _0x84420f) {
                var _0x1ec510, _0x8bac06 = window.location['protocol'] + '//' + document.domain + '/game/building_place?' + $.param({
                    'town_id': _0x3d36eb,
                    'action': 'start_celebration',
                    'h': Game.csrfToken
                });
                _0x1ec510 = {
                    'json': JSON.stringify({
                        'celebration_type': _0x2807a7,
                        'town_id': _0x3d36eb,
                        'nl_init': true
                    })
                }, $.ajax({
                    'url': _0x8bac06,
                    'data': _0x1ec510,
                    'method': 'POST',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0x84420f, true)
                });
            }
        }, *//*  {
            email_validation (_0xda5f10) {
                var _0x5c141b = {
                        'town_id': Game.townId,
                        'action': 'email_validation',
                        'h': Game.csrfToken,
                        'json': JSON.stringify({
                            'town_id': Game.townId,
                            'nl_init': true
                        })
                    },
                    _0x7e5ac8 = window.location['protocol'] + '//' + document.domain + '/game/player';
                $.ajax({
                    'url': _0x7e5ac8,
                    'data': _0x5c141b,
                    'method': 'GET',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0xda5f10, true)
                });
            }
        }, {
            members_show (default_handler) {
                var data = {
                        'town_id': Game.townId,
                        'action': 'members_show',
                        'h': Game.csrfToken,
                        'json': JSON.stringify({
                            'town_id': Game.townId,
                            'nl_init': true
                        })
                    },
                    _0xde96e2 = window.location.protocol + '//' + document.domain + '/game/alliance';
                $.ajax({
                    'url': _0xde96e2,
                    'data': data,
                    'method': 'GET',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(default_handler)
                });
            }
        }, {
            login_to_game_world (_0x3173e7) {
                $.redirect(window.location.protocol + '//' + document.domain + '/start?' + $.param({
                    'action': 'login_to_game_world'
                }), {
                    'world': _0x3173e7,
                    'facebook_session': '',
                    'facebook_login': '',
                    'portal_sid': '',
                    'name': '',
                    'password': ''
                });
            }
        }, {
            frontend_bridge (_0x3e02da, _0x1ca89e, _0x1db3bb) {
                var _0x303f10 = window.location['protocol'] + '//' + document.domain + '/game/frontend_bridge?' + $.param({
                        'town_id': _0x3e02da,
                        'action': 'execute',
                        'h': Game.csrfToken
                    }),
                    _0x51fa56 = {
                        'json': JSON.stringify(_0x1ca89e)
                    };
                $.ajax({
                    'url': _0x303f10,
                    'data': _0x51fa56,
                    'method': 'POST',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0x1db3bb)
                });
            }
        }, {
            building_barracks (_0x2f116c, _0x21200f, _0x405da2) {
                var _0x120242 = window.location.protocol + '//' + document.domain + '/game/building_barracks?' + $.param({
                        'town_id': _0x2f116c,
                        'action': 'build',
                        'h': Game.csrfToken
                    }),
                    _0x4a6df1 = {
                        'json': JSON.stringify(_0x21200f)
                    };
                $.ajax({
                    'url': _0x120242,
                    'data': _0x4a6df1,
                    'method': 'POST',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0x405da2)
                });
            }
        }, {
             attack_planner (_0x558a08, _0x584cf3) {
                var _0x4d7474, _0x22f44f, _0x55cb9b = _0x558a08;
                _0x22f44f = {
                    'town_id': _0x55cb9b,
                    'action': 'attacks',
                    'h': Game.csrfToken,
                    'json': JSON.stringify({
                        'town_id': _0x55cb9b,
                        'nl_init': true
                    })
                }, _0x4d7474 = window.location.protocol + '//' + document.domain + '/game/attack_planer', $.ajax({
                    'url': _0x4d7474,
                    'data': _0x22f44f,
                    'method': 'GET',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0x584cf3)
                });
            }
        }, {
            town_info_attack (_0x5321ec, _0x12e856, _0x37c390) {
                var _0x22f2e3, _0x511a17;
                _0x511a17 = {
                    'town_id': _0x5321ec,
                    'action': 'attack',
                    'h': Game.csrfToken,
                    'json': JSON.stringify({
                        'id': _0x12e856.target_id,
                        'nl_init': true,
                        'origin_town_id': _0x12e856.town_id,
                        'preselect': true,
                        'preselect_units': _0x12e856.units,
                        'town_id': Game.townId
                    })
                }, _0x22f2e3 = window.location.protocol + '//' + document.domain + '/game/town_info', $.ajax({
                    'url': _0x22f2e3,
                    'data': _0x511a17,
                    'method': 'GET',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0x37c390)
                });
            }
        }, {
            send_units (_0x596716, _0x510bc6, _0x49f923, _0x58fdb0, _0x50b02e) {
                var _0x2b5a0f = window.location.protocol + '//' + document.domain + '/game/town_info?' + $.param({
                        'town_id': _0x596716,
                        'action': 'send_units',
                        'h': Game.csrfToken
                    }),
                    _0x2fcdd3 = {
                        'json': JSON.stringify($.extend({
                            'id': _0x49f923,
                            'type': _0x510bc6,
                            'town_id': _0x596716,
                            'nl_init': true
                        }, _0x58fdb0))
                    };
                $.ajax({
                    'url': _0x2b5a0f,
                    'data': _0x2fcdd3,
                    'method': 'POST',
                    'dataType': 'json',
                    'success': _0x39a961.default_handler(_0x50b02e)
                });
            }
        } *//* ], (_0x467d42 = null) && _0x506e7e(_0x47c50f.prototype, _0x467d42), _0x131950 && _0x506e7e(_0x47c50f, _0x131950), _0x39a961;
    }(); */

    function _0x582ce3(_0xe0a5ec, _0x4024c7) {
        for (var _0x23ab44 = 0; _0x23ab44 < _0x4024c7.length; _0x23ab44++) {
            var _0x258ef9 = _0x4024c7[_0x23ab44];
            _0x258ef9.enumerable = _0x258ef9.enumerable || false, _0x258ef9.configurable = true, 'value' in _0x258ef9 && (_0x258ef9.writable = true), Object.defineProperty(_0xe0a5ec, _0x258ef9.key, _0x258ef9);
        }
    }
   /*  var console = function () {
        function _0x4f8ba6() {
            ! function (_0x5a77bd, _0x3e3ad1) {
                if (!(_0x5a77bd instanceof _0x3e3ad1)) throw new TypeError('Cannot call a class as a function');
            }(this, _0x4f8ba6);
        }
        var _0xa341db, _0x1a91ec, _0x5b6228;
        return _0xa341db = _0x4f8ba6, _0x5b6228 = [{
            'key': 'contentConsole',
            'value': function () {
                var _0x3cb7ae = $('<fieldset/>', {
                        'style': 'float:left; width:472px;'
                    }).append($('<legend/>').html('Autobot Console')).append($('<div/>', {
                        'class': 'terminal'
                    }).append($('<div/>', {
                        'class': 'terminal-output'
                    })).scroll(function () {
                        _0x4f8ba6.LogScrollBottom();
                    })),
                    _0x392edf = _0x3cb7ae.find('.terminal-output');
                return $.each(_0x4f8ba6.Logs, function (_0x4acef2, _0x685b91) {
                    _0x392edf.append(_0x685b91);
                }), _0x3cb7ae;
            }
        }, {
            'key': 'Log',
            'value': function (_0x38c575, _0xe4b5af) {
                function _0x4a56ce(_0x450bde) {
                    return _0x450bde < 0xa ? '0' + _0x450bde : _0x450bde;
                }
                this.Logs.length >= 0x1f4 && this.Logs.shift();
                var _0x2da986 = new Date(),
                    _0xb1632c = _0x4a56ce(_0x2da986.getHours()) + ':' + _0x4a56ce(_0x2da986.getMinutes()) + ':' + _0x4a56ce(_0x2da986.getSeconds()),
                    _0x380e1c = $('<div/>').append($('<div/>', {
                        'style': 'width: 100%;'
                    }).html(_0xb1632c + ' - [' + _0x4f8ba6.Types[_0xe4b5af] + ']: ' + _0x38c575));
                this.Logs['push'](_0x380e1c);
                var _0x5da79b = $('.terminal-output');
                if (_0x5da79b.length && (_0x5da79b.append(_0x380e1c), this.scrollUpdate)) {
                    var _0x4bf51c = $('.terminal'),
                        _0x497166 = $('.terminal-output')[0].scrollHeight;
                    _0x4bf51c.scrollTop(_0x497166);
                }
            }
        }, {
            'key': 'LogScrollBottom',
            'value': function () {
                clearInterval(this.scrollInterval);
                var _0x36b9fc = $('.terminal'),
                    _0x1107fe = $('.terminal-output');
                this.scrollUpdate = _0x36b9fc.scrollTop() + _0x36b9fc.height() === _0x1107fe.height();
                var _0x5b625a = _0x1107fe[0].scrollHeight;
                this.scrollInterval = setInterval(function () {
                    _0x36b9fc.scrollTop(_0x5b625a);
                }, 0x1b58);
            }
        }], (_0x1a91ec = null) && _0x582ce3(_0xa341db.prototype, _0x1a91ec), _0x5b6228 && _0x582ce3(_0xa341db, _0x5b6228), _0x4f8ba6;
    }();
    Object.defineProperty(console, 'Logs', {
        'enumerable': true,
        'writable': true,
        'value': []
    }), Object.defineProperty(console, 'Types', {
        'enumerable': true,
        'writable': true,
        'value': ['Autobot', 'Farming', 'Culture', 'Builder', 'Attack ']
    }), Object.defineProperty(console, 'scrollInterval', {
        'enumerable': true,
        'writable': true,
        'value': ''
    }), Object.defineProperty(console, 'scrollUpdate', {
        'enumerable': true,
        'writable': true,
        'value': true
    });
    var Console = console; */

    function _0x201302(_0xced59d, _0x194f97) {
        for (var _0x295e8b = 0; _0x295e8b < _0x194f97.length; _0x295e8b++) {
            var _0x391b45 = _0x194f97[_0x295e8b];
            _0x391b45.enumerable = _0x391b45.enumerable || false, _0x391b45.configurable = true, 'value' in _0x391b45 && (_0x391b45.writable = true), Object.defineProperty(_0xced59d, _0x391b45.key, _0x391b45);
        }
    }
    /* var module_menu = function () {
        function module_menu() {
            ! function (_0xa50a54, _0x12aad2) {
                if (!(_0xa50a54 instanceof _0x12aad2)) throw new TypeError('Cannot call a class as a function');
            }(this, module_menu);
        }
        var _0x4aa0cc, _0x312054, _0x4c66d0;
        return _0x4aa0cc = module_menu, _0x4c66d0 = [{
            'key': 'button',
            'value': function (_0x2c0c28) {
                return $('<div/>').append($('<a/>', {
                    'class': 'button_new' + (_0x2c0c28.class || ''),
                    'href': '#',
                    'style': 'margin-top:1px;float:left;' + (_0x2c0c28.style || '')
                }).append($('<span/>', {
                    'class': 'left'
                })).append($('<span/>', {
                    'class': 'right'
                })).append($('<div/>', {
                    'class': 'caption js-caption'
                }).text(_0x2c0c28.name)));
            }
        }, {
            'key': 'checkbox',
            'value': function (_0xbecd03, _0x23d511, _0x55795a) {
                return $('<div/>', {
                    'class': 'checkbox_new' + (_0xbecd03.checked ? ' checked' : '') + (_0xbecd03.disabled ? ' disabled' : ''),
                    'style': 'padding: 5px;' + (_0xbecd03.style || '')
                }).append($('<input/>', {
                    'type': 'checkbox',
                    'name': _0xbecd03.name,
                    'id': _0xbecd03.id,
                    'checked': _0xbecd03.checked,
                    'style': 'display: none;'
                })).append($('<div/>', {
                    'class': 'cbx_icon',
                    'rel': _0xbecd03.name
                })).append($('<div/>', {
                    'class': 'cbx_caption'
                }).text(_0xbecd03.text)).bind('click', function () {
                    $(this).toggleClass('checked'), $(this).find($('input[type="checkbox"]')).prop('checked', $(this).hasClass('checked')), $(this).hasClass('checked') ? void 0 !== _0x23d511 && _0x23d511() : void 0 !== _0x55795a && _0x55795a();
                });
            }
        }, {
            'key': 'input',
            'value': function (_0x2d09c8) {
                return $('<div/>', {
                    'style': 'padding: 5px;'
                }).append($('<label/>', {
                    'for': _0x2d09c8.id
                }).text(_0x2d09c8.name + ': ')).append($('<div/>', {
                    'class': 'textbox',
                    'style': _0x2d09c8.style
                }).append($('<div/>', {
                    'class': 'left'
                })).append($('<div/>', {
                    'class': 'right'
                })).append($('<div/>', {
                    'class': 'middle'
                }).append($('<div/>', {
                    'class': 'ie7fix'
                }).append($('<input/>', {
                    'type': _0x2d09c8.type,
                    'tabindex': '1',
                    'id': _0x2d09c8.id,
                    'name': _0x2d09c8.id,
                    'value': _0x2d09c8.value
                }).attr('size', _0x2d09c8.size)))));
            }
        }, {
            'key': 'textarea',
            'value': function (_0x285f03) {
                return $('<div/>', {
                    'style': 'padding: 5px;'
                }).append($('<label/>', {
                    'for': _0x285f03.id
                }).text(_0x285f03.name + ': ')).append($('<div/>').append($('<textarea/>', {
                    'name': _0x285f03.id,
                    'id': _0x285f03.id
                })));
            }
        }, {
            'key': 'inputMinMax',
            'value': function (_0x446c03) {
                return $('<div/>', {
                    'class': 'textbox'
                }).append($('<span/>', {
                    'class': 'grcrt_spinner_btn grcrt_spinner_down',
                    'rel': _0x446c03.name
                }).click(function () {
                    var _0xa93698 = $(this).parent().find('#' + $(this).attr('rel'));
                    parseInt($(_0xa93698).attr('min')) < parseInt($(_0xa93698).attr('value')) && $(_0xa93698).attr('value', parseInt($(_0xa93698).attr('value')) - 0x1);
                })).append($('<div/>', {
                    'class': 'textbox',
                    'style': _0x446c03.style
                }).append($('<div/>', {
                    'class': 'left'
                })).append($('<div/>', {
                    'class': 'right'
                })).append($('<div/>', {
                    'class': 'middle'
                }).append($('<div/>', {
                    'class': 'ie7fix'
                }).append($('<input/>', {
                    'type': 'text',
                    'tabindex': '1',
                    'id': _0x446c03.name,
                    'value': _0x446c03.value,
                    'min': _0x446c03.min,
                    'max': _0x446c03.max
                }).attr('size', _0x446c03.size || 0xa).css('text-align', 'right'))))).append($('<span/>', {
                    'class': 'grcrt_spinner_btn grcrt_spinner_up',
                    'rel': _0x446c03.name
                }).click(function () {
                    var _0x3256df = $(this).parent().find('#' + $(this).attr('rel'));
                    parseInt($(_0x3256df).attr('max')) > parseInt($(_0x3256df).attr('value')) && $(_0x3256df).attr('value', parseInt($(_0x3256df).attr('value')) + 0x1);
                }));
            }
        }, {
            'key': 'inputSlider',
            'value': function (_0x377111) {
                return $('<div/>', {
                    'id': 'grcrt_' + _0x377111.name + '_config'
                }).append($('<div/>', {
                    'class': 'slider_container'
                }).append($('<div/>', {
                    'style': 'float:left;width:120px;'
                }).html(_0x377111.name)).append(module_menu.input({
                    'name': 'grcrt_' + _0x377111.name + '_value',
                    'style': 'float:left;width:33px;'
                }).hide()).append($('<div/>', {
                    'class': 'windowmgr_slider',
                    'style': 'width: 200px;float: left;'
                }).append($('<div/>', {
                    'class': 'grepo_slider sound_volume'
                })))).append($('<script/>', {
                    'type': 'text/javascript'
                }).text("RepConv.slider = $('#grcrt_" + _0x377111.name + `_config .sound_volume').grepoSlider({\
min: 0,\
max: 100,\
step: 5,\
value: ` + _0x377111.volume + `,\
template: 'tpl_grcrt_slider'\
}).on('sl:change:value', function (e, _sl, value) {\
$('#grcrt_` + _0x377111.name + `_value').attr('value',value);\
if (RepConv.audio.test != undefined){\
RepConv.audio.test.volume = value/100;\
}\
}),\
$('#grcrt_` + _0x377111.name + `_config .button_down').css('background-position','-144px 0px;'),\
$('#grcrt_` + _0x377111.name + `_config .button_up').css('background-position','-126px 0px;')\
`));
            }
        }, {
            'key': 'selectBox',
            'value': function (_0x5bb404) {
                return $('<div/>', {
                    'style': 'padding: 5px'
                }).append($('<input/>', {
                    'type': 'hidden',
                    'name': _0x5bb404.name,
                    'id': _0x5bb404.id,
                    'value': _0x5bb404.value
                })).append($('<label/>', {
                    'for': _0x5bb404.id
                }).text(_0x5bb404.label)).append($('<div/>', {
                    'id': _0x5bb404.id,
                    'class': 'dropdown default',
                    'style': _0x5bb404.styles
                }).dropdown({
                    'list_pos': 'left',
                    'value': _0x5bb404.value,
                    'disabled': _0x5bb404.disabled || false,
                    'options': _0x5bb404.options
                }).on('dd:change:value', function (_0xad0ea0, _0x29a048) {
                    $('#' + _0x5bb404.id).attr('value', _0x29a048);
                }));
            }
        }, {
            'key': 'timerBoxFull',
            'value': function (_0x3160f2) {
                return $('<div/>', {
                    'class': 'single-progressbar instant_buy js-progressbar type_building_queue',
                    'id': _0x3160f2.id,
                    'style': _0x3160f2.styles
                }).append($('<div/>', {
                    'class': 'border_l'
                })).append($('<div/>', {
                    'class': 'border_r'
                })).append($('<div/>', {
                    'class': 'body'
                })).append($('<div/>', {
                    'class': 'progress'
                }).append($('<div/>', {
                    'class': 'indicator',
                    'style': 'width: 0%;'
                }))).append($('<div/>', {
                    'class': 'caption'
                }).append($('<span/>', {
                    'class': 'text'
                })).append($('<span/>', {
                    'class': 'value_container'
                }).append($('<span/>', {
                    'class': 'curr'
                }).html('0%'))));
            }
        }, {
            'key': 'timerBoxSmall',
            'value': function (_0x30ac98) {
                return $('<div/>', {
                    'class': 'single-progressbar instant_buy js-progressbar type_building_queue',
                    'id': _0x30ac98.id,
                    'style': _0x30ac98.styles
                }).append($('<div/>', {
                    'class': 'progress'
                }).append($('<div/>', {
                    'class': 'indicator',
                    'style': 'width: 0%;'
                }))).append($('<div/>', {
                    'class': 'caption'
                }).append($('<span/>', {
                    'class': 'text'
                })).append($('<span/>', {
                    'class': 'value_container'
                }).append($('<span/>', {
                    'class': 'curr'
                }).html(_0x30ac98.text ? _0x30ac98.text : '-'))));
            }
        }, {
            'key': 'gameWrapper',
            'value': function (_0xe2f60, _0x3506ad, _0x366dcd, _0x235967) {
                var _0x4136d3 = arguments.length > 0x4 && void 0 !== arguments[0x4] && arguments[0x4];
                return $('<div/>', {
                    'class': 'game_inner_box' + (_0x4136d3 ? ' disabled-box' : ''),
                    'style': _0x235967,
                    'id': _0x3506ad
                }).append($('<div/>', {
                    'class': 'game_border'
                }).append($('<div/>', {
                    'class': 'game_border_top'
                })).append($('<div/>', {
                    'class': 'game_border_bottom'
                })).append($('<div/>', {
                    'class': 'game_border_left'
                })).append($('<div/>', {
                    'class': 'game_border_right'
                })).append($('<div/>', {
                    'class': 'game_border_top'
                })).append($('<div/>', {
                    'class': 'game_border_corner corner1'
                })).append($('<div/>', {
                    'class': 'game_border_corner corner2'
                })).append($('<div/>', {
                    'class': 'game_border_corner corner3'
                })).append($('<div/>', {
                    'class': 'game_border_corner corner4'
                })).append($('<div/>', {
                    'class': 'game_header bold',
                    'id': 'settings_header'
                }).html(_0xe2f60)).append($('<div/>').append(_0x366dcd)));
            }
        }], (_0x312054 = null) && _0x201302(_0x4aa0cc.prototype, _0x312054), _0x4c66d0 && _0x201302(_0x4aa0cc, _0x4c66d0), module_menu;
    }();
 */
    function _0x36e023(_0x7a5c85, _0x1b0a01) {
        for (var _0x919c7c = 0; _0x919c7c < _0x1b0a01.length; _0x919c7c++) {
            var _0x4bfb01 = _0x1b0a01[_0x919c7c];
            _0x4bfb01.enumerable = _0x4bfb01.enumerable || false, _0x4bfb01.configurable = true, 'value' in _0x4bfb01 && (_0x4bfb01.writable = true), Object.defineProperty(_0x7a5c85, _0x4bfb01.key, _0x4bfb01);
        }
    }
    /* var configurations = function () {
        function _0x1ec97b() {
            ! function (_0x4b59b3, _0x282266) {
                if (!(_0x4b59b3 instanceof _0x282266)) throw new TypeError('Cannot call a class as a function');
            }(this, _0x1ec97b);
        }
        var _0x309f68, _0xb2ede5, _0x2dd2a0;
        return _0x309f68 = _0x1ec97b, _0x2dd2a0 = [{
            'key': 'init',
            'value': function () {
                Console.Log('Initialize Assistant', 0);
            }
        }, {
            'key': 'setSettings',
            'value': function (_0x3168ff) {
                '' !== _0x3168ff && null != _0x3168ff && $.extend(_0x1ec97b.settings, _0x3168ff), _0x1ec97b.initSettings();
            }
        }, {
            'key': 'initSettings',
            'value': function () {
                _0x1ec97b.settings.town_names ? $('#map_towns .flag').addClass('active_town') : $('#map_towns .flag').removeClass('active_town'), _0x1ec97b.settings['player_name'] ? $('#map_towns .flag').addClass('active_player') : $('#map_towns .flag').removeClass('active_player'), _0x1ec97b.settings.alliance_name ? $('#map_towns .flag').addClass('active_alliance') : $('#map_towns .flag').removeClass('active_alliance');
            }
        }, {
            'key': 'contentSettings',
            'value': function () {
                return $('<fieldset/>', {
                    'id': 'Assistant_settings',
                    'style': 'float:left; width:472px;height: 270px;'
                }).append($('<legend/>').html('Assistant Settings')).append(module_menu.checkbox({
                    'text': 'Show town names on island view.',
                    'id': 'assistant_town_names',
                    'name': 'assistant_town_names',
                    'checked': _0x1ec97b.settings.town_names
                })).append(module_menu.checkbox({
                    'text': 'Show player names on island view.',
                    'id': 'assistant_player_names',
                    'name': 'assistant_player_names',
                    'checked': _0x1ec97b.settings.player_name
                })).append(module_menu.checkbox({
                    'text': 'Show alliance names on island view.',
                    'id': 'assistant_alliance_names',
                    'name': 'assistant_alliance_names',
                    'checked': _0x1ec97b.settings.alliance_name
                })).append(module_menu.selectBox({
                    'id': 'assistant_auto_relogin',
                    'name': 'assistant_auto_relogin',
                    'label': 'Auto re-login: ',
                    'styles': 'width: 120px;',
                    'value': _0x1ec97b.settings['auto_relogin'],
                    'options': [{
                        'value': '0',
                        'name': 'Disabled'
                    }, {
                        'value': '120',
                        'name': 'After 2 minutes'
                    }, {
                        'value': '300',
                        'name': 'After 5 minutes'
                    }, {
                        'value': '600',
                        'name': 'After 10 minutes'
                    }, {
                        'value': '900',
                        'name': 'After 15 minutes'
                    }]
                })).append(module_menu.button({
                    'name': DM.getl10n('notes').btn_save,
                    'style': 'top: 120px;'
                }).on('click', function () {
                    var _0x2d57c4 = $('#Assistant_settings').serializeObject();
                    _0x1ec97b.settings.town_names = void 0 !== _0x2d57c4.assistant_town_names, _0x1ec97b.settings['player_name'] = void 0 !== _0x2d57c4.assistant_player_names, _0x1ec97b.settings.alliance_name = void 0 !== _0x2d57c4.assistant_alliance_names, _0x1ec97b.settings.auto_relogin = parseInt(_0x2d57c4.assistant_auto_relogin), game.Auth('saveAssistant', {
                        'player_id': data.Account.player_id,
                        'world_id': data.Account.world_id,
                        'csrfToken': data.Account.csrfToken,
                        'assistant_settings': data.stringify(_0x1ec97b.settings)
                    }, _0x1ec97b.callbackSave);
                }));
            }
        }, {
            'key': 'callbackSave',
            'value': function () {
                HumanMessage.success('The settings were saved!'), _0x1ec97b.initSettings();
            }
        }], (_0xb2ede5 = null) && _0x36e023(_0x309f68.prototype, _0xb2ede5), _0x2dd2a0 && _0x36e023(_0x309f68, _0x2dd2a0), _0x1ec97b;
    }();
    Object.defineProperty(configurations, 'settings', {
        'enumerable': true,
        'writable': true,
        'value': {
            'town_names': false,
            'player_name': false,
            'alliance_name': true,
            'auto_relogin': 0
        }
    }); */

    function _0x312ea4(_0x13b5a1, _0x21daf8) {
        for (var _0x347e47 = 0; _0x347e47 < _0x21daf8.length; _0x347e47++) {
            var _0x3ce954 = _0x21daf8[_0x347e47];
            _0x3ce954.enumerable = _0x3ce954.enumerable || false, _0x3ce954.configurable = true, 'value' in _0x3ce954 && (_0x3ce954.writable = true), Object.defineProperty(_0x13b5a1, _0x3ce954.key, _0x3ce954);
        }
    }
    /* var attack_manager = function () {
        function _0x22ef83() {
            ! function (_0xfb6cdb, _0x3d24e3) {
                if (!(_0xfb6cdb instanceof _0x3d24e3)) throw new TypeError('Cannot call a class as a function');
            }(this, _0x22ef83);
        }
        var _0x1a2154, _0x2c7da5, _0x3c34c0;
        return _0x1a2154 = _0x22ef83, _0x3c34c0 = [
            init () {
                Console.Log('Initialize Autoattack', 0x4), _0x22ef83.initButton(), data.checkPremium('captain') && _0x22ef83.loadAttackQueue();
            }
            setSettings (_0x2bde14) {
                '' !== _0x2bde14 && null != _0x2bde14 && $.extend(_0x22ef83.settings, JSON.parse(_0x2bde14));
            }
            initButton () {
                jugador.initButtons('Autoattack');
            }
            start () {
                _0x22ef83.attacks_timers = [];
                var _0x394118 = $.map(_0x22ef83.attacks, function (_0x42c631, _0x35371c) {
                    var _0x63544d = $.Deferred();
                    return _0x22ef83.checkAttack(_0x42c631, _0x35371c).then(function () {
                        _0x63544d.resolve();
                    }), _0x63544d;
                });
                $.when.apply($, _0x394118).done(function () {
                    _0x22ef83.checked_count = 0;
                    var _0x27fb3e = null;
                    0 === _0x22ef83.countRunningAttacks() ? (_0x27fb3e = DM.getl10n('COMMON').no_results + '.', HumanMessage.error(_0x27fb3e), Console.Log('<span style="color: #ff4f23;">' + _0x27fb3e + '</span>', 0x4), _0x22ef83.disableStart()) : (_0x27fb3e = DM.getl10n('alliance').index.button_send + ': ' + _0x22ef83.countRunningAttacks() + ' ' + DM.getl10n('layout').toolbar_activities.incomming_attacks.toLocaleLowerCase() + '.', HumanMessage.success(_0x27fb3e), Console.Log('<span style="color: #ff4f23;">' + _0x27fb3e + '</span>', 0x4));
                });
            }
            checkAttack (_0x574b65, _0xbd7715) {
                var _0x282394 = $.Deferred();
                return _0x574b65.send_at >= Timestamp.now() ? (_0x22ef83.checked_count++, setTimeout(function () {
                    game.town_info_attack(_0x574b65.town_id, _0x574b65, function (_0x30d319) {
                        if (void 0 !== _0x30d319.json) {
                            if (!_0x30d319.json.same_island || GameDataUnits.hasNavalUnits(_0x574b65.units)) {
                                var _0x3a8a2f = GameDataUnits.calculateCapacity(_0x574b65.town_id, _0x574b65.units);
                                if (_0x3a8a2f.needed_capacity > _0x3a8a2f.total_capacity) {
                                    var _0x530343 = DM.getl10n('place').support_overview.slow_transport_ship;
                                    return $('#attack_order_id_' + _0x574b65.id + ' .attack_bot_timer').removeClass('success').html(_0x530343), _0x22ef83.addAttack(_0xbd7715, _0x530343), _0x282394.resolve(), false;
                                }
                            }
                            _0x22ef83.addAttack(_0xbd7715), _0x282394.resolve();
                        }
                    });
                }, 0x3e8 * _0x22ef83.checked_count / 0x2)) : (_0x22ef83.addAttack(_0xbd7715, 'Expired'), $('#attack_order_id_' + _0x574b65.id + ' .attack_bot_timer').removeClass('success').html('Expired'), _0x282394.resolve()), _0x282394;
            }
            addAttack (_0x6d20eb, _0x431ecb) {
                var _0x66ff6 = {
                    'is_running': false,
                    'attack_id': _0x22ef83.attacks[_0x6d20eb].id,
                    'interval': null,
                    'message': '',
                    'message_text': ''
                };
                void 0 !== _0x431ecb ? _0x66ff6.message_text = _0x431ecb : (_0x66ff6.is_running = true, _0x66ff6.interval = setInterval(function () {
                    if (void 0 !== _0x22ef83.attacks[_0x6d20eb]) {
                        var _0x1c749b = _0x22ef83.attacks[_0x6d20eb].send_at - Timestamp.now();
                        _0x66ff6.message = $('#attack_order_id_' + _0x66ff6.attack_id + ' .attack_bot_timer'), _0x66ff6.message.html(data.toHHMMSS(_0x1c749b)), 0x12c !== _0x1c749b && 0x78 !== _0x1c749b && 0x3c !== _0x1c749b || Console.Log('<span style=\"color: #ff4f23;\">[' + _0x22ef83.attacks[_0x6d20eb].origin_town_name + ' &#62; ' + _0x22ef83.attacks[_0x6d20eb].target_town_name + '] ' + DM.getl10n('heroes').common.departure['toLowerCase']().replace(':', '') + ' ' + DM.getl10n('place').support_overview.just_in + ' ' + hours_minutes_seconds(_0x1c749b) + '.</span>', 0x4), _0x22ef83.attacks[_0x6d20eb].send_at <= Timestamp.now() && (_0x66ff6.is_running = false, _0x22ef83.sendAttack(_0x22ef83.attacks[_0x6d20eb]), _0x22ef83.stopTimer(_0x66ff6));
                    } else _0x66ff6.is_running = false, _0x66ff6.message.html('Stopped'), _0x22ef83.stopTimer(_0x66ff6);
                }, 0x3e8)), _0x22ef83.attacks_timers['push'](_0x66ff6);
            }
            countRunningAttacks () {
                var _0x597eed = 0;
                return _0x22ef83.attacks_timers.forEach(function (_0x4b2bcf) {
                    _0x4b2bcf.is_running && _0x597eed++;
                }), _0x597eed;
            }
            stopTimer (_0x337104) {
                clearInterval(_0x337104.interval), 0 === _0x22ef83.countRunningAttacks() && (Console.Log('<span style="color: #ff4f23;">All finished.</span>', 0x4), _0x22ef83.stop());
            }
            stop () {
                _0x22ef83.disableStart(), _0x22ef83.attacks_timers.forEach(function (_0x2209e6) {
                    _0x2209e6.is_running && $('#attack_order_id_' + _0x2209e6.attack_id + ' .attack_bot_timer').html(''), clearInterval(_0x2209e6.interval);
                });
            }
            disableStart () {
                jugador.modules.Autoattack.isOn = false, $('#Autoattack_onoff').removeClass('on').find('span').mousePopup(new MousePopup('Start Autoattack'));
            }
            sendAttack (_0x2aa01c) {
                game.send_units(_0x2aa01c.town_id, _0x2aa01c.type, _0x2aa01c.target_town_id, _0x22ef83.unitsToSend(_0x2aa01c.units), function (_0x5aef6f) {
                    var _0x440cce = _0x22ef83.attacks_timers.filter(function (_0x35cbf2) {
                        return _0x35cbf2.attack_id === _0x2aa01c.id;
                    });
                    void 0 !== _0x5aef6f.success && _0x440cce.length ? (_0x440cce[0].message_text = 'Success', _0x440cce[0].message.addClass('success').html('Success'), Console.Log('<span style="color: #ff9e22;">[' + _0x2aa01c.origin_town_name + ' &#62; ' + _0x2aa01c.target_town_name + '] ' + _0x5aef6f.success + '</span>', 0x4)) : void 0 !== _0x5aef6f.error && _0x440cce.length && (_0x440cce[0].message_text = 'Invalid', _0x440cce[0].message['html']('Invalid'), Console.Log('<span style="color: #ff3100;">[' + _0x2aa01c.origin_town_name + ' &#62; ' + _0x2aa01c.target_town_name + '] ' + _0x5aef6f.error + '</span>', 0x4));
                });
            }
            unitsToSend (_0x318fa0) {
                var _0x55be8c = {};
                return $.each(_0x318fa0, function (_0x5c4c76, _0x5a725a) {
                    _0x5a725a > 0 && (_0x55be8c[_0x5c4c76] = _0x5a725a);
                }), _0x55be8c;
            }
            calls (_0x21453c, _0xb9ac64) {
                switch (_0x21453c) {
                case 'attack_planer/add_origin_town':
                case 'attack_planer/edit_origin_town':
                    _0x22ef83.stop(), _0x22ef83.loadAttackQueue();
                    break;
                case 'attack_planer/attacks':
                    void 0 !== (_0xb9ac64 = JSON.parse(_0xb9ac64)).json.data && _0x22ef83.setAttackData(_0xb9ac64.json);
                }
            }
            setAttackData (_0x3bcd34) {
                data.checkPremium('captain') && (_0x22ef83.attacks = void 0 !== _0x3bcd34.data.attacks ? _0x3bcd34.data.attacks : []);
            }
            attackOrderRow (_0x44f08c, _0x1a98fd) {
                var _0x1ad65a = $('<div/>', {
                    'class': 'origin_town_units'
                });
                void 0 !== _0x44f08c.units && $.each(_0x44f08c.units, function (_0x5e2e39, _0x4857c0) {
                    _0x4857c0 > 0 && _0x1ad65a.append($('<div/>', {
                        'class': 'unit_icon25x25 ' + _0x5e2e39
                    }).html(_0x4857c0));
                });
                var _0xd252d5 = $('<li/>', {
                    'class': 'attacks_row ' + (_0x1a98fd % 0x2 == 0 ? 'odd' : 'even'),
                    'id': 'attack_order_id_' + _0x44f08c.id
                });
                return _0x44f08c.send_at > Timestamp.now() && _0xd252d5.hover(function () {
                    $(this).toggleClass('brown');
                }), _0xd252d5.append($('<div/>', {
                    'class': 'attack_type32x32 ' + _0x44f08c.type
                })).append($('<div/>', {
                    'class': 'arrow'
                })).append($('<div/>', {
                    'class': 'row1'
                }).append(' ' + _0x44f08c.origin_town_link + ' ').append('(' + _0x44f08c.origin_player_link + ')').append($('<span/>', {
                    'class': 'small_arrow'
                })).append(' ' + _0x44f08c.target_town_link + ' ').append('(' + _0x44f08c.origin_player_link + ') ')).append($('<div/>', {
                    'class': 'row2' + (_0x44f08c.send_at <= Timestamp.now() ? ' expired' : '')
                }).append($('<span/>').html(DM.getl10n('heroes').common.departure)).append(' ' + DateHelper.formatDateTimeNice(_0x44f08c.send_at) + ' ').append($('<span/>').html(DM.getl10n('heroes').common.arrival)).append(' ' + DateHelper.formatDateTimeNice(_0x44f08c.arrival_at) + ' ')).append($('<div/>', {
                    'class': 'show_units'
                }).on('click', function () {
                    _0x1ad65a.toggle();
                })).append($('<div/>', {
                    'class': 'attack_bot_timer'
                }).html(function () {
                    var _0x354d5b = _0x22ef83.attacks_timers.filter(function (_0x1572bd) {
                        return _0x1572bd.attack_id === _0x44f08c.id;
                    });
                    if (_0x354d5b.length) return _0x354d5b[0].is_running ? data.toHHMMSS(_0x44f08c.send_at - Timestamp.now()) : _0x354d5b[0].message_text;
                })).append(_0x1ad65a);
            }
        loadAttackQueue () {
                game.attack_planner(Game.townId, function (_0x5b0259) {
                    _0x22ef83.setAttackData(_0x5b0259), _0x22ef83.setAttackQueue($('#attack_bot'));
                });
            }
        setAttackQueue (_0x44c5e3) {
                if (_0x44c5e3.length) {
                    var _0x1693ee = _0x44c5e3.find('ul.attacks_list');
                    _0x1693ee.empty(), game.attack_planner(Game.townId, function (_0x50b955) {
                        _0x22ef83.setAttackData(_0x50b955), $.each(_0x22ef83.attacks, function (_0x180bbf, _0x31a9c7) {
                            _0x180bbf++, _0x1693ee.append(_0x22ef83.attackOrderRow(_0x31a9c7, _0x180bbf));
                        });
                    });
                }
            }
        contentSettings () {
                var _0x5816ae = $('<div id="attack_bot" class="attack_bot attack_planner attacks' + (jugador.hasPremium ? '' : ' disabled-box') + '"><div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_top"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" id="settings_header">AutoAttack</div><div><div class="attacks_list"><ul class="attacks_list"></ul></div><div class="game_list_footer autoattack_settings"></div></div></div></div>');
                return _0x5816ae.find('.autoattack_settings').append(function () {
                    var _0x5849c7 = module_menu.button({
                        'name': DM.getl10n('premium').advisors.short_advantages.attack_planner,
                        'style': 'float: left;',
                        'class': data.checkPremium('captain') ? '' : ' disabled'
                    });
                    return data.checkPremium('captain') ? _0x5849c7.click(function () {
                        AttackPlannerWindowFactory.openAttackPlannerWindow();
                    }) : _0x5849c7;
                }).append(function () {
                    var _0x37d33c = module_menu.button({
                        'name': DM.getl10n('update_notification').refresh,
                        'style': 'float: left;',
                        'class': data.checkPremium('captain') ? '' : ' disabled'
                    });
                    return data.checkPremium('captain') ? _0x37d33c.click(function () {
                        _0x22ef83.setAttackQueue(_0x5816ae);
                    }) : _0x37d33c;
                }).append(function () {
                    if (!data.checkPremium('captain')) return module_menu.button({
                        'name': DM.getl10n('construction_queue').advisor_banner.activate(Game.premium_data['captain'].name),
                        'style': 'float: right;'
                    }).click(function () {
                        PremiumWindowFactory.openBuyAdvisorsWindow();
                    });
                }), _0x22ef83.setAttackQueue(_0x5816ae), _0x5816ae;
            }
        }], (_0x2c7da5 = null) && _0x312ea4(_0x1a2154.prototype, _0x2c7da5), _0x3c34c0 && _0x312ea4(_0x1a2154, _0x3c34c0), _0x22ef83;
    }();


    Object.defineProperty(attack_manager, 'settings', {
        'enumerable': true,
        'writable': true,
        'value': {
            'autostart': false
        }
    }), Object.defineProperty(attack_manager, 'attacks', {
        'enumerable': true,
        'writable': true,
        'value': []
    }), Object.defineProperty(attack_manager, 'attacks_timers', {
        'enumerable': true,
        'writable': true,
        'value': []
    }), Object.defineProperty(attack_manager, 'view', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(attack_manager, 'checked_count', {
        'enumerable': true,
        'writable': true,
        'value': 0
    }); */

    function _0x12b0d4(_0x4882e0, _0x1453e8) {
        for (var _0x30d24a = 0; _0x30d24a < _0x1453e8.length; _0x30d24a++) {
            var _0x36f84a = _0x1453e8[_0x30d24a];
            _0x36f84a.enumerable = _0x36f84a.enumerable || false, _0x36f84a.configurable = true, 'value' in _0x36f84a && (_0x36f84a.writable = true), Object.defineProperty(_0x4882e0, _0x36f84a.key, _0x36f84a);
        }
    }
    /* var farms_manager = function () {
        function _0x250822() {
            ! function (_0x5376c0, _0x2fbc0e) {
                if (!(_0x5376c0 instanceof _0x2fbc0e)) throw new TypeError('Cannot call a class as a function');
            }(this, _0x250822);
        }
        var _0x1e5f44, _0x5dae2c, _0x316323;
        return _0x1e5f44 = _0x250822, _0x316323 = [{
            'key': 'checkReady',
            'value': function (_0x12de32) {
                var _0x7ca83a = ITowns.towns[_0x12de32.id];
                if (_0x7ca83a.hasConqueror()) return false;
                if (!_0x250822.checkEnabled()) return false;
                if (_0x12de32.modules.Autofarm['isReadyTime'] >= Timestamp.now()) return _0x12de32.modules.Autofarm.isReadyTime;
                var _0x4b62f6 = _0x7ca83a.resources();
                if (_0x4b62f6.wood === _0x4b62f6.storage && _0x4b62f6.stone === _0x4b62f6.storage && _0x4b62f6.iron === _0x4b62f6.storage && _0x250822.settings.skipwhenfull) return false;
                var _0x332894 = false;
                return $.each(jugador.Queue.queue, function (_0x4cd034, _0x33bc0a) {
                    if ('Autofarm' === _0x33bc0a.module && -0x1 !== _0x12de32.relatedTowns.indexOf(_0x33bc0a.townId)) return _0x332894 = true, false;
                }), _0x250822.settings.lowresfirst && _0x12de32.relatedTowns.length > 0 && (_0x332894 = false, $.each(_0x12de32.relatedTowns, function (_0x5e6530, _0x480fa6) {
                    var _0x294ce5 = _0x7ca83a.resources(),
                        _0x384e5a = ITowns.towns[_0x480fa6].resources();
                    if (_0x294ce5.wood + _0x294ce5.stone + _0x294ce5.iron > _0x384e5a.wood + _0x384e5a.stone + _0x384e5a.iron) return _0x332894 = true, false;
                })), !_0x332894;
            }
        }, {
            'key': 'disableP',
            'value': function () {
                attack_manager.settings = {
                    'autostart': false,
                    'method': 0x12c,
                    'timebetween': 0x1,
                    'skipwhenfull': true,
                    'lowresfirst': true,
                    'stoplootbelow': true
                };
            }
        }, {
            'key': 'checkEnabled',
            'value': function () {
                return jugador.modules['Autofarm'].isOn;
            }
        }, {
            'key': 'startFarming',
            'value': function (_0x594a71) {
                if (!_0x250822.checkEnabled()) return false;
                _0x250822.town = _0x594a71, _0x250822.shouldFarm = [], _0x250822.iTown = ITowns.towns[_0x250822.town.id];
                var _0x41d840 = function () {
                    _0x250822.interval = setTimeout(function () {
                        Console.Log(_0x250822.town.name + ' getting farm information.', 0x1), _0x250822.isCaptain ? _0x250822.initFarmTownsCaptain(function () {
                            if (!_0x250822.checkEnabled()) return false;
                            _0x250822.claimResources();
                        }) : _0x250822.initFarmTowns(function () {
                            if (!_0x250822.checkEnabled()) return false;
                            _0x250822.town['currentFarmCount'] = 0, _0x250822.claimResources();
                        });
                    }, data.randomize(0x3e8, 0x7d0));
                };
                jugador.currentTown !== _0x250822.town.key ? _0x250822.interval = setTimeout(function () {
                    Console.Log(_0x250822.town.name + ' move to town.', 0x1), game.switch_town(_0x250822.town.id, function () {
                        if (!_0x250822.checkEnabled()) return false;
                        jugador.currentTown = _0x250822.town.key, _0x41d840();
                    }), _0x250822.town.isSwitched = true;
                }, data.randomize(0x3e8, 0x7d0)) : _0x41d840();
            }
        }, {
            'key': 'initFarmTowns',
            'value': function (_0x32f5f3) {
                game.game_data(_0x250822.town.id, function (_0x6c5c94) {
                    if (!_0x250822.checkEnabled()) return false;
                    var _0x337862 = _0x6c5c94.map.data['data'].data;
                    $.each(_0x337862, function (_0x3501c6, _0x43b144) {
                        var _0x216af2 = [];
                        $.each(_0x43b144.towns, function (_0x683a89, _0x295289) {
                            _0x295289.x === _0x250822.iTown.getIslandCoordinateX() && _0x295289.y === _0x250822.iTown['getIslandCoordinateY']() && 0x1 === _0x295289.relation_status && _0x216af2.push(_0x295289);
                        }), _0x250822.town.farmTowns = _0x216af2;
                    }), $.each(_0x250822.town.farmTowns, function (_0x2bf068, _0x5266c9) {
                        _0x5266c9.loot - Timestamp.now() <= 0 && _0x250822.shouldFarm.push(_0x5266c9);
                    }), _0x32f5f3(true);
                });
            }
        }, {
            'key': 'initFarmTownsCaptain',
            'value': function (_0x504a81) {
                game.farm_town_overviews(_0x250822.town.id, function (_0x46bbcb) {
                    if (!_0x250822.checkEnabled()) return false;
                    var _0x307bbe = [];
                    $.each(_0x46bbcb.farm_town_list, function (_0x19002a, _0x158e8e) {
                        _0x158e8e.island_x === _0x250822.iTown['getIslandCoordinateX']() && _0x158e8e.island_y === _0x250822.iTown['getIslandCoordinateY']() && 0x1 === _0x158e8e.rel && _0x307bbe.push(_0x158e8e);
                    }), _0x250822.town.farmTowns = _0x307bbe, $.each(_0x250822.town.farmTowns, function (_0x54ee1e, _0x498069) {
                        _0x498069.loot - Timestamp.now() <= 0 && _0x250822.shouldFarm.push(_0x498069);
                    }), _0x504a81(true);
                });
            }
        }, {
            'key': 'claimResources',
            'value': function () {
                if (!_0x250822.town.farmTowns[0]) return Console.Log(_0x250822.town.name + ' has no farm towns.', 0x1), _0x250822.finished(0x708), false;
                if (_0x250822.town.currentFarmCount < _0x250822.shouldFarm['length']) _0x250822.interval = setTimeout(function () {
                    var _0x15851d = 'normal';
                    if (Game.features.battlepoint_villages || (_0x250822.shouldFarm[_0x250822.town['currentFarmCount']].mood >= 0x56 && _0x250822.settings.stoplootbelow && (_0x15851d = 'double'), _0x250822.settings.stoplootbelow || (_0x15851d = 'double')), _0x250822.isCaptain) {
                        var _0x3c2989 = [];
                        $.each(_0x250822.shouldFarm, function (_0x480d80, _0x330feb) {
                            _0x3c2989.push(_0x330feb.id);
                        }), _0x250822.claimLoads(_0x3c2989, _0x15851d, function () {
                            if (!_0x250822.checkEnabled()) return false;
                            _0x250822.finished(_0x250822.getMethodTime(_0x250822.town.id));
                        });
                    } else _0x250822.claimLoad(_0x250822.shouldFarm[_0x250822.town['currentFarmCount']].id, _0x15851d, function () {
                        if (!_0x250822.checkEnabled()) return false;
                        _0x250822.shouldFarm[_0x250822.town.currentFarmCount].loot = Timestamp.now() + _0x250822.getMethodTime(_0x250822.town.id), jugador.updateTimer(_0x250822.shouldFarm.length, _0x250822.town['currentFarmCount']), _0x250822.town.currentFarmCount++, _0x250822.claimResources();
                    });
                }, data.randomize(0x3e8 * _0x250822.settings.timebetween, 0x3e8 * _0x250822.settings.timebetween + 0x3e8));
                else {
                    var _0x86b50f = null;
                    $.each(_0x250822.town.farmTowns, function (_0x16e034, _0x2d73c5) {
                        var _0x2d608a = _0x2d73c5.loot - Timestamp.now();
                        (null == _0x86b50f || _0x2d608a <= _0x86b50f) && (_0x86b50f = _0x2d608a);
                    }), _0x250822.shouldFarm.length > 0 ? $.each(_0x250822.shouldFarm, function (_0x5c74d2, _0x464317) {
                        var _0x13cc92 = _0x464317.loot - Timestamp.now();
                        (null == _0x86b50f || _0x13cc92 <= _0x86b50f) && (_0x86b50f = _0x13cc92);
                    }) : Console.Log(_0x250822.town.name + ' not ready yet.', 0x1), _0x250822.finished(_0x86b50f);
                }
            }
            claimLoad (_0x490472, _0x7c2aba, _0x3e2e28) {
                Game.features.battlepoint_villages ? game.frontend_bridge(_0x250822.town.id, {
                    'model_url': 'FarmTownPlayerRelation/' + MM.getOnlyCollectionByName('FarmTownPlayerRelation').getRelationForFarmTown(_0x490472).id,
                    'action_name': 'claim',
                    'arguments': {
                        'farm_town_id': _0x490472,
                        'type': 'resources',
                        'option': 0x1
                    }
                }, function (_0x51f40e) {
                    _0x250822.claimLoadCallback(_0x490472, _0x51f40e), _0x3e2e28(_0x51f40e);
                }) : game.claim_load(_0x250822.town.id, _0x7c2aba, _0x250822.getMethodTime(_0x250822.town.id), _0x490472, function (_0x507810) {
                    _0x250822.claimLoadCallback(_0x490472, _0x507810), _0x3e2e28(_0x507810);
                });
            }
        claimLoadCallback (_0x93b056, _0x7f95bc) {
                if (_0x7f95bc.success) {
                    var _0xe3f769 = _0x7f95bc.satisfaction,
                        _0x5082a4 = _0x7f95bc.lootable_human;
                    0x2 === _0x7f95bc.relation_status ? (WMap.updateStatusInChunkTowns(_0x93b056.id, _0xe3f769, Timestamp.now() + _0x250822.getMethodTime(_0x250822.town.id), Timestamp.now(), _0x5082a4, 0x2), WMap.pollForMapChunksUpdate()) : WMap.updateStatusInChunkTowns(_0x93b056.id, _0xe3f769, Timestamp.now() + _0x250822.getMethodTime(_0x250822.town.id), Timestamp.now(), _0x5082a4), Layout.hideAjaxLoader(), Console.Log('<span style="color: #6FAE30;">' + _0x7f95bc.success + '</span>', 0x1);
                } else _0x7f95bc.error && Console.Log(_0x250822.town.name + ' ' + _0x7f95bc.error, 0x1);
            }
        claimLoads (_0x19be7e, _0x112363, _0x55b282) {
                game.claim_loads(_0x250822.town.id, _0x19be7e, _0x112363, _0x250822.getMethodTime(_0x250822.town.id), function (_0x312a59) {
                    _0x250822.claimLoadsCallback(_0x312a59), _0x55b282(_0x312a59);
                });
            }
        getMethodTime (_0x2dd44b) {
                if (Game.features['battlepoint_villages']) {
                    var _0x4cea9b = _0x250822.settings.method;
                    return $.each(MM.getOnlyCollectionByName('Town').getTowns(), function (_0x555769, _0x559c78) {
                        if (_0x559c78.id === _0x2dd44b && _0x559c78.getResearches().hasResearch('booty')) return _0x4cea9b = 0x2 * _0x250822.settings['method'], false;
                    }), _0x4cea9b;
                }
                return _0x250822.settings.method;
            }
        claimLoadsCallback (_0x42ccc7) {
                if (_0x42ccc7.success) {
                    var _0x1f8dff = _0x42ccc7.handled_farms;
                    $.each(_0x1f8dff, function (_0x58f512, _0x7c9130) {
                        0x2 === _0x7c9130.relation_status ? (WMap.updateStatusInChunkTowns(_0x58f512, _0x7c9130.satisfaction, Timestamp.now() + _0x250822.getMethodTime(_0x250822.town.id), Timestamp.now(), _0x7c9130.lootable_at, 0x2), WMap.pollForMapChunksUpdate()) : WMap.updateStatusInChunkTowns(_0x58f512, _0x7c9130.satisfaction, Timestamp.now() + _0x250822.getMethodTime(_0x250822.town.id), Timestamp.now(), _0x7c9130.lootable_at);
                    }), Console.Log('<span style="color: #6FAE30;">' + _0x42ccc7.success + '</span>', 0x1);
                } else _0x42ccc7.error && Console.Log(_0x250822.town.name + ' ' + _0x42ccc7.error, 0x1);
            }
        finished (_0xec133c) {
                if (!_0x250822.checkEnabled()) return false;
                $.each(jugador.playerTowns, function (_0x65227, _0x27c152) {
                    -0x1 !== _0x250822.town.relatedTowns['indexOf'](_0x27c152.id) && (_0x27c152.modules.Autofarm.isReadyTime = Timestamp.now() + _0xec133c);
                }), _0x250822.town.modules.Autofarm['isReadyTime'] = Timestamp.now() + _0xec133c, jugador.Queue.next();
            }
        stop () {
                clearInterval(_0x250822.interval);
            }
        init () {
                Console.Log('Initialize AutoFarm', 0x1), _0x250822.initButton(), _0x250822.checkCaptain();
            }
        initButton () {
                jugador.initButtons('Autofarm');
            }
        checkCaptain () {
                $('.advisor_frame.captain div').hasClass('captain_active') && (_0x250822.isCaptain = true);
            }
        setSettings (_0x42f705) {
                '' !== _0x42f705 && null != _0x42f705 && $.extend(_0x250822.settings, _0x42f705);
            }
        contentSettings () {
                return $('<fieldset/>', {
                    'id': 'Autofarm_settings',
                    'style': 'float:left; width:472px;height: 270px;'
                }).append($('<legend/>').html(_0x250822.title)).append(module_menu.checkbox({
                    'text': 'AutoStart AutoFarm.',
                    'id': 'autofarm_autostart',
                    'name': 'autofarm_autostart',
                    'checked': _0x250822.settings['autostart'],
                    'disabled': !jugador.hasPremium
                })).append(function () {
                    var _0x1c9ebb = {
                        'id': 'autofarm_method',
                        'name': 'autofarm_method',
                        'label': 'Farm method: ',
                        'styles': 'width: 120px;',
                        'value': _0x250822.settings['method'],
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
                    var _0x475db5 = module_menu.selectBox(_0x1c9ebb);
                    return jugador.hasPremium || _0x475db5.mousePopup(new MousePopup(jugador.requiredPrem)), _0x475db5;
                }).append(function () {
                    var _0x504e0d = {
                        'id': 'autofarm_bewteen',
                        'name': 'autofarm_bewteen',
                        'label': 'Time before next farm: ',
                        'styles': 'width: 120px;',
                        'value': _0x250822.settings.timebetween,
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
                    var _0x1b2a10 = module_menu.selectBox(_0x504e0d);
                    return jugador.hasPremium || _0x1b2a10.mousePopup(new MousePopup(jugador.requiredPrem)), _0x1b2a10;
                }).append(module_menu.checkbox({
                    'text': 'Skip farm when warehouse is full.',
                    'id': 'autofarm_warehousefull',
                    'name': 'autofarm_warehousefull',
                    'checked': _0x250822.settings.skipwhenfull,
                    'disabled': !jugador.hasPremium
                })).append(module_menu.checkbox({
                    'text': 'Lowest resources first with more towns on one island.',
                    'id': 'autofarm_lowresfirst',
                    'name': 'autofarm_lowresfirst',
                    'checked': _0x250822.settings.lowresfirst,
                    'disabled': !jugador.hasPremium
                })).append(module_menu.checkbox({
                    'text': 'Stop loot farm until mood is below 80%.',
                    'id': 'autofarm_loot',
                    'name': 'autofarm_loot',
                    'checked': _0x250822.settings.stoplootbelow,
                    'disabled': !jugador.hasPremium
                })).append(function () {
                    var _0x54f8df = module_menu.button({
                        'name': DM.getl10n('notes').btn_save,
                        'class': jugador.hasPremium ? '' : ' disabled',
                        'style': 'top: 62px;'
                    }).on('click', function () {
                        if (!jugador.hasPremium) return false;
                        var _0x56067b = $('#Autofarm_settings').serializeObject();
                        _0x250822.settings.autostart = void 0 !== _0x56067b.autofarm_autostart, _0x250822.settings.method = parseInt(_0x56067b.autofarm_method), _0x250822.settings.timebetween = parseInt(_0x56067b.autofarm_bewteen), _0x250822.settings.skipwhenfull = void 0 !== _0x56067b.autofarm_warehousefull, _0x250822.settings.lowresfirst = void 0 !== _0x56067b.autofarm_lowresfirst, _0x250822.settings.stoplootbelow = void 0 !== _0x56067b.autofarm_loot, game.Auth('saveAutofarm', {
                            'player_id': data.Account.player_id,
                            'world_id': data.Account.world_id,
                            'csrfToken': data.Account.csrfToken,
                            'autofarm_settings': data.stringify(_0x250822.settings)
                        }, _0x250822.callbackSave);
                    });
                    return jugador.hasPremium || _0x54f8df.mousePopup(new MousePopup(jugador.requiredPrem)), _0x54f8df;
                });
            }
        callbackSave () {
                Console.Log('Settings saved', 0x1), HumanMessage.success('The settings were saved!');
            }
        }], (_0x5dae2c = null) && _0x12b0d4(_0x1e5f44.prototype, _0x5dae2c), _0x316323 && _0x12b0d4(_0x1e5f44, _0x316323), _0x250822;
    }();
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
    }); */

    function _0x56ea37(_0x1bf1df, _0xb9000e) {
        for (var _0x5e70a7 = 0; _0x5e70a7 < _0xb9000e.length; _0x5e70a7++) {
            var _0x4947a7 = _0xb9000e[_0x5e70a7];
            _0x4947a7.enumerable = _0x4947a7.enumerable || false, _0x4947a7.configurable = true, 'value' in _0x4947a7 && (_0x4947a7.writable = true), Object.defineProperty(_0x1bf1df, _0x4947a7.key, _0x4947a7);
        }
    }
    /* var main_module = function () {
        function _0x174a6d() {
            ! function (_0x563837, _0x1bc1d6) {
                if (!(_0x563837 instanceof _0x1bc1d6)) throw new TypeError('Cannot call a class as a function');
            }(this, _0x174a6d);
        }
        var _0x1e5144, _0x169898, _0x5173ea;
        return _0x1e5144 = _0x174a6d, _0x5173ea = [{
            'key': 'init',
            'value': function () {
                Console.Log('Initialize Autoculture', 0x2), _0x174a6d.initButton();
            }
        }, {
            'key': 'initButton',
            'value': function () {
                jugador.initButtons('Autoculture');
            }
        }, {
            'key': 'setSettings',
            'value': function (_0x335931) {
                '' !== _0x335931 && null != _0x335931 && $.extend(_0x174a6d.settings, _0x335931);
            }
        }, {
            'key': 'checkAvailable',
            'value': function (_0x2b662b) {
                var _0x404ea7 = {
                        'party': false,
                        'triumph': false,
                        'theater': false
                    },
                    _0x163c90 = ITowns.towns[_0x2b662b].buildings().attributes,
                    _0x3bbfa1 = ITowns.towns[_0x2b662b].resources();
                return _0x163c90.academy >= 0x1e && _0x3bbfa1.wood >= 0x3a98 && _0x3bbfa1.stone >= 0x4650 && _0x3bbfa1.iron >= 0x3a98 && (_0x404ea7.party = true), 0x1 === _0x163c90.theater && _0x3bbfa1.wood >= 0x2710 && _0x3bbfa1.stone >= 0x2ee0 && _0x3bbfa1.iron >= 0x2710 && (_0x404ea7.theater = true), MM.getModelByNameAndPlayerId('PlayerKillpoints').getUnusedPoints() >= 0x12c && (_0x404ea7.triumph = true), _0x404ea7;
            }
        }, {
            'key': 'checkReady',
            'value': function (_0x2411d3) {
                return !ITowns.towns[_0x2411d3.id].hasConqueror() && !!jugador.modules.Autoculture.isOn && (_0x2411d3.modules.Autoculture.isReadyTime >= Timestamp.now() ? _0x2411d3.modules['Autoculture'].isReadyTime : !(void 0 === _0x174a6d.settings['towns'][_0x2411d3.id] || !(_0x174a6d.settings.towns[_0x2411d3.id].party && _0x174a6d.checkAvailable(_0x2411d3.id).party || _0x174a6d.settings['towns'][_0x2411d3.id].triumph && _0x174a6d.checkAvailable(_0x2411d3.id).triumph || _0x174a6d.settings.towns[_0x2411d3.id].theater && _0x174a6d.checkAvailable(_0x2411d3.id).theater)));
            }
        }, {
            'key': 'startCulture',
            'value': function (_0x535266) {
                return !!_0x174a6d.checkEnabled() && (jugador.modules.Autoculture.isOn ? (_0x174a6d.town = _0x535266, _0x174a6d.iTown = ITowns.towns[_0x174a6d.town.id], void(jugador.currentTown !== _0x174a6d.town.key ? (Console.Log(_0x174a6d.town.name + ' move to town.', 0x2), game.switch_town(_0x174a6d.town.id, function () {
                    if (!_0x174a6d.checkEnabled()) return false;
                    jugador.currentTown = _0x174a6d.town['key'], _0x174a6d.start();
                })) : _0x174a6d.start())) : (_0x174a6d.finished(0), false));
            }
        }, {
            'key': 'start',
            'value': function () {
                if (!_0x174a6d.checkEnabled()) return false;
                _0x174a6d.interval = setTimeout(function () {
                    void 0 !== _0x174a6d.settings['towns'][_0x174a6d.town.id] && (Console.Log(_0x174a6d.town.name + ' getting event information.', 0x2), game.building_place(_0x174a6d.town.id, function (_0x52b6df) {
                        if (!_0x174a6d.checkEnabled()) return false;
                        var _0x5de998 = [];
                        _0x5de998.push({
                            'name': 'triumph',
                            'waiting': 0x4b00,
                            'element': $(_0x52b6df.plain.html).find('#place_triumph')
                        }), _0x5de998.push({
                            'name': 'party',
                            'waiting': 0xe100,
                            'element': $(_0x52b6df.plain.html).find('#place_party')
                        }), _0x5de998.push({
                            'name': 'theater',
                            'waiting': 0x459c0,
                            'element': $(_0x52b6df.plain.html).find('#place_theater')
                        });
                        var _0x112f0d = false,
                            _0x6816b2 = 0,
                            _0x172121 = 0x12c;
                        ! function _0x2213c3(_0x31c5ce) {
                            if (0x3 === _0x6816b2) return _0x112f0d || Console.Log(_0x174a6d.town.name + ' not ready yet.', 0x2), _0x174a6d.finished(_0x172121), false;
                            if ('triumph' === _0x31c5ce.name && (!_0x174a6d.settings['towns'][_0x174a6d.town.id].triumph || !_0x174a6d.checkAvailable(_0x174a6d.town.id).triumph || MM.getModelByNameAndPlayerId('PlayerKillpoints').getUnusedPoints() < 0x12c)) return _0x6816b2++, _0x2213c3(_0x5de998[_0x6816b2]), false;
                            if (!('party' !== _0x31c5ce.name || _0x174a6d.settings.towns[_0x174a6d.town.id].party && _0x174a6d.checkAvailable(_0x174a6d.town.id).party)) return _0x6816b2++, _0x2213c3(_0x5de998[_0x6816b2]), false;
                            if (!('theater' !== _0x31c5ce.name || _0x174a6d.settings['towns'][_0x174a6d.town.id].theater && _0x174a6d.checkAvailable(_0x174a6d.town.id).theater)) return _0x6816b2++, _0x2213c3(_0x5de998[_0x6816b2]), false;
                            if (_0x31c5ce.element.find('#countdown_' + _0x31c5ce.name).length) {
                                var _0x135475 = data.timeToSeconds(_0x31c5ce.element.find('#countdown_' + _0x31c5ce.name).html());
                                return (0x12c === _0x172121 || _0x172121 > _0x135475) && (_0x172121 = _0x135475), _0x6816b2++, _0x2213c3(_0x5de998[_0x6816b2]), false;
                            }
                            return '1' !== _0x31c5ce.element.find('.button, .button_new').data('enabled') ? (_0x6816b2++, _0x2213c3(_0x5de998[_0x6816b2]), false) : '1' === _0x31c5ce.element['find']('.button, .button_new').data('enabled') ? (_0x174a6d.interval = setTimeout(function () {
                                _0x112f0d = true, _0x174a6d.startCelebration(_0x31c5ce, function (_0x1f94e1) {
                                    if (_0x174a6d.isPauzed) return false;
                                    (0x12c === _0x172121 || _0x172121 >= _0x1f94e1) && (_0x172121 = _0x1f94e1), _0x6816b2++, _0x2213c3(_0x5de998[_0x6816b2]);
                                });
                            }, (_0x6816b2 + 0x1) * data.randomize(0x3e8, 0x7d0)), false) : (_0x6816b2++, void _0x2213c3(_0x5de998[_0x6816b2]));
                        }(_0x5de998[_0x6816b2]);
                    }));
                }, data.randomize(0x7d0, 0xfa0));
            }
        }, {
            'key': 'startCelebration',
            'value': function (_0x4e6929, _0x1cfbb7) {
                if (!_0x174a6d.checkEnabled()) return false;
                game.start_celebration(_0x174a6d.town.id, _0x4e6929.name, function (_0x126142) {
                    if (!_0x174a6d.checkEnabled()) return false;
                    var _0x50d2c2 = 0;
                    if (void 0 === _0x126142.json['error']) {
                        var _0x3196b3 = {};
                        if ($.each(_0x126142.json.notifications, function (_0x245214, _0x52a18a) {
                                'Celebration' === _0x52a18a.subject && (_0x3196b3 = JSON.parse(_0x52a18a.param_str));
                            }), _0x174a6d.town.id === Game.townId)
                            for (var _0x7b7550 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0xf15587 = 0; _0x7b7550.length > _0xf15587; _0xf15587++) _0x7b7550[_0xf15587].getHandler().refresh();
                        void 0 !== _0x3196b3.Celebration && (Console.Log('<span style="color: #fff;">' + PopupFactory.texts[_0x3196b3.Celebration.celebration_type] + ' is started.</span>', 0x2), _0x50d2c2 = _0x3196b3.Celebration.finished_at - Timestamp.now());
                    } else Console.Log(_0x174a6d.town.name + ' ' + _0x126142.json['error'], 0x2);
                    _0x1cfbb7(_0x50d2c2);
                });
            }
        }, {
            'key': 'stop',
            'value': function () {
                clearInterval(_0x174a6d.interval), _0x174a6d.isStopped = true;
            }
        }, {
            'key': 'finished',
            'value': function (_0x55d757) {
                if (!_0x174a6d.checkEnabled()) return false;
                _0x174a6d.town.modules.Autoculture.isReadyTime = Timestamp.now() + _0x55d757, jugador.Queue.next();
            }
        }, {
            'key': 'checkEnabled',
            'value': function () {
                return jugador.modules.Autoculture['isOn'];
            }
        }, {
            'key': 'contentSettings',
            'value': function () {
                var _0x35b0b1 = '<ul class="game_list" id="townsoverview"><li class="even">';
                _0x35b0b1 += '<div class=\"towninfo small tag_header col w80 h25\" id=\"header_town\"></div>', _0x35b0b1 += '<div class=\"towninfo small tag_header col w40\" id=\"header_island\"> Island</div>', _0x35b0b1 += '<div class="towninfo small tag_header col w35" id="header_wood"><div class="col header wood"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w40" id="header_stone"><div class="col header stone"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w40" id="header_iron"><div class="col header iron"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w35" id="header_free_pop"><div class="col header free_pop"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w40" id="header_storage"><div class="col header storage"></div></div>', _0x35b0b1 += '<div class=\"towninfo small tag_header col w50\" id=\"header_storage\"><div class=\"col header celebration party\"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration triumph"></div></div>', _0x35b0b1 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration theater"></div></div>', _0x35b0b1 += '<div style="clear:both;"></div>', _0x35b0b1 += '</li></ul><div id=\"bot_townsoverview_table_wrapper\">', _0x35b0b1 += '<ul class="game_list scroll_content">';
                var _0xdceffd = 0;
                $.each(jugador.playerTowns, function (_0x4d1c39, _0x91954e) {
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
                return _0x1650b5.find('.celebration.party').mousePopup(new MousePopup('Auto ' + PopupFactory.texts['party'])).on('click', function () {
                    _0x4610ba('.culture_party_row');
                }), _0x1650b5.find('.celebration.triumph').mousePopup(new MousePopup('Auto ' + PopupFactory.texts.triumph)).on('click', function () {
                    _0x4610ba('.culture_triumph_row');
                }), _0x1650b5.find('.celebration.theater').mousePopup(new MousePopup('Auto ' + PopupFactory.texts.theater)).on('click', function () {
                    _0x4610ba('.culture_theater_row');
                }), $.each(jugador.playerTowns, function (_0x4a64b0, _0x29a967) {
                    _0x1650b5.find('#culture_party_' + _0x29a967.id).html(module_menu.checkbox({
                        'id': 'bot_culture_party_' + _0x29a967.id,
                        'name': 'bot_culture_party_' + _0x29a967.id,
                        'checked': _0x29a967.id in _0x174a6d.settings['towns'] && _0x174a6d.settings.towns[_0x29a967.id].party,
                        'disabled': !_0x174a6d.checkAvailable(_0x29a967.id).party
                    })), _0x1650b5.find('#culture_triumph_' + _0x29a967.id).html(module_menu.checkbox({
                        'id': 'bot_culture_triumph_' + _0x29a967.id,
                        'name': 'bot_culture_triumph_' + _0x29a967.id,
                        'checked': _0x29a967.id in _0x174a6d.settings.towns && _0x174a6d.settings.towns[_0x29a967.id].triumph,
                        'disabled': !_0x174a6d.checkAvailable(_0x29a967.id).triumph
                    })), _0x1650b5.find('#culture_theater_' + _0x29a967.id).html(module_menu.checkbox({
                        'id': 'bot_culture_theater_' + _0x29a967.id,
                        'name': 'bot_culture_theater_' + _0x29a967.id,
                        'checked': _0x29a967.id in _0x174a6d.settings.towns && _0x174a6d.settings.towns[_0x29a967.id].theater,
                        'disabled': !_0x174a6d.checkAvailable(_0x29a967.id).theater
                    }));
                }), _0x1650b5.find('#bot_culture_settings').append(function () {
                    var _0x5748c9 = module_menu.button({
                        'name': DM.getl10n('notes').btn_save,
                        'style': 'float: left;',
                        'class': jugador.hasPremium ? '' : ' disabled'
                    }).on('click', function () {
                        if (!jugador.hasPremium) return false;
                        var _0x4fc462 = $('#bot_townsoverview_table_wrapper input').serializeObject();
                        $.each(jugador.playerTowns, function (_0x51ecfa, _0x4e30f7) {
                            _0x174a6d.settings.towns[_0x4e30f7.id] = {
                                'party': false,
                                'triumph': false,
                                'theater': false
                            };
                        }), $.each(_0x4fc462, function (_0x3def6b, _0x5ad879) {
                            _0x3def6b.indexOf('bot_culture_party_') >= 0 ? _0x174a6d.settings.towns[_0x3def6b.replace('bot_culture_party_', '')].party = void 0 !== _0x5ad879 : _0x3def6b.indexOf('bot_culture_triumph_') >= 0 ? _0x174a6d.settings.towns[_0x3def6b.replace('bot_culture_triumph_', '')].triumph = void 0 !== _0x5ad879 : _0x3def6b.indexOf('bot_culture_theater_') >= 0 && (_0x174a6d.settings['towns'][_0x3def6b.replace('bot_culture_theater_', '')].theater = void 0 !== _0x5ad879);
                        }), _0x174a6d.settings.autostart = $('#autoculture_autostart').prop('checked'), game.Auth('saveCulture', {
                            'player_id': data.Account.player_id,
                            'world_id': data.Account.world_id,
                            'csrfToken': data.Account.csrfToken,
                            'autoculture_settings': data.stringify(_0x174a6d.settings)
                        }, _0x174a6d.callbackSave);
                    });
                    return jugador.hasPremium || _0x5748c9.mousePopup(new MousePopup(jugador.requiredPrem)), _0x5748c9;
                }).append(module_menu.checkbox({
                    'text': 'AutoStart AutoCulture.',
                    'id': 'autoculture_autostart',
                    'name': 'autoculture_autostart',
                    'checked': _0x174a6d.settings['autostart']
                })), module_menu.gameWrapper('AutoCulture', 'bot_townsoverview', _0x1650b5, 'margin-bottom:9px;', !jugador.hasPremium);
            }
        }, {
            'key': 'callbackSave',
            'value': function () {
                Console.Log('Settings saved', 0x2), HumanMessage.success('The settings were saved!');
            }
        }], (_0x169898 = null) && _0x56ea37(_0x1e5144.prototype, _0x169898), _0x5173ea && _0x56ea37(_0x1e5144, _0x5173ea), _0x174a6d;
    }();
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
    }); */
/*     var _0x3e7923 = main_module; */

    function _0x5c35f3(_0xb60418, _0x1b955f) {
        for (var _0x3d9b8f = 0; _0x3d9b8f < _0x1b955f.length; _0x3d9b8f++) {
            var _0x56390d = _0x1b955f[_0x3d9b8f];
            _0x56390d.enumerable = _0x56390d.enumerable || false, _0x56390d.configurable = true, 'value' in _0x56390d && (_0x56390d.writable = true), Object.defineProperty(_0xb60418, _0x56390d.key, _0x56390d);
        }
    }
    /* var configuration = function () {
        function configuration() {
            ! function (_0x37be41, _0x1ac775) {
                if (!(_0x37be41 instanceof _0x1ac775)) throw new TypeError('Cannot call a class as a function');
            }(this, configuration);
        }
        var _0x51aa45, _0x19240a, _0x221093;
        return _0x51aa45 = configuration, _0x221093 = [{
            'key': 'init',
            'value': function () {
                Console.Log('Initialize Autobuild', 0x3), configuration.initFunction(), configuration.initButton(), configuration.checkCaptain(), configuration.activateCss();
            }
        }, {
            'key': 'setSettings',
            'value': function (_0x1affb5) {
                '' !== _0x1affb5 && null != _0x1affb5 && $.extend(configuration.settings, _0x1affb5);
            }
        }, {
            'key': 'activateCss',
            'value': function () {
                $('.construction_queue_order_container').addClass('active');
            }
        }, {
            'key': 'setQueue',
            'value': function (_0x24c656, _0xed1724, _0x249491) {
                '' !== _0x24c656 && null != _0x24c656 && (configuration.building_queue = _0x24c656, configuration.initQueue($('.construction_queue_order_container'), 'building')), '' !== _0xed1724 && null != _0xed1724 && (configuration.units_queue = _0xed1724), '' !== _0x249491 && null != _0x249491 && (configuration.ships_queue = _0x249491);
            }
        }, {
            'key': 'calls',
            'value': function (_0x21ca26) {
                switch (_0x21ca26) {
                case 'building_main/index':
                case 'building_main/build':
                case 'building_main/cancel':
                case 'building_main/tear_down':
                    configuration.windows.building_main_index(_0x21ca26);
                    break;
                case 'building_barracks/index':
                case 'building_barracks/build':
                case 'building_barracks/cancel':
                case 'building_barracks/tear_down':
                    configuration.windows.building_barracks_index(_0x21ca26);
                }
            }
        }, {
            'key': 'initFunction',
            'value': function () {
                var _0x9f0cac;
                GameViews.ConstructionQueueBaseView.prototype['renderQueue'] = (_0x9f0cac = GameViews.ConstructionQueueBaseView.prototype.renderQueue, function () {
                    if (_0x9f0cac.apply(this, arguments), '#building_tasks_main .various_orders_queue .frame-content .various_orders_content' !== this.$el.selector && '#ui_box .ui_construction_queue .construction_queue_order_container' !== this.$el.selector || configuration.initQueue(this.$el, 'building'), '#unit_orders_queue .js-researches-queue' === this.$el.selector) {
                        var _0x65f672 = this.$el['find']('.ui_various_orders');
                        _0x65f672.hasClass('barracks') ? configuration.initQueue(this.$el, 'unit') : _0x65f672.hasClass('docks') && configuration.initQueue(this.$el, 'ship');
                    }
                }), UnitOrder.selectUnit = function (_0x1cbb3e) {
                    return function () {
                        _0x1cbb3e.apply(this, arguments), this.barracks ? configuration.initUnitOrder(this, 'unit') : this.barracks || configuration.initUnitOrder(this, 'ship');
                    };
                }(UnitOrder.selectUnit);
            }
        }, {
            'key': 'initButton',
            'value': function () {
                jugador.initButtons('Autobuild');
            }
        }, {
            'key': 'checkCaptain',
            'value': function () {
                $('.advisor_frame.captain div').hasClass('captain_active') && (configuration.isCaptain = true), configuration.Queue = configuration.isCaptain ? 0x7 : 0x2;
            }
        }, {
            'key': 'checkReady',
            'value': function (_0x27aa41) {
                var _0x39a132 = ITowns.towns[_0x27aa41.id];
                return !!jugador.modules.Autobuild.isOn && !_0x39a132.hasConqueror() && !!(configuration.settings.enable_building || configuration.settings['enable_units'] || configuration.settings.enable_ships) && (_0x27aa41.modules.Autobuild.isReadyTime >= Timestamp.now() ? _0x27aa41.modules['Autobuild'].isReadyTime : !(void 0 === configuration.building_queue[_0x27aa41.id] && void 0 === configuration.units_queue[_0x27aa41.id] && void 0 === configuration.ships_queue[_0x27aa41.id]));
            }
        }, {
            'key': 'startBuild',
            'value': function (_0x5a9c32) {
                if (!configuration.checkEnabled()) return false;
                configuration.town = _0x5a9c32, configuration.iTown = ITowns.towns[configuration.town.id], jugador.currentTown !== configuration.town.key ? (Console.Log(configuration.town.name + ' move to town.', 0x3), game.switch_town(configuration.town.id, function () {
                    jugador.currentTown = configuration.town.key, configuration.startUpgrade();
                })) : configuration.startUpgrade();
            }
        }, {
            'key': 'startQueueing',
            'value': function () {
                if (!configuration.checkEnabled()) return false;
                void 0 === configuration.building_queue[configuration.town.id] && void 0 === configuration.units_queue[configuration.town.id] && void 0 === configuration.ships_queue[configuration.town.id] && configuration.finished();
                var _0x4dbd4f = configuration.getReadyTime(configuration.town.id).shouldStart;
                'building' === _0x4dbd4f ? configuration.startBuildBuilding() : 'unit' === _0x4dbd4f || 'ship' === _0x4dbd4f ? configuration.startBuildUnits('unit' === _0x4dbd4f ? configuration.units_queue : configuration.ships_queue, _0x4dbd4f) : configuration.finished();
            }
        }, {
            'key': 'startUpgrade',
            'value': function () {
                if (!configuration.checkEnabled()) return false;
                GameDataInstantBuy.isEnabled() && configuration.checkInstantComplete(configuration.town.id) ? configuration.interval = setTimeout(function () {
                    game.frontend_bridge(configuration.town.id, {
                        'model_url': 'BuildingOrder/' + configuration.instantBuyTown.order_id,
                        'action_name': 'buyInstant',
                        'arguments': {
                            'order_id': configuration.instantBuyTown['order_id']
                        },
                        'town_id': configuration.town.id,
                        'nl_init': true
                    }, function (_0x385a61) {
                        if (_0x385a61.success) {
                            if (configuration.town.id === Game.townId)
                                for (var _0x27e1d8 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x5b4ca6 = 0; _0x27e1d8.length > _0x5b4ca6; _0x5b4ca6++) _0x27e1d8[_0x5b4ca6].getHandler().refresh();
                            Console.Log('<span style="color: #ffa03d;">' + configuration.instantBuyTown.building_name['capitalize']() + ' - ' + _0x385a61.success + '</span>', 0x3);
                        }
                        _0x385a61.error && Console.Log(configuration.town.name + ' ' + _0x385a61.error, 0x3), configuration.interval = setTimeout(function () {
                            configuration.instantBuyTown = false, configuration.startQueueing();
                        }, data.randomize(0x1f4, 0x2bc));
                    });
                }, data.randomize(0x3e8, 0x7d0)) : configuration.startQueueing();
            }
        }, {
            'key': 'startBuildUnits',
            'value': function (_0x158b9f, _0x5e4003) {
                if (!configuration.checkEnabled()) return false;
                if (void 0 !== _0x158b9f[configuration.town.id])
                    if (void 0 !== _0x158b9f[configuration.town.id]) {
                        var _0x30449e = _0x158b9f[configuration.town.id][0];
                        GameDataUnits.getMaxBuildForSingleUnit(_0x30449e.item_name) >= _0x30449e.count ? configuration.interval = setTimeout(function () {
                            game.building_barracks(configuration.town.id, {
                                'unit_id': _0x30449e.item_name,
                                'amount': _0x30449e.count,
                                'town_id': configuration.town.id,
                                'nl_init': true
                            }, function (_0x7fca57) {
                                if (_0x7fca57.error) Console.Log(configuration.town.name + ' ' + _0x7fca57.error, 0x3);
                                else {
                                    if (configuration.town.id === Game.townId)
                                        for (var _0xf20dc5 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x5ab8c3 = 0; _0xf20dc5.length > _0x5ab8c3; _0x5ab8c3++) _0xf20dc5[_0x5ab8c3].getHandler().refresh();
                                    Console.Log('<span style=\"color: ' + ('unit' === _0x5e4003 ? '#ffe03d' : '#3dadff') + ';">Units - ' + _0x30449e.count + ' ' + GameData.units[_0x30449e.item_name].name_plural + ' added.</span>', 0x3), game.Auth('removeItemQueue', {
                                        'player_id': data.Account.player_id,
                                        'world_id': data.Account['world_id'],
                                        'csrfToken': data.Account['csrfToken'],
                                        'town_id': configuration.town.id,
                                        'item_id': _0x30449e.id,
                                        'type': _0x5e4003
                                    }, configuration.callbackSaveUnits($('#unit_orders_queue .ui_various_orders'), _0x5e4003)), $('.queue_id_' + _0x30449e.id).remove();
                                }
                                configuration.finished();
                            });
                        }, data.randomize(0x3e8, 0x7d0)) : (Console.Log(configuration.town.name + ' recruiting ' + _0x30449e.count + ' ' + GameData.units[_0x30449e.item_name].name_plural + ' not ready.', 0x3), configuration.finished());
                    } else configuration.finished();
                else configuration.finished();
            }
        }, {
            'key': 'startBuildBuilding',
            'value': function () {
                if (!configuration.checkEnabled()) return false;
                void 0 !== configuration.building_queue[configuration.town.id] && configuration.building_queue[configuration.town.id] ? configuration.interval = setTimeout(function () {
                    Console.Log(configuration.town.name + ' getting building information.', 0x3), game.building_main(configuration.town.id, function (response) {
                        if (configuration.hasFreeBuildingSlots(response)) {
                            var first_building = configuration.building_queue[configuration.town.id][0];
                            if (void 0 !== first_building) {
                                var _0x40d77e = configuration.getBuildings(response)[first_building.item_name];
                                _0x40d77e.can_upgrade ? game.frontend_bridge(configuration.town.id, {
                                    'model_url': 'BuildingOrder',
                                    'action_name': 'buildUp',
                                    'arguments': {
                                        'building_id': first_building.item_name
                                    },
                                    'town_id': configuration.town.id,
                                    'nl_init': true
                                }, function (_0x3b1ab1) {
                                    if (_0x3b1ab1.success) {
                                        if (configuration.town.id === Game.townId)
                                            for (var _0x11ba7b = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0xc0e5db = 0; _0x11ba7b.length > _0xc0e5db; _0xc0e5db++) _0x11ba7b[_0xc0e5db].getHandler().refresh();
                                        Console.Log('<span style="color: #ffa03d;">' + first_building.item_name.capitalize() + ' - ' + _0x3b1ab1.success + '</span>', 0x3), game.Auth('removeItemQueue', {
                                            'player_id': data.Account.player_id,
                                            'world_id': data.Account.world_id,
                                            'csrfToken': data.Account.csrfToken,
                                            'town_id': configuration.town.id,
                                            'item_id': first_building.id,
                                            'type': 'building'
                                        }, configuration.callbackSaveBuilding($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders'))), $('.queue_id_' + first_building.id).remove();
                                    }
                                    _0x3b1ab1.error && Console.Log(configuration.town.name + ' ' + _0x3b1ab1.error, 0x3), configuration.finished();
                                }) : _0x40d77e.enough_population ? _0x40d77e.enough_resources ? (Console.Log(configuration.town['name'] + ' ' + first_building.item_name + ' can not be started due dependencies.', 0x3), game.Auth('removeItemQueue', {
                                    'player_id': data.Account.player_id,
                                    'world_id': data.Account.world_id,
                                    'csrfToken': data.Account.csrfToken,
                                    'town_id': configuration.town.id,
                                    'item_id': first_building.id,
                                    'type': 'building'
                                }, configuration.callbackSaveBuilding($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders'))), $('.queue_id_' + first_building.id).remove(), configuration.finished()) : (Console.Log(configuration.town.name + ' not enough resources for ' + first_building.item_name + '.', 0x3), configuration.finished()) : (Console.Log(configuration.town.name + ' not enough population for ' + first_building.item_name + '.', 0x3), configuration.finished());
                            } else configuration.finished();
                        } else Console.Log(configuration.town.name + ' no free building slots available.', 0x3), configuration.finished();
                    });
                }, data.randomize(0x3e8, 0x7d0)) : configuration.finished();
            }
        }, {
            'key': 'getReadyTime',
            'value': function (_0x4c0f00) {
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
                    ('building' === _0x3ecbc7 && void 0 !== configuration.building_queue[_0x4c0f00] || 'unit' === _0x3ecbc7 && void 0 !== configuration.units_queue[_0x4c0f00] || 'ship' === _0x3ecbc7 && void 0 !== configuration.ships_queue[_0x4c0f00]) && (_0x532788 = _0x3ecbc7);
                }), GameDataInstantBuy.isEnabled() && _0x574a96.building.queue.length > 0 && (_0x57c46c = _0x574a96.building.queue[0].model.getTimeLeft() - 0x12c), {
                    'readyTime': Timestamp.now() + (_0x57c46c > 0 ? _0x57c46c : +configuration.settings.timeinterval),
                    'shouldStart': _0x532788
                };
            }
        }, {
            'key': 'stop',
            'value': function () {
                clearInterval(configuration.interval);
            }
        }, {
            'key': 'checkEnabled',
            'value': function () {
                return jugador.modules.Autobuild['isOn'];
            }
        }, {
            'key': 'finished',
            'value': function () {
                if (!configuration.checkEnabled()) return false;
                configuration.town.modules['Autobuild'].isReadyTime = configuration.getReadyTime(configuration.town.id).readyTime, jugador.Queue['next']();
            }
        }, {
            'key': 'checkInstantComplete',
            'value': function (_0x3cbb07) {
                return configuration.instantBuyTown = false, $.each(MM.getOnlyCollectionByName('BuildingOrder').models, function (_0x5e206f, _0x30eeb4) {
                    if (_0x3cbb07 === _0x30eeb4.getTownId() && _0x30eeb4.getTimeLeft() < 0x12c) return configuration.instantBuyTown = {
                        'order_id': _0x30eeb4.id,
                        'building_name': _0x30eeb4.getBuildingId()
                    }, false;
                }), configuration.instantBuyTown;
            }
        }, {
            'key': 'checkBuildingDepencencies',
            'value': function (_0x30382c, _0x4d38f6) {
                var _0x5e4815 = GameData.buildings[_0x30382c].dependencies,
                    _0x3bafc3 = _0x4d38f6.getBuildings().getBuildings(),
                    _0x109f46 = [];
                return $.each(_0x5e4815, function (_0x4f4fb2, _0x367131) {
                    _0x3bafc3[_0x4f4fb2] < _0x367131 && _0x109f46.push({
                        'building_id': _0x4f4fb2,
                        'level': _0x367131
                    });
                }), _0x109f46;
            }
        }, {
            'key': 'callbackSaveBuilding',
            'value': function (_0x20f84c) {
                return function (_0x469af9) {
                    _0x20f84c.each(function () {
                        $(this).find('.empty_slot').remove(), _0x469af9.item ? ($(this).append(configuration.buildingElement($(this), _0x469af9.item)), configuration.setEmptyItems($(this))) : configuration.setEmptyItems($(this));
                    }), delete _0x469af9.item, configuration.building_queue = _0x469af9;
                };
            }
        }, {
            'key': 'callbackSaveSettings',
            'value': function () {
                Console.Log('Settings saved', 0x3), HumanMessage.success('The settings were saved!');
            }
        }, {
            'key': 'hasFreeBuildingSlots',
            'value': function (_0x1b896e) {
                var _0x3b2607 = false;
                return void 0 !== _0x1b896e && /BuildingMain\.full_queue = false;/g ['test'](_0x1b896e.html) && (_0x3b2607 = true), _0x3b2607;
            }
        }, {
            'key': 'getBuildings',
            'value': function (_0x2f35ec) {
                var _0x23122a = null;
                if (void 0 !== _0x2f35ec.html) {
                    var _0x33863e = _0x2f35ec.html.match(/BuildingMain\.buildings = (.*);/g);
                    void 0 !== _0x33863e[0] && (_0x23122a = JSON.parse(_0x33863e[0].substring(0x19, _0x33863e[0].length - 0x1)));
                }
                return _0x23122a;
            }
        }, {
            'key': 'initQueue',
            'value': function (_0x330ace, _0x1fcfd2) {
                var _0x1f0d83 = _0x330ace.find('.ui_various_orders');
                _0x1f0d83.find('.empty_slot').remove(), 'building' === _0x1fcfd2 && ($('#building_tasks_main').addClass('active'), void 0 !== configuration.building_queue[Game.townId] && $.each(configuration.building_queue[Game.townId], function (_0x17748a, _0x18f33b) {
                    _0x1f0d83.append(configuration.buildingElement(_0x1f0d83, _0x18f33b));
                })), 'unit' === _0x1fcfd2 && ($('#unit_orders_queue').addClass('active'), void 0 !== configuration.units_queue[Game.townId] && $.each(configuration.units_queue[Game.townId], function (_0x3d42e7, _0x50d168) {
                    _0x1f0d83.append(configuration.unitElement(_0x1f0d83, _0x50d168, _0x1fcfd2));
                })), 'ship' === _0x1fcfd2 && ($('#unit_orders_queue').addClass('active'), void 0 !== configuration.ships_queue[Game.townId] && $.each(configuration.ships_queue[Game.townId], function (_0x554efc, _0x25417c) {
                    _0x1f0d83.append(configuration.unitElement(_0x1f0d83, _0x25417c, _0x1fcfd2));
                })), configuration.setEmptyItems(_0x1f0d83), _0x1f0d83.parent().mousewheel(function (_0xa72ca6, _0x5cf784) {
                    this.scrollLeft -= 0x1e * _0x5cf784, _0xa72ca6.preventDefault();
                });
            }
        }, {
            'key': 'initUnitOrder',
            'value': function (_0x4a693e, _0x3444c7) {
                var _0x732846 = _0x4a693e.units[_0x4a693e.unit_id],
                    _0x34f802 = _0x4a693e.$el.find('#unit_order_confirm'),
                    _0x566952 = _0x4a693e.$el['find']('#unit_order_addqueue'),
                    _0x44539c = _0x4a693e.$el.find('#unit_order_slider');
                if (_0x566952.length >= 0 && (_0x732846.missing_building_dependencies.length >= 0x1 || _0x732846.missing_research_dependencies.length >= 0x1) && _0x566952.hide(), 0 === _0x732846.missing_building_dependencies.length && 0 === _0x732846.missing_research_dependencies.length) {
                    var _0x4a4fb5 = ITowns.towns[Game.townId],
                        _0x5c3e3a = _0x732846.max_build,
                        _0x34d4eb = Math.max.apply(this, [_0x732846.resources.wood, _0x732846.resources['stone'], _0x732846.resources['iron']]),
                        _0x1060a2 = [];
                    _0x1060a2.push(Math.floor(_0x4a4fb5.getStorage() / _0x34d4eb)), _0x1060a2.push(Math.floor((_0x4a4fb5.getAvailablePopulation() - configuration.checkPopulationBeingBuild()) / _0x732846.population)), _0x732846.favor > 0 && _0x1060a2.push(Math.floor(0x1f4 / _0x732846.favor));
                    var _0x43701c = Math.min.apply(this, _0x1060a2);
                    _0x43701c > 0 && _0x43701c >= _0x5c3e3a && _0x4a693e.slider.setMax(_0x43701c), 0 === _0x566952.length ? (_0x566952 = $('<a/>', {
                        'href': '#',
                        'id': 'unit_order_addqueue',
                        'class': 'confirm'
                    }), _0x34f802.after(_0x566952), _0x566952.mousePopup(new MousePopup('Add to reqruite queue')).on('click', function (_0x2efc67) {
                        _0x2efc67.preventDefault(), configuration.addUnitQueueItem(_0x732846, _0x3444c7);
                    })) : (_0x566952.unbind('click'), _0x566952.on('click', function (_0x245e5c) {
                        _0x245e5c.preventDefault(), configuration.addUnitQueueItem(_0x732846, _0x3444c7);
                    })), _0x43701c <= 0 ? _0x566952.hide() : _0x566952.show(), _0x34f802.show(), _0x44539c.slider({
                        'slide': function (_0x385572, _0x23b9ea) {
                            _0x23b9ea.value > _0x5c3e3a ? _0x34f802.hide() : _0x23b9ea.value >= 0 && _0x23b9ea.value <= _0x5c3e3a && _0x34f802.show(), 0 === _0x23b9ea.value ? _0x566952.hide() : _0x23b9ea.value > 0 && _0x43701c > 0 && _0x566952.show();
                        }
                    });
                }
            }
        }, {
            'key': 'checkBuildingLevel',
            'value': function (_0x231975) {
                console.log(_0x231975);
                var _0x47971a = ITowns.towns[Game.townId].getBuildings().attributes[_0x231975.item_name];
                return $.each(ITowns.towns[Game.townId].buildingOrders().models, function (_0x58774e, _0x4c2976) {
                    _0x4c2976.attributes.building_type === _0x231975.item_name && _0x47971a++;
                }), void 0 !== configuration.building_queue[Game.townId] && $(configuration.building_queue[Game.townId]).each(function (_0xf86fe5, _0x1570e7) {
                    if (_0x1570e7.id === _0x231975.id) return false;
                    _0x1570e7.item_name === _0x231975.item_name && _0x47971a++;
                }), ++_0x47971a;
            }
        }, {
            'key': 'checkPopulationBeingBuild',
            'value': function () {
                var _0x430413 = 0;
                return void 0 !== configuration.units_queue[Game.townId] && $(configuration.units_queue[Game.townId].unit).each(function (_0x212d15, _0x21b244) {
                    _0x430413 += _0x21b244.count * GameData.units[_0x21b244.item_name].population;
                }), void 0 !== configuration.ships_queue[Game.townId] && $(configuration.ships_queue[Game.townId].ship).each(function (_0x303cf8, _0x41857a) {
                    _0x430413 += _0x41857a.count * GameData.units[_0x41857a.item_name].population;
                }), _0x430413;
            }
        }, {
            'key': 'addUnitQueueItem',
            'value': function (_0x43803b, _0x4315d3) {
                game.Auth('addItemQueue', {
                    'player_id': data.Account.player_id,
                    'world_id': data.Account.world_id,
                    'csrfToken': data.Account.csrfToken,
                    'town_id': Game.townId,
                    'item_name': _0x43803b.id,
                    'type': _0x4315d3,
                    'count': UnitOrder.slider['getValue']()
                }, configuration.callbackSaveUnits($('#unit_orders_queue .ui_various_orders'), _0x4315d3));
            }
        }, {
            'key': 'callbackSaveUnits',
            'value': function (_0x177516, _0x2fb349) {
                return function (_0x54a3cd) {
                    console.log(_0x54a3cd), 'unit' === _0x2fb349 ? configuration.units_queue = _0x54a3cd : 'ship' === _0x2fb349 && (configuration.ships_queue = _0x54a3cd), _0x177516.each(function () {
                        $(this).find('.empty_slot').remove(), _0x54a3cd.item ? ($(this).append(configuration.unitElement($(this), _0x54a3cd.item, _0x2fb349)), configuration.setEmptyItems($(this)), delete _0x54a3cd.item) : configuration.setEmptyItems($(this)), UnitOrder.selectUnit(UnitOrder.unit_id);
                    });
                };
            }
        }, {
            'key': 'setEmptyItems',
            'value': function (_0x5e9851) {
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
            }
        }, {
            'key': 'buildingElement',
            'value': function (_0x55213c, _0xb2dc47) {
                return $('<div/>', {
                    'class': 'js-tutorial-queue-item queued_building_order last_order ' + _0xb2dc47.item_name + ' queue_id_' + _0xb2dc47.id
                }).append($('<div/>', {
                    'class': 'construction_queue_sprite frame'
                }).mousePopup(new MousePopup(_0xb2dc47.item_name.capitalize() + ' queued')).append($('<div/>', {
                    'class': 'item_icon building_icon40x40 js-item-icon build_queue ' + _0xb2dc47.item_name
                }).append($('<div/>', {
                    'class': 'building_level'
                }).append('<span class=\"construction_queue_sprite arrow_green_ver\"></span>' + configuration.checkBuildingLevel(_0xb2dc47))))).append($('<div/>', {
                    'class': 'btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue'
                }).on('click', function (_0x111cab) {
                    _0x111cab.preventDefault(), game.Auth('removeItemQueue', {
                        'player_id': data.Account['player_id'],
                        'world_id': data.Account.world_id,
                        'csrfToken': data.Account['csrfToken'],
                        'town_id': Game.townId,
                        'item_id': _0xb2dc47.id,
                        'type': 'building'
                    }, configuration.callbackSaveBuilding($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders'))), $('.queue_id_' + _0xb2dc47.id).remove();
                }).append($('<div/>', {
                    'class': 'left'
                })).append($('<div/>', {
                    'class': 'right'
                })).append($('<div/>', {
                    'class': 'caption js-caption'
                }).append($('<div/>', {
                    'class': 'effect js-effect'
                }))));
            }
        }, {
            'key': 'unitElement',
            'value': function (_0x23785b, _0x395850, _0x5182ae) {
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
                    _0x5a52ba.preventDefault(), game.Auth('removeItemQueue', {
                        'player_id': data.Account.player_id,
                        'world_id': data.Account['world_id'],
                        'csrfToken': data.Account.csrfToken,
                        'town_id': Game.townId,
                        'item_id': _0x395850.id,
                        'type': _0x5182ae
                    }, configuration.callbackSaveUnits($('#unit_orders_queue .ui_various_orders'), _0x5182ae)), $('.queue_id_' + _0x395850.id).remove();
                }).append($('<div/>', {
                    'class': 'left'
                })).append($('<div/>', {
                    'class': 'right'
                })).append($('<div/>', {
                    'class': 'caption js-caption'
                }).append($('<div/>', {
                    'class': 'effect js-effect'
                }))));
            }
        }, {
            'key': 'contentSettings',
            'value': function () {
                return $('<fieldset/>', {
                    'id': 'Autobuild_settings',
                    'class': jugador.hasPremium ? '' : 'disabled-box',
                    'style': 'float:left; width:472px; height: 270px;'
                }).append($('<legend/>').html('Autobuild Settings')).append(module_menu.checkbox({
                    'text': 'AutoStart Autobuild.',
                    'id': 'autobuild_autostart',
                    'name': 'autobuild_autostart',
                    'checked': configuration.settings.autostart
                })).append(module_menu.selectBox({
                    'id': 'autobuild_timeinterval',
                    'name': 'autobuild_timeinterval',
                    'label': 'Check every: ',
                    'styles': 'width: 120px;',
                    'value': configuration.settings.timeinterval,
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
                })).append(module_menu.checkbox({
                    'text': 'Enable building queue.',
                    'id': 'autobuild_building_enable',
                    'name': 'autobuild_building_enable',
                    'style': 'width: 100%;padding-top: 35px;',
                    'checked': configuration.settings.enable_building
                })).append(module_menu.checkbox({
                    'text': 'Enable barracks queue.',
                    'id': 'autobuild_barracks_enable',
                    'name': 'autobuild_barracks_enable',
                    'style': 'width: 100%;',
                    'checked': configuration.settings.enable_units
                })).append(module_menu.checkbox({
                    'text': 'Enable ships queue.',
                    'id': 'autobuild_ships_enable',
                    'name': 'autobuild_ships_enable',
                    'style': 'width: 100%;padding-bottom: 35px;',
                    'checked': configuration.settings.enable_ships
                })).append(function () {
                    var _0x54e89f = module_menu.button({
                        'name': DM.getl10n('notes').btn_save,
                        'style': 'top: 10px;',
                        'class': jugador.hasPremium ? '' : ' disabled'
                    }).on('click', function () {
                        if (!jugador.hasPremium) return false;
                        var _0x2a0611 = $('#Autobuild_settings').serializeObject();
                        configuration.settings.autostart = void 0 !== _0x2a0611.autobuild_autostart, configuration.settings['timeinterval'] = parseInt(_0x2a0611.autobuild_timeinterval), configuration.settings['autostart'] = void 0 !== _0x2a0611.autobuild_autostart, configuration.settings.enable_building = void 0 !== _0x2a0611.autobuild_building_enable, configuration.settings.enable_units = void 0 !== _0x2a0611.autobuild_barracks_enable, configuration.settings.enable_ships = void 0 !== _0x2a0611.autobuild_ships_enable, configuration.settings['instant_buy'] = void 0 !== _0x2a0611.autobuild_instant_buy, game.Auth('saveBuild', {
                            'player_id': data.Account.player_id,
                            'world_id': data.Account.world_id,
                            'csrfToken': data.Account.csrfToken,
                            'autobuild_settings': data.stringify(configuration.settings)
                        }, configuration.callbackSaveSettings);
                    });
                    return jugador.hasPremium || _0x54e89f.mousePopup(new MousePopup(jugador.requiredPrem)), _0x54e89f;
                });
            }
        }], (_0x19240a = null) && _0x5c35f3(_0x51aa45.prototype, _0x19240a), _0x221093 && _0x5c35f3(_0x51aa45, _0x221093), configuration;
    }();
    Object.defineProperty(configuration, 'settings', {
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
    }), Object.defineProperty(configuration, 'building_queue', {
        'enumerable': true,
        'writable': true,
        'value': {}
    }), Object.defineProperty(configuration, 'units_queue', {
        'enumerable': true,
        'writable': true,
        'value': {}
    }), Object.defineProperty(configuration, 'ships_queue', {
        'enumerable': true,
        'writable': true,
        'value': {}
    }), Object.defineProperty(configuration, 'town', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(configuration, 'iTown', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(configuration, 'interval', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(configuration, 'currentWindow', {
        'enumerable': true,
        'writable': true,
        'value': null
    }), Object.defineProperty(configuration, 'isCaptain', {
        'enumerable': true,
        'writable': true,
        'value': false
    }), Object.defineProperty(configuration, 'Queue', {
        'enumerable': true,
        'writable': true,
        'value': 0
    }), Object.defineProperty(configuration, 'ModuleManager', {
        'enumerable': true,
        'writable': true,
        'value': void 0
    }), Object.defineProperty(configuration, 'windows', {
        'enumerable': true,
        'writable': true,
        'value': {
            'wndId': null,
            'wndContent': null,
            'building_main_index': function () {
                if (GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd['TYPE_BUILDING'])) {
                    configuration.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd['TYPE_BUILDING']).getJQElement().find('.gpwindow_content');
                    var _0x5116c3 = configuration.currentWindow.find('#main_tasks h4');
                    _0x5116c3.html(_0x5116c3.html().replace(/\/.*\)/, '/&infin;)'));
                    var _0x3464ad = ['theater', 'thermal', 'library', 'lighthouse', 'tower', 'statue', 'oracle', 'trade_office'];
                    $.each($('#buildings .button_build.build_grey.build_up.small.bold'), function () {
                        var _0x148b01 = $(this).parent().parent().attr('id').replace('building_main_', '');
                        configuration.checkBuildingDepencencies(_0x148b01, ITowns.getTown(Game.townId)).length <= 0 && -0x1 === $.inArray(_0x148b01, _0x3464ad) && $(this).removeClass('build_grey').addClass('build').html('Add to queue').on('click', function (_0x342fa8) {
                            _0x342fa8.preventDefault(), game.Auth('addItemQueue', {
                                'player_id': data.Account.player_id,
                                'world_id': data.Account.world_id,
                                'csrfToken': data.Account['csrfToken'],
                                'town_id': Game.townId,
                                'item_name': _0x148b01,
                                'count': 0x1,
                                'type': 'building'
                            }, configuration.callbackSaveBuilding($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')));
                        });
                    });
                }
            },
            'building_barracks_index': function () {
                GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd['TYPE_BUILDING']) && (configuration.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING).getJQElement().find('.gpwindow_content'), configuration.currentWindow.find('#unit_orders_queue h4').find('.js-max-order-queue-count').html('&infin;'));
            }
        }
    }); */

    function _0x6823f(_0x3d07a6, _0x22b338) {
        for (var _0x395555 = 0; _0x395555 < _0x22b338.length; _0x395555++) {
            var _0x19b14f = _0x22b338[_0x395555];
            _0x19b14f.enumerable = _0x19b14f.enumerable || false, _0x19b14f.configurable = true, 'value' in _0x19b14f && (_0x19b14f.writable = true), Object.defineProperty(_0x3d07a6, _0x19b14f.key, _0x19b14f);
        }
    }
 /*    var jugador = function () {
        function _0x47b41a() {
            ! function (_0x23c12b, _0x4e1e79) {
                if (!(_0x23c12b instanceof _0x4e1e79)) throw new TypeError('Cannot call a class as a function');
            }(this, _0x47b41a);
        }
      
        var _0xc61fd5, _0x5e934f, _0x48ecbd;
        return _0xc61fd5 = _0x47b41a, _0x48ecbd = [{
            'key': 'init',
            'value': function () {
                _0x47b41a.loadPlayerTowns(), _0x47b41a.initButtons(), _0x47b41a.initTimer();
            }
        }, {
            'key': 'start',
            'value': function () {
                var _0x36c75b = false,
                    _0x497d31 = null;
                if ($.each(_0x47b41a.playerTowns, function (_0x3a949a, _0x5e32b2) {
                        var _0x5dfd05 = farms_manager.checkReady(_0x5e32b2);
                        true === _0x5dfd05 ? (_0x36c75b = true, _0x47b41a.Queue.add({
                            'townId': _0x5e32b2.id,
                            'fx': function () {
                                _0x5e32b2.startFarming();
                            }
                        })) : false !== _0x5dfd05 && (null == _0x497d31 || _0x5dfd05 < _0x497d31) && (_0x497d31 = _0x5dfd05);
                        var _0x1e0783 = _0x3e7923.checkReady(_0x5e32b2);
                        true === _0x1e0783 ? (_0x36c75b = true, _0x47b41a.Queue.add({
                            'townId': _0x5e32b2.id,
                            'fx': function () {
                                _0x5e32b2.startCulture();
                            }
                        })) : false !== _0x1e0783 && (null == _0x497d31 || _0x1e0783 < _0x497d31) && (_0x497d31 = _0x1e0783);
                        var _0x3dab92 = configuration.checkReady(_0x5e32b2);
                        true === _0x3dab92 ? (_0x36c75b = true, _0x47b41a.Queue.add({
                            'townId': _0x5e32b2.id,
                            'fx': function () {
                                _0x5e32b2.startBuild();
                            }
                        })) : false !== _0x3dab92 && (null == _0x497d31 || _0x3dab92 < _0x497d31) && (_0x497d31 = _0x3dab92);
                    }), null !== _0x497d31 || _0x36c75b)
                    if (_0x36c75b) _0x47b41a.Queue.start();
                    else {
                        var _0x360e83 = _0x497d31 - Timestamp.now() + 0xa;
                        _0x47b41a.startTimer(_0x360e83, function () {
                            _0x47b41a.start();
                        });
                    }
                else Console.Log('Nothing is ready yet!', 0), _0x47b41a.startTimer(0x1e, function () {
                    _0x47b41a.start();
                });
            }
        }, {
            stop () {
                clearInterval(_0x47b41a.interval), _0x47b41a.Queue.stop(), $('#time_autobot .caption .value_container .curr').html('Stopped');
            }
        }, {
            finished () {
                _0x47b41a.start();
            }
        }, {
            initTimer () {
                $('.nui_main_menu').css('top', '275px'), $('#time_autobot').append(module_menu.timerBoxSmall({
                    'id': 'Autofarm_timer',
                    'styles': '',
                    'text': 'Start Autobot'
                })).show();
            }
        }, {
            updateTimer (_0x17eb87, _0x273027) {
                var _0x4716cc = 0;
                _0x4716cc = void 0 !== _0x17eb87 && void 0 !== _0x273027 ? (_0x47b41a.Queue.total - (_0x47b41a.Queue.queue.length + 0x1) + _0x273027 / _0x17eb87) / _0x47b41a.Queue.total * 0x64 : (_0x47b41a.Queue.total - _0x47b41a.Queue.queue.length) / _0x47b41a.Queue.total * 0x64, isNaN(_0x4716cc) || ($('#time_autobot .progress .indicator').width(_0x4716cc + '%'), $('#time_autobot .caption .value_container .curr').html(Math.round(_0x4716cc) + '%'));
            }
        }, {
            checkAutostart () {
                if (farms_manager.settings.autostart) {
                    _0x47b41a.modules.Autofarm['isOn'] = true;
                    var _0x14943a = $('#Autofarm_onoff');
                    _0x14943a.addClass('on'), _0x14943a.find('span').mousePopup(new MousePopup('Stop Autofarm'));
                }
                if (_0x3e7923.settings['autostart']) {
                    _0x47b41a.modules['Autoculture'].isOn = true;
                    var _0xb1db21 = $('#Autoculture_onoff');
                    _0xb1db21.addClass('on'), _0xb1db21.find('span').mousePopup(new MousePopup('Stop Autoculture'));
                }
                if (configuration.settings['autostart']) {
                    _0x47b41a.modules.Autobuild.isOn = true;
                    var _0xe53eb6 = $('#Autobuild_onoff');
                    _0xe53eb6.addClass('on'), _0xe53eb6.find('span').mousePopup(new MousePopup('Stop Autobuild'));
                }(farms_manager.settings.autostart || _0x3e7923.settings.autostart || configuration.settings['autostart']) && _0x47b41a.start();
            }
        }, {
            'key': 'startTimer',
            'value': function (_0x127196, _0x227a94) {
                var _0x4dec49 = _0x127196;
                _0x47b41a.interval = setInterval(function () {
                    $('#time_autobot .caption .value_container .curr').html(data.toHHMMSS(_0x127196)), $('#time_autobot .progress .indicator').width((_0x4dec49 - _0x127196) / _0x4dec49 * 0x64 + '%'), --_0x127196 < 0 && (clearInterval(_0x47b41a.interval), _0x227a94());
                }, 0x3e8);
            }
        }, {
            initButtons(_0x89fea) {
                var _0x232241 = $('#' + _0x89fea + '_onoff');
                _0x232241.removeClass('disabled'), _0x232241.on('click', function (_0x3470ce) {
                    if (_0x3470ce.preventDefault(), 'Autoattack' === _0x89fea && !data.checkPremium('captain')) return HumanMessage.error(Game.premium_data.captain.name + ' ' + DM.getl10n('premium').advisors.not_activated['toLowerCase']() + '.'), false;
                    true === _0x47b41a.modules[_0x89fea].isOn ? (_0x47b41a.modules[_0x89fea].isOn = false, _0x232241.removeClass('on'), _0x232241.find('span').mousePopup(new MousePopup('Start ' + _0x89fea)), HumanMessage.success(_0x89fea + ' is deactivated.'), Console.Log(_0x89fea + ' is deactivated.', 0), 'Autofarm' === _0x89fea ? farms_manager.stop() : 'Autoculture' === _0x89fea ? _0x3e7923.stop() : 'Autobuild' === _0x89fea ? configuration.stop() : 'Autoattack' === _0x89fea && attack_manager.stop()) : false === _0x47b41a.modules[_0x89fea].isOn && (_0x232241.addClass('on'), HumanMessage.success(_0x89fea + ' is activated.'), Console.Log(_0x89fea + ' is activated.', 0), _0x232241.find('span').mousePopup(new MousePopup('Stop ' + _0x89fea)), _0x47b41a.modules[_0x89fea].isOn = true, 'Autoattack' === _0x89fea && attack_manager.start()), 'Autoattack' !== _0x89fea && _0x47b41a.checkWhatToStart();
                }), _0x232241.find('span').mousePopup(new MousePopup('Start ' + _0x89fea));
            }
        }, {
            checkWhatToStart () {
                var _0x335074 = 0;
                $.each(_0x47b41a.modules, function (_0x32c7a4, _0x3f5cd9) {
                    _0x3f5cd9.isOn && 'Autoattack' !== _0x3f5cd9 && _0x335074++;
                }), 0 === _0x335074 ? _0x47b41a.stop() : _0x335074 >= 0 && !_0x47b41a.Queue.isRunning() && (clearInterval(_0x47b41a.interval), _0x47b41a.start());
            }
        }, {
            loadPlayerTowns () {
                var _0xa8e110 = 0;
                $.each(ITowns.towns, function (_0x5d6913, _0xe12385) {
                    var _0x11009d = new _0x47b41a.models.Town();
                    _0x11009d.key = _0xa8e110, _0x11009d.id = _0xe12385.id, _0x11009d.name = _0xe12385.name, $.each(ITowns.towns, function (_0x4296f0, _0x46672c) {
                        _0xe12385.getIslandCoordinateX() === _0x46672c.getIslandCoordinateX() && _0xe12385.getIslandCoordinateY() === _0x46672c.getIslandCoordinateY() && _0xe12385.id !== _0x46672c.id && _0x11009d.relatedTowns['push'](_0x46672c.id);
                    }), _0x47b41a.playerTowns.push(_0x11009d), _0xa8e110++;
                }), _0x47b41a.playerTowns['sort'](function (_0x52161f, _0x570499) {
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
                data.trial_time - Timestamp.now() >= 0 || data.premium_time - Timestamp.now() >= 0 ? (_0x47b41a.hasPremium = true, _0x47b41a.init(), farms_manager.init(), farms_manager.setSettings(argumento.autofarm_settings), _0x3e7923.init(), _0x3e7923.setSettings(argumento.autoculture_settings), configuration.init(),
                 configuration.setSettings(argumento.autobuild_settings), configuration.setQueue(argumento.building_queue,
                     argumento.units_queue, argumento.ships_queue), attack_manager.init(), _0x47b41a.checkAutostart()) :
                      (_0x47b41a.hasPremium = false, _0x47b41a.init(), farms_manager.init(), $('#Autoculture_onoff').mousePopup(new MousePopup(_0x47b41a.requiredPrem)),
                       $('#Autobuild_onoff').mousePopup(new MousePopup(_0x47b41a.requiredPrem)), $('#Autoattack_onoff').mousePopup(new MousePopup(_0x47b41a.requiredPrem)),
                        data.createNotification('getPremiumNotification', 'Unfortunately your premium membership is over. Please upgrade now!'));
            }
        }], (_0x5e934f = null) && _0x6823f(_0xc61fd5.prototype, _0x5e934f), _0x48ecbd && _0x6823f(_0xc61fd5, _0x48ecbd), _0x47b41a;
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
                    configuration.startBuild(this);
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
    }); */


    function _0x1d5731(_0x43dcf7) {
        return (_0x1d5731 = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function (_0x2ee3d1) {
            return typeof _0x2ee3d1;
        } : function (_0x5cb6ee) {
            return _0x5cb6ee && 'function' == typeof Symbol && _0x5cb6ee.constructor === Symbol && _0x5cb6ee !== Symbol.prototype ? 'symbol' : typeof _0x5cb6ee;
        })(_0x43dcf7);
    }

    function _0x2c06f8(_0x27b697, _0x36d2ff) {
        for (var _0x49be36 = 0; _0x49be36 < _0x36d2ff.length; _0x49be36++) {
            var _0x53d09e = _0x36d2ff[_0x49be36];
            _0x53d09e.enumerable = _0x53d09e.enumerable || false, _0x53d09e.configurable = true, 'value' in _0x53d09e && (_0x53d09e.writable = true), Object.defineProperty(_0x27b697, _0x53d09e.key, _0x53d09e);
        }
    }
/*     var _0xe8350d = function () {
        function info() {
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
        }
        var _0x219ce3, _0x385f4a, _0x4a2a2f;
        return _0x219ce3 = info, _0x4a2a2f = [{
            'key': 'init',
            'value': function () {
                Console.Log('Initialize Autobot', 0), info.authenticate(), info.obServer(), info.isActive(), info.setToolbox(), info.initAjax(), info.initMapTownFeature(), info.fixMessage(), configurations.init();
            }
        }, {
            'key': 'setToolbox',
            'value': function () {
                info.toolbox_element = $('.nui_bot_toolbox');
            }
        }, {
            'key': 'authenticate',
            'value': function () {
                game.Auth('login', info.Account, jugador.callbackAuth);
            }
        }, {
            'key': 'obServer',
            'value': function () {
                $.Observer(GameEvents.notification.push).subscribe('GRCRTNotification', function () {
                    $('#notification_area>.notification.getPremiumNotification').on('click', function () {
                        info.getPremium();
                    });
                });
            }
        }, {
            'key': 'initWnd',
            'value': function () {
                if (info.isLogged) {
                    if (void 0 !== info.botWnd) {
                        try {
                            info.botWnd.close();
                        } catch (_0x481090) {}
                        info.botWnd = void 0;
                    }
                    if (void 0 !== info.botPremWnd) {
                        try {
                            info.botPremWnd.close();
                        } catch (_0x2df9e8) {}
                        info.botPremWnd = void 0;
                    }
                    info.botWnd = Layout.dialogWindow.open('', info.title + ' v<span style="font-size: 10px;">' + info.version + '</span>', 0x1f4, 0x15e, '', false), info.botWnd.setHeight([0x15e]), info.botWnd.setPosition(['center', 'center']);
                    var _0x2ecea2 = info.botWnd.getJQElement();
                    _0x2ecea2.append($('<div/>', {
                        'class': 'menu_wrapper',
                        'style': 'left: 78px; right: 14px'
                    }).append($('<ul/>', {
                        'class': 'menu_inner'
                    }).prepend(info.addMenuItem('AUTHORIZE', 'Account', 'Account')).prepend(info.addMenuItem('CONSOLE', 'Assistant', 'Assistant')).prepend(info.addMenuItem('ASSISTANT', 'Console', 'Console')).prepend(info.addMenuItem('SUPPORT', 'Support', 'Support')))), _0x2ecea2.find('.menu_inner li:last-child').before(info.addMenuItem('ATTACKMODULE', 'Attack', 'Autoattack')), _0x2ecea2.find('.menu_inner li:last-child').before(info.addMenuItem('CONSTRUCTMODULE', 'Build', 'Autobuild')), _0x2ecea2.find('.menu_inner li:last-child').before(info.addMenuItem('CULTUREMODULE', 'Culture', 'Autoculture')), _0x2ecea2.find('.menu_inner li:last-child').before(info.addMenuItem('FARMMODULE', 'Farm', 'Autofarm')), $('#Autobot-AUTHORIZE').click();
                }
            }
        }, {
            'key': 'addMenuItem',
            'value': function (_0x323aaf, _0x2a8beb, _0x321554, _0x9a8b2a) {
                return $('<li/>').append($('<a/>', {
                    'class': 'submenu_link',
                    'href': '#',
                    'id': 'Autobot-' + _0x323aaf,
                    'rel': _0x321554
                }).click(function () {
                    if (_0x9a8b2a) return false;
                    if (info.botWnd.getJQElement().find('li a.submenu_link').removeClass('active'), $(this).addClass('active'), info.botWnd.setContent2(info.getContent($(this).attr('rel'))), 'Console' === $(this).attr('rel')) {
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
            }
        }, {
            'key': 'getContent',
            'value': function (_0x4d0bfc) {
                return 'Console' === _0x4d0bfc ? Console.contentConsole() : 'Account' === _0x4d0bfc ? info.contentAccount() : 'Support' === _0x4d0bfc ? info.contentSupport() : 'Autofarm' === _0x4d0bfc ? farms_manager.contentSettings() : 'Autobuild' === _0x4d0bfc ? configuration.contentSettings() : 'Autoattack' === _0x4d0bfc ? attack_manager.contentSettings() : 'Autoculture' === _0x4d0bfc ? _0x3e7923.contentSettings() : 'Assistant' === _0x4d0bfc ? configurations.contentSettings() : void 0;
            }
        }, {
            'key': 'contentAccount',
            'value': function () {
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
                        }).html('Premium:')).append($('<td/>').append(info.premium_time - Timestamp.now() >= 0 ? info.secondsToTime(info.premium_time - Timestamp.now()) : 'No premium').append($('<div/>', {
                            'id': 'premium-bot'
                        }).append($('<div/>', {
                            'class': 'js-caption'
                        }).html(info.premium_time - Timestamp.now() >= 0 ? 'Add days' : 'Get Premium')).on('click', function () {
                            return info.getPremium();
                        })))), _0x3bb040.append($('<tr/>', {
                            'class': 'game_table_odd'
                        }).append($('<td/>', {
                            'style': 'background-color: #DFCCA6;width: 30%;'
                        }).html('Trial:')).append($('<td/>').append(function () {
                            return info.trial_time - Timestamp.now() >= 0 ? info.secondsToTime(info.trial_time - Timestamp.now()) : 'Trial is over';
                        }).append(function () {
                            return 0 === info.facebook_like ? $('<a/>', {
                                'id': 'get_7days'
                            }).html('Get 3 free days!').click('on', function () {
                                return info.botFacebookWnd();
                            }) : null;
                        }))), _0x3bb040;
                    });
                return module_menu.gameWrapper('Account', 'account_property_wrapper', _0x5298c8, 'margin-bottom:9px;').append($('<div/>', {
                    'id': 'grepobanner',
                    'style': ''
                }));
            }
        }, {
            'key': 'contentSupport',
            'value': function () {
                return $('<fieldset/>', {
                    'id': 'Support_tab',
                    'style': 'float:left; width:472px;height: 270px;'
                }).append($('<legend/>').html('Grepobot Support')).append($('<div/>', {
                    'style': 'float: left;'
                }).append(module_menu.selectBox({
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
                })).append(module_menu.input({
                    'id': 'support_input_email',
                    'name': 'Email',
                    'style': 'margin-left: 12px;width: 166px;',
                    'value': '',
                    'type': 'email'
                })).append(module_menu.input({
                    'id': 'support_input_subject',
                    'name': 'Subject',
                    'style': 'margin-top: 0;width: 166px;',
                    'value': '',
                    'type': 'text'
                })).append(module_menu.textarea({
                    'id': 'support_textarea',
                    'name': 'Message',
                    'value': ''
                })).append(module_menu.button({
                    'name': 'Send',
                    'style': 'margin-top: 0;'
                }).on('click', function () {
                    var _0x1531b8 = $('#Support_tab').serializeObject(),
                        _0x360978 = false;
                    void 0 === _0x1531b8.support_input_email || '' === _0x1531b8.support_input_email ? _0x360978 = 'Please enter your email.' : void 0 === _0x1531b8.support_input_subject || '' === _0x1531b8.support_input_subject ? _0x360978 = 'Please enter a subject.' : void 0 === _0x1531b8.support_textarea || '' === _0x1531b8.support_textarea ? _0x360978 = 'Please enter a message.' : void 0 === _0x1531b8.support_input_email || /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/ ['test'](_0x1531b8.support_input_email) || (_0x360978 = 'Your email is not valid!'), _0x360978 ? HumanMessage.error(_0x360978) : game.Auth('supportEmail', $.extend({
                        'csrfToken': info.Account.csrfToken,
                        'player_name': info.Account.player_name,
                        'player_id': info.Account['player_id'],
                        'world_id': info.Account.world_id
                    }, _0x1531b8), function (_0x5757b7) {
                        if (_0x5757b7.success) {
                            if (void 0 !== info.botWnd) {
                                try {
                                    info.botWnd.close();
                                } catch (_0xfee7fb) {}
                                info.botWnd = void 0;
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
            }
        }, {
            'key': 'checkAlliance',
            'value': function () {
                $('.allianceforum.main_menu_item').hasClass('disabled') || game.members_show(function (_0x23fa5a) {
                    void 0 !== _0x23fa5a.plain.html && $.each($(_0x23fa5a.plain.html).find('#ally_members_body .ally_name a'), function () {
                        var _0x161826 = atob($(this).attr('href'));
                        console.log(JSON.parse(_0x161826.substr(0, _0x161826.length - 0x3)));
                    });
                });
            }
        }, {
            'key': 'fixMessage',
            'value': function () {
                var _0x21d00b;
                HumanMessage._initialize = (_0x21d00b = HumanMessage._initialize, function () {
                    _0x21d00b.apply(this, arguments), $(window).unbind('click');
                });
            }
        }, {
            'key': 'getPremium',
            'value': function () {
                var _0x53133a = this;
                if (info.isLogged) {
                    if ($.Observer(GameEvents.menu.click).publish({
                            'option_id': 'premium'
                        }), void 0 !== info.botPremWnd) {
                        try {
                            info.botPremWnd['close']();
                        } catch (_0x7923ce) {}
                        info.botPremWnd = void 0;
                    }
                    if (void 0 !== info.botWnd) {
                        try {
                            info.botWnd.close();
                        } catch (_0x20b49d) {}
                        info.botWnd = void 0;
                    }
                    info.botPremWnd = Layout.dialogWindow.open('', 'Autobot v' + info.version + ' - Premium', 0x1f4, 0x15e, '', false), info.botPremWnd.setHeight([0x15e]), info.botPremWnd.setPosition(['center', 'center']);
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
                    info.botPremWnd['setContent2'](_0x2c9709), $('#time_options li').on('click', function () {
                        $('#time_options li').removeClass('active'), $(this).addClass('active');
                    }), game.PaymentOptions(function (_0x7b4639) {
                        _0x53133a.makeSelectbox(_0x7b4639);
                    });
                }
            }
        }, {
            'key': 'makeSelectbox',
            'value': function (_0x291a1e) {
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
                        return info.doPayment($('#time_options').children('.active').index() + 0x1, _0x27a71e);
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
                        return info.doPayment($('#time_options').children('.active').index() + 0x1, $(_0x473776).attr('rel'));
                    })), _0x91564a.val($(this).attr('rel')), _0x3c733a.hide();
                }), $(document).click(function () {
                    _0x5d44d5.removeClass('active'), _0x3c733a.hide();
                });
            }
        }, {
            'key': 'doPayment',
            'value': function (_0x16b1c1, _0x12a284) {
                window.open(info.domain + 'payment?option=' + _0x16b1c1 + '&method=' + _0x12a284 + '&player_id=' + info.Account.player_id, 'grepolis_payment', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,height=650,width=800');
            }
        }, {
            'key': 'botFacebookWnd',
            'value': function () {
                if (info.isLogged && 0 === info.facebook_like) {
                    if (void 0 !== info.facebookWnd) {
                        try {
                            info.facebookWnd['close']();
                        } catch (_0x4b7c28) {}
                        info.facebookWnd = void 0;
                    }
                    info.facebookWnd = Layout.dialogWindow.open('', 'Autobot v' + info.version + ' - Get 3 days free!', 0x113, 0x7d, '', false), info.facebookWnd['setHeight']([0x7d]), info.facebookWnd.setPosition(['center', 'center']);
                    var _0x331c0b = $('<div/>', {
                        'id': 'facebook_wnd'
                    }).append('<span class=\"like-share-text\">Like & share and get <b>3 days</b> free premium.</span><a href=\"#\" class=\"fb-share\"><span class=\"fb-text\">Share</spanclass></a><div class=\"fb_like\"><div class=\"fb-like\" data-href=\"https://www.facebook.com/BotForGrepolis/\" data-layout=\"button\" data-action=\"like\" data-show-faces=\"false\" data-share=\"false\"></div></div>');
                    info.facebookWnd.setContent2(_0x331c0b), $('.ui-dialog #facebook_wnd').closest('.gpwindow_content').css({
                        'left': '-9px',
                        'right': '-9px',
                        'top': '35px'
                    });
                    var _0x4a7adf = false,
                        _0x503fb1 = false,
                        _0x3b4791 = function () {
                            if ((_0x4a7adf || _0x503fb1) && info.upgrade3Days(), _0x4a7adf && _0x503fb1) {
                                if ($.Observer(GameEvents.window['quest'].open).publish({
                                        'quest_type': 'hermes'
                                    }), HumanMessage.success('You have received 3 days premium! Thank you for sharing.'), void 0 !== info.facebookWnd) {
                                    try {
                                        info.facebookWnd.close();
                                    } catch (_0x21e7fb) {}
                                    info.facebookWnd = void 0;
                                }
                                if (void 0 !== info.botWnd) {
                                    try {
                                        info.botWnd['close']();
                                    } catch (_0x40a9d3) {}
                                    info.botWnd = void 0;
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
            }
        }, {
            'key': 'upgrade3Days',
            'value': function () {
                game.Auth('upgrade3Days', info.Account, function (_0x3ff584) {
                    _0x3ff584.success && game.Auth('login', info.Account, jugador.callbackAuth);
                });
            }
        }, {
            'key': 'initAjax',
            'value': function () {
                $(document).ajaxComplete(function (_0x3d6089, _0xe31249, _0x350347) {
                    if (-0x1 === _0x350347.url.indexOf(info.domain) && -0x1 !== _0x350347.url.indexOf('/game/') && 0x4 === _0xe31249.readyState && 0xc8 === _0xe31249.status) {
                        var _0x5f0e8d = _0x350347.url.split('?'),
                            _0x40b631 = _0x5f0e8d[0].substr(0x6) + '/' + _0x5f0e8d[0x1].split('&')[0x1].substr(0x7);
                        void 0 !== configuration && configuration.calls(_0x40b631), void 0 !== attack_manager && attack_manager.calls(_0x40b631, _0xe31249.responseText);
                    }
                });
            }
        }, {
            'key': 'randomize',
            'value': function (_0x36621a, _0x2adc1a) {
                return Math.floor(Math.random() * (_0x2adc1a - _0x36621a + 0x1)) + _0x36621a;
            }
        }, {
            'key': 'secondsToTime',
            'value': function (_0x176cc5) {
                var _0x61918e = Math.floor(_0x176cc5 / 0x15180),
                    _0x2e8599 = Math.floor(_0x176cc5 % 0x15180 / 0xe10),
                    _0x5ab826 = Math.floor(_0x176cc5 % 0x15180 % 0xe10 / 0x3c);
                return (_0x61918e ? _0x61918e + ' days ' : '') + (_0x2e8599 ? _0x2e8599 + ' hours ' : '') + (_0x5ab826 ? _0x5ab826 + ' minutes ' : '');
            }
        }, {
            'key': 'timeToSeconds',
            'value': function (_0x35fa50) {
                for (var _0x2443da = _0x35fa50.split(':'), _0x29cd84 = 0, _0x46a45a = 0x1; _0x2443da.length > 0;) _0x29cd84 += _0x46a45a * parseInt(_0x2443da.pop(), 0xa), _0x46a45a *= 0x3c;
                return _0x29cd84;
            }
        }, {
            'key': 'arrowActivated',
            'value': function () {
                var _0x35c8ee = $('<div/>', {
                    'class': 'helpers helper_arrow group_quest d_w animate bounce',
                    'data-direction': 'w',
                    'style': 'top: 0; left: 360px; visibility: visible; display: none;'
                });
                info.toolbox_element.append(_0x35c8ee), _0x35c8ee.show().animate({
                    'left': '138px'
                }, 'slow').delay(0x2710).fadeOut('normal'), setTimeout(function () {
                    info.botFacebookWnd();
                }, 0x61a8);
            }
        }, {
            'key': 'createNotification',
            'value': function (_0x3b88e4, _0x55b45e) {
                (void 0 === Layout.notify ? new NotificationHandler() : Layout).notify($('#notification_area>.notification').length + 0x1, _0x3b88e4, '<span><b>Autobot</b></span>' + _0x55b45e + "<span class='small notification_date'>Version " + info.version + '</span>');
            }
        }, {
            'key': 'toHHMMSS',
            'value': function (_0x18192c) {
                var _0x2e6005 = ~~(_0x18192c / 0xe10),
                    _0x11954f = ~~(_0x18192c % 0xe10 / 0x3c),
                    _0x35b2a9 = _0x18192c % 0x3c,
                    _0x24f608 = '';
                return _0x2e6005 > 0 && (_0x24f608 += _0x2e6005 + ':' + (_0x11954f < 0xa ? '0' : '')), _0x24f608 += _0x11954f + ':' + (_0x35b2a9 < 0xa ? '0' : ''), _0x24f608 += '' + _0x35b2a9;
            }
        }, {
            'key': 'stringify',
            'value': function (_0x643b69) {
                var _0x29ee91 = _0x1d5731(_0x643b69);
                if ('string' === _0x29ee91) return '\"' + _0x643b69 + '\"';
                if ('boolean' === _0x29ee91 || 'number' === _0x29ee91) return _0x643b69;
                if ('function' === _0x29ee91) return _0x643b69.toString();
                var _0x5b2c4e = [];
                for (var _0x23725e in _0x643b69) _0x5b2c4e.push('\"' + _0x23725e + '\":' + this.stringify(_0x643b69[_0x23725e]));
                return '{' + _0x5b2c4e.join(',') + '}';
            }
        }, {
            'key': 'isActive',
            'value': function () {
                setTimeout(function () {
                    game.Auth('isActive', info.Account, info.isActive);
                }, 0xea60);
            }
        }, {
            'key': 'town_map_info',
            'value': function (_0x1eac95, _0x3eea4d) {
                if (void 0 !== _0x1eac95 && _0x1eac95.length > 0 && _0x3eea4d.player_name)
                    for (var _0xe74f66 = 0; _0xe74f66 < _0x1eac95.length; _0xe74f66++)
                        if ('flag town' === _0x1eac95[_0xe74f66].className) {
                            void 0 !== configurations && (configurations.settings.town_names && $(_0x1eac95[_0xe74f66]).addClass('active_town'), configurations.settings.player_name && $(_0x1eac95[_0xe74f66]).addClass('active_player'), configurations.settings.alliance_name && $(_0x1eac95[_0xe74f66]).addClass('active_alliance')), $(_0x1eac95[_0xe74f66]).append('<div class="player_name">' + (_0x3eea4d.player_name || '') + '</div>'), $(_0x1eac95[_0xe74f66]).append('<div class=\"town_name\">' + _0x3eea4d.name + '</div>'), $(_0x1eac95[_0xe74f66]).append('<div class=\"alliance_name\">' + (_0x3eea4d.alliance_name || '') + '</div>');
                            break;
                        } return _0x1eac95;
            }
        }, {
            'key': 'checkPremium',
            'value': function (_0x559a7a) {
                return $('.advisor_frame.' + _0x559a7a + ' div').hasClass(_0x559a7a + '_active');
            }
        }, {
            'key': 'initWindow',
            'value': function () {
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
                    info.isLogged && info.initWnd();
                }).mousePopup(new MousePopup(DM.getl10n('COMMON').main_menu.settings)))))).append($('<div/>', {
                    'id': 'time_autobot',
                    'class': 'time_row'
                })).append($('<div/>', {
                    'class': 'bottom'
                })).insertAfter('.nui_left_box');
            }
        }, {
            'key': 'initMapTownFeature',
            'value': function () {
                var _0x362cfc;
                MapTiles.createTownDiv = (_0x362cfc = MapTiles.createTownDiv, function () {
                    var _0x18ba43 = _0x362cfc.apply(this, arguments);
                    return info.town_map_info(_0x18ba43, arguments[0]);
                });
            }
        }], (_0x385f4a = null) && _0x2c06f8(_0x219ce3.prototype, _0x385f4a), _0x4a2a2f && _0x2c06f8(_0x219ce3, _0x4a2a2f), info;
    }();
    Object.defineProperty(_0xe8350d, 'title', {
            'enumerable': true,
            'writable': true,
            'value': 'Autobot'
        }), Object.defineProperty(_0xe8350d, 'version', {
            'enumerable': true,
            'writable': true,
            'value': '4.0'
        }), Object.defineProperty(_0xe8350d, 'domain', {
            'enumerable': true,
            'writable': true,
            'value': 'https://bot.grepobot.com/'
        }), Object.defineProperty(_0xe8350d, 'botWnd', {
            'enumerable': true,
            'writable': true,
            'value': ''
        }), Object.defineProperty(_0xe8350d, 'botPremWnd', {
            'enumerable': true,
            'writable': true,
            'value': ''
        }), Object.defineProperty(_0xe8350d, 'botEmailWnd', {
            'enumerable': true,
            'writable': true,
            'value': ''
        }), Object.defineProperty(_0xe8350d, 'facebookWnd', {
            'enumerable': true,
            'writable': true,
            'value': ''
        }), Object.defineProperty(_0xe8350d, 'isLogged', {
            'enumerable': true,
            'writable': true,
            'value': false
        }), Object.defineProperty(_0xe8350d, 'Account', {
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
                void 0 !== window.$ && $('.nui_main_menu').length && !$.isEmptyObject(ITowns.towns) && (clearInterval(_0x3aaef2), _0xe8350d.initWindow(), _0xe8350d.initMapTownFeature(), _0xe8350d.init());
            }, 0x64);
        }();
    var data = _0x59fe65.default = _0xe8350d;
}]); */