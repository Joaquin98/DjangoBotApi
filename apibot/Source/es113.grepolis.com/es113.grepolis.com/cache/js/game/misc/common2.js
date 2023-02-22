/* global JSON, GPWindowMgr, GameData, alert, $, Timestamp, addslashes, Game, buildLink */

(function() {
    "use strict";

    var hCommon = {
        getUnitCountClass: function(amount) {
            return amount / 10000 >= 1 ? 'five_digit_number' : (amount / 1000 >= 1 ? 'four_digit_number' : '');
        },

        /**
         * Returns clean copy of object
         *
         * @param {Object} obj
         *
         * @return {Object}
         */
        getCleanCopy: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        /**
         * Allows to switch tab in window. Function does it only if window is opened
         *
         * @param {Number} window_type   Window type @see gpwindowmgr.js line 37, example:
         *								 GPWindowMgr.TYPE_TOWN_OVERVIEWS
         * @param {String} controller    Name of the controller which will have to be called
         * @param {String} action        Name of the action which will have to be called
         * @param {Object} params        Additional params for HTTP request
         * @param {String} method        HTTP method type used for request
         * @param {Function} callback    Function which will be called in the end
         */
        switchTab: function(window_type, controller, action, params, method, callback) {
            var wnd = GPWindowMgr.getOpenFirst(window_type);

            callback = callback || function() {};
            method = this.firstToUpperCase(method.toLowerCase());

            //Window is not created, there is nothing to switch
            if (!wnd) {
                return;
            }

            wnd['requestContent' + method](controller, action, params, callback, true);
        },

        /**
         * Allows to open a window.
         *
         * @param {Number} window_type      Window type @see gpwindowmgr.js line 37, example:
         *								    GPWindowMgr.TYPE_TOWN_OVERVIEWS
         * @param {String} window_title     Title which will be shown on the top of the window
         * @param {Object} window_options   options which are used for window initialization
         * @param {String} controller       Name of the controller which will have to be called
         * @param {String} action           Name of the action which will have to be called
         * @param {Object} params           Additional params for HTTP request
         * @param {String} method           HTTP method type used for request
         * @param {Function} callback       Function which will be called in the end
         * @return {Object}   GPWindow Object
         */
        openWindow: function(window_type, window_title, window_options, controller, action, params, method, callback) {
            var wnd = GPWindowMgr.getOpenFirst(window_type);

            if (!wnd) {
                wnd = GPWindowMgr.Create(window_type, window_title, window_options);
            }

            if (controller && action && method) {
                wnd['requestContent' + this.firstToUpperCase(method.toLowerCase())](controller, action, params, callback, true);
            }

            return wnd;
        },

        firstToUpperCase: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        /**
         * @deprecated
         */
        calculateCapacity: function(units, researches) {

            var gd_units = GameData.units,
                gd_unit;

            var unit_name, unit_number,
                total_capacity = 0,
                total_population = 0,
                berth = researches.berth || 0,
                big_transporter_capacity = gd_units.big_transporter.capacity,
                small_transporter_capacity = gd_units.small_transporter.capacity;

            //Calculate capacity of selected transport ships and total population
            //of selected units
            for (unit_name in units) {
                if (units.hasOwnProperty(unit_name)) {
                    unit_number = units[unit_name].getValue();
                    gd_unit = gd_units[unit_name];

                    //Do something only if number of units is bigger than 0, and
                    //if unit doesn't fly, because only that unit can take some place
                    if (unit_number > 0 && !gd_unit.flying) {
                        if (gd_unit.is_naval) {
                            total_capacity += gd_unit.capacity > 0 ? (gd_unit.capacity + berth) * unit_number : 0;
                        } else {
                            total_population += gd_unit.population * unit_number;
                        }
                    }
                }
            }

            return {
                total_capacity: total_capacity,
                total_population: total_population,
                slow_boats_needed: Math.ceil(total_population / (big_transporter_capacity + berth)),
                fast_boats_needed: Math.ceil(total_population / (small_transporter_capacity + berth))
            };
        },

        /**
         * Original function taken from:
         *
         * Javeline Platform (GNU Lesser General Public License - free to use and modif.)
         *
         * @author	Ruben Daniels ruben@javeline.nl
         * @changes Łukasz Lipiński
         * @version	1.0
         */
        vardump: function(obj, depth, recur) {
            var str, prop;

            if (!obj) {
                return obj;
            }

            if (!depth) {
                depth = 0;
            }

            switch (typeof obj) {
                case "string":
                    return "\"" + obj + "\"";
                case "number":
                    return obj;
                case "boolean":
                    return obj ? "true" : "false";
                case "date":
                    return "Date[" + new Date() + "]";
                case "array":
                    var i;

                    str = "{\n";

                    for (i = 0; i < obj.length; i++) {
                        str += "     ".repeat(depth + 1) + i + " => " + (!recur && depth > 0 ? typeof obj[i] : hCommon.vardump(obj[i], depth + 1, !recur)) + "\n";
                    }

                    str += "     ".repeat(depth) + "}";

                    return str;
                default:
                    if (typeof obj === "function") {
                        return "function";
                    }

                    if (obj.xml || obj.serialize) {
                        return depth === 0 ?
                            "[ " + (obj.xml || obj.serialize()) + " ]" :
                            "XML Element";
                    }

                    if (!recur && depth > 3) {
                        return "object";
                    }

                    str = obj.length ? "[\n" : "{\n";

                    for (prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            try {
                                str += "     ".repeat(depth + 1) + prop + " => " + (!recur && depth > 3 ?
                                    typeof obj[prop] :
                                    hCommon.vardump(obj[prop], depth + 1, !recur)) + "\n";
                            } catch (e) {
                                str += "     ".repeat(depth + 1) + prop + " => [ERROR]\n";
                            }
                        }
                    }
                    str += "     ".repeat(depth) + (obj.length ? "]" : "}");

                    return str;
            }
        },

        alert_r: function(obj, recur) {

            alert(hCommon.vardump(obj, null, !recur));
        },

        searchForPosition: function(obj, prop, val) {

            var i, l = obj.length,
                el;

            for (i = 0; i < l; i++) {
                el = obj[i];

                if (el[prop] === val) {
                    return i;
                }
            }

            return -1;
        },

        fillLeadingZero: function(number) {

            return number < 10 ? '0' + number : number;
        },

        /**
         * Displays time interval in this way:
         *
         * 17.-23.07 or
         * 17.07.-12.08
         */
        printTimeInterval: function(timestamp_start, timestamp_stop) {
            var fillLeadingZero = this.fillLeadingZero;

            var start = new Date(Timestamp.shiftUnixTimestampByTimezoneOffset(timestamp_start, 'player_timezone') * 1E3),
                stop = new Date(Timestamp.shiftUnixTimestampByTimezoneOffset(timestamp_stop, 'player_timezone') * 1E3),
                start_date = fillLeadingZero(start.getUTCDate()),
                stop_date = fillLeadingZero(stop.getUTCDate()),
                //+1 because months are counted from 0-11
                start_month = fillLeadingZero(start.getUTCMonth() + 1),
                stop_month = fillLeadingZero(stop.getUTCMonth() + 1);

            return start_date + '.' + (start_month === stop_month ? '' : start_month) + '-' + stop_date + '.' + stop_month;
        },

        printDate: function(timestamp) {
            var fillLeadingZero = this.fillLeadingZero;

            var start = new Date(Timestamp.shiftUnixTimestampByTimezoneOffset(timestamp, 'player_timezone') * 1E3),
                start_date = fillLeadingZero(start.getUTCDate()),
                //+1 because months are counted from 0-11
                start_month = fillLeadingZero(start.getUTCMonth() + 1);
            return start_date + "." + start_month + ".";
        },

        alliance: function(link, name, id) {

            return '<a href="#' + link + '" onclick="Layout.allianceProfile.open(\'' + addslashes(name) + '\',' + id + ')" class="gp_alliance_link">' + name + '</a>';
        },
        player: function(link, name, id) {

            return '<a href="#' + link + '" class="gp_player_link">' + name + '</a>';
        },
        submit_form: function(form, controller, action, parameters) {
            parameters = parameters || {};

            if (action !== undefined && action !== '') {
                parameters.action = action;
            }

            parameters.town_id = parameters.town_id || Game.townId;

            // here we have to use direct js calls & functions because IE(7) cause problems with:	$("#" + form).attr("action", buildLink(controller, parameters));
            // See JIRA -> GP-557 for more information
            document.getElementById(form).setAttribute('action', buildLink(controller, parameters));

            $("#" + form).submit();
            return false;
        },

        submit_form_light: function(form) {
            $("#" + form).submit();
            return false;
        }
    };

    window.hCommon = hCommon;
}());