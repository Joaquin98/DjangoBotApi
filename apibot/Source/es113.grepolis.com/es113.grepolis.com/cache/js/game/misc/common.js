/* jshint freeze:false, bitwise:false, unused:false */
/* global Game, GPWindowMgr, ngettext, Timestamp, DebugTranslations, GameData, escape */

// TODO separate polyfills from common functions and native object extensions (should be undone if possible)

if (!Date.now) { // Emulate Date.now() for IE8
    Date.now = function() {
        return new Date().valueOf();
    };
}

if (!String.prototype.camelCase) {
    String.prototype.camelCase = function() {
        return this.replace(/(?:\b|_)(.)/g, function(x, chr) {
            return chr.toUpperCase();
        });
    };
}

if (!String.prototype.snakeCase) {
    String.prototype.snakeCase = function() {
        return this.replace(/([A-Z])/g, function(capital) {
            return '_' + capital.toLowerCase();
        }).replace(/^_/, '');
    };
}

//inheritance wrapper
if (!Function.prototype.inherits) {
    Function.prototype.inherits = function(F) {
        this.prototype = new F();
        this.prototype.constructor = this;
        this.prototype.parent = F.prototype;
    };
}

if (!Number.prototype.between) {
    Number.prototype.between = function(a, b) {
        return (a < b ? this >= a && this <= b : this >= b && this <= a);
    };
}

if (!Array.prototype.searchFor) {
    Array.prototype.searchFor = function(attr, value) {
        return this.filter(function(el) {
            return el[attr] == value; // jshint ignore:line
        });
    };
}

if (!String.prototype.truncate) {
    String.prototype.truncate = function(limit) {
        var len = this.length;

        return len > limit ? this.substr(0, limit) + '...' : this;
    };
}

if (!Array.prototype.remove) {
    //Some array functions - By John Resig (MIT Licensed)
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
}

if (!Array.prototype.max) {
    Array.prototype.max = function(array) {
        return Math.max.apply(Math, array);
    };
}

String.prototype.repeat = function(times) {
    'use strict';

    var out = '',
        i;

    for (i = 0; i < times; i++) {
        out += this;
    }

    return out;
};

/**
 * us.min([1, 2]);
 *
 * @deprecated
 */
if (!Array.prototype.min) {
    Array.prototype.min = function(array) {
        return Math.min.apply(Math, array);
    };
}

if (!Array.prototype.clone) {
    Array.prototype.clone = function() {
        return this.slice(0);
    };
}

/**
 * Strip HTML-Tags from a String
 */
if (!String.prototype.strip) {
    String.prototype.strip = function() {
        return this.replace(/<(.|\n)*?>/g, '');
    };
}

/**
 * Needed for IE10 because it doesn't support group function
 */

if (window.console && !window.console.group) {
    window.console.group = function(str) {
        return str;
    };

    window.console.groupEnd = function() {
        return '';
    };
}

/**
 * Checks if a string is lte than another string. If both strings start with a number, those values are parsed and then compared.
 *
 * @param y {String}
 */

if (!String.prototype.isLTE) {
    String.prototype.isLTE = function(y) {
        //parse
        var x = this,
            x_m = x.match(/^\s+\d+|^\d+/),
            y_m = y.match(/^\s+\d+|^\d+/),
            x_i = x_m !== null ? parseInt(x_m.shift(), 10) : NaN,
            y_i = y_m !== null ? parseInt(y_m.shift(), 10) : NaN;
        //compare strings if one isNaN
        if (isNaN(x_i) || isNaN(y_i)) {
            x = x.toLowerCase();
            y = y.toLowerCase();
        } else {
            x = x_i;
            y = y_i;
        }
        //compare
        return x <= y;
    };
}

/**
 * Returns the Date as a short string
 */
if (!Date.prototype.toShortString) {
    Date.prototype.toShortString = function() {
        var h, m, d, mn;
        h = ((h = this.getUTCHours()) < 10 ? '0' + h : h);
        m = ((m = this.getUTCMinutes()) < 10 ? '0' + m : m);
        d = ((d = this.getUTCDate()) < 10 ? '0' + d : d);
        mn = ((mn = this.getUTCMonth() + 1) < 10 ? '0' + mn : mn);
        return (h + ':' + m + ' ' + d + '/' + mn + '/' + this.getUTCFullYear());
    };
}

function utf8Encode(string) {
    string = string.replace(/\r\n/g, '\n');
    var utftext = '',
        n;

    for (n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
}

//private method for UTF-8 decoding
function utf8Decode(utftext) {
    var string = '';
    var i = 0,
        c, c3, c2;
    c = c3 = c2 = 0;

    while (i < utftext.length) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return string;
}

/**
 * base64 decode / encode
 *
 * Modern browser provide us with a btoa and atob function, but these do not support unicode
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
 *
 * for browsers with native btoa, we use a unicode alternative from the MDN
 * else we mock with a custom function (that works with unicode as well)
 *
 * the original btoa and atob are provided via window.__btoa and __atob
 */

if (window.btoa && window.encodeURIComponent) {
    window.__btoa = window.btoa;
    window.btoa = function(str) {
        return window.__btoa(window.unescape(encodeURIComponent(str)));
    };
} else {
    window.btoa = function(str) {
        var key_str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            output = '',
            chr1, chr2, chr3, enc1, enc2, enc3, enc4,
            i = 0;

        str = utf8Encode(str);

        while (i < str.length) {

            chr1 = str.charCodeAt(i++);
            chr2 = str.charCodeAt(i++);
            chr3 = str.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output +=
                key_str.charAt(enc1) + key_str.charAt(enc2) +
                key_str.charAt(enc3) + key_str.charAt(enc4);

        }

        return output;
    };
}

if (window.atob && window.decodeURIComponent) {
    window.__atob = window.atob;
    window.atob = function(str) {
        return decodeURIComponent(window.escape(window.__atob(str)));
    };
} else {
    window.atob = function(str) {
        var key_str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            output = '',
            i = 0,
            len = str.length;

        var enc1, enc2, enc3, enc4;

        var chr1, chr2, chr3;

        str = str.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        while (i < len) {
            enc1 = key_str.indexOf(str.charAt(i++));
            enc2 = key_str.indexOf(str.charAt(i++));
            enc3 = key_str.indexOf(str.charAt(i++));
            enc4 = key_str.indexOf(str.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output += String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        return utf8Decode(output);
    };
}

window.cycle = function() {
    var toggle = false;

    return function(a, b) {
        return (toggle = !toggle) ? a : b;
    };
}();

/**
 * jQuery.blocker
 *
 * @param {object} options
 * @return {self}
 *
 * minimum example:
 * $.blocker({html: $('<div>This is an (visual) blocking note</div>')});
 */
jQuery.blocker = function(options) {
    var settings = jQuery.extend({
        id: '', // rename to caching
        caching: options.id,
        html: 'f00',
        width: 520,
        height: 200,
        title: '',
        gameloader: false,
        bgClickable: true,
        success: '',
        cssClass: '',
        onSuccess: function() {},
        cancel: '',
        onCancel: function() {},
        callback: void(0)
    }, options);

    var block_wrapper = '<div class="gpwindow_frame ' + settings.cssClass + '" style="position: absolute; top: ' + (($(window).height() - settings.height) / 2) + 'px;' +
        'left: ' + (($(window).width() - settings.width) / 2) + 'px; width: ' + settings.width + 'px; height: ' + settings.height + 'px; z-index: 5000; display: block;">' +
        '<div class="gpwindow_left"></div><div class="gpwindow_right"></div><div class="gpwindow_bottom"><div class="gpwindow_left corner"></div><div class="gpwindow_right corner">' +
        '</div></div><div class="gpwindow_top"><div class="gpwindow_left corner"></div><div class="ui-dialog-titlebar"><span class="ui-dialog-title">' + settings.title + '</span></div><div class="gpwindow_right corner"></div></div>' +
        '<div class="gpwindow_content"></div>';
    var frame = $(block_wrapper);

    var elm = {
        box: frame,
        bg: $('<div id="blockbox_bg"></div>'),
        body: $('body')
    };

    elm.content = elm.box.find('div.gpwindow_content');

    // show
    this.blocker.block = function() {
        //save location ... otherwise use document body
        var tmp = settings.html.parent();
        elm.original_parent = tmp.length ? tmp : $('body');

        elm.html = settings.html.detach();
        elm.content.append(elm.html.show());

        elm.box.appendTo(elm.body).show();
        elm.bg.appendTo(elm.body).show();
    };

    this.blocker.handleEvents = function() {
        // set handlers
        if (settings.bgClickable) {
            elm.bg.on('click.block', function() {
                jQuery.blocker.unblock();
            });
        }
        // bind user defined functions to elements
        $(settings.success).off('click').on("click", function() {
            settings.onSuccess();
            jQuery.blocker.unblock();
        });
        $(settings.cancel).off('click').on("click", function() {
            settings.onCancel();
            jQuery.blocker.unblock();
        });
    };

    this.blocker.unblock = function() {
        elm.box.hide().detach();
        elm.bg.hide().detach();
        if (settings.gameloader) {
            elm.html.remove();
        } else {
            elm.html.appendTo(elm.original_parent).hide();
        }
        if (settings.callback && typeof settings.callback === 'function') {
            settings.callback();
        }
    };

    this.blocker.block();
    this.blocker.handleEvents();

    return this.blocker;
};

/**
 * @param controller String
 * @param parameters Object
 */
function buildLink(controller, parameters) {
    var params = [],
        key;
    for (key in parameters) {
        params.push(key + '=' + escape(parameters[key]));
    }
    // always append the CSRF token
    params.push('h=' + encodeURIComponent(Game.csrfToken));

    return '/game/' + controller + '?' + params.join('&');
}
/**
 *	Generates a link from the given parameters.
 *
 * @param controller String
 * @param action String
 * @param parameters Object
 * @return String
 */
function url(controller, action, parameters) {
    if (controller && controller.substr(0, 1) === '/') {
        return controller;
    }
    controller = controller || Game.controller;
    parameters = parameters || {};

    if (typeof action !== 'undefined' && action !== '') {
        parameters.action = action;
    }
    parameters.town_id = parameters.town_id || Game.townId;

    return buildLink(controller, parameters);
}

/**
 * Transforms seconds to hours:minutes:seconds
 * @param {number} duration in seconds
 * @param {boolean} only_non_zero - if true, omits any leading 0s
 * @param options
 * @return {String}
 */
function day_hr_min_sec(duration, only_non_zero, options) {
    var result, days, hours, minutes, seconds, hours_str, minutes_str, seconds_str,
        lang = {
            days: __('day|d'),
            hours: __('hour|h'),
            minutes: __('minute|m'),
            seconds: __('second|s')
        };

    function getSecondsHtml() {
        return with_seconds ? (seconds_str + '<span>' + lang.seconds + '</span>') : '';
    }

    options = options || {};
    var with_seconds = typeof options.with_seconds === "undefined" ? true : options.with_seconds;

    if (duration === 0) {
        return _('Now');
    }

    days = parseInt(duration / 86400, 10);
    hours = parseInt((duration / 3600) % 24, 10);
    minutes = parseInt((duration / 60) % 60, 10);
    seconds = parseInt(duration % 60, 10);

    // Days won't be displayed when == 0
    result = days > 0 ? days + '<span>' + lang.days + '</span>&nbsp;' : '';

    // Add 0 at the beginning if number is smaller than 10
    hours_str = (hours < 10) ? '0' + hours : hours;
    minutes_str = (minutes < 10) ? '0' + minutes : minutes;
    seconds_str = (seconds < 10) ? '0' + seconds : seconds;

    if (only_non_zero) {
        result += (hours > 0 || days > 0) ? (hours_str + '<span>' + lang.hours + '</span>&nbsp;') : '';
        result += (minutes > 0 || hours > 0 || days > 0) ? (minutes_str + '<span>' + lang.minutes + '</span>&nbsp;') : '';
        result += getSecondsHtml();
    } else {
        result += hours_str + '<span>' + lang.hours + '</span>&nbsp;' +
            minutes_str + '<span>' + lang.minutes + '</span>&nbsp;' +
            getSecondsHtml();
    }

    return result;
}

/**
 * Transforms seconds to x hours (y minutes) (z seconds)
 * primary used for inline texts e.g. in power effects
 *
 * @param {integer} duration
 * @see TimeFormat.php formatTime()
 * @return {string}
 */
function hours_minutes_seconds(duration) {
    var weeks, days, hours, minutes, seconds,
        str = [];

    weeks = Math.floor(duration / 604800);
    days = Math.floor((duration / 86400) % 7);
    hours = Math.floor((duration / 3600) % 24);
    minutes = Math.floor((duration / 60) % 60);
    seconds = Math.floor(duration % 60);

    if (weeks > 0) {
        str.push(weeks + ' ' + ngettext('week', 'weeks', weeks));
    }
    if (days > 0) {
        str.push(days + ' ' + ngettext('day', 'days', days));
    }
    if (hours > 0) {
        str.push(hours + ' ' + ngettext('hour', 'hours', hours));
    }
    if (minutes > 0) {
        str.push(minutes + ' ' + ngettext('minute', 'minutes', minutes));
    }
    if (seconds > 0) {
        str.push(seconds + ' ' + ngettext('second', 'seconds', seconds));
    }

    return str.join(' ');
}

/**
 * Transforms date object to readable format
 *
 * @param {object} date
 * @param {boolean} utc is date
 * @param {boolean} ext_date - flag if a date with day and month should be returned
 * @param {boolean} with_seconds - flag if a date with seconds should be returned
 * @return String
 */
function readableDate(date, utc, ext_date, with_seconds) {
    return readableUnixTimestamp(date.getTime(), (utc === true ? 'no_offset' : 'player_timezone'), {
        extended_date: ext_date,
        with_seconds: with_seconds
    });
}

/**
 * Transforms a unix timestamp to readable format
 * This readable format could depend on a timezone:
 *  - player_timezone := player timezone from his settings (default)
 *  - lc_timezone := servers lc_timezone
 *  - no_offset := no timezone offset
 *
 * The options object can hold of those two boolean flags
 * 	- extended_date := flag if a date with day and month should be returned
 * 	- with_seconds := flag if a date with seconds should be returned
 *
 * @param {integer} timestamp
 * @param {string} timezone_type
 * @param {object} options
 * @return String
 */
function readableUnixTimestamp(timestamp, timezone_type, options) {
    options = options === undefined ? {} : options;

    var with_seconds = options.with_seconds === undefined ? true : options.with_seconds;
    var extended_date = options.extended_date === undefined ? false : options.extended_date;

    var ts = (timezone_type === 'no_offset' ? timestamp : Timestamp.shiftUnixTimestampByTimezoneOffset(timestamp, timezone_type));

    var date = new Date(ts * 1E3);
    var hours, minutes, seconds, days, months;
    var result;

    hours = date.getUTCHours();
    minutes = date.getUTCMinutes();
    seconds = date.getUTCSeconds();

    if (hours < 10) {
        hours = '0' + hours;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    if (extended_date) {
        days = date.getUTCDate();
        months = date.getUTCMonth() + 1;

        if (days < 10) {
            days = '0' + days;
        }

        if (months < 10) {
            months = '0' + months;
        }

        result = days + '.' + months + '.|' + hours + ':' + minutes + (with_seconds ? (':' + seconds) : '');
    } else {
        result = hours + ':' + minutes + (with_seconds ? (':' + seconds) : '');
    }

    return result;
}
/**
 * Returns a ratio string from a given float.
 * One side of the ratio is 1.
 * The other side is always >=1.
 * e.g.
 * 	1.2 -> '1.2':1
 * 	0.8 -> '1:1.2'
 *
 * @param {number} fraction
 * @return {string}
 */
function readableRatio(fraction) {
    var bigger_part = Math.round((fraction >= 1 ? fraction : (1 / fraction)) * 100) / 100;
    if (fraction < 1) {
        return '1:' + bigger_part;
    } else {
        return bigger_part + ':1';
    }
}

// Translation tool, return s
// Strings wrapped with this will get translated
function _(s) {
    if (DebugTranslations.isEnabled()) {
        return DebugTranslations.markString(s);
    }

    return s;
}

// Translation tool, return s
// Strings wrapped with this will NOT get translated
function _literal(s) {
    return s;
}

// context aware gettext alias - only used for dev
// and fallback in case of missing translation
function __(s) {
    if (DebugTranslations.isEnabled()) {
        return DebugTranslations.markString(s.substr(s.indexOf('|') + 1));
    }

    return s.substr(s.indexOf('|') + 1);
}

function s(text) {
    var i;
    if (!text) {
        return '';
    }
    for (i = 1; i < arguments.length; i++) {
        text = text.split('%' + i).join(arguments[i]);
    }

    return text;
}

/**
 * Debugging function.
 *
 * @param whatever Object
 */
function debug(whatever) {
    var i, s;
    if (!Game.dev) {
        return;
    }
    try {
        if (arguments.length > 1) {
            console.group();
            for (i = 0; i < arguments.length; i++) {
                console.debug(arguments[i]);
            }
            console.groupEnd();
        } else {
            console.log(whatever);
        }
    } catch (x) {
        try {
            opera.postError(whatever);
        } catch (y) {
            if ('object' === typeof(whatever)) {
                s = '';
                for (var i in whatever) {
                    s += i + ': ' + whatever[i] + '\n';
                }
                alert(s);
            } else {
                alert(whatever);
            }
        }
    }
}

jQuery.extend(jQuery.easing, {
    // t: current time, b: beginning value, c: change in value, d: duration
    bounce: function(x, t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    }
});

/**
 * @deprecated, use .bind()/.click()/.whatever() instead.
 */
function w(foo) {
    var elm = foo || this;
    if (elm.wnd) {
        return elm.wnd;
    }

    while (elm.parentNode &&
        // if element has a tagName different from 'DIV', we skip it. This is mainly a workaround
        // for <form>-elements, which cause serious problems when used with this function, e. g.:
        //  an error is thrown with something like: form#[object HTMLInputElement]
        ((elm = elm.parentNode).tagName !== 'DIV' ? elm = elm.parentNode : elm).id.indexOf('gpwnd') === -1) {
        null;
    }

    var id = (~~elm.id.match(/\d+/));
    elm.wnd = GPWindowMgr.GetByID(id);
    return elm.wnd;
}

function attr(attribs) {
    var res = '',
        att;

    for (att in attribs) {
        if (attribs[att]) {
            res = res + ' ' + att + '="' + attribs[att] + '"';
        }
    }
    return res;
}

/**
 * function to create a button as string or jquery object
 *
 * @param {string} text
 * @param {object} html_options
 * @param {boolean} as_string (optional: default false)
 * @param wnd
 * @return object either string or jquery object
 */
function button(text, html_options, as_string, wnd) {
    var btn,
        button_text,
        callback,
        css_class = 'button';

    if (html_options.hasOwnProperty('class')) {
        css_class += ' ' + html_options['class'];
    }

    if (!html_options.href) {
        html_options.href = '#';
    }
    if ((callback = html_options.onclick) && typeof callback === 'function') {
        // if we bind a function, we cannot return a string
        as_string = false;
        delete html_options.onclick;
    }

    html_options = attr(html_options);

    button_text = '<a class="' + css_class + '" ' + html_options + '>' +
        '<span class="left"><span class="right">' +
        '<span class="middle">' + text + '</span>' +
        '</span></span>' +
        '<span style="clear:both;"></span>' +
        '</a>';

    if (!as_string) {
        btn = $(button_text);
    }
    // if callback insted of onclick:
    if (callback && !as_string) {
        btn.on("click", function() {
            callback.apply(wnd);
        });
    }

    return as_string ? button_text : btn;
}


/**
 * checks if argument is a number
 *
 * @param object val
 * @return boolean
 */
function isNumber(val) {
    return typeof val === 'number' && isFinite(val);
}

/**
 * checks if argument is an array
 *
 * @param {object} o
 * @return boolean
 */
function is_array(o) {
    return typeof o === 'object' && (o instanceof Array);
}

/**
 *  adds slashes to string
 *
 *  @param str string
 *  @return string
 */
function addslashes(str) {
    var result = str || '';
    result = result.replace(/\\/g, '\\\\');
    result = result.replace(/\'/g, '\\\'');
    result = result.replace(/\"/g, '\\"');
    result = result.replace(/\0/g, '\\0');
    return result;
}

/**
 * get human readable time and date format: hours:minutes:seconds day/month/year
 */
function getHumanReadableTimeDate(time) {
    // http://www.hunlock.com/blogs/Javascript_Dates-The_Complete_Reference
    var hours = time.getUTCHours(),
        minutes = time.getUTCMinutes(),
        seconds = time.getUTCSeconds(),
        day = time.getUTCDate(),
        month = time.getUTCMonth() + 1,
        year = time.getUTCFullYear();

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return hours + ':' + minutes + ':' + seconds + ' ' + day + '/' + month + '/' + year;
}

/**
 * get human readable date format: day/month/year
 */
function getHumanReadableDate(timestamp) {
    var day = timestamp.getUTCDate(),
        month = timestamp.getUTCMonth() + 1,
        year = timestamp.getUTCFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return day + '/' + month + '/' + year;
}


/**
 * creates a date object by the date arguments supplied. A concrete timezone
 * for the date supplied can be specified
 *
 * @param {integer} year
 * @param {integer} month
 * @param {integer} day
 * @param {integer} hours
 * @param {integer} minutes
 * @param {integer} seconds
 * @param {integer} timezone_offset (in seconds) GMT +02 = 7200
 *
 * @return object date
 */
function newDateByTimezone(year, month, day, hours, minutes, seconds, timezone_offset) {
    var date = new Date();
    date.setUTCFullYear(year, month, day);
    date.setUTCHours(hours, minutes, seconds - timezone_offset);

    return date;
}


/**
 * Only used in wndhandler_attack and building_place
 * TODO: get rid of this method in common.js
 * @param units Array
 * @param data Object unit data for current town
 * @param pop jQuery element for display of selected population
 * @param cap jQuery element for display of total capacity
 * @param progbar jQuery progressbar element
 */
function recalcCapacity(units, researches, pop, cap, progbar, slow_boats_needed, fast_boats_needed) {
    researches = researches || 0;
    var GROUND_UNITS = require('enums/ground_units');

    var q, progress,
        total_capacity = 0,
        total_population = 0,
        // TODO!
        pwidth = 460,
        berth = researches.berth || 0,
        gdunits = GameData.units,
        big_transporter_cap = gdunits.big_transporter.capacity,
        small_transporter_cap = gdunits.small_transporter.capacity;

    units.each(function() {
        var i = this.name,
            count = ~~this.value,
            cap;

        // don't do anything if 0 or a flying unit
        if (count && !gdunits[i].flying) {
            if (gdunits[i].is_naval) {
                // add research-modifiers if they exist
                total_capacity += ((cap = gdunits[i].capacity) + (cap ? researches.berth || 0 : 0)) * count;
            } else if (gdunits[i].id === GROUND_UNITS.SPARTOI) {
                total_population += count;
            } else {
                total_population += gdunits[i].population * count;
            }
        }
    });

    q = total_population / total_capacity;
    progress = (q >= 1 || !total_capacity) ? 0 : (1 - q) * -pwidth;

    pop.text(total_population);
    cap.text(total_capacity);
    progbar.stop(true, true).animate({
        backgroundPosition: progress + 'px'
    });

    if (slow_boats_needed) {
        slow_boats_needed.text(Math.ceil(total_population / (big_transporter_cap + berth)));
    }

    if (fast_boats_needed) {
        fast_boats_needed.text(Math.ceil(total_population / (small_transporter_cap + berth)));
    }

    return {
        'capacity': total_capacity,
        'population': total_population
    };
}

function isSomeThing(checks, anyOrAll) {
    var isSomeThing, uagent;

    return function() {
        var check_idx, checks_length = checks.length,
            check;

        if (typeof isSomeThing === 'boolean') {
            return isSomeThing;
        } else {
            uagent = navigator.userAgent.toLowerCase();
            if (anyOrAll === 'any') {
                for (check_idx = 0; check_idx < checks_length; ++check_idx) {
                    check = checks[check_idx];
                    isSomeThing = isSomeThing || uagent.indexOf(check) > -1;
                }
            } else {
                isSomeThing = true;
                for (check_idx = 0; check_idx < checks_length; ++check_idx) {
                    check = checks[check_idx];
                    isSomeThing = isSomeThing && uagent.indexOf(check) > -1;
                }
            }

            return isSomeThing;
        }
    };
}

var isiOs = isSomeThing(['iphone', 'ipad', 'ipod', 'appledevice'], 'any');
var isIeTouch = isSomeThing(['touch', 'trident', 'tablet'], 'all');
var isMsApp = isSomeThing(['trident', 'msapphost'], 'all');

function isSmallScreen() {

    if (isSmallScreen.result) {
        return isSmallScreen.result;
    }

    if ($(window).height() <= 800) {
        isSmallScreen.result = true;
    } else {
        isSmallScreen.result = false;
    }

    return isSmallScreen.result;
}

/**
 * Generated a DWORD (32-bit-integer) from 2 WORDS (16 bit ints)
 *
 * @param {Number} lo Lower Half WORD
 * @param {Number} hi Higher Half WORD
 * @return {Number} generated DWORD
 */
function makeDWord(lo, hi) {
    return (lo & 0xffff) | ((hi & 0xffff) << 16);
}

var Sort = {
    sort_by: null,

    /**
     * Setter method for the values by which the list should be sorted
     *
     * @param {String} string classname of any sortable value
     */
    sortBy: function(string) {
        this.sort_by = string;
    },
    /**
     * checks if list is already sorted by a value
     */
    sortedBy: function(string) {
        return this.sort_by === string;
    },

    /**
     * Sorts an array via quicksort. sortBy() must be used first.
     *
     * @param {Array} array The array which has to be sorted
     */
    qsort: function(array) {
        var greater = [],
            less = [];
        if (!array || array.length <= 1) {
            return array;
        } else {
            var index = Math.floor(Math.random() * (array.length - 1));
            var pivot = array[index],
                i;
            array.splice(index, 1);
            for (i = 0; i < array.length; i++) {
                var obj = array[i];
                var x = $(obj).find('span.sortable.' + this.sort_by).text();
                var y = $(pivot).find('span.sortable.' + this.sort_by).text();

                if (x.isLTE(y)) {
                    less.push(obj);
                } else {
                    greater.push(obj);
                }
            }
            return (this.qsort(less).concat(pivot)).concat(this.qsort(greater));
        }
    }
};

/**
 * change digit to roman numerals (up to 4000)
 */
function romanNumerals(val) {
    var values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
        numerals = ['min', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'],
        vl = values.length,
        i = 0,
        rest = val,
        return_val = '';

    for (; i < vl; ++i) {
        while (rest > values[i]) {
            rest -= values[i];
            return_val += numerals[i];
        }
    }

    return return_val;
}

if (!window.getComputedStyle) {
    window.getIEComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop === 'float') {
                prop = 'styleFloat';
            }
            if (re.test(prop)) {
                prop = prop.replace(re, function() {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
        this.cssText = function() {
            if (!el) {
                return false;
            }
            var elStyle = el.currentStyle,
                cssText = '';
            for (var k in elStyle) {
                cssText += k + ':' + elStyle[k] + ';';
            }
            return cssText.replace(/([A-Z])/g, function($1) {
                return '-' + $1.toLowerCase();
            });
        }();

        return this;
    };
}

function difference(template, override) {
    var ret = {};
    for (var name in template) {
        if (template.hasOwnProperty(name) && name in override) {
            if (us.isObject(override[name]) && !us.isArray(override[name])) {
                var diff = difference(template[name], override[name]);
                if (!us.isEmpty(diff)) {
                    ret[name] = diff;
                }
            } else if (!us.isEqual(template[name], override[name])) {
                ret[name] = override[name];
            }
        }
    }
    return ret;
}

/**
 * Shortens a string exceeding the total_max_length with an ellipsis (3 dots)
 * total_max_length includes the length of the ellipsis!
 *
 * @param {String} string_to_shorten
 * @param {number} total_max_length
 */
function ellipsis(string_to_shorten, total_max_length) {
    if (string_to_shorten.length <= total_max_length) {
        return string_to_shorten;
    }

    return string_to_shorten.slice(0, total_max_length - 1) + '\u2026';
}
/**
 * Wrapper for the native number.toLocaleString() in order to make sure the game locale is used.
 * @param number
 * @return {string|*}
 */
function numberToLocaleString(number) {
    var toLocaleStringSupportsLocales = function() {
            var test_number = 0;
            try {
                test_number.toLocaleString('i');
            } catch (e) {
                return e.name === 'RangeError';
            }
            return false;
        },
        locale = Game.locale_lang.replace('_', '-');

    return toLocaleStringSupportsLocales() ?
        number.toLocaleString(locale) :
        number;
}

(function($) {
    'use strict';

    /**
     * When element is hidden with display:none; we can not get its proper size
     * in this case, we have to show him for a while somewhere out of the viewport,
     * take the size, and restore values
     */
    $.fn.hiddenOuterWidth = function(include_margin) {
        include_margin = include_margin ? true : false;

        var $el = $(this),
            old_styles = {
                left: $el.css('left'),
                display: $el.css('display'),
                position: $el.css('position'),
                visibility: $el.css('visibility'),
                width: $el.css('width')
            },
            outer_width;

        $el.css({
            left: 300,
            display: 'block',
            position: 'absolute',
            visibility: 'visible'
        });

        outer_width = $el.outerWidth(include_margin);

        $el.css(old_styles);

        return outer_width;
    };

    /**
     *
     */
    $.fn.setOffsetWidth = function(value) {
        var $el = $(this),
            margins_width = $el.outerWidth(true) - $el.outerWidth();

        $el.width(value - margins_width);

        return this;
    };
}(jQuery));