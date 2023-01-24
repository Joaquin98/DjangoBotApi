! function(_0xaf9f60) {
    var _0x5ca742 = {};

    function _0x16f3a2(_0x20d533) {
        if (_0x5ca742[_0x20d533]) return _0x5ca742[_0x20d533].exports;
        var _0x22f4d7 = _0x5ca742[_0x20d533] = {
            i: _0x20d533,
            l: false,
            exports: {}
        };
        return _0xaf9f60[_0x20d533].call(_0x22f4d7.exports, _0x22f4d7, _0x22f4d7.exports, _0x16f3a2), _0x22f4d7.l = true, _0x22f4d7.exports;
    }
    _0x16f3a2.m = _0xaf9f60, _0x16f3a2.c = _0x5ca742, _0x16f3a2.d = function(_0x30a23f, _0x147f41, _0x40d065) {
        _0x16f3a2.o(_0x30a23f, _0x147f41) || Object.defineProperty(_0x30a23f, _0x147f41, {
            enumerable: true,
            get: _0x40d065
        });
    }, _0x16f3a2.r = function(_0x107f7d) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(_0x107f7d, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(_0x107f7d, "__esModule", {
            value: true
        });
    }, _0x16f3a2.t = function(_0xd77727, _0x17c276) {
        if (1 & _0x17c276 && (_0xd77727 = _0x16f3a2(_0xd77727)), 8 & _0x17c276) return _0xd77727;
        if (4 & _0x17c276 && "object" == typeof _0xd77727 && _0xd77727 && _0xd77727.__esModule) return _0xd77727;
        var _0x3d0861 = Object.create(null);
        if (_0x16f3a2.r(_0x3d0861), Object.defineProperty(_0x3d0861, "default", {
                enumerable: true,
                value: _0xd77727
            }), 2 & _0x17c276 && "string" != typeof _0xd77727)
            for (var _0x554c0a in _0xd77727) _0x16f3a2.d(_0x3d0861, _0x554c0a, function(_0x31637a) {
                return _0xd77727[_0x31637a];
            }.bind(null, _0x554c0a));
        return _0x3d0861;
    }, _0x16f3a2.n = function(_0x21dc2d) {
        var _0x44491a = _0x21dc2d && _0x21dc2d.__esModule ? function() {
            return _0x21dc2d.default;
        } : function() {
            return _0x21dc2d;
        };
        return _0x16f3a2.d(_0x44491a, "a", _0x44491a), _0x44491a;
    }, _0x16f3a2.o = function(_0x3f4696, _0x8e5014) {
        return Object.prototype.hasOwnProperty.call(_0x3f4696, _0x8e5014);
    }, _0x16f3a2.p = "/", _0x16f3a2(_0x16f3a2.s = 0);
}([function(_0x4d75f9, _0x3d3c2b, _0x3e25d1) {
    "use strict";

    function _0x1114a5(_0x36d596, _0x597d4f) {
        for (var _0x323a43 = 0; _0x323a43 < _0x597d4f.length; _0x323a43++) {
            var _0x4ebb14 = _0x597d4f[_0x323a43];
            _0x4ebb14.enumerable = _0x4ebb14.enumerable || false, _0x4ebb14.configurable = true, "value" in _0x4ebb14 && (_0x4ebb14.writable = true), Object.defineProperty(_0x36d596, _0x4ebb14.key, _0x4ebb14);
        }
    }
    _0x3e25d1.r(_0x3d3c2b);

    var api_object = function() {
        function _0x577c94() {
            ! function(_0x5cbb90, _0x49ac32) {
                if (!(_0x5cbb90 instanceof _0x49ac32)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x577c94);
        }
        var _0xdc3a38, _0x3083d9, _0x339547;
        return _0xdc3a38 = _0x577c94, _0x339547 = [{
            key: "Auth",
            value: function(action, new_data, _0x58932f) {
                $.ajax({
                    method: "POST",
                    jsonpCallback: _0x58932f,
                    url: autobot_object.domain + "api",
                    dataType: "json",
                    data: $.extend({
                        action: action
                    }, new_data),
                    success: function(_0x2aa784) {
                        _0x58932f(_0x2aa784);
                    }
                });
            }
        }, {
            key: "PaymentOptions",
            value: function(callback) {
                $.ajax({
                    method: "GET",
                    url: autobot_object.domain + "paymentOptions",
                    dataType: "json",
                    success: function(_0x407ce5) {
                        callback(_0x407ce5);
                    }
                });
            }
        }, {
            key: "default_handler",
            value: function(callback, _0x152121) {
                return function(_0x2e5598) {
                    _0x152121 = void 0 !== _0x152121;
                    var _0x1bb204 = _0x2e5598.json;
                    return _0x1bb204.redirect ? (window.location.href = _0x1bb204.redirect, void delete _0x1bb204.redirect) : _0x1bb204.maintenance ? MaintenanceWindowFactory.openMaintenanceWindow(_0x1bb204.maintenance) : (_0x1bb204.notifications && NotificationLoader && (NotificationLoader.recvNotifyData(_0x1bb204, "data"), delete _0x1bb204.notifications, delete _0x1bb204.next_fetch_in), callback(_0x152121 ? _0x2e5598 : _0x1bb204));
                };
            }
        }, {
            key: "game_data",
            value: function(town_id, callback) {
                var url, data;
                url = window.location.protocol + "//" + document.domain + "/game/data?" + $.param({
                    town_id: town_id,
                    action: "get",
                    h: Game.csrfToken
                }), data = {
                    json: JSON.stringify({
                        types: [{
                            type: "map",
                            param: {
                                x: 0,
                                y: 0
                            }
                        }, {
                            type: "bar"
                        }, {
                            type: "backbone"
                        }],
                        town_id: town_id,
                        nl_init: false
                    })
                }, $.ajax({
                    url: url,
                    data: data,
                    method: "POST",
                    dataType: "json",
                    success: _0x577c94.default_handler(callback)
                });
            }
        }, {
            key: "switch_town",
            value: function(town_id, callback) {
                var _0x5175f9;
                _0x5175f9 = window.location.protocol + "//" + document.domain + "/game/index?" + $.param({
                    town_id: town_id,
                    action: "switch_town",
                    h: Game.csrfToken
                }), $.ajax({
                    url: _0x5175f9,
                    method: "GET",
                    dataType: "json",
                    success: _0x577c94.default_handler(callback)
                });
            }
        }, {
            key: "claim_load",
            value: function(town_id, claim_type, time, target_id, callback) {
                var url, data;
                url = window.location.protocol + "//" + document.domain + "/game/farm_town_info?" + $.param({
                    town_id: town_id,
                    action: "claim_load",
                    h: Game.csrfToken
                }), data = {
                    json: JSON.stringify({
                        target_id: target_id,
                        claim_type: claim_type,
                        time: time,
                        town_id: town_id,
                        nl_init: true
                    })
                }, $.ajax({
                    url: url,
                    data: data,
                    method: "POST",
                    dataType: "json",
                    success: _0x577c94.default_handler(callback)
                });
            }
        }, {
            key: "farm_town_overviews",
            value: function(town_id, callback) {
                var url, data;
                data = {
                    town_id: Game.townId,
                    action: "get_farm_towns_for_town",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        island_x: ITowns.towns[town_id].getIslandCoordinateX(),
                        island_y: ITowns.towns[town_id].getIslandCoordinateY(),
                        current_town_id: town_id,
                        booty_researched: !!ITowns.towns[town_id].researches().attributes.booty || "",
                        diplomacy_researched: !!ITowns.towns[town_id].researches().attributes.diplomacy || "",
                        itrade_office: ITowns.towns[town_id].buildings().attributes.trade_office,
                        town_id: Game.townId,
                        nl_init: true
                    })
                }, url = window.location.protocol + "//" + document.domain + "/game/farm_town_overviews", $.ajax({
                    url: url,
                    data: data,
                    method: "GET",
                    dataType: "json",
                    success: _0x577c94.default_handler(callback)
                });
            }
        }, {
            key: "claim_loads",
            value: function(_0x51167d, _0x47a6bb, _0xf97aaf, _0x5c76b5, _0xa902af) {
                var _0x584a6f, _0x3fbcb6 = window.location.protocol + "//" + document.domain + "/game/farm_town_overviews?" + $.param({
                    town_id: Game.townId,
                    action: "claim_loads",
                    h: Game.csrfToken
                });
                _0x584a6f = {
                    json: JSON.stringify({
                        farm_town_ids: _0x47a6bb,
                        time_option: _0x5c76b5,
                        claim_factor: _0xf97aaf,
                        current_town_id: _0x51167d,
                        town_id: Game.townId,
                        nl_init: true
                    })
                }, $.ajax({
                    url: _0x3fbcb6,
                    data: _0x584a6f,
                    method: "POST",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0xa902af)
                });
            }
        }, {
            key: "building_place",
            value: function(_0x1a2bc9, _0x25dab0) {
                var _0xa32651, _0x23be9d, _0x4c6c7 = _0x1a2bc9;
                _0x23be9d = {
                    town_id: _0x4c6c7,
                    action: "culture",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        town_id: _0x4c6c7,
                        nl_init: true
                    })
                }, _0xa32651 = window.location.protocol + "//" + document.domain + "/game/building_place", $.ajax({
                    url: _0xa32651,
                    data: _0x23be9d,
                    method: "GET",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x25dab0, true)
                });
            }
        }, {
            key: "building_main",
            value: function(_0x22b5ac, _0x2eed12) {
                var _0x3d328f, _0x4f59d5, _0x2f50d6 = _0x22b5ac;
                _0x4f59d5 = {
                    town_id: _0x2f50d6,
                    action: "index",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        town_id: _0x2f50d6,
                        nl_init: true
                    })
                }, _0x3d328f = window.location.protocol + "//" + document.domain + "/game/building_main", $.ajax({
                    url: _0x3d328f,
                    data: _0x4f59d5,
                    method: "GET",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x2eed12)
                });
            }
        }, {
            key: "start_celebration",
            value: function(_0xc7df6f, _0x2393a3, _0x1003a9) {
                var _0x46ad5b, _0xd10910 = window.location.protocol + "//" + document.domain + "/game/building_place?" + $.param({
                    town_id: _0xc7df6f,
                    action: "start_celebration",
                    h: Game.csrfToken
                });
                _0x46ad5b = {
                    json: JSON.stringify({
                        celebration_type: _0x2393a3,
                        town_id: _0xc7df6f,
                        nl_init: true
                    })
                }, $.ajax({
                    url: _0xd10910,
                    data: _0x46ad5b,
                    method: "POST",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x1003a9, true)
                });
            }
        }, {
            key: "email_validation",
            value: function(_0x4450db) {
                var _0x4e002e = {
                        town_id: Game.townId,
                        action: "email_validation",
                        h: Game.csrfToken,
                        json: JSON.stringify({
                            town_id: Game.townId,
                            nl_init: true
                        })
                    },
                    _0x565046 = window.location.protocol + "//" + document.domain + "/game/player";
                $.ajax({
                    url: _0x565046,
                    data: _0x4e002e,
                    method: "GET",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x4450db, true)
                });
            }
        }, {
            key: "members_show",
            value: function(_0x464075) {
                var _0x3a1d0e = {
                        town_id: Game.townId,
                        action: "members_show",
                        h: Game.csrfToken,
                        json: JSON.stringify({
                            town_id: Game.townId,
                            nl_init: true
                        })
                    },
                    _0x513e36 = window.location.protocol + "//" + document.domain + "/game/alliance";
                $.ajax({
                    url: _0x513e36,
                    data: _0x3a1d0e,
                    method: "GET",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x464075)
                });
            }
        }, {
            key: "login_to_game_world",
            value: function(_0x242393) {
                $.redirect(window.location.protocol + "//" + document.domain + "/start?" + $.param({
                    action: "login_to_game_world"
                }), {
                    world: _0x242393,
                    facebook_session: "",
                    facebook_login: "",
                    portal_sid: "",
                    name: "",
                    password: ""
                });
            }
        }, {
            key: "frontend_bridge",
            value: function(_0x173ff1, _0x150788, _0x563751) {
                var _0x46ce3e = window.location.protocol + "//" + document.domain + "/game/frontend_bridge?" + $.param({
                        town_id: _0x173ff1,
                        action: "execute",
                        h: Game.csrfToken
                    }),
                    _0x8bbf7a = {
                        json: JSON.stringify(_0x150788)
                    };
                $.ajax({
                    url: _0x46ce3e,
                    data: _0x8bbf7a,
                    method: "POST",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x563751)
                });
            }
        }, {
            key: "building_barracks",
            value: function(_0x455bf8, _0x992d22, _0x59a081) {
                var _0x7936b = window.location.protocol + "//" + document.domain + "/game/building_barracks?" + $.param({
                        town_id: _0x455bf8,
                        action: "build",
                        h: Game.csrfToken
                    }),
                    _0x1eaac4 = {
                        json: JSON.stringify(_0x992d22)
                    };
                $.ajax({
                    url: _0x7936b,
                    data: _0x1eaac4,
                    method: "POST",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x59a081)
                });
            }
        }, {
            key: "attack_planner",
            value: function(_0x1498d1, _0x458bc2) {
                var _0x19aeab, _0x885ca8, _0x521ea3 = _0x1498d1;
                _0x885ca8 = {
                    town_id: _0x521ea3,
                    action: "attacks",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        town_id: _0x521ea3,
                        nl_init: true
                    })
                }, _0x19aeab = window.location.protocol + "//" + document.domain + "/game/attack_planer", $.ajax({
                    url: _0x19aeab,
                    data: _0x885ca8,
                    method: "GET",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x458bc2)
                });
            }
        }, {
            key: "town_info_attack",
            value: function(_0xf90471, _0x24e029, _0x2105f5) {
                var _0x5f30ae, _0x4ed5f7;
                _0x4ed5f7 = {
                    town_id: _0xf90471,
                    action: "attack",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        id: _0x24e029.target_id,
                        nl_init: true,
                        origin_town_id: _0x24e029.town_id,
                        preselect: true,
                        preselect_units: _0x24e029.units,
                        town_id: Game.townId
                    })
                }, _0x5f30ae = window.location.protocol + "//" + document.domain + "/game/town_info", $.ajax({
                    url: _0x5f30ae,
                    data: _0x4ed5f7,
                    method: "GET",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x2105f5)
                });
            }
        }, {
            key: "send_units",
            value: function(_0x54e6aa, _0x4f54e9, _0x18bc40, _0x4cf475, _0x5b49b8) {
                var _0x17e902 = window.location.protocol + "//" + document.domain + "/game/town_info?" + $.param({
                        town_id: _0x54e6aa,
                        action: "send_units",
                        h: Game.csrfToken
                    }),
                    _0x3422ef = {
                        json: JSON.stringify($.extend({
                            id: _0x18bc40,
                            type: _0x4f54e9,
                            town_id: _0x54e6aa,
                            nl_init: true
                        }, _0x4cf475))
                    };
                $.ajax({
                    url: _0x17e902,
                    data: _0x3422ef,
                    method: "POST",
                    dataType: "json",
                    success: _0x577c94.default_handler(_0x5b49b8)
                });
            }
        }], (_0x3083d9 = null) && _0x1114a5(_0xdc3a38.prototype, _0x3083d9), _0x339547 && _0x1114a5(_0xdc3a38, _0x339547), _0x577c94;
    }();

    function list_to_object(variable, list) {
        for (var i = 0; i < list.length; i++) {
            var element = list[i];
            element.enumerable = element.enumerable || false, element.configurable = true, "value" in element && (element.writable = true), 
            Object.defineProperty(variable, element.key, element);
        }
    }
    var console_object = function() {
        function _0x20c748() {
            ! function(_0x3aed6a, _0x587a23) {
                if (!(_0x3aed6a instanceof _0x587a23)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x20c748);
        }
        var obj = [{
            key: "contentConsole",
            value: function() {
                var _0x4de3b6 = $("<fieldset/>", {
                        style: "float:left; width:472px;"
                    }).append($("<legend/>").html("Autobot Console")).append($("<div/>", {
                        class: "terminal"
                    }).append($("<div/>", {
                        class: "terminal-output"
                    })).scroll(function() {
                        _0x20c748.LogScrollBottom();
                    })),
                    _0x5bb9f8 = _0x4de3b6.find(".terminal-output");
                return $.each(_0x20c748.Logs, function(_0x5773cf, _0x1dd55b) {
                    _0x5bb9f8.append(_0x1dd55b);
                }), _0x4de3b6;
            }
        }, {
            key: "Log",
            value: function(_0x3944c8, _0x4650e0) {
                function _0x3ffdb8(_0x2427fa) {
                    return _0x2427fa < 10 ? "0" + _0x2427fa : _0x2427fa;
                }
                this.Logs.length >= 500 && this.Logs.shift();
                var _0x45e1f8 = new Date,
                    _0x2e0345 = _0x3ffdb8(_0x45e1f8.getHours()) + ":" + _0x3ffdb8(_0x45e1f8.getMinutes()) + ":" + _0x3ffdb8(_0x45e1f8.getSeconds()),
                    _0x544b5d = $("<div/>").append($("<div/>", {
                        style: "width: 100%;"
                    }).html(_0x2e0345 + " - [" + _0x20c748.Types[_0x4650e0] + "]: " + _0x3944c8));
                this.Logs.push(_0x544b5d);
                var _0x59b8ec = $(".terminal-output");
                if (_0x59b8ec.length && (_0x59b8ec.append(_0x544b5d), this.scrollUpdate)) {
                    var _0x385103 = $(".terminal"),
                        _0x324bf3 = $(".terminal-output")[0].scrollHeight;
                    _0x385103.scrollTop(_0x324bf3);
                }
            }
        }, {
            key: "LogScrollBottom",
            value: function() {
                clearInterval(this.scrollInterval);
                var _0x232675 = $(".terminal"),
                    _0x355249 = $(".terminal-output");
                this.scrollUpdate = _0x232675.scrollTop() + _0x232675.height() === _0x355249.height();
                var _0x2dbef4 = _0x355249[0].scrollHeight;
                this.scrollInterval = setInterval(function() {
                    _0x232675.scrollTop(_0x2dbef4);
                }, 7e3);
            }
        }];
        list_to_object(_0x20c748, obj);
        return _0x20c748;
    }();
    Object.defineProperty(console_object, "Logs", {
        enumerable: true,
        writable: true,
        value: []
    }), Object.defineProperty(console_object, "Types", {
        enumerable: true,
        writable: true,
        value: ["Autobot", "Farming", "Culture", "Builder", "Attack "]
    }), Object.defineProperty(console_object, "scrollInterval", {
        enumerable: true,
        writable: true,
        value: ""
    }), Object.defineProperty(console_object, "scrollUpdate", {
        enumerable: true,
        writable: true,
        value: true
    });

    function _0x5d260c(_0x188423, _0xff6441) {
        for (var _0x2e84d7 = 0; _0x2e84d7 < _0xff6441.length; _0x2e84d7++) {
            var _0x2fb7e3 = _0xff6441[_0x2e84d7];
            _0x2fb7e3.enumerable = _0x2fb7e3.enumerable || false, _0x2fb7e3.configurable = true, "value" in _0x2fb7e3 && (_0x2fb7e3.writable = true), Object.defineProperty(_0x188423, _0x2fb7e3.key, _0x2fb7e3);
        }
    }
    var menu_object = function() {
        function _0x46a95f() {
            ! function(_0x11f15c, _0x41d18e) {
                if (!(_0x11f15c instanceof _0x41d18e)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x46a95f);
        }
        var _0x3b42d1, _0x1a1291, _0x3188e8;
        return _0x3b42d1 = _0x46a95f, _0x3188e8 = [{
            key: "button",
            value: function(_0x4ea1bb) {
                return $("<div/>").append($("<a/>", {
                    class: "button_new" + (_0x4ea1bb.class || ""),
                    href: "#",
                    style: "margin-top:1px;float:left;" + (_0x4ea1bb.style || "")
                }).append($("<span/>", {
                    class: "left"
                })).append($("<span/>", {
                    class: "right"
                })).append($("<div/>", {
                    class: "caption js-caption"
                }).text(_0x4ea1bb.name)));
            }
        }, {
            key: "checkbox",
            value: function(_0xaf779e, _0x267d18, _0x59b55f) {
                return $("<div/>", {
                    class: "checkbox_new" + (_0xaf779e.checked ? " checked" : "") + (_0xaf779e.disabled ? " disabled" : ""),
                    style: "padding: 5px;" + (_0xaf779e.style || "")
                }).append($("<input/>", {
                    type: "checkbox",
                    name: _0xaf779e.name,
                    id: _0xaf779e.id,
                    checked: _0xaf779e.checked,
                    style: "display: none;"
                })).append($("<div/>", {
                    class: "cbx_icon",
                    rel: _0xaf779e.name
                })).append($("<div/>", {
                    class: "cbx_caption"
                }).text(_0xaf779e.text)).bind("click", function() {
                    $(this).toggleClass("checked"), $(this).find($('input[type="checkbox"]')).prop("checked", $(this).hasClass("checked")), $(this).hasClass("checked") ? void 0 !== _0x267d18 && _0x267d18() : void 0 !== _0x59b55f && _0x59b55f();
                });
            }
        }, {
            key: "input",
            value: function(_0x1ef000) {
                return $("<div/>", {
                    style: "padding: 5px;"
                }).append($("<label/>", {
                    for: _0x1ef000.id
                }).text(_0x1ef000.name + ": ")).append($("<div/>", {
                    class: "textbox",
                    style: _0x1ef000.style
                }).append($("<div/>", {
                    class: "left"
                })).append($("<div/>", {
                    class: "right"
                })).append($("<div/>", {
                    class: "middle"
                }).append($("<div/>", {
                    class: "ie7fix"
                }).append($("<input/>", {
                    type: _0x1ef000.type,
                    tabindex: "1",
                    id: _0x1ef000.id,
                    name: _0x1ef000.id,
                    value: _0x1ef000.value
                }).attr("size", _0x1ef000.size)))));
            }
        }, {
            key: "textarea",
            value: function(_0x12d840) {
                return $("<div/>", {
                    style: "padding: 5px;"
                }).append($("<label/>", {
                    for: _0x12d840.id
                }).text(_0x12d840.name + ": ")).append($("<div/>").append($("<textarea/>", {
                    name: _0x12d840.id,
                    id: _0x12d840.id
                })));
            }
        }, {
            key: "inputMinMax",
            value: function(_0x48226a) {
                return $("<div/>", {
                    class: "textbox"
                }).append($("<span/>", {
                    class: "grcrt_spinner_btn grcrt_spinner_down",
                    rel: _0x48226a.name
                }).click(function() {
                    var _0x4d6eec = $(this).parent().find("#" + $(this).attr("rel"));
                    parseInt($(_0x4d6eec).attr("min")) < parseInt($(_0x4d6eec).attr("value")) && $(_0x4d6eec).attr("value", parseInt($(_0x4d6eec).attr("value")) - 1);
                })).append($("<div/>", {
                    class: "textbox",
                    style: _0x48226a.style
                }).append($("<div/>", {
                    class: "left"
                })).append($("<div/>", {
                    class: "right"
                })).append($("<div/>", {
                    class: "middle"
                }).append($("<div/>", {
                    class: "ie7fix"
                }).append($("<input/>", {
                    type: "text",
                    tabindex: "1",
                    id: _0x48226a.name,
                    value: _0x48226a.value,
                    min: _0x48226a.min,
                    max: _0x48226a.max
                }).attr("size", _0x48226a.size || 10).css("text-align", "right"))))).append($("<span/>", {
                    class: "grcrt_spinner_btn grcrt_spinner_up",
                    rel: _0x48226a.name
                }).click(function() {
                    var _0x28b85c = $(this).parent().find("#" + $(this).attr("rel"));
                    parseInt($(_0x28b85c).attr("max")) > parseInt($(_0x28b85c).attr("value")) && $(_0x28b85c).attr("value", parseInt($(_0x28b85c).attr("value")) + 1);
                }));
            }
        }, {
            key: "inputSlider",
            value: function(_0x5c69d3) {
                return $("<div/>", {
                    id: "grcrt_" + _0x5c69d3.name + "_config"
                }).append($("<div/>", {
                    class: "slider_container"
                }).append($("<div/>", {
                    style: "float:left;width:120px;"
                }).html(_0x5c69d3.name)).append(_0x46a95f.input({
                    name: "grcrt_" + _0x5c69d3.name + "_value",
                    style: "float:left;width:33px;"
                }).hide()).append($("<div/>", {
                    class: "windowmgr_slider",
                    style: "width: 200px;float: left;"
                }).append($("<div/>", {
                    class: "grepo_slider sound_volume"
                })))).append($("<script/>", {
                    type: "text/javascript"
                }).text("RepConv.slider = $('#grcrt_" + _0x5c69d3.name + `_config .sound_volume').grepoSlider({\
min: 0,\
max: 100,\
step: 5,\
value: ` + _0x5c69d3.volume + `,\
template: 'tpl_grcrt_slider'\
}).on('sl:change:value', function (e, _sl, value) {\
$('#grcrt_` + _0x5c69d3.name + `_value').attr('value',value);\
if (RepConv.audio.test != undefined){\
RepConv.audio.test.volume = value/100;\
}\
}),\
$('#grcrt_` + _0x5c69d3.name + "_config .button_down').css('background-position','-144px 0px;'),\n$('#grcrt_" + _0x5c69d3.name + `_config .button_up').css('background-position','-126px 0px;')\
`));
            }
        }, {
            key: "selectBox",
            value: function(_0x419921) {
                return $("<div/>", {
                    style: "padding: 5px"
                }).append($("<input/>", {
                    type: "hidden",
                    name: _0x419921.name,
                    id: _0x419921.id,
                    value: _0x419921.value
                })).append($("<label/>", {
                    for: _0x419921.id
                }).text(_0x419921.label)).append($("<div/>", {
                    id: _0x419921.id,
                    class: "dropdown default",
                    style: _0x419921.styles
                }).dropdown({
                    list_pos: "left",
                    value: _0x419921.value,
                    disabled: _0x419921.disabled || false,
                    options: _0x419921.options
                }).on("dd:change:value", function(_0x536ca6, _0xeb546e) {
                    $("#" + _0x419921.id).attr("value", _0xeb546e);
                }));
            }
        }, {
            key: "timerBoxFull",
            value: function(_0x4f7664) {
                return $("<div/>", {
                    class: "single-progressbar instant_buy js-progressbar type_building_queue",
                    id: _0x4f7664.id,
                    style: _0x4f7664.styles
                }).append($("<div/>", {
                    class: "border_l"
                })).append($("<div/>", {
                    class: "border_r"
                })).append($("<div/>", {
                    class: "body"
                })).append($("<div/>", {
                    class: "progress"
                }).append($("<div/>", {
                    class: "indicator",
                    style: "width: 0%;"
                }))).append($("<div/>", {
                    class: "caption"
                }).append($("<span/>", {
                    class: "text"
                })).append($("<span/>", {
                    class: "value_container"
                }).append($("<span/>", {
                    class: "curr"
                }).html("0%"))));
            }
        }, {
            key: "timerBoxSmall",
            value: function(_0x1b3822) {
                return $("<div/>", {
                    class: "single-progressbar instant_buy js-progressbar type_building_queue",
                    id: _0x1b3822.id,
                    style: _0x1b3822.styles
                }).append($("<div/>", {
                    class: "progress"
                }).append($("<div/>", {
                    class: "indicator",
                    style: "width: 0%;"
                }))).append($("<div/>", {
                    class: "caption"
                }).append($("<span/>", {
                    class: "text"
                })).append($("<span/>", {
                    class: "value_container"
                }).append($("<span/>", {
                    class: "curr"
                }).html(_0x1b3822.text ? _0x1b3822.text : "-"))));
            }
        }, {
            key: "gameWrapper",
            value: function(_0x5504b3, _0x6a7d68, _0x4f29b9, _0x4aa3f9) {
                var _0x57e86e = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
                return $("<div/>", {
                    class: "game_inner_box" + (_0x57e86e ? " disabled-box" : ""),
                    style: _0x4aa3f9,
                    id: _0x6a7d68
                }).append($("<div/>", {
                    class: "game_border"
                }).append($("<div/>", {
                    class: "game_border_top"
                })).append($("<div/>", {
                    class: "game_border_bottom"
                })).append($("<div/>", {
                    class: "game_border_left"
                })).append($("<div/>", {
                    class: "game_border_right"
                })).append($("<div/>", {
                    class: "game_border_top"
                })).append($("<div/>", {
                    class: "game_border_corner corner1"
                })).append($("<div/>", {
                    class: "game_border_corner corner2"
                })).append($("<div/>", {
                    class: "game_border_corner corner3"
                })).append($("<div/>", {
                    class: "game_border_corner corner4"
                })).append($("<div/>", {
                    class: "game_header bold",
                    id: "settings_header"
                }).html(_0x5504b3)).append($("<div/>").append(_0x4f29b9)));
            }
        }], (_0x1a1291 = null) && _0x5d260c(_0x3b42d1.prototype, _0x1a1291), _0x3188e8 && _0x5d260c(_0x3b42d1, _0x3188e8), _0x46a95f;
    }();

    function _0x3be4bc(_0x3ea5bd, _0x552ff1) {
        for (var _0x422c6d = 0; _0x422c6d < _0x552ff1.length; _0x422c6d++) {
            var _0xdf9eb1 = _0x552ff1[_0x422c6d];
            _0xdf9eb1.enumerable = _0xdf9eb1.enumerable || false, _0xdf9eb1.configurable = true, "value" in _0xdf9eb1 && (_0xdf9eb1.writable = true), Object.defineProperty(_0x3ea5bd, _0xdf9eb1.key, _0xdf9eb1);
        }
    }
    var _0x3b83a2 = function() {
        function _0xb6e1b8() {
            ! function(_0x1dd0e6, _0x36a351) {
                if (!(_0x1dd0e6 instanceof _0x36a351)) throw new TypeError("Cannot call a class as a function");
            }(this, _0xb6e1b8);
        }
        var _0x55c892, _0x1d6e8e, _0x230273;
        return _0x55c892 = _0xb6e1b8, _0x230273 = [{
            key: "init",
            value: function() {
                console_object.Log("Initialize Assistant", 0);
            }
        }, {
            key: "setSettings",
            value: function(_0x1cf0f5) {
                "" !== _0x1cf0f5 && null != _0x1cf0f5 && $.extend(_0xb6e1b8.settings, _0x1cf0f5), _0xb6e1b8.initSettings();
            }
        }, {
            key: "initSettings",
            value: function() {
                _0xb6e1b8.settings.town_names ? $("#map_towns .flag").addClass("active_town") : $("#map_towns .flag").removeClass("active_town"), _0xb6e1b8.settings.player_name ? $("#map_towns .flag").addClass("active_player") : $("#map_towns .flag").removeClass("active_player"), _0xb6e1b8.settings.alliance_name ? $("#map_towns .flag").addClass("active_alliance") : $("#map_towns .flag").removeClass("active_alliance");
            }
        }, {
            key: "contentSettings",
            value: function() {
                return $("<fieldset/>", {
                    id: "Assistant_settings",
                    style: "float:left; width:472px;height: 270px;"
                }).append($("<legend/>").html("Assistant Settings")).append(menu_object.checkbox({
                    text: "Show town names on island view.",
                    id: "assistant_town_names",
                    name: "assistant_town_names",
                    checked: _0xb6e1b8.settings.town_names
                })).append(menu_object.checkbox({
                    text: "Show player names on island view.",
                    id: "assistant_player_names",
                    name: "assistant_player_names",
                    checked: _0xb6e1b8.settings.player_name
                })).append(menu_object.checkbox({
                    text: "Show alliance names on island view.",
                    id: "assistant_alliance_names",
                    name: "assistant_alliance_names",
                    checked: _0xb6e1b8.settings.alliance_name
                })).append(menu_object.selectBox({
                    id: "assistant_auto_relogin",
                    name: "assistant_auto_relogin",
                    label: "Auto re-login: ",
                    styles: "width: 120px;",
                    value: _0xb6e1b8.settings.auto_relogin,
                    options: [{
                        value: "0",
                        name: "Disabled"
                    }, {
                        value: "120",
                        name: "After 2 minutes"
                    }, {
                        value: "300",
                        name: "After 5 minutes"
                    }, {
                        value: "600",
                        name: "After 10 minutes"
                    }, {
                        value: "900",
                        name: "After 15 minutes"
                    }]
                })).append(menu_object.button({
                    name: DM.getl10n("notes").btn_save,
                    style: "top: 120px;"
                }).on("click", function() {
                    var _0x32bf69 = $("#Assistant_settings").serializeObject();
                    _0xb6e1b8.settings.town_names = void 0 !== _0x32bf69.assistant_town_names, _0xb6e1b8.settings.player_name = void 0 !== _0x32bf69.assistant_player_names, _0xb6e1b8.settings.alliance_name = void 0 !== _0x32bf69.assistant_alliance_names, _0xb6e1b8.settings.auto_relogin = parseInt(_0x32bf69.assistant_auto_relogin), api_object.Auth("saveAssistant", {
                        player_id: autobot_object.Account.player_id,
                        world_id: autobot_object.Account.world_id,
                        csrfToken: autobot_object.Account.csrfToken,
                        assistant_settings: autobot_object.stringify(_0xb6e1b8.settings)
                    }, _0xb6e1b8.callbackSave);
                }));
            }
        }, {
            key: "callbackSave",
            value: function() {
                HumanMessage.success("The settings were saved!"), _0xb6e1b8.initSettings();
            }
        }], (_0x1d6e8e = null) && _0x3be4bc(_0x55c892.prototype, _0x1d6e8e), _0x230273 && _0x3be4bc(_0x55c892, _0x230273), _0xb6e1b8;
    }();
    Object.defineProperty(_0x3b83a2, "settings", {
        enumerable: true,
        writable: true,
        value: {
            town_names: false,
            player_name: false,
            alliance_name: true,
            auto_relogin: 0
        }
    });
    var _0x325bca = _0x3b83a2;

    function _0x552e68(_0xe2158e, _0x4ca3eb) {
        for (var _0x5bf00b = 0; _0x5bf00b < _0x4ca3eb.length; _0x5bf00b++) {
            var _0x5e276d = _0x4ca3eb[_0x5bf00b];
            _0x5e276d.enumerable = _0x5e276d.enumerable || false, _0x5e276d.configurable = true, "value" in _0x5e276d && (_0x5e276d.writable = true), Object.defineProperty(_0xe2158e, _0x5e276d.key, _0x5e276d);
        }
    }
    var attack_object = function() {
        function _0x59c65a() {
            ! function(_0x1eac50, _0x15bda8) {
                if (!(_0x1eac50 instanceof _0x15bda8)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x59c65a);
        }
        var _0x2bb8ae, _0x96d7b6, _0x264b07;
        return _0x2bb8ae = _0x59c65a, _0x264b07 = [{
            key: "init",
            value: function() {
                console_object.Log("Initialize Autoattack", 4), _0x59c65a.initButton(), autobot_object.checkPremium("captain") && _0x59c65a.loadAttackQueue();
            }
        }, {
            key: "setSettings",
            value: function(_0x60031d) {
                "" !== _0x60031d && null != _0x60031d && $.extend(_0x59c65a.settings, JSON.parse(_0x60031d));
            }
        }, {
            key: "initButton",
            value: function() {
                _0x35174a.initButtons("Autoattack");
            }
        }, {
            key: "start",
            value: function() {
                _0x59c65a.attacks_timers = [];
                var _0x25ec8a = $.map(_0x59c65a.attacks, function(_0x3889c0, _0x181fa2) {
                    var _0x24f67d = $.Deferred();
                    return _0x59c65a.checkAttack(_0x3889c0, _0x181fa2).then(function() {
                        _0x24f67d.resolve();
                    }), _0x24f67d;
                });
                $.when.apply($, _0x25ec8a).done(function() {
                    _0x59c65a.checked_count = 0;
                    var _0x3f3af8 = null;
                    0 === _0x59c65a.countRunningAttacks() ? (_0x3f3af8 = DM.getl10n("COMMON").no_results + ".", HumanMessage.error(_0x3f3af8), console_object.Log('<span style="color: #ff4f23;">' + _0x3f3af8 + "</span>", 4), _0x59c65a.disableStart()) : (_0x3f3af8 = DM.getl10n("alliance").index.button_send + ": " + _0x59c65a.countRunningAttacks() + " " + DM.getl10n("layout").toolbar_activities.incomming_attacks.toLocaleLowerCase() + ".", HumanMessage.success(_0x3f3af8), console_object.Log('<span style="color: #ff4f23;">' + _0x3f3af8 + "</span>", 4));
                });
            }
        }, {
            key: "checkAttack",
            value: function(_0x391de4, _0x37b8f0) {
                var _0x4e61cd = $.Deferred();
                return _0x391de4.send_at >= Timestamp.now() ? (_0x59c65a.checked_count++, setTimeout(function() {
                    api_object.town_info_attack(_0x391de4.town_id, _0x391de4, function(_0x5aa0b2) {
                        if (void 0 !== _0x5aa0b2.json) {
                            if (!_0x5aa0b2.json.same_island || GameDataUnits.hasNavalUnits(_0x391de4.units)) {
                                var _0x128e8e = GameDataUnits.calculateCapacity(_0x391de4.town_id, _0x391de4.units);
                                if (_0x128e8e.needed_capacity > _0x128e8e.total_capacity) {
                                    var _0xca3670 = DM.getl10n("place").support_overview.slow_transport_ship;
                                    return $("#attack_order_id_" + _0x391de4.id + " .attack_bot_timer").removeClass("success").html(_0xca3670), _0x59c65a.addAttack(_0x37b8f0, _0xca3670), _0x4e61cd.resolve(), false;
                                }
                            }
                            _0x59c65a.addAttack(_0x37b8f0), _0x4e61cd.resolve();
                        }
                    });
                }, 1e3 * _0x59c65a.checked_count / 2)) : (_0x59c65a.addAttack(_0x37b8f0, "Expired"), $("#attack_order_id_" + _0x391de4.id + " .attack_bot_timer").removeClass("success").html("Expired"), _0x4e61cd.resolve()), _0x4e61cd;
            }
        }, {
            key: "addAttack",
            value: function(_0x1a3f03, _0x267730) {
                var _0x297dc7 = {
                    is_running: false,
                    attack_id: _0x59c65a.attacks[_0x1a3f03].id,
                    interval: null,
                    message: "",
                    message_text: ""
                };
                void 0 !== _0x267730 ? _0x297dc7.message_text = _0x267730 : (_0x297dc7.is_running = true, _0x297dc7.interval = setInterval(function() {
                    if (void 0 !== _0x59c65a.attacks[_0x1a3f03]) {
                        var _0x3b4107 = _0x59c65a.attacks[_0x1a3f03].send_at - Timestamp.now();
                        _0x297dc7.message = $("#attack_order_id_" + _0x297dc7.attack_id + " .attack_bot_timer"), _0x297dc7.message.html(autobot_object.toHHMMSS(_0x3b4107)), 300 !== _0x3b4107 && 120 !== _0x3b4107 && 60 !== _0x3b4107 || console_object.Log('<span style="color: #ff4f23;">[' + _0x59c65a.attacks[_0x1a3f03].origin_town_name + " &#62; " + _0x59c65a.attacks[_0x1a3f03].target_town_name + "] " + DM.getl10n("heroes").common.departure.toLowerCase().replace(":", "") + " " + DM.getl10n("place").support_overview.just_in + " " + hours_minutes_seconds(_0x3b4107) + ".</span>", 4), _0x59c65a.attacks[_0x1a3f03].send_at <= Timestamp.now() && (_0x297dc7.is_running = false, _0x59c65a.sendAttack(_0x59c65a.attacks[_0x1a3f03]), _0x59c65a.stopTimer(_0x297dc7));
                    } else _0x297dc7.is_running = false, _0x297dc7.message.html("Stopped"), _0x59c65a.stopTimer(_0x297dc7);
                }, 1e3)), _0x59c65a.attacks_timers.push(_0x297dc7);
            }
        }, {
            key: "countRunningAttacks",
            value: function() {
                var _0x3330aa = 0;
                return _0x59c65a.attacks_timers.forEach(function(_0x24eb59) {
                    _0x24eb59.is_running && _0x3330aa++;
                }), _0x3330aa;
            }
        }, {
            key: "stopTimer",
            value: function(_0x234a49) {
                clearInterval(_0x234a49.interval), 0 === _0x59c65a.countRunningAttacks() && (console_object.Log('<span style="color: #ff4f23;">All finished.</span>', 4), _0x59c65a.stop());
            }
        }, {
            key: "stop",
            value: function() {
                _0x59c65a.disableStart(), _0x59c65a.attacks_timers.forEach(function(_0x5ecf6d) {
                    _0x5ecf6d.is_running && $("#attack_order_id_" + _0x5ecf6d.attack_id + " .attack_bot_timer").html(""), clearInterval(_0x5ecf6d.interval);
                });
            }
        }, {
            key: "disableStart",
            value: function() {
                _0x35174a.modules.Autoattack.isOn = false, $("#Autoattack_onoff").removeClass("on").find("span").mousePopup(new MousePopup("Start Autoattack"));
            }
        }, {
            key: "sendAttack",
            value: function(_0x50e9b2) {
                api_object.send_units(_0x50e9b2.town_id, _0x50e9b2.type, _0x50e9b2.target_town_id, _0x59c65a.unitsToSend(_0x50e9b2.units), function(_0x33f3c3) {
                    var _0x239255 = _0x59c65a.attacks_timers.filter(function(_0x32119e) {
                        return _0x32119e.attack_id === _0x50e9b2.id;
                    });
                    void 0 !== _0x33f3c3.success && _0x239255.length ? (_0x239255[0].message_text = "Success", _0x239255[0].message.addClass("success").html("Success"), console_object.Log('<span style="color: #ff9e22;">[' + _0x50e9b2.origin_town_name + " &#62; " + _0x50e9b2.target_town_name + "] " + _0x33f3c3.success + "</span>", 4)) : void 0 !== _0x33f3c3.error && _0x239255.length && (_0x239255[0].message_text = "Invalid", _0x239255[0].message.html("Invalid"), console_object.Log('<span style="color: #ff3100;">[' + _0x50e9b2.origin_town_name + " &#62; " + _0x50e9b2.target_town_name + "] " + _0x33f3c3.error + "</span>", 4));
                });
            }
        }, {
            key: "unitsToSend",
            value: function(_0x5dc697) {
                var _0x2e065e = {};
                return $.each(_0x5dc697, function(_0x31bd08, _0xda91c7) {
                    _0xda91c7 > 0 && (_0x2e065e[_0x31bd08] = _0xda91c7);
                }), _0x2e065e;
            }
        }, {
            key: "calls",
            value: function(_0x106a04, _0x44fbdf) {
                switch (_0x106a04) {
                    case "attack_planer/add_origin_town":
                    case "attack_planer/edit_origin_town":
                        _0x59c65a.stop(), _0x59c65a.loadAttackQueue();
                        break;
                    case "attack_planer/attacks":
                        void 0 !== (_0x44fbdf = JSON.parse(_0x44fbdf)).json.data && _0x59c65a.setAttackData(_0x44fbdf.json);
                }
            }
        }, {
            key: "setAttackData",
            value: function(_0x404cbb) {
                autobot_object.checkPremium("captain") && (_0x59c65a.attacks = void 0 !== _0x404cbb.data.attacks ? _0x404cbb.data.attacks : []);
            }
        }, {
            key: "attackOrderRow",
            value: function(_0x2cd524, _0x3aa76c) {
                var _0x21ad71 = $("<div/>", {
                    class: "origin_town_units"
                });
                void 0 !== _0x2cd524.units && $.each(_0x2cd524.units, function(_0x2e203c, _0x24b487) {
                    _0x24b487 > 0 && _0x21ad71.append($("<div/>", {
                        class: "unit_icon25x25 " + _0x2e203c
                    }).html(_0x24b487));
                });
                var _0x41ea2a = $("<li/>", {
                    class: "attacks_row " + (_0x3aa76c % 2 == 0 ? "odd" : "even"),
                    id: "attack_order_id_" + _0x2cd524.id
                });
                return _0x2cd524.send_at > Timestamp.now() && _0x41ea2a.hover(function() {
                    $(this).toggleClass("brown");
                }), _0x41ea2a.append($("<div/>", {
                    class: "attack_type32x32 " + _0x2cd524.type
                })).append($("<div/>", {
                    class: "arrow"
                })).append($("<div/>", {
                    class: "row1"
                }).append(" " + _0x2cd524.origin_town_link + " ").append("(" + _0x2cd524.origin_player_link + ")").append($("<span/>", {
                    class: "small_arrow"
                })).append(" " + _0x2cd524.target_town_link + " ").append("(" + _0x2cd524.origin_player_link + ") ")).append($("<div/>", {
                    class: "row2" + (_0x2cd524.send_at <= Timestamp.now() ? " expired" : "")
                }).append($("<span/>").html(DM.getl10n("heroes").common.departure)).append(" " + DateHelper.formatDateTimeNice(_0x2cd524.send_at) + " ").append($("<span/>").html(DM.getl10n("heroes").common.arrival)).append(" " + DateHelper.formatDateTimeNice(_0x2cd524.arrival_at) + " ")).append($("<div/>", {
                    class: "show_units"
                }).on("click", function() {
                    _0x21ad71.toggle();
                })).append($("<div/>", {
                    class: "attack_bot_timer"
                }).html(function() {
                    var _0x1e2cb9 = _0x59c65a.attacks_timers.filter(function(_0x25bf5b) {
                        return _0x25bf5b.attack_id === _0x2cd524.id;
                    });
                    if (_0x1e2cb9.length) return _0x1e2cb9[0].is_running ? autobot_object.toHHMMSS(_0x2cd524.send_at - Timestamp.now()) : _0x1e2cb9[0].message_text;
                })).append(_0x21ad71);
            }
        }, {
            key: "loadAttackQueue",
            value: function() {
                api_object.attack_planner(Game.townId, function(_0x55cc18) {
                    _0x59c65a.setAttackData(_0x55cc18), _0x59c65a.setAttackQueue($("#attack_bot"));
                });
            }
        }, {
            key: "setAttackQueue",
            value: function(_0x27ea2f) {
                if (_0x27ea2f.length) {
                    var _0x8ca04b = _0x27ea2f.find("ul.attacks_list");
                    _0x8ca04b.empty(), api_object.attack_planner(Game.townId, function(_0x121325) {
                        _0x59c65a.setAttackData(_0x121325), $.each(_0x59c65a.attacks, function(_0x50184d, _0x2c236e) {
                            _0x50184d++, _0x8ca04b.append(_0x59c65a.attackOrderRow(_0x2c236e, _0x50184d));
                        });
                    });
                }
            }
        }, {
            key: "contentSettings",
            value: function() {
                var _0x34d953 = $('<div id="attack_bot" class="attack_bot attack_planner attacks' + (_0x35174a.hasPremium ? "" : " disabled-box") + '"><div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_top"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" id="settings_header">AutoAttack</div><div><div class="attacks_list"><ul class="attacks_list"></ul></div><div class="game_list_footer autoattack_settings"></div></div></div></div>');
                return _0x34d953.find(".autoattack_settings").append(function() {
                    var _0x5f0cfd = menu_object.button({
                        name: DM.getl10n("premium").advisors.short_advantages.attack_planner,
                        style: "float: left;",
                        class: autobot_object.checkPremium("captain") ? "" : " disabled"
                    });
                    return autobot_object.checkPremium("captain") ? _0x5f0cfd.click(function() {
                        AttackPlannerWindowFactory.openAttackPlannerWindow();
                    }) : _0x5f0cfd;
                }).append(function() {
                    var _0x539fd3 = menu_object.button({
                        name: DM.getl10n("update_notification").refresh,
                        style: "float: left;",
                        class: autobot_object.checkPremium("captain") ? "" : " disabled"
                    });
                    return autobot_object.checkPremium("captain") ? _0x539fd3.click(function() {
                        _0x59c65a.setAttackQueue(_0x34d953);
                    }) : _0x539fd3;
                }).append(function() {
                    if (!autobot_object.checkPremium("captain")) return menu_object.button({
                        name: DM.getl10n("construction_queue").advisor_banner.activate(Game.premium_data.captain.name),
                        style: "float: right;"
                    }).click(function() {
                        PremiumWindowFactory.openBuyAdvisorsWindow();
                    });
                }), _0x59c65a.setAttackQueue(_0x34d953), _0x34d953;
            }
        }], (_0x96d7b6 = null) && _0x552e68(_0x2bb8ae.prototype, _0x96d7b6), _0x264b07 && _0x552e68(_0x2bb8ae, _0x264b07), _0x59c65a;
    }();
    Object.defineProperty(attack_object, "settings", {
        enumerable: true,
        writable: true,
        value: {
            autostart: false
        }
    }), Object.defineProperty(attack_object, "attacks", {
        enumerable: true,
        writable: true,
        value: []
    }), Object.defineProperty(attack_object, "attacks_timers", {
        enumerable: true,
        writable: true,
        value: []
    }), Object.defineProperty(attack_object, "view", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(attack_object, "checked_count", {
        enumerable: true,
        writable: true,
        value: 0
    });

    function _0x25ae36(_0x6204ea, _0x17e051) {
        for (var _0x2e8bb9 = 0; _0x2e8bb9 < _0x17e051.length; _0x2e8bb9++) {
            var _0x3c684f = _0x17e051[_0x2e8bb9];
            _0x3c684f.enumerable = _0x3c684f.enumerable || false, _0x3c684f.configurable = true, "value" in _0x3c684f && (_0x3c684f.writable = true), Object.defineProperty(_0x6204ea, _0x3c684f.key, _0x3c684f);
        }
    }
    var farm_object = function() {
        function _0x1c579c() {
            ! function(_0x5c2c6a, _0x1dbbc2) {
                if (!(_0x5c2c6a instanceof _0x1dbbc2)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x1c579c);
        }
        var _0x5a5b31, _0x4d37bf, _0x414e4e;
        return _0x5a5b31 = _0x1c579c, _0x414e4e = [{
            key: "checkReady",
            value: function(_0x3e9610) {
                var _0x2835b2 = ITowns.towns[_0x3e9610.id];
                if (_0x2835b2.hasConqueror()) return false;
                if (!_0x1c579c.checkEnabled()) return false;
                if (_0x3e9610.modules.Autofarm.isReadyTime >= Timestamp.now()) return _0x3e9610.modules.Autofarm.isReadyTime;
                var _0x48ee7f = _0x2835b2.resources();
                if (_0x48ee7f.wood === _0x48ee7f.storage && _0x48ee7f.stone === _0x48ee7f.storage && _0x48ee7f.iron === _0x48ee7f.storage && _0x1c579c.settings.skipwhenfull) return false;
                var _0xad9770 = false;
                return $.each(_0x35174a.Queue.queue, function(_0x415204, _0x3e22aa) {
                    if ("Autofarm" === _0x3e22aa.module && -1 !== _0x3e9610.relatedTowns.indexOf(_0x3e22aa.townId)) return _0xad9770 = true, false;
                }), _0x1c579c.settings.lowresfirst && _0x3e9610.relatedTowns.length > 0 && (_0xad9770 = false, $.each(_0x3e9610.relatedTowns, function(_0x3aad77, _0xdc6007) {
                    var _0x37562f = _0x2835b2.resources(),
                        _0x24eb78 = ITowns.towns[_0xdc6007].resources();
                    if (_0x37562f.wood + _0x37562f.stone + _0x37562f.iron > _0x24eb78.wood + _0x24eb78.stone + _0x24eb78.iron) return _0xad9770 = true, false;
                })), !_0xad9770;
            }
        }, {
            key: "disableP",
            value: function() {
                attack_object.settings = {
                    autostart: false,
                    method: 300,
                    timebetween: 1,
                    skipwhenfull: true,
                    lowresfirst: true,
                    stoplootbelow: true
                };
            }
        }, {
            key: "checkEnabled",
            value: function() {
                return _0x35174a.modules.Autofarm.isOn;
            }
        }, {
            key: "startFarming",
            value: function(_0x581516) {
                if (!_0x1c579c.checkEnabled()) return false;
                _0x1c579c.town = _0x581516, _0x1c579c.shouldFarm = [], _0x1c579c.iTown = ITowns.towns[_0x1c579c.town.id];
                var _0x371d8c = function() {
                    _0x1c579c.interval = setTimeout(function() {
                        console_object.Log(_0x1c579c.town.name + " getting farm information.", 1), _0x1c579c.isCaptain ? _0x1c579c.initFarmTownsCaptain(function() {
                            if (!_0x1c579c.checkEnabled()) return false;
                            _0x1c579c.claimResources();
                        }) : _0x1c579c.initFarmTowns(function() {
                            if (!_0x1c579c.checkEnabled()) return false;
                            _0x1c579c.town.currentFarmCount = 0, _0x1c579c.claimResources();
                        });
                    }, autobot_object.randomize(1e3, 2e3));
                };
                _0x35174a.currentTown !== _0x1c579c.town.key ? _0x1c579c.interval = setTimeout(function() {
                    console_object.Log(_0x1c579c.town.name + " move to town.", 1), api_object.switch_town(_0x1c579c.town.id, function() {
                        if (!_0x1c579c.checkEnabled()) return false;
                        _0x35174a.currentTown = _0x1c579c.town.key, _0x371d8c();
                    }), _0x1c579c.town.isSwitched = true;
                }, autobot_object.randomize(1e3, 2e3)) : _0x371d8c();
            }
        }, {
            key: "initFarmTowns",
            value: function(_0x41d050) {
                api_object.game_data(_0x1c579c.town.id, function(_0x5d0fab) {
                    if (!_0x1c579c.checkEnabled()) return false;
                    var _0x364e4d = _0x5d0fab.map.data.data.data;
                    $.each(_0x364e4d, function(_0x6d414d, _0x3e7771) {
                        var _0x3168fd = [];
                        $.each(_0x3e7771.towns, function(_0x49ba54, _0x4c62b9) {
                            _0x4c62b9.x === _0x1c579c.iTown.getIslandCoordinateX() && _0x4c62b9.y === _0x1c579c.iTown.getIslandCoordinateY() && 1 === _0x4c62b9.relation_status && _0x3168fd.push(_0x4c62b9);
                        }), _0x1c579c.town.farmTowns = _0x3168fd;
                    }), $.each(_0x1c579c.town.farmTowns, function(_0x53149b, _0x106be3) {
                        _0x106be3.loot - Timestamp.now() <= 0 && _0x1c579c.shouldFarm.push(_0x106be3);
                    }), _0x41d050(true);
                });
            }
        }, {
            key: "initFarmTownsCaptain",
            value: function(_0x2ca26c) {
                api_object.farm_town_overviews(_0x1c579c.town.id, function(_0x45ccea) {
                    if (!_0x1c579c.checkEnabled()) return false;
                    var _0x590a31 = [];
                    $.each(_0x45ccea.farm_town_list, function(_0x21fc27, _0x38ec65) {
                        _0x38ec65.island_x === _0x1c579c.iTown.getIslandCoordinateX() && _0x38ec65.island_y === _0x1c579c.iTown.getIslandCoordinateY() && 1 === _0x38ec65.rel && _0x590a31.push(_0x38ec65);
                    }), _0x1c579c.town.farmTowns = _0x590a31, $.each(_0x1c579c.town.farmTowns, function(_0x363227, _0x2eb942) {
                        _0x2eb942.loot - Timestamp.now() <= 0 && _0x1c579c.shouldFarm.push(_0x2eb942);
                    }), _0x2ca26c(true);
                });
            }
        }, {
            key: "claimResources",
            value: function() {
                if (!_0x1c579c.town.farmTowns[0]) return console_object.Log(_0x1c579c.town.name + " has no farm towns.", 1), _0x1c579c.finished(1800), false;
                if (_0x1c579c.town.currentFarmCount < _0x1c579c.shouldFarm.length) _0x1c579c.interval = setTimeout(function() {
                    var _0x3f8594 = "normal";
                    if (Game.features.battlepoint_villages || (_0x1c579c.shouldFarm[_0x1c579c.town.currentFarmCount].mood >= 86 && _0x1c579c.settings.stoplootbelow && (_0x3f8594 = "double"), _0x1c579c.settings.stoplootbelow || (_0x3f8594 = "double")), _0x1c579c.isCaptain) {
                        var _0x403dbc = [];
                        $.each(_0x1c579c.shouldFarm, function(_0x54c7bd, _0x54dbf3) {
                            _0x403dbc.push(_0x54dbf3.id);
                        }), _0x1c579c.claimLoads(_0x403dbc, _0x3f8594, function() {
                            if (!_0x1c579c.checkEnabled()) return false;
                            _0x1c579c.finished(_0x1c579c.getMethodTime(_0x1c579c.town.id));
                        });
                    } else _0x1c579c.claimLoad(_0x1c579c.shouldFarm[_0x1c579c.town.currentFarmCount].id, _0x3f8594, function() {
                        if (!_0x1c579c.checkEnabled()) return false;
                        _0x1c579c.shouldFarm[_0x1c579c.town.currentFarmCount].loot = Timestamp.now() + _0x1c579c.getMethodTime(_0x1c579c.town.id), _0x35174a.updateTimer(_0x1c579c.shouldFarm.length, _0x1c579c.town.currentFarmCount), _0x1c579c.town.currentFarmCount++, _0x1c579c.claimResources();
                    });
                }, autobot_object.randomize(1e3 * _0x1c579c.settings.timebetween, 1e3 * _0x1c579c.settings.timebetween + 1e3));
                else {
                    var _0x3d4183 = null;
                    $.each(_0x1c579c.town.farmTowns, function(_0x447e8d, _0x16ada7) {
                        var _0x326b96 = _0x16ada7.loot - Timestamp.now();
                        (null == _0x3d4183 || _0x326b96 <= _0x3d4183) && (_0x3d4183 = _0x326b96);
                    }), _0x1c579c.shouldFarm.length > 0 ? $.each(_0x1c579c.shouldFarm, function(_0x49dbab, _0x2aed25) {
                        var _0x5800e9 = _0x2aed25.loot - Timestamp.now();
                        (null == _0x3d4183 || _0x5800e9 <= _0x3d4183) && (_0x3d4183 = _0x5800e9);
                    }) : console_object.Log(_0x1c579c.town.name + " not ready yet.", 1), _0x1c579c.finished(_0x3d4183);
                }
            }
        }, {
            key: "claimLoad",
            value: function(_0x416b67, _0x45d412, _0x5561dd) {
                Game.features.battlepoint_villages ? api_object.frontend_bridge(_0x1c579c.town.id, {
                    model_url: "FarmTownPlayerRelation/" + MM.getOnlyCollectionByName("FarmTownPlayerRelation").getRelationForFarmTown(_0x416b67).id,
                    action_name: "claim",
                    arguments: {
                        farm_town_id: _0x416b67,
                        type: "resources",
                        option: 1
                    }
                }, function(_0x282ed1) {
                    _0x1c579c.claimLoadCallback(_0x416b67, _0x282ed1), _0x5561dd(_0x282ed1);
                }) : api_object.claim_load(_0x1c579c.town.id, _0x45d412, _0x1c579c.getMethodTime(_0x1c579c.town.id), _0x416b67, function(_0x349658) {
                    _0x1c579c.claimLoadCallback(_0x416b67, _0x349658), _0x5561dd(_0x349658);
                });
            }
        }, {
            key: "claimLoadCallback",
            value: function(_0x2cd40e, _0x3fbfcf) {
                if (_0x3fbfcf.success) {
                    var _0xee2ee5 = _0x3fbfcf.satisfaction,
                        _0x49091c = _0x3fbfcf.lootable_human;
                    2 === _0x3fbfcf.relation_status ? (WMap.updateStatusInChunkTowns(_0x2cd40e.id, _0xee2ee5, Timestamp.now() + _0x1c579c.getMethodTime(_0x1c579c.town.id), Timestamp.now(), _0x49091c, 2), WMap.pollForMapChunksUpdate()) : WMap.updateStatusInChunkTowns(_0x2cd40e.id, _0xee2ee5, Timestamp.now() + _0x1c579c.getMethodTime(_0x1c579c.town.id), Timestamp.now(), _0x49091c), Layout.hideAjaxLoader(), console_object.Log('<span style="color: #6FAE30;">' + _0x3fbfcf.success + "</span>", 1);
                } else _0x3fbfcf.error && console_object.Log(_0x1c579c.town.name + " " + _0x3fbfcf.error, 1);
            }
        }, {
            key: "claimLoads",
            value: function(_0x241485, _0x5d4fce, _0x117d8a) {
                api_object.claim_loads(_0x1c579c.town.id, _0x241485, _0x5d4fce, _0x1c579c.getMethodTime(_0x1c579c.town.id), function(_0x619058) {
                    _0x1c579c.claimLoadsCallback(_0x619058), _0x117d8a(_0x619058);
                });
            }
        }, {
            key: "getMethodTime",
            value: function(_0x37bd66) {
                if (Game.features.battlepoint_villages) {
                    var _0x1ef234 = _0x1c579c.settings.method;
                    return $.each(MM.getOnlyCollectionByName("Town").getTowns(), function(_0xa63d0b, _0x2f22f2) {
                        if (_0x2f22f2.id === _0x37bd66 && _0x2f22f2.getResearches().hasResearch("booty")) return _0x1ef234 = 2 * _0x1c579c.settings.method, false;
                    }), _0x1ef234;
                }
                return _0x1c579c.settings.method;
            }
        }, {
            key: "claimLoadsCallback",
            value: function(_0x133a11) {
                if (_0x133a11.success) {
                    var _0x207c5d = _0x133a11.handled_farms;
                    $.each(_0x207c5d, function(_0x3012cf, _0x2b5bf9) {
                        2 === _0x2b5bf9.relation_status ? (WMap.updateStatusInChunkTowns(_0x3012cf, _0x2b5bf9.satisfaction, Timestamp.now() + _0x1c579c.getMethodTime(_0x1c579c.town.id), Timestamp.now(), _0x2b5bf9.lootable_at, 2), WMap.pollForMapChunksUpdate()) : WMap.updateStatusInChunkTowns(_0x3012cf, _0x2b5bf9.satisfaction, Timestamp.now() + _0x1c579c.getMethodTime(_0x1c579c.town.id), Timestamp.now(), _0x2b5bf9.lootable_at);
                    }), console_object.Log('<span style="color: #6FAE30;">' + _0x133a11.success + "</span>", 1);
                } else _0x133a11.error && console_object.Log(_0x1c579c.town.name + " " + _0x133a11.error, 1);
            }
        }, {
            key: "finished",
            value: function(_0x5ad799) {
                if (!_0x1c579c.checkEnabled()) return false;
                $.each(_0x35174a.playerTowns, function(_0x87b207, _0x43f8b7) {
                    -1 !== _0x1c579c.town.relatedTowns.indexOf(_0x43f8b7.id) && (_0x43f8b7.modules.Autofarm.isReadyTime = Timestamp.now() + _0x5ad799);
                }), _0x1c579c.town.modules.Autofarm.isReadyTime = Timestamp.now() + _0x5ad799, _0x35174a.Queue.next();
            }
        }, {
            key: "stop",
            value: function() {
                clearInterval(_0x1c579c.interval);
            }
        }, {
            key: "init",
            value: function() {
                console_object.Log("Initialize AutoFarm", 1), _0x1c579c.initButton(), _0x1c579c.checkCaptain();
            }
        }, {
            key: "initButton",
            value: function() {
                _0x35174a.initButtons("Autofarm");
            }
        }, {
            key: "checkCaptain",
            value: function() {
                $(".advisor_frame.captain div").hasClass("captain_active") && (_0x1c579c.isCaptain = true);
            }
        }, {
            key: "setSettings",
            value: function(_0xd63363) {
                "" !== _0xd63363 && null != _0xd63363 && $.extend(_0x1c579c.settings, _0xd63363);
            }
        }, {
            key: "contentSettings",
            value: function() {
                return $("<fieldset/>", {
                    id: "Autofarm_settings",
                    style: "float:left; width:472px;height: 270px;"
                }).append($("<legend/>").html(_0x1c579c.title)).append(menu_object.checkbox({
                    text: "AutoStart AutoFarm.",
                    id: "autofarm_autostart",
                    name: "autofarm_autostart",
                    checked: _0x1c579c.settings.autostart,
                    disabled: !_0x35174a.hasPremium
                })).append(function() {
                    var _0x3f2e3f = {
                        id: "autofarm_method",
                        name: "autofarm_method",
                        label: "Farm method: ",
                        styles: "width: 120px;",
                        value: _0x1c579c.settings.method,
                        options: [{
                            value: "300",
                            name: "5 minute farm"
                        }, {
                            value: "1200",
                            name: "20 minute farm"
                        }, {
                            value: "5400",
                            name: "90 minute farm"
                        }, {
                            value: "14400",
                            name: "240 minute farm"
                        }],
                        disabled: false
                    };
                    _0x35174a.hasPremium || (_0x3f2e3f = $.extend(_0x3f2e3f, {
                        disabled: true
                    }));
                    var _0x3860dc = menu_object.selectBox(_0x3f2e3f);
                    return _0x35174a.hasPremium || _0x3860dc.mousePopup(new MousePopup(_0x35174a.requiredPrem)), _0x3860dc;
                }).append(function() {
                    var _0x45b437 = {
                        id: "autofarm_bewteen",
                        name: "autofarm_bewteen",
                        label: "Time before next farm: ",
                        styles: "width: 120px;",
                        value: _0x1c579c.settings.timebetween,
                        options: [{
                            value: "1",
                            name: "1-2 seconds"
                        }, {
                            value: "3",
                            name: "3-4 seconds"
                        }, {
                            value: "5",
                            name: "5-6 seconds"
                        }, {
                            value: "7",
                            name: "7-8 seconds"
                        }, {
                            value: "9",
                            name: "9-10 seconds"
                        }]
                    };
                    _0x35174a.hasPremium || (_0x45b437 = $.extend(_0x45b437, {
                        disabled: true
                    }));
                    var _0x3883a3 = menu_object.selectBox(_0x45b437);
                    return _0x35174a.hasPremium || _0x3883a3.mousePopup(new MousePopup(_0x35174a.requiredPrem)), _0x3883a3;
                }).append(menu_object.checkbox({
                    text: "Skip farm when warehouse is full.",
                    id: "autofarm_warehousefull",
                    name: "autofarm_warehousefull",
                    checked: _0x1c579c.settings.skipwhenfull,
                    disabled: !_0x35174a.hasPremium
                })).append(menu_object.checkbox({
                    text: "Lowest resources first with more towns on one island.",
                    id: "autofarm_lowresfirst",
                    name: "autofarm_lowresfirst",
                    checked: _0x1c579c.settings.lowresfirst,
                    disabled: !_0x35174a.hasPremium
                })).append(menu_object.checkbox({
                    text: "Stop loot farm until mood is below 80%.",
                    id: "autofarm_loot",
                    name: "autofarm_loot",
                    checked: _0x1c579c.settings.stoplootbelow,
                    disabled: !_0x35174a.hasPremium
                })).append(function() {
                    var _0x2e34de = menu_object.button({
                        name: DM.getl10n("notes").btn_save,
                        class: _0x35174a.hasPremium ? "" : " disabled",
                        style: "top: 62px;"
                    }).on("click", function() {
                        if (!_0x35174a.hasPremium) return false;
                        var _0x7a93d = $("#Autofarm_settings").serializeObject();
                        _0x1c579c.settings.autostart = void 0 !== _0x7a93d.autofarm_autostart, _0x1c579c.settings.method = parseInt(_0x7a93d.autofarm_method), _0x1c579c.settings.timebetween = parseInt(_0x7a93d.autofarm_bewteen), _0x1c579c.settings.skipwhenfull = void 0 !== _0x7a93d.autofarm_warehousefull, _0x1c579c.settings.lowresfirst = void 0 !== _0x7a93d.autofarm_lowresfirst, _0x1c579c.settings.stoplootbelow = void 0 !== _0x7a93d.autofarm_loot, api_object.Auth("saveAutofarm", {
                            player_id: autobot_object.Account.player_id,
                            world_id: autobot_object.Account.world_id,
                            csrfToken: autobot_object.Account.csrfToken,
                            autofarm_settings: autobot_object.stringify(_0x1c579c.settings)
                        }, _0x1c579c.callbackSave);
                    });
                    return _0x35174a.hasPremium || _0x2e34de.mousePopup(new MousePopup(_0x35174a.requiredPrem)), _0x2e34de;
                });
            }
        }, {
            key: "callbackSave",
            value: function() {
                console_object.Log("Settings saved", 1), HumanMessage.success("The settings were saved!");
            }
        }], (_0x4d37bf = null) && _0x25ae36(_0x5a5b31.prototype, _0x4d37bf), _0x414e4e && _0x25ae36(_0x5a5b31, _0x414e4e), _0x1c579c;
    }();
    Object.defineProperty(farm_object, "settings", {
        enumerable: true,
        writable: true,
        value: {
            autostart: false,
            method: 1200,
            timebetween: 9,
            skipwhenfull: true,
            lowresfirst: true,
            stoplootbelow: true
        }
    }), Object.defineProperty(farm_object, "title", {
        enumerable: true,
        writable: true,
        value: "Autofarm settings"
    }), Object.defineProperty(farm_object, "town", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(farm_object, "isPauzed", {
        enumerable: true,
        writable: true,
        value: false
    }), Object.defineProperty(farm_object, "iTown", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(farm_object, "interval", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(farm_object, "isCaptain", {
        enumerable: true,
        writable: true,
        value: false
    }), Object.defineProperty(farm_object, "shouldFarm", {
        enumerable: true,
        writable: true,
        value: []
    });

    function _0x5ebcfb(_0x278602, _0x477810) {
        for (var _0xdec88b = 0; _0xdec88b < _0x477810.length; _0xdec88b++) {
            var _0x362eef = _0x477810[_0xdec88b];
            _0x362eef.enumerable = _0x362eef.enumerable || false, _0x362eef.configurable = true, "value" in _0x362eef && (_0x362eef.writable = true), Object.defineProperty(_0x278602, _0x362eef.key, _0x362eef);
        }
    }
    var culture_object = function() {
        function _0x1acd21() {
            ! function(_0x3c13b1, _0x1c5502) {
                if (!(_0x3c13b1 instanceof _0x1c5502)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x1acd21);
        }
        var _0x430414, _0x34026e, _0x21efde;
        return _0x430414 = _0x1acd21, _0x21efde = [{
            key: "init",
            value: function() {
                console_object.Log("Initialize Autoculture", 2), _0x1acd21.initButton();
            }
        }, {
            key: "initButton",
            value: function() {
                _0x35174a.initButtons("Autoculture");
            }
        }, {
            key: "setSettings",
            value: function(_0x23bdf4) {
                "" !== _0x23bdf4 && null != _0x23bdf4 && $.extend(_0x1acd21.settings, _0x23bdf4);
            }
        }, {
            key: "checkAvailable",
            value: function(_0x28315a) {
                var _0x311920 = {
                        party: false,
                        triumph: false,
                        theater: false
                    },
                    _0x13937f = ITowns.towns[_0x28315a].buildings().attributes,
                    _0x2653f6 = ITowns.towns[_0x28315a].resources();
                return _0x13937f.academy >= 30 && _0x2653f6.wood >= 15e3 && _0x2653f6.stone >= 18e3 && _0x2653f6.iron >= 15e3 && (_0x311920.party = true), 1 === _0x13937f.theater && _0x2653f6.wood >= 1e4 && _0x2653f6.stone >= 12e3 && _0x2653f6.iron >= 1e4 && (_0x311920.theater = true), MM.getModelByNameAndPlayerId("PlayerKillpoints").getUnusedPoints() >= 300 && (_0x311920.triumph = true), _0x311920;
            }
        }, {
            key: "checkReady",
            value: function(_0x9197db) {
                return !ITowns.towns[_0x9197db.id].hasConqueror() && !!_0x35174a.modules.Autoculture.isOn && (_0x9197db.modules.Autoculture.isReadyTime >= Timestamp.now() ? _0x9197db.modules.Autoculture.isReadyTime : !(void 0 === _0x1acd21.settings.towns[_0x9197db.id] || !(_0x1acd21.settings.towns[_0x9197db.id].party && _0x1acd21.checkAvailable(_0x9197db.id).party || _0x1acd21.settings.towns[_0x9197db.id].triumph && _0x1acd21.checkAvailable(_0x9197db.id).triumph || _0x1acd21.settings.towns[_0x9197db.id].theater && _0x1acd21.checkAvailable(_0x9197db.id).theater)));
            }
        }, {
            key: "startCulture",
            value: function(_0x13ab1f) {
                return !!_0x1acd21.checkEnabled() && (_0x35174a.modules.Autoculture.isOn ? (_0x1acd21.town = _0x13ab1f, _0x1acd21.iTown = ITowns.towns[_0x1acd21.town.id], void(_0x35174a.currentTown !== _0x1acd21.town.key ? (console_object.Log(_0x1acd21.town.name + " move to town.", 2), api_object.switch_town(_0x1acd21.town.id, function() {
                    if (!_0x1acd21.checkEnabled()) return false;
                    _0x35174a.currentTown = _0x1acd21.town.key, _0x1acd21.start();
                })) : _0x1acd21.start())) : (_0x1acd21.finished(0), false));
            }
        }, {
            key: "start",
            value: function() {
                if (!_0x1acd21.checkEnabled()) return false;
                _0x1acd21.interval = setTimeout(function() {
                    void 0 !== _0x1acd21.settings.towns[_0x1acd21.town.id] && (console_object.Log(_0x1acd21.town.name + " getting event information.", 2), api_object.building_place(_0x1acd21.town.id, function(_0x2afe41) {
                        if (!_0x1acd21.checkEnabled()) return false;
                        var _0x57703c = [];
                        _0x57703c.push({
                            name: "triumph",
                            waiting: 19200,
                            element: $(_0x2afe41.plain.html).find("#place_triumph")
                        }), _0x57703c.push({
                            name: "party",
                            waiting: 57600,
                            element: $(_0x2afe41.plain.html).find("#place_party")
                        }), _0x57703c.push({
                            name: "theater",
                            waiting: 285120,
                            element: $(_0x2afe41.plain.html).find("#place_theater")
                        });
                        var _0x7aa6fc = false,
                            _0x3ce62b = 0,
                            _0x1fc8ce = 300;
                        ! function _0x3b8221(_0x3b5c39) {
                            if (3 === _0x3ce62b) return _0x7aa6fc || console_object.Log(_0x1acd21.town.name + " not ready yet.", 2), _0x1acd21.finished(_0x1fc8ce), false;
                            if ("triumph" === _0x3b5c39.name && (!_0x1acd21.settings.towns[_0x1acd21.town.id].triumph || !_0x1acd21.checkAvailable(_0x1acd21.town.id).triumph || MM.getModelByNameAndPlayerId("PlayerKillpoints").getUnusedPoints() < 300)) return _0x3ce62b++, _0x3b8221(_0x57703c[_0x3ce62b]), false;
                            if (!("party" !== _0x3b5c39.name || _0x1acd21.settings.towns[_0x1acd21.town.id].party && _0x1acd21.checkAvailable(_0x1acd21.town.id).party)) return _0x3ce62b++, _0x3b8221(_0x57703c[_0x3ce62b]), false;
                            if (!("theater" !== _0x3b5c39.name || _0x1acd21.settings.towns[_0x1acd21.town.id].theater && _0x1acd21.checkAvailable(_0x1acd21.town.id).theater)) return _0x3ce62b++, _0x3b8221(_0x57703c[_0x3ce62b]), false;
                            if (_0x3b5c39.element.find("#countdown_" + _0x3b5c39.name).length) {
                                var _0x1eae9c = autobot_object.timeToSeconds(_0x3b5c39.element.find("#countdown_" + _0x3b5c39.name).html());
                                return (300 === _0x1fc8ce || _0x1fc8ce > _0x1eae9c) && (_0x1fc8ce = _0x1eae9c), _0x3ce62b++, _0x3b8221(_0x57703c[_0x3ce62b]), false;
                            }
                            return "1" !== _0x3b5c39.element.find(".button, .button_new").data("enabled") ? (_0x3ce62b++, _0x3b8221(_0x57703c[_0x3ce62b]), false) : "1" === _0x3b5c39.element.find(".button, .button_new").data("enabled") ? (_0x1acd21.interval = setTimeout(function() {
                                _0x7aa6fc = true, _0x1acd21.startCelebration(_0x3b5c39, function(_0x512aee) {
                                    if (_0x1acd21.isPauzed) return false;
                                    (300 === _0x1fc8ce || _0x1fc8ce >= _0x512aee) && (_0x1fc8ce = _0x512aee), _0x3ce62b++, _0x3b8221(_0x57703c[_0x3ce62b]);
                                });
                            }, (_0x3ce62b + 1) * autobot_object.randomize(1e3, 2e3)), false) : (_0x3ce62b++, void _0x3b8221(_0x57703c[_0x3ce62b]));
                        }(_0x57703c[_0x3ce62b]);
                    }));
                }, autobot_object.randomize(2e3, 4e3));
            }
        }, {
            key: "startCelebration",
            value: function(_0x41d6cf, _0x31c2bd) {
                if (!_0x1acd21.checkEnabled()) return false;
                api_object.start_celebration(_0x1acd21.town.id, _0x41d6cf.name, function(_0x20ee6c) {
                    if (!_0x1acd21.checkEnabled()) return false;
                    var _0x5e2d4f = 0;
                    if (void 0 === _0x20ee6c.json.error) {
                        var _0xb043bb = {};
                        if ($.each(_0x20ee6c.json.notifications, function(_0x285ca3, _0x2878a6) {
                                "Celebration" === _0x2878a6.subject && (_0xb043bb = JSON.parse(_0x2878a6.param_str));
                            }), _0x1acd21.town.id === Game.townId)
                            for (var _0x330a93 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x2b98f6 = 0; _0x330a93.length > _0x2b98f6; _0x2b98f6++) _0x330a93[_0x2b98f6].getHandler().refresh();
                        void 0 !== _0xb043bb.Celebration && (console_object.Log('<span style="color: #fff;">' + PopupFactory.texts[_0xb043bb.Celebration.celebration_type] + " is started.</span>", 2), _0x5e2d4f = _0xb043bb.Celebration.finished_at - Timestamp.now());
                    } else console_object.Log(_0x1acd21.town.name + " " + _0x20ee6c.json.error, 2);
                    _0x31c2bd(_0x5e2d4f);
                });
            }
        }, {
            key: "stop",
            value: function() {
                clearInterval(_0x1acd21.interval), _0x1acd21.isStopped = true;
            }
        }, {
            key: "finished",
            value: function(_0x8c8523) {
                if (!_0x1acd21.checkEnabled()) return false;
                _0x1acd21.town.modules.Autoculture.isReadyTime = Timestamp.now() + _0x8c8523, _0x35174a.Queue.next();
            }
        }, {
            key: "checkEnabled",
            value: function() {
                return _0x35174a.modules.Autoculture.isOn;
            }
        }, {
            key: "contentSettings",
            value: function() {
                var _0x3aab02 = '<ul class="game_list" id="townsoverview"><li class="even">';
                _0x3aab02 += '<div class="towninfo small tag_header col w80 h25" id="header_town"></div>', _0x3aab02 += '<div class="towninfo small tag_header col w40" id="header_island"> Island</div>', _0x3aab02 += '<div class="towninfo small tag_header col w35" id="header_wood"><div class="col header wood"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w40" id="header_stone"><div class="col header stone"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w40" id="header_iron"><div class="col header iron"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w35" id="header_free_pop"><div class="col header free_pop"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w40" id="header_storage"><div class="col header storage"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration party"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration triumph"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration theater"></div></div>', _0x3aab02 += '<div style="clear:both;"></div>', _0x3aab02 += '</li></ul><div id="bot_townsoverview_table_wrapper">', _0x3aab02 += '<ul class="game_list scroll_content">';
                var _0x41a2cc = 0;
                $.each(_0x35174a.playerTowns, function(_0x2a0fc3, _0x242606) {
                    var _0x21ebfe = ITowns.towns[_0x242606.id],
                        _0x9f0cc3 = _0x21ebfe.getIslandCoordinateX(),
                        _0xf2ba13 = _0x21ebfe.getIslandCoordinateY(),
                        _0x12117d = _0x21ebfe.resources();
                    _0x3aab02 += '<li class="' + (_0x41a2cc % 2 ? "even" : "odd") + ' bottom" id="ov_town_' + _0x21ebfe.id + '">', _0x3aab02 += '<div class="towninfo small townsoverview col w80">', _0x3aab02 += "<div>", _0x3aab02 += '<span><a href="#' + _0x21ebfe.getLinkFragment() + '" class="gp_town_link">' + _0x21ebfe.name + "</a></span><br>", _0x3aab02 += "<span>(" + _0x21ebfe.getPoints() + " Ptn.)</span>", _0x3aab02 += "</div></div>", _0x3aab02 += '<div class="towninfo small townsoverview col w40">', _0x3aab02 += "<div>", _0x3aab02 += "<span>" + _0x9f0cc3 + "," + _0xf2ba13 + "</span>", _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div class="towninfo small townsoverview col w40">', _0x3aab02 += '<div class="wood' + (_0x12117d.wood === _0x12117d.storage ? " town_storage_full" : "") + '">', _0x3aab02 += _0x12117d.wood, _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div class="towninfo small townsoverview col w40">', _0x3aab02 += '<div class="stone' + (_0x12117d.stone === _0x12117d.storage ? " town_storage_full" : "") + '">', _0x3aab02 += _0x12117d.stone, _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div class="towninfo small townsoverview col w40">', _0x3aab02 += '<div class="iron' + (_0x12117d.iron === _0x12117d.storage ? " town_storage_full" : "") + '">', _0x3aab02 += _0x12117d.iron, _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div class="towninfo small townsoverview col w35">', _0x3aab02 += "<div>", _0x3aab02 += '<span class="town_population_count">' + _0x12117d.population + "</span>", _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div class="towninfo small townsoverview col w40">', _0x3aab02 += "<div>", _0x3aab02 += '<span class="storage">' + _0x12117d.storage + "</span>", _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div class="towninfo small townsoverview col w50">', _0x3aab02 += '<div class="culture_party_row" id="culture_party_' + _0x21ebfe.id + '">', _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div class="towninfo small townsoverview col w50">', _0x3aab02 += '<div class="culture_triumph_row" id="culture_triumph_' + _0x21ebfe.id + '">', _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div class="towninfo small townsoverview col w50">', _0x3aab02 += '<div class="culture_theater_row" id="culture_theater_' + _0x21ebfe.id + '">', _0x3aab02 += "</div>", _0x3aab02 += "</div>", _0x3aab02 += '<div style="clear:both;"></div>', _0x3aab02 += "</li>", _0x41a2cc++;
                }), _0x3aab02 += "</ul></div>", _0x3aab02 += '<div class="game_list_footer">', _0x3aab02 += '<div id="bot_culture_settings"></div>', _0x3aab02 += "</div>";
                var _0x35bd43 = {};

                function _0x3cebab(_0x22d4f8) {
                    var _0x340b97 = $(_0x22d4f8 + " .checkbox_new");
                    _0x35bd43[_0x22d4f8] ? (_0x340b97.removeClass("checked"), _0x340b97.find('input[type="checkbox"]').prop("checked", false), _0x35bd43[_0x22d4f8] = false) : (_0x340b97.addClass("checked"), _0x340b97.find('input[type="checkbox"]').prop("checked", true), _0x35bd43[_0x22d4f8] = true);
                }
                var _0x2bf6a6 = $(_0x3aab02);
                return _0x2bf6a6.find(".celebration.party").mousePopup(new MousePopup("Auto " + PopupFactory.texts.party)).on("click", function() {
                    _0x3cebab(".culture_party_row");
                }), _0x2bf6a6.find(".celebration.triumph").mousePopup(new MousePopup("Auto " + PopupFactory.texts.triumph)).on("click", function() {
                    _0x3cebab(".culture_triumph_row");
                }), _0x2bf6a6.find(".celebration.theater").mousePopup(new MousePopup("Auto " + PopupFactory.texts.theater)).on("click", function() {
                    _0x3cebab(".culture_theater_row");
                }), $.each(_0x35174a.playerTowns, function(_0x2cae28, _0x1f88ef) {
                    _0x2bf6a6.find("#culture_party_" + _0x1f88ef.id).html(menu_object.checkbox({
                        id: "bot_culture_party_" + _0x1f88ef.id,
                        name: "bot_culture_party_" + _0x1f88ef.id,
                        checked: _0x1f88ef.id in _0x1acd21.settings.towns && _0x1acd21.settings.towns[_0x1f88ef.id].party,
                        disabled: !_0x1acd21.checkAvailable(_0x1f88ef.id).party
                    })), _0x2bf6a6.find("#culture_triumph_" + _0x1f88ef.id).html(menu_object.checkbox({
                        id: "bot_culture_triumph_" + _0x1f88ef.id,
                        name: "bot_culture_triumph_" + _0x1f88ef.id,
                        checked: _0x1f88ef.id in _0x1acd21.settings.towns && _0x1acd21.settings.towns[_0x1f88ef.id].triumph,
                        disabled: !_0x1acd21.checkAvailable(_0x1f88ef.id).triumph
                    })), _0x2bf6a6.find("#culture_theater_" + _0x1f88ef.id).html(menu_object.checkbox({
                        id: "bot_culture_theater_" + _0x1f88ef.id,
                        name: "bot_culture_theater_" + _0x1f88ef.id,
                        checked: _0x1f88ef.id in _0x1acd21.settings.towns && _0x1acd21.settings.towns[_0x1f88ef.id].theater,
                        disabled: !_0x1acd21.checkAvailable(_0x1f88ef.id).theater
                    }));
                }), _0x2bf6a6.find("#bot_culture_settings").append(function() {
                    var _0x232038 = menu_object.button({
                        name: DM.getl10n("notes").btn_save,
                        style: "float: left;",
                        class: _0x35174a.hasPremium ? "" : " disabled"
                    }).on("click", function() {
                        if (!_0x35174a.hasPremium) return false;
                        var _0x34deac = $("#bot_townsoverview_table_wrapper input").serializeObject();
                        $.each(_0x35174a.playerTowns, function(_0x34c03c, _0x1cddb4) {
                            _0x1acd21.settings.towns[_0x1cddb4.id] = {
                                party: false,
                                triumph: false,
                                theater: false
                            };
                        }), $.each(_0x34deac, function(_0x3c1d1a, _0x5e013b) {
                            _0x3c1d1a.indexOf("bot_culture_party_") >= 0 ? _0x1acd21.settings.towns[_0x3c1d1a.replace("bot_culture_party_", "")].party = void 0 !== _0x5e013b : _0x3c1d1a.indexOf("bot_culture_triumph_") >= 0 ? _0x1acd21.settings.towns[_0x3c1d1a.replace("bot_culture_triumph_", "")].triumph = void 0 !== _0x5e013b : _0x3c1d1a.indexOf("bot_culture_theater_") >= 0 && (_0x1acd21.settings.towns[_0x3c1d1a.replace("bot_culture_theater_", "")].theater = void 0 !== _0x5e013b);
                        }), _0x1acd21.settings.autostart = $("#autoculture_autostart").prop("checked"), api_object.Auth("saveCulture", {
                            player_id: autobot_object.Account.player_id,
                            world_id: autobot_object.Account.world_id,
                            csrfToken: autobot_object.Account.csrfToken,
                            autoculture_settings: autobot_object.stringify(_0x1acd21.settings)
                        }, _0x1acd21.callbackSave);
                    });
                    return _0x35174a.hasPremium || _0x232038.mousePopup(new MousePopup(_0x35174a.requiredPrem)), _0x232038;
                }).append(menu_object.checkbox({
                    text: "AutoStart AutoCulture.",
                    id: "autoculture_autostart",
                    name: "autoculture_autostart",
                    checked: _0x1acd21.settings.autostart
                })), menu_object.gameWrapper("AutoCulture", "bot_townsoverview", _0x2bf6a6, "margin-bottom:9px;", !_0x35174a.hasPremium);
            }
        }, {
            key: "callbackSave",
            value: function() {
                console_object.Log("Settings saved", 2), HumanMessage.success("The settings were saved!");
            }
        }], (_0x34026e = null) && _0x5ebcfb(_0x430414.prototype, _0x34026e), _0x21efde && _0x5ebcfb(_0x430414, _0x21efde), _0x1acd21;
    }();
    Object.defineProperty(culture_object, "settings", {
        enumerable: true,
        writable: true,
        value: {
            autostart: false,
            towns: {}
        }
    }), Object.defineProperty(culture_object, "town", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(culture_object, "iTown", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(culture_object, "interval", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(culture_object, "isStopped", {
        enumerable: true,
        writable: true,
        value: false
    });

    function _0x2eea3e(_0x24bd48, _0x3d8771) {
        for (var _0x59b7ab = 0; _0x59b7ab < _0x3d8771.length; _0x59b7ab++) {
            var _0x389584 = _0x3d8771[_0x59b7ab];
            _0x389584.enumerable = _0x389584.enumerable || false, _0x389584.configurable = true, "value" in _0x389584 && (_0x389584.writable = true), Object.defineProperty(_0x24bd48, _0x389584.key, _0x389584);
        }
    }
    var build_object = function() {
        function _0x2c62c9() {
            ! function(_0x5e3386, _0x5aba6c) {
                if (!(_0x5e3386 instanceof _0x5aba6c)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x2c62c9);
        }
        var _0x3a1782, _0x1d4ec3, _0x59f0c0;
        return _0x3a1782 = _0x2c62c9, _0x59f0c0 = [{
            key: "init",
            value: function() {
                console_object.Log("Initialize Autobuild", 3), _0x2c62c9.initFunction(), _0x2c62c9.initButton(), _0x2c62c9.checkCaptain(), _0x2c62c9.activateCss();
            }
        }, {
            key: "setSettings",
            value: function(_0x599218) {
                "" !== _0x599218 && null != _0x599218 && $.extend(_0x2c62c9.settings, _0x599218);
            }
        }, {
            key: "activateCss",
            value: function() {
                $(".construction_queue_order_container").addClass("active");
            }
        }, {
            key: "setQueue",
            value: function(_0x1a7097, _0xea1553, _0x49ae6d) {
                "" !== _0x1a7097 && null != _0x1a7097 && (_0x2c62c9.building_queue = _0x1a7097, _0x2c62c9.initQueue($(".construction_queue_order_container"), "building")), "" !== _0xea1553 && null != _0xea1553 && (_0x2c62c9.units_queue = _0xea1553), "" !== _0x49ae6d && null != _0x49ae6d && (_0x2c62c9.ships_queue = _0x49ae6d);
            }
        }, {
            key: "calls",
            value: function(_0x986bda) {
                switch (_0x986bda) {
                    case "building_main/index":
                    case "building_main/build":
                    case "building_main/cancel":
                    case "building_main/tear_down":
                        _0x2c62c9.windows.building_main_index(_0x986bda);
                        break;
                    case "building_barracks/index":
                    case "building_barracks/build":
                    case "building_barracks/cancel":
                    case "building_barracks/tear_down":
                        _0x2c62c9.windows.building_barracks_index(_0x986bda);
                }
            }
        }, {
            key: "initFunction",
            value: function() {
                var _0x5766ee;
                GameViews.ConstructionQueueBaseView.prototype.renderQueue = (_0x5766ee = GameViews.ConstructionQueueBaseView.prototype.renderQueue, function() {
                    if (_0x5766ee.apply(this, arguments), "#building_tasks_main .various_orders_queue .frame-content .various_orders_content" !== this.$el.selector && "#ui_box .ui_construction_queue .construction_queue_order_container" !== this.$el.selector || _0x2c62c9.initQueue(this.$el, "building"), "#unit_orders_queue .js-researches-queue" === this.$el.selector) {
                        var _0x1fb734 = this.$el.find(".ui_various_orders");
                        _0x1fb734.hasClass("barracks") ? _0x2c62c9.initQueue(this.$el, "unit") : _0x1fb734.hasClass("docks") && _0x2c62c9.initQueue(this.$el, "ship");
                    }
                }), UnitOrder.selectUnit = function(_0x552d2a) {
                    return function() {
                        _0x552d2a.apply(this, arguments), this.barracks ? _0x2c62c9.initUnitOrder(this, "unit") : this.barracks || _0x2c62c9.initUnitOrder(this, "ship");
                    };
                }(UnitOrder.selectUnit);
            }
        }, {
            key: "initButton",
            value: function() {
                _0x35174a.initButtons("Autobuild");
            }
        }, {
            key: "checkCaptain",
            value: function() {
                $(".advisor_frame.captain div").hasClass("captain_active") && (_0x2c62c9.isCaptain = true), _0x2c62c9.Queue = _0x2c62c9.isCaptain ? 7 : 2;
            }
        }, {
            key: "checkReady",
            value: function(_0xba3b92) {
                var _0x4d7162 = ITowns.towns[_0xba3b92.id];
                return !!_0x35174a.modules.Autobuild.isOn && !_0x4d7162.hasConqueror() && !!(_0x2c62c9.settings.enable_building || _0x2c62c9.settings.enable_units || _0x2c62c9.settings.enable_ships) && (_0xba3b92.modules.Autobuild.isReadyTime >= Timestamp.now() ? _0xba3b92.modules.Autobuild.isReadyTime : !(void 0 === _0x2c62c9.building_queue[_0xba3b92.id] && void 0 === _0x2c62c9.units_queue[_0xba3b92.id] && void 0 === _0x2c62c9.ships_queue[_0xba3b92.id]));
            }
        }, {
            key: "startBuild",
            value: function(_0x2d1590) {
                if (!_0x2c62c9.checkEnabled()) return false;
                _0x2c62c9.town = _0x2d1590, _0x2c62c9.iTown = ITowns.towns[_0x2c62c9.town.id], _0x35174a.currentTown !== _0x2c62c9.town.key ? (console_object.Log(_0x2c62c9.town.name + " move to town.", 3), api_object.switch_town(_0x2c62c9.town.id, function() {
                    _0x35174a.currentTown = _0x2c62c9.town.key, _0x2c62c9.startUpgrade();
                })) : _0x2c62c9.startUpgrade();
            }
        }, {
            key: "startQueueing",
            value: function() {
                if (!_0x2c62c9.checkEnabled()) return false;
                void 0 === _0x2c62c9.building_queue[_0x2c62c9.town.id] && void 0 === _0x2c62c9.units_queue[_0x2c62c9.town.id] && void 0 === _0x2c62c9.ships_queue[_0x2c62c9.town.id] && _0x2c62c9.finished();
                var _0x13e2c9 = _0x2c62c9.getReadyTime(_0x2c62c9.town.id).shouldStart;
                "building" === _0x13e2c9 ? _0x2c62c9.startBuildBuilding() : "unit" === _0x13e2c9 || "ship" === _0x13e2c9 ? _0x2c62c9.startBuildUnits("unit" === _0x13e2c9 ? _0x2c62c9.units_queue : _0x2c62c9.ships_queue, _0x13e2c9) : _0x2c62c9.finished();
            }
        }, {
            key: "startUpgrade",
            value: function() {
                if (!_0x2c62c9.checkEnabled()) return false;
                GameDataInstantBuy.isEnabled() && _0x2c62c9.checkInstantComplete(_0x2c62c9.town.id) ? _0x2c62c9.interval = setTimeout(function() {
                    api_object.frontend_bridge(_0x2c62c9.town.id, {
                        model_url: "BuildingOrder/" + _0x2c62c9.instantBuyTown.order_id,
                        action_name: "buyInstant",
                        arguments: {
                            order_id: _0x2c62c9.instantBuyTown.order_id
                        },
                        town_id: _0x2c62c9.town.id,
                        nl_init: true
                    }, function(_0x1511d8) {
                        if (_0x1511d8.success) {
                            if (_0x2c62c9.town.id === Game.townId)
                                for (var _0x18d532 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x1067b2 = 0; _0x18d532.length > _0x1067b2; _0x1067b2++) _0x18d532[_0x1067b2].getHandler().refresh();
                            console_object.Log('<span style="color: #ffa03d;">' + _0x2c62c9.instantBuyTown.building_name.capitalize() + " - " + _0x1511d8.success + "</span>", 3);
                        }
                        _0x1511d8.error && console_object.Log(_0x2c62c9.town.name + " " + _0x1511d8.error, 3), _0x2c62c9.interval = setTimeout(function() {
                            _0x2c62c9.instantBuyTown = false, _0x2c62c9.startQueueing();
                        }, autobot_object.randomize(500, 700));
                    });
                }, autobot_object.randomize(1e3, 2e3)) : _0x2c62c9.startQueueing();
            }
        }, {
            key: "startBuildUnits",
            value: function(_0x4708e5, _0x8cd49f) {
                if (!_0x2c62c9.checkEnabled()) return false;
                if (void 0 !== _0x4708e5[_0x2c62c9.town.id])
                    if (void 0 !== _0x4708e5[_0x2c62c9.town.id]) {
                        var _0x4b274f = _0x4708e5[_0x2c62c9.town.id][0];
                        GameDataUnits.getMaxBuildForSingleUnit(_0x4b274f.item_name) >= _0x4b274f.count ? _0x2c62c9.interval = setTimeout(function() {
                            api_object.building_barracks(_0x2c62c9.town.id, {
                                unit_id: _0x4b274f.item_name,
                                amount: _0x4b274f.count,
                                town_id: _0x2c62c9.town.id,
                                nl_init: true
                            }, function(_0x59fc24) {
                                if (_0x59fc24.error) console_object.Log(_0x2c62c9.town.name + " " + _0x59fc24.error, 3);
                                else {
                                    if (_0x2c62c9.town.id === Game.townId)
                                        for (var _0x1190d1 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0xebd74 = 0; _0x1190d1.length > _0xebd74; _0xebd74++) _0x1190d1[_0xebd74].getHandler().refresh();
                                    console_object.Log('<span style="color: ' + ("unit" === _0x8cd49f ? "#ffe03d" : "#3dadff") + ';">Units - ' + _0x4b274f.count + " " + GameData.units[_0x4b274f.item_name].name_plural + " added.</span>", 3), api_object.Auth("removeItemQueue", {
                                        player_id: autobot_object.Account.player_id,
                                        world_id: autobot_object.Account.world_id,
                                        csrfToken: autobot_object.Account.csrfToken,
                                        town_id: _0x2c62c9.town.id,
                                        item_id: _0x4b274f.id,
                                        type: _0x8cd49f
                                    }, _0x2c62c9.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), _0x8cd49f)), $(".queue_id_" + _0x4b274f.id).remove();
                                }
                                _0x2c62c9.finished();
                            });
                        }, autobot_object.randomize(1e3, 2e3)) : (console_object.Log(_0x2c62c9.town.name + " recruiting " + _0x4b274f.count + " " + GameData.units[_0x4b274f.item_name].name_plural + " not ready.", 3), _0x2c62c9.finished());
                    } else _0x2c62c9.finished();
                else _0x2c62c9.finished();
            }
        }, {
            key: "startBuildBuilding",
            value: function() {
                if (!_0x2c62c9.checkEnabled()) return false;
                void 0 !== _0x2c62c9.building_queue[_0x2c62c9.town.id] && _0x2c62c9.building_queue[_0x2c62c9.town.id] ? _0x2c62c9.interval = setTimeout(function() {
                    console_object.Log(_0x2c62c9.town.name + " getting building information.", 3), api_object.building_main(_0x2c62c9.town.id, function(_0x101284) {
                        if (_0x2c62c9.hasFreeBuildingSlots(_0x101284)) {
                            var _0x34fb0 = _0x2c62c9.building_queue[_0x2c62c9.town.id][0];
                            if (void 0 !== _0x34fb0) {
                                var _0x936f75 = _0x2c62c9.getBuildings(_0x101284)[_0x34fb0.item_name];
                                _0x936f75.can_upgrade ? api_object.frontend_bridge(_0x2c62c9.town.id, {
                                    model_url: "BuildingOrder",
                                    action_name: "buildUp",
                                    arguments: {
                                        building_id: _0x34fb0.item_name
                                    },
                                    town_id: _0x2c62c9.town.id,
                                    nl_init: true
                                }, function(_0x13e7ca) {
                                    if (_0x13e7ca.success) {
                                        if (_0x2c62c9.town.id === Game.townId)
                                            for (var _0x5b3a08 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x47b571 = 0; _0x5b3a08.length > _0x47b571; _0x47b571++) _0x5b3a08[_0x47b571].getHandler().refresh();
                                        console_object.Log('<span style="color: #ffa03d;">' + _0x34fb0.item_name.capitalize() + " - " + _0x13e7ca.success + "</span>", 3), api_object.Auth("removeItemQueue", {
                                            player_id: autobot_object.Account.player_id,
                                            world_id: autobot_object.Account.world_id,
                                            csrfToken: autobot_object.Account.csrfToken,
                                            town_id: _0x2c62c9.town.id,
                                            item_id: _0x34fb0.id,
                                            type: "building"
                                        }, _0x2c62c9.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders"))), $(".queue_id_" + _0x34fb0.id).remove();
                                    }
                                    _0x13e7ca.error && console_object.Log(_0x2c62c9.town.name + " " + _0x13e7ca.error, 3), _0x2c62c9.finished();
                                }) : _0x936f75.enough_population ? _0x936f75.enough_resources ? (console_object.Log(_0x2c62c9.town.name + " " + _0x34fb0.item_name + " can not be started due dependencies.", 3), api_object.Auth("removeItemQueue", {
                                    player_id: autobot_object.Account.player_id,
                                    world_id: autobot_object.Account.world_id,
                                    csrfToken: autobot_object.Account.csrfToken,
                                    town_id: _0x2c62c9.town.id,
                                    item_id: _0x34fb0.id,
                                    type: "building"
                                }, _0x2c62c9.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders"))), $(".queue_id_" + _0x34fb0.id).remove(), _0x2c62c9.finished()) : (console_object.Log(_0x2c62c9.town.name + " not enough resources for " + _0x34fb0.item_name + ".", 3), _0x2c62c9.finished()) : (console_object.Log(_0x2c62c9.town.name + " not enough population for " + _0x34fb0.item_name + ".", 3), _0x2c62c9.finished());
                            } else _0x2c62c9.finished();
                        } else console_object.Log(_0x2c62c9.town.name + " no free building slots available.", 3), _0x2c62c9.finished();
                    });
                }, autobot_object.randomize(1e3, 2e3)) : _0x2c62c9.finished();
            }
        }, {
            key: "getReadyTime",
            value: function(_0x3d657c) {
                var _0x205ddb = {
                    building: {
                        queue: [],
                        timeLeft: 0
                    },
                    unit: {
                        queue: [],
                        timeLeft: 0
                    },
                    ship: {
                        queue: [],
                        timeLeft: 0
                    }
                };
                $.each(MM.getOnlyCollectionByName("BuildingOrder").models, function(_0x28fc5f, _0x509717) {
                    _0x3d657c === _0x509717.getTownId() && _0x205ddb.building.queue.push({
                        type: "building",
                        model: _0x509717
                    });
                }), $.each(MM.getOnlyCollectionByName("UnitOrder").models, function(_0x3f8e82, _0x2addfe) {
                    _0x3d657c === _0x2addfe.attributes.town_id && ("ground" === _0x2addfe.attributes.kind && _0x205ddb.unit.queue.push({
                        type: "unit",
                        model: _0x2addfe
                    }), "naval" === _0x2addfe.attributes.kind && _0x205ddb.ship.queue.push({
                        type: "ship",
                        model: _0x2addfe
                    }));
                });
                var _0x5add01 = null,
                    _0x11354b = "nothing";
                return $.each(_0x205ddb, function(_0x3b0e1b) {
                    ("building" === _0x3b0e1b && void 0 !== _0x2c62c9.building_queue[_0x3d657c] || "unit" === _0x3b0e1b && void 0 !== _0x2c62c9.units_queue[_0x3d657c] || "ship" === _0x3b0e1b && void 0 !== _0x2c62c9.ships_queue[_0x3d657c]) && (_0x11354b = _0x3b0e1b);
                }), GameDataInstantBuy.isEnabled() && _0x205ddb.building.queue.length > 0 && (_0x5add01 = _0x205ddb.building.queue[0].model.getTimeLeft() - 300), {
                    readyTime: Timestamp.now() + (_0x5add01 > 0 ? _0x5add01 : +_0x2c62c9.settings.timeinterval),
                    shouldStart: _0x11354b
                };
            }
        }, {
            key: "stop",
            value: function() {
                clearInterval(_0x2c62c9.interval);
            }
        }, {
            key: "checkEnabled",
            value: function() {
                return _0x35174a.modules.Autobuild.isOn;
            }
        }, {
            key: "finished",
            value: function() {
                if (!_0x2c62c9.checkEnabled()) return false;
                _0x2c62c9.town.modules.Autobuild.isReadyTime = _0x2c62c9.getReadyTime(_0x2c62c9.town.id).readyTime, _0x35174a.Queue.next();
            }
        }, {
            key: "checkInstantComplete",
            value: function(_0x16dd4b) {
                return _0x2c62c9.instantBuyTown = false, $.each(MM.getOnlyCollectionByName("BuildingOrder").models, function(_0x595abe, _0x1d8a53) {
                    if (_0x16dd4b === _0x1d8a53.getTownId() && _0x1d8a53.getTimeLeft() < 300) return _0x2c62c9.instantBuyTown = {
                        order_id: _0x1d8a53.id,
                        building_name: _0x1d8a53.getBuildingId()
                    }, false;
                }), _0x2c62c9.instantBuyTown;
            }
        }, {
            key: "checkBuildingDepencencies",
            value: function(_0x80cde4, _0x57ade8) {
                var _0x5c0926 = GameData.buildings[_0x80cde4].dependencies,
                    _0x5a2b59 = _0x57ade8.getBuildings().getBuildings(),
                    _0x3a0012 = [];
                return $.each(_0x5c0926, function(_0x43aea8, _0x222bd8) {
                    _0x5a2b59[_0x43aea8] < _0x222bd8 && _0x3a0012.push({
                        building_id: _0x43aea8,
                        level: _0x222bd8
                    });
                }), _0x3a0012;
            }
        }, {
            key: "callbackSaveBuilding",
            value: function(_0x48518f) {
                return function(_0x4133d6) {
                    _0x48518f.each(function() {
                        $(this).find(".empty_slot").remove(), _0x4133d6.item ? ($(this).append(_0x2c62c9.buildingElement($(this), _0x4133d6.item)), _0x2c62c9.setEmptyItems($(this))) : _0x2c62c9.setEmptyItems($(this));
                    }), delete _0x4133d6.item, _0x2c62c9.building_queue = _0x4133d6;
                };
            }
        }, {
            key: "callbackSaveSettings",
            value: function() {
                console_object.Log("Settings saved", 3), HumanMessage.success("The settings were saved!");
            }
        }, {
            key: "hasFreeBuildingSlots",
            value: function(_0x25d864) {
                var _0x5a3b20 = false;
                return void 0 !== _0x25d864 && /BuildingMain\.full_queue = false;/g.test(_0x25d864.html) && (_0x5a3b20 = true), _0x5a3b20;
            }
        }, {
            key: "getBuildings",
            value: function(_0x2edf6b) {
                var _0x23eeec = null;
                if (void 0 !== _0x2edf6b.html) {
                    var _0x740425 = _0x2edf6b.html.match(/BuildingMain\.buildings = (.*);/g);
                    void 0 !== _0x740425[0] && (_0x23eeec = JSON.parse(_0x740425[0].substring(25, _0x740425[0].length - 1)));
                }
                return _0x23eeec;
            }
        }, {
            key: "initQueue",
            value: function(_0x16db32, _0x1e0879) {
                var _0x1a1d41 = _0x16db32.find(".ui_various_orders");
                _0x1a1d41.find(".empty_slot").remove(), "building" === _0x1e0879 && ($("#building_tasks_main").addClass("active"), void 0 !== _0x2c62c9.building_queue[Game.townId] && $.each(_0x2c62c9.building_queue[Game.townId], function(_0x36b276, _0x5a4925) {
                    _0x1a1d41.append(_0x2c62c9.buildingElement(_0x1a1d41, _0x5a4925));
                })), "unit" === _0x1e0879 && ($("#unit_orders_queue").addClass("active"), void 0 !== _0x2c62c9.units_queue[Game.townId] && $.each(_0x2c62c9.units_queue[Game.townId], function(_0x43b4f9, _0x140c22) {
                    _0x1a1d41.append(_0x2c62c9.unitElement(_0x1a1d41, _0x140c22, _0x1e0879));
                })), "ship" === _0x1e0879 && ($("#unit_orders_queue").addClass("active"), void 0 !== _0x2c62c9.ships_queue[Game.townId] && $.each(_0x2c62c9.ships_queue[Game.townId], function(_0x402a7d, _0x6070b8) {
                    _0x1a1d41.append(_0x2c62c9.unitElement(_0x1a1d41, _0x6070b8, _0x1e0879));
                })), _0x2c62c9.setEmptyItems(_0x1a1d41), _0x1a1d41.parent().mousewheel(function(_0x407414, _0x3e3ded) {
                    this.scrollLeft -= 30 * _0x3e3ded, _0x407414.preventDefault();
                });
            }
        }, {
            key: "initUnitOrder",
            value: function(_0x523ff8, _0x45df02) {
                var _0x15faa3 = _0x523ff8.units[_0x523ff8.unit_id],
                    _0x5ec1ba = _0x523ff8.$el.find("#unit_order_confirm"),
                    _0x13a5c1 = _0x523ff8.$el.find("#unit_order_addqueue"),
                    _0x2b2935 = _0x523ff8.$el.find("#unit_order_slider");
                if (_0x13a5c1.length >= 0 && (_0x15faa3.missing_building_dependencies.length >= 1 || _0x15faa3.missing_research_dependencies.length >= 1) && _0x13a5c1.hide(), 0 === _0x15faa3.missing_building_dependencies.length && 0 === _0x15faa3.missing_research_dependencies.length) {
                    var _0x40bbe0 = ITowns.towns[Game.townId],
                        _0x368776 = _0x15faa3.max_build,
                        _0x2df979 = Math.max.apply(this, [_0x15faa3.resources.wood, _0x15faa3.resources.stone, _0x15faa3.resources.iron]),
                        _0x6f1c3 = [];
                    _0x6f1c3.push(Math.floor(_0x40bbe0.getStorage() / _0x2df979)), _0x6f1c3.push(Math.floor((_0x40bbe0.getAvailablePopulation() - _0x2c62c9.checkPopulationBeingBuild()) / _0x15faa3.population)), _0x15faa3.favor > 0 && _0x6f1c3.push(Math.floor(500 / _0x15faa3.favor));
                    var _0x4eb6e2 = Math.min.apply(this, _0x6f1c3);
                    _0x4eb6e2 > 0 && _0x4eb6e2 >= _0x368776 && _0x523ff8.slider.setMax(_0x4eb6e2), 0 === _0x13a5c1.length ? (_0x13a5c1 = $("<a/>", {
                        href: "#",
                        id: "unit_order_addqueue",
                        class: "confirm"
                    }), _0x5ec1ba.after(_0x13a5c1), _0x13a5c1.mousePopup(new MousePopup("Add to reqruite queue")).on("click", function(_0x49f41d) {
                        _0x49f41d.preventDefault(), _0x2c62c9.addUnitQueueItem(_0x15faa3, _0x45df02);
                    })) : (_0x13a5c1.unbind("click"), _0x13a5c1.on("click", function(_0x4fb1e0) {
                        _0x4fb1e0.preventDefault(), _0x2c62c9.addUnitQueueItem(_0x15faa3, _0x45df02);
                    })), _0x4eb6e2 <= 0 ? _0x13a5c1.hide() : _0x13a5c1.show(), _0x5ec1ba.show(), _0x2b2935.slider({
                        slide: function(_0x179725, _0x1cac2d) {
                            _0x1cac2d.value > _0x368776 ? _0x5ec1ba.hide() : _0x1cac2d.value >= 0 && _0x1cac2d.value <= _0x368776 && _0x5ec1ba.show(), 0 === _0x1cac2d.value ? _0x13a5c1.hide() : _0x1cac2d.value > 0 && _0x4eb6e2 > 0 && _0x13a5c1.show();
                        }
                    });
                }
            }
        }, {
            key: "checkBuildingLevel",
            value: function(_0x5efcdb) {
                console.log(_0x5efcdb);
                var _0x2ba324 = ITowns.towns[Game.townId].getBuildings().attributes[_0x5efcdb.item_name];
                return $.each(ITowns.towns[Game.townId].buildingOrders().models, function(_0x317478, _0x27ee5e) {
                    _0x27ee5e.attributes.building_type === _0x5efcdb.item_name && _0x2ba324++;
                }), void 0 !== _0x2c62c9.building_queue[Game.townId] && $(_0x2c62c9.building_queue[Game.townId]).each(function(_0x391793, _0x12da94) {
                    if (_0x12da94.id === _0x5efcdb.id) return false;
                    _0x12da94.item_name === _0x5efcdb.item_name && _0x2ba324++;
                }), ++_0x2ba324;
            }
        }, {
            key: "checkPopulationBeingBuild",
            value: function() {
                var _0x34a6a8 = 0;
                return void 0 !== _0x2c62c9.units_queue[Game.townId] && $(_0x2c62c9.units_queue[Game.townId].unit).each(function(_0x3c3144, _0x3f0a21) {
                    _0x34a6a8 += _0x3f0a21.count * GameData.units[_0x3f0a21.item_name].population;
                }), void 0 !== _0x2c62c9.ships_queue[Game.townId] && $(_0x2c62c9.ships_queue[Game.townId].ship).each(function(_0x5548b0, _0x26c22a) {
                    _0x34a6a8 += _0x26c22a.count * GameData.units[_0x26c22a.item_name].population;
                }), _0x34a6a8;
            }
        }, {
            key: "addUnitQueueItem",
            value: function(_0x3c0510, _0x20f8a1) {
                api_object.Auth("addItemQueue", {
                    player_id: autobot_object.Account.player_id,
                    world_id: autobot_object.Account.world_id,
                    csrfToken: autobot_object.Account.csrfToken,
                    town_id: Game.townId,
                    item_name: _0x3c0510.id,
                    type: _0x20f8a1,
                    count: UnitOrder.slider.getValue()
                }, _0x2c62c9.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), _0x20f8a1));
            }
        }, {
            key: "callbackSaveUnits",
            value: function(_0x4282da, _0x36b7cf) {
                return function(_0x1d2338) {
                    console.log(_0x1d2338), "unit" === _0x36b7cf ? _0x2c62c9.units_queue = _0x1d2338 : "ship" === _0x36b7cf && (_0x2c62c9.ships_queue = _0x1d2338), _0x4282da.each(function() {
                        $(this).find(".empty_slot").remove(), _0x1d2338.item ? ($(this).append(_0x2c62c9.unitElement($(this), _0x1d2338.item, _0x36b7cf)), _0x2c62c9.setEmptyItems($(this)), delete _0x1d2338.item) : _0x2c62c9.setEmptyItems($(this)), UnitOrder.selectUnit(UnitOrder.unit_id);
                    });
                };
            }
        }, {
            key: "setEmptyItems",
            value: function(_0x5ced05) {
                var _0x2a797b = 0,
                    _0x393fc6 = _0x5ced05.parent().width();
                $.each(_0x5ced05.find(".js-tutorial-queue-item"), function() {
                    _0x2a797b += $(this).outerWidth(true);
                });
                var _0x4b233b = _0x393fc6 - _0x2a797b;
                if (_0x4b233b >= 0) {
                    _0x5ced05.width(_0x393fc6);
                    for (var _0x55611b = 1; _0x55611b <= Math.floor(_0x4b233b) / 60; _0x55611b++) _0x5ced05.append($("<div/>", {
                        class: "js-queue-item js-tutorial-queue-item construction_queue_sprite empty_slot"
                    }));
                } else _0x5ced05.width(_0x2a797b + 25);
            }
        }, {
            key: "buildingElement",
            value: function(_0xf06a54, _0x8ae3d0) {
                return $("<div/>", {
                    class: "js-tutorial-queue-item queued_building_order last_order " + _0x8ae3d0.item_name + " queue_id_" + _0x8ae3d0.id
                }).append($("<div/>", {
                    class: "construction_queue_sprite frame"
                }).mousePopup(new MousePopup(_0x8ae3d0.item_name.capitalize() + " queued")).append($("<div/>", {
                    class: "item_icon building_icon40x40 js-item-icon build_queue " + _0x8ae3d0.item_name
                }).append($("<div/>", {
                    class: "building_level"
                }).append('<span class="construction_queue_sprite arrow_green_ver"></span>' + _0x2c62c9.checkBuildingLevel(_0x8ae3d0))))).append($("<div/>", {
                    class: "btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue"
                }).on("click", function(_0xe39ad9) {
                    _0xe39ad9.preventDefault(), api_object.Auth("removeItemQueue", {
                        player_id: autobot_object.Account.player_id,
                        world_id: autobot_object.Account.world_id,
                        csrfToken: autobot_object.Account.csrfToken,
                        town_id: Game.townId,
                        item_id: _0x8ae3d0.id,
                        type: "building"
                    }, _0x2c62c9.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders"))), $(".queue_id_" + _0x8ae3d0.id).remove();
                }).append($("<div/>", {
                    class: "left"
                })).append($("<div/>", {
                    class: "right"
                })).append($("<div/>", {
                    class: "caption js-caption"
                }).append($("<div/>", {
                    class: "effect js-effect"
                }))));
            }
        }, {
            key: "unitElement",
            value: function(_0x15ed7d, _0x4bb5da, _0xed46f8) {
                return $("<div/>", {
                    class: "js-tutorial-queue-item queued_building_order last_order " + _0x4bb5da.item_name + " queue_id_" + _0x4bb5da.id
                }).append($("<div/>", {
                    class: "construction_queue_sprite frame"
                }).mousePopup(new MousePopup(_0x4bb5da.item_name.capitalize().replace("_", " ") + " queued")).append($("<div/>", {
                    class: "item_icon unit_icon40x40 js-item-icon build_queue " + _0x4bb5da.item_name
                }).append($("<div/>", {
                    class: "unit_count text_shadow"
                }).html(_0x4bb5da.count)))).append($("<div/>", {
                    class: "btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue"
                }).on("click", function(_0x25fae1) {
                    _0x25fae1.preventDefault(), api_object.Auth("removeItemQueue", {
                        player_id: autobot_object.Account.player_id,
                        world_id: autobot_object.Account.world_id,
                        csrfToken: autobot_object.Account.csrfToken,
                        town_id: Game.townId,
                        item_id: _0x4bb5da.id,
                        type: _0xed46f8
                    }, _0x2c62c9.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), _0xed46f8)), $(".queue_id_" + _0x4bb5da.id).remove();
                }).append($("<div/>", {
                    class: "left"
                })).append($("<div/>", {
                    class: "right"
                })).append($("<div/>", {
                    class: "caption js-caption"
                }).append($("<div/>", {
                    class: "effect js-effect"
                }))));
            }
        }, {
            key: "contentSettings",
            value: function() {
                return $("<fieldset/>", {
                    id: "Autobuild_settings",
                    class: _0x35174a.hasPremium ? "" : "disabled-box",
                    style: "float:left; width:472px; height: 270px;"
                }).append($("<legend/>").html("Autobuild Settings")).append(menu_object.checkbox({
                    text: "AutoStart Autobuild.",
                    id: "autobuild_autostart",
                    name: "autobuild_autostart",
                    checked: _0x2c62c9.settings.autostart
                })).append(menu_object.selectBox({
                    id: "autobuild_timeinterval",
                    name: "autobuild_timeinterval",
                    label: "Check every: ",
                    styles: "width: 120px;",
                    value: _0x2c62c9.settings.timeinterval,
                    options: [{
                        value: "120",
                        name: "2 minutes"
                    }, {
                        value: "300",
                        name: "5 minutes"
                    }, {
                        value: "600",
                        name: "10 minutes"
                    }, {
                        value: "900",
                        name: "15 minutes"
                    }]
                })).append(menu_object.checkbox({
                    text: "Enable building queue.",
                    id: "autobuild_building_enable",
                    name: "autobuild_building_enable",
                    style: "width: 100%;padding-top: 35px;",
                    checked: _0x2c62c9.settings.enable_building
                })).append(menu_object.checkbox({
                    text: "Enable barracks queue.",
                    id: "autobuild_barracks_enable",
                    name: "autobuild_barracks_enable",
                    style: "width: 100%;",
                    checked: _0x2c62c9.settings.enable_units
                })).append(menu_object.checkbox({
                    text: "Enable ships queue.",
                    id: "autobuild_ships_enable",
                    name: "autobuild_ships_enable",
                    style: "width: 100%;padding-bottom: 35px;",
                    checked: _0x2c62c9.settings.enable_ships
                })).append(function() {
                    var _0x10bf19 = menu_object.button({
                        name: DM.getl10n("notes").btn_save,
                        style: "top: 10px;",
                        class: _0x35174a.hasPremium ? "" : " disabled"
                    }).on("click", function() {
                        if (!_0x35174a.hasPremium) return false;
                        var _0x487813 = $("#Autobuild_settings").serializeObject();
                        _0x2c62c9.settings.autostart = void 0 !== _0x487813.autobuild_autostart, _0x2c62c9.settings.timeinterval = parseInt(_0x487813.autobuild_timeinterval), _0x2c62c9.settings.autostart = void 0 !== _0x487813.autobuild_autostart, _0x2c62c9.settings.enable_building = void 0 !== _0x487813.autobuild_building_enable, _0x2c62c9.settings.enable_units = void 0 !== _0x487813.autobuild_barracks_enable, _0x2c62c9.settings.enable_ships = void 0 !== _0x487813.autobuild_ships_enable, _0x2c62c9.settings.instant_buy = void 0 !== _0x487813.autobuild_instant_buy, api_object.Auth("saveBuild", {
                            player_id: autobot_object.Account.player_id,
                            world_id: autobot_object.Account.world_id,
                            csrfToken: autobot_object.Account.csrfToken,
                            autobuild_settings: autobot_object.stringify(_0x2c62c9.settings)
                        }, _0x2c62c9.callbackSaveSettings);
                    });
                    return _0x35174a.hasPremium || _0x10bf19.mousePopup(new MousePopup(_0x35174a.requiredPrem)), _0x10bf19;
                });
            }
        }], (_0x1d4ec3 = null) && _0x2eea3e(_0x3a1782.prototype, _0x1d4ec3), _0x59f0c0 && _0x2eea3e(_0x3a1782, _0x59f0c0), _0x2c62c9;
    }();
    Object.defineProperty(build_object, "settings", {
        enumerable: true,
        writable: true,
        value: {
            autostart: false,
            enable_building: true,
            enable_units: true,
            enable_ships: true,
            timeinterval: 120,
            instant_buy: true
        }
    }), Object.defineProperty(build_object, "building_queue", {
        enumerable: true,
        writable: true,
        value: {}
    }), Object.defineProperty(build_object, "units_queue", {
        enumerable: true,
        writable: true,
        value: {}
    }), Object.defineProperty(build_object, "ships_queue", {
        enumerable: true,
        writable: true,
        value: {}
    }), Object.defineProperty(build_object, "town", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(build_object, "iTown", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(build_object, "interval", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(build_object, "currentWindow", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(build_object, "isCaptain", {
        enumerable: true,
        writable: true,
        value: false
    }), Object.defineProperty(build_object, "Queue", {
        enumerable: true,
        writable: true,
        value: 0
    }), Object.defineProperty(build_object, "ModuleManager", {
        enumerable: true,
        writable: true,
        value: void 0
    }), Object.defineProperty(build_object, "windows", {
        enumerable: true,
        writable: true,
        value: {
            wndId: null,
            wndContent: null,
            building_main_index: function() {
                if (GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING)) {
                    build_object.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING).getJQElement().find(".gpwindow_content");
                    var _0xedfa0a = build_object.currentWindow.find("#main_tasks h4");
                    _0xedfa0a.html(_0xedfa0a.html().replace(/\/.*\)/, "/&infin;)"));
                    var _0x28ee9c = ["theater", "thermal", "library", "lighthouse", "tower", "statue", "oracle", "trade_office"];
                    $.each($("#buildings .button_build.build_grey.build_up.small.bold"), function() {
                        var _0x5ab183 = $(this).parent().parent().attr("id").replace("building_main_", "");
                        build_object.checkBuildingDepencencies(_0x5ab183, ITowns.getTown(Game.townId)).length <= 0 && -1 === $.inArray(_0x5ab183, _0x28ee9c) && $(this).removeClass("build_grey").addClass("build").html("Add to queue").on("click", function(_0x43fce6) {
                            _0x43fce6.preventDefault(), api_object.Auth("addItemQueue", {
                                player_id: autobot_object.Account.player_id,
                                world_id: autobot_object.Account.world_id,
                                csrfToken: autobot_object.Account.csrfToken,
                                town_id: Game.townId,
                                item_name: _0x5ab183,
                                count: 1,
                                type: "building"
                            }, build_object.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders")));
                        });
                    });
                }
            },
            building_barracks_index: function() {
                GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING) && (build_object.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING).getJQElement().find(".gpwindow_content"), build_object.currentWindow.find("#unit_orders_queue h4").find(".js-max-order-queue-count").html("&infin;"));
            }
        }
    });

    function _0x254c19(_0x843aba, _0x3e6d2d) {
        for (var _0x58720d = 0; _0x58720d < _0x3e6d2d.length; _0x58720d++) {
            var _0x4df7cf = _0x3e6d2d[_0x58720d];
            _0x4df7cf.enumerable = _0x4df7cf.enumerable || false, _0x4df7cf.configurable = true, "value" in _0x4df7cf && (_0x4df7cf.writable = true), Object.defineProperty(_0x843aba, _0x4df7cf.key, _0x4df7cf);
        }
    }
    var _0x9724e2 = function() {
        function _0x53126f() {
            ! function(_0x57f211, _0x5b6385) {
                if (!(_0x57f211 instanceof _0x5b6385)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x53126f);
        }
        var _0x2baf0a, _0x42545b, _0xb66ef6;
        return _0x2baf0a = _0x53126f, _0xb66ef6 = [{
            key: "init",
            value: function() {
                _0x53126f.loadPlayerTowns(), _0x53126f.initButtons(), _0x53126f.initTimer();
            }
        }, {
            key: "start",
            value: function() {
                var _0x3fb6f9 = false,
                    _0x2ca9c8 = null;
                if ($.each(_0x53126f.playerTowns, function(_0x4f5a1a, _0x24c342) {
                        var _0x23e03c = farm_object.checkReady(_0x24c342);
                        true === _0x23e03c ? (_0x3fb6f9 = true, _0x53126f.Queue.add({
                            townId: _0x24c342.id,
                            fx: function() {
                                _0x24c342.startFarming();
                            }
                        })) : false !== _0x23e03c && (null == _0x2ca9c8 || _0x23e03c < _0x2ca9c8) && (_0x2ca9c8 = _0x23e03c);
                        var _0x39d13c = culture_object.checkReady(_0x24c342);
                        true === _0x39d13c ? (_0x3fb6f9 = true, _0x53126f.Queue.add({
                            townId: _0x24c342.id,
                            fx: function() {
                                _0x24c342.startCulture();
                            }
                        })) : false !== _0x39d13c && (null == _0x2ca9c8 || _0x39d13c < _0x2ca9c8) && (_0x2ca9c8 = _0x39d13c);
                        var _0x2c7ceb = build_object.checkReady(_0x24c342);
                        true === _0x2c7ceb ? (_0x3fb6f9 = true, _0x53126f.Queue.add({
                            townId: _0x24c342.id,
                            fx: function() {
                                _0x24c342.startBuild();
                            }
                        })) : false !== _0x2c7ceb && (null == _0x2ca9c8 || _0x2c7ceb < _0x2ca9c8) && (_0x2ca9c8 = _0x2c7ceb);
                    }), null !== _0x2ca9c8 || _0x3fb6f9)
                    if (_0x3fb6f9) _0x53126f.Queue.start();
                    else {
                        var _0xe9580d = _0x2ca9c8 - Timestamp.now() + 10;
                        _0x53126f.startTimer(_0xe9580d, function() {
                            _0x53126f.start();
                        });
                    }
                else console_object.Log("Nothing is ready yet!", 0), _0x53126f.startTimer(30, function() {
                    _0x53126f.start();
                });
            }
        }, {
            key: "stop",
            value: function() {
                clearInterval(_0x53126f.interval), _0x53126f.Queue.stop(), $("#time_autobot .caption .value_container .curr").html("Stopped");
            }
        }, {
            key: "finished",
            value: function() {
                _0x53126f.start();
            }
        }, {
            key: "initTimer",
            value: function() {
                $(".nui_main_menu").css("top", "275px"), $("#time_autobot").append(menu_object.timerBoxSmall({
                    id: "Autofarm_timer",
                    styles: "",
                    text: "Start Autobot"
                })).show();
            }
        }, {
            key: "updateTimer",
            value: function(_0x2c3564, _0x4b720b) {
                var _0x312a2a = 0;
                _0x312a2a = void 0 !== _0x2c3564 && void 0 !== _0x4b720b ? (_0x53126f.Queue.total - (_0x53126f.Queue.queue.length + 1) + _0x4b720b / _0x2c3564) / _0x53126f.Queue.total * 100 : (_0x53126f.Queue.total - _0x53126f.Queue.queue.length) / _0x53126f.Queue.total * 100, isNaN(_0x312a2a) || ($("#time_autobot .progress .indicator").width(_0x312a2a + "%"), $("#time_autobot .caption .value_container .curr").html(Math.round(_0x312a2a) + "%"));
            }
        }, {
            key: "checkAutostart",
            value: function() {
                if (farm_object.settings.autostart) {
                    _0x53126f.modules.Autofarm.isOn = true;
                    var _0x9ebb03 = $("#Autofarm_onoff");
                    _0x9ebb03.addClass("on"), _0x9ebb03.find("span").mousePopup(new MousePopup("Stop Autofarm"));
                }
                if (culture_object.settings.autostart) {
                    _0x53126f.modules.Autoculture.isOn = true;
                    var _0x50f9ec = $("#Autoculture_onoff");
                    _0x50f9ec.addClass("on"), _0x50f9ec.find("span").mousePopup(new MousePopup("Stop Autoculture"));
                }
                if (build_object.settings.autostart) {
                    _0x53126f.modules.Autobuild.isOn = true;
                    var _0x3b4a45 = $("#Autobuild_onoff");
                    _0x3b4a45.addClass("on"), _0x3b4a45.find("span").mousePopup(new MousePopup("Stop Autobuild"));
                }
                (farm_object.settings.autostart || culture_object.settings.autostart || build_object.settings.autostart) && _0x53126f.start();
            }
        }, {
            key: "startTimer",
            value: function(_0x560602, _0x173cd2) {
                var _0x1db276 = _0x560602;
                _0x53126f.interval = setInterval(function() {
                    $("#time_autobot .caption .value_container .curr").html(autobot_object.toHHMMSS(_0x560602)), $("#time_autobot .progress .indicator").width((_0x1db276 - _0x560602) / _0x1db276 * 100 + "%"), --_0x560602 < 0 && (clearInterval(_0x53126f.interval), _0x173cd2());
                }, 1e3);
            }
        }, {
            key: "initButtons",
            value: function(module_id) {
                var button_html = $("#" + module_id + "_onoff");
                button_html.removeClass("disabled"),
                button_html.on("click", function(_0x50cb90) {
                    if (_0x50cb90.preventDefault(), "Autoattack" === module_id && !autobot_object.checkPremium("captain")) {
                        HumanMessage.error(Game.premium_data.captain.name + " " + DM.getl10n("premium").advisors.not_activated.toLowerCase() + ".");
                        return false;
                    }
                    if(_0x53126f.modules[module_id].isOn){
                        _0x53126f.modules[module_id].isOn = false, 
                        button_html.removeClass("on"), 
                        button_html.find("span").mousePopup(new MousePopup("Start " + module_id)), 
                        HumanMessage.success(module_id + " is deactivated."), 
                        console_object.Log(module_id + " is deactivated.", 0);
                        switch (module_id){
                            case "Autofarm": farm_object.stop(); break;
                            case "Autoculture" : culture_object.stop(); break;
                            case "Autobuild" : build_object.stop(); break;
                            case "Autoattack" : attack_object.stop(); break;
                        };  
                    } else {
                        (button_html.addClass("on"),
                        HumanMessage.success(module_id + " is activated."), 
                        console_object.Log(module_id + " is activated.", 0), 
                        button_html.find("span").mousePopup(new MousePopup("Stop " + module_id)), 
                        _0x53126f.modules[module_id].isOn = true,
                        "Autoattack" === module_id && attack_object.start()), 
                        "Autoattack" !== module_id && _0x53126f.checkWhatToStart();
                    }
                         
                }), button_html.find("span").mousePopup(new MousePopup("Start " + module_id));
            }
        }, {
            key: "checkWhatToStart",
            value: function() {
                var _0x45d161 = 0;
                $.each(_0x53126f.modules, function(_0x582c11, _0x4571e3) {
                    _0x4571e3.isOn && "Autoattack" !== _0x4571e3 && _0x45d161++;
                }), 0 === _0x45d161 ? _0x53126f.stop() : _0x45d161 >= 0 && !_0x53126f.Queue.isRunning() && (clearInterval(_0x53126f.interval), _0x53126f.start());
            }
        }, {
            key: "loadPlayerTowns",
            value: function() {
                var _0x4d52fd = 0;
                $.each(ITowns.towns, function(_0x28757b, _0x1f89bc) {
                    var _0x37137e = new _0x53126f.models.Town;
                    _0x37137e.key = _0x4d52fd, _0x37137e.id = _0x1f89bc.id, _0x37137e.name = _0x1f89bc.name, $.each(ITowns.towns, function(_0x8a6277, _0x266b06) {
                        _0x1f89bc.getIslandCoordinateX() === _0x266b06.getIslandCoordinateX() && _0x1f89bc.getIslandCoordinateY() === _0x266b06.getIslandCoordinateY() && _0x1f89bc.id !== _0x266b06.id && _0x37137e.relatedTowns.push(_0x266b06.id);
                    }), _0x53126f.playerTowns.push(_0x37137e), _0x4d52fd++;
                }), _0x53126f.playerTowns.sort(function(_0x1b2019, _0x2656f6) {
                    var _0x5dd89a = _0x1b2019.name,
                        _0x2b0f84 = _0x2656f6.name;
                    return _0x5dd89a === _0x2b0f84 ? 0 : _0x5dd89a > _0x2b0f84 ? 1 : -1;
                });
            }
        }, {
            key: "callbackAuth",
            value: function(_0x130485) {
                autobot_object.isLogged = true, autobot_object.trial_time = _0x130485.trial_time, autobot_object.premium_time = _0x130485.premium_time, autobot_object.facebook_like = _0x130485.facebook_like, "" !== _0x130485.assistant_settings && _0x325bca.setSettings(_0x130485.assistant_settings), autobot_object.trial_time - Timestamp.now() >= 0 || true || autobot_object.premium_time - Timestamp.now() >= 0 ? (_0x53126f.hasPremium = true, _0x53126f.init(), farm_object.init(), farm_object.setSettings(_0x130485.autofarm_settings), culture_object.init(), culture_object.setSettings(_0x130485.autoculture_settings), build_object.init(), build_object.setSettings(_0x130485.autobuild_settings), build_object.setQueue(_0x130485.building_queue, _0x130485.units_queue, _0x130485.ships_queue), attack_object.init(), _0x53126f.checkAutostart()) : (_0x53126f.hasPremium = false, _0x53126f.init(), farm_object.init(), $("#Autoculture_onoff").mousePopup(new MousePopup(_0x53126f.requiredPrem)), $("#Autobuild_onoff").mousePopup(new MousePopup(_0x53126f.requiredPrem)), $("#Autoattack_onoff").mousePopup(new MousePopup(_0x53126f.requiredPrem)), autobot_object.createNotification("getPremiumNotification", "Unfortunately your premium membership is over. Please upgrade now!"));
            }
        }], (_0x42545b = null) && _0x254c19(_0x2baf0a.prototype, _0x42545b), _0xb66ef6 && _0x254c19(_0x2baf0a, _0xb66ef6), _0x53126f;
    }();
    Object.defineProperty(_0x9724e2, "models", {
        enumerable: true,
        writable: true,
        value: {
            Town: function() {
                this.key = null, this.id = null, this.name = null, this.farmTowns = {}, this.relatedTowns = [], this.currentFarmCount = 0, this.modules = {
                    Autofarm: {
                        isReadyTime: 0
                    },
                    Autoculture: {
                        isReadyTime: 0
                    },
                    Autobuild: {
                        isReadyTime: 0
                    }
                }, this.startFarming = function() {
                    farm_object.startFarming(this);
                }, this.startCulture = function() {
                    culture_object.startCulture(this);
                }, this.startBuild = function() {
                    build_object.startBuild(this);
                };
            }
        }
    }), Object.defineProperty(_0x9724e2, "Queue", {
        enumerable: true,
        writable: true,
        value: {
            total: 0,
            queue: [],
            add: function(_0x500697) {
                this.total++, this.queue.push(_0x500697);
            },
            start: function() {
                this.next();
            },
            stop: function() {
                this.queue = [];
            },
            isRunning: function() {
                return this.queue.length > 0 || this.total > 0;
            },
            next: function() {
                _0x9724e2.updateTimer();
                var _0x304e65 = this.queue.shift();
                _0x304e65 ? _0x304e65.fx() : this.queue.length <= 0 && (this.total = 0, _0x9724e2.finished());
            }
        }
    }), Object.defineProperty(_0x9724e2, "currentTown", {
        enumerable: true,
        writable: true,
        value: null
    }), Object.defineProperty(_0x9724e2, "playerTowns", {
        enumerable: true,
        writable: true,
        value: []
    }), Object.defineProperty(_0x9724e2, "interval", {
        enumerable: true,
        writable: true,
        value: false
    }), Object.defineProperty(_0x9724e2, "hasPremium", {
        enumerable: true,
        writable: true,
        value: false
    }), Object.defineProperty(_0x9724e2, "modules", {
        enumerable: true,
        writable: true,
        value: {
            Autofarm: {
                isOn: false
            },
            Autoculture: {
                isOn: false
            },
            Autobuild: {
                isOn: false
            },
            Autoattack: {
                isOn: false
            }
        }
    }), Object.defineProperty(_0x9724e2, "requiredPrem", {
        enumerable: true,
        writable: true,
        value: DM.getl10n("tooltips").requirements.replace(".", "") + " premium"
    });
    var _0x35174a = _0x9724e2;

    function _0x5b13a7(_0x85c1e0) {
        return (_0x5b13a7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(_0x3fae10) {
            return typeof _0x3fae10;
        } : function(_0x490920) {
            return _0x490920 && "function" == typeof Symbol && _0x490920.constructor === Symbol && _0x490920 !== Symbol.prototype ? "symbol" : typeof _0x490920;
        })(_0x85c1e0);
    }

    function _0x128e11(_0x3a5a93, _0x554f5f) {
        for (var _0x3d2396 = 0; _0x3d2396 < _0x554f5f.length; _0x3d2396++) {
            var _0x52a92b = _0x554f5f[_0x3d2396];
            _0x52a92b.enumerable = _0x52a92b.enumerable || false, _0x52a92b.configurable = true, "value" in _0x52a92b && (_0x52a92b.writable = true), Object.defineProperty(_0x3a5a93, _0x52a92b.key, _0x52a92b);
        }
    }
    var autobot_object = function() {
        function _0x32f1ad() {
            ! function(_0x21e2c0, _0xa1f942) {
                if (!(_0x21e2c0 instanceof _0xa1f942)) throw new TypeError("Cannot call a class as a function");
            }(this, _0x32f1ad), Object.defineProperty(this, "trial_time", {
                enumerable: true,
                writable: true,
                value: 0
            }), Object.defineProperty(this, "premium_time", {
                enumerable: true,
                writable: true,
                value: 0
            }), Object.defineProperty(this, "facebook_like", {
                enumerable: true,
                writable: true,
                value: 0
            }), Object.defineProperty(this, "toolbox_element", {
                enumerable: true,
                writable: true,
                value: null
            });
        }
        var _0x9645fd, _0x4697a3, _0x4c54db;
        return _0x9645fd = _0x32f1ad, _0x4c54db = [{
            key: "init",
            value: function() {
                console_object.Log("Initialize Autobot", 0), _0x32f1ad.authenticate(), _0x32f1ad.obServer(), _0x32f1ad.isActive(), _0x32f1ad.setToolbox(), _0x32f1ad.initAjax(), _0x32f1ad.initMapTownFeature(), _0x32f1ad.fixMessage(), _0x325bca.init();
            }
        }, {
            key: "setToolbox",
            value: function() {
                _0x32f1ad.toolbox_element = $(".nui_bot_toolbox");
            }
        }, {
            key: "authenticate",
            value: function() {
                api_object.Auth("login", _0x32f1ad.Account, _0x35174a.callbackAuth);
            }
        }, {
            key: "obServer",
            value: function() {
                $.Observer(GameEvents.notification.push).subscribe("GRCRTNotification", function() {
                    $("#notification_area>.notification.getPremiumNotification").on("click", function() {
                        _0x32f1ad.getPremium();
                    });
                });
            }
        }, {
            key: "initWnd",
            value: function() {
                if (_0x32f1ad.isLogged) {
                    if (void 0 !== _0x32f1ad.botWnd) {
                        try {
                            _0x32f1ad.botWnd.close();
                        } catch (_0x213c52) {}
                        _0x32f1ad.botWnd = void 0;
                    }
                    if (void 0 !== _0x32f1ad.botPremWnd) {
                        try {
                            _0x32f1ad.botPremWnd.close();
                        } catch (_0x1bdfdc) {}
                        _0x32f1ad.botPremWnd = void 0;
                    }
                    _0x32f1ad.botWnd = Layout.dialogWindow.open("", _0x32f1ad.title + ' v<span style="font-size: 10px;">' + _0x32f1ad.version + "</span>", 500, 350, "", false), _0x32f1ad.botWnd.setHeight([350]), _0x32f1ad.botWnd.setPosition(["center", "center"]);
                    var _0x1af1f8 = _0x32f1ad.botWnd.getJQElement();
                    _0x1af1f8.append($("<div/>", {
                        class: "menu_wrapper",
                        style: "left: 78px; right: 14px"
                    }).append($("<ul/>", {
                        class: "menu_inner"
                    }).prepend(_0x32f1ad.addMenuItem("AUTHORIZE", "Account", "Account")).prepend(_0x32f1ad.addMenuItem("CONSOLE", "Assistant", "Assistant")).prepend(_0x32f1ad.addMenuItem("ASSISTANT", "Console", "Console")).prepend(_0x32f1ad.addMenuItem("SUPPORT", "Support", "Support")))), _0x1af1f8.find(".menu_inner li:last-child").before(_0x32f1ad.addMenuItem("ATTACKMODULE", "Attack", "Autoattack")), _0x1af1f8.find(".menu_inner li:last-child").before(_0x32f1ad.addMenuItem("CONSTRUCTMODULE", "Build", "Autobuild")), _0x1af1f8.find(".menu_inner li:last-child").before(_0x32f1ad.addMenuItem("CULTUREMODULE", "Culture", "Autoculture")), _0x1af1f8.find(".menu_inner li:last-child").before(_0x32f1ad.addMenuItem("FARMMODULE", "Farm", "Autofarm")), $("#Autobot-AUTHORIZE").click();
                }
            }
        }, {
            key: "addMenuItem",
            value: function(_0x52f45d, _0x3a8959, _0x4e64a4, _0x26e24f) {
                return $("<li/>").append($("<a/>", {
                    class: "submenu_link",
                    href: "#",
                    id: "Autobot-" + _0x52f45d,
                    rel: _0x4e64a4
                }).click(function() {
                    if (_0x26e24f) return false;
                    if (_0x32f1ad.botWnd.getJQElement().find("li a.submenu_link").removeClass("active"), $(this).addClass("active"), _0x32f1ad.botWnd.setContent2(_0x32f1ad.getContent($(this).attr("rel"))), "Console" === $(this).attr("rel")) {
                        var _0x14e4a7 = $(".terminal"),
                            _0x43fc4e = $(".terminal-output")[0].scrollHeight;
                        _0x14e4a7.scrollTop(_0x43fc4e);
                    }
                }).append(function() {
                    return "Support" !== _0x4e64a4 ? $("<span/>", {
                        class: "left"
                    }).append($("<span/>", {
                        class: "right"
                    }).append($("<span/>", {
                        class: "middle"
                    }).html(_0x3a8959))) : '<a id="help-button" onclick="return false;" class="confirm"></a>';
                }));
            }
        }, {
            key: "getContent",
            value: function(_0x3ac254) {
                return "Console" === _0x3ac254 ? console_object.contentConsole() : "Account" === _0x3ac254 ? _0x32f1ad.contentAccount() : "Support" === _0x3ac254 ? _0x32f1ad.contentSupport() : "Autofarm" === _0x3ac254 ? farm_object.contentSettings() : "Autobuild" === _0x3ac254 ? build_object.contentSettings() : "Autoattack" === _0x3ac254 ? attack_object.contentSettings() : "Autoculture" === _0x3ac254 ? culture_object.contentSettings() : "Assistant" === _0x3ac254 ? _0x325bca.contentSettings() : void 0;
            }
        }, {
            key: "contentAccount",
            value: function() {
                var _0x2f8910 = {
                        "Name:": Game.player_name,
                        "World:": Game.world_id,
                        "Rank:": Game.player_rank,
                        "Towns:": Game.player_villages,
                        "Language:": Game.locale_lang
                    },
                    _0x23ab4e = $("<table/>", {
                        class: "game_table layout_main_sprite",
                        cellspacing: "0",
                        width: "100%"
                    }).append(function() {
                        var _0x57bbe1 = 0,
                            _0x4f7dfb = $("<tbody/>");
                        return $.each(_0x2f8910, function(_0x298076, _0x38e662) {
                            _0x4f7dfb.append($("<tr/>", {
                                class: _0x57bbe1 % 2 ? "game_table_even" : "game_table_odd"
                            }).append($("<td/>", {
                                style: "background-color: #DFCCA6;width: 30%;"
                            }).html(_0x298076)).append($("<td/>").html(_0x38e662))), _0x57bbe1++;
                        }), _0x4f7dfb.append($("<tr/>", {
                            class: "game_table_even"
                        }).append($("<td/>", {
                            style: "background-color: #DFCCA6;width: 30%;"
                        }).html("Premium:")).append($("<td/>").append(_0x32f1ad.premium_time - Timestamp.now() >= 0 ? _0x32f1ad.secondsToTime(_0x32f1ad.premium_time - Timestamp.now()) : "No premium").append($("<div/>", {
                            id: "premium-bot"
                        }).append($("<div/>", {
                            class: "js-caption"
                        }).html(_0x32f1ad.premium_time - Timestamp.now() >= 0 ? "Add days" : "Get Premium")).on("click", function() {
                            return _0x32f1ad.getPremium();
                        })))), _0x4f7dfb.append($("<tr/>", {
                            class: "game_table_odd"
                        }).append($("<td/>", {
                            style: "background-color: #DFCCA6;width: 30%;"
                        }).html("Trial:")).append($("<td/>").append(function() {
                            return _0x32f1ad.trial_time - Timestamp.now() >= 0 ? _0x32f1ad.secondsToTime(_0x32f1ad.trial_time - Timestamp.now()) : "Trial is over";
                        }).append(function() {
                            return 0 === _0x32f1ad.facebook_like ? $("<a/>", {
                                id: "get_7days"
                            }).html("Get 3 free days!").click("on", function() {
                                return _0x32f1ad.botFacebookWnd();
                            }) : null;
                        }))), _0x4f7dfb;
                    });
                return menu_object.gameWrapper("Account", "account_property_wrapper", _0x23ab4e, "margin-bottom:9px;").append($("<div/>", {
                    id: "grepobanner",
                    style: ""
                }));
            }
        }, {
            key: "contentSupport",
            value: function() {
                return $("<fieldset/>", {
                    id: "Support_tab",
                    style: "float:left; width:472px;height: 270px;"
                }).append($("<legend/>").html("Grepobot Support")).append($("<div/>", {
                    style: "float: left;"
                }).append(menu_object.selectBox({
                    id: "support_type",
                    name: "support_type",
                    label: "Type: ",
                    styles: "width: 167px;margin-left: 18px;",
                    value: "Bug report",
                    options: [{
                        value: "Bug report",
                        name: "Bug report"
                    }, {
                        value: "Feature request",
                        name: "Feature request"
                    }, {
                        value: "Financial",
                        name: "Financial"
                    }, {
                        value: "Other",
                        name: "Other"
                    }]
                })).append(menu_object.input({
                    id: "support_input_email",
                    name: "Email",
                    style: "margin-left: 12px;width: 166px;",
                    value: "",
                    type: "email"
                })).append(menu_object.input({
                    id: "support_input_subject",
                    name: "Subject",
                    style: "margin-top: 0;width: 166px;",
                    value: "",
                    type: "text"
                })).append(menu_object.textarea({
                    id: "support_textarea",
                    name: "Message",
                    value: ""
                })).append(menu_object.button({
                    name: "Send",
                    style: "margin-top: 0;"
                }).on("click", function() {
                    var _0x25b82d = $("#Support_tab").serializeObject(),
                        _0x13df60 = false;
                    void 0 === _0x25b82d.support_input_email || "" === _0x25b82d.support_input_email ? _0x13df60 = "Please enter your email." : void 0 === _0x25b82d.support_input_subject || "" === _0x25b82d.support_input_subject ? _0x13df60 = "Please enter a subject." : void 0 === _0x25b82d.support_textarea || "" === _0x25b82d.support_textarea ? _0x13df60 = "Please enter a message." : void 0 === _0x25b82d.support_input_email || /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(_0x25b82d.support_input_email) || (_0x13df60 = "Your email is not valid!"), _0x13df60 ? HumanMessage.error(_0x13df60) : api_object.Auth("supportEmail", $.extend({
                        csrfToken: _0x32f1ad.Account.csrfToken,
                        player_name: _0x32f1ad.Account.player_name,
                        player_id: _0x32f1ad.Account.player_id,
                        world_id: _0x32f1ad.Account.world_id
                    }, _0x25b82d), function(_0x872969) {
                        if (_0x872969.success) {
                            if (void 0 !== _0x32f1ad.botWnd) {
                                try {
                                    _0x32f1ad.botWnd.close();
                                } catch (_0x336581) {}
                                _0x32f1ad.botWnd = void 0;
                            }
                            HumanMessage.success("Thank you, your email has been send!");
                        }
                    });
                }))).append($("<div/>", {
                    style: "float: right; width: 215px;"
                }).append($("<a/>", {
                    id: "Facebook_grepobot",
                    target: "_blank",
                    href: "https://www.facebook.com/BotForGrepolis/"
                }).html('<img src="https://bot.grepobot.com/images/facebook_page.png" title="Facebook Grepobot"/>')));
            }
        }, {
            key: "checkAlliance",
            value: function() {
                $(".allianceforum.main_menu_item").hasClass("disabled") || api_object.members_show(function(_0x10a741) {
                    void 0 !== _0x10a741.plain.html && $.each($(_0x10a741.plain.html).find("#ally_members_body .ally_name a"), function() {
                        var _0x346083 = atob($(this).attr("href"));
                        console.log(JSON.parse(_0x346083.substr(0, _0x346083.length - 3)));
                    });
                });
            }
        }, {
            key: "fixMessage",
            value: function() {
                var _0x48731a;
                HumanMessage._initialize = (_0x48731a = HumanMessage._initialize, function() {
                    _0x48731a.apply(this, arguments), $(window).unbind("click");
                });
            }
        }, {
            key: "getPremium",
            value: function() {
                var _0x3eea3a = this;
                if (_0x32f1ad.isLogged) {
                    if ($.Observer(GameEvents.menu.click).publish({
                            option_id: "premium"
                        }), void 0 !== _0x32f1ad.botPremWnd) {
                        try {
                            _0x32f1ad.botPremWnd.close();
                        } catch (_0x4fba79) {}
                        _0x32f1ad.botPremWnd = void 0;
                    }
                    if (void 0 !== _0x32f1ad.botWnd) {
                        try {
                            _0x32f1ad.botWnd.close();
                        } catch (_0xe21845) {}
                        _0x32f1ad.botWnd = void 0;
                    }
                    _0x32f1ad.botPremWnd = Layout.dialogWindow.open("", "Autobot v" + _0x32f1ad.version + " - Premium", 500, 350, "", false), _0x32f1ad.botPremWnd.setHeight([350]), _0x32f1ad.botPremWnd.setPosition(["center", "center"]);
                    var _0x1fc633 = $("<div/>", {
                        id: "payment"
                    }).append($("<div/>", {
                        id: "left"
                    }).append($("<ul/>", {
                        id: "time_options"
                    }).append($("<li/>", {
                        class: "active"
                    }).append($("<span/>", {
                        class: "amount"
                    }).html("1 Month")).append($("<span/>", {
                        class: "price"
                    }).html("€&nbsp;4,99"))).append($("<li/>").append($("<span/>", {
                        class: "amount"
                    }).html("2 Month")).append($("<span/>", {
                        class: "price"
                    }).html("€&nbsp;9,99")).append($("<div/>", {
                        class: "referenceAmount"
                    }).append($("<div/>", {
                        class: "reference",
                        style: "transform: rotate(17deg);"
                    }).html("+12 Days&nbsp;")))).append($("<li/>").append($("<span/>", {
                        class: "amount"
                    }).html("4 Months")).append($("<span/>", {
                        class: "price"
                    }).html("€&nbsp;19,99")).append($("<div/>", {
                        class: "referenceAmount"
                    }).append($("<div/>", {
                        class: "reference",
                        style: "transform: rotate(17deg);"
                    }).html("+36 Days&nbsp;")))).append($("<li/>").append($("<span/>", {
                        class: "amount"
                    }).html("10 Months")).append($("<span/>", {
                        class: "price"
                    }).html("€&nbsp;49,99")).append($("<div/>", {
                        class: "referenceAmount"
                    }).append($("<div/>", {
                        class: "reference",
                        style: "transform: rotate(17deg);"
                    }).html("+120 Days&nbsp;")))))).append($("<div/>", {
                        id: "right"
                    }).append($("<div/>", {
                        id: "pothead"
                    })).append($("<div/>", {
                        id: "information"
                    })));
                    _0x32f1ad.botPremWnd.setContent2(_0x1fc633), $("#time_options li").on("click", function() {
                        $("#time_options li").removeClass("active"), $(this).addClass("active");
                    }), api_object.PaymentOptions(function(_0x6ca8e7) {
                        _0x3eea3a.makeSelectbox(_0x6ca8e7);
                    });
                }
            }
        }, {
            key: "makeSelectbox",
            value: function(_0x1ace7d) {
                var _0x1dc3ef = {},
                    _0x30eea8 = $("<select/>", {
                        id: "paymentSelect"
                    }).append(function() {
                        for (var _0x40278e = [], _0x526373 = 0; _0x526373 < _0x1ace7d.length; _0x526373++) {
                            var _0x2ec83e = _0x1ace7d[_0x526373];
                            _0x1dc3ef[_0x2ec83e.id] = {
                                small: _0x2ec83e.image.size1x,
                                big: _0x2ec83e.image.size2x
                            }, _0x40278e.push($("<option/>", {
                                value: _0x2ec83e.id
                            }).html(_0x2ec83e.description.replace("Button", "")));
                        }
                        return _0x40278e;
                    });
                $("#payment #information").append(_0x30eea8);
                var _0x4865aa = _0x30eea8,
                    _0x589a99 = _0x30eea8.children("option").length;
                _0x30eea8.addClass("s-hidden"), _0x4865aa.wrap('<div class="select"></div>'), _0x4865aa.after('<div class="styledSelect"></div>');
                var _0x5a2cf8 = _0x4865aa.next("div.styledSelect");
                _0x5a2cf8.text(_0x4865aa.children("option").eq(0).text()), $("#payment #information").append(function() {
                    var _0x478ff1 = _0x4865aa.children("option").eq(0).val();
                    return $("<div/>", {
                        id: "payment-button",
                        style: "background-image: url('".concat(_0x1dc3ef[_0x478ff1].big, "')")
                    }).on("click", function() {
                        return _0x32f1ad.doPayment($("#time_options").children(".active").index() + 1, _0x478ff1);
                    });
                });
                for (var _0x250f4c = $("<ul />", {
                        class: "options"
                    }).insertAfter(_0x5a2cf8), _0x3833aa = 0; _0x3833aa < _0x589a99; _0x3833aa++) {
                    var _0x51054b = _0x4865aa.children("option").eq(_0x3833aa).val();
                    $("<li />", {
                        text: _0x4865aa.children("option").eq(_0x3833aa).text(),
                        rel: _0x51054b
                    }).append($("<div/>", {
                        class: "payment-option",
                        style: "background-image: url('".concat(_0x1dc3ef[_0x51054b].small, "')")
                    })).appendTo(_0x250f4c);
                }
                var _0x119b88 = _0x250f4c.children("li");
                _0x5a2cf8.click(function(_0x379d64) {
                    _0x379d64.stopPropagation(), $("div.styledSelect.active").each(function() {
                        $(this).removeClass("active").next("ul.options").hide();
                    }), $(this).toggleClass("active").next("ul.options").toggle();
                }), _0x119b88.click(function(_0x1db48f) {
                    var _0x4d73cf = this;
                    _0x1db48f.stopPropagation(), $("#payment-button").remove(), _0x5a2cf8.text($(this).text()).removeClass("active"), $("#payment #information").append($("<div/>", {
                        id: "payment-button",
                        style: "background-image: url('".concat(_0x1dc3ef[$(this).attr("rel")].big, "')")
                    }).on("click", function() {
                        return _0x32f1ad.doPayment($("#time_options").children(".active").index() + 1, $(_0x4d73cf).attr("rel"));
                    })), _0x4865aa.val($(this).attr("rel")), _0x250f4c.hide();
                }), $(document).click(function() {
                    _0x5a2cf8.removeClass("active"), _0x250f4c.hide();
                });
            }
        }, {
            key: "doPayment",
            value: function(_0xd89db7, _0x1fca1b) {
                window.open(_0x32f1ad.domain + "payment?option=" + _0xd89db7 + "&method=" + _0x1fca1b + "&player_id=" + _0x32f1ad.Account.player_id, "grepolis_payment", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,height=650,width=800");
            }
        }, {
            key: "botFacebookWnd",
            value: function() {
                if (_0x32f1ad.isLogged && 0 === _0x32f1ad.facebook_like) {
                    if (void 0 !== _0x32f1ad.facebookWnd) {
                        try {
                            _0x32f1ad.facebookWnd.close();
                        } catch (_0x169bf2) {}
                        _0x32f1ad.facebookWnd = void 0;
                    }
                    _0x32f1ad.facebookWnd = Layout.dialogWindow.open("", "Autobot v" + _0x32f1ad.version + " - Get 3 days free!", 275, 125, "", false), _0x32f1ad.facebookWnd.setHeight([125]), _0x32f1ad.facebookWnd.setPosition(["center", "center"]);
                    var _0x47ffb0 = $("<div/>", {
                        id: "facebook_wnd"
                    }).append('<span class="like-share-text">Like & share and get <b>3 days</b> free premium.</span><a href="#" class="fb-share"><span class="fb-text">Share</spanclass></a><div class="fb_like"><div class="fb-like" data-href="https://www.facebook.com/BotForGrepolis/" data-layout="button" data-action="like" data-show-faces="false" data-share="false"></div></div>');
                    _0x32f1ad.facebookWnd.setContent2(_0x47ffb0), $(".ui-dialog #facebook_wnd").closest(".gpwindow_content").css({
                        left: "-9px",
                        right: "-9px",
                        top: "35px"
                    });
                    var _0x5524ab = false,
                        _0x58b9df = false,
                        _0x3a96fa = function() {
                            if ((_0x5524ab || _0x58b9df) && _0x32f1ad.upgrade3Days(), _0x5524ab && _0x58b9df) {
                                if ($.Observer(GameEvents.window.quest.open).publish({
                                        quest_type: "hermes"
                                    }), HumanMessage.success("You have received 3 days premium! Thank you for sharing."), void 0 !== _0x32f1ad.facebookWnd) {
                                    try {
                                        _0x32f1ad.facebookWnd.close();
                                    } catch (_0x2fa476) {}
                                    _0x32f1ad.facebookWnd = void 0;
                                }
                                if (void 0 !== _0x32f1ad.botWnd) {
                                    try {
                                        _0x32f1ad.botWnd.close();
                                    } catch (_0x3aaabd) {}
                                    _0x32f1ad.botWnd = void 0;
                                }
                            }
                        };
                    void 0 === window.fbAsyncInit && (window.fbAsyncInit = function() {
                        FB.init({
                            appId: "1505555803075328",
                            xfbml: true,
                            version: "v2.4"
                        }), FB.Event.subscribe("edge.create", function() {
                            _0x58b9df = true, _0x3a96fa();
                        }), FB.Event.subscribe("edge.remove", function() {
                            _0x58b9df = false;
                        });
                    }), $("#facebook-jssdk").length <= 0 ? (_0x2d0c12 = document, _0x128ac8 = "script", _0x4c49fb = "facebook-jssdk", _0x67cfba = _0x2d0c12.getElementsByTagName(_0x128ac8)[0], _0x2d0c12.getElementById(_0x4c49fb) || ((_0x1b50a4 = _0x2d0c12.createElement(_0x128ac8)).id = _0x4c49fb, _0x1b50a4.src = "//connect.facebook.net/en_US/sdk.js", _0x67cfba.parentNode.insertBefore(_0x1b50a4, _0x67cfba))) : FB.XFBML.parse(), $("#facebook_wnd .fb-share").on("click", function() {
                        FB.ui({
                            method: "share",
                            href: "https://www.facebook.com/BotForGrepolis/"
                        }, function(_0x3274de) {
                            _0x3274de && !_0x3274de.error_code && (_0x5524ab = true, _0x3a96fa());
                        });
                    });
                }
                var _0x2d0c12, _0x128ac8, _0x4c49fb, _0x1b50a4, _0x67cfba;
            }
        }, {
            key: "upgrade3Days",
            value: function() {
                api_object.Auth("upgrade3Days", _0x32f1ad.Account, function(_0x43b2ad) {
                    _0x43b2ad.success && api_object.Auth("login", _0x32f1ad.Account, _0x35174a.callbackAuth);
                });
            }
        }, {
            key: "initAjax",
            value: function() {
                $(document).ajaxComplete(function(_0x463c4a, _0x4eec6e, _0x2bb2a7) {
                    if (-1 === _0x2bb2a7.url.indexOf(_0x32f1ad.domain) && -1 !== _0x2bb2a7.url.indexOf("/game/") && 4 === _0x4eec6e.readyState && 200 === _0x4eec6e.status) {
                        var _0x25ed02 = _0x2bb2a7.url.split("?"),
                            _0x38f326 = _0x25ed02[0].substr(6) + "/" + _0x25ed02[1].split("&")[1].substr(7);
                        void 0 !== build_object && build_object.calls(_0x38f326), void 0 !== attack_object && attack_object.calls(_0x38f326, _0x4eec6e.responseText);
                    }
                });
            }
        }, {
            key: "randomize",
            value: function(_0x253e60, _0x457001) {
                return Math.floor(Math.random() * (_0x457001 - _0x253e60 + 1)) + _0x253e60;
            }
        }, {
            key: "secondsToTime",
            value: function(_0x470d8a) {
                var _0x58cd57 = Math.floor(_0x470d8a / 86400),
                    _0x5725fe = Math.floor(_0x470d8a % 86400 / 3600),
                    _0x1aa80e = Math.floor(_0x470d8a % 86400 % 3600 / 60);
                return (_0x58cd57 ? _0x58cd57 + " days " : "") + (_0x5725fe ? _0x5725fe + " hours " : "") + (_0x1aa80e ? _0x1aa80e + " minutes " : "");
            }
        }, {
            key: "timeToSeconds",
            value: function(_0x4c41ad) {
                for (var _0x5e6c59 = _0x4c41ad.split(":"), _0x46c97c = 0, _0x1fc351 = 1; _0x5e6c59.length > 0;) _0x46c97c += _0x1fc351 * parseInt(_0x5e6c59.pop(), 10), _0x1fc351 *= 60;
                return _0x46c97c;
            }
        }, {
            key: "arrowActivated",
            value: function() {
                var _0x58e052 = $("<div/>", {
                    class: "helpers helper_arrow group_quest d_w animate bounce",
                    "data-direction": "w",
                    style: "top: 0; left: 360px; visibility: visible; display: none;"
                });
                _0x32f1ad.toolbox_element.append(_0x58e052), _0x58e052.show().animate({
                    left: "138px"
                }, "slow").delay(1e4).fadeOut("normal"), setTimeout(function() {
                    _0x32f1ad.botFacebookWnd();
                }, 25e3);
            }
        }, {
            key: "createNotification",
            value: function(_0x167d10, _0x5019ac) {
                (void 0 === Layout.notify ? new NotificationHandler : Layout).notify($("#notification_area>.notification").length + 1, _0x167d10, "<span><b>Autobot</b></span>" + _0x5019ac + "<span class='small notification_date'>Version " + _0x32f1ad.version + "</span>");
            }
        }, {
            key: "toHHMMSS",
            value: function(_0x396bc0) {
                var _0x517441 = ~~(_0x396bc0 / 3600),
                    _0x7df6f9 = ~~(_0x396bc0 % 3600 / 60),
                    _0x2f570a = _0x396bc0 % 60,
                    _0x2ac6f1 = "";
                return _0x517441 > 0 && (_0x2ac6f1 += _0x517441 + ":" + (_0x7df6f9 < 10 ? "0" : "")), _0x2ac6f1 += _0x7df6f9 + ":" + (_0x2f570a < 10 ? "0" : ""), _0x2ac6f1 += "" + _0x2f570a;
            }
        }, {
            key: "stringify",
            value: function(_0x5e37e3) {
                var _0x2403aa = _0x5b13a7(_0x5e37e3);
                if ("string" === _0x2403aa) return '"' + _0x5e37e3 + '"';
                if ("boolean" === _0x2403aa || "number" === _0x2403aa) return _0x5e37e3;
                if ("function" === _0x2403aa) return _0x5e37e3.toString();
                var _0xebdddc = [];
                for (var _0x1c31fa in _0x5e37e3) _0xebdddc.push('"' + _0x1c31fa + '":' + this.stringify(_0x5e37e3[_0x1c31fa]));
                return "{" + _0xebdddc.join(",") + "}";
            }
        }, {
            key: "isActive",
            value: function() {
                setTimeout(function() {
                    api_object.Auth("isActive", _0x32f1ad.Account, _0x32f1ad.isActive);
                }, 6e4);
            }
        }, {
            key: "town_map_info",
            value: function(_0x2349ea, _0x1ce465) {
                if (void 0 !== _0x2349ea && _0x2349ea.length > 0 && _0x1ce465.player_name)
                    for (var _0xab4296 = 0; _0xab4296 < _0x2349ea.length; _0xab4296++)
                        if ("flag town" === _0x2349ea[_0xab4296].className) {
                            void 0 !== _0x325bca && (_0x325bca.settings.town_names && $(_0x2349ea[_0xab4296]).addClass("active_town"), _0x325bca.settings.player_name && $(_0x2349ea[_0xab4296]).addClass("active_player"), _0x325bca.settings.alliance_name && $(_0x2349ea[_0xab4296]).addClass("active_alliance")), $(_0x2349ea[_0xab4296]).append('<div class="player_name">' + (_0x1ce465.player_name || "") + "</div>"), $(_0x2349ea[_0xab4296]).append('<div class="town_name">' + _0x1ce465.name + "</div>"), $(_0x2349ea[_0xab4296]).append('<div class="alliance_name">' + (_0x1ce465.alliance_name || "") + "</div>");
                            break;
                        }
                return _0x2349ea;
            }
        }, {
            key: "checkPremium",
            value: function(_0x13ffbf) {
                return $(".advisor_frame." + _0x13ffbf + " div").hasClass(_0x13ffbf + "_active");
            }
        }, {
            key: "initWindow",
            value: function() {
                $(".nui_main_menu").css("top", "249px"), $("<div/>", {
                    class: "nui_bot_toolbox"
                }).append($("<div/>", {
                    class: "bot_menu layout_main_sprite"
                }).append($("<ul/>").append($("<li/>", {
                    id: "Autofarm_onoff",
                    class: "disabled"
                }).append($("<span/>", {
                    class: "autofarm farm_town_status_0"
                }))).append($("<li/>", {
                    id: "Autoculture_onoff",
                    class: "disabled"
                }).append($("<span/>", {
                    class: "autoculture farm_town_status_0"
                }))).append($("<li/>", {
                    id: "Autobuild_onoff",
                    class: "disabled"
                }).append($("<span/>", {
                    class: "autobuild toolbar_activities_recruits"
                }))).append($("<li/>", {
                    id: "Autoattack_onoff",
                    class: "disabled"
                }).append($("<span/>", {
                    class: "autoattack sword_icon"
                }))).append($("<li/>").append($("<span/>", {
                    href: "#",
                    class: "botsettings circle_button_settings"
                }).on("click", function() {
                    _0x32f1ad.isLogged && _0x32f1ad.initWnd();
                }).mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.settings)))))).append($("<div/>", {
                    id: "time_autobot",
                    class: "time_row"
                })).append($("<div/>", {
                    class: "bottom"
                })).insertAfter(".nui_left_box");
            }
        }, {
            key: "initMapTownFeature",
            value: function() {
                var _0x2d5719;
                MapTiles.createTownDiv = (_0x2d5719 = MapTiles.createTownDiv, function() {
                    var _0x43cf3c = _0x2d5719.apply(this, arguments);
                    return _0x32f1ad.town_map_info(_0x43cf3c, arguments[0]);
                });
            }
        },{
            key : "title",
            value : "Autobot"
          },{
            key : "version",
            value : "4.0"
          },{
            key : "domain",
            value : "https://bot.grepobot.com/"
          },{
            key : "botWnd",
            value : ""
          },{
            key : "botPremWnd",
            value : ""
          },{
            key : "botEmailWnd",
            value : ""
          },{
            key : "facebookWnd",
            value : ""
          },{
            key : "isLogged",
            value : false
          },{
            key : "Account",
            value : {
              player_id : Game.player_id,
              player_name : Game.player_name,
              world_id : Game.world_id,
              locale_lang : Game.locale_lang,
              premium_grepolis : Game.premium_user,
              csrfToken : Game.csrfToken
            }
          }], (_0x4697a3 = null) && _0x128e11(_0x9645fd.prototype, _0x4697a3), _0x4c54db && _0x128e11(_0x9645fd, _0x4c54db), _0x32f1ad;
    }();
    
        !function() {
            String.prototype.capitalize = function() {
                return this.charAt(0).toUpperCase() + this.slice(1);
            }, $.fn.serializeObject = function() {
                var _0x4e1267 = {},
                    _0x5033e6 = this.serializeArray();
                return $.each(_0x5033e6, function() {
                    void 0 !== _0x4e1267[this.name] ? (_0x4e1267[this.name].push || (_0x4e1267[this.name] = [_0x4e1267[this.name]]), _0x4e1267[this.name].push(this.value || "")) : _0x4e1267[this.name] = this.value || "";
                }), _0x4e1267;
            };
            var _0x3b9c10 = setInterval(function() {
                void 0 !== window.$ && $(".nui_main_menu").length && !$.isEmptyObject(ITowns.towns) && (clearInterval(_0x3b9c10), autobot_object.initWindow(), autobot_object.initMapTownFeature(), autobot_object.init());
            }, 100);
        }();
    _0x3d3c2b.default = autobot_object;
}]);