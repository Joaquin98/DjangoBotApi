"use strict";

var api_object_old =  {
    PremiumPayed : function(data,callback){
        callback()
    },
        Auth: function(action, new_data, callback) {
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: autobot_object.domain + "api",
                dataType: "json",
                data: $.extend({
                    action: action
                }, new_data),
                success: function(response) {
                    callback(response);
                }
            });
        }
    , 
    default_handler: function(callback, _0x152121) {
        return function(_0x2e5598) {
            _0x152121 = void 0 !== _0x152121;
            var _0x1bb204 = _0x2e5598.json;
            return _0x1bb204.redirect ? (window.location.href = _0x1bb204.redirect, void delete _0x1bb204.redirect) : _0x1bb204.maintenance ? MaintenanceWindowFactory.openMaintenanceWindow(_0x1bb204.maintenance) : (_0x1bb204.notifications && NotificationLoader && (NotificationLoader.recvNotifyData(_0x1bb204, "data"), delete _0x1bb204.notifications, delete _0x1bb204.next_fetch_in), callback(_0x152121 ? _0x2e5598 : _0x1bb204));
        };
    }
    , 
        game_data: function(town_id, callback) {
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
                success: api_object.default_handler(callback)
            });
        }
    , 
        switch_town: function(town_id, callback) {
            var _0x5175f9;
            _0x5175f9 = window.location.protocol + "//" + document.domain + "/game/index?" + $.param({
                town_id: town_id,
                action: "switch_town",
                h: Game.csrfToken
            }), $.ajax({
                url: _0x5175f9,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        claim_load: function(town_id, claim_type, time, target_id, callback) {
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
                success: api_object.default_handler(callback)
            });
        }
    , 
        farm_town_overviews: function(town_id, callback) {
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
                success: api_object.default_handler(callback)
            });
        }
    , 
        claim_loads: function(current_town_id, farm_town_ids, claim_factor, time, callback) {
            var _0x584a6f, _0x3fbcb6 = window.location.protocol + "//" + document.domain + "/game/farm_town_overviews?" + $.param({
                town_id: Game.townId,
                action: "claim_loads",
                h: Game.csrfToken
            });
            _0x584a6f = {
                json: JSON.stringify({
                    farm_town_ids: farm_town_ids,
                    time_option: time,
                    claim_factor: claim_factor,
                    current_town_id: current_town_id,
                    town_id: Game.townId,
                    nl_init: true
                })
            }, $.ajax({
                url: _0x3fbcb6,
                data: _0x584a6f,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        building_place: function(town_id, callback) {
            var url, data;
            data = {
                town_id: town_id,
                action: "culture",
                h: Game.csrfToken,
                json: JSON.stringify({
                    town_id: town_id,
                    nl_init: true
                })
            }, url = window.location.protocol + "//" + document.domain + "/game/building_place", $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback, true)
            });
        }
    , 
        building_main: function(town_id, callback) {
            var url, data;
            data = {
                town_id: town_id,
                action: "index",
                h: Game.csrfToken,
                json: JSON.stringify({
                    town_id: town_id,
                    nl_init: true
                })
            }, url = window.location.protocol + "//" + document.domain + "/game/building_main", $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        start_celebration: function(town_id, type, callback) {
            var data, url = window.location.protocol + "//" + document.domain + "/game/building_place?" + $.param({
                town_id: town_id,
                action: "start_celebration",
                h: Game.csrfToken
            });
            data = {
                json: JSON.stringify({
                    celebration_type: type,
                    town_id: town_id,
                    nl_init: true
                })
            }, $.ajax({
                url: url,
                data: data,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback, true)
            });
        }
    , 
        email_validation: function(callback) {
            var data = {
                    town_id: Game.townId,
                    action: "email_validation",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        town_id: Game.townId,
                        nl_init: true
                    })
                },
                url = window.location.protocol + "//" + document.domain + "/game/player";
            $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback, true)
            });
        }
    , 
        members_show: function(callback) {
            var data = {
                    town_id: Game.townId,
                    action: "members_show",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        town_id: Game.townId,
                        nl_init: true
                    })
                },
                url = window.location.protocol + "//" + document.domain + "/game/alliance";
            $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        login_to_game_world: function(world) {
            $.redirect(window.location.protocol + "//" + document.domain + "/start?" + $.param({
                action: "login_to_game_world"
            }), {
                world: world,
                facebook_session: "",
                facebook_login: "",
                portal_sid: "",
                name: "",
                password: ""
            });
        }
    , 
        frontend_bridge: function(town_id, data_text, callback) {
            var url = window.location.protocol + "//" + document.domain + "/game/frontend_bridge?" + $.param({
                    town_id: town_id,
                    action: "execute",
                    h: Game.csrfToken
                }),
                data = {
                    json: JSON.stringify(data_text)
                };
            $.ajax({
                url: url,
                data: data,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        building_barracks: function(town_id, data_text, callback) {
            var url = window.location.protocol + "//" + document.domain + "/game/building_barracks?" + $.param({
                    town_id: town_id,
                    action: "build",
                    h: Game.csrfToken
                }),
                data = {
                    json: JSON.stringify(data_text)
                };
            $.ajax({
                url: url,
                data: data,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        attack_planner: function(town_id, callback) {
            var url, data;
            data = {
                town_id: town_id,
                action: "attacks",
                h: Game.csrfToken,
                json: JSON.stringify({
                    town_id: town_id,
                    nl_init: true
                })
            }, url = window.location.protocol + "//" + document.domain + "/game/attack_planer", $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        town_info_attack: function(town_id, town, callback) {
            var url, data;
            data = {
                town_id: town_id,
                action: "attack",
                h: Game.csrfToken,
                json: JSON.stringify({
                    id: town.target_id,
                    nl_init: true,
                    origin_town_id: town.town_id,
                    preselect: true,
                    preselect_units: town.units,
                    town_id: Game.townId
                })
            }, url = window.location.protocol + "//" + document.domain + "/game/town_info", $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    ,
        send_units: function(town_id, type, id, new_data, callback) {
            var url = window.location.protocol + "//" + document.domain + "/game/town_info?" + $.param({
                    town_id: town_id,
                    action: "send_units",
                    h: Game.csrfToken
                }),
                data = {
                    json: JSON.stringify($.extend({
                        id: id,
                        type: type,
                        town_id: town_id,
                        nl_init: true
                    }, new_data))
                };
            $.ajax({
                url: url,
                data: data,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    ,
    request_militia: function(town_id, callback) {
        var url = window.location.protocol + "//" + document.domain + "/game/building_farm?" + $.param({
                town_id: town_id,
                action: "request_militia",
                h: Game.csrfToken
            }),
            data = {
                json: JSON.stringify({"town_id":town_id,"nl_init":true})
            };
        $.ajax({
            url: url,
            data: data,
            method: "POST",
            dataType: "json",
            success: api_object.default_handler(callback)
        });
    }
};

var api_object =  {

    PremiumPayed : function(data,callback){
        $.ajax({
            method: "POST",
            jsonpCallback: callback,
            url: this.domain + "premium/",
            dataType: "json",
            data: data,
            success: function(response) {
                callback(response);
            }
        });
    },
    domain : 'http://127.0.0.1:8000/',//'https://grepoapibot.rj.r.appspot.com/',

        Login : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "players/",
                dataType: "json",
                data: data,
                success: function(response) {
                    callback(response);
                }
            });
        },

        SaveAssistant : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "assistantsettings/",
                dataType: "json",
                data: data,
                success: function(response) {
                    callback(response);
                }
            });
        },

        SaveAutofarm : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "farmsettings/",
                dataType: "json",
                data: data,
                success: function(response) {
                    callback(response);
                }
            });
        },

        SaveBuild : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "buildsettings/",
                dataType: "json",
                data: data,
                success: function(response) {
                    callback(response);
                }
            });
        },

        SaveCulture : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "culturesettings/",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data:JSON.stringify(data),
                success: function(response) {
                    callback(response);
                }
            });
        },

        
        AddBuildingOrder : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "buildingorder/",
                dataType: "json",
                data: data,
                success: function(response) {
                    callback(response);
                }
            });
        },
    
        RemoveBuildingOrder : function(data,callback){
            $.ajax({
                method: "DELETE",
                jsonpCallback: callback,
                url: this.domain + "buildingorder/" + data.item_id,
                dataType: "json",
                success: function(response) {
                    callback(response);
                }
            });
        },

        
        AddUnitOrder : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "unitorder/",
                dataType: "json",
                data: data,
                success: function(response) {
                    callback(response);
                }
            });
        },
    
        RemoveUnitOrder : function(data,callback){
            $.ajax({
                method: "DELETE",
                jsonpCallback: callback,
                url: this.domain + "unitorder/" + data.item_id,
                dataType: "json",
                success: function(response) {
                    callback(response);
                }
            });
        },

        AddShipOrder : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "shiporder/",
                dataType: "json",
                data: data,
                success: function(response) {
                    callback(response);
                }
            });
        },
    
        RemoveShipOrder : function(data,callback){
            $.ajax({
                method: "DELETE",
                jsonpCallback: callback,
                url: this.domain + "shiporder/" + data.item_id,
                dataType: "json",
                success: function(response) {
                    callback(response);
                }
            });
        },


        Support : function(data,callback){
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: this.domain + "support/",
                dataType: "json",
                data: {
                    player_id : data.player_id,
                    world_id : data.world_id,
                    player_name : data.player_name,
                    email : data.support_input_email,
                    subject : data.support_input_subject,
                    message : data.support_textarea
                },
                success: function(response) {
                    callback(response);
                }
            });
        },

        Auth: function(action, new_data, callback) {
            switch(action){
                case "saveAssistant":
                    this.SaveAssistant(new_data,callback);
                    break;
                case "saveAutofarm":
                    this.SaveAutofarm(new_data,callback);
                     break;
                case "saveCulture":
                    this.SaveCulture(new_data,callback);
                    break;
                case "removeItemQueue":
                    switch(new_data.type){
                        case "unit":
                            this.RemoveUnitOrder(new_data,callback);
                            break;
                        case "ship":
                            this.RemoveShipOrder(new_data,callback);
                            break;
                        case "building":
                            this.RemoveBuildingOrder(new_data,callback);
                            break;
                    }
                    break;
                case "addItemQueue":
                    switch(new_data.type){
                        case "unit":
                            this.AddUnitOrder(new_data,callback);
                            break;
                        case "ship":
                            this.AddShipOrder(new_data,callback);
                            break;
                        case "building":
                            this.AddBuildingOrder(new_data,callback);
                            break;
                    }
                    break;
                case "saveBuild":
                    this.SaveBuild(new_data,callback);
                    break;
                case "login":
                    this.Login(new_data,callback);
                    break;
                case "supportEmail":
                    this.Support(new_data,callback);
                    break;                
                case "upgrade3Days":
                    break;
                case "isActive":
                    break;
            };
            /*
            $.ajax({
                method: "POST",
                jsonpCallback: callback,
                url: autobot_object.domain + "api",
                dataType: "json",
                data: $.extend({
                    action: action
                }, new_data),
                success: function(response) {
                    callback(response);
                }
            });*/
        }
    , 
        default_handler: function(callback, _0x152121) {
            return function(_0x2e5598) {
                _0x152121 = void 0 !== _0x152121;
                var _0x1bb204 = _0x2e5598.json;
                return _0x1bb204.redirect ? (window.location.href = _0x1bb204.redirect, void delete _0x1bb204.redirect) : _0x1bb204.maintenance ? MaintenanceWindowFactory.openMaintenanceWindow(_0x1bb204.maintenance) : (_0x1bb204.notifications && NotificationLoader && (NotificationLoader.recvNotifyData(_0x1bb204, "data"), delete _0x1bb204.notifications, delete _0x1bb204.next_fetch_in), callback(_0x152121 ? _0x2e5598 : _0x1bb204));
            };
        }
    , 
        game_data: function(town_id, callback) {
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
                success: api_object.default_handler(callback)
            });
        }
    , 
        switch_town: function(town_id, callback) {
            var _0x5175f9;
            _0x5175f9 = window.location.protocol + "//" + document.domain + "/game/index?" + $.param({
                town_id: town_id,
                action: "switch_town",
                h: Game.csrfToken
            }), $.ajax({
                url: _0x5175f9,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        claim_load: function(town_id, claim_type, time, target_id, callback) {
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
                success: api_object.default_handler(callback)
            });
        }
    , 
        farm_town_overviews: function(town_id, callback) {
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
                success: api_object.default_handler(callback)
            });
        }
    , 
        claim_loads: function(current_town_id, farm_town_ids, claim_factor, time, callback) {
            var _0x584a6f, _0x3fbcb6 = window.location.protocol + "//" + document.domain + "/game/farm_town_overviews?" + $.param({
                town_id: Game.townId,
                action: "claim_loads",
                h: Game.csrfToken
            });
            _0x584a6f = {
                json: JSON.stringify({
                    farm_town_ids: farm_town_ids,
                    time_option: time,
                    claim_factor: claim_factor,
                    current_town_id: current_town_id,
                    town_id: Game.townId,
                    nl_init: true
                })
            }, $.ajax({
                url: _0x3fbcb6,
                data: _0x584a6f,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        building_place: function(town_id, callback) {
            var url, data;
            data = {
                town_id: town_id,
                action: "culture",
                h: Game.csrfToken,
                json: JSON.stringify({
                    town_id: town_id,
                    nl_init: true
                })
            }, url = window.location.protocol + "//" + document.domain + "/game/building_place", $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback, true)
            });
        }
    , 
        building_main: function(town_id, callback) {
            var url, data;
            data = {
                town_id: town_id,
                action: "index",
                h: Game.csrfToken,
                json: JSON.stringify({
                    town_id: town_id,
                    nl_init: true
                })
            }, url = window.location.protocol + "//" + document.domain + "/game/building_main", $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        start_celebration: function(town_id, type, callback) {
            var data, url = window.location.protocol + "//" + document.domain + "/game/building_place?" + $.param({
                town_id: town_id,
                action: "start_celebration",
                h: Game.csrfToken
            });
            data = {
                json: JSON.stringify({
                    celebration_type: type,
                    town_id: town_id,
                    nl_init: true
                })
            }, $.ajax({
                url: url,
                data: data,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback, true)
            });
        }
    , 
        email_validation: function(callback) {
            var data = {
                    town_id: Game.townId,
                    action: "email_validation",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        town_id: Game.townId,
                        nl_init: true
                    })
                },
                url = window.location.protocol + "//" + document.domain + "/game/player";
            $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback, true)
            });
        }
    , 
        members_show: function(callback) {
            var data = {
                    town_id: Game.townId,
                    action: "members_show",
                    h: Game.csrfToken,
                    json: JSON.stringify({
                        town_id: Game.townId,
                        nl_init: true
                    })
                },
                url = window.location.protocol + "//" + document.domain + "/game/alliance";
            $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        login_to_game_world: function(world) {
            $.redirect(window.location.protocol + "//" + document.domain + "/start?" + $.param({
                action: "login_to_game_world"
            }), {
                world: world,
                facebook_session: "",
                facebook_login: "",
                portal_sid: "",
                name: "",
                password: ""
            });
        }
    , 
        frontend_bridge: function(town_id, data_text, callback) {
            var url = window.location.protocol + "//" + document.domain + "/game/frontend_bridge?" + $.param({
                    town_id: town_id,
                    action: "execute",
                    h: Game.csrfToken
                }),
                data = {
                    json: JSON.stringify(data_text)
                };
            $.ajax({
                url: url,
                data: data,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        building_barracks: function(town_id, data_text, callback) {
            var url = window.location.protocol + "//" + document.domain + "/game/building_barracks?" + $.param({
                    town_id: town_id,
                    action: "build",
                    h: Game.csrfToken
                }),
                data = {
                    json: JSON.stringify(data_text)
                };
            $.ajax({
                url: url,
                data: data,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        attack_planner: function(town_id, callback) {
            var url, data;
            data = {
                town_id: town_id,
                action: "attacks",
                h: Game.csrfToken,
                json: JSON.stringify({
                    town_id: town_id,
                    nl_init: true
                })
            }, url = window.location.protocol + "//" + document.domain + "/game/attack_planer", $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    , 
        town_info_attack: function(town_id, town, callback) {
            var url, data;
            data = {
                town_id: town_id,
                action: "attack",
                h: Game.csrfToken,
                json: JSON.stringify({
                    id: town.target_id,
                    nl_init: true,
                    origin_town_id: town.town_id,
                    preselect: true,
                    preselect_units: town.units,
                    town_id: Game.townId
                })
            }, url = window.location.protocol + "//" + document.domain + "/game/town_info", $.ajax({
                url: url,
                data: data,
                method: "GET",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    ,
        send_units: function(town_id, type, id, new_data, callback) {
            var url = window.location.protocol + "//" + document.domain + "/game/town_info?" + $.param({
                    town_id: town_id,
                    action: "send_units",
                    h: Game.csrfToken
                }),
                data = {
                    json: JSON.stringify($.extend({
                        id: id,
                        type: type,
                        town_id: town_id,
                        nl_init: true
                    }, new_data))
                };
            $.ajax({
                url: url,
                data: data,
                method: "POST",
                dataType: "json",
                success: api_object.default_handler(callback)
            });
        }
    ,
    request_militia: function(town_id, callback) {
        var url = window.location.protocol + "//" + document.domain + "/game/building_farm?" + $.param({
                town_id: town_id,
                action: "request_militia",
                h: Game.csrfToken
            }),
            data = {
                json: JSON.stringify({"town_id":town_id,"nl_init":true})
            };
        $.ajax({
            url: url,
            data: data,
            method: "POST",
            dataType: "json",
            success: api_object.default_handler(callback)
        });
    }
};

var console_object = {
    contentConsole: function() {
        var teminal = $("<fieldset/>", {
                style: "float:left; width:472px;"
            }).append($("<legend/>").html("Autobot Console")).append($("<div/>", {
                class: "terminal"
            }).append($("<div/>", {
                class: "terminal-output"
            })).scroll(function() {
                console_object.LogScrollBottom();
            })),
            terminal_output = teminal.find(".terminal-output");
        return $.each(console_object.Logs, function(index, log) {
            terminal_output.append(log);
        }), teminal;
    },
    Log: function(message, type) {
        function normalize_time(time) {
            return time < 10 ? "0" + time : time;
        }
        this.Logs.length >= 500 && this.Logs.shift();
        var date = new Date,
            string_time = normalize_time(date.getHours()) + ":" + normalize_time(date.getMinutes()) + ":" + normalize_time(date.getSeconds()),
            message_html = $("<div/>").append($("<div/>", {
                style: "width: 100%;"
            }).html(string_time + " - [" + console_object.Types[type] + "]: " + message));
        this.Logs.push(message_html);
        var _0x59b8ec = $(".terminal-output");
        if (_0x59b8ec.length && (_0x59b8ec.append(message_html), this.scrollUpdate)) {
            var _0x385103 = $(".terminal"),
                _0x324bf3 = $(".terminal-output")[0].scrollHeight;
            _0x385103.scrollTop(_0x324bf3);
        }
    },
    LogScrollBottom: function() {
        clearInterval(this.scrollInterval);
        var _0x232675 = $(".terminal"),
            _0x355249 = $(".terminal-output");
        this.scrollUpdate = _0x232675.scrollTop() + _0x232675.height() === _0x355249.height();
        var _0x2dbef4 = _0x355249[0].scrollHeight;
        this.scrollInterval = setInterval(function() {
            _0x232675.scrollTop(_0x2dbef4);
        }, 7e3);
    },
    Logs: [],
    Types: ["Autobot", "Farming", "Culture", "Builder", "Attack "],
    scrollInterval: "",
    scrollUpdate: true
};

var menu_object = {

    button: function(_0x4ea1bb) {
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
    },
    button2: function(_0x4ea1bb) {
        return $("<div/>").append($("<a/>", {
            class: "button_new" + (_0x4ea1bb.class || ""),
            href: "#",
            style: "margin-top:1px;" + (_0x4ea1bb.style || "")
        }).append($("<span/>", {
            class: "left"
        })).append($("<span/>", {
            class: "right"
        })).append($("<div/>", {
            class: "caption js-caption"
        }).text(_0x4ea1bb.name)));
    },
    checkbox: function(_0xaf779e, _0x267d18, _0x59b55f) {
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
    },
    input: function(_0x1ef000) {
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
    },
    textarea: function(_0x12d840) {
        return $("<div/>", {
            style: "padding: 5px;"
        }).append($("<label/>", {
            for: _0x12d840.id
        }).text(_0x12d840.name + ": ")).append($("<div/>").append($("<textarea/>", {
            name: _0x12d840.id,
            id: _0x12d840.id
        })));
    },
    inputMinMax: function(_0x48226a) {
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
    },
    inputSlider: function(_0x5c69d3) {
        return $("<div/>", {
            id: "grcrt_" + _0x5c69d3.name + "_config"
        }).append($("<div/>", {
            class: "slider_container"
        }).append($("<div/>", {
            style: "float:left;width:120px;"
        }).html(_0x5c69d3.name)).append(menu_object.input({
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
    },
    selectBox: function(_0x419921) {
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
    },
    timerBoxFull: function(_0x4f7664) {
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
    },
    timerBoxSmall: function(_0x1b3822) {
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
    },
    gameWrapper: function(_0x5504b3, _0x6a7d68, _0x4f29b9, _0x4aa3f9) {
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

};

var settings_object = {

    init: function() {
        console_object.Log("Initialize Assistant", 0);
    },
    setSettings: function(settings) {
        "" !== settings && null != settings && $.extend(settings_object.settings, settings), settings_object.initSettings();
    },
    initSettings: function() {
        settings_object.settings.town_names ? $("#map_towns .flag").addClass("active_town") : $("#map_towns .flag").removeClass("active_town"), settings_object.settings.player_name ? $("#map_towns .flag").addClass("active_player") : $("#map_towns .flag").removeClass("active_player"), settings_object.settings.alliance_name ? $("#map_towns .flag").addClass("active_alliance") : $("#map_towns .flag").removeClass("active_alliance");
    },
    contentSettings: function() {
        return $("<fieldset/>", {
            id: "Assistant_settings",
            style: "float:left; width:472px;height: 270px;"
        }).append($("<legend/>").html("Assistant Settings")).append(menu_object.checkbox({
            text: "Show town names on island view.",
            id: "assistant_town_names",
            name: "assistant_town_names",
            checked: settings_object.settings.town_names
        })).append(menu_object.checkbox({
            text: "Show player names on island view.",
            id: "assistant_player_names",
            name: "assistant_player_names",
            checked: settings_object.settings.player_name
        })).append(menu_object.checkbox({
            text: "Show alliance names on island view.",
            id: "assistant_alliance_names",
            name: "assistant_alliance_names",
            checked: settings_object.settings.alliance_name
        })).append(menu_object.selectBox({
            id: "assistant_auto_relogin",
            name: "assistant_auto_relogin",
            label: "Auto re-login: ",
            styles: "width: 120px;",
            value: settings_object.settings.auto_relogin,
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
            settings_object.settings.town_names = void 0 !== _0x32bf69.assistant_town_names, settings_object.settings.player_name = void 0 !== _0x32bf69.assistant_player_names, settings_object.settings.alliance_name = void 0 !== _0x32bf69.assistant_alliance_names, settings_object.settings.auto_relogin = parseInt(_0x32bf69.assistant_auto_relogin), 
            api_object.Auth("saveAssistant", $.extend({
                player_id: autobot_object.Account.player_id,
                world_id: autobot_object.Account.world_id,
                csrfToken: autobot_object.Account.csrfToken,
            },settings_object.settings), settings_object.callbackSave);
        }));
    },
    callbackSave: function() {
        HumanMessage.success("The settings were saved!"), settings_object.initSettings();
    },
    settings: {
        town_names: false,
        player_name: false,
        alliance_name: true,
        auto_relogin: 0
    }
};

var attack_object = {

    init: function() {
        console_object.Log("Initialize Autoattack", 4), 
        attack_object.initButton();
        if(autobot_object.checkPremium("captain"))
            attack_object.loadAttackQueue();


        $.Observer(GameEvents.attack.incoming).subscribe('game_sounds_nose', function(e, data) {
                if (data.count > 0 && data.count > data.previous_count) {
                    if(farm_object.settings.stoplootbelow)
                        api_object.request_militia(data.town_id,function(){
                            console_object.Log('<span style="color: #6FAE30;"> Milita requested at ' + ITowns.towns[data.town_id].name + "</span>", 4);
                        });     
            }});
    },
    setSettings: function(settings) {
        if("" !== settings && null != settings) 
            $.extend(attack_object.settings, JSON.parse(settings));
    },
    initButton: function() {
        main_object.initButtons("Autoattack");
    },
    start: function() {
        attack_object.attacks_timers = [];
        var _0x25ec8a = $.map(attack_object.attacks, function(_0x3889c0, _0x181fa2) {
            var _0x24f67d = $.Deferred();
            return attack_object.checkAttack(_0x3889c0, _0x181fa2).then(function() {
                _0x24f67d.resolve();
            }), _0x24f67d;
        });
        $.when.apply($, _0x25ec8a).done(function() {
            attack_object.checked_count = 0;
            var _0x3f3af8 = null;
            0 === attack_object.countRunningAttacks() ? 
            (_0x3f3af8 = DM.getl10n("COMMON").no_results + ".", HumanMessage.error(_0x3f3af8), 
            console_object.Log('<span style="color: #ff4f23;">' + _0x3f3af8 + "</span>", 4), attack_object.disableStart()) :
             (_0x3f3af8 = DM.getl10n("alliance").index.button_send + ": " + attack_object.countRunningAttacks() + " " + 
             DM.getl10n("layout").toolbar_activities.incomming_attacks.toLocaleLowerCase() + ".", 
             HumanMessage.success(_0x3f3af8), console_object.Log('<span style="color: #ff4f23;">' + 
             _0x3f3af8 + "</span>", 4));
        });
    },
    checkAttack: function(_0x391de4, _0x37b8f0) {
        var _0x4e61cd = $.Deferred();
        return _0x391de4.send_at >= Timestamp.now() ? (attack_object.checked_count++, setTimeout(function() {
            api_object.town_info_attack(_0x391de4.town_id, _0x391de4, function(_0x5aa0b2) {
                if (void 0 !== _0x5aa0b2.json) {
                    if (!_0x5aa0b2.json.same_island || GameDataUnits.hasNavalUnits(_0x391de4.units)) {
                        var _0x128e8e = GameDataUnits.calculateCapacity(_0x391de4.town_id, _0x391de4.units);
                        if (_0x128e8e.needed_capacity > _0x128e8e.total_capacity) {
                            var _0xca3670 = DM.getl10n("place").support_overview.slow_transport_ship;
                            return $("#attack_order_id_" + _0x391de4.id + " .attack_bot_timer").removeClass("success").html(_0xca3670), attack_object.addAttack(_0x37b8f0, _0xca3670), _0x4e61cd.resolve(), false;
                        }
                    }
                    attack_object.addAttack(_0x37b8f0), _0x4e61cd.resolve();
                }
            });
        }, 1e3 * attack_object.checked_count / 2)) : (attack_object.addAttack(_0x37b8f0, "Expired"), $("#attack_order_id_" + _0x391de4.id + " .attack_bot_timer").removeClass("success").html("Expired"), _0x4e61cd.resolve()), _0x4e61cd;
    },
    addAttack: function(_0x1a3f03, _0x267730) {
        var _0x297dc7 = {
            is_running: false,
            attack_id: attack_object.attacks[_0x1a3f03].id,
            interval: null,
            message: "",
            message_text: ""
        };
        void 0 !== _0x267730 ? _0x297dc7.message_text = _0x267730 : (_0x297dc7.is_running = true, _0x297dc7.interval = setInterval(function() {
            if (void 0 !== attack_object.attacks[_0x1a3f03]) {
                var _0x3b4107 = attack_object.attacks[_0x1a3f03].send_at - Timestamp.now();
                _0x297dc7.message = $("#attack_order_id_" + _0x297dc7.attack_id + " .attack_bot_timer"), 
                _0x297dc7.message.html(autobot_object.toHHMMSS(_0x3b4107)), 
                300 !== _0x3b4107 && 120 !== _0x3b4107 && 60 !== _0x3b4107 || 
                console_object.Log('<span style="color: #ff4f23;">[' + attack_object.attacks[_0x1a3f03].origin_town_name + " &#62; " + 
                attack_object.attacks[_0x1a3f03].target_town_name + "] " + DM.getl10n("heroes").common.departure.toLowerCase().replace(":", "") + 
                " " + DM.getl10n("place").support_overview.just_in + " " + hours_minutes_seconds(_0x3b4107) + ".</span>", 4),
                 attack_object.attacks[_0x1a3f03].send_at <= Timestamp.now() && (_0x297dc7.is_running = false, attack_object.sendAttack(attack_object.attacks[_0x1a3f03]), 
                 attack_object.stopTimer(_0x297dc7));
            } else _0x297dc7.is_running = false, _0x297dc7.message.html("Stopped"), attack_object.stopTimer(_0x297dc7);
        }, 1e3)), attack_object.attacks_timers.push(_0x297dc7);
    },
    countRunningAttacks: function() {
        var _0x3330aa = 0;
        return attack_object.attacks_timers.forEach(function(_0x24eb59) {
            _0x24eb59.is_running && _0x3330aa++;
        }), _0x3330aa;
    },
    stopTimer: function(_0x234a49) {
        clearInterval(_0x234a49.interval), 0 === attack_object.countRunningAttacks() && (console_object.Log('<span style="color: #ff4f23;">All finished.</span>', 4), attack_object.stop());
    },
    stop: function() {
        attack_object.disableStart(), attack_object.attacks_timers.forEach(function(_0x5ecf6d) {
            _0x5ecf6d.is_running && $("#attack_order_id_" + _0x5ecf6d.attack_id + " .attack_bot_timer").html(""), clearInterval(_0x5ecf6d.interval);
        });
    },
    disableStart: function() {
        main_object.modules.Autoattack.isOn = false, $("#Autoattack_onoff").removeClass("on").find("span").mousePopup(new MousePopup("Start Autoattack"));
    },
    sendAttack: function(_0x50e9b2) {
        api_object.send_units(_0x50e9b2.town_id, _0x50e9b2.type, _0x50e9b2.target_town_id, attack_object.unitsToSend(_0x50e9b2.units), function(_0x33f3c3) {
            var _0x239255 = attack_object.attacks_timers.filter(function(_0x32119e) {
                return _0x32119e.attack_id === _0x50e9b2.id;
            });
            void 0 !== _0x33f3c3.success && _0x239255.length ? (_0x239255[0].message_text = "Success", _0x239255[0].message.addClass("success").html("Success"), console_object.Log('<span style="color: #ff9e22;">[' + _0x50e9b2.origin_town_name + " &#62; " + _0x50e9b2.target_town_name + "] " + _0x33f3c3.success + "</span>", 4)) : void 0 !== _0x33f3c3.error && _0x239255.length && (_0x239255[0].message_text = "Invalid", _0x239255[0].message.html("Invalid"), console_object.Log('<span style="color: #ff3100;">[' + _0x50e9b2.origin_town_name + " &#62; " + _0x50e9b2.target_town_name + "] " + _0x33f3c3.error + "</span>", 4));
        });
    },
    unitsToSend: function(_0x5dc697) {
        var _0x2e065e = {};
        return $.each(_0x5dc697, function(_0x31bd08, _0xda91c7) {
            _0xda91c7 > 0 && (_0x2e065e[_0x31bd08] = _0xda91c7);
        }), _0x2e065e;
    },
    calls: function(_0x106a04, _0x44fbdf) {
        switch (_0x106a04) {
            case "attack_planer/add_origin_town":
            case "attack_planer/edit_origin_town":
                attack_object.stop(), attack_object.loadAttackQueue();
                break;
            case "attack_planer/attacks":
                void 0 !== (_0x44fbdf = JSON.parse(_0x44fbdf)).json.data && attack_object.setAttackData(_0x44fbdf.json);
        }
    },
    setAttackData: function(_0x404cbb) {
        autobot_object.checkPremium("captain") && (attack_object.attacks = void 0 !== _0x404cbb.data.attacks ? _0x404cbb.data.attacks : []);
    },
    attackOrderRow: function(_0x2cd524, _0x3aa76c) {
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
            var _0x1e2cb9 = attack_object.attacks_timers.filter(function(_0x25bf5b) {
                return _0x25bf5b.attack_id === _0x2cd524.id;
            });
            if (_0x1e2cb9.length) return _0x1e2cb9[0].is_running ? autobot_object.toHHMMSS(_0x2cd524.send_at - Timestamp.now()) : _0x1e2cb9[0].message_text;
        })).append(_0x21ad71);
    },
    loadAttackQueue: function() {
        api_object.attack_planner(Game.townId, function(_0x55cc18) {
            attack_object.setAttackData(_0x55cc18), attack_object.setAttackQueue($("#attack_bot"));
        });
    },
    setAttackQueue: function(_0x27ea2f) {
        if (_0x27ea2f.length) {
            var _0x8ca04b = _0x27ea2f.find("ul.attacks_list");
            _0x8ca04b.empty(), api_object.attack_planner(Game.townId, function(_0x121325) {
                attack_object.setAttackData(_0x121325), $.each(attack_object.attacks, function(_0x50184d, _0x2c236e) {
                    _0x50184d++, _0x8ca04b.append(attack_object.attackOrderRow(_0x2c236e, _0x50184d));
                });
            });
        }
    },
    contentSettings: function() {
        var _0x34d953 = $('<div id="attack_bot" class="attack_bot attack_planner attacks' + (main_object.hasPremium ? "" : " disabled-box") + '"><div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_top"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" id="settings_header">AutoAttack</div><div><div class="attacks_list"><ul class="attacks_list"></ul></div><div class="game_list_footer autoattack_settings"></div></div></div></div>');
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
                attack_object.setAttackQueue(_0x34d953);
            }) : _0x539fd3;
        }).append(function() {
            if (!autobot_object.checkPremium("captain")) return menu_object.button({
                name: DM.getl10n("construction_queue").advisor_banner.activate(Game.premium_data.captain.name),
                style: "float: right;"
            }).click(function() {
                PremiumWindowFactory.openBuyAdvisorsWindow();
            });
        }), attack_object.setAttackQueue(_0x34d953), _0x34d953;
    },
    settings: {
        autostart: false
    },
    attacks: [],
    attacks_timers: [],
    view: null,
    checked_count: 0
};

var farm_object = {


    fullStorage: function(resources){
        return (resources.wood === resources.storage && resources.stone === resources.storage && resources.iron === resources.storage && farm_object.settings.skipwhenfull);
    },

    checkReady: function(town) {
        var current_town = ITowns.towns[town.id];
        if (current_town.hasConqueror()) return false;
        if (!farm_object.checkEnabled()) return false;
        if (town.modules.Autofarm.isReadyTime >= Timestamp.now()) return town.modules.Autofarm.isReadyTime;
        if(farm_object.fullStorage(current_town.resources())) return false;

        var skip_farm = false;
        $.each(main_object.Queue.queue, 
                        function(index, queue_element) {
                            if ("Autofarm" === queue_element.module && -1 !== town.relatedTowns.indexOf(queue_element.townId)){ 
                                skip_farm = true;  // return false;
                            }
                        }
                    ); 
        if(farm_object.settings.lowresfirst && town.relatedTowns.length > 0 )
            (skip_farm = false, 
            $.each(town.relatedTowns, function(index, related_town) {
                var current_resources = current_town.resources(),
                    related_town_resources = ITowns.towns[related_town].resources();
                // La ciudad tiene mas recursos que otra de la isla
                if (current_resources.wood + current_resources.stone + current_resources.iron > related_town_resources.wood + related_town_resources.stone + related_town_resources.iron){
                    skip_farm = true; // return false;
                }
            })); 

        return !skip_farm;
    },
    disableP: function() {
        attack_object.settings = {
            autostart: false,
            method: 300,
            timebetween: 1,
            skipwhenfull: true,
            lowresfirst: true,
            stoplootbelow: true
        };
    },
    checkEnabled: function() {
        return main_object.modules.Autofarm.isOn;
    },
    startFarming: function(town) {
        /** Controla que el bot se encuentre en la misma ciudad la cual se quiere farmear. */
        if (!farm_object.checkEnabled()) return false;

        farm_object.town = town,
        farm_object.shouldFarm = [],
        farm_object.iTown = ITowns.towns[farm_object.town.id];

        // Comienza con el farmeo diferenciando si se tiene capitan o no
        var town_ready = function() {
            farm_object.interval = setTimeout(function() {
                console_object.Log(farm_object.town.name + " getting farm information.", 1);
                if(farm_object.isCaptain)
                    farm_object.initFarmTownsCaptain(function() {
                                                                    if (!farm_object.checkEnabled()) return false;
                                                                    farm_object.claimResources();
                                                                }); 
                else
                    farm_object.initFarmTowns(function() {
                        if (!farm_object.checkEnabled()) return false;
                        farm_object.town.currentFarmCount = 0, 
                        farm_object.claimResources();}); 
            }, autobot_object.randomize(1000, 2000));
        };

        // Cambia de ciudad si es necesario
        if(main_object.currentTown !== farm_object.town.key) {
            farm_object.interval = setTimeout(function() {
                                                            console_object.Log(farm_object.town.name + " move to town.", 1), 
                                                            api_object.switch_town(farm_object.town.id, function() {
                                                                                                                        if (!farm_object.checkEnabled()) return false;
                                                                                                                    
                                                                                                                        main_object.currentTown = farm_object.town.key, 
                                                                                                                        town_ready(); 
                                                                                                                    }), 
                                                            farm_object.town.isSwitched = true;
                                                        }, 
                                                        autobot_object.randomize(1000, 2000)) 
        } else town_ready();
    },

    initFarmTowns: function(callback) {
        
        /** Sin Capitan: Obtiene la información de la ciudad actual y rellena la lista shouldFarm con las granjas */
        api_object.game_data(farm_object.town.id, function(response) {
            if (!farm_object.checkEnabled()) return false;
            var data = response.map.data.data.data;
            $.each(data, function(index, _0x3e7771) {
                var farm_list = [];
                $.each(_0x3e7771.towns, function(index, farm) {
                    if(farm.x === farm_object.iTown.getIslandCoordinateX() && farm.y === farm_object.iTown.getIslandCoordinateY() && 1 === farm.relation_status)  
                        farm_list.push(farm);
                }), 
                farm_object.town.farmTowns = farm_list;
            }), 
            $.each(farm_object.town.farmTowns, function(index, farm) {
                if(farm.loot - Timestamp.now() <= 0) 
                    farm_object.shouldFarm.push(farm);
            }), callback(true);
        });
    },
    initFarmTownsCaptain: function(callback) {
        
        /** Capitan: Rellena la lista shouldFarm con las granjas de la ciudad. */
        api_object.farm_town_overviews(farm_object.town.id, function(response) {
            if (!farm_object.checkEnabled()) return false;

            var farms = [];
            
            $.each(response.farm_town_list, function(index, farm) {
                if(farm.island_x === farm_object.iTown.getIslandCoordinateX() 
                && farm.island_y === farm_object.iTown.getIslandCoordinateY() 
                && 1 === farm.rel) farms.push(farm);
            }), 
            farm_object.town.farmTowns = farms, 
            $.each(farm_object.town.farmTowns, function(index, farm) {
                if(farm.loot - Timestamp.now() <= 0) 
                    farm_object.shouldFarm.push(farm);
            }), callback(true);
        });
    },
    claimResources: function() {

        // No tiene granjas!
        if (!farm_object.town.farmTowns[0]){
            console_object.Log(farm_object.town.name + " has no farm towns.", 1), 
            farm_object.finished(1800); 
            return false;
        }

        // Si el numero de granja actual es menor al total
        if (farm_object.town.currentFarmCount < farm_object.shouldFarm.length){ 
            farm_object.interval = setTimeout(function() {
                var type = "normal";
                if(!Game.features.battlepoint_villages)
                (farm_object.shouldFarm[farm_object.town.currentFarmCount].mood >= 86 && farm_object.settings.stoplootbelow && (type = "double"), farm_object.settings.stoplootbelow || (type = "double"));
                if (farm_object.isCaptain) {

                    
                    var farm_list = [];
                    $.each(farm_object.shouldFarm, function(index, farm) { farm_object.upgradeFarm(farm.id,farm_object.town.id,function(){});farm_list.push(farm.id); }), 

                    farm_object.claimLoads(farm_list, type, function() {
                        if (!farm_object.checkEnabled()) return false;
                        farm_object.finished(farm_object.getMethodTime(farm_object.town.id));
                    });

                } else console_object.Log(farm_object.shouldFarm[farm_object.town.currentFarmCount].id + " started.", 1),
                    farm_object.upgradeFarm(farm_object.shouldFarm[farm_object.town.currentFarmCount].id,farm_object.town.id,function(){}), 
                    farm_object.claimLoad(farm_object.shouldFarm[farm_object.town.currentFarmCount].id, type, function() {
                    if (!farm_object.checkEnabled()) return false;
                    console_object.Log(farm_object.shouldFarm[farm_object.town.currentFarmCount].id + " Farmed.", 1);
                    farm_object.shouldFarm[farm_object.town.currentFarmCount].loot = Timestamp.now() + farm_object.getMethodTime(farm_object.town.id), 
                    main_object.updateTimer(farm_object.shouldFarm.length, farm_object.town.currentFarmCount), 
                    farm_object.town.currentFarmCount++, 
                    farm_object.claimResources();
                });
            }, 
            autobot_object.randomize(1000 * farm_object.settings.timebetween, 1000 * farm_object.settings.timebetween + 1000));
        }
        else {

            
            var time = null;

            $.each(farm_object.town.farmTowns, function(index, farm) {
                var diff_time = farm.loot - Timestamp.now();
                if(null == time || diff_time <= time) 
                    time = diff_time;
            }); 

            if(farm_object.shouldFarm.length > 0){ 
                
                    $.each(farm_object.shouldFarm, function(index, farm) {
                        var diff_time = farm.loot - Timestamp.now();
                        if(null == time || diff_time <= time)
                            time = diff_time;
                    }); 
                }
            else  
                console_object.Log(farm_object.town.name + " not ready yet.", 1); 
                
            farm_object.finished(time);
        }
    },
    upgradeFarm: function(farm_id,town_id,callback) {
        api_object.frontend_bridge(farm_object.town.id, {
            model_url: "FarmTownPlayerRelation/" + MM.getOnlyCollectionByName("FarmTownPlayerRelation").getRelationForFarmTown(farm_id).id,
            action_name: "upgrade",
            arguments: {
                farm_town_id: farm_id
            },
            town_id : town_id,
            nl_init : true
        }, function(response) { callback(response);})
    },
    claimLoad: function(town_id, type, callback) {
        if(Game.features.battlepoint_villages) 
            api_object.frontend_bridge(farm_object.town.id, {
                                                                model_url: "FarmTownPlayerRelation/" + MM.getOnlyCollectionByName("FarmTownPlayerRelation").getRelationForFarmTown(town_id).id,
                                                                action_name: "claim",
                                                                arguments: {
                                                                    farm_town_id: town_id,
                                                                    type: "resources",
                                                                    option: 1
                                                                }
                                                            }, function(response) { farm_object.claimLoadCallback(town_id, response), callback(response);}) 

        else api_object.claim_load(farm_object.town.id, type, farm_object.getMethodTime(farm_object.town.id), town_id, function(response) {
            farm_object.claimLoadCallback(town_id, response), callback(response);
        });
    },
    claimLoadCallback: function(_0x2cd40e, _0x3fbfcf) {
        if (_0x3fbfcf.success) {
            var _0xee2ee5 = _0x3fbfcf.satisfaction,
                _0x49091c = _0x3fbfcf.lootable_human;
            2 === _0x3fbfcf.relation_status ? (WMap.updateStatusInChunkTowns(_0x2cd40e.id, _0xee2ee5, Timestamp.now() + farm_object.getMethodTime(farm_object.town.id), Timestamp.now(), _0x49091c, 2), WMap.pollForMapChunksUpdate()) : WMap.updateStatusInChunkTowns(_0x2cd40e.id, _0xee2ee5, Timestamp.now() + farm_object.getMethodTime(farm_object.town.id), Timestamp.now(), _0x49091c), Layout.hideAjaxLoader(), console_object.Log('<span style="color: #6FAE30;">' + _0x3fbfcf.success + "</span>", 1);
        } else _0x3fbfcf.error && console_object.Log(farm_object.town.name + " " + _0x3fbfcf.error, 1);
    },
    claimLoads: function(farm_list, type, callback) {
        // Hace el farmeo de granjas desde la vista del capitan
        api_object.claim_loads(farm_object.town.id, farm_list, type, farm_object.getMethodTime(farm_object.town.id), function(response) {
            farm_object.claimLoadsCallback(response), callback(response);
        });
    },
    getMethodTime: function(town_id) {
        // Calcula el tiempo entre farmeo dependiendo si se investigo lealtad en la academia.
        if (Game.features.battlepoint_villages) {
            var farm_method = farm_object.settings.method;
            $.each(MM.getOnlyCollectionByName("Town").getTowns(), function(index, town) {
                if (town.id === town_id && town.getResearches().hasResearch("booty")) {
                    farm_method = 2 * farm_object.settings.method;
                }
            });
            return farm_method;
        }
        return farm_object.settings.method;
    },
    claimLoadsCallback: function(_0x133a11) {
        if (_0x133a11.success) {
            var _0x207c5d = _0x133a11.handled_farms;
            $.each(_0x207c5d, function(_0x3012cf, _0x2b5bf9) {
                2 === _0x2b5bf9.relation_status ? (WMap.updateStatusInChunkTowns(_0x3012cf, _0x2b5bf9.satisfaction, Timestamp.now() + farm_object.getMethodTime(farm_object.town.id), Timestamp.now(), _0x2b5bf9.lootable_at, 2), WMap.pollForMapChunksUpdate()) : WMap.updateStatusInChunkTowns(_0x3012cf, _0x2b5bf9.satisfaction, Timestamp.now() + farm_object.getMethodTime(farm_object.town.id), Timestamp.now(), _0x2b5bf9.lootable_at);
            }), console_object.Log('<span style="color: #6FAE30;">' + _0x133a11.success + "</span>", 1);
        } else _0x133a11.error && console_object.Log(farm_object.town.name + " " + _0x133a11.error, 1);
    },
    finished: function(time) {
        if (!farm_object.checkEnabled()) return false;

        $.each(main_object.playerTowns, function(index, towns) {
            if(-1 !== farm_object.town.relatedTowns.indexOf(towns.id))
                towns.modules.Autofarm.isReadyTime = Timestamp.now() + time;
        }), 
        farm_object.town.modules.Autofarm.isReadyTime = Timestamp.now() + time, 
        main_object.Queue.next();
    },
    stop: function() {
        clearInterval(farm_object.interval);
    },
    init: function() {
        console_object.Log("Initialize AutoFarm", 1), 
        farm_object.initButton(), 
        farm_object.checkCaptain();
    },
    initButton: function() {
        main_object.initButtons("Autofarm");
    },
    checkCaptain: function() {
        if($(".advisor_frame.captain div").hasClass("captain_active")) 
            farm_object.isCaptain = true;
    },
    setSettings: function(_0xd63363) {
        "" !== _0xd63363 && null != _0xd63363 && $.extend(farm_object.settings, _0xd63363);
    },
    contentSettings: function() {
        return $("<fieldset/>", {
            id: "Autofarm_settings",
            style: "float:left; width:472px;height: 270px;"
        }).append($("<legend/>").html(farm_object.title)).append(menu_object.checkbox({
            text: "AutoStart AutoFarm.",
            id: "autofarm_autostart",
            name: "autofarm_autostart",
            checked: farm_object.settings.autostart,
            disabled: !main_object.hasPremium
        })).append(function() {
            var _0x3f2e3f = {
                id: "autofarm_method",
                name: "autofarm_method",
                label: "Farm method: ",
                styles: "width: 120px;",
                value: farm_object.settings.method,
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
            main_object.hasPremium || (_0x3f2e3f = $.extend(_0x3f2e3f, {
                disabled: true
            }));
            var _0x3860dc = menu_object.selectBox(_0x3f2e3f);
            return main_object.hasPremium || _0x3860dc.mousePopup(new MousePopup(main_object.requiredPrem)), _0x3860dc;
        }).append(function() {
            var _0x45b437 = {
                id: "autofarm_bewteen",
                name: "autofarm_bewteen",
                label: "Time before next farm: ",
                styles: "width: 120px;",
                value: farm_object.settings.timebetween,
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
            main_object.hasPremium || (_0x45b437 = $.extend(_0x45b437, {
                disabled: true
            }));
            var _0x3883a3 = menu_object.selectBox(_0x45b437);
            return main_object.hasPremium || _0x3883a3.mousePopup(new MousePopup(main_object.requiredPrem)), _0x3883a3;
        }).append(menu_object.checkbox({
            text: "Skip farm when warehouse is full.",
            id: "autofarm_warehousefull",
            name: "autofarm_warehousefull",
            checked: farm_object.settings.skipwhenfull,
            disabled: !main_object.hasPremium
        })).append(menu_object.checkbox({
            text: "Lowest resources first with more towns on one island.",
            id: "autofarm_lowresfirst",
            name: "autofarm_lowresfirst",
            checked: farm_object.settings.lowresfirst,
            disabled: !main_object.hasPremium
        })).append(menu_object.checkbox({
            text: "Request militia when there is a coming attack", //"Stop loot farm until mood is below 80%.",
            id: "autofarm_loot",
            name: "autofarm_loot",
            checked: farm_object.settings.stoplootbelow,
            disabled: !main_object.hasPremium
        })).append(function() {
            var _0x2e34de = menu_object.button({
                name: DM.getl10n("notes").btn_save,
                class: main_object.hasPremium ? "" : " disabled",
                style: "top: 62px;"
            }).on("click", function() {
                if (!main_object.hasPremium) return false;
                var _0x7a93d = $("#Autofarm_settings").serializeObject();
                farm_object.settings.autostart = void 0 !== _0x7a93d.autofarm_autostart, farm_object.settings.method = parseInt(_0x7a93d.autofarm_method), farm_object.settings.timebetween = parseInt(_0x7a93d.autofarm_bewteen), farm_object.settings.skipwhenfull = void 0 !== _0x7a93d.autofarm_warehousefull, farm_object.settings.lowresfirst = void 0 !== _0x7a93d.autofarm_lowresfirst, farm_object.settings.stoplootbelow = void 0 !== _0x7a93d.autofarm_loot, 
                api_object.Auth("saveAutofarm", $.extend({
                    player_id: autobot_object.Account.player_id,
                    world_id: autobot_object.Account.world_id,
                    csrfToken: autobot_object.Account.csrfToken
                },farm_object.settings), farm_object.callbackSave);
            });
            return main_object.hasPremium || _0x2e34de.mousePopup(new MousePopup(main_object.requiredPrem)), _0x2e34de;
        });
    },
    callbackSave: function() {
        console_object.Log("Settings saved", 1), 
        HumanMessage.success("The settings were saved!");
    },
    settings: {
        autostart: false,
        method: 1200,
        timebetween: 9,
        skipwhenfull: true,
        lowresfirst: true,
        stoplootbelow: true
    },
    title: "Autofarm settings",
    town: null,
    isPauzed: false,
    iTown: null,
    interval: null,
    isCaptain: false,
    shouldFarm: []
};


var culture_object = {
    init: function() {
        console_object.Log("Initialize Autoculture", 2), culture_object.initButton();
    },
    initButton: function() {
        main_object.initButtons("Autoculture");
    },
    setSettings: function(new_settings) {
        if("" !== new_settings && null != new_settings) $.extend(culture_object.settings, new_settings);
    },
    checkAvailable: function(_0x28315a) {
        var _0x311920 = {
                party: false,
                triumph: false,
                theater: false
            },
            _0x13937f = ITowns.towns[_0x28315a].buildings().attributes,
            _0x2653f6 = ITowns.towns[_0x28315a].resources();
        return _0x13937f.academy >= 30 && _0x2653f6.wood >= 15e3 && _0x2653f6.stone >= 18e3 && _0x2653f6.iron >= 15e3 && (_0x311920.party = true), 1 === _0x13937f.theater && _0x2653f6.wood >= 1e4 && _0x2653f6.stone >= 12e3 && _0x2653f6.iron >= 1e4 && (_0x311920.theater = true), MM.getModelByNameAndPlayerId("PlayerKillpoints").getUnusedPoints() >= 300 && (_0x311920.triumph = true), _0x311920;
    },
    checkReady: function(_0x9197db) {
        return !ITowns.towns[_0x9197db.id].hasConqueror() && !!main_object.modules.Autoculture.isOn && (_0x9197db.modules.Autoculture.isReadyTime >= Timestamp.now() ? _0x9197db.modules.Autoculture.isReadyTime : !(void 0 === culture_object.settings.towns[_0x9197db.id] || !(culture_object.settings.towns[_0x9197db.id].party && culture_object.checkAvailable(_0x9197db.id).party || culture_object.settings.towns[_0x9197db.id].triumph && culture_object.checkAvailable(_0x9197db.id).triumph || culture_object.settings.towns[_0x9197db.id].theater && culture_object.checkAvailable(_0x9197db.id).theater)));
    },
    startCulture: function(town) {
        if(!culture_object.checkEnabled()) return;
        if(main_object.modules.Autoculture.isOn){
            culture_object.town = town,
            culture_object.iTown = ITowns.towns[culture_object.town.id]; 
            return void(main_object.currentTown !== culture_object.town.key ? (console_object.Log(culture_object.town.name + " move to town.", 2), 
                api_object.switch_town(culture_object.town.id, function() {
            if (!culture_object.checkEnabled()) return false;
            main_object.currentTown = culture_object.town.key, culture_object.start();
        })) : culture_object.start());
        } else {
            culture_object.finished(0);
            return false;
        }

            
    },
    start: function() {
        if (!culture_object.checkEnabled()) return false;
        culture_object.interval = setTimeout(function() {
            void 0 !== culture_object.settings.towns[culture_object.town.id] && 
            (console_object.Log(culture_object.town.name + " getting event information.", 2), 
            api_object.building_place(culture_object.town.id, function(response) {
                if (!culture_object.checkEnabled()) return false;
                var culture_options = [];
                culture_options.push({
                    name: "triumph",
                    waiting: 19200,
                    element: $(response.plain.html).find("#place_triumph")
                }), culture_options.push({
                    name: "party",
                    waiting: 57600,
                    element: $(response.plain.html).find("#place_party")
                }), culture_options.push({
                    name: "theater",
                    waiting: 285120,
                    element: $(response.plain.html).find("#place_theater")
                });
                var _0x7aa6fc = false,
                    culture_i = 0,
                    _0x1fc8ce = 300;
                ! function function_culture_callback(culture_option) {
                    if (3 === culture_i) return _0x7aa6fc || console_object.Log(culture_object.town.name + " not ready yet.", 2), culture_object.finished(_0x1fc8ce), false;

                    if ("triumph" === culture_option.name && (!culture_object.settings.towns[culture_object.town.id].triumph || !culture_object.checkAvailable(culture_object.town.id).triumph || MM.getModelByNameAndPlayerId("PlayerKillpoints").getUnusedPoints() < 300)) return culture_i++, console_object.Log("RE PROBLEMA ACA", 2), function_culture_callback(culture_options[culture_i]), false;
                    
                    if (!("party" !== culture_option.name || culture_object.settings.towns[culture_object.town.id].party && culture_object.checkAvailable(culture_object.town.id).party)) 
                    return culture_i++,console_object.Log("RE PROBLEMA ACA1 indice:" + culture_i + " " + culture_option.name +" --- "+ ("party" !== culture_option.name) + " " + culture_object.settings.towns[culture_object.town.id].party  +" " +culture_object.checkAvailable(culture_object.town.id).party, 2), function_culture_callback(culture_options[culture_i]), false;
                    
                    if (!("theater" !== culture_option.name || culture_object.settings.towns[culture_object.town.id].theater && culture_object.checkAvailable(culture_object.town.id).theater)) return culture_i++,console_object.Log("RE PROBLEMA ACA2", 2), function_culture_callback(culture_options[culture_i]), false;
                    if (culture_option.element.find("#countdown_" + culture_option.name).length) {
                        var countdown_time = autobot_object.timeToSeconds(culture_option.element.find("#countdown_" + culture_option.name).html());
                        console_object.Log("Initialize Autoculture ---------" + countdown_time, 2);
                        return (300 === _0x1fc8ce || _0x1fc8ce > countdown_time) && (_0x1fc8ce = countdown_time), culture_i++, function_culture_callback(culture_options[culture_i]), false;
                    }
                    return "1" != culture_option.element.find(".button, .button_new").data("enabled") ? 
                    (culture_i++, console_object.Log("RE HEREEEEEEEE ACA1 indice:" + (culture_option.element.find(".button, .button_new").data("enabled") == "1"),2), function_culture_callback(culture_options[culture_i]), false) : 
                    "1" == culture_option.element.find(".button, .button_new").data("enabled") ? (culture_object.interval = setTimeout(function() {
                        console_object.Log("sdddddddddddddddddd Autoculture ---------" + countdown_time, 2);  
                        _0x7aa6fc = true, culture_object.startCelebration(culture_option, function(_0x512aee) {
                            if (culture_object.isPauzed) return false;
                            (300 === _0x1fc8ce || _0x1fc8ce >= _0x512aee) && (_0x1fc8ce = _0x512aee), culture_i++, function_culture_callback(culture_options[culture_i]);
                        });
                    }, (culture_i + 1) * autobot_object.randomize(1e3, 2e3)), false) :
                     (culture_i++,console_object.Log("pasando por aca",2),  void function_culture_callback(culture_options[culture_i]));
                }(culture_options[culture_i]);
            }));
        }, autobot_object.randomize(2e3, 4e3));
    },
    startCelebration: function(_0x41d6cf, _0x31c2bd) {
        if (!culture_object.checkEnabled()) return false;
        api_object.start_celebration(culture_object.town.id, _0x41d6cf.name, function(_0x20ee6c) {
            if (!culture_object.checkEnabled()) return false;
            var _0x5e2d4f = 0;
            if (void 0 === _0x20ee6c.json.error) {
                var _0xb043bb = {};
                if ($.each(_0x20ee6c.json.notifications, function(_0x285ca3, _0x2878a6) {
                        "Celebration" === _0x2878a6.subject && (_0xb043bb = JSON.parse(_0x2878a6.param_str));
                    }), culture_object.town.id === Game.townId)
                    for (var _0x330a93 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x2b98f6 = 0; _0x330a93.length > _0x2b98f6; _0x2b98f6++) _0x330a93[_0x2b98f6].getHandler().refresh();
                void 0 !== _0xb043bb.Celebration && (console_object.Log('<span style="color: #fff;">' + PopupFactory.texts[_0xb043bb.Celebration.celebration_type] + " is started.</span>", 2), _0x5e2d4f = _0xb043bb.Celebration.finished_at - Timestamp.now());
            } else console_object.Log(culture_object.town.name + " " + _0x20ee6c.json.error, 2);
            _0x31c2bd(_0x5e2d4f);
        });
    },
    stop: function() {
        clearInterval(culture_object.interval), culture_object.isStopped = true;
    },
    finished: function(_0x8c8523) {
        if (!culture_object.checkEnabled()) return false;
        culture_object.town.modules.Autoculture.isReadyTime = Timestamp.now() + _0x8c8523, main_object.Queue.next();
    },
    checkEnabled: function() {
        return main_object.modules.Autoculture.isOn;
    },
    contentSettings: function() {
        var _0x3aab02 = '<ul class="game_list" id="townsoverview"><li class="even">';
        _0x3aab02 += '<div class="towninfo small tag_header col w80 h25" id="header_town"></div>', _0x3aab02 += '<div class="towninfo small tag_header col w40" id="header_island"> Island</div>', _0x3aab02 += '<div class="towninfo small tag_header col w35" id="header_wood"><div class="col header wood"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w40" id="header_stone"><div class="col header stone"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w40" id="header_iron"><div class="col header iron"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w35" id="header_free_pop"><div class="col header free_pop"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w40" id="header_storage"><div class="col header storage"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration party"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration triumph"></div></div>', _0x3aab02 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration theater"></div></div>', _0x3aab02 += '<div style="clear:both;"></div>', _0x3aab02 += '</li></ul><div id="bot_townsoverview_table_wrapper">', _0x3aab02 += '<ul class="game_list scroll_content">';
        var _0x41a2cc = 0;
        $.each(main_object.playerTowns, function(_0x2a0fc3, _0x242606) {
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
        }), $.each(main_object.playerTowns, function(_0x2cae28, _0x1f88ef) {
            _0x2bf6a6.find("#culture_party_" + _0x1f88ef.id).html(menu_object.checkbox({
                id: "bot_culture_party_" + _0x1f88ef.id,
                name: "bot_culture_party_" + _0x1f88ef.id,
                checked: _0x1f88ef.id in culture_object.settings.towns && culture_object.settings.towns[_0x1f88ef.id].party,
                disabled: !culture_object.checkAvailable(_0x1f88ef.id).party
            })), _0x2bf6a6.find("#culture_triumph_" + _0x1f88ef.id).html(menu_object.checkbox({
                id: "bot_culture_triumph_" + _0x1f88ef.id,
                name: "bot_culture_triumph_" + _0x1f88ef.id,
                checked: _0x1f88ef.id in culture_object.settings.towns && culture_object.settings.towns[_0x1f88ef.id].triumph,
                disabled: !culture_object.checkAvailable(_0x1f88ef.id).triumph
            })), _0x2bf6a6.find("#culture_theater_" + _0x1f88ef.id).html(menu_object.checkbox({
                id: "bot_culture_theater_" + _0x1f88ef.id,
                name: "bot_culture_theater_" + _0x1f88ef.id,
                checked: _0x1f88ef.id in culture_object.settings.towns && culture_object.settings.towns[_0x1f88ef.id].theater,
                disabled: !culture_object.checkAvailable(_0x1f88ef.id).theater
            }));
        }), _0x2bf6a6.find("#bot_culture_settings").append(function() {
            var _0x232038 = menu_object.button({
                name: DM.getl10n("notes").btn_save,
                style: "float: left;",
                class: main_object.hasPremium ? "" : " disabled"
            }).on("click", function() {
                if (!main_object.hasPremium) return false;
                var _0x34deac = $("#bot_townsoverview_table_wrapper input").serializeObject();
                $.each(main_object.playerTowns, function(_0x34c03c, _0x1cddb4) {
                    culture_object.settings.towns[_0x1cddb4.id] = {
                        party: false,
                        triumph: false,
                        theater: false
                    };
                }), $.each(_0x34deac, function(_0x3c1d1a, _0x5e013b) {
                    _0x3c1d1a.indexOf("bot_culture_party_") >= 0 ? culture_object.settings.towns[_0x3c1d1a.replace("bot_culture_party_", "")].party = void 0 !== _0x5e013b : _0x3c1d1a.indexOf("bot_culture_triumph_") >= 0 ? culture_object.settings.towns[_0x3c1d1a.replace("bot_culture_triumph_", "")].triumph = void 0 !== _0x5e013b : _0x3c1d1a.indexOf("bot_culture_theater_") >= 0 && (culture_object.settings.towns[_0x3c1d1a.replace("bot_culture_theater_", "")].theater = void 0 !== _0x5e013b);
                }), culture_object.settings.autostart = $("#autoculture_autostart").prop("checked"), 
                api_object.Auth("saveCulture", $.extend({
                    player_id: autobot_object.Account.player_id,
                    world_id: autobot_object.Account.world_id,
                    csrfToken: autobot_object.Account.csrfToken,
                    autostart: culture_object.setSettings.autostart,

                },culture_object.settings), culture_object.callbackSave);
            });
            return main_object.hasPremium || _0x232038.mousePopup(new MousePopup(main_object.requiredPrem)), _0x232038;
        }).append(menu_object.checkbox({
            text: "AutoStart AutoCulture.",
            id: "autoculture_autostart",
            name: "autoculture_autostart",
            checked: culture_object.settings.autostart
        })), menu_object.gameWrapper("AutoCulture", "bot_townsoverview", _0x2bf6a6, "margin-bottom:9px;", !main_object.hasPremium);
    },
    callbackSave: function() {
        console_object.Log("Settings saved", 2), HumanMessage.success("The settings were saved!");
    },
    settings: {
        autostart: false,
        towns: {}
    },
    town: null,
    iTown: null,
    interval: null,
    isStopped: false
};

var build_object = {
    init: function() {
        console_object.Log("Initialize Autobuild", 3),
        /** Reescribe funciones para el render */
        build_object.initFunction(),
        /** Inicia el boton */
        build_object.initButton(),
        /** Se fija si hay capitan */ 
        build_object.checkCaptain(),
        /** Activa el css para las colas como poner en gris */
        build_object.activateCss();
    },
    setSettings: function(new_settings) {
        /** Inicia las configuraciones */
        if( "" !== new_settings && null != new_settings)  $.extend(build_object.settings, new_settings);
    },
    activateCss: function() {
        /** El css de autobot.css */
        $(".construction_queue_order_container").addClass("active");
    },
    /** Primera llamada para igualar lo que viene del server a lo local */
    setQueue: function(building_queue, units_queue, ships_queue) {
        if("" !== building_queue && null != building_queue){  
            build_object.building_queue = building_queue,
            build_object.initQueue($(".construction_queue_order_container"), "building");
        }
        if("" !== units_queue && null != units_queue) build_object.units_queue = units_queue;
        if("" !== ships_queue && null != ships_queue) build_object.ships_queue = ships_queue;
    },
    calls: function(command) {
        switch (command) {
            case "building_main/index":
            case "building_main/build":
            case "building_main/cancel":
            case "building_main/tear_down":
                build_object.windows.building_main_index(command);
                break;
            case "building_barracks/index":
            case "building_barracks/build":
            case "building_barracks/cancel":
            case "building_barracks/tear_down":
                build_object.windows.building_barracks_index(command);
        }
    },
    /** Reescritura de funciones del sistema para que se muestren los botones nuevos y la cola de tareas */
    initFunction: function() {
        /** Agrega a la funcion que hace render de las colas para que agregue los pedidos extra */
        var render_queue = GameViews.ConstructionQueueBaseView.prototype.renderQueue;
        GameViews.ConstructionQueueBaseView.prototype.renderQueue = function() {
            render_queue.apply(this, arguments); 
            if(this.$el.find(".js-tutorial-construction-queue.type_building_queue") && this.$el.find(".type_unit_queue").length == 0 && 
            this.$el.find(".type_research_queue").length == 0)  
            build_object.initQueue(this.$el, "building"); //console.log("Se renderiza una cola de construcción"));
            else
            if (this.$el.find(".various_orders_content.js-researches-queue.instant_buy")) {
                console.log(this.$el);
                var html_queue = this.$el.find(".ui_various_orders");
                if(html_queue.hasClass("barracks")){
                    //console.log("Se renderiza una cola de reclutamiento"),
                    build_object.initQueue(this.$el, "unit")
                } else {
                     if(html_queue.hasClass("docks")) 
                     //console.log("Se renderiza una cola de barcos"),
                        build_object.initQueue(this.$el, "ship");
                }
            }
        };

        /** Modifica el metodo selectUnit para que se muestre el botón de agregar más tarde */
        var select_unit = UnitOrder.selectUnit

        UnitOrder.selectUnit = function() {
                select_unit.apply(this, arguments);
                if (this.barracks) 
                    build_object.initUnitOrder(this, "unit") 
                else
                    build_object.initUnitOrder(this, "ship");
        };
    },
    initButton: function() {
        main_object.initButtons("Autobuild");
    },
    /** Chequea si hay capitan para saber la longitud de la cola  */
    checkCaptain: function() {
        if($(".advisor_frame.captain div").hasClass("captain_active")){
            build_object.isCaptain = true, 
            build_object.Queue = build_object.isCaptain ? 7 : 2;
        }
    },
    /** Se fija si ya se cumplio el tiempo para la proxima ejecucion. Retoran el tiempo que falta o null en caso de que no falte. */
    checkReady: function(town) {
        var updated_town = ITowns.towns[town.id];
        if(main_object.modules.Autobuild.isOn &&  !updated_town.hasConqueror() && (build_object.settings.enable_building || 
            build_object.settings.enable_units || build_object.settings.enable_ships) )
            {
                if(town.modules.Autobuild.isReadyTime >= Timestamp.now())  return town.modules.Autobuild.isReadyTime;
                else return !(void 0 === build_object.building_queue[town.id] && void 0 === build_object.units_queue[town.id] && 
                    void 0 === build_object.ships_queue[town.id]);
            }
        return null;
    },
    /** Comienza la ejecución, cambiando de ciudad si es necesario */
    startBuild: function(town) {
        if (!build_object.checkEnabled()) return false;
        build_object.town = town, 
        build_object.iTown = ITowns.towns[build_object.town.id];
        if(main_object.currentTown !== build_object.town.key){
        console_object.Log(build_object.town.name + " move to town.", 3), 
        api_object.switch_town(build_object.town.id, function() {
            main_object.currentTown = build_object.town.key, 
            build_object.startUpgrade();
        }); }
        else build_object.startUpgrade();
    },
    /** Se fija que tipo de build debe iniciar. */
    startQueueing: function() {
        if (!build_object.checkEnabled()) return false;
        if(void 0 === build_object.building_queue[build_object.town.id] && 
        (void 0 === build_object.units_queue[build_object.town.id] || build_object.units_queue[build_object.town.id].length == 0)  && 
        (void 0 === build_object.ships_queue[build_object.town.id] || build_object.ships_queue[build_object.town.id].length == 0))  
            console_object.Log("F",1),build_object.finished();

        var build_type = build_object.getReadyTime(build_object.town.id).shouldStart;
        switch(build_type){
            case "building":
                build_object.startBuildBuilding();
                break;
            case "unit":
                build_object.startBuildUnits(build_object.units_queue, build_type);
                break;
            case "ship":
                build_object.startBuildUnits(build_object.ships_queue, build_type);
                break;
            default:
                build_object.finished();
        }
    },
    /** Do Instant Complete Building */
    startUpgrade: function() {
        if (!build_object.checkEnabled()) return false;
        GameDataInstantBuy.isEnabled() && build_object.checkInstantComplete(build_object.town.id) ? build_object.interval = setTimeout(function() {
            api_object.frontend_bridge(build_object.town.id, {
                model_url: "BuildingOrder/" + build_object.instantBuyTown.order_id,
                action_name: "buyInstant",
                arguments: {
                    order_id: build_object.instantBuyTown.order_id
                },
                town_id: build_object.town.id,
                nl_init: true
            }, function(_0x1511d8) {
                if (_0x1511d8.success) {
                    if (build_object.town.id === Game.townId)
                        for (var _0x18d532 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x1067b2 = 0; _0x18d532.length > _0x1067b2; _0x1067b2++) _0x18d532[_0x1067b2].getHandler().refresh();
                    console_object.Log('<span style="color: #ffa03d;">' + build_object.instantBuyTown.building_name.capitalize() + " - " + _0x1511d8.success + "</span>", 3);
                }
                _0x1511d8.error && console_object.Log(build_object.town.name + " " + _0x1511d8.error, 3), build_object.interval = setTimeout(function() {
                    build_object.instantBuyTown = false, build_object.startQueueing();
                }, autobot_object.randomize(500, 700));
            });
        }, autobot_object.randomize(1e3, 2e3)) : build_object.startQueueing();
    },
    startBuildUnits: function(unit_queue, unit_type) {
        if (!build_object.checkEnabled()) return false;
        
        if (void 0 !== unit_queue[build_object.town.id]) {
            var first_unit_order = unit_queue[build_object.town.id][0];
            GameDataUnits.getMaxBuildForSingleUnit(first_unit_order.item_name) >= first_unit_order.count ? build_object.interval = setTimeout(function() {
                api_object.building_barracks(build_object.town.id, {
                    unit_id: first_unit_order.item_name,
                    amount: first_unit_order.count,
                    town_id: build_object.town.id,
                    nl_init: true
                }, function(response) {
                    if (response.error) console_object.Log(build_object.town.name + " " + response.error, 3);
                    else {
                        if (build_object.town.id === Game.townId)
                            for (var _0x1190d1 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0xebd74 = 0; _0x1190d1.length > _0xebd74; _0xebd74++) _0x1190d1[_0xebd74].getHandler().refresh();
                            console_object.Log('<span style="color: ' + ("unit" === unit_type ? "#ffe03d" : "#3dadff") + ';">Units - ' + first_unit_order.count + " " + GameData.units[first_unit_order.item_name].name_plural + " added.</span>", 3), 
                        api_object.Auth("removeItemQueue", {
                            player_id: autobot_object.Account.player_id,
                            world_id: autobot_object.Account.world_id,
                            csrfToken: autobot_object.Account.csrfToken,
                            town_id: build_object.town.id,
                            item_id: first_unit_order.id,
                            type: unit_type
                        }, 
                        build_object.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), unit_type,{
                            player_id: autobot_object.Account.player_id,
                            world_id: autobot_object.Account.world_id,
                            csrfToken: autobot_object.Account.csrfToken,
                            town_id: build_object.town.id,
                            item_id: first_unit_order.id,
                            type: unit_type
                        })), 
                        $(".queue_id_" + first_unit_order.id).remove();
                    }
                    build_object.finished();
                });
            }, autobot_object.randomize(1e3, 2e3)) : (console_object.Log(build_object.town.name + " recruiting " + first_unit_order.count + " " + GameData.units[first_unit_order.item_name].name_plural + " not ready.", 3), build_object.finished());
        } else build_object.finished();
    },
    startBuildBuilding: function() {
        if (!build_object.checkEnabled()) return false;
        if(void 0 !== build_object.building_queue[build_object.town.id] && 
            build_object.building_queue[build_object.town.id].length !== 0 && 
            build_object.building_queue[build_object.town.id]){ 
        build_object.interval = setTimeout(function() {
            console_object.Log(build_object.town.name + " getting building information.", 3), 
            api_object.building_main(build_object.town.id, function(_0x101284) {
                if (build_object.hasFreeBuildingSlots(_0x101284)) {
                    var building_item = build_object.building_queue[build_object.town.id][0];
                    if (void 0 !== building_item) {
                        var _0x936f75 = build_object.getBuildings(_0x101284)[building_item.item_name];
                        _0x936f75.can_upgrade ? api_object.frontend_bridge(build_object.town.id, {
                            model_url: "BuildingOrder",
                            action_name: "buildUp",
                            arguments: {
                                building_id: building_item.item_name
                            },
                            town_id: build_object.town.id,
                            nl_init: true
                        }, function(response) {
                            if (response.success) {
                                if (build_object.town.id === Game.townId)
                                    for (var _0x5b3a08 = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING), _0x47b571 = 0; _0x5b3a08.length > _0x47b571; _0x47b571++) 
                                    _0x5b3a08[_0x47b571].getHandler().refresh();
                                console_object.Log('<span style="color: #ffa03d;">' + building_item.item_name.capitalize() + " - " + response.success + "</span>", 3), 
                                api_object.Auth("removeItemQueue", {
                                    player_id: autobot_object.Account.player_id,
                                    world_id: autobot_object.Account.world_id,
                                    csrfToken: autobot_object.Account.csrfToken,
                                    town_id: build_object.town.id,
                                    item_id: building_item.id,
                                    type: "building"
                                }, build_object.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders"),{
                                    player_id: autobot_object.Account.player_id,
                                    world_id: autobot_object.Account.world_id,
                                    csrfToken: autobot_object.Account.csrfToken,
                                    town_id: build_object.town.id,
                                    item_id: building_item.id,
                                    type: "building"
                                })), 
                                $(".queue_id_" + building_item.id).remove();
                            }
                            response.error && console_object.Log(build_object.town.name + " " + response.error, 3),  console_object.Log("B",1) , setTimeout(function() {if(void 0 !== build_object.building_queue[build_object.town.id] && 
                                build_object.building_queue[build_object.town.id].length !== 0 && 
                                build_object.building_queue[build_object.town.id]) build_object.startQueueing();
                            else build_object.finished();},2e3);
                        }) : _0x936f75.enough_population ? _0x936f75.enough_resources ? 
                        (console_object.Log(build_object.town.name + " " + building_item.item_name + " can not be started due dependencies.", 3), 
                        api_object.Auth("removeItemQueue", {
                            player_id: autobot_object.Account.player_id,
                            world_id: autobot_object.Account.world_id,
                            csrfToken: autobot_object.Account.csrfToken,
                            town_id: build_object.town.id,
                            item_id: building_item.id,
                            type: "building"
                        }, 
                        build_object.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders"),{
                            player_id: autobot_object.Account.player_id,
                            world_id: autobot_object.Account.world_id,
                            csrfToken: autobot_object.Account.csrfToken,
                            town_id: build_object.town.id,
                            item_id: building_item.id,
                            type: "building"
                        })), 
                        $(".queue_id_" + building_item.id).remove(), console_object.Log("A",1), build_object.finished()) : 
                        (console_object.Log(build_object.town.name + " not enough resources for " + building_item.item_name + ".", 3), build_object.finished()) : 
                        (console_object.Log(build_object.town.name + " not enough population for " + building_item.item_name + ".", 3), console_object.Log("C",1), build_object.finished());
                    } else build_object.finished();
                } else console_object.Log(build_object.town.name + " no free building slots available.", 3), console_object.Log("D",1),build_object.finished();
            });
        }, autobot_object.randomize(1e3, 2e3));} else {console_object.Log("E",1),build_object.finished();}
    },
    /** Retorna el proximo tiempo en el cual se termina una construccion o el intervalo por defecto */
    getReadyTime: function(town_id) {
        var time_left_info = {
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
        $.each(MM.getOnlyCollectionByName("BuildingOrder").models, function(index, building_order_model) {
            if(town_id === building_order_model.getTownId()) 
                time_left_info.building.queue.push({
                    type: "building",
                    model: building_order_model
                });
        }), 
        $.each(MM.getOnlyCollectionByName("UnitOrder").models, function(index, unit_order_model) {
            if(town_id === unit_order_model.attributes.town_id){ 
                if("ground" === unit_order_model.attributes.kind)
                time_left_info.unit.queue.push({
                    type: "unit",
                    model: unit_order_model
                });
                if("naval" === unit_order_model.attributes.kind) 
                    time_left_info.ship.queue.push({
                    type: "ship",
                    model: unit_order_model
                });
            }
        });
        var left_time_next_instant_buy = null,
            next = "nothing";

        $.each(time_left_info, function(queue_info) {
            if("building" === queue_info && void 0 !== build_object.building_queue[town_id] && build_object.building_queue[town_id].length || 
            "unit" === queue_info && void 0 !== build_object.units_queue[town_id]  && build_object.units_queue[town_id].length || 
            "ship" === queue_info && void 0 !== build_object.ships_queue[town_id] && build_object.ships_queue[town_id].length) 
             next = queue_info;
        }); 

        if(GameDataInstantBuy.isEnabled() && time_left_info.building.queue.length > 0) 
            left_time_next_instant_buy = time_left_info.building.queue[0].model.getTimeLeft() - 300; 
        
        return ({
            readyTime: Timestamp.now() + (left_time_next_instant_buy > 0 ? Math.min(left_time_next_instant_buy,build_object.settings.timeinterval) : +build_object.settings.timeinterval),
            shouldStart: next
        });
    },
    stop: function() {
        clearInterval(build_object.interval);
    },
    checkEnabled: function() {
        return main_object.modules.Autobuild.isOn;
    },
    finished: function() {
        if (!build_object.checkEnabled()) return false;
        build_object.town.modules.Autobuild.isReadyTime = build_object.getReadyTime(build_object.town.id).readyTime, 
        main_object.Queue.next();
    },
    checkInstantComplete: function(town_id) {
        return build_object.instantBuyTown = false, $.each(MM.getOnlyCollectionByName("BuildingOrder").models, function(index, town) {
            if (town_id === town.getTownId() && town.getTimeLeft() < 300) return build_object.instantBuyTown = {
                order_id: town.id,
                building_name: town.getBuildingId()
            }, false;
        }), build_object.instantBuyTown;
    },
    checkBuildingDepencencies: function(_0x80cde4, _0x57ade8) {
        var _0x5c0926 = GameData.buildings[_0x80cde4].dependencies,
            _0x5a2b59 = _0x57ade8.getBuildings().getBuildings(),
            _0x3a0012 = [];
        return $.each(_0x5c0926, function(_0x43aea8, _0x222bd8) {
            _0x5a2b59[_0x43aea8] < _0x222bd8 && _0x3a0012.push({
                building_id: _0x43aea8,
                level: _0x222bd8
            });
        }), _0x3a0012;
    },
    callbackSaveBuilding: function(queue_selector,item) {
        return function(response) {
            queue_selector.each(function() {
                $(this).find(".empty_slot").remove(), 
                response ? 
                ($.extend(item,{'id':response.order_id}),
                ($(this).append(build_object.buildingElement($(this), item)), 
                build_object.setEmptyItems($(this)))) : 
                build_object.setEmptyItems($(this));
            }); 
            if(response){
                if(!(item.town_id in build_object.building_queue))
                    build_object.building_queue[item.town_id] = []
                build_object.building_queue[item.town_id].push(item)
            } else {
                build_object.building_queue[item.town_id] = build_object.building_queue[item.town_id].filter(function(x) {
                    return x.id !== item.item_id
                })
            }
        };
    },
    callbackSaveSettings: function() {
        console_object.Log("Settings saved", 3), 
        HumanMessage.success("The settings were saved!");
    },
    hasFreeBuildingSlots: function(_0x25d864) {
        var _0x5a3b20 = false;
        return void 0 !== _0x25d864 && /BuildingMain\.full_queue = false;/g.test(_0x25d864.html) && (_0x5a3b20 = true), _0x5a3b20;
    },
    getBuildings: function(_0x2edf6b) {
        var _0x23eeec = null;
        if (void 0 !== _0x2edf6b.html) {
            var _0x740425 = _0x2edf6b.html.match(/BuildingMain\.buildings = (.*);/g);
            void 0 !== _0x740425[0] && (_0x23eeec = JSON.parse(_0x740425[0].substring(25, _0x740425[0].length - 1)));
        }
        return _0x23eeec;
    },
    initQueue: function(html_element, queue_type) {

        /** Agrega los items a la cola que sea tanto construccion, unidades, o barcos
         *  luego agrega los espacios vacios para que siempre queden de 7
         *  y por último agrega la barra para scrollear.
         */

        var html_queue = html_element.find(".ui_various_orders");
        html_queue.find(".empty_slot").remove(); 

        switch(queue_type){
            case "building" : $("#building_tasks_main").addClass("active"); 
                                if(void 0 !== build_object.building_queue[Game.townId])  
                                $.each(build_object.building_queue[Game.townId], function(index, building) {
                                    html_queue.append(build_object.buildingElement(html_queue, building));
                                });
                                break;
            case "unit" : $("#unit_orders_queue").addClass("active"); 
                            if( void 0 !== build_object.units_queue[Game.townId] ) {
                            $.each(build_object.units_queue[Game.townId], function(index, unit) {
                                html_queue.append(build_object.unitElement(html_queue, unit, queue_type));
                            })};
                            break;
            case "ship" : $("#unit_orders_queue").addClass("active"); 
                            if(void 0 !== build_object.ships_queue[Game.townId]) $.each(build_object.ships_queue[Game.townId], function(index, ship) {
                                html_queue.append(build_object.unitElement(html_queue, ship, queue_type));
                            }); break;
        }

        build_object.setEmptyItems(html_queue), 
        html_queue.parent().mousewheel(function(_0x407414, _0x3e3ded) {
            this.scrollLeft -= 30 * _0x3e3ded, _0x407414.preventDefault();
        });
    },
    initUnitOrder: function(unit_order_element, _0x45df02) {

        /** Agrega el boton para agregar una orden de reclutamiento */

        var selected_unit_data = unit_order_element.units[unit_order_element.unit_id],
            _0x5ec1ba = unit_order_element.$el.find("#unit_order_confirm"),
            _0x13a5c1 = unit_order_element.$el.find("#unit_order_addqueue"),
            _0x2b2935 = unit_order_element.$el.find("#unit_order_slider");
        if (_0x13a5c1.length >= 0 && 
            (selected_unit_data.missing_building_dependencies.length >= 1 || selected_unit_data.missing_research_dependencies.length >= 1) && 
                 _0x13a5c1.hide(), 0 === selected_unit_data.missing_building_dependencies.length &&
                  0 === selected_unit_data.missing_research_dependencies.length) {
            var _0x40bbe0 = ITowns.towns[Game.townId],
                _0x368776 = selected_unit_data.max_build,
                _0x2df979 = Math.max.apply(this, [selected_unit_data.resources.wood, selected_unit_data.resources.stone, selected_unit_data.resources.iron]),
                _0x6f1c3 = [];
            _0x6f1c3.push(Math.floor(_0x40bbe0.getStorage() / _0x2df979)), _0x6f1c3.push(Math.floor((_0x40bbe0.getAvailablePopulation() - build_object.checkPopulationBeingBuild()) / selected_unit_data.population)), selected_unit_data.favor > 0 && _0x6f1c3.push(Math.floor(500 / selected_unit_data.favor));
            var _0x4eb6e2 = Math.min.apply(this, _0x6f1c3);
            _0x4eb6e2 > 0 && _0x4eb6e2 >= _0x368776 && unit_order_element.slider.setMax(_0x4eb6e2), 0 === _0x13a5c1.length ? (_0x13a5c1 = $("<a/>", {
                href: "#",
                id: "unit_order_addqueue",
                class: "confirm"
            }), _0x5ec1ba.after(_0x13a5c1), _0x13a5c1.mousePopup(new MousePopup("Add to reqruite queue")).on("click", function(_0x49f41d) {
                _0x49f41d.preventDefault(), build_object.addUnitQueueItem(selected_unit_data, _0x45df02);
            })) : (_0x13a5c1.unbind("click"), _0x13a5c1.on("click", function(_0x4fb1e0) {
                _0x4fb1e0.preventDefault(), build_object.addUnitQueueItem(selected_unit_data, _0x45df02);
            })), _0x4eb6e2 <= 0 ? _0x13a5c1.hide() : _0x13a5c1.show(), _0x5ec1ba.show(), _0x2b2935.slider({
                slide: function(_0x179725, _0x1cac2d) {
                    _0x1cac2d.value > _0x368776 ? _0x5ec1ba.hide() : _0x1cac2d.value >= 0 && _0x1cac2d.value <= _0x368776 && _0x5ec1ba.show(), 0 === _0x1cac2d.value ? _0x13a5c1.hide() : _0x1cac2d.value > 0 && _0x4eb6e2 > 0 && _0x13a5c1.show();
                }
            });
        }
    },
    checkBuildingLevel: function(building) {
        console.log(building);
        var _0x2ba324 = ITowns.towns[Game.townId].getBuildings().attributes[building.item_name];
        return $.each(ITowns.towns[Game.townId].buildingOrders().models, function(index, _0x27ee5e) {
            _0x27ee5e.attributes.building_type === building.item_name && _0x2ba324++;
        }), void 0 !== build_object.building_queue[Game.townId] && $(build_object.building_queue[Game.townId]).each(function(index, _0x12da94) {
            if (_0x12da94.id === building.id) return false;
            _0x12da94.item_name === building.item_name && _0x2ba324++;
        }), ++_0x2ba324;
    },
    checkPopulationBeingBuild: function() {
        var _0x34a6a8 = 0;
        return void 0 !== build_object.units_queue[Game.townId] && $(build_object.units_queue[Game.townId].unit).each(function(index, _0x3f0a21) {
            _0x34a6a8 += _0x3f0a21.count * GameData.units[_0x3f0a21.item_name].population;
        }), void 0 !== build_object.ships_queue[Game.townId] && $(build_object.ships_queue[Game.townId].ship).each(function(index, _0x26c22a) {
            _0x34a6a8 += _0x26c22a.count * GameData.units[_0x26c22a.item_name].population;
        }), _0x34a6a8;
    },
    addUnitQueueItem: function(_0x3c0510, _0x20f8a1) {
        api_object.Auth("addItemQueue", {
            player_id: autobot_object.Account.player_id,
            world_id: autobot_object.Account.world_id,
            csrfToken: autobot_object.Account.csrfToken,
            town_id: Game.townId,
            item_name: _0x3c0510.id,
            type: _0x20f8a1,
            count: UnitOrder.slider.getValue()
        }, build_object.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), _0x20f8a1,{
            player_id: autobot_object.Account.player_id,
            world_id: autobot_object.Account.world_id,
            csrfToken: autobot_object.Account.csrfToken,
            town_id: Game.townId,
            item_name: _0x3c0510.id,
            type: _0x20f8a1,
            count: UnitOrder.slider.getValue()
        }));
    },
    callbackSaveUnits: function(html_queue, unit_type,item) {
        return function(response) {
            console.log(response);
            html_queue.each(function() {
                $(this).find(".empty_slot").remove(), 
                response ? 
                ($.extend(item,{'id':response.order_id}),
                ($(this).append(build_object.unitElement($(this), item, unit_type)), 
                build_object.setEmptyItems($(this)))) : 
                build_object.setEmptyItems($(this)), UnitOrder.selectUnit(UnitOrder.unit_id);
            });
            if(response){
                if("unit" === unit_type) {
                    if(!(item.town_id in build_object.units_queue))
                        build_object.units_queue[item.town_id] = []
                    build_object.units_queue[item.town_id].push(item);
                } 
                else if ("ship" === unit_type ){
                    if(! (item.town_id in build_object.ships_queue) )
                        build_object.ships_queue[item.town_id] = []
                    build_object.ships_queue[item.town_id].push(item); 
                }
            } else {
                if("unit" === unit_type) build_object.units_queue[item.town_id] = build_object.units_queue[item.town_id].filter(function(x) {
                    return x.id !== item.item_id
                }); 
                else if ("ship" === unit_type ) build_object.ships_queue[item.town_id] = build_object.ships_queue[item.town_id].filter(function(x) {
                    return x.id !== item.item_id
                }); 
            }
        };
    },

    setEmptyItems: function(set_empty_items_queue) {
        var new_width = 0,
            old_width = set_empty_items_queue.parent().width();
        $.each(set_empty_items_queue.find(".js-tutorial-queue-item"), function() {
            new_width += $(this).outerWidth(true);
        }); /*
        var _0x4b233b = old_width - new_width;
        if (_0x4b233b >= 0) {
            set_empty_items_queue.width(old_width);
            for (var _0x55611b = 1; _0x55611b <= Math.floor(_0x4b233b) / 60; _0x55611b++) set_empty_items_queue.append($("<div/>", {
                class: "js-queue-item js-tutorial-queue-item construction_queue_sprite empty_slot"
            }));
        } else */set_empty_items_queue.width(new_width + 25);
    },
    buildingElement: function(building_element_queue, building_element_item) {
        return $("<div/>", {
            class: "js-tutorial-queue-item queued_building_order last_order " + building_element_item.item_name + " queue_id_" + building_element_item.id
        }).append($("<div/>", {
            class: "construction_queue_sprite frame"
        }).mousePopup(new MousePopup(building_element_item.item_name.capitalize() + " queued")).append($("<div/>", {
            class: "item_icon building_icon40x40 js-item-icon build_queue " + building_element_item.item_name
        }).append($("<div/>", {
            class: "building_level"
        }).append('<span class="construction_queue_sprite arrow_green_ver"></span>' + build_object.checkBuildingLevel(building_element_item))))).append($("<div/>", {
            class: "btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue"
        }).on("click", function(_0xe39ad9) {
            _0xe39ad9.preventDefault(), api_object.Auth("removeItemQueue", {
                player_id: autobot_object.Account.player_id,
                world_id: autobot_object.Account.world_id,
                csrfToken: autobot_object.Account.csrfToken,
                town_id: Game.townId,
                item_id: building_element_item.id,
                type: "building"
            }, 
            build_object.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders"),{
                player_id: autobot_object.Account.player_id,
                world_id: autobot_object.Account.world_id,
                csrfToken: autobot_object.Account.csrfToken,
                town_id: Game.townId,
                item_id: building_element_item.id,
                type: "building"
            })), 
            $(".queue_id_" + building_element_item.id).remove();
        }).append($("<div/>", {
            class: "left"
        })).append($("<div/>", {
            class: "right"
        })).append($("<div/>", {
            class: "caption js-caption"
        }).append($("<div/>", {
            class: "effect js-effect"
        }))));
    },
    unitElement: function(unit_element_queue, unit_element_item, _0xed46f8) {
        return $("<div/>", {
            class: "js-tutorial-queue-item queued_building_order last_order " + unit_element_item.item_name + " queue_id_" + unit_element_item.id
        }).append($("<div/>", {
            class: "construction_queue_sprite frame"
        }).mousePopup(new MousePopup(unit_element_item.item_name.capitalize().replace("_", " ") + " queued")).append($("<div/>", {
            class: "item_icon unit_icon40x40 js-item-icon build_queue " + unit_element_item.item_name
        }).append($("<div/>", {
            class: "unit_count text_shadow"
        }).html(unit_element_item.count)))).append($("<div/>", {
            class: "btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue"
        }).on("click", function(_0x25fae1) {
            _0x25fae1.preventDefault(), api_object.Auth("removeItemQueue", {
                player_id: autobot_object.Account.player_id,
                world_id: autobot_object.Account.world_id,
                csrfToken: autobot_object.Account.csrfToken,
                town_id: Game.townId,
                item_id: unit_element_item.id,
                type: _0xed46f8
            }, build_object.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), _0xed46f8,{
                player_id: autobot_object.Account.player_id,
                world_id: autobot_object.Account.world_id,
                csrfToken: autobot_object.Account.csrfToken,
                town_id: Game.townId,
                item_id: unit_element_item.id,
                type: _0xed46f8
            })), $(".queue_id_" + unit_element_item.id).remove();
        }).append($("<div/>", {
            class: "left"
        })).append($("<div/>", {
            class: "right"
        })).append($("<div/>", {
            class: "caption js-caption"
        }).append($("<div/>", {
            class: "effect js-effect"
        }))));
    },
    contentSettings: function() {
        return $("<fieldset/>", {
            id: "Autobuild_settings",
            class: main_object.hasPremium ? "" : "disabled-box",
            style: "float:left; width:472px; height: 270px;"
        }).append($("<legend/>").html("Autobuild Settings")).append(menu_object.checkbox({
            text: "AutoStart Autobuild.",
            id: "autobuild_autostart",
            name: "autobuild_autostart",
            checked: build_object.settings.autostart
        })).append(menu_object.selectBox({
            id: "autobuild_timeinterval",
            name: "autobuild_timeinterval",
            label: "Check every: ",
            styles: "width: 120px;",
            value: build_object.settings.timeinterval,
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
            checked: build_object.settings.enable_building
        })).append(menu_object.checkbox({
            text: "Enable barracks queue.",
            id: "autobuild_barracks_enable",
            name: "autobuild_barracks_enable",
            style: "width: 100%;",
            checked: build_object.settings.enable_units
        })).append(menu_object.checkbox({
            text: "Enable ships queue.",
            id: "autobuild_ships_enable",
            name: "autobuild_ships_enable",
            style: "width: 100%;padding-bottom: 35px;",
            checked: build_object.settings.enable_ships
        })).append(function() {
            var _0x10bf19 = menu_object.button({
                name: DM.getl10n("notes").btn_save,
                style: "top: 10px;",
                class: main_object.hasPremium ? "" : " disabled"
            }).on("click", function() {
                if (!main_object.hasPremium) return false;
                var _0x487813 = $("#Autobuild_settings").serializeObject();
                build_object.settings.autostart = void 0 !== _0x487813.autobuild_autostart, build_object.settings.timeinterval = parseInt(_0x487813.autobuild_timeinterval), build_object.settings.autostart = void 0 !== _0x487813.autobuild_autostart, build_object.settings.enable_building = void 0 !== _0x487813.autobuild_building_enable, build_object.settings.enable_units = void 0 !== _0x487813.autobuild_barracks_enable, build_object.settings.enable_ships = void 0 !== _0x487813.autobuild_ships_enable, build_object.settings.instant_buy = void 0 !== _0x487813.autobuild_instant_buy, 
                api_object.Auth("saveBuild", $.extend({
                    player_id: autobot_object.Account.player_id,
                    world_id: autobot_object.Account.world_id,
                    csrfToken: autobot_object.Account.csrfToken,
                },build_object.settings), build_object.callbackSaveSettings);
            });
            return main_object.hasPremium || _0x10bf19.mousePopup(new MousePopup(main_object.requiredPrem)), _0x10bf19;
        });
    },
    settings: {
        autostart: false,
        enable_building: true,
        enable_units: true,
        enable_ships: true,
        timeinterval: 120,
        instant_buy: true
    },
    building_queue: {},
    units_queue: {},
    ships_queue: {},
    town: null,
    iTown: null,
    interval: null,
    currentWindow: null,
    isCaptain: false,
    Queue: 0,
    ModuleManager: void 0,
    windows: {
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
                        }, build_object.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders"),{
                            player_id: autobot_object.Account.player_id,
                            world_id: autobot_object.Account.world_id,
                            csrfToken: autobot_object.Account.csrfToken,
                            town_id: Game.townId,
                            item_name: _0x5ab183,
                            count: 1,
                            type: "building"
                        }));
                    });
                });
            }
        },
        building_barracks_index: function() {
            GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING) && (build_object.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING).getJQElement().find(".gpwindow_content"), build_object.currentWindow.find("#unit_orders_queue h4").find(".js-max-order-queue-count").html("&infin;"));
        }
    }
};


var main_object = {
    init: function() {
        main_object.loadPlayerTowns(),
        main_object.initButtons(),
        main_object.initTimer();
    },
    start: function() {
        var at_least_one_ready = false, waiting_time = null;

        if ($.each(main_object.playerTowns, function(index, town) {

                var ready = farm_object.checkReady(town);
                
                true === ready ? (at_least_one_ready = true, main_object.Queue.add({
                    townId: town.id,
                    fx: function() {
                        town.startFarming();
                    }
                })) : false !== ready && (null == waiting_time || ready < waiting_time) && (waiting_time = ready);

                //console_object.Log("Tiempo de espera por ahora: " + waiting_time,1)

                var _0x39d13c = culture_object.checkReady(town);
                true === _0x39d13c ? (at_least_one_ready = true, main_object.Queue.add({
                    townId: town.id,
                    fx: function() {
                        town.startCulture();
                    }
                })) : false !== _0x39d13c && (null == waiting_time || _0x39d13c < waiting_time) && (waiting_time = _0x39d13c);

                //console_object.Log("Tiempo de espera por ahora: " + waiting_time,1)

                var _0x2c7ceb = build_object.checkReady(town);
                true === _0x2c7ceb ? (at_least_one_ready = true, main_object.Queue.add({
                    townId: town.id,
                    fx: function() {
                        town.startBuild();
                    }
                })) : false !== _0x2c7ceb && (null == waiting_time || _0x2c7ceb < waiting_time) && (waiting_time = _0x2c7ceb);

                //console_object.Log("Tiempo de espera por ahora: " + waiting_time,1)

            }), null !== waiting_time || at_least_one_ready)
            if (at_least_one_ready) main_object.Queue.start();
            else {
                var delta_time_progressbar = waiting_time - Timestamp.now() + 10;
                main_object.startTimer(delta_time_progressbar, function() { main_object.start(); });
            }
        else console_object.Log("Nothing is ready yet!", 0), 
             main_object.startTimer(30, function() { main_object.start(); });
    },
    stop: function() {
        clearInterval(main_object.interval), 
        main_object.Queue.stop(), 
        $("#time_autobot .caption .value_container .curr").html("Stopped");
    },
    finished: function() {
        main_object.start();
    },
    initTimer: function() {
        $(".nui_main_menu").css("top", "275px"), 
        $("#time_autobot").append(menu_object.timerBoxSmall({
            id: "Autofarm_timer",
            styles: "",
            text: "Start Autobot"
        })).show();
    },
    updateTimer: function(_0x2c3564, _0x4b720b) {
        var _0x312a2a = 0;
        _0x312a2a = void 0 !== _0x2c3564 && void 0 !== _0x4b720b ? 
        (main_object.Queue.total - (main_object.Queue.queue.length + 1) + _0x4b720b / _0x2c3564) / main_object.Queue.total * 100 : 
        (main_object.Queue.total - main_object.Queue.queue.length) / main_object.Queue.total * 100, isNaN(_0x312a2a) || 
        ($("#time_autobot .progress .indicator").width(_0x312a2a + "%"), $("#time_autobot .caption .value_container .curr").html(Math.round(_0x312a2a) + "%"));        
    },
    checkAutostart: function() {
        if (farm_object.settings.autostart) {
            main_object.modules.Autofarm.isOn = true;
            var _0x9ebb03 = $("#Autofarm_onoff");
            _0x9ebb03.addClass("on"), 
            _0x9ebb03.find("span").mousePopup(new MousePopup("Stop Autofarm"));
        }
        if (culture_object.settings.autostart) {
            main_object.modules.Autoculture.isOn = true;
            var _0x50f9ec = $("#Autoculture_onoff");
            _0x50f9ec.addClass("on"), 
            _0x50f9ec.find("span").mousePopup(new MousePopup("Stop Autoculture"));
        }
        if (build_object.settings.autostart) {
            main_object.modules.Autobuild.isOn = true;
            var _0x3b4a45 = $("#Autobuild_onoff");
            _0x3b4a45.addClass("on"), 
            _0x3b4a45.find("span").mousePopup(new MousePopup("Stop Autobuild"));
        }
        (farm_object.settings.autostart || culture_object.settings.autostart || build_object.settings.autostart) && main_object.start();
    },
    startTimer: function(_0x560602, _0x173cd2) {
        var _0x1db276 = _0x560602;
        main_object.interval = setInterval(function() {
            $("#time_autobot .caption .value_container .curr").html(autobot_object.toHHMMSS(_0x560602)), 
            $("#time_autobot .progress .indicator").width((_0x1db276 - _0x560602) / _0x1db276 * 100 + "%"), 
            --_0x560602 < 0 && (clearInterval(main_object.interval), _0x173cd2());
        }, 1000);
    },
    initButtons: function(module_id) {
        var button_html = $("#" + module_id + "_onoff");
        button_html.removeClass("disabled"),
            button_html.on("click", function(_0x50cb90) {
                if (_0x50cb90.preventDefault(), "Autoattack" === module_id && !autobot_object.checkPremium("captain")) {
                    HumanMessage.error(Game.premium_data.captain.name + " " + DM.getl10n("premium").advisors.not_activated.toLowerCase() + ".");
                    return false;
                }
                if (main_object.modules[module_id].isOn) {
                    main_object.modules[module_id].isOn = false,
                        button_html.removeClass("on"),
                        button_html.find("span").mousePopup(new MousePopup("Start " + module_id)),
                        HumanMessage.success(module_id + " is deactivated."),
                        console_object.Log(module_id + " is deactivated.", 0);
                    switch (module_id) {
                        case "Autofarm":
                            farm_object.stop();
                            break;
                        case "Autoculture":
                            culture_object.stop();
                            break;
                        case "Autobuild":
                            build_object.stop();
                            break;
                        case "Autoattack":
                            attack_object.stop();
                            break;
                    };
                } else {
                    (button_html.addClass("on"),
                        HumanMessage.success(module_id + " is activated."),
                        console_object.Log(module_id + " is activated.", 0),
                        button_html.find("span").mousePopup(new MousePopup("Stop " + module_id)),
                        main_object.modules[module_id].isOn = true,
                        "Autoattack" === module_id && attack_object.start()),
                    "Autoattack" !== module_id && main_object.checkWhatToStart();
                }

            }), button_html.find("span").mousePopup(new MousePopup("Start " + module_id));
    },
    checkWhatToStart: function() {
        var i = 0;
        $.each(main_object.modules, function(index, module) { if(module.isOn && "Autoattack" !== module) i++; });
        if(0 === i) { 
            main_object.stop();
        } else {
            if(i >= 0 && !main_object.Queue.isRunning()) (clearInterval(main_object.interval), main_object.start());
        }
    },
    loadPlayerTowns: function() {
        /** Carga todas las ciudad dadas por la estructura ITowns del juego en main_object.playerTowns */
        var key = 0;
        $.each(ITowns.towns, function(index, town) {
            var town_object = new main_object.models.Town;
            town_object.key = key, 
            town_object.id = town.id, 
            town_object.name = town.name, 
            $.each(ITowns.towns, function(index, other_town) {
                if(town.getIslandCoordinateX() === other_town.getIslandCoordinateX() &&
                town.getIslandCoordinateY() === other_town.getIslandCoordinateY() && 
                town.id !== other_town.id) 
                    town_object.relatedTowns.push(other_town.id);
            }), 
            main_object.playerTowns.push(town_object), key++;
        }),
        main_object.playerTowns.sort(function(a, b) {
            return a.name === b.name ? 0 : a.name > b.name ? 1 : -1;
        });
    },
    callbackAuth: function(response) {
        autobot_object.isLogged = true,     
        autobot_object.trial_time = response.trial_time, 
        autobot_object.premium_time = response.premium_time, 
        autobot_object.facebook_like = response.facebook_like, 
        "" !== response.assistant_settings && settings_object.setSettings(response.assistant_settings), 
        autobot_object.trial_time - Timestamp.now() >= 0 || autobot_object.premium_time - Timestamp.now() >= 0 ? 
        (main_object.hasPremium = true, main_object.init(), farm_object.init(), farm_object.setSettings(response.autofarm_settings), 
        culture_object.init(), culture_object.setSettings(response.autoculture_settings), build_object.init(), 
        build_object.setSettings(response.autobuild_settings), build_object.setQueue(response.building_queue, response.units_queue, response.ships_queue), 
        attack_object.init(), main_object.checkAutostart()) : (main_object.hasPremium = false, main_object.init(), 
        farm_object.init(), $("#Autoculture_onoff").mousePopup(new MousePopup(main_object.requiredPrem)), 
        $("#Autobuild_onoff").mousePopup(new MousePopup(main_object.requiredPrem)), $("#Autoattack_onoff").mousePopup(new MousePopup(main_object.requiredPrem)), 
        autobot_object.createNotification("getPremiumNotification", "Unfortunately your premium membership is over. Please upgrade now!"));
    },
    models: {
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
    },
    Queue: {
        total: 0,
        queue: [],
        add: function(element) {
            this.total++, this.queue.push(element);
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
            main_object.updateTimer();
            var element = this.queue.shift();
            if(element) 
                element.fx(); 
            else {if(this.queue.length <= 0)(this.total = 0, main_object.finished())};
        }
    },
    currentTown: null,
    playerTowns: [],
    interval: false,
    hasPremium: false,
    modules: {
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
    },
    requiredPrem: DM.getl10n("tooltips").requirements.replace(".", "") + " premium"
};


function _0x5b13a7(_0x85c1e0) {
    return (_0x5b13a7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(_0x3fae10) {
        return typeof _0x3fae10;
    } : function(_0x490920) {
        return _0x490920 && "function" == typeof Symbol && _0x490920.constructor === Symbol && _0x490920 !== Symbol.prototype ? "symbol" : typeof _0x490920;
    })(_0x85c1e0);
}


var autobot_object = {
    trial_time : 0,
    premium_time: 0,
    facebook_like: 0,
    toolbox_element: null,

    init: function() {
            console_object.Log("Initialize Autobot", 0), 
            autobot_object.authenticate(), 
            autobot_object.obServer(), 
            autobot_object.isActive(), 
            autobot_object.setToolbox(), 
            autobot_object.initAjax(), 
            autobot_object.initMapTownFeature(), 
            autobot_object.fixMessage(), 
            settings_object.init();
        }, 
        setToolbox: function() {
            autobot_object.toolbox_element = $(".nui_bot_toolbox");
        }, 
        authenticate: function() {
            api_object.Auth("login", autobot_object.Account, main_object.callbackAuth);
        }, 
        obServer: function() {
            $.Observer(GameEvents.notification.push).subscribe("GRCRTNotification", function() {
                $("#notification_area>.notification.getPremiumNotification").on("click", function() {
                    autobot_object.getPremium();
                });
            });
        }, 
        initWnd: function() {
            if (autobot_object.isLogged) {
                if (void 0 !== autobot_object.botWnd) {
                    try {
                        autobot_object.botWnd.close();
                    } catch (exception) {}
                    autobot_object.botWnd = void 0;
                }
                if (void 0 !== autobot_object.botPremWnd) {
                    try {
                        autobot_object.botPremWnd.close();
                    } catch (exception) {}
                    autobot_object.botPremWnd = void 0;
                }
                autobot_object.botWnd = Layout.dialogWindow.open("", autobot_object.title, 500, 350, "", false), 
                autobot_object.botWnd.setHeight([350]), 
                autobot_object.botWnd.setPosition(["center", "center"]);
                var window_element = autobot_object.botWnd.getJQElement();
                window_element.append($("<div/>", {
                    class: "menu_wrapper",
                    style: "left: -43px; right: 14px;top : 7px"
                }).append($("<ul/>", {
                    class: "menu_inner"
                }).prepend(autobot_object.addMenuItem("AUTHORIZE", "Account", "Account")).prepend(autobot_object.addMenuItem("CONSOLE", "Assistant", "Assistant")).prepend(autobot_object.addMenuItem("ASSISTANT", "Console", "Console")).prepend(autobot_object.addMenuItem("SUPPORT", "Support", "Support")))), 
                window_element.find(".menu_inner li:last-child").before(autobot_object.addMenuItem("ATTACKMODULE", "Attack", "Autoattack")), 
                window_element.find(".menu_inner li:last-child").before(autobot_object.addMenuItem("CONSTRUCTMODULE", "Build", "Autobuild")), 
                window_element.find(".menu_inner li:last-child").before(autobot_object.addMenuItem("CULTUREMODULE", "Culture", "Autoculture")), 
                window_element.find(".menu_inner li:last-child").before(autobot_object.addMenuItem("FARMMODULE", "Farm", "Autofarm")), 
                $("#Autobot-AUTHORIZE").click();
            }
        }, 
        addMenuItem: function(id, name, _0x4e64a4, _0x26e24f) {
            return $("<li/>").append($("<a/>", {
                class: "submenu_link",
                href: "#",
                id: "Autobot-" + id,
                rel: _0x4e64a4
            }).click(function() {
                if (_0x26e24f) return false;
                if (autobot_object.botWnd.getJQElement().find("li a.submenu_link").removeClass("active"), 
                $(this).addClass("active"), 
                autobot_object.botWnd.setContent2(autobot_object.getContent($(this).attr("rel"))), 
                "Console" === $(this).attr("rel")) {
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
                }).html(name))) : '<a id="help-button" onclick="return false;" class="confirm"></a>';
            }));
        }, 
        getContent: function(submenu_name) {
            let content_map = {
                "Console" : console_object.contentConsole(),
                "Account" : autobot_object.contentAccount(),
                "Support" : autobot_object.contentSupport(),
                "Autofarm" : farm_object.contentSettings(),
                "Autobuild" : build_object.contentSettings(),
                "Autoattack" : attack_object.contentSettings(),
                "Autoculture" : culture_object.contentSettings(),
                "Assistant" : settings_object.contentSettings()
            }
            return content_map[submenu_name];
        }, 
        contentAccount: function() {
            var data = {
                    "Name:": Game.player_name,
                    "World:": Game.world_id,
                    "Rank:": Game.player_rank,
                    "Towns:": Game.player_villages,
                    "Language:": Game.locale_lang
                },
                table_content = $("<table/>", {
                    class: "game_table layout_main_sprite",
                    cellspacing: "0",
                    width: "100%"
                }).append(function() {
                    var row_number = 0,
                        body = $("<tbody/>");
                    return $.each(data, function(key, value) {
                        body.append($("<tr/>", {
                            class: row_number % 2 ? "game_table_even" : "game_table_odd"
                        }).append($("<td/>", {
                            style: "background-color: #DFCCA6;width: 30%;"
                        }).html(key)).append($("<td/>").html(value))), row_number++;
                    }), body.append($("<tr/>", {
                        class: "game_table_even"
                    }).append($("<td/>", {
                        style: "background-color: #DFCCA6;width: 30%;"
                    }).html("Premium:")).append($("<td/>").append(autobot_object.premium_time - Timestamp.now() >= 0 ? autobot_object.secondsToTime(autobot_object.premium_time - Timestamp.now()) : "No premium").append($("<div/>", {
                        id: "premium-bot"
                    }).append($("<div/>", {
                        class: "js-caption"
                    }).html(autobot_object.premium_time - Timestamp.now() >= 0 ? "Add days" : "Get Premium")).on("click", function() {
                        return autobot_object.getPremium();
                    })))), body.append($("<tr/>", {
                        class: "game_table_odd"
                    }).append($("<td/>", {
                        style: "background-color: #DFCCA6;width: 30%;"
                    }).html("Trial:")).append($("<td/>").append(function() {
                        return autobot_object.trial_time - Timestamp.now() >= 0 ? autobot_object.secondsToTime(autobot_object.trial_time - Timestamp.now()) : "Trial is over";
                    }))), body.append($("<tr/>", {
                        class: "game_table_even"
                    }).append($("<td/>", {
                        style: "background-color: #DFCCA6;width: 30%;"
                    }).html("Support Contact:")).append($("<td/>").append("brotherisimos@gmail.com")))
                    /*.append(function() {
                        $("<a/>", {
                            id: "get_7days"
                        }).html("Contact Support").click("on", function() {
                            return autobot_object.contentSupport();
                        }) ;
                    })*/, body;
                });
            return menu_object.gameWrapper("Account", "account_property_wrapper", table_content, "margin-bottom:9px;").append($("<div/>", {
                id: "grepobanner",
                style: ""
            }));
        }, 
        contentSupport: function() {
            return $("<fieldset/>", {
                id: "Support_tab",
                style: "text-align: center;  width:472px;height: 270px;"
            }).append($("<legend/>").html("Grepobot Support")).append($("<div/>", {
                style: ""
            }).append(menu_object.selectBox({
                id: "support_type",
                name: "support_type",
                label: "Type: ",
                styles: "width: 207px;margin-left: 18px;",
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
                style: "margin-left: 12px;width: 206px;",
                value: "",
                type: "email"
            })).append(menu_object.input({
                id: "support_input_subject",
                name: "Subject",
                style: "margin-top: 0;width: 206px;",
                value: "",
                type: "text"
            })).append(menu_object.textarea({
                id: "support_textarea",
                name: "Message",
                value: ""
            })).append(menu_object.button2({
                name: "Send",
                style: "margin-top: 0;"
            }).on("click", function() {
                var request_data = $("#Support_tab").serializeObject(),
                    _0x13df60 = false;
                void 0 === request_data.support_input_email || "" === request_data.support_input_email ? 
                _0x13df60 = "Please enter your email." : void 0 === request_data.support_input_subject || 
                "" === request_data.support_input_subject ?
                 _0x13df60 = "Please enter a subject." : void 0 === request_data.support_textarea || 
                 "" === request_data.support_textarea ? _0x13df60 = "Please enter a message." : void 0 === request_data.support_input_email || 
                 /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(request_data.support_input_email) || 
                 (_0x13df60 = "Your email is not valid!"), _0x13df60 ? HumanMessage.error(_0x13df60) : 
                api_object.Auth("supportEmail", $.extend({
                    csrfToken: autobot_object.Account.csrfToken,
                    player_name: autobot_object.Account.player_name,
                    player_id: autobot_object.Account.player_id,
                    world_id: autobot_object.Account.world_id
                }, request_data), function(_0x872969) {
                    if (_0x872969.email) {
                        if (void 0 !== autobot_object.botWnd) {
                            try {
                                autobot_object.botWnd.close();
                            } catch (_0x336581) {}
                            autobot_object.botWnd = void 0;
                        }
                        HumanMessage.success("Thank you, your email has been send!");
                    }
                });
            })));
        }, 
        checkAlliance: function() {
            $(".allianceforum.main_menu_item").hasClass("disabled") || api_object.members_show(function(response) {
                void 0 !== response.plain.html && $.each($(response.plain.html).find("#ally_members_body .ally_name a"), function() {
                    var href = atob($(this).attr("href"));
                    console.log(JSON.parse(href.substr(0, href.length - 3)));
                });
            });
        }, 
        fixMessage: function() {
            var _0x48731a;
            HumanMessage._initialize = (_0x48731a = HumanMessage._initialize, function() {
                _0x48731a.apply(this, arguments), $(window).unbind("click");
            });
        }, 
        getPremium: function() {
            var _0x3eea3a = this;
            if (autobot_object.isLogged) {
                if ($.Observer(GameEvents.menu.click).publish({
                        option_id: "premium"
                    }), void 0 !== autobot_object.botPremWnd) {
                    try {
                        autobot_object.botPremWnd.close();
                    } catch (_0x4fba79) {}
                    autobot_object.botPremWnd = void 0;
                }
                if (void 0 !== autobot_object.botWnd) {
                    try {
                        autobot_object.botWnd.close();
                    } catch (_0xe21845) {}
                    autobot_object.botWnd = void 0;
                }
                autobot_object.botPremWnd = Layout.dialogWindow.open("", "Autobot v" + autobot_object.version + " - Premium", 600, 350, "", false), autobot_object.botPremWnd.setHeight([350]), autobot_object.botPremWnd.setPosition(["center", "center"]);
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
                    class: "price",
                    price: 4.99
                }).html("$&nbsp;4,99"))).append($("<li/>").append($("<span/>", {
                    class: "amount"
                }).html("2 Month")).append($("<span/>", {
                    class: "price",
                    price: 9.99
                }).html("$&nbsp;9,99")).append($("<div/>", {
                    class: "referenceAmount"
                }).append($("<div/>", {
                    class: "reference",
                    style: "transform: rotate(17deg);"
                }).html("+12 Days&nbsp;")))).append($("<li/>").append($("<span/>", {
                    class: "amount"
                }).html("4 Months")).append($("<span/>", {
                    class: "price",
                    price: 19.99
                }).html("$&nbsp;19,99")).append($("<div/>", {
                    class: "referenceAmount"
                }).append($("<div/>", {
                    class: "reference",
                    style: "transform: rotate(17deg);"
                }).html("+36 Days&nbsp;")))).append($("<li/>").append($("<span/>", {
                    class: "amount"
                }).html("10 Months")).append($("<span/>", {
                    class: "price",
                    price: 49.99
                }).html("$&nbsp;49,99")).append($("<div/>", {
                    class: "referenceAmount"
                }).append($("<div/>", {
                    class: "reference",
                    style: "transform: rotate(17deg);"
                }).html("+120 Days&nbsp;")))))).append($("<div/>", {
                    style: "width: 340px; margin-right: 10px;float: right;"
                }).append($("<div/>", {
                    id: "information_paypal"
                })));
                autobot_object.botPremWnd.setContent2(_0x1fc633), 
                $("#time_options li").on("click", function() {
                    $("#time_options li").removeClass("active"), $(this).addClass("active");
                    $("#payment #information_paypal").children("#price_number").html("$" + $("#time_options").children(".active").children(".price").attr("price"));
                }), _0x3eea3a.makeSelectbox();
            }
        }, 
        makeSelectbox: function() {

            $("#payment #information_paypal").append($("<div/>", {
                id : "price_number",
                style: "margin: 40px;font-weight: 700;font-size: 28px;line-height: 12px;text-align: center;color: #d49f0f"
            }).html("$" + $("#time_options").children(".active").children(".price").attr("price")));

            $("#payment #information_paypal").append($("<div/>", {
                id: "paypal-button",
                style: "overflow: auto;max-height: 30vh;"
            }));
            
            paypal.Buttons({
                createOrder: function(data, actions) {
                  // This function sets up the details of the transaction, including the amount and line item details.
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        currency_code: 'USD',
                        value: parseFloat($("#time_options").children(".active").children(".price").attr("price"))
                      }
                    }]
                  });
                },
                onApprove: function(data, actions) {
                  // This function captures the funds from the transaction.
                  return actions.order.capture().then(function(details) {
                    // This function shows a transaction success message to your buyer.
                    api_object.PremiumPayed(
                        {
                            player_id: Game.player_id,
                            world_id: Game.world_id,
                            price: details.purchase_units[0].amount.value//details.price
                        },function(response){
                            autobot_object.premium_time = response.premium_time;
                            HumanMessage.success('Premium Actived');
                            setTimeout(function(){location.reload()},1000)});
                    console.log(details);
                  });
                }
              }).render('#paypal-button');

        }, 

        botFacebookWnd: function() {
            if (autobot_object.isLogged && 0 === autobot_object.facebook_like) {
                if (void 0 !== autobot_object.facebookWnd) {
                    try {
                        autobot_object.facebookWnd.close();
                    } catch (_0x169bf2) {}
                    autobot_object.facebookWnd = void 0;
                }
                autobot_object.facebookWnd = Layout.dialogWindow.open("", "Autobot v" + autobot_object.version + " - Get 3 days free!", 275, 125, "", false), autobot_object.facebookWnd.setHeight([125]), autobot_object.facebookWnd.setPosition(["center", "center"]);
                var _0x47ffb0 = $("<div/>", {
                    id: "facebook_wnd"
                }).append('<span class="like-share-text">Like & share and get <b>3 days</b> free premium.</span><a href="#" class="fb-share"><span class="fb-text">Share</spanclass></a><div class="fb_like"><div class="fb-like" data-href="https://www.facebook.com/BotForGrepolis/" data-layout="button" data-action="like" data-show-faces="false" data-share="false"></div></div>');
                autobot_object.facebookWnd.setContent2(_0x47ffb0), $(".ui-dialog #facebook_wnd").closest(".gpwindow_content").css({
                    left: "-9px",
                    right: "-9px",
                    top: "35px"
                });
                var _0x5524ab = false,
                    _0x58b9df = false,
                    _0x3a96fa = function() {
                        if ((_0x5524ab || _0x58b9df) && autobot_object.upgrade3Days(), _0x5524ab && _0x58b9df) {
                            if ($.Observer(GameEvents.window.quest.open).publish({
                                    quest_type: "hermes"
                                }), HumanMessage.success("You have received 3 days premium! Thank you for sharing."), void 0 !== autobot_object.facebookWnd) {
                                try {
                                    autobot_object.facebookWnd.close();
                                } catch (_0x2fa476) {}
                                autobot_object.facebookWnd = void 0;
                            }
                            if (void 0 !== autobot_object.botWnd) {
                                try {
                                    autobot_object.botWnd.close();
                                } catch (_0x3aaabd) {}
                                autobot_object.botWnd = void 0;
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
        }, 
        upgrade3Days: function() {
            api_object.Auth("upgrade3Days", autobot_object.Account, function(_0x43b2ad) {
                _0x43b2ad.success && api_object.Auth("login", autobot_object.Account, main_object.callbackAuth);
            });
        }, 
        initAjax: function() {
            $(document).ajaxComplete(function(_0x463c4a, _0x4eec6e, _0x2bb2a7) {
                if (-1 === _0x2bb2a7.url.indexOf(autobot_object.domain) && -1 !== _0x2bb2a7.url.indexOf("/game/") && 4 === _0x4eec6e.readyState && 200 === _0x4eec6e.status) {
                    var _0x25ed02 = _0x2bb2a7.url.split("?"),
                        _0x38f326 = _0x25ed02[0].substr(6) + "/" + _0x25ed02[1].split("&")[1].substr(7);
                    void 0 !== build_object && build_object.calls(_0x38f326), void 0 !== attack_object && attack_object.calls(_0x38f326, _0x4eec6e.responseText);
                }
            });
        }, 
        randomize: function(left, right) {
            return Math.floor(Math.random() * (right - left + 1)) + left;
        }, 
        secondsToTime: function(seconds) {
            var days = Math.floor(seconds / 86400),
                hours = Math.floor(seconds % 86400 / 3600),
                minutes = Math.floor(seconds % 86400 % 3600 / 60);
            return (days ? days + " days " : "") + (hours ? hours + " hours " : "") + (minutes ? minutes + " minutes " : "");
        }, 
        timeToSeconds: function(time) {
            for (var number_list = time.split(":"), seconds = 0, _0x1fc351 = 1; number_list.length > 0;) seconds += _0x1fc351 * parseInt(number_list.pop(), 10), _0x1fc351 *= 60;
            return seconds;
        }, 
        arrowActivated: function() {
            var _0x58e052 = $("<div/>", {
                class: "helpers helper_arrow group_quest d_w animate bounce",
                "data-direction": "w",
                style: "top: 0; left: 360px; visibility: visible; display: none;"
            });
            autobot_object.toolbox_element.append(_0x58e052), _0x58e052.show().animate({
                left: "138px"
            }, "slow").delay(1e4).fadeOut("normal"), setTimeout(function() {
                autobot_object.botFacebookWnd();
            }, 25e3);
        }, 
        createNotification: function(_0x167d10, _0x5019ac) {
            (void 0 === Layout.notify ? new NotificationHandler : Layout).notify($("#notification_area>.notification").length + 1, _0x167d10, "<span><b>Autobot</b></span>" + _0x5019ac + "<span class='small notification_date'>Version " + autobot_object.version + "</span>");
        }, 
        toHHMMSS: function(_0x396bc0) {
            var _0x517441 = ~~(_0x396bc0 / 3600),
                _0x7df6f9 = ~~(_0x396bc0 % 3600 / 60),
                _0x2f570a = _0x396bc0 % 60,
                _0x2ac6f1 = "";
            return _0x517441 > 0 && (_0x2ac6f1 += _0x517441 + ":" + (_0x7df6f9 < 10 ? "0" : "")), _0x2ac6f1 += _0x7df6f9 + ":" + (_0x2f570a < 10 ? "0" : ""), _0x2ac6f1 += "" + _0x2f570a;
        }, 
        stringify: function(_0x5e37e3) {
            var _0x2403aa = _0x5b13a7(_0x5e37e3);
            if ("string" === _0x2403aa) return '"' + _0x5e37e3 + '"';
            if ("boolean" === _0x2403aa || "number" === _0x2403aa) return _0x5e37e3;
            if ("function" === _0x2403aa) return _0x5e37e3.toString();
            var _0xebdddc = [];
            for (var _0x1c31fa in _0x5e37e3) _0xebdddc.push('"' + _0x1c31fa + '":' + this.stringify(_0x5e37e3[_0x1c31fa]));
            return "{" + _0xebdddc.join(",") + "}";
        }, 
        isActive: function() {
            setTimeout(function() {
                api_object.Auth("isActive", autobot_object.Account, autobot_object.isActive);
            }, 60000);
        }, 
        town_map_info: function(_0x2349ea, _0x1ce465) {
            if (void 0 !== _0x2349ea && _0x2349ea.length > 0 && _0x1ce465.player_name)
                for (var _0xab4296 = 0; _0xab4296 < _0x2349ea.length; _0xab4296++)
                    if ("flag town" === _0x2349ea[_0xab4296].className) {
                        void 0 !== settings_object && (settings_object.settings.town_names && $(_0x2349ea[_0xab4296]).addClass("active_town"), settings_object.settings.player_name && $(_0x2349ea[_0xab4296]).addClass("active_player"), settings_object.settings.alliance_name && $(_0x2349ea[_0xab4296]).addClass("active_alliance")), $(_0x2349ea[_0xab4296]).append('<div class="player_name">' + (_0x1ce465.player_name || "") + "</div>"), $(_0x2349ea[_0xab4296]).append('<div class="town_name">' + _0x1ce465.name + "</div>"), $(_0x2349ea[_0xab4296]).append('<div class="alliance_name">' + (_0x1ce465.alliance_name || "") + "</div>");
                        break;
                    }
            return _0x2349ea;
        }, 
        checkPremium: function(_0x13ffbf) {
            return $(".advisor_frame." + _0x13ffbf + " div").hasClass(_0x13ffbf + "_active");
        }, 
        initWindow: function() {
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
                autobot_object.isLogged && autobot_object.initWnd();
            }).mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.settings)))))).append($("<div/>", {
                id: "time_autobot",
                class: "time_row"
            })).append($("<div/>", {
                class: "bottom"
            })).insertAfter(".nui_left_box");
        }, 
        initMapTownFeature: function() {
            var _0x2d5719;
            MapTiles.createTownDiv = (_0x2d5719 = MapTiles.createTownDiv, function() {
                var _0x43cf3c = _0x2d5719.apply(this, arguments);
                return autobot_object.town_map_info(_0x43cf3c, arguments[0]);
            });
        }, 
        title: "Autobot", 
        version: "4.0"
    , 
       domain: "https://bot.grepobot.com/"
    , 
        botWnd: ""
    , 
        botPremWnd: ""
    , 
        botEmailWnd: ""
    , 
       facebookWnd: ""
    , 
        isLogged: false
    , 
        Account: {
            player_id: Game.player_id,
            player_name: Game.player_name,
            world_id: Game.world_id,
            locale_lang: Game.locale_lang,
            premium_grepolis: Game.premium_user,
            csrfToken: Game.csrfToken
        }
    
};


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}; 
$.fn.serializeObject = function() {
    var _0x4e1267 = {},
        _0x5033e6 = this.serializeArray();
    return $.each(_0x5033e6, function() {
        void 0 !== _0x4e1267[this.name] ? (_0x4e1267[this.name].push || (_0x4e1267[this.name] = [_0x4e1267[this.name]]), _0x4e1267[this.name].push(this.value || "")) : _0x4e1267[this.name] = this.value || "";
    }), _0x4e1267;
};
var main_interval = setInterval(function() {
    if(void 0 !== window.$ && $(".nui_main_menu").length && !$.isEmptyObject(ITowns.towns)){
        var paypal_script = document.createElement('script');
        paypal_script.type = 'text/javascript';
        paypal_script.src = "https://www.paypal.com/sdk/js?client-id=ARqZq13t3FGZsDAVrGOcVJogifMpNJyG6yZmeOZ0l-6xfmSLTGJ2ilLc4xeCHi8e6OjAGDoXiOBPukIT";
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(paypal_script);
        clearInterval(main_interval), 
        autobot_object.initWindow(), 
        autobot_object.initMapTownFeature(), 
        autobot_object.init()
    };
}, 100);
