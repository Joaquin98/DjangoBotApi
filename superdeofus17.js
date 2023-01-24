'use strict';
!function(m) {
  /**
   * @param {string} i
   * @return {?}
   */
  function t(i) {
    if (n[i]) {
      return n[i].exports;
    }
    var module = n[i] = {
      i : i,
      l : false,
      exports : {}
    };
    return m[i].call(module.exports, module, module.exports, t), module.l = true, module.exports;
  }
  var n = {};
  /** @type {!Array} */
  t.m = m;
  t.c = n;
  /**
   * @param {!Function} d
   * @param {string} name
   * @param {!Function} n
   * @return {undefined}
   */
  t.d = function(d, name, n) {
    if (!t.o(d, name)) {
      Object.defineProperty(d, name, {
        enumerable : true,
        get : n
      });
    }
  };
  /**
   * @param {!Object} o
   * @return {undefined}
   */
  t.r = function(o) {
    if ("undefined" != typeof Symbol && Symbol.toStringTag) {
      Object.defineProperty(o, Symbol.toStringTag, {
        value : "Module"
      });
    }
    Object.defineProperty(o, "__esModule", {
      value : true
    });
  };
  /**
   * @param {string} value
   * @param {number} defaultValue
   * @return {?}
   */
  t.t = function(value, defaultValue) {
    if (1 & defaultValue && (value = t(value)), 8 & defaultValue) {
      return value;
    }
    if (4 & defaultValue && "object" == typeof value && value && value.__esModule) {
      return value;
    }
    /** @type {!Object} */
    var d = Object.create(null);
    if (t.r(d), Object.defineProperty(d, "default", {
      enumerable : true,
      value : value
    }), 2 & defaultValue && "string" != typeof value) {
      var s;
      for (s in value) {
        t.d(d, s, function(subel) {
          return value[subel];
        }.bind(null, s));
      }
    }
    return d;
  };
  /**
   * @param {string} module
   * @return {?}
   */
  t.n = function(module) {
    /** @type {function(): ?} */
    var n = module && module.__esModule ? function() {
      return module.default;
    } : function() {
      return module;
    };
    return t.d(n, "a", n), n;
  };
  /**
   * @param {!Function} object
   * @param {string} property
   * @return {?}
   */
  t.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /** @type {string} */
  t.p = "/";
  t(t.s = 0);
}([function(canCreateDiscussions, res, networkMonitor) {

  function list_to_object(variable, list) {
    var i = 0;
    for (; i < list.length; i++) {
      var descriptor = list[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) {
        descriptor.writable = true;
      }
      Object.defineProperty(variable, descriptor.key, descriptor);
    }
  }

  /**
   * @param {string} obj
   * @return {?}
   */
  function fn(obj) {
    return (fn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(objOrTsid) {
      return typeof objOrTsid;
    } : function(obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    })(obj);
  }
  
  networkMonitor.r(res);

  var api_object = function() {
    function element() {
      !function(matrix, $) {
        if (!(matrix instanceof $)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, element);
    }
    var test;
    var nextProps;
    var options;
    return test = element, options = [{
      key : "Auth",
      value : function(f, duration, callback) {
        $.ajax({
          method : "POST",
          jsonpCallback : callback,
          url : settings.domain + "api",
          dataType : "json",
          data : $.extend({
            action : f
          }, duration),
          success : function(res) {
            callback(res);
          }
        });
      }
    }, {
      key : "PaymentOptions",
      value : function(sucFn) {
        $.ajax({
          method : "GET",
          url : settings.domain + "paymentOptions",
          dataType : "json",
          success : function(res) {
            sucFn(res);
          }
        });
      }
    }, {
      key : "default_handler",
      value : function(callback, error) {
        return function(value) {
          /** @type {boolean} */
          error = void 0 !== error;
          var result = value.json;
          return result.redirect ? (window.location.href = result.redirect, void delete result.redirect) : result.maintenance ? MaintenanceWindowFactory.openMaintenanceWindow(result.maintenance) : (result.notifications && NotificationLoader && (NotificationLoader.recvNotifyData(result, "data"), delete result.notifications, delete result.next_fetch_in), callback(error ? value : result));
        };
      }
    }, {
      key : "game_data",
      value : function(commit, file) {
        var requestOrUrl;
        var ret;
        var _commit = commit;
        requestOrUrl = window.location.protocol + "//" + document.domain + "/game/data?" + $.param({
          town_id : _commit,
          action : "get",
          h : Game.csrfToken
        });
        ret = {
          json : JSON.stringify({
            types : [{
              type : "map",
              param : {
                x : 0,
                y : 0
              }
            }, {
              type : "bar"
            }, {
              type : "backbone"
            }],
            town_id : _commit,
            nl_init : false
          })
        };
        $.ajax({
          url : requestOrUrl,
          data : ret,
          method : "POST",
          dataType : "json",
          success : element.default_handler(file)
        });
      }
    }, {
      key : "switch_town",
      value : function(callbackId, success) {
        var requestOrUrl;
        requestOrUrl = window.location.protocol + "//" + document.domain + "/game/index?" + $.param({
          town_id : callbackId,
          action : "switch_town",
          h : Game.csrfToken
        });
        $.ajax({
          url : requestOrUrl,
          method : "GET",
          dataType : "json",
          success : element.default_handler(success)
        });
      }
    }, {
      key : "claim_load",
      value : function(data, moduleId, name, result, instance) {
        var requestOrUrl;
        var ret;
        var subpages = data;
        var id = result;
        requestOrUrl = window.location.protocol + "//" + document.domain + "/game/farm_town_info?" + $.param({
          town_id : subpages,
          action : "claim_load",
          h : Game.csrfToken
        });
        ret = {
          json : JSON.stringify({
            target_id : id,
            claim_type : moduleId,
            time : name,
            town_id : subpages,
            nl_init : true
          })
        };
        $.ajax({
          url : requestOrUrl,
          data : ret,
          method : "POST",
          dataType : "json",
          success : element.default_handler(instance)
        });
      }
    }, {
      key : "farm_town_overviews",
      value : function(h, key) {
        var requestOrUrl;
        var obj;
        var p = h;
        obj = {
          town_id : Game.townId,
          action : "get_farm_towns_for_town",
          h : Game.csrfToken,
          json : JSON.stringify({
            island_x : ITowns.towns[p].getIslandCoordinateX(),
            island_y : ITowns.towns[p].getIslandCoordinateY(),
            current_town_id : p,
            booty_researched : !!ITowns.towns[p].researches().attributes.booty || "",
            diplomacy_researched : !!ITowns.towns[p].researches().attributes.diplomacy || "",
            itrade_office : ITowns.towns[p].buildings().attributes.trade_office,
            town_id : Game.townId,
            nl_init : true
          })
        };
        /** @type {string} */
        requestOrUrl = window.location.protocol + "//" + document.domain + "/game/farm_town_overviews";
        $.ajax({
          url : requestOrUrl,
          data : obj,
          method : "GET",
          dataType : "json",
          success : element.default_handler(key)
        });
      }
    }, {
      key : "claim_loads",
      value : function(variableId, value, type, sql, success) {
        var ret;
        var requestOrUrl = window.location.protocol + "//" + document.domain + "/game/farm_town_overviews?" + $.param({
          town_id : Game.townId,
          action : "claim_loads",
          h : Game.csrfToken
        });
        ret = {
          json : JSON.stringify({
            farm_town_ids : value,
            time_option : sql,
            claim_factor : type,
            current_town_id : variableId,
            town_id : Game.townId,
            nl_init : true
          })
        };
        $.ajax({
          url : requestOrUrl,
          data : ret,
          method : "POST",
          dataType : "json",
          success : element.default_handler(success)
        });
      }
    }, {
      key : "building_place",
      value : function(commit, file) {
        var requestOrUrl;
        var obj;
        var _commit = commit;
        obj = {
          town_id : _commit,
          action : "culture",
          h : Game.csrfToken,
          json : JSON.stringify({
            town_id : _commit,
            nl_init : true
          })
        };
        /** @type {string} */
        requestOrUrl = window.location.protocol + "//" + document.domain + "/game/building_place";
        $.ajax({
          url : requestOrUrl,
          data : obj,
          method : "GET",
          dataType : "json",
          success : element.default_handler(file, true)
        });
      }
    }, {
      key : "building_main",
      value : function(commit, file) {
        var requestOrUrl;
        var obj;
        var _commit = commit;
        obj = {
          town_id : _commit,
          action : "index",
          h : Game.csrfToken,
          json : JSON.stringify({
            town_id : _commit,
            nl_init : true
          })
        };
        /** @type {string} */
        requestOrUrl = window.location.protocol + "//" + document.domain + "/game/building_main";
        $.ajax({
          url : requestOrUrl,
          data : obj,
          method : "GET",
          dataType : "json",
          success : element.default_handler(file)
        });
      }
    }, {
      key : "start_celebration",
      value : function(variableId, value, key) {
        var ret;
        var requestOrUrl = window.location.protocol + "//" + document.domain + "/game/building_place?" + $.param({
          town_id : variableId,
          action : "start_celebration",
          h : Game.csrfToken
        });
        ret = {
          json : JSON.stringify({
            celebration_type : value,
            town_id : variableId,
            nl_init : true
          })
        };
        $.ajax({
          url : requestOrUrl,
          data : ret,
          method : "POST",
          dataType : "json",
          success : element.default_handler(key, true)
        });
      }
    }, {
      key : "email_validation",
      value : function(key) {
        var opts = {
          town_id : Game.townId,
          action : "email_validation",
          h : Game.csrfToken,
          json : JSON.stringify({
            town_id : Game.townId,
            nl_init : true
          })
        };
        /** @type {string} */
        var requestOrUrl = window.location.protocol + "//" + document.domain + "/game/player";
        $.ajax({
          url : requestOrUrl,
          data : opts,
          method : "GET",
          dataType : "json",
          success : element.default_handler(key, true)
        });
      }
    }, {
      key : "members_show",
      value : function(key) {
        var opts = {
          town_id : Game.townId,
          action : "members_show",
          h : Game.csrfToken,
          json : JSON.stringify({
            town_id : Game.townId,
            nl_init : true
          })
        };
        /** @type {string} */
        var requestOrUrl = window.location.protocol + "//" + document.domain + "/game/alliance";
        $.ajax({
          url : requestOrUrl,
          data : opts,
          method : "GET",
          dataType : "json",
          success : element.default_handler(key)
        });
      }
    }, {
      key : "login_to_game_world",
      value : function(value) {
        $.redirect(window.location.protocol + "//" + document.domain + "/start?" + $.param({
          action : "login_to_game_world"
        }), {
          world : value,
          facebook_session : "",
          facebook_login : "",
          portal_sid : "",
          name : "",
          password : ""
        });
      }
    }, {
      key : "frontend_bridge",
      value : function(error, data, instance) {
        var requestOrUrl = window.location.protocol + "//" + document.domain + "/game/frontend_bridge?" + $.param({
          town_id : error,
          action : "execute",
          h : Game.csrfToken
        });
        var join = {
          json : JSON.stringify(data)
        };
        $.ajax({
          url : requestOrUrl,
          data : join,
          method : "POST",
          dataType : "json",
          success : element.default_handler(instance)
        });
      }
    }, {
      key : "building_barracks",
      value : function(error, data, instance) {
        var requestOrUrl = window.location.protocol + "//" + document.domain + "/game/building_barracks?" + $.param({
          town_id : error,
          action : "build",
          h : Game.csrfToken
        });
        var join = {
          json : JSON.stringify(data)
        };
        $.ajax({
          url : requestOrUrl,
          data : join,
          method : "POST",
          dataType : "json",
          success : element.default_handler(instance)
        });
      }
    }, {
      key : "attack_planner",
      value : function(commit, file) {
        var requestOrUrl;
        var obj;
        var _commit = commit;
        obj = {
          town_id : _commit,
          action : "attacks",
          h : Game.csrfToken,
          json : JSON.stringify({
            town_id : _commit,
            nl_init : true
          })
        };
        /** @type {string} */
        requestOrUrl = window.location.protocol + "//" + document.domain + "/game/attack_planer";
        $.ajax({
          url : requestOrUrl,
          data : obj,
          method : "GET",
          dataType : "json",
          success : element.default_handler(file)
        });
      }
    }, {
      key : "town_info_attack",
      value : function(att_id, data, instance) {
        var requestOrUrl;
        var obj;
        obj = {
          town_id : att_id,
          action : "attack",
          h : Game.csrfToken,
          json : JSON.stringify({
            id : data.target_id,
            nl_init : true,
            origin_town_id : data.town_id,
            preselect : true,
            preselect_units : data.units,
            town_id : Game.townId
          })
        };
        /** @type {string} */
        requestOrUrl = window.location.protocol + "//" + document.domain + "/game/town_info";
        $.ajax({
          url : requestOrUrl,
          data : obj,
          method : "GET",
          dataType : "json",
          success : element.default_handler(instance)
        });
      }
    }, {
      key : "send_units",
      value : function(variableId, value, fieldname, defaults, url) {
        var requestOrUrl = window.location.protocol + "//" + document.domain + "/game/town_info?" + $.param({
          town_id : variableId,
          action : "send_units",
          h : Game.csrfToken
        });
        var join = {
          json : JSON.stringify($.extend({
            id : fieldname,
            type : value,
            town_id : variableId,
            nl_init : true
          }, defaults))
        };
        $.ajax({
          url : requestOrUrl,
          data : join,
          method : "POST",
          dataType : "json",
          success : element.default_handler(url)
        });
      }
    }], (nextProps = null) && list_to_object(test.prototype, nextProps), options && list_to_object(test, options), element;
  }();

  var console_object = function() {
    /**
     * @return {undefined}
     */
    function index() {
      !function(impromptuInstance, Impromptu) {
        if (!(impromptuInstance instanceof Impromptu)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, index);
    }
    var a;
    var property;
    var b;
    return a = index, b = [{
      key : "contentConsole",
      value : function() {
        var filteredView = $("<fieldset/>", {
          style : "float:left; width:472px;"
        }).append($("<legend/>").html("Autobot Console")).append($("<div/>", {
          class : "terminal"
        }).append($("<div/>", {
          class : "terminal-output"
        })).scroll(function() {
          index.LogScrollBottom();
        }));
        var annotationBox = filteredView.find(".terminal-output");
        return $.each(index.Logs, function(canCreateDiscussions, cursor) {
          annotationBox.append(cursor);
        }), filteredView;
      }
    }, {
      key : "Log",
      value : function(t, i) {
        /**
         * @param {number} rows
         * @return {?}
         */
        function put_rows(rows) {
          return rows < 10 ? "0" + rows : rows;
        }
        if (this.Logs.length >= 500) {
          this.Logs.shift();
        }
        /** @type {!Date} */
        var d = new Date;
        /** @type {string} */
        var gameFolder = put_rows(d.getHours()) + ":" + put_rows(d.getMinutes()) + ":" + put_rows(d.getSeconds());
        var el = $("<div/>").append($("<div/>", {
          style : "width: 100%;"
        }).html(gameFolder + " - [" + index.Types[i] + "]: " + t));
        this.Logs.push(el);
        var selel = $(".terminal-output");
        if (selel.length && (selel.append(el), this.scrollUpdate)) {
          var $htmlBody = $(".terminal");
          var roundedTop = $(".terminal-output")[0].scrollHeight;
          $htmlBody.scrollTop(roundedTop);
        }
      }
    }, {
      key : "LogScrollBottom",
      value : function() {
        clearInterval(this.scrollInterval);
        var mCustomScrollBox = $(".terminal");
        var $scrollTarget = $(".terminal-output");
        /** @type {boolean} */
        this.scrollUpdate = mCustomScrollBox.scrollTop() + mCustomScrollBox.height() === $scrollTarget.height();
        var scroll = $scrollTarget[0].scrollHeight;
        /** @type {number} */
        this.scrollInterval = setInterval(function() {
          mCustomScrollBox.scrollTop(scroll);
        }, 7e3);
      }
    },
    {
      key : "Logs",
      value : []
    },{
      key : "Types",
      value : ["Autobot", "Farming", "Culture", "Builder", "Attack "]
    },{
      key : "scrollInterval",
      value : ""
    },{
      key : "scrollUpdate",
      value : true
    }
  ], (property = null) &&  list_to_object(a.prototype, property), b &&  list_to_object(a, b), index;
  }();

  var data = console_object;

  var items = function() {

    function collection() {
      !function(impromptuInstance, Impromptu) {
        if (!(impromptuInstance instanceof Impromptu)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, collection);
    }
    var a;
    var mb;
    var o;
    return a = collection, o = [{
      key : "button",
      value : function(encounter) {
        return $("<div/>").append($("<a/>", {
          class : "button_new" + (encounter.class || ""),
          href : "#",
          style : "margin-top:1px;float:left;" + (encounter.style || "")
        }).append($("<span/>", {
          class : "left"
        })).append($("<span/>", {
          class : "right"
        })).append($("<div/>", {
          class : "caption js-caption"
        }).text(encounter.name)));
      }
    }, {
      key : "checkbox",
      value : function(obj, onchange, onstep) {
        return $("<div/>", {
          class : "checkbox_new" + (obj.checked ? " checked" : "") + (obj.disabled ? " disabled" : ""),
          style : "padding: 5px;" + (obj.style || "")
        }).append($("<input/>", {
          type : "checkbox",
          name : obj.name,
          id : obj.id,
          checked : obj.checked,
          style : "display: none;"
        })).append($("<div/>", {
          class : "cbx_icon",
          rel : obj.name
        })).append($("<div/>", {
          class : "cbx_caption"
        }).text(obj.text)).bind("click", function() {
          $(this).toggleClass("checked");
          $(this).find($('input[type="checkbox"]')).prop("checked", $(this).hasClass("checked"));
          if ($(this).hasClass("checked")) {
            if (void 0 !== onchange) {
              onchange();
            }
          } else {
            if (void 0 !== onstep) {
              onstep();
            }
          }
        });
      }
    }, {
      key : "input",
      value : function(attrs) {
        return $("<div/>", {
          style : "padding: 5px;"
        }).append($("<label/>", {
          for : attrs.id
        }).text(attrs.name + ": ")).append($("<div/>", {
          class : "textbox",
          style : attrs.style
        }).append($("<div/>", {
          class : "left"
        })).append($("<div/>", {
          class : "right"
        })).append($("<div/>", {
          class : "middle"
        }).append($("<div/>", {
          class : "ie7fix"
        }).append($("<input/>", {
          type : attrs.type,
          tabindex : "1",
          id : attrs.id,
          name : attrs.id,
          value : attrs.value
        }).attr("size", attrs.size)))));
      }
    }, {
      key : "textarea",
      value : function(attrs) {
        return $("<div/>", {
          style : "padding: 5px;"
        }).append($("<label/>", {
          for : attrs.id
        }).text(attrs.name + ": ")).append($("<div/>").append($("<textarea/>", {
          name : attrs.id,
          id : attrs.id
        })));
      }
    }, {
      key : "inputMinMax",
      value : function(props) {
        return $("<div/>", {
          class : "textbox"
        }).append($("<span/>", {
          class : "grcrt_spinner_btn grcrt_spinner_down",
          rel : props.name
        }).click(function() {
          var customPlayerControls = $(this).parent().find("#" + $(this).attr("rel"));
          if (parseInt($(customPlayerControls).attr("min")) < parseInt($(customPlayerControls).attr("value"))) {
            $(customPlayerControls).attr("value", parseInt($(customPlayerControls).attr("value")) - 1);
          }
        })).append($("<div/>", {
          class : "textbox",
          style : props.style
        }).append($("<div/>", {
          class : "left"
        })).append($("<div/>", {
          class : "right"
        })).append($("<div/>", {
          class : "middle"
        }).append($("<div/>", {
          class : "ie7fix"
        }).append($("<input/>", {
          type : "text",
          tabindex : "1",
          id : props.name,
          value : props.value,
          min : props.min,
          max : props.max
        }).attr("size", props.size || 10).css("text-align", "right"))))).append($("<span/>", {
          class : "grcrt_spinner_btn grcrt_spinner_up",
          rel : props.name
        }).click(function() {
          var customPlayerControls = $(this).parent().find("#" + $(this).attr("rel"));
          if (parseInt($(customPlayerControls).attr("max")) > parseInt($(customPlayerControls).attr("value"))) {
            $(customPlayerControls).attr("value", parseInt($(customPlayerControls).attr("value")) + 1);
          }
        }));
      }
    }, {
      key : "inputSlider",
      value : function(base) {
        return $("<div/>", {
          id : "grcrt_" + base.name + "_config"
        }).append($("<div/>", {
          class : "slider_container"
        }).append($("<div/>", {
          style : "float:left;width:120px;"
        }).html(base.name)).append(collection.input({
          name : "grcrt_" + base.name + "_value",
          style : "float:left;width:33px;"
        }).hide()).append($("<div/>", {
          class : "windowmgr_slider",
          style : "width: 200px;float: left;"
        }).append($("<div/>", {
          class : "grepo_slider sound_volume"
        })))).append($("<script/>", {
          type : "text/javascript"
        }).text("RepConv.slider = $('#grcrt_" + base.name + `_config .sound_volume').grepoSlider({  min: 0,  max: 100,  step: 5,  value: ` + base.volume + `,  template: 'tpl_grcrt_slider'  }).on('sl:change:value', function (e, _sl, value) {  $('#grcrt_` + base.name + `_value').attr('value',value);  if (RepConv.audio.test != undefined){  RepConv.audio.test.volume = value/100;  }  }),  $('#grcrt_` + base.name + `_config .button_down').css('background-position','-144px 0px;'),  $('#grcrt_` + base.name + 
        `_config .button_up').css('background-position','-126px 0px;')  `));
      }
    }, {
      key : "selectBox",
      value : function(params) {
        return $("<div/>", {
          style : "padding: 5px"
        }).append($("<input/>", {
          type : "hidden",
          name : params.name,
          id : params.id,
          value : params.value
        })).append($("<label/>", {
          for : params.id
        }).text(params.label)).append($("<div/>", {
          id : params.id,
          class : "dropdown default",
          style : params.styles
        }).dropdown({
          list_pos : "left",
          value : params.value,
          disabled : params.disabled || false,
          options : params.options
        }).on("dd:change:value", function(canCreateDiscussions, inSelectOnClick) {
          $("#" + params.id).attr("value", inSelectOnClick);
        }));
      }
    }, {
      key : "timerBoxFull",
      value : function(column) {
        return $("<div/>", {
          class : "single-progressbar instant_buy js-progressbar type_building_queue",
          id : column.id,
          style : column.styles
        }).append($("<div/>", {
          class : "border_l"
        })).append($("<div/>", {
          class : "border_r"
        })).append($("<div/>", {
          class : "body"
        })).append($("<div/>", {
          class : "progress"
        }).append($("<div/>", {
          class : "indicator",
          style : "width: 0%;"
        }))).append($("<div/>", {
          class : "caption"
        }).append($("<span/>", {
          class : "text"
        })).append($("<span/>", {
          class : "value_container"
        }).append($("<span/>", {
          class : "curr"
        }).html("0%"))));
      }
    }, {
      key : "timerBoxSmall",
      value : function(data) {
        return $("<div/>", {
          class : "single-progressbar instant_buy js-progressbar type_building_queue",
          id : data.id,
          style : data.styles
        }).append($("<div/>", {
          class : "progress"
        }).append($("<div/>", {
          class : "indicator",
          style : "width: 0%;"
        }))).append($("<div/>", {
          class : "caption"
        }).append($("<span/>", {
          class : "text"
        })).append($("<span/>", {
          class : "value_container"
        }).append($("<span/>", {
          class : "curr"
        }).html(data.text ? data.text : "-"))));
      }
    }, {
      key : "gameWrapper",
      value : function(id, att_id, data, forse) {
        var enable_keys = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
        return $("<div/>", {
          class : "game_inner_box" + (enable_keys ? " disabled-box" : ""),
          style : forse,
          id : att_id
        }).append($("<div/>", {
          class : "game_border"
        }).append($("<div/>", {
          class : "game_border_top"
        })).append($("<div/>", {
          class : "game_border_bottom"
        })).append($("<div/>", {
          class : "game_border_left"
        })).append($("<div/>", {
          class : "game_border_right"
        })).append($("<div/>", {
          class : "game_border_top"
        })).append($("<div/>", {
          class : "game_border_corner corner1"
        })).append($("<div/>", {
          class : "game_border_corner corner2"
        })).append($("<div/>", {
          class : "game_border_corner corner3"
        })).append($("<div/>", {
          class : "game_border_corner corner4"
        })).append($("<div/>", {
          class : "game_header bold",
          id : "settings_header"
        }).html(id)).append($("<div/>").append(data)));
      }
    }], (mb = null) &&  list_to_object(a.prototype, mb), o &&  list_to_object(a, o), collection;
  }();
  
  var target = function() {
    /**
     * @return {undefined}
     */
    function self() {
      !function(matrix, $) {
        if (!(matrix instanceof $)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, self);
    }
    var t;
    var klass;
    var n;
    return t = self, n = [{
      key : "init",
      value : function() {
        data.Log("Initialize Assistant", 0);
      }
    }, {
      key : "setSettings",
      value : function(message) {
        if ("" !== message && null != message) {
          $.extend(self.settings, message);
        }
        self.initSettings();
      }
    }, {
      key : "initSettings",
      value : function() {
        if (self.settings.town_names) {
          $("#map_towns .flag").addClass("active_town");
        } else {
          $("#map_towns .flag").removeClass("active_town");
        }
        if (self.settings.player_name) {
          $("#map_towns .flag").addClass("active_player");
        } else {
          $("#map_towns .flag").removeClass("active_player");
        }
        if (self.settings.alliance_name) {
          $("#map_towns .flag").addClass("active_alliance");
        } else {
          $("#map_towns .flag").removeClass("active_alliance");
        }
      }
    }, {
      key : "contentSettings",
      value : function() {
        return $("<fieldset/>", {
          id : "Assistant_settings",
          style : "float:left; width:472px;height: 270px;"
        }).append($("<legend/>").html("Assistant Settings")).append(items.checkbox({
          text : "Show town names on island view.",
          id : "assistant_town_names",
          name : "assistant_town_names",
          checked : self.settings.town_names
        })).append(items.checkbox({
          text : "Show player names on island view.",
          id : "assistant_player_names",
          name : "assistant_player_names",
          checked : self.settings.player_name
        })).append(items.checkbox({
          text : "Show alliance names on island view.",
          id : "assistant_alliance_names",
          name : "assistant_alliance_names",
          checked : self.settings.alliance_name
        })).append(items.selectBox({
          id : "assistant_auto_relogin",
          name : "assistant_auto_relogin",
          label : "Auto re-login: ",
          styles : "width: 120px;",
          value : self.settings.auto_relogin,
          options : [{
            value : "0",
            name : "Disabled"
          }, {
            value : "120",
            name : "After 2 minutes"
          }, {
            value : "300",
            name : "After 5 minutes"
          }, {
            value : "600",
            name : "After 10 minutes"
          }, {
            value : "900",
            name : "After 15 minutes"
          }]
        })).append(items.button({
          name : DM.getl10n("notes").btn_save,
          style : "top: 120px;"
        }).on("click", function() {
          var esearchRes = $("#Assistant_settings").serializeObject();
          /** @type {boolean} */
          self.settings.town_names = void 0 !== esearchRes.assistant_town_names;
          /** @type {boolean} */
          self.settings.player_name = void 0 !== esearchRes.assistant_player_names;
          /** @type {boolean} */
          self.settings.alliance_name = void 0 !== esearchRes.assistant_alliance_names;
          /** @type {number} */
          self.settings.auto_relogin = parseInt(esearchRes.assistant_auto_relogin);
          api_object.Auth("saveAssistant", {
            player_id : settings.Account.player_id,
            world_id : settings.Account.world_id,
            csrfToken : settings.Account.csrfToken,
            assistant_settings : settings.stringify(self.settings)
          }, self.callbackSave);
        }));
      }
    }, {
      key : "callbackSave",
      value : function() {
        HumanMessage.success("The settings were saved!");
        self.initSettings();
      }
    },
    {
      key : "settings",
      value : {
        town_names : false,
        player_name : false,
        alliance_name : true,
        auto_relogin : 0
      }
    }], (klass = null) && list_to_object(t.prototype, klass), n && list_to_object(t, n), self;
  }();

  var context = target;

  var f = function() {
    /**
     * @return {undefined}
     */
    function that() {
      !function(matrix, $) {
        if (!(matrix instanceof $)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, that);
    }
    var target;
    var a;
    var x;
    return target = that, x = [{
      key : "init",
      value : function() {
        data.Log("Initialize Autoattack", 4);
        that.initButton();
        if (settings.checkPremium("captain")) {
          that.loadAttackQueue();
        }
      }
    }, {
      key : "setSettings",
      value : function(val) {
        if ("" !== val && null != val) {
          $.extend(that.settings, JSON.parse(val));
        }
      }
    }, {
      key : "initButton",
      value : function() {
        $scope.initButtons("Autoattack");
      }
    }, {
      key : "start",
      value : function() {
        /** @type {!Array} */
        that.attacks_timers = [];
        var ajaxArr = $.map(that.attacks, function(customDataSource, tempObjectIds) {
          var extensionResolver = $.Deferred();
          return that.checkAttack(customDataSource, tempObjectIds).then(function() {
            extensionResolver.resolve();
          }), extensionResolver;
        });
        $.when.apply($, ajaxArr).done(function() {
          /** @type {number} */
          that.checked_count = 0;
          /** @type {null} */
          var feed = null;
          if (0 === that.countRunningAttacks()) {
            /** @type {string} */
            feed = DM.getl10n("COMMON").no_results + ".";
            HumanMessage.error(feed);
            data.Log('<span style="color: #ff4f23;">' + feed + "</span>", 4);
            that.disableStart();
          } else {
            /** @type {string} */
            feed = DM.getl10n("alliance").index.button_send + ": " + that.countRunningAttacks() + " " + DM.getl10n("layout").toolbar_activities.incomming_attacks.toLocaleLowerCase() + ".";
            HumanMessage.success(feed);
            data.Log('<span style="color: #ff4f23;">' + feed + "</span>", 4);
          }
        });
      }
    }, {
      key : "checkAttack",
      value : function(data, el) {
        var extensionResolver = $.Deferred();
        return data.send_at >= Timestamp.now() ? (that.checked_count++, setTimeout(function() {
          api_object.town_info_attack(data.town_id, data, function(rawResp) {
            if (void 0 !== rawResp.json) {
              if (!rawResp.json.same_island || GameDataUnits.hasNavalUnits(data.units)) {
                var edge = GameDataUnits.calculateCapacity(data.town_id, data.units);
                if (edge.needed_capacity > edge.total_capacity) {
                  var param = DM.getl10n("place").support_overview.slow_transport_ship;
                  return $("#attack_order_id_" + data.id + " .attack_bot_timer").removeClass("success").html(param), that.addAttack(el, param), extensionResolver.resolve(), false;
                }
              }
              that.addAttack(el);
              extensionResolver.resolve();
            }
          });
        }, 1e3 * that.checked_count / 2)) : (that.addAttack(el, "Expired"), $("#attack_order_id_" + data.id + " .attack_bot_timer").removeClass("success").html("Expired"), extensionResolver.resolve()), extensionResolver;
      }
    }, {
      key : "addAttack",
      value : function(i, ago) {
        var options = {
          is_running : false,
          attack_id : that.attacks[i].id,
          interval : null,
          message : "",
          message_text : ""
        };
        if (void 0 !== ago) {
          options.message_text = ago;
        } else {
          /** @type {boolean} */
          options.is_running = true;
          /** @type {number} */
          options.interval = setInterval(function() {
            if (void 0 !== that.attacks[i]) {
              /** @type {number} */
              var currentEstimate = that.attacks[i].send_at - Timestamp.now();
              options.message = $("#attack_order_id_" + options.attack_id + " .attack_bot_timer");
              options.message.html(settings.toHHMMSS(currentEstimate));
              if (!(300 !== currentEstimate && 120 !== currentEstimate && 60 !== currentEstimate)) {
                data.Log('<span style="color: #ff4f23;">[' + that.attacks[i].origin_town_name + " &#62; " + that.attacks[i].target_town_name + "] " + DM.getl10n("heroes").common.departure.toLowerCase().replace(":", "") + " " + DM.getl10n("place").support_overview.just_in + " " + hours_minutes_seconds(currentEstimate) + ".</span>", 4);
              }
              if (that.attacks[i].send_at <= Timestamp.now()) {
                /** @type {boolean} */
                options.is_running = false;
                that.sendAttack(that.attacks[i]);
                that.stopTimer(options);
              }
            } else {
              /** @type {boolean} */
              options.is_running = false;
              options.message.html("Stopped");
              that.stopTimer(options);
            }
          }, 1e3);
        }
        that.attacks_timers.push(options);
      }
    }, {
      key : "countRunningAttacks",
      value : function() {
        /** @type {number} */
        var _0x597eed = 0;
        return that.attacks_timers.forEach(function(localComputer) {
          if (localComputer.is_running) {
            _0x597eed++;
          }
        }), _0x597eed;
      }
    }, {
      key : "stopTimer",
      value : function(_) {
        clearInterval(api_object.interval);
        if (0 === that.countRunningAttacks()) {
          data.Log('<span style="color: #ff4f23;">All finished.</span>', 4);
          that.stop();
        }
      }
    }, {
      key : "stop",
      value : function() {
        that.disableStart();
        that.attacks_timers.forEach(function(self) {
          if (self.is_running) {
            $("#attack_order_id_" + self.attack_id + " .attack_bot_timer").html("");
          }
          clearInterval(self.interval);
        });
      }
    }, {
      key : "disableStart",
      value : function() {
        /** @type {boolean} */
        $scope.modules.Autoattack.isOn = false;
        $("#Autoattack_onoff").removeClass("on").find("span").mousePopup(new MousePopup("Start Autoattack"));
      }
    }, {
      key : "sendAttack",
      value : function(obj) {
        api_object.send_units(obj.town_id, obj.type, obj.target_town_id, that.unitsToSend(obj.units), function(SMessage) {
          /** @type {!Array<?>} */
          var maints = that.attacks_timers.filter(function(attachedRole) {
            return attachedRole.attack_id === obj.id;
          });
          if (void 0 !== SMessage.success && maints.length) {
            /** @type {string} */
            maints[0].message_text = "Success";
            maints[0].message.addClass("success").html("Success");
            data.Log('<span style="color: #ff9e22;">[' + obj.origin_town_name + " &#62; " + obj.target_town_name + "] " + SMessage.success + "</span>", 4);
          } else {
            if (void 0 !== SMessage.error && maints.length) {
              /** @type {string} */
              maints[0].message_text = "Invalid";
              maints[0].message.html("Invalid");
              data.Log('<span style="color: #ff3100;">[' + obj.origin_town_name + " &#62; " + obj.target_town_name + "] " + SMessage.error + "</span>", 4);
            }
          }
        });
      }
    }, {
      key : "unitsToSend",
      value : function(name) {
        var subwikiListsCache = {};
        return $.each(name, function(wikiId, subwikiLists) {
          if (subwikiLists > 0) {
            /** @type {number} */
            subwikiListsCache[wikiId] = subwikiLists;
          }
        }), subwikiListsCache;
      }
    }, {
      key : "calls",
      value : function(variableId, value) {
        switch(variableId) {
          case "attack_planer/add_origin_town":
          case "attack_planer/edit_origin_town":
            that.stop();
            that.loadAttackQueue();
            break;
          case "attack_planer/attacks":
            if (void 0 !== (value = JSON.parse(value)).json.data) {
              that.setAttackData(value.json);
            }
        }
      }
    }, {
      key : "setAttackData",
      value : function(recB) {
        if (settings.checkPremium("captain")) {
          that.attacks = void 0 !== recB.data.attacks ? recB.data.attacks : [];
        }
      }
    }, {
      key : "attackOrderRow",
      value : function(data, forse) {
        var $ctrlHolder = $("<div/>", {
          class : "origin_town_units"
        });
        if (void 0 !== data.units) {
          $.each(data.units, function(deleteLi, newTabContent) {
            if (newTabContent > 0) {
              $ctrlHolder.append($("<div/>", {
                class : "unit_icon25x25 " + deleteLi
              }).html(newTabContent));
            }
          });
        }
        var lightboxContent = $("<li/>", {
          class : "attacks_row " + (forse % 2 == 0 ? "odd" : "even"),
          id : "attack_order_id_" + data.id
        });
        return data.send_at > Timestamp.now() && lightboxContent.hover(function() {
          $(this).toggleClass("brown");
        }), lightboxContent.append($("<div/>", {
          class : "attack_type32x32 " + data.type
        })).append($("<div/>", {
          class : "arrow"
        })).append($("<div/>", {
          class : "row1"
        }).append(" " + data.origin_town_link + " ").append("(" + data.origin_player_link + ")").append($("<span/>", {
          class : "small_arrow"
        })).append(" " + data.target_town_link + " ").append("(" + data.origin_player_link + ") ")).append($("<div/>", {
          class : "row2" + (data.send_at <= Timestamp.now() ? " expired" : "")
        }).append($("<span/>").html(DM.getl10n("heroes").common.departure)).append(" " + DateHelper.formatDateTimeNice(data.send_at) + " ").append($("<span/>").html(DM.getl10n("heroes").common.arrival)).append(" " + DateHelper.formatDateTimeNice(data.arrival_at) + " ")).append($("<div/>", {
          class : "show_units"
        }).on("click", function() {
          $ctrlHolder.toggle();
        })).append($("<div/>", {
          class : "attack_bot_timer"
        }).html(function() {
          /** @type {!Array<?>} */
          var metalmakers = that.attacks_timers.filter(function(depMap) {
            return depMap.attack_id === data.id;
          });
          if (metalmakers.length) {
            return metalmakers[0].is_running ? settings.toHHMMSS(data.send_at - Timestamp.now()) : metalmakers[0].message_text;
          }
        })).append($ctrlHolder);
      }
    }, {
      key : "loadAttackQueue",
      value : function() {
        api_object.attack_planner(Game.townId, function(customDataSource) {
          that.setAttackData(customDataSource);
          that.setAttackQueue($("#attack_bot"));
        });
      }
    }, {
      key : "setAttackQueue",
      value : function(srcCoord) {
        if (srcCoord.length) {
          var element = srcCoord.find("ul.attacks_list");
          element.empty();
          api_object.attack_planner(Game.townId, function(customDataSource) {
            that.setAttackData(customDataSource);
            $.each(that.attacks, function(props, item) {
              props++;
              element.append(that.attackOrderRow(item, props));
            });
          });
        }
      }
    }, {
      key : "contentSettings",
      value : function() {
        var $unusedPanel = $('<div id="attack_bot" class="attack_bot attack_planner attacks' + ($scope.hasPremium ? "" : " disabled-box") + '"><div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_top"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" id="settings_header">AutoAttack</div><div><div class="attacks_list"><ul class="attacks_list"></ul></div><div class="game_list_footer autoattack_settings"></div></div></div></div>');
        return $unusedPanel.find(".autoattack_settings").append(function() {
          var imgchk = items.button({
            name : DM.getl10n("premium").advisors.short_advantages.attack_planner,
            style : "float: left;",
            class : settings.checkPremium("captain") ? "" : " disabled"
          });
          return settings.checkPremium("captain") ? imgchk.click(function() {
            AttackPlannerWindowFactory.openAttackPlannerWindow();
          }) : imgchk;
        }).append(function() {
          var imgchk = items.button({
            name : DM.getl10n("update_notification").refresh,
            style : "float: left;",
            class : settings.checkPremium("captain") ? "" : " disabled"
          });
          return settings.checkPremium("captain") ? imgchk.click(function() {
            that.setAttackQueue($unusedPanel);
          }) : imgchk;
        }).append(function() {
          if (!settings.checkPremium("captain")) {
            return items.button({
              name : DM.getl10n("construction_queue").advisor_banner.activate(Game.premium_data.captain.name),
              style : "float: right;"
            }).click(function() {
              PremiumWindowFactory.openBuyAdvisorsWindow();
            });
          }
        }), that.setAttackQueue($unusedPanel), $unusedPanel;
      }
    },{
      key : "settings",
      value : {
        autostart : false
      }
    },{
      key : "attacks",
      value : []
    },{
      key : "attacks_timers",
      value : []
    },{
      key : "view",
      value : null
    },{
      key : "checked_count",
      value : 0
    }], (a = null) &&  list_to_object(target.prototype, a), x &&  list_to_object(target, x), that;
  }();

  var handler = f;
  var owner = function() {
    /**
     * @return {undefined}
     */
    function self() {
      !function(matrix, $) {
        if (!(matrix instanceof $)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, self);
    }
    var o;
    var selector;
    var n;
    return o = self, n = [{
      key : "checkReady",
      value : function(props) {
        var resourceOrCollection = ITowns.towns[props.id];
        if (resourceOrCollection.hasConqueror()) {
          return false;
        }
        if (!self.checkEnabled()) {
          return false;
        }
        if (props.modules.Autofarm.isReadyTime >= Timestamp.now()) {
          return props.modules.Autofarm.isReadyTime;
        }
        var options = resourceOrCollection.resources();
        if (options.wood === options.storage && options.stone === options.storage && options.iron === options.storage && self.settings.skipwhenfull) {
          return false;
        }
        /** @type {boolean} */
        var _0x332894 = false;
        return $.each($scope.Queue.queue, function(canCreateDiscussions, fittingDef) {
          if ("Autofarm" === fittingDef.module && -1 !== props.relatedTowns.indexOf(fittingDef.townId)) {
            return _0x332894 = true, false;
          }
        }), self.settings.lowresfirst && props.relatedTowns.length > 0 && (_0x332894 = false, $.each(props.relatedTowns, function(canCreateDiscussions, categoryName) {
          var options = resourceOrCollection.resources();
          var config = ITowns.towns[categoryName].resources();
          if (options.wood + options.stone + options.iron > config.wood + config.stone + config.iron) {
            return _0x332894 = true, false;
          }
        })), !_0x332894;
      }
    }, {
      key : "disableP",
      value : function() {
        handler.settings = {
          autostart : false,
          method : 300,
          timebetween : 1,
          skipwhenfull : true,
          lowresfirst : true,
          stoplootbelow : true
        };
      }
    }, {
      key : "checkEnabled",
      value : function() {
        return $scope.modules.Autofarm.isOn;
      }
    }, {
      key : "startFarming",
      value : function(navigatorType) {
        if (!self.checkEnabled()) {
          return false;
        }
        /** @type {string} */
        self.town = navigatorType;
        /** @type {!Array} */
        self.shouldFarm = [];
        self.iTown = ITowns.towns[self.town.id];
        /**
         * @return {undefined}
         */
        var init = function() {
          /** @type {number} */
          self.interval = setTimeout(function() {
            data.Log(self.town.name + " getting farm information.", 1);
            if (self.isCaptain) {
              self.initFarmTownsCaptain(function() {
                if (!self.checkEnabled()) {
                  return false;
                }
                self.claimResources();
              });
            } else {
              self.initFarmTowns(function() {
                if (!self.checkEnabled()) {
                  return false;
                }
                /** @type {number} */
                self.town.currentFarmCount = 0;
                self.claimResources();
              });
            }
          }, settings.randomize(1e3, 2e3));
        };
        if ($scope.currentTown !== self.town.key) {
          /** @type {number} */
          self.interval = setTimeout(function() {
            data.Log(self.town.name + " move to town.", 1);
            api_object.switch_town(self.town.id, function() {
              if (!self.checkEnabled()) {
                return false;
              }
              $scope.currentTown = self.town.key;
              init();
            });
            /** @type {boolean} */
            self.town.isSwitched = true;
          }, settings.randomize(1e3, 2e3));
        } else {
          init();
        }
      }
    }, {
      key : "initFarmTowns",
      value : function(onstep) {
        api_object.game_data(self.town.id, function(iip) {
          if (!self.checkEnabled()) {
            return false;
          }
          var fields_to_add = iip.map.data.data.data;
          $.each(fields_to_add, function(canCreateDiscussions, item_obj) {
            /** @type {!Array} */
            var problemPath = [];
            $.each(item_obj.towns, function(canCreateDiscussions, length) {
              if (length.x === self.iTown.getIslandCoordinateX() && length.y === self.iTown.getIslandCoordinateY() && 1 === length.relation_status) {
                problemPath.push(length);
              }
            });
            /** @type {!Array} */
            self.town.farmTowns = problemPath;
          });
          $.each(self.town.farmTowns, function(canCreateDiscussions, e) {
            if (e.loot - Timestamp.now() <= 0) {
              self.shouldFarm.push(e);
            }
          });
          onstep(true);
        });
      }
    }, {
      key : "initFarmTownsCaptain",
      value : function(onstep) {
        api_object.farm_town_overviews(self.town.id, function(item_obj) {
          if (!self.checkEnabled()) {
            return false;
          }
          /** @type {!Array} */
          var cfgArr = [];
          $.each(item_obj.farm_town_list, function(canCreateDiscussions, val) {
            if (val.island_x === self.iTown.getIslandCoordinateX() && val.island_y === self.iTown.getIslandCoordinateY() && 1 === val.rel) {
              cfgArr.push(val);
            }
          });
          /** @type {!Array} */
          self.town.farmTowns = cfgArr;
          $.each(self.town.farmTowns, function(canCreateDiscussions, e) {
            if (e.loot - Timestamp.now() <= 0) {
              self.shouldFarm.push(e);
            }
          });
          onstep(true);
        });
      }
    }, {
      key : "claimResources",
      value : function() {
        if (!self.town.farmTowns[0]) {
          return data.Log(self.town.name + " has no farm towns.", 1), self.finished(1800), false;
        }
        if (self.town.currentFarmCount < self.shouldFarm.length) {
          /** @type {number} */
          self.interval = setTimeout(function() {
            /** @type {string} */
            var str = "normal";
            if (Game.features.battlepoint_villages || (self.shouldFarm[self.town.currentFarmCount].mood >= 86 && self.settings.stoplootbelow && (str = "double"), self.settings.stoplootbelow || (str = "double")), self.isCaptain) {
              /** @type {!Array} */
              var inserted = [];
              $.each(self.shouldFarm, function(canCreateDiscussions, re) {
                inserted.push(re.id);
              });
              self.claimLoads(inserted, str, function() {
                if (!self.checkEnabled()) {
                  return false;
                }
                self.finished(self.getMethodTime(self.town.id));
              });
            } else {
              self.claimLoad(self.shouldFarm[self.town.currentFarmCount].id, str, function() {
                if (!self.checkEnabled()) {
                  return false;
                }
                self.shouldFarm[self.town.currentFarmCount].loot = Timestamp.now() + self.getMethodTime(self.town.id);
                $scope.updateTimer(self.shouldFarm.length, self.town.currentFarmCount);
                self.town.currentFarmCount++;
                self.claimResources();
              });
            }
          }, settings.randomize(1e3 * self.settings.timebetween, 1e3 * self.settings.timebetween + 1e3));
        } else {
          /** @type {null} */
          var elapsed = null;
          $.each(self.town.farmTowns, function(canCreateDiscussions, _i) {
            /** @type {number} */
            var delay = _i.loot - Timestamp.now();
            if (null == elapsed || delay <= elapsed) {
              /** @type {number} */
              elapsed = delay;
            }
          });
          if (self.shouldFarm.length > 0) {
            $.each(self.shouldFarm, function(canCreateDiscussions, _i) {
              /** @type {number} */
              var delay = _i.loot - Timestamp.now();
              if (null == elapsed || delay <= elapsed) {
                /** @type {number} */
                elapsed = delay;
              }
            });
          } else {
            data.Log(self.town.name + " not ready yet.", 1);
          }
          self.finished(elapsed);
        }
      }
    }, {
      key : "claimLoad",
      value : function(data, plugins, cb) {
        if (Game.features.battlepoint_villages) {
          api_object.frontend_bridge(self.town.id, {
            model_url : "FarmTownPlayerRelation/" + MM.getOnlyCollectionByName("FarmTownPlayerRelation").getRelationForFarmTown(data).id,
            action_name : "claim",
            arguments : {
              farm_town_id : data,
              type : "resources",
              option : 1
            }
          }, function(connector) {
            self.claimLoadCallback(data, connector);
            cb(connector);
          });
        } else {
          api_object.claim_load(self.town.id, plugins, self.getMethodTime(self.town.id), data, function(connector) {
            self.claimLoadCallback(data, connector);
            cb(connector);
          });
        }
      }
    }, {
      key : "claimLoadCallback",
      value : function(extension, request) {
        if (request.success) {
          var styleUsed = request.satisfaction;
          var newTrainerDto = request.lootable_human;
          if (2 === request.relation_status) {
            WMap.updateStatusInChunkTowns(extension.id, styleUsed, Timestamp.now() + self.getMethodTime(self.town.id), Timestamp.now(), newTrainerDto, 2);
            WMap.pollForMapChunksUpdate();
          } else {
            WMap.updateStatusInChunkTowns(extension.id, styleUsed, Timestamp.now() + self.getMethodTime(self.town.id), Timestamp.now(), newTrainerDto);
          }
          Layout.hideAjaxLoader();
          data.Log('<span style="color: #6FAE30;">' + request.success + "</span>", 1);
        } else {
          if (request.error) {
            data.Log(self.town.name + " " + request.error, 1);
          }
        }
      }
    }, {
      key : "claimLoads",
      value : function(prop, config, func) {
        api_object.claim_loads(self.town.id, prop, config, self.getMethodTime(self.town.id), function(dataTable) {
          self.claimLoadsCallback(dataTable);
          func(dataTable);
        });
      }
    }, {
      key : "getMethodTime",
      value : function(val) {
        if (Game.features.battlepoint_villages) {
          var rmeth = self.settings.method;
          return $.each(MM.getOnlyCollectionByName("Town").getTowns(), function(canCreateDiscussions, radio) {
            if (radio.id === val && radio.getResearches().hasResearch("booty")) {
              return rmeth = 2 * self.settings.method, false;
            }
          }), rmeth;
        }
        return self.settings.method;
      }
    }, {
      key : "claimLoadsCallback",
      value : function(that) {
        if (that.success) {
          var fields_to_add = that.handled_farms;
          $.each(fields_to_add, function(mmCoreSplitViewBlock, stubbing) {
            if (2 === stubbing.relation_status) {
              WMap.updateStatusInChunkTowns(mmCoreSplitViewBlock, stubbing.satisfaction, Timestamp.now() + self.getMethodTime(self.town.id), Timestamp.now(), stubbing.lootable_at, 2);
              WMap.pollForMapChunksUpdate();
            } else {
              WMap.updateStatusInChunkTowns(mmCoreSplitViewBlock, stubbing.satisfaction, Timestamp.now() + self.getMethodTime(self.town.id), Timestamp.now(), stubbing.lootable_at);
            }
          });
          data.Log('<span style="color: #6FAE30;">' + that.success + "</span>", 1);
        } else {
          if (that.error) {
            data.Log(self.town.name + " " + that.error, 1);
          }
        }
      }
    }, {
      key : "finished",
      value : function(recB) {
        if (!self.checkEnabled()) {
          return false;
        }
        $.each($scope.playerTowns, function(canCreateDiscussions, Config) {
          if (-1 !== self.town.relatedTowns.indexOf(Config.id)) {
            Config.modules.Autofarm.isReadyTime = Timestamp.now() + recB;
          }
        });
        self.town.modules.Autofarm.isReadyTime = Timestamp.now() + recB;
        $scope.Queue.next();
      }
    }, {
      key : "stop",
      value : function() {
        clearInterval(self.interval);
      }
    }, {
      key : "init",
      value : function() {
        data.Log("Initialize AutoFarm", 1);
        self.initButton();
        self.checkCaptain();
      }
    }, {
      key : "initButton",
      value : function() {
        $scope.initButtons("Autofarm");
      }
    }, {
      key : "checkCaptain",
      value : function() {
        if ($(".advisor_frame.captain div").hasClass("captain_active")) {
          /** @type {boolean} */
          self.isCaptain = true;
        }
      }
    }, {
      key : "setSettings",
      value : function(message) {
        if ("" !== message && null != message) {
          $.extend(self.settings, message);
        }
      }
    }, {
      key : "contentSettings",
      value : function() {
        return $("<fieldset/>", {
          id : "Autofarm_settings",
          style : "float:left; width:472px;height: 270px;"
        }).append($("<legend/>").html(self.title)).append(items.checkbox({
          text : "AutoStart AutoFarm.",
          id : "autofarm_autostart",
          name : "autofarm_autostart",
          checked : self.settings.autostart,
          disabled : !$scope.hasPremium
        })).append(function() {
          var item = {
            id : "autofarm_method",
            name : "autofarm_method",
            label : "Farm method: ",
            styles : "width: 120px;",
            value : self.settings.method,
            options : [{
              value : "300",
              name : "5 minute farm"
            }, {
              value : "1200",
              name : "20 minute farm"
            }, {
              value : "5400",
              name : "90 minute farm"
            }, {
              value : "14400",
              name : "240 minute farm"
            }],
            disabled : false
          };
          if (!$scope.hasPremium) {
            item = $.extend(item, {
              disabled : true
            });
          }
          var itemNew = items.selectBox(item);
          return $scope.hasPremium || itemNew.mousePopup(new MousePopup($scope.requiredPrem)), itemNew;
        }).append(function() {
          var config = {
            id : "autofarm_bewteen",
            name : "autofarm_bewteen",
            label : "Time before next farm: ",
            styles : "width: 120px;",
            value : self.settings.timebetween,
            options : [{
              value : "1",
              name : "1-2 seconds"
            }, {
              value : "3",
              name : "3-4 seconds"
            }, {
              value : "5",
              name : "5-6 seconds"
            }, {
              value : "7",
              name : "7-8 seconds"
            }, {
              value : "9",
              name : "9-10 seconds"
            }]
          };
          if (!$scope.hasPremium) {
            config = $.extend(config, {
              disabled : true
            });
          }
          var http_methods = items.selectBox(config);
          return $scope.hasPremium || http_methods.mousePopup(new MousePopup($scope.requiredPrem)), http_methods;
        }).append(items.checkbox({
          text : "Skip farm when warehouse is full.",
          id : "autofarm_warehousefull",
          name : "autofarm_warehousefull",
          checked : self.settings.skipwhenfull,
          disabled : !$scope.hasPremium
        })).append(items.checkbox({
          text : "Lowest resources first with more towns on one island.",
          id : "autofarm_lowresfirst",
          name : "autofarm_lowresfirst",
          checked : self.settings.lowresfirst,
          disabled : !$scope.hasPremium
        })).append(items.checkbox({
          text : "Stop loot farm until mood is below 80%.",
          id : "autofarm_loot",
          name : "autofarm_loot",
          checked : self.settings.stoplootbelow,
          disabled : !$scope.hasPremium
        })).append(function() {
          var circlesOuter = items.button({
            name : DM.getl10n("notes").btn_save,
            class : $scope.hasPremium ? "" : " disabled",
            style : "top: 62px;"
          }).on("click", function() {
            if (!$scope.hasPremium) {
              return false;
            }
            var esearchRes = $("#Autofarm_settings").serializeObject();
            /** @type {boolean} */
            self.settings.autostart = void 0 !== esearchRes.autofarm_autostart;
            /** @type {number} */
            self.settings.method = parseInt(esearchRes.autofarm_method);
            /** @type {number} */
            self.settings.timebetween = parseInt(esearchRes.autofarm_bewteen);
            /** @type {boolean} */
            self.settings.skipwhenfull = void 0 !== esearchRes.autofarm_warehousefull;
            /** @type {boolean} */
            self.settings.lowresfirst = void 0 !== esearchRes.autofarm_lowresfirst;
            /** @type {boolean} */
            self.settings.stoplootbelow = void 0 !== esearchRes.autofarm_loot;
            api_object.Auth("saveAutofarm", {
              player_id : settings.Account.player_id,
              world_id : settings.Account.world_id,
              csrfToken : settings.Account.csrfToken,
              autofarm_settings : settings.stringify(self.settings)
            }, self.callbackSave);
          });
          return $scope.hasPremium || circlesOuter.mousePopup(new MousePopup($scope.requiredPrem)), circlesOuter;
        });
      }
    }, {
      key : "callbackSave",
      value : function() {
        data.Log("Settings saved", 1);
        HumanMessage.success("The settings were saved!");
      }
    },
    {
      key : "settings",
      value : {
        autostart : false,
        method : 1200,
        timebetween : 9,
        skipwhenfull : true,
        lowresfirst : true,
        stoplootbelow : true
      }
    },{
      key : "title",
      value : "Autofarm settings"
    },{
      key : "town",
      value : null
    },{
      key : "isPauzed",
      value : false
    },{
      key : "iTown",
      value : null
    },{
      key : "interval",
      value : null
    },{
      key : "isCaptain",
      value : false
    },{
      key : "shouldFarm",
      value : []
    }], (selector = null) &&  list_to_object(o.prototype, selector), n &&  list_to_object(o, n), self;
  }();
 
  var that = owner;
  var host = function() {
    /**
     * @return {undefined}
     */
    function self() {
      !function(matrix, $) {
        if (!(matrix instanceof $)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, self);
    }
    var Constructor;
    var protoProps;
    var staticProps;
    return Constructor = self, staticProps = [{
      key : "init",
      value : function() {
        data.Log("Initialize Autoculture", 2);
        self.initButton();
      }
    }, {
      key : "initButton",
      value : function() {
        $scope.initButtons("Autoculture");
      }
    }, {
      key : "setSettings",
      value : function(message) {
        if ("" !== message && null != message) {
          $.extend(self.settings, message);
        }
      }
    }, {
      key : "checkAvailable",
      value : function(category) {
        var data = {
          party : false,
          triumph : false,
          theater : false
        };
        var version1attributes = ITowns.towns[category].buildings().attributes;
        var options = ITowns.towns[category].resources();
        return version1attributes.academy >= 30 && options.wood >= 15e3 && options.stone >= 18e3 && options.iron >= 15e3 && (data.party = true), 1 === version1attributes.theater && options.wood >= 1e4 && options.stone >= 12e3 && options.iron >= 1e4 && (data.theater = true), MM.getModelByNameAndPlayerId("PlayerKillpoints").getUnusedPoints() >= 300 && (data.triumph = true), data;
      }
    }, {
      key : "checkReady",
      value : function(props) {
        return !ITowns.towns[props.id].hasConqueror() && !!$scope.modules.Autoculture.isOn && (props.modules.Autoculture.isReadyTime >= Timestamp.now() ? props.modules.Autoculture.isReadyTime : !(void 0 === self.settings.towns[props.id] || !(self.settings.towns[props.id].party && self.checkAvailable(props.id).party || self.settings.towns[props.id].triumph && self.checkAvailable(props.id).triumph || self.settings.towns[props.id].theater && self.checkAvailable(props.id).theater)));
      }
    }, {
      key : "startCulture",
      value : function(navigatorType) {
        return !!self.checkEnabled() && ($scope.modules.Autoculture.isOn ? (self.town = navigatorType, self.iTown = ITowns.towns[self.town.id], void($scope.currentTown !== self.town.key ? (data.Log(self.town.name + " move to town.", 2), api_object.switch_town(self.town.id, function() {
          if (!self.checkEnabled()) {
            return false;
          }
          $scope.currentTown = self.town.key;
          self.start();
        })) : self.start())) : (self.finished(0), false));
      }
    }, {
      key : "start",
      value : function() {
        if (!self.checkEnabled()) {
          return false;
        }
        /** @type {number} */
        self.interval = setTimeout(function() {
          if (void 0 !== self.settings.towns[self.town.id]) {
            data.Log(self.town.name + " getting event information.", 2);
            api_object.building_place(self.town.id, function(res) {
              if (!self.checkEnabled()) {
                return false;
              }
              /** @type {!Array} */
              var sourceProps = [];
              sourceProps.push({
                name : "triumph",
                waiting : 19200,
                element : $(res.plain.html).find("#place_triumph")
              });
              sourceProps.push({
                name : "party",
                waiting : 57600,
                element : $(res.plain.html).find("#place_party")
              });
              sourceProps.push({
                name : "theater",
                waiting : 285120,
                element : $(res.plain.html).find("#place_theater")
              });
              /** @type {boolean} */
              var _0x112f0d = false;
              /** @type {number} */
              var i = 0;
              /** @type {number} */
              var elapsed = 300;
              !function start(oStartData) {
                if (3 === i) {
                  return _0x112f0d || data.Log(self.town.name + " not ready yet.", 2), self.finished(elapsed), false;
                }
                if ("triumph" === oStartData.name && (!self.settings.towns[self.town.id].triumph || !self.checkAvailable(self.town.id).triumph || MM.getModelByNameAndPlayerId("PlayerKillpoints").getUnusedPoints() < 300)) {
                  return i++, start(sourceProps[i]), false;
                }
                if (!("party" !== oStartData.name || self.settings.towns[self.town.id].party && self.checkAvailable(self.town.id).party)) {
                  return i++, start(sourceProps[i]), false;
                }
                if (!("theater" !== oStartData.name || self.settings.towns[self.town.id].theater && self.checkAvailable(self.town.id).theater)) {
                  return i++, start(sourceProps[i]), false;
                }
                if (oStartData.element.find("#countdown_" + oStartData.name).length) {
                  var maxElapsedTimeMs = settings.timeToSeconds(oStartData.element.find("#countdown_" + oStartData.name).html());
                  return (300 === elapsed || elapsed > maxElapsedTimeMs) && (elapsed = maxElapsedTimeMs), i++, start(sourceProps[i]), false;
                }
                return "1" !== oStartData.element.find(".button, .button_new").data("enabled") ? (i++, start(sourceProps[i]), false) : "1" === oStartData.element.find(".button, .button_new").data("enabled") ? (self.interval = setTimeout(function() {
                  /** @type {boolean} */
                  _0x112f0d = true;
                  self.startCelebration(oStartData, function(maxBlock) {
                    if (self.isPauzed) {
                      return false;
                    }
                    if (300 === elapsed || elapsed >= maxBlock) {
                      /** @type {number} */
                      elapsed = maxBlock;
                    }
                    i++;
                    start(sourceProps[i]);
                  });
                }, (i + 1) * settings.randomize(1e3, 2e3)), false) : (i++, void start(sourceProps[i]));
              }(sourceProps[i]);
            });
          }
        }, settings.randomize(2e3, 4e3));
      }
    }, {
      key : "startCelebration",
      value : function(method, func) {
        if (!self.checkEnabled()) {
          return false;
        }
        api_object.start_celebration(self.town.id, method.name, function(res) {
          if (!self.checkEnabled()) {
            return false;
          }
          /** @type {number} */
          var toFloat = 0;
          if (void 0 === res.json.error) {
            var _0x3196b3 = {};
            if ($.each(res.json.notifications, function(canCreateDiscussions, rule) {
              if ("Celebration" === rule.subject) {
                /** @type {*} */
                _0x3196b3 = JSON.parse(rule.param_str);
              }
            }), self.town.id === Game.townId) {
              var matchers = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING);
              /** @type {number} */
              var index = 0;
              for (; matchers.length > index; index++) {
                matchers[index].getHandler().refresh();
              }
            }
            if (void 0 !== _0x3196b3.Celebration) {
              data.Log('<span style="color: #fff;">' + PopupFactory.texts[_0x3196b3.Celebration.celebration_type] + " is started.</span>", 2);
              /** @type {number} */
              toFloat = _0x3196b3.Celebration.finished_at - Timestamp.now();
            }
          } else {
            data.Log(self.town.name + " " + res.json.error, 2);
          }
          func(toFloat);
        });
      }
    }, {
      key : "stop",
      value : function() {
        clearInterval(self.interval);
        /** @type {boolean} */
        self.isStopped = true;
      }
    }, {
      key : "finished",
      value : function(recB) {
        if (!self.checkEnabled()) {
          return false;
        }
        self.town.modules.Autoculture.isReadyTime = Timestamp.now() + recB;
        $scope.Queue.next();
      }
    }, {
      key : "checkEnabled",
      value : function() {
        return $scope.modules.Autoculture.isOn;
      }
    }, {
      key : "contentSettings",
      value : function() {
        /**
         * @param {string} elementType
         * @return {undefined}
         */
        function next(elementType) {
          var auto_oauth_realm = $(elementType + " .checkbox_new");
          if (idealElements[elementType]) {
            auto_oauth_realm.removeClass("checked");
            auto_oauth_realm.find('input[type="checkbox"]').prop("checked", false);
            /** @type {boolean} */
            idealElements[elementType] = false;
          } else {
            auto_oauth_realm.addClass("checked");
            auto_oauth_realm.find('input[type="checkbox"]').prop("checked", true);
            /** @type {boolean} */
            idealElements[elementType] = true;
          }
        }
        /** @type {string} */
        var i = '<ul class="game_list" id="townsoverview"><li class="even">';
        i = i + '<div class="towninfo small tag_header col w80 h25" id="header_town"></div>';
        i = i + '<div class="towninfo small tag_header col w40" id="header_island"> Island</div>';
        i = i + '<div class="towninfo small tag_header col w35" id="header_wood"><div class="col header wood"></div></div>';
        i = i + '<div class="towninfo small tag_header col w40" id="header_stone"><div class="col header stone"></div></div>';
        i = i + '<div class="towninfo small tag_header col w40" id="header_iron"><div class="col header iron"></div></div>';
        i = i + '<div class="towninfo small tag_header col w35" id="header_free_pop"><div class="col header free_pop"></div></div>';
        i = i + '<div class="towninfo small tag_header col w40" id="header_storage"><div class="col header storage"></div></div>';
        i = i + '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration party"></div></div>';
        i = i + '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration triumph"></div></div>';
        i = i + '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration theater"></div></div>';
        i = i + '<div style="clear:both;"></div>';
        i = i + '</li></ul><div id="bot_townsoverview_table_wrapper">';
        i = i + '<ul class="game_list scroll_content">';
        /** @type {number} */
        var index = 0;
        $.each($scope.playerTowns, function(canCreateDiscussions, timeline_mode) {
          var m = ITowns.towns[timeline_mode.id];
          var _0x3e364f = m.getIslandCoordinateX();
          var _0x58fc52 = m.getIslandCoordinateY();
          var options = m.resources();
          i = i + ('<li class="' + (index % 2 ? "even" : "odd") + ' bottom" id="ov_town_' + m.id + '">');
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w80">';
          /** @type {string} */
          i = i + "<div>";
          /** @type {string} */
          i = i + ('<span><a href="#' + m.getLinkFragment() + '" class="gp_town_link">' + m.name + "</a></span><br>");
          /** @type {string} */
          i = i + ("<span>(" + m.getPoints() + " Ptn.)</span>");
          /** @type {string} */
          i = i + "</div></div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w40">';
          /** @type {string} */
          i = i + "<div>";
          /** @type {string} */
          i = i + ("<span>" + _0x3e364f + "," + _0x58fc52 + "</span>");
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w40">';
          /** @type {string} */
          i = i + ('<div class="wood' + (options.wood === options.storage ? " town_storage_full" : "") + '">');
          /** @type {string} */
          i = i + options.wood;
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w40">';
          /** @type {string} */
          i = i + ('<div class="stone' + (options.stone === options.storage ? " town_storage_full" : "") + '">');
          /** @type {string} */
          i = i + options.stone;
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w40">';
          /** @type {string} */
          i = i + ('<div class="iron' + (options.iron === options.storage ? " town_storage_full" : "") + '">');
          /** @type {string} */
          i = i + options.iron;
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w35">';
          /** @type {string} */
          i = i + "<div>";
          /** @type {string} */
          i = i + ('<span class="town_population_count">' + options.population + "</span>");
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w40">';
          /** @type {string} */
          i = i + "<div>";
          /** @type {string} */
          i = i + ('<span class="storage">' + options.storage + "</span>");
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w50">';
          /** @type {string} */
          i = i + ('<div class="culture_party_row" id="culture_party_' + m.id + '">');
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w50">';
          /** @type {string} */
          i = i + ('<div class="culture_triumph_row" id="culture_triumph_' + m.id + '">');
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div class="towninfo small townsoverview col w50">';
          /** @type {string} */
          i = i + ('<div class="culture_theater_row" id="culture_theater_' + m.id + '">');
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + "</div>";
          /** @type {string} */
          i = i + '<div style="clear:both;"></div>';
          /** @type {string} */
          i = i + "</li>";
          index++;
        });
        i = i + "</ul></div>";
        i = i + '<div class="game_list_footer">';
        i = i + '<div id="bot_culture_settings"></div>';
        i = i + "</div>";
        var idealElements = {};
        var item = $(i);
        return item.find(".celebration.party").mousePopup(new MousePopup("Auto " + PopupFactory.texts.party)).on("click", function() {
          next(".culture_party_row");
        }), item.find(".celebration.triumph").mousePopup(new MousePopup("Auto " + PopupFactory.texts.triumph)).on("click", function() {
          next(".culture_triumph_row");
        }), item.find(".celebration.theater").mousePopup(new MousePopup("Auto " + PopupFactory.texts.theater)).on("click", function() {
          next(".culture_theater_row");
        }), $.each($scope.playerTowns, function(canCreateDiscussions, teamInstance) {
          item.find("#culture_party_" + teamInstance.id).html(items.checkbox({
            id : "bot_culture_party_" + teamInstance.id,
            name : "bot_culture_party_" + teamInstance.id,
            checked : teamInstance.id in self.settings.towns && self.settings.towns[teamInstance.id].party,
            disabled : !self.checkAvailable(teamInstance.id).party
          }));
          item.find("#culture_triumph_" + teamInstance.id).html(items.checkbox({
            id : "bot_culture_triumph_" + teamInstance.id,
            name : "bot_culture_triumph_" + teamInstance.id,
            checked : teamInstance.id in self.settings.towns && self.settings.towns[teamInstance.id].triumph,
            disabled : !self.checkAvailable(teamInstance.id).triumph
          }));
          item.find("#culture_theater_" + teamInstance.id).html(items.checkbox({
            id : "bot_culture_theater_" + teamInstance.id,
            name : "bot_culture_theater_" + teamInstance.id,
            checked : teamInstance.id in self.settings.towns && self.settings.towns[teamInstance.id].theater,
            disabled : !self.checkAvailable(teamInstance.id).theater
          }));
        }), item.find("#bot_culture_settings").append(function() {
          var circlesOuter = items.button({
            name : DM.getl10n("notes").btn_save,
            style : "float: left;",
            class : $scope.hasPremium ? "" : " disabled"
          }).on("click", function() {
            if (!$scope.hasPremium) {
              return false;
            }
            var fields_to_add = $("#bot_townsoverview_table_wrapper input").serializeObject();
            $.each($scope.playerTowns, function(canCreateDiscussions, timeline_mode) {
              self.settings.towns[timeline_mode.id] = {
                party : false,
                triumph : false,
                theater : false
              };
            });
            $.each(fields_to_add, function(inTheme, canCreateDiscussions) {
              if (inTheme.indexOf("bot_culture_party_") >= 0) {
                /** @type {boolean} */
                self.settings.towns[inTheme.replace("bot_culture_party_", "")].party = void 0 !== canCreateDiscussions;
              } else {
                if (inTheme.indexOf("bot_culture_triumph_") >= 0) {
                  /** @type {boolean} */
                  self.settings.towns[inTheme.replace("bot_culture_triumph_", "")].triumph = void 0 !== canCreateDiscussions;
                } else {
                  if (inTheme.indexOf("bot_culture_theater_") >= 0) {
                    /** @type {boolean} */
                    self.settings.towns[inTheme.replace("bot_culture_theater_", "")].theater = void 0 !== canCreateDiscussions;
                  }
                }
              }
            });
            self.settings.autostart = $("#autoculture_autostart").prop("checked");
            api_object.Auth("saveCulture", {
              player_id : settings.Account.player_id,
              world_id : settings.Account.world_id,
              csrfToken : settings.Account.csrfToken,
              autoculture_settings : settings.stringify(self.settings)
            }, self.callbackSave);
          });
          return $scope.hasPremium || circlesOuter.mousePopup(new MousePopup($scope.requiredPrem)), circlesOuter;
        }).append(items.checkbox({
          text : "AutoStart AutoCulture.",
          id : "autoculture_autostart",
          name : "autoculture_autostart",
          checked : self.settings.autostart
        })), items.gameWrapper("AutoCulture", "bot_townsoverview", item, "margin-bottom:9px;", !$scope.hasPremium);
      }
    }, {
      key : "callbackSave",
      value : function() {
        data.Log("Settings saved", 2);
        HumanMessage.success("The settings were saved!");
      }
    },{
      key : "settings",
      value : {
        autostart : false,
        towns : {}
      }
    },{
      key : "town",
      value : null
    },{
      key : "iTown",
      value : null
    },{
      key : "interval",
      value : null
    },{
      key : "isStopped",
      value : false
    }], (protoProps = null) && list_to_object(Constructor.prototype, protoProps), staticProps && list_to_object(Constructor, staticProps), self;
  }();

  var options = host;

  var obj = function() {
    /**
     * @return {undefined}
     */
    function self() {
      !function(matrix, $) {
        if (!(matrix instanceof $)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, self);
    }
    var t;
    var captureProperties;
    var n;
    return t = self, n = [{
      key : "init",
      value : function() {
        data.Log("Initialize Autobuild", 3);
        self.initFunction();
        self.initButton();
        self.checkCaptain();
        self.activateCss();
      }
    }, {
      key : "setSettings",
      value : function(message) {
        if ("" !== message && null != message) {
          $.extend(self.settings, message);
        }
      }
    }, {
      key : "activateCss",
      value : function() {
        $(".construction_queue_order_container").addClass("active");
      }
    }, {
      key : "setQueue",
      value : function(val, message, initialValue) {
        if ("" !== val && null != val) {
          /** @type {string} */
          self.building_queue = val;
          self.initQueue($(".construction_queue_order_container"), "building");
        }
        if ("" !== message && null != message) {
          /** @type {string} */
          self.units_queue = message;
        }
        if ("" !== initialValue && null != initialValue) {
          /** @type {string} */
          self.ships_queue = initialValue;
        }
      }
    }, {
      key : "calls",
      value : function(saveEvenIfSeemsUnchanged) {
        switch(saveEvenIfSeemsUnchanged) {
          case "building_main/index":
          case "building_main/build":
          case "building_main/cancel":
          case "building_main/tear_down":
            self.windows.building_main_index(saveEvenIfSeemsUnchanged);
            break;
          case "building_barracks/index":
          case "building_barracks/build":
          case "building_barracks/cancel":
          case "building_barracks/tear_down":
            self.windows.building_barracks_index(saveEvenIfSeemsUnchanged);
        }
      }
    }, {
      key : "initFunction",
      value : function() {
        var oldSetupComputes;
        /** @type {function(): undefined} */
        GameViews.ConstructionQueueBaseView.prototype.renderQueue = (oldSetupComputes = GameViews.ConstructionQueueBaseView.prototype.renderQueue, function() {
          if (oldSetupComputes.apply(this, arguments), "#building_tasks_main .various_orders_queue .frame-content .various_orders_content" !== this.$el.selector && "#ui_box .ui_construction_queue .construction_queue_order_container" !== this.$el.selector || self.initQueue(this.$el, "building"), "#unit_orders_queue .js-researches-queue" === this.$el.selector) {
            var khover = this.$el.find(".ui_various_orders");
            if (khover.hasClass("barracks")) {
              self.initQueue(this.$el, "unit");
            } else {
              if (khover.hasClass("docks")) {
                self.initQueue(this.$el, "ship");
              }
            }
          }
        });
        UnitOrder.selectUnit = function(CropAreaRectangle) {
          return function() {
            CropAreaRectangle.apply(this, arguments);
            if (this.barracks) {
              self.initUnitOrder(this, "unit");
            } else {
              if (!this.barracks) {
                self.initUnitOrder(this, "ship");
              }
            }
          };
        }(UnitOrder.selectUnit);
      }
    }, {
      key : "initButton",
      value : function() {
        $scope.initButtons("Autobuild");
      }
    }, {
      key : "checkCaptain",
      value : function() {
        if ($(".advisor_frame.captain div").hasClass("captain_active")) {
          /** @type {boolean} */
          self.isCaptain = true;
        }
        /** @type {number} */
        self.Queue = self.isCaptain ? 7 : 2;
      }
    }, {
      key : "checkReady",
      value : function(clone) {
        var _0x39a132 = ITowns.towns[clone.id];
        return !!$scope.modules.Autobuild.isOn && !_0x39a132.hasConqueror() && !!(self.settings.enable_building || self.settings.enable_units || self.settings.enable_ships) && (clone.modules.Autobuild.isReadyTime >= Timestamp.now() ? clone.modules.Autobuild.isReadyTime : !(void 0 === self.building_queue[clone.id] && void 0 === self.units_queue[clone.id] && void 0 === self.ships_queue[clone.id]));
      }
    }, {
      key : "startBuild",
      value : function(navigatorType) {
        if (!self.checkEnabled()) {
          return false;
        }
        /** @type {string} */
        self.town = navigatorType;
        self.iTown = ITowns.towns[self.town.id];
        if ($scope.currentTown !== self.town.key) {
          data.Log(self.town.name + " move to town.", 3);
          api_object.switch_town(self.town.id, function() {
            $scope.currentTown = self.town.key;
            self.startUpgrade();
          });
        } else {
          self.startUpgrade();
        }
      }
    }, {
      key : "startQueueing",
      value : function() {
        if (!self.checkEnabled()) {
          return false;
        }
        if (void 0 === self.building_queue[self.town.id] && void 0 === self.units_queue[self.town.id] && void 0 === self.ships_queue[self.town.id]) {
          self.finished();
        }
        var undefined = self.getReadyTime(self.town.id).shouldStart;
        if ("building" === undefined) {
          self.startBuildBuilding();
        } else {
          if ("unit" === undefined || "ship" === undefined) {
            self.startBuildUnits("unit" === undefined ? self.units_queue : self.ships_queue, undefined);
          } else {
            self.finished();
          }
        }
      }
    }, {
      key : "startUpgrade",
      value : function() {
        if (!self.checkEnabled()) {
          return false;
        }
        if (GameDataInstantBuy.isEnabled() && self.checkInstantComplete(self.town.id)) {
          /** @type {number} */
          self.interval = setTimeout(function() {
            api_object.frontend_bridge(self.town.id, {
              model_url : "BuildingOrder/" + self.instantBuyTown.order_id,
              action_name : "buyInstant",
              arguments : {
                order_id : self.instantBuyTown.order_id
              },
              town_id : self.town.id,
              nl_init : true
            }, function(SMessage) {
              if (SMessage.success) {
                if (self.town.id === Game.townId) {
                  var matchers = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING);
                  /** @type {number} */
                  var index = 0;
                  for (; matchers.length > index; index++) {
                    matchers[index].getHandler().refresh();
                  }
                }
                data.Log('<span style="color: #ffa03d;">' + self.instantBuyTown.building_name.capitalize() + " - " + SMessage.success + "</span>", 3);
              }
              if (SMessage.error) {
                data.Log(self.town.name + " " + SMessage.error, 3);
              }
              /** @type {number} */
              self.interval = setTimeout(function() {
                /** @type {boolean} */
                self.instantBuyTown = false;
                self.startQueueing();
              }, settings.randomize(500, 700));
            });
          }, settings.randomize(1e3, 2e3));
        } else {
          self.startQueueing();
        }
      }
    }, {
      key : "startBuildUnits",
      value : function(obj2, field) {
        if (!self.checkEnabled()) {
          return false;
        }
        if (void 0 !== obj2[self.town.id]) {
          if (void 0 !== obj2[self.town.id]) {
            var item = obj2[self.town.id][0];
            if (GameDataUnits.getMaxBuildForSingleUnit(item.item_name) >= item.count) {
              /** @type {number} */
              self.interval = setTimeout(function() {
                api_object.building_barracks(self.town.id, {
                  unit_id : item.item_name,
                  amount : item.count,
                  town_id : self.town.id,
                  nl_init : true
                }, function(replacementInfo) {
                  if (replacementInfo.error) {
                    data.Log(self.town.name + " " + replacementInfo.error, 3);
                  } else {
                    if (self.town.id === Game.townId) {
                      var matchers = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING);
                      /** @type {number} */
                      var index = 0;
                      for (; matchers.length > index; index++) {
                        matchers[index].getHandler().refresh();
                      }
                    }
                    data.Log('<span style="color: ' + ("unit" === field ? "#ffe03d" : "#3dadff") + ';">Units - ' + item.count + " " + GameData.units[item.item_name].name_plural + " added.</span>", 3);
                    api_object.Auth("removeItemQueue", {
                      player_id : settings.Account.player_id,
                      world_id : settings.Account.world_id,
                      csrfToken : settings.Account.csrfToken,
                      town_id : self.town.id,
                      item_id : item.id,
                      type : field
                    }, self.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), field));
                    $(".queue_id_" + item.id).remove();
                  }
                  self.finished();
                });
              }, settings.randomize(1e3, 2e3));
            } else {
              data.Log(self.town.name + " recruiting " + item.count + " " + GameData.units[item.item_name].name_plural + " not ready.", 3);
              self.finished();
            }
          } else {
            self.finished();
          }
        } else {
          self.finished();
        }
      }
    }, {
      key : "startBuildBuilding",
      value : function() {
        if (!self.checkEnabled()) {
          return false;
        }
        if (void 0 !== self.building_queue[self.town.id] && self.building_queue[self.town.id]) {
          /** @type {number} */
          self.interval = setTimeout(function() {
            data.Log(self.town.name + " getting building information.", 3);
            api_object.building_main(self.town.id, function(init) {
              if (self.hasFreeBuildingSlots(init)) {
                var o = self.building_queue[self.town.id][0];
                if (void 0 !== o) {
                  var _0x40d77e = self.getBuildings(init)[o.item_name];
                  if (_0x40d77e.can_upgrade) {
                    api_object.frontend_bridge(self.town.id, {
                      model_url : "BuildingOrder",
                      action_name : "buildUp",
                      arguments : {
                        building_id : o.item_name
                      },
                      town_id : self.town.id,
                      nl_init : true
                    }, function(SMessage) {
                      if (SMessage.success) {
                        if (self.town.id === Game.townId) {
                          var matchers = GPWindowMgr.getByType(GPWindowMgr.TYPE_BUILDING);
                          /** @type {number} */
                          var index = 0;
                          for (; matchers.length > index; index++) {
                            matchers[index].getHandler().refresh();
                          }
                        }
                        data.Log('<span style="color: #ffa03d;">' + o.item_name.capitalize() + " - " + SMessage.success + "</span>", 3);
                        api_object.Auth("removeItemQueue", {
                          player_id : settings.Account.player_id,
                          world_id : settings.Account.world_id,
                          csrfToken : settings.Account.csrfToken,
                          town_id : self.town.id,
                          item_id : o.id,
                          type : "building"
                        }, self.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders")));
                        $(".queue_id_" + o.id).remove();
                      }
                      if (SMessage.error) {
                        data.Log(self.town.name + " " + SMessage.error, 3);
                      }
                      self.finished();
                    });
                  } else {
                    if (_0x40d77e.enough_population) {
                      if (_0x40d77e.enough_resources) {
                        data.Log(self.town.name + " " + o.item_name + " can not be started due dependencies.", 3);
                        api_object.Auth("removeItemQueue", {
                          player_id : settings.Account.player_id,
                          world_id : settings.Account.world_id,
                          csrfToken : settings.Account.csrfToken,
                          town_id : self.town.id,
                          item_id : o.id,
                          type : "building"
                        }, self.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders")));
                        $(".queue_id_" + o.id).remove();
                        self.finished();
                      } else {
                        data.Log(self.town.name + " not enough resources for " + o.item_name + ".", 3);
                        self.finished();
                      }
                    } else {
                      data.Log(self.town.name + " not enough population for " + o.item_name + ".", 3);
                      self.finished();
                    }
                  }
                } else {
                  self.finished();
                }
              } else {
                data.Log(self.town.name + " no free building slots available.", 3);
                self.finished();
              }
            });
          }, settings.randomize(1e3, 2e3));
        } else {
          self.finished();
        }
      }
    }, {
      key : "getReadyTime",
      value : function(queIdx) {
        var data = {
          building : {
            queue : [],
            timeLeft : 0
          },
          unit : {
            queue : [],
            timeLeft : 0
          },
          ship : {
            queue : [],
            timeLeft : 0
          }
        };
        $.each(MM.getOnlyCollectionByName("BuildingOrder").models, function(canCreateDiscussions, DatumTag) {
          if (queIdx === DatumTag.getTownId()) {
            data.building.queue.push({
              type : "building",
              model : DatumTag
            });
          }
        });
        $.each(MM.getOnlyCollectionByName("UnitOrder").models, function(canCreateDiscussions, conversation) {
          if (queIdx === conversation.attributes.town_id) {
            if ("ground" === conversation.attributes.kind) {
              data.unit.queue.push({
                type : "unit",
                model : conversation
              });
            }
            if ("naval" === conversation.attributes.kind) {
              data.ship.queue.push({
                type : "ship",
                model : conversation
              });
            }
          }
        });
        /** @type {null} */
        var _0x57c46c = null;
        /** @type {string} */
        var answer = "nothing";
        return $.each(data, function(undefined) {
          if ("building" === undefined && void 0 !== self.building_queue[queIdx] || "unit" === undefined && void 0 !== self.units_queue[queIdx] || "ship" === undefined && void 0 !== self.ships_queue[queIdx]) {
            /** @type {string} */
            answer = undefined;
          }
        }), GameDataInstantBuy.isEnabled() && data.building.queue.length > 0 && (_0x57c46c = data.building.queue[0].model.getTimeLeft() - 300), {
          readyTime : Timestamp.now() + (_0x57c46c > 0 ? _0x57c46c : +self.settings.timeinterval),
          shouldStart : answer
        };
      }
    }, {
      key : "stop",
      value : function() {
        clearInterval(self.interval);
      }
    }, {
      key : "checkEnabled",
      value : function() {
        return $scope.modules.Autobuild.isOn;
      }
    }, {
      key : "finished",
      value : function() {
        if (!self.checkEnabled()) {
          return false;
        }
        self.town.modules.Autobuild.isReadyTime = self.getReadyTime(self.town.id).readyTime;
        $scope.Queue.next();
      }
    }, {
      key : "checkInstantComplete",
      value : function(recB) {
        return self.instantBuyTown = false, $.each(MM.getOnlyCollectionByName("BuildingOrder").models, function(canCreateDiscussions, building) {
          if (recB === building.getTownId() && building.getTimeLeft() < 300) {
            return self.instantBuyTown = {
              order_id : building.id,
              building_name : building.getBuildingId()
            }, false;
          }
        }), self.instantBuyTown;
      }
    }, {
      key : "checkBuildingDepencencies",
      value : function(i, forceOptional) {
        var dependencies = GameData.buildings[i].dependencies;
        var mtimes = forceOptional.getBuildings().getBuildings();
        /** @type {!Array} */
        var viewModels = [];
        return $.each(dependencies, function(id, time) {
          if (mtimes[id] < time) {
            viewModels.push({
              building_id : id,
              level : time
            });
          }
        }), viewModels;
      }
    }, {
      key : "callbackSaveBuilding",
      value : function(recB) {
        return function(lineSeries) {
          recB.each(function() {
            $(this).find(".empty_slot").remove();
            if (lineSeries.item) {
              $(this).append(self.buildingElement($(this), lineSeries.item));
              self.setEmptyItems($(this));
            } else {
              self.setEmptyItems($(this));
            }
          });
          delete lineSeries.item;
          /** @type {!Object} */
          self.building_queue = lineSeries;
        };
      }
    }, {
      key : "callbackSaveSettings",
      value : function() {
        data.Log("Settings saved", 3);
        HumanMessage.success("The settings were saved!");
      }
    }, {
      key : "hasFreeBuildingSlots",
      value : function(currEl) {
        /** @type {boolean} */
        var _0x3b2607 = false;
        return void 0 !== currEl && /BuildingMain\.full_queue = false;/g.test(currEl.html) && (_0x3b2607 = true), _0x3b2607;
      }
    }, {
      key : "getBuildings",
      value : function(mail_object) {
        /** @type {null} */
        var last_v = null;
        if (void 0 !== mail_object.html) {
          var chatObjectParts = mail_object.html.match(/BuildingMain\.buildings = (.*);/g);
          if (void 0 !== chatObjectParts[0]) {
            /** @type {*} */
            last_v = JSON.parse(chatObjectParts[0].substring(25, chatObjectParts[0].length - 1));
          }
        }
        return last_v;
      }
    }, {
      key : "initQueue",
      value : function($, undefined) {
        var td = $.find(".ui_various_orders");
        td.find(".empty_slot").remove();
        if ("building" === undefined) {
          $("#building_tasks_main").addClass("active");
          if (void 0 !== self.building_queue[Game.townId]) {
            $.each(self.building_queue[Game.townId], function(canCreateDiscussions, endDate) {
              td.append(self.buildingElement(td, endDate));
            });
          }
        }
        if ("unit" === undefined) {
          $("#unit_orders_queue").addClass("active");
          if (void 0 !== self.units_queue[Game.townId]) {
            $.each(self.units_queue[Game.townId], function(canCreateDiscussions, endDate) {
              td.append(self.unitElement(td, endDate, undefined));
            });
          }
        }
        if ("ship" === undefined) {
          $("#unit_orders_queue").addClass("active");
          if (void 0 !== self.ships_queue[Game.townId]) {
            $.each(self.ships_queue[Game.townId], function(canCreateDiscussions, endDate) {
              td.append(self.unitElement(td, endDate, undefined));
            });
          }
        }
        self.setEmptyItems(td);
        td.parent().mousewheel(function(event, canCreateDiscussions) {
          this.scrollLeft -= 30 * canCreateDiscussions;
          event.preventDefault();
        });
      }
    }, {
      key : "initUnitOrder",
      value : function(opts, saveEvenIfSeemsUnchanged) {
        var data = opts.units[opts.unit_id];
        var existing_login_methods_div = opts.$el.find("#unit_order_confirm");
        var enabler = opts.$el.find("#unit_order_addqueue");
        var $slider = opts.$el.find("#unit_order_slider");
        if (enabler.length >= 0 && (data.missing_building_dependencies.length >= 1 || data.missing_research_dependencies.length >= 1) && enabler.hide(), 0 === data.missing_building_dependencies.length && 0 === data.missing_research_dependencies.length) {
          var api = ITowns.towns[Game.townId];
          var max = data.max_build;
          /** @type {number} */
          var DyMilli = Math.max.apply(this, [data.resources.wood, data.resources.stone, data.resources.iron]);
          /** @type {!Array} */
          var args = [];
          args.push(Math.floor(api.getStorage() / DyMilli));
          args.push(Math.floor((api.getAvailablePopulation() - self.checkPopulationBeingBuild()) / data.population));
          if (data.favor > 0) {
            args.push(Math.floor(500 / data.favor));
          }
          /** @type {number} */
          var n = Math.min.apply(this, args);
          if (n > 0 && n >= max) {
            opts.slider.setMax(n);
          }
          if (0 === enabler.length) {
            enabler = $("<a/>", {
              href : "#",
              id : "unit_order_addqueue",
              class : "confirm"
            });
            existing_login_methods_div.after(enabler);
            enabler.mousePopup(new MousePopup("Add to reqruite queue")).on("click", function(event) {
              event.preventDefault();
              self.addUnitQueueItem(data, saveEvenIfSeemsUnchanged);
            });
          } else {
            enabler.unbind("click");
            enabler.on("click", function(event) {
              event.preventDefault();
              self.addUnitQueueItem(data, saveEvenIfSeemsUnchanged);
            });
          }
          if (n <= 0) {
            enabler.hide();
          } else {
            enabler.show();
          }
          existing_login_methods_div.show();
          $slider.slider({
            slide : function(distance, f) {
              if (f.value > max) {
                existing_login_methods_div.hide();
              } else {
                if (f.value >= 0 && f.value <= max) {
                  existing_login_methods_div.show();
                }
              }
              if (0 === f.value) {
                enabler.hide();
              } else {
                if (f.value > 0 && n > 0) {
                  enabler.show();
                }
              }
            }
          });
        }
      }
    }, {
      key : "checkBuildingLevel",
      value : function(item) {
        console.log(item);
        var _0x47971a = ITowns.towns[Game.townId].getBuildings().attributes[item.item_name];
        return $.each(ITowns.towns[Game.townId].buildingOrders().models, function(canCreateDiscussions, dimensionUsage) {
          if (dimensionUsage.attributes.building_type === item.item_name) {
            _0x47971a++;
          }
        }), void 0 !== self.building_queue[Game.townId] && $(self.building_queue[Game.townId]).each(function(canCreateDiscussions, data) {
          if (data.id === item.id) {
            return false;
          }
          if (data.item_name === item.item_name) {
            _0x47971a++;
          }
        }), ++_0x47971a;
      }
    }, {
      key : "checkPopulationBeingBuild",
      value : function() {
        /** @type {number} */
        var _0x430413 = 0;
        return void 0 !== self.units_queue[Game.townId] && $(self.units_queue[Game.townId].unit).each(function(canCreateDiscussions, unit) {
          _0x430413 = _0x430413 + unit.count * GameData.units[unit.item_name].population;
        }), void 0 !== self.ships_queue[Game.townId] && $(self.ships_queue[Game.townId].ship).each(function(canCreateDiscussions, unit) {
          _0x430413 = _0x430413 + unit.count * GameData.units[unit.item_name].population;
        }), _0x430413;
      }
    }, {
      key : "addUnitQueueItem",
      value : function(item, field) {
        api_object.Auth("addItemQueue", {
          player_id : settings.Account.player_id,
          world_id : settings.Account.world_id,
          csrfToken : settings.Account.csrfToken,
          town_id : Game.townId,
          item_name : item.id,
          type : field,
          count : UnitOrder.slider.getValue()
        }, self.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), field));
      }
    }, {
      key : "callbackSaveUnits",
      value : function(plugins, p) {
        return function(nextJob) {
          console.log(nextJob);
          if ("unit" === p) {
            /** @type {!Object} */
            self.units_queue = nextJob;
          } else {
            if ("ship" === p) {
              /** @type {!Object} */
              self.ships_queue = nextJob;
            }
          }
          plugins.each(function() {
            $(this).find(".empty_slot").remove();
            if (nextJob.item) {
              $(this).append(self.unitElement($(this), nextJob.item, p));
              self.setEmptyItems($(this));
              delete nextJob.item;
            } else {
              self.setEmptyItems($(this));
            }
            UnitOrder.selectUnit(UnitOrder.unit_id);
          });
        };
      }
    }, {
      key : "setEmptyItems",
      value : function(elem) {
        /** @type {number} */
        var h = 0;
        var p = elem.parent().width();
        $.each(elem.find(".js-tutorial-queue-item"), function() {
          h = h + $(this).outerWidth(true);
        });
        /** @type {number} */
        var val = p - h;
        if (val >= 0) {
          elem.width(p);
          /** @type {number} */
          var _0x99cb46 = 1;
          for (; _0x99cb46 <= Math.floor(val) / 60; _0x99cb46++) {
            elem.append($("<div/>", {
              class : "js-queue-item js-tutorial-queue-item construction_queue_sprite empty_slot"
            }));
          }
        } else {
          elem.width(h + 25);
        }
      }
    }, {
      key : "buildingElement",
      value : function(att_id, data) {
        return $("<div/>", {
          class : "js-tutorial-queue-item queued_building_order last_order " + data.item_name + " queue_id_" + data.id
        }).append($("<div/>", {
          class : "construction_queue_sprite frame"
        }).mousePopup(new MousePopup(data.item_name.capitalize() + " queued")).append($("<div/>", {
          class : "item_icon building_icon40x40 js-item-icon build_queue " + data.item_name
        }).append($("<div/>", {
          class : "building_level"
        }).append('<span class="construction_queue_sprite arrow_green_ver"></span>' + self.checkBuildingLevel(data))))).append($("<div/>", {
          class : "btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue"
        }).on("click", function(event) {
          event.preventDefault();
          api_object.Auth("removeItemQueue", {
            player_id : settings.Account.player_id,
            world_id : settings.Account.world_id,
            csrfToken : settings.Account.csrfToken,
            town_id : Game.townId,
            item_id : data.id,
            type : "building"
          }, self.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders")));
          $(".queue_id_" + data.id).remove();
        }).append($("<div/>", {
          class : "left"
        })).append($("<div/>", {
          class : "right"
        })).append($("<div/>", {
          class : "caption js-caption"
        }).append($("<div/>", {
          class : "effect js-effect"
        }))));
      }
    }, {
      key : "unitElement",
      value : function(att_id, data, field) {
        return $("<div/>", {
          class : "js-tutorial-queue-item queued_building_order last_order " + data.item_name + " queue_id_" + data.id
        }).append($("<div/>", {
          class : "construction_queue_sprite frame"
        }).mousePopup(new MousePopup(data.item_name.capitalize().replace("_", " ") + " queued")).append($("<div/>", {
          class : "item_icon unit_icon40x40 js-item-icon build_queue " + data.item_name
        }).append($("<div/>", {
          class : "unit_count text_shadow"
        }).html(data.count)))).append($("<div/>", {
          class : "btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue"
        }).on("click", function(event) {
          event.preventDefault();
          api_object.Auth("removeItemQueue", {
            player_id : settings.Account.player_id,
            world_id : settings.Account.world_id,
            csrfToken : settings.Account.csrfToken,
            town_id : Game.townId,
            item_id : data.id,
            type : field
          }, self.callbackSaveUnits($("#unit_orders_queue .ui_various_orders"), field));
          $(".queue_id_" + data.id).remove();
        }).append($("<div/>", {
          class : "left"
        })).append($("<div/>", {
          class : "right"
        })).append($("<div/>", {
          class : "caption js-caption"
        }).append($("<div/>", {
          class : "effect js-effect"
        }))));
      }
    }, {
      key : "contentSettings",
      value : function() {
        return $("<fieldset/>", {
          id : "Autobuild_settings",
          class : $scope.hasPremium ? "" : "disabled-box",
          style : "float:left; width:472px; height: 270px;"
        }).append($("<legend/>").html("Autobuild Settings")).append(items.checkbox({
          text : "AutoStart Autobuild.",
          id : "autobuild_autostart",
          name : "autobuild_autostart",
          checked : self.settings.autostart
        })).append(items.selectBox({
          id : "autobuild_timeinterval",
          name : "autobuild_timeinterval",
          label : "Check every: ",
          styles : "width: 120px;",
          value : self.settings.timeinterval,
          options : [{
            value : "120",
            name : "2 minutes"
          }, {
            value : "300",
            name : "5 minutes"
          }, {
            value : "600",
            name : "10 minutes"
          }, {
            value : "900",
            name : "15 minutes"
          }]
        })).append(items.checkbox({
          text : "Enable building queue.",
          id : "autobuild_building_enable",
          name : "autobuild_building_enable",
          style : "width: 100%;padding-top: 35px;",
          checked : self.settings.enable_building
        })).append(items.checkbox({
          text : "Enable barracks queue.",
          id : "autobuild_barracks_enable",
          name : "autobuild_barracks_enable",
          style : "width: 100%;",
          checked : self.settings.enable_units
        })).append(items.checkbox({
          text : "Enable ships queue.",
          id : "autobuild_ships_enable",
          name : "autobuild_ships_enable",
          style : "width: 100%;padding-bottom: 35px;",
          checked : self.settings.enable_ships
        })).append(function() {
          var circlesOuter = items.button({
            name : DM.getl10n("notes").btn_save,
            style : "top: 10px;",
            class : $scope.hasPremium ? "" : " disabled"
          }).on("click", function() {
            if (!$scope.hasPremium) {
              return false;
            }
            var esearchRes = $("#Autobuild_settings").serializeObject();
            /** @type {boolean} */
            self.settings.autostart = void 0 !== esearchRes.autobuild_autostart;
            /** @type {number} */
            self.settings.timeinterval = parseInt(esearchRes.autobuild_timeinterval);
            /** @type {boolean} */
            self.settings.autostart = void 0 !== esearchRes.autobuild_autostart;
            /** @type {boolean} */
            self.settings.enable_building = void 0 !== esearchRes.autobuild_building_enable;
            /** @type {boolean} */
            self.settings.enable_units = void 0 !== esearchRes.autobuild_barracks_enable;
            /** @type {boolean} */
            self.settings.enable_ships = void 0 !== esearchRes.autobuild_ships_enable;
            /** @type {boolean} */
            self.settings.instant_buy = void 0 !== esearchRes.autobuild_instant_buy;
            api_object.Auth("saveBuild", {
              player_id : settings.Account.player_id,
              world_id : settings.Account.world_id,
              csrfToken : settings.Account.csrfToken,
              autobuild_settings : settings.stringify(self.settings)
            }, self.callbackSaveSettings);
          });
          return $scope.hasPremium || circlesOuter.mousePopup(new MousePopup($scope.requiredPrem)), circlesOuter;
        });
      }
    },{
      key : "settings",
      value : {
        autostart : false,
        enable_building : true,
        enable_units : true,
        enable_ships : true,
        timeinterval : 120,
        instant_buy : true
      }
    },{
      key : "building_queue",
      value : {}
    },{
      key : "units_queue",
      value : {}
    },{
      key : "ships_queue",
      value : {}
    },{
      key : "town",
      value : null
    },{
      key : "iTown",
      value : null
    },{
      key : "interval",
      value : null
    },{
      key : "currentWindow",
      value : null
    },{
      key : "isCaptain",
      value : false
    },{
      key : "Queue",
      value : 0
    },{
      key : "ModuleManager",
      value : void 0
    },{
      key : "windows",
      value : {
        wndId : null,
        wndContent : null,
        building_main_index : function() {
          if (GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING)) {
            obj.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING).getJQElement().find(".gpwindow_content");
            var jQFooter = obj.currentWindow.find("#main_tasks h4");
            jQFooter.html(jQFooter.html().replace(/\/.*\)/, "/&infin;)"));
            /** @type {!Array} */
            var compareTerms = ["theater", "thermal", "library", "lighthouse", "tower", "statue", "oracle", "trade_office"];
            $.each($("#buildings .button_build.build_grey.build_up.small.bold"), function() {
              var table = $(this).parent().parent().attr("id").replace("building_main_", "");
              if (obj.checkBuildingDepencencies(table, ITowns.getTown(Game.townId)).length <= 0 && -1 === $.inArray(table, compareTerms)) {
                $(this).removeClass("build_grey").addClass("build").html("Add to queue").on("click", function(event) {
                  event.preventDefault();
                  api_object.Auth("addItemQueue", {
                    player_id : settings.Account.player_id,
                    world_id : settings.Account.world_id,
                    csrfToken : settings.Account.csrfToken,
                    town_id : Game.townId,
                    item_name : table,
                    count : 1,
                    type : "building"
                  }, obj.callbackSaveBuilding($("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders")));
                });
              }
            });
          }
        },
        building_barracks_index : function() {
          if (GPWindowMgr && GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING)) {
            obj.currentWindow = GPWindowMgr.getOpenFirst(Layout.wnd.TYPE_BUILDING).getJQElement().find(".gpwindow_content");
            obj.currentWindow.find("#unit_orders_queue h4").find(".js-max-order-queue-count").html("&infin;");
          }
        }
      }
    },], (captureProperties = null) && list_to_object(t.prototype, captureProperties), n && list_to_object(t, n), self;
  }();

  var result = obj;
  var me = function() {
    /**
     * @return {undefined}
     */
    function self() {
      !function(matrix, $) {
        if (!(matrix instanceof $)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, self);
    }
    var o;
    var value;
    var to;
    return o = self, to = [{
      key : "init",
      value : function() {
        self.loadPlayerTowns();
        self.initButtons();
        self.initTimer();
      }
    }, {
      key : "start",
      value : function() {
        /** @type {boolean} */
        var _0x36c75b = false;
        /** @type {null} */
        var last_level = null;
        if ($.each(self.playerTowns, function(canCreateDiscussions, id) {
          var cur_level = that.checkReady(id);
          if (true === cur_level) {
            /** @type {boolean} */
            _0x36c75b = true;
            self.Queue.add({
              townId : id.id,
              fx : function() {
                id.startFarming();
              }
            });
          } else {
            if (false !== cur_level && (null == last_level || cur_level < last_level)) {
              last_level = cur_level;
            }
          }
          var level = options.checkReady(id);
          if (true === level) {
            /** @type {boolean} */
            _0x36c75b = true;
            self.Queue.add({
              townId : id.id,
              fx : function() {
                id.startCulture();
              }
            });
          } else {
            if (false !== level && (null == last_level || level < last_level)) {
              last_level = level;
            }
          }
          var vtId = result.checkReady(id);
          if (true === vtId) {
            /** @type {boolean} */
            _0x36c75b = true;
            self.Queue.add({
              townId : id.id,
              fx : function() {
                id.startBuild();
              }
            });
          } else {
            if (false !== vtId && (null == last_level || vtId < last_level)) {
              last_level = vtId;
            }
          }
        }), null !== last_level || _0x36c75b) {
          if (_0x36c75b) {
            self.Queue.start();
          } else {
            /** @type {number} */
            var handle = last_level - Timestamp.now() + 10;
            self.startTimer(handle, function() {
              self.start();
            });
          }
        } else {
          data.Log("Nothing is ready yet!", 0);
          self.startTimer(30, function() {
            self.start();
          });
        }
      }
    }, {
      key : "stop",
      value : function() {
        clearInterval(self.interval);
        self.Queue.stop();
        $("#time_autobot .caption .value_container .curr").html("Stopped");
      }
    }, {
      key : "finished",
      value : function() {
        self.start();
      }
    }, {
      key : "initTimer",
      value : function() {
        $(".nui_main_menu").css("top", "275px");
        $("#time_autobot").append(items.timerBoxSmall({
          id : "Autofarm_timer",
          styles : "",
          text : "Start Autobot"
        })).show();
      }
    }, {
      key : "updateTimer",
      value : function(current, value) {
        /** @type {number} */
        var percents = 0;
        /** @type {number} */
        percents = void 0 !== current && void 0 !== value ? (self.Queue.total - (self.Queue.queue.length + 1) + value / current) / self.Queue.total * 100 : (self.Queue.total - self.Queue.queue.length) / self.Queue.total * 100;
        if (!isNaN(percents)) {
          $("#time_autobot .progress .indicator").width(percents + "%");
          $("#time_autobot .caption .value_container .curr").html(Math.round(percents) + "%");
        }
      }
    }, {
      key : "checkAutostart",
      value : function() {
        if (that.settings.autostart) {
          /** @type {boolean} */
          self.modules.Autofarm.isOn = true;
          var $icon = $("#Autofarm_onoff");
          $icon.addClass("on");
          $icon.find("span").mousePopup(new MousePopup("Stop Autofarm"));
        }
        if (options.settings.autostart) {
          /** @type {boolean} */
          self.modules.Autoculture.isOn = true;
          var $icon = $("#Autoculture_onoff");
          $icon.addClass("on");
          $icon.find("span").mousePopup(new MousePopup("Stop Autoculture"));
        }
        if (result.settings.autostart) {
          /** @type {boolean} */
          self.modules.Autobuild.isOn = true;
          var $icon = $("#Autobuild_onoff");
          $icon.addClass("on");
          $icon.find("span").mousePopup(new MousePopup("Stop Autobuild"));
        }
        if (that.settings.autostart || options.settings.autostart || result.settings.autostart) {
          self.start();
        }
      }
    }, {
      key : "startTimer",
      value : function(id, _observe) {
        var ic = id;
        /** @type {number} */
        self.interval = setInterval(function() {
          $("#time_autobot .caption .value_container .curr").html(settings.toHHMMSS(id));
          $("#time_autobot .progress .indicator").width((ic - id) / ic * 100 + "%");
          if (--id < 0) {
            clearInterval(self.interval);
            _observe();
          }
        }, 1e3);
      }
    }, {
      key : "initButtons",
      value : function(name) {
        var $item = $("#" + name + "_onoff");
        $item.removeClass("disabled");
        $item.on("click", function(event) {
          if (event.preventDefault(), "Autoattack" === name && !settings.checkPremium("captain")) {
            return HumanMessage.error(Game.premium_data.captain.name + " " + DM.getl10n("premium").advisors.not_activated.toLowerCase() + "."), false;
          }
          if (true === self.modules[name].isOn) {
            /** @type {boolean} */
            self.modules[name].isOn = false;
            $item.removeClass("on");
            $item.find("span").mousePopup(new MousePopup("Start " + name));
            HumanMessage.success(name + " is deactivated.");
            data.Log(name + " is deactivated.", 0);
            if ("Autofarm" === name) {
              that.stop();
            } else {
              if ("Autoculture" === name) {
                options.stop();
              } else {
                if ("Autobuild" === name) {
                  result.stop();
                } else {
                  if ("Autoattack" === name) {
                    handler.stop();
                  }
                }
              }
            }
          } else {
            if (false === self.modules[name].isOn) {
              $item.addClass("on");
              HumanMessage.success(name + " is activated.");
              data.Log(name + " is activated.", 0);
              $item.find("span").mousePopup(new MousePopup("Stop " + name));
              /** @type {boolean} */
              self.modules[name].isOn = true;
              if ("Autoattack" === name) {
                handler.start();
              }
            }
          }
          if ("Autoattack" !== name) {
            self.checkWhatToStart();
          }
        });
        $item.find("span").mousePopup(new MousePopup("Start " + name));
      }
    }, {
      key : "checkWhatToStart",
      value : function() {
        /** @type {number} */
        var _0x335074 = 0;
        $.each(self.modules, function(canCreateDiscussions, me) {
          if (me.isOn && "Autoattack" !== me) {
            _0x335074++;
          }
        });
        if (0 === _0x335074) {
          self.stop();
        } else {
          if (_0x335074 >= 0 && !self.Queue.isRunning()) {
            clearInterval(self.interval);
            self.start();
          }
        }
      }
    }, {
      key : "loadPlayerTowns",
      value : function() {
        /** @type {number} */
        var i = 0;
        $.each(ITowns.towns, function(canCreateDiscussions, result) {
          var cmd = new self.models.Town;
          cmd.key = i;
          cmd.id = result.id;
          cmd.name = result.name;
          $.each(ITowns.towns, function(canCreateDiscussions, row) {
            if (result.getIslandCoordinateX() === row.getIslandCoordinateX() && result.getIslandCoordinateY() === row.getIslandCoordinateY() && result.id !== row.id) {
              cmd.relatedTowns.push(row.id);
            }
          });
          self.playerTowns.push(cmd);
          i++;
        });
        self.playerTowns.sort(function(a, val) {
          var x = a.name;
          var y = val.name;
          return x === y ? 0 : x > y ? 1 : -1;
        });
      }
    }, {
      key : "callbackAuth",
      value : function(data) {
        /** @type {boolean} */
        settings.isLogged = true;
        settings.trial_time = data.trial_time;
        settings.premium_time = data.premium_time;
        settings.facebook_like = data.facebook_like;
        if ("" !== data.assistant_settings) {
          context.setSettings(data.assistant_settings);
        }
        if (true || settings.trial_time - Timestamp.now() >= 0 || settings.premium_time - Timestamp.now() >= 0) {
          /** @type {boolean} */
          self.hasPremium = true;
          self.init();
          that.init();
          that.setSettings(data.autofarm_settings);
          options.init();
          options.setSettings(data.autoculture_settings);
          result.init();
          result.setSettings(data.autobuild_settings);
          result.setQueue(data.building_queue, data.units_queue, data.ships_queue);
          handler.init();
          self.checkAutostart();
        } else {
          /** @type {boolean} */
          self.hasPremium = false;
          self.init();
          that.init();
          $("#Autoculture_onoff").mousePopup(new MousePopup(self.requiredPrem));
          $("#Autobuild_onoff").mousePopup(new MousePopup(self.requiredPrem));
          $("#Autoattack_onoff").mousePopup(new MousePopup(self.requiredPrem));
          settings.createNotification("getPremiumNotification", "Unfortunately your premium membership is over. Please upgrade now!");
        }
      }
    },{
      key : "models",
      value : {
        Town : function() {
          /** @type {null} */
          this.key = null;
          /** @type {null} */
          this.id = null;
          /** @type {null} */
          this.name = null;
          this.farmTowns = {};
          /** @type {!Array} */
          this.relatedTowns = [];
          /** @type {number} */
          this.currentFarmCount = 0;
          this.modules = {
            Autofarm : {
              isReadyTime : 0
            },
            Autoculture : {
              isReadyTime : 0
            },
            Autobuild : {
              isReadyTime : 0
            }
          };
          /**
           * @return {undefined}
           */
          this.startFarming = function() {
            that.startFarming(this);
          };
          /**
           * @return {undefined}
           */
          this.startCulture = function() {
            options.startCulture(this);
          };
          /**
           * @return {undefined}
           */
          this.startBuild = function() {
            result.startBuild(this);
          };
        }
      }
    },{
      key : "Queue",
      value : {
        total : 0,
        queue : [],
        add : function(queueItem) {
          this.total++;
          this.queue.push(queueItem);
        },
        start : function() {
          this.next();
        },
        stop : function() {
          /** @type {!Array} */
          this.queue = [];
        },
        isRunning : function() {
          return this.queue.length > 0 || this.total > 0;
        },
        next : function() {
          me.updateTimer();
          var Effects = this.queue.shift();
          if (Effects) {
            Effects.fx();
          } else {
            if (this.queue.length <= 0) {
              /** @type {number} */
              this.total = 0;
              me.finished();
            }
          }
        }
      }
    },{
      key : "currentTown",
      value : null
    },{
      key : "playerTowns",
      value : []
    },{
      key : "interval",
      value : false
    },{
      key : "hasPremium",
      value : false
    },{
      key : "modules",
      value : {
        Autofarm : {
          isOn : false
        },
        Autoculture : {
          isOn : false
        },
        Autobuild : {
          isOn : false
        },
        Autoattack : {
          isOn : false
        }
      }
    },{
      key : "requiredPrem",
      value : DM.getl10n("tooltips").requirements.replace(".", "") + " premium"
    }], (value = null) && list_to_object(o.prototype, value), to && list_to_object(o, to), self;
  }();
  
  var $scope = me;
  var self = function() {
    /**
     * @return {undefined}
     */
    function self() {
      !function(matrix, $) {
        if (!(matrix instanceof $)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, self);
      Object.defineProperty(this, "trial_time", {
        enumerable : true,
        writable : true,
        value : 0
      });
      Object.defineProperty(this, "premium_time", {
        enumerable : true,
        writable : true,
        value : 0
      });
      Object.defineProperty(this, "facebook_like", {
        enumerable : true,
        writable : true,
        value : 0
      });
      Object.defineProperty(this, "toolbox_element", {
        enumerable : true,
        writable : true,
        value : null
      });
    }
    var obj;
    var cb;
    var ret;
    return obj = self, ret = [{
      key : "init",
      value : function() {
        data.Log("Initialize Autobot", 0);
        self.authenticate();
        self.obServer();
        self.isActive();
        self.setToolbox();
        self.initAjax();
        self.initMapTownFeature();
        self.fixMessage();
        context.init();
      }
    }, {
      key : "setToolbox",
      value : function() {
        self.toolbox_element = $(".nui_bot_toolbox");
      }
    }, {
      key : "authenticate",
      value : function() {
        api_object.Auth("login", self.Account, $scope.callbackAuth);
      }
    }, {
      key : "obServer",
      value : function() {
        $.Observer(GameEvents.notification.push).subscribe("GRCRTNotification", function() {
          $("#notification_area>.notification.getPremiumNotification").on("click", function() {
            self.getPremium();
          });
        });
      }
    }, {
      key : "initWnd",
      value : function() {
        if (self.isLogged) {
          if (void 0 !== self.botWnd) {
            try {
              self.botWnd.close();
            } catch (_0x481090) {
            }
            self.botWnd = void 0;
          }
          if (void 0 !== self.botPremWnd) {
            try {
              self.botPremWnd.close();
            } catch (_0x2df9e8) {
            }
            self.botPremWnd = void 0;
          }
          self.botWnd = Layout.dialogWindow.open("", self.title + ' v<span style="font-size: 10px;">' + self.version + "</span>", 500, 350, "", false);
          self.botWnd.setHeight([350]);
          self.botWnd.setPosition(["center", "center"]);
          var $jRate = self.botWnd.getJQElement();
          $jRate.append($("<div/>", {
            class : "menu_wrapper",
            style : "left: 78px; right: 14px"
          }).append($("<ul/>", {
            class : "menu_inner"
          }).prepend(self.addMenuItem("AUTHORIZE", "Account", "Account")).prepend(self.addMenuItem("CONSOLE", "Assistant", "Assistant")).prepend(self.addMenuItem("ASSISTANT", "Console", "Console")).prepend(self.addMenuItem("SUPPORT", "Support", "Support"))));
          $jRate.find(".menu_inner li:last-child").before(self.addMenuItem("ATTACKMODULE", "Attack", "Autoattack"));
          $jRate.find(".menu_inner li:last-child").before(self.addMenuItem("CONSTRUCTMODULE", "Build", "Autobuild"));
          $jRate.find(".menu_inner li:last-child").before(self.addMenuItem("CULTUREMODULE", "Culture", "Autoculture"));
          $jRate.find(".menu_inner li:last-child").before(self.addMenuItem("FARMMODULE", "Farm", "Autofarm"));
          $("#Autobot-AUTHORIZE").click();
        }
      }
    }, {
      key : "addMenuItem",
      value : function(commit, result, value, optionalKeyToIdentifyItem) {
        return $("<li/>").append($("<a/>", {
          class : "submenu_link",
          href : "#",
          id : "Autobot-" + commit,
          rel : value
        }).click(function() {
          if (optionalKeyToIdentifyItem) {
            return false;
          }
          if (self.botWnd.getJQElement().find("li a.submenu_link").removeClass("active"), $(this).addClass("active"), self.botWnd.setContent2(self.getContent($(this).attr("rel"))), "Console" === $(this).attr("rel")) {
            var $htmlBody = $(".terminal");
            var roundedTop = $(".terminal-output")[0].scrollHeight;
            $htmlBody.scrollTop(roundedTop);
          }
        }).append(function() {
          return "Support" !== value ? $("<span/>", {
            class : "left"
          }).append($("<span/>", {
            class : "right"
          }).append($("<span/>", {
            class : "middle"
          }).html(result))) : '<a id="help-button" onclick="return false;" class="confirm"></a>';
        }));
      }
    }, {
      key : "getContent",
      value : function(recB) {
        return "Console" === recB ? data.contentConsole() : "Account" === recB ? self.contentAccount() : "Support" === recB ? self.contentSupport() : "Autofarm" === recB ? that.contentSettings() : "Autobuild" === recB ? result.contentSettings() : "Autoattack" === recB ? handler.contentSettings() : "Autoculture" === recB ? options.contentSettings() : "Assistant" === recB ? context.contentSettings() : void 0;
      }
    }, {
      key : "contentAccount",
      value : function() {
        var fields_to_add = {
          "Name:" : Game.player_name,
          "World:" : Game.world_id,
          "Rank:" : Game.player_rank,
          "Towns:" : Game.player_villages,
          "Language:" : Game.locale_lang
        };
        var item = $("<table/>", {
          class : "game_table layout_main_sprite",
          cellspacing : "0",
          width : "100%"
        }).append(function() {
          /** @type {number} */
          var _0xa38a24 = 0;
          var top_vals_el = $("<tbody/>");
          return $.each(fields_to_add, function(newTabContent, pricingTemplate) {
            top_vals_el.append($("<tr/>", {
              class : _0xa38a24 % 2 ? "game_table_even" : "game_table_odd"
            }).append($("<td/>", {
              style : "background-color: #DFCCA6;width: 30%;"
            }).html(newTabContent)).append($("<td/>").html(pricingTemplate)));
            _0xa38a24++;
          }), top_vals_el.append($("<tr/>", {
            class : "game_table_even"
          }).append($("<td/>", {
            style : "background-color: #DFCCA6;width: 30%;"
          }).html("Premium:")).append($("<td/>").append(self.premium_time - Timestamp.now() >= 0 ? self.secondsToTime(self.premium_time - Timestamp.now()) : "No premium").append($("<div/>", {
            id : "premium-bot"
          }).append($("<div/>", {
            class : "js-caption"
          }).html(self.premium_time - Timestamp.now() >= 0 ? "Add days" : "Get Premium")).on("click", function() {
            return self.getPremium();
          })))), top_vals_el.append($("<tr/>", {
            class : "game_table_odd"
          }).append($("<td/>", {
            style : "background-color: #DFCCA6;width: 30%;"
          }).html("Trial:")).append($("<td/>").append(function() {
            return self.trial_time - Timestamp.now() >= 0 ? self.secondsToTime(self.trial_time - Timestamp.now()) : "Trial is over";
          }).append(function() {
            return 0 === self.facebook_like ? $("<a/>", {
              id : "get_7days"
            }).html("Get 3 free days!").click("on", function() {
              return self.botFacebookWnd();
            }) : null;
          }))), top_vals_el;
        });
        return items.gameWrapper("Account", "account_property_wrapper", item, "margin-bottom:9px;").append($("<div/>", {
          id : "grepobanner",
          style : ""
        }));
      }
    }, {
      key : "contentSupport",
      value : function() {
        return $("<fieldset/>", {
          id : "Support_tab",
          style : "float:left; width:472px;height: 270px;"
        }).append($("<legend/>").html("Grepobot Support")).append($("<div/>", {
          style : "float: left;"
        }).append(items.selectBox({
          id : "support_type",
          name : "support_type",
          label : "Type: ",
          styles : "width: 167px;margin-left: 18px;",
          value : "Bug report",
          options : [{
            value : "Bug report",
            name : "Bug report"
          }, {
            value : "Feature request",
            name : "Feature request"
          }, {
            value : "Financial",
            name : "Financial"
          }, {
            value : "Other",
            name : "Other"
          }]
        })).append(items.input({
          id : "support_input_email",
          name : "Email",
          style : "margin-left: 12px;width: 166px;",
          value : "",
          type : "email"
        })).append(items.input({
          id : "support_input_subject",
          name : "Subject",
          style : "margin-top: 0;width: 166px;",
          value : "",
          type : "text"
        })).append(items.textarea({
          id : "support_textarea",
          name : "Message",
          value : ""
        })).append(items.button({
          name : "Send",
          style : "margin-top: 0;"
        }).on("click", function() {
          var opts = $("#Support_tab").serializeObject();
          /** @type {boolean} */
          var fsmError = false;
          if (void 0 === opts.support_input_email || "" === opts.support_input_email) {
            /** @type {string} */
            fsmError = "Please enter your email.";
          } else {
            if (void 0 === opts.support_input_subject || "" === opts.support_input_subject) {
              /** @type {string} */
              fsmError = "Please enter a subject.";
            } else {
              if (void 0 === opts.support_textarea || "" === opts.support_textarea) {
                /** @type {string} */
                fsmError = "Please enter a message.";
              } else {
                if (!(void 0 === opts.support_input_email || /^([a-zA-Z0-9api_object.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(opts.support_input_email))) {
                  /** @type {string} */
                  fsmError = "Your email is not valid!";
                }
              }
            }
          }
          if (fsmError) {
            HumanMessage.error(fsmError);
          } else {
            api_object.Auth("supportEmail", $.extend({
              csrfToken : self.Account.csrfToken,
              player_name : self.Account.player_name,
              player_id : self.Account.player_id,
              world_id : self.Account.world_id
            }, opts), function(SMessage) {
              if (SMessage.success) {
                if (void 0 !== self.botWnd) {
                  try {
                    self.botWnd.close();
                  } catch (_0xfee7fb) {
                  }
                  self.botWnd = void 0;
                }
                HumanMessage.success("Thank you, your email has been send!");
              }
            });
          }
        }))).append($("<div/>", {
          style : "float: right; width: 215px;"
        }).append($("<a/>", {
          id : "Facebook_grepobot",
          target : "_blank",
          href : "https://www.facebook.com/BotForGrepolis/"
        }).html('<img src="https://bot.grepobot.com/images/facebook_page.png" title="Facebook Grepobot"/>')));
      }
    }, {
      key : "checkAlliance",
      value : function() {
        if (!$(".allianceforum.main_menu_item").hasClass("disabled")) {
          api_object.members_show(function(res) {
            if (void 0 !== res.plain.html) {
              $.each($(res.plain.html).find("#ally_members_body .ally_name a"), function() {
                /** @type {string} */
                var plainText = atob($(this).attr("href"));
                console.log(JSON.parse(plainText.substr(0, plainText.length - 3)));
              });
            }
          });
        }
      }
    }, {
      key : "fixMessage",
      value : function() {
        var oldSetupComputes;
        /** @type {function(): undefined} */
        HumanMessage._initialize = (oldSetupComputes = HumanMessage._initialize, function() {
          oldSetupComputes.apply(this, arguments);
          $(window).unbind("click");
        });
      }
    }, {
      key : "getPremium",
      value : function() {
        var foreignControls = this;
        if (self.isLogged) {
          if ($.Observer(GameEvents.menu.click).publish({
            option_id : "premium"
          }), void 0 !== self.botPremWnd) {
            try {
              self.botPremWnd.close();
            } catch (_0x7923ce) {
            }
            self.botPremWnd = void 0;
          }
          if (void 0 !== self.botWnd) {
            try {
              self.botWnd.close();
            } catch (_0x20b49d) {
            }
            self.botWnd = void 0;
          }
          self.botPremWnd = Layout.dialogWindow.open("", "Autobot v" + self.version + " - Premium", 500, 350, "", false);
          self.botPremWnd.setHeight([350]);
          self.botPremWnd.setPosition(["center", "center"]);
          var artistTrack = $("<div/>", {
            id : "payment"
          }).append($("<div/>", {
            id : "left"
          }).append($("<ul/>", {
            id : "time_options"
          }).append($("<li/>", {
            class : "active"
          }).append($("<span/>", {
            class : "amount"
          }).html("1 Month")).append($("<span/>", {
            class : "price"
          }).html("\u20ac&nbsp;4,99"))).append($("<li/>").append($("<span/>", {
            class : "amount"
          }).html("2 Month")).append($("<span/>", {
            class : "price"
          }).html("\u20ac&nbsp;9,99")).append($("<div/>", {
            class : "referenceAmount"
          }).append($("<div/>", {
            class : "reference",
            style : "transform: rotate(17deg);"
          }).html("+12 Days&nbsp;")))).append($("<li/>").append($("<span/>", {
            class : "amount"
          }).html("4 Months")).append($("<span/>", {
            class : "price"
          }).html("\u20ac&nbsp;19,99")).append($("<div/>", {
            class : "referenceAmount"
          }).append($("<div/>", {
            class : "reference",
            style : "transform: rotate(17deg);"
          }).html("+36 Days&nbsp;")))).append($("<li/>").append($("<span/>", {
            class : "amount"
          }).html("10 Months")).append($("<span/>", {
            class : "price"
          }).html("\u20ac&nbsp;49,99")).append($("<div/>", {
            class : "referenceAmount"
          }).append($("<div/>", {
            class : "reference",
            style : "transform: rotate(17deg);"
          }).html("+120 Days&nbsp;")))))).append($("<div/>", {
            id : "right"
          }).append($("<div/>", {
            id : "pothead"
          })).append($("<div/>", {
            id : "information"
          })));
          self.botPremWnd.setContent2(artistTrack);
          $("#time_options li").on("click", function() {
            $("#time_options li").removeClass("active");
            $(this).addClass("active");
          });
          api_object.PaymentOptions(function(reverseControl) {
            foreignControls.makeSelectbox(reverseControl);
          });
        }
      }
    }, {
      key : "makeSelectbox",
      value : function(selected) {
        var items = {};
        var element = $("<select/>", {
          id : "paymentSelect"
        }).append(function() {
          /** @type {!Array} */
          var result = [];
          /** @type {number} */
          var i = 0;
          for (; i < selected.length; i++) {
            var item = selected[i];
            items[item.id] = {
              small : item.image.size1x,
              big : item.image.size2x
            };
            result.push($("<option/>", {
              value : item.id
            }).html(item.description.replace("Button", "")));
          }
          return result;
        });
        $("#payment #information").append(element);
        var $this = element;
        var readersLength = element.children("option").length;
        element.addClass("s-hidden");
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="styledSelect"></div>');
        var elem = $this.next("div.styledSelect");
        elem.text($this.children("option").eq(0).text());
        $("#payment #information").append(function() {
          var i = $this.children("option").eq(0).val();
          return $("<div/>", {
            id : "payment-button",
            style : "background-image: url('".concat(items[i].big, "')")
          }).on("click", function() {
            return self.doPayment($("#time_options").children(".active").index() + 1, i);
          });
        });
        var $list = $("<ul />", {
          class : "options"
        }).insertAfter(elem);
        /** @type {number} */
        var r = 0;
        for (; r < readersLength; r++) {
          var i = $this.children("option").eq(r).val();
          $("<li />", {
            text : $this.children("option").eq(r).text(),
            rel : i
          }).append($("<div/>", {
            class : "payment-option",
            style : "background-image: url('".concat(items[i].small, "')")
          })).appendTo($list);
        }
        var imgchk = $list.children("li");
        elem.click(function(event) {
          event.stopPropagation();
          $("div.styledSelect.active").each(function() {
            $(this).removeClass("active").next("ul.options").hide();
          });
          $(this).toggleClass("active").next("ul.options").toggle();
        });
        imgchk.click(function(event) {
          var customPlayerControls = this;
          event.stopPropagation();
          $("#payment-button").remove();
          elem.text($(this).text()).removeClass("active");
          $("#payment #information").append($("<div/>", {
            id : "payment-button",
            style : "background-image: url('".concat(items[$(this).attr("rel")].big, "')")
          }).on("click", function() {
            return self.doPayment($("#time_options").children(".active").index() + 1, $(customPlayerControls).attr("rel"));
          }));
          $this.val($(this).attr("rel"));
          $list.hide();
        });
        $(document).click(function() {
          elem.removeClass("active");
          $list.hide();
        });
      }
    }, {
      key : "doPayment",
      value : function(variableId, value) {
        window.open(self.domain + "payment?option=" + variableId + "&method=" + value + "&player_id=" + self.Account.player_id, "grepolis_payment", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,height=650,width=800");
      }
    }, {
      key : "botFacebookWnd",
      value : function() {
        if (self.isLogged && 0 === self.facebook_like) {
          if (void 0 !== self.facebookWnd) {
            try {
              self.facebookWnd.close();
            } catch (_0x4b7c28) {
            }
            self.facebookWnd = void 0;
          }
          self.facebookWnd = Layout.dialogWindow.open("", "Autobot v" + self.version + " - Get 3 days free!", 275, 125, "", false);
          self.facebookWnd.setHeight([125]);
          self.facebookWnd.setPosition(["center", "center"]);
          var artistTrack = $("<div/>", {
            id : "facebook_wnd"
          }).append('<span class="like-share-text">Like & share and get <b>3 days</b> free premium.</span><a href="#" class="fb-share"><span class="fb-text">Share</spanclass></a><div class="fb_like"><div class="fb-like" data-href="https://www.facebook.com/BotForGrepolis/" data-layout="button" data-action="like" data-show-faces="false" data-share="false"></div></div>');
          self.facebookWnd.setContent2(artistTrack);
          $(".ui-dialog #facebook_wnd").closest(".gpwindow_content").css({
            left : "-9px",
            right : "-9px",
            top : "35px"
          });
          /** @type {boolean} */
          var excludeSynced = false;
          /** @type {boolean} */
          var excludeNotSynced = false;
          /**
           * @return {undefined}
           */
          var func = function() {
            if ((excludeSynced || excludeNotSynced) && self.upgrade3Days(), excludeSynced && excludeNotSynced) {
              if ($.Observer(GameEvents.window.quest.open).publish({
                quest_type : "hermes"
              }), HumanMessage.success("You have received 3 days premium! Thank you for sharing."), void 0 !== self.facebookWnd) {
                try {
                  self.facebookWnd.close();
                } catch (_0x21e7fb) {
                }
                self.facebookWnd = void 0;
              }
              if (void 0 !== self.botWnd) {
                try {
                  self.botWnd.close();
                } catch (_0x40a9d3) {
                }
                self.botWnd = void 0;
              }
            }
          };
          if (void 0 === window.fbAsyncInit) {
            /**
             * @return {undefined}
             */
            window.fbAsyncInit = function() {
              FB.init({
                appId : "1505555803075328",
                xfbml : true,
                version : "v2.4"
              });
              FB.Event.subscribe("edge.create", function() {
                /** @type {boolean} */
                excludeNotSynced = true;
                func();
              });
              FB.Event.subscribe("edge.remove", function() {
                /** @type {boolean} */
                excludeNotSynced = false;
              });
            };
          }
          if ($("#facebook-jssdk").length <= 0) {
            /** @type {!HTMLDocument} */
            doc = document;
            /** @type {string} */
            tag = "script";
            /** @type {string} */
            id = "facebook-jssdk";
            /** @type {!Element} */
            wafCss = doc.getElementsByTagName(tag)[0];
            if (!doc.getElementById(id)) {
              /** @type {string} */
              (el = doc.createElement(tag)).id = id;
              /** @type {string} */
              el.src = "//connect.facebook.net/en_US/sdk.js";
              wafCss.parentNode.insertBefore(el, wafCss);
            }
          } else {
            FB.XFBML.parse();
          }
          $("#facebook_wnd .fb-share").on("click", function() {
            FB.ui({
              method : "share",
              href : "https://www.facebook.com/BotForGrepolis/"
            }, function(result) {
              if (result && !result.error_code) {
                /** @type {boolean} */
                excludeSynced = true;
                func();
              }
            });
          });
        }
        var doc;
        var tag;
        var id;
        var el;
        var wafCss;
      }
    }, {
      key : "upgrade3Days",
      value : function() {
        api_object.Auth("upgrade3Days", self.Account, function(SMessage) {
          if (SMessage.success) {
            api_object.Auth("login", self.Account, $scope.callbackAuth);
          }
        });
      }
    }, {
      key : "initAjax",
      value : function() {
        $(document).ajaxComplete(function(canCreateDiscussions, request, lbit) {
          if (-1 === lbit.url.indexOf(self.domain) && -1 !== lbit.url.indexOf("/game/") && 4 === request.readyState && 200 === request.status) {
            var tableMatches = lbit.url.split("?");
            var call = tableMatches[0].substr(6) + "/" + tableMatches[1].split("&")[1].substr(7);
            if (void 0 !== result) {
              result.calls(call);
            }
            if (void 0 !== handler) {
              handler.calls(call, request.responseText);
            }
          }
        });
      }
    }, {
      key : "randomize",
      value : function(error, value) {
        return Math.floor(Math.random() * (value - error + 1)) + error;
      }
    }, {
      key : "secondsToTime",
      value : function(resumeTime) {
        /** @type {number} */
        var weeks = Math.floor(resumeTime / 86400);
        /** @type {number} */
        var days = Math.floor(resumeTime % 86400 / 3600);
        /** @type {number} */
        var inPropertyPath = Math.floor(resumeTime % 86400 % 3600 / 60);
        return (weeks ? weeks + " days " : "") + (days ? days + " hours " : "") + (inPropertyPath ? inPropertyPath + " minutes " : "");
      }
    }, {
      key : "timeToSeconds",
      value : function(checkText) {
        var deadPool = checkText.split(":");
        /** @type {number} */
        var k = 0;
        /** @type {number} */
        var i = 1;
        for (; deadPool.length > 0;) {
          /** @type {number} */
          k = k + i * parseInt(deadPool.pop(), 10);
          /** @type {number} */
          i = i * 60;
        }
        return k;
      }
    }, {
      key : "arrowActivated",
      value : function() {
        var focusOverlay = $("<div/>", {
          class : "helpers helper_arrow group_quest d_w animate bounce",
          "data-direction" : "w",
          style : "top: 0; left: 360px; visibility: visible; display: none;"
        });
        self.toolbox_element.append(focusOverlay);
        focusOverlay.show().animate({
          left : "138px"
        }, "slow").delay(1e4).fadeOut("normal");
        setTimeout(function() {
          self.botFacebookWnd();
        }, 25e3);
      }
    }, {
      key : "createNotification",
      value : function(id, att_id) {
        (void 0 === Layout.notify ? new NotificationHandler : Layout).notify($("#notification_area>.notification").length + 1, id, "<span><b>Autobot</b></span>" + att_id + "<span class='small notification_date'>Version " + self.version + "</span>");
      }
    }, {
      key : "toHHMMSS",
      value : function(index) {
        /** @type {number} */
        var length = ~~(index / 3600);
        /** @type {number} */
        var curHour = ~~(index % 3600 / 60);
        /** @type {number} */
        var c = index % 60;
        /** @type {string} */
        var result = "";
        return length > 0 && (result = result + (length + ":" + (curHour < 10 ? "0" : ""))), result = result + (curHour + ":" + (c < 10 ? "0" : "")), result = result + ("" + c);
      }
    }, {
      key : "stringify",
      value : function(obj) {
        var t = fn(obj);
        if ("string" === t) {
          return '"' + obj + '"';
        }
        if ("boolean" === t || "number" === t) {
          return obj;
        }
        if ("function" === t) {
          return obj.toString();
        }
        /** @type {!Array} */
        var drilldownLevelLabels = [];
        var i;
        for (i in obj) {
          drilldownLevelLabels.push('"' + i + '":' + this.stringify(obj[i]));
        }
        return "{" + drilldownLevelLabels.join(",") + "}";
      }
    }, {
      key : "isActive",
      value : function() {
        setTimeout(function() {
          api_object.Auth("isActive", self.Account, self.isActive);
        }, 6e4);
      }
    }, {
      key : "town_map_info",
      value : function(columns, data) {
        if (void 0 !== columns && columns.length > 0 && data.player_name) {
          /** @type {number} */
          var i = 0;
          for (; i < columns.length; i++) {
            if ("flag town" === columns[i].className) {
              if (void 0 !== context) {
                if (context.settings.town_names) {
                  $(columns[i]).addClass("active_town");
                }
                if (context.settings.player_name) {
                  $(columns[i]).addClass("active_player");
                }
                if (context.settings.alliance_name) {
                  $(columns[i]).addClass("active_alliance");
                }
              }
              $(columns[i]).append('<div class="player_name">' + (data.player_name || "") + "</div>");
              $(columns[i]).append('<div class="town_name">' + data.name + "</div>");
              $(columns[i]).append('<div class="alliance_name">' + (data.alliance_name || "") + "</div>");
              break;
            }
          }
        }
        return columns;
      }
    }, {
      key : "checkPremium",
      value : function(prefix) {
        return $(".advisor_frame." + prefix + " div").hasClass(prefix + "_active");
      }
    }, {
      key : "initWindow",
      value : function() {
        $(".nui_main_menu").css("top", "249px");
        $("<div/>", {
          class : "nui_bot_toolbox"
        }).append($("<div/>", {
          class : "bot_menu layout_main_sprite"
        }).append($("<ul/>").append($("<li/>", {
          id : "Autofarm_onoff",
          class : "disabled"
        }).append($("<span/>", {
          class : "autofarm farm_town_status_0"
        }))).append($("<li/>", {
          id : "Autoculture_onoff",
          class : "disabled"
        }).append($("<span/>", {
          class : "autoculture farm_town_status_0"
        }))).append($("<li/>", {
          id : "Autobuild_onoff",
          class : "disabled"
        }).append($("<span/>", {
          class : "autobuild toolbar_activities_recruits"
        }))).append($("<li/>", {
          id : "Autoattack_onoff",
          class : "disabled"
        }).append($("<span/>", {
          class : "autoattack sword_icon"
        }))).append($("<li/>").append($("<span/>", {
          href : "#",
          class : "botsettings circle_button_settings"
        }).on("click", function() {
          if (self.isLogged) {
            self.initWnd();
          }
        }).mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.settings)))))).append($("<div/>", {
          id : "time_autobot",
          class : "time_row"
        })).append($("<div/>", {
          class : "bottom"
        })).insertAfter(".nui_left_box");
      }
    }, {
      key : "initMapTownFeature",
      value : function() {
        var oldSetupComputes;
        /** @type {function(): ?} */
        MapTiles.createTownDiv = (oldSetupComputes = MapTiles.createTownDiv, function() {
          var preinit = oldSetupComputes.apply(this, arguments);
          return self.town_map_info(preinit, arguments[0]);
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
    }], (cb = null) &&  list_to_object(obj.prototype, cb), ret &&  list_to_object(obj, ret), self;
  }();
  (function() {

    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      return $.each(a, function() {
        if (void 0 !== o[this.name]) {
          if (!o[this.name].push) {
            /** @type {!Array} */
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || "");
        } else {
          o[this.name] = this.value || "";
        }
      }), o;
    };
    /** @type {number} */
    var chat_retry = setInterval(function() {
      if (void 0 !== window.$ && $(".nui_main_menu").length && !$.isEmptyObject(ITowns.towns)) {
        clearInterval(chat_retry);
        self.initWindow();
        self.initMapTownFeature();
        self.init();
      }
    }, 100);
  })();
  var settings = res.default = self;
}]);
