//
// Copyright (c) 2008, 2009 Paul Duncan (paul@pablotron.org)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//


/// Version:
/// 2009-03-05 15:40
/// From: http://hg.pablotron.org/persist-js/file/eadb8c9323fc/src
/// ( Project URL: http://pablotron.org/software/persist-js/ )
//
// === NOTE ===
// This is modified for Grepolis:
// Changelog:
//  added isAvailable method,
//  removed flash and cookie storage
//  renamed local storage tables to gp_..


// === Methods ==
//  .set(key, val, fn, ttl, scope, userdata)
//      Paramter:
//       @key:  the index
//       @val:  the value
//       @fn:  callback function [optional], Type: function(ok, data, userdata)
//       @ttl: ttl of object in seconds optional (0 or undefined inifinte!)
//       @scope: scope of callbackfunction call [optional]
//       @userdata: parameter thats given tto callback function [optional]
//
//  .get(key, fn, scope, userdata)
//      Paramter:
//       @key:  index to fetch
//       @fn:   callback function when request completed, Type: function(ok, data, userdata)
//       @userdata:  parameter thats given to callback function [optional]
//
//  .remove(key)
//      Paramter:
//       @key:  iondex to remove
//
//  .clear()
//      Flushes / recreates the whole database.
//


/*
 * The contents of gears_init.js; we need this because Chrome supports
 * Gears out of the box, but still requires this constructor.  Note that
 * if you include gears_init.js then this function does nothing.
 */

// GEARS LOADER IS CURRENTLY DISABLED; not used
/*
(function() {
  // We are already defined. Hooray!
  if (window.google && google.gears)
    return;

  // factory
  var F = null;

  // Firefox
  if (typeof GearsFactory != 'undefined') {
        F = new GearsFactory();
    } else {
        // IE
        if((typeof ActiveXObject) != 'undefined'){
            F = new ActiveXObject('Gears.Factory');
            // privateSetGlobalObject is only required and supported on WinCE.
            if (F.getBuildInfo().indexOf('ie_mobile') != -1)
                F.privateSetGlobalObject(this);
        } else {
            // Safari
            if ((typeof navigator.mimeTypes != 'undefined')
                && navigator.mimeTypes["application/x-googlegears"]) {
                F = document.createElement("object");
                F.style.display = "none";
                F.width = 0;
                F.height = 0;
                F.type = "application/x-googlegears";
                document.documentElement.appendChild(F);
            }
        }
    }

  // *Do not* define any objects if Gears is not installed. This mimics the
  // behavior of Gears defining the objects in the future.
  if (!F)
    return;

  // Now set up the objects, being careful not to overwrite anything.
  //
  // Note: In Internet Explorer for Windows Mobile, you can't add properties to
  // the window object. However, global objects are automatically added as
  // properties of the window object in all browsers.
  if (!window.google)
    google = {};

  if (!google.gears)
    google.gears = {factory: F};
})();
*/

/* global JSON, Timestamp */

/**
 * Persist - top-level namespace for Persist library.
 * @namespace
 */
Persist = (function() {
    var VERSION = '0.2.0',
        P, B, C, i, esc, init, empty, ec;

    // easycookie 0.2.1 (pre-minified)
    // (see http://pablotron.org/software/easy_cookie/)
    ec = (function() {
        var EPOCH = 'Thu, 01-Jan-1970 00:00:01 GMT',
            RATIO = 1000 * 60 * 60 * 24,
            KEYS = ['expires', 'path', 'domain'],
            esc = escape,
            un = unescape,
            doc = document,
            me;
        var get_now = function() {
            var r = new Date();
            r.setTime(r.getTime());
            return r;
        }
        var cookify = function(c_key, c_val) {
            var i, key, val, r = [],
                opt = (arguments.length > 2) ? arguments[2] : {};
            r.push(esc(c_key) + '=' + esc(c_val));
            for (i = 0; i < KEYS.length; i++) {
                key = KEYS[i];
                if (val = opt[key])
                    r.push(key + '=' + val);
            }
            if (opt.secure)
                r.push('secure');
            return r.join('; ');
        }
        var alive = function() {
            var k = '__EC_TEST__',
                v = new Date();
            v = v.toGMTString();
            this.set(k, v);
            this.enabled = (this.remove(k) == v);
            return this.enabled;
        }
        me = {
            set: function(key, val) {
                var opt = (arguments.length > 2) ? arguments[2] : {},
                    now = get_now(),
                    expire_at, cfg = {};
                if (opt.expires) {
                    opt.expires *= RATIO;
                    cfg.expires = new Date(now.getTime() + opt.expires);
                    cfg.expires = cfg.expires.toGMTString();
                }
                var keys = ['path', 'domain', 'secure'];
                for (i = 0; i < keys.length; i++)
                    if (opt[keys[i]])
                        cfg[keys[i]] = opt[keys[i]];
                var r = cookify(key, val, cfg);
                doc.cookie = r;
                return val;
            },
            has: function(key) {
                key = esc(key);
                var c = doc.cookie,
                    ofs = c.indexOf(key + '='),
                    len = ofs + key.length + 1,
                    sub = c.substring(0, key.length);
                return ((!ofs && key != sub) || ofs < 0) ? false : true;
            },
            get: function(key) {
                key = esc(key);
                var c = doc.cookie,
                    ofs = c.indexOf(key + '='),
                    len = ofs + key.length + 1,
                    sub = c.substring(0, key.length),
                    end;
                if ((!ofs && key != sub) || ofs < 0)
                    return null;
                end = c.indexOf(';', len);
                if (end < 0)
                    end = c.length;
                return un(c.substring(len, end));
            },
            remove: function(k) {
                var r = me.get(k),
                    opt = {
                        expires: EPOCH
                    };
                doc.cookie = cookify(k, '', opt);
                return r;
            },
            keys: function() {
                var c = doc.cookie,
                    ps = c.split('; '),
                    i, p, r = [];
                for (i = 0; i < ps.length; i++) {
                    p = ps[i].split('=');
                    r.push(un(p[0]));
                }
                return r;
            },
            all: function() {
                var c = doc.cookie,
                    ps = c.split('; '),
                    i, p, r = [];
                for (i = 0; i < ps.length; i++) {
                    p = ps[i].split('=');
                    r.push([un(p[0]), un(p[1])]);
                }
                return r;
            },
            version: '0.2.1',
            enabled: false
        };
        me.enabled = alive.call(me);
        return me;
    }());

    // wrapper for Array.prototype.indexOf, since IE doesn't have it
    var index_of = (function() {
        if (Array.prototype.indexOf)
            return function(ary, val) {
                return Array.prototype.indexOf.call(ary, val);
            };
        else
            return function(ary, val) {
                var i, l;

                for (i = 0, l = ary.length; i < l; i++)
                    if (ary[i] == val)
                        return i;

                return -1;
            };
    })();


    // empty function
    empty = function() {};

    /**
     * Escape spaces and underscores in name.  Used to generate a "safe"
     * key from a name.
     *
     * @private
     */
    esc = function(str) {
        return 'PS' + str.replace(/_/g, '__').replace(/ /g, '_s');
    };

    C = {
        /*
         * Backend search order.
         *
         * Note that the search order is significant; the backends are
         * listed in order of capacity, and many browsers
         * support multiple backends, so changing the search order could
         * result in a browser choosing a less capable backend.
         */
        search_order: [
            'localstorage'
        ],

        // valid name regular expression
        name_re: /^[a-z][a-z0-9_ -]+$/i,

        // list of backend methods
        methods: [
            'init',
            'get',
            'set',
            'remove',
            'vacuum',
            'load',
            'save'
            // TODO: clear method?
        ],

        // sql for db backends (gears and db)
        sql_version: 3,
        sql: {
            version: this.sql_version, // db schema version

            // XXX: the "IF NOT EXISTS" is a sqlite-ism; fortunately all the
            // known DB implementations (safari and gears) use sqlite
            create: "CREATE TABLE IF NOT EXISTS gp_persist_data_" + this.sql_version + " (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL, t TEXT NOT NULL, vu INTEGER NOT NULL)",
            drop: "DROP TABLE IF EXISTS gp_persist_data_" + this.sql_version + "",
            get: "SELECT v, t, vu FROM gp_persist_data_" + this.sql_version + " WHERE k = ?",
            set: "INSERT INTO gp_persist_data_" + this.sql_version + "(k, v, t, vu) VALUES (?, ?, ?, ?)",
            remove: "DELETE FROM gp_persist_data_" + this.sql_version + " WHERE k = ?",
            vacuum: "DELETE FROM gp_persist_data_" + this.sql_version + " WHERE vu < ?"
        }

    };

    // built-in backends
    B = {
        // localstorage backend (globalStorage, FF2+, IE8+)
        // (src: http://www.whatwg.org/specs/web-apps/current-work/#the-localstorage)
        // also http://msdn.microsoft.com/en-us/library/cc197062(VS.85).aspx#_global
        localstorage: {
            // (unknown?)
            // ie has the remainingSpace property, see:
            // http://msdn.microsoft.com/en-us/library/cc197016(VS.85).aspx
            size: -1,

            test: function() {
                return window.localStorage ? true : false;
            },

            methods: {
                key: function(key) {
                    return esc(this.name) + esc(key);
                },

                metakey: function(key) {
                    return 'meta_' + esc(this.name) + esc(key);
                },

                init: function() {
                    this.store = localStorage;
                },

                clear: function() {
                    this.store.clear();
                },

                get: function(_key, fn, scope, userdata) {
                    var meta, metakey, val, key, json;

                    // expand key
                    metakey = this.metakey(_key);
                    key = this.key(_key);

                    // get type:
                    meta = JSON.parse(this.store.getItem(metakey));

                    if (meta) {
                        if (meta.valid_until > 0 && meta.valid_until < parseInt(Timestamp.server(), 10)) {
                            // this data is invalid!
                            this.remove(_key);

                            fn.call(scope || this, false, null, userdata);
                            return null;
                        }

                        json = JSON.parse(this.store.getItem(key));
                        if (fn) {
                            fn.call(scope || this, true, json, userdata);
                        }
                        return json;

                    } else {
                        if (fn) {
                            fn.call(scope || this, false, null, userdata);
                        }
                        return null;
                    }

                },

                set: function(key, val, fn, ttl, scope, userdata) {
                    // expand key
                    var metakey = this.metakey(key);
                    key = this.key(key);

                    ttl = parseInt(ttl, 10);
                    if (ttl != 0)
                        ttl = ttl + parseInt(Timestamp.server(), 10);

                    // set value
                    try {
                        this.store.setItem(metakey, JSON.stringify({
                            type: (typeof val),
                            valid_until: ttl
                        }));
                        this.store.setItem(key, JSON.stringify(val));
                    } catch (e) {
                        if (window.Game && window.Game.dev) {
                            console.error(e);
                            console.trace();
                        }
                        if (fn)
                            fn.call(scope || this, false, null, userdata);
                        return;
                    }

                    if (fn)
                        fn.call(scope || this, true, val, userdata);
                },

                remove: function(_key, fn, scope, userdata) {
                    var val, metakey, key, meta;

                    // expand key
                    metakey = this.metakey(_key);
                    key = this.key(_key);


                    // get value
                    meta = this.store.getItem(metakey);
                    if (meta && (meta.valid_until == 0 || meta.valid_until >= parseInt(Timestamp.server(), 10))) {
                        val = this.store.getItem(key);
                    } else {
                        val = null;
                    }

                    // delete value
                    this.store.removeItem(key);
                    this.store.removeItem(metakey);

                    if (fn)
                        fn.call(scope || this, (val !== null), val, userdata);
                },


                vacuum: function() {
                    var ts = parseInt(Timestamp.server(), 10);

                    for (var i = 0; i < this.store.length; i++) {
                        var k = this.store.key(i);
                        if (typeof k == "string" && "meta_" == k.substr(0, 5)) {
                            var meta = JSON.parse(this.store.getItem(k));

                            if (meta && meta.valid_until != 0 && meta.valid_until < ts) {
                                // Timed out..
                                this.store.removeItem(k); // remove meta data
                                this.store.removeItem(k.substr(5)); // remove data
                            }
                        }
                    }
                } //end vacuum func

            }
        }

    };

    /**
     * Test for available backends and pick the best one.
     * @private
     */
    var init = function() {
        var i, l, b, key, fns = C.methods,
            keys = C.search_order;

        // set all functions to the empty function
        for (i = 0, l = fns.length; i < l; i++)
            P.Store.prototype[fns[i]] = empty;

        // clear type and size
        P.type = null;
        P.size = -1;

        // loop over all backends and test for each one
        for (i = 0, l = keys.length; !P.type && i < l; i++) {
            b = B[keys[i]];

            // test for backend
            if (b.test()) {
                // found backend, save type and size
                P.type = keys[i];
                P.size = b.size;

                // extend store prototype with backend methods
                for (key in b.methods)
                    P.Store.prototype[key] = b.methods[key];
            }
        }

        // mark library as initialized
        P._init = true;
    };

    // create top-level namespace
    P = {
        // version of persist library
        VERSION: VERSION,

        // backend type and size limit
        type: null,
        size: 0,

        // XXX: expose init function?
        // init: init,

        add: function(o) {
            // add to backend hash
            B[o.id] = o;

            // add backend to front of search order
            C.search_order = [o.id].concat(C.search_order);

            // re-initialize library
            init();
        },

        remove: function(id) {
            var ofs = index_of(C.search_order, id);
            if (ofs < 0)
                return;

            // remove from search order
            C.search_order.splice(ofs, 1);

            // delete from lut
            delete B[id];

            // re-initialize library
            init();
        },

        // expose easycookie API
        Cookie: ec,


        isAvailable: function() {
            if (P.type)
                return true;
            return false;
        },

        getType: function() {
            return P.type;
        },

        // store API
        Store: function(name, o) {
            // verify name
            if (!C.name_re.exec(name))
                throw new Error("Invalid name");

            // XXX: should we lazy-load type?
            // if (!P._init)
            //   init();
            if (!P.type)
                throw new Error("No suitable storage found");

            o = o || {};
            this.name = name;

            // get domain (XXX: does this localdomain fix work?)
            o.domain = o.domain || location.host || 'localhost';

            // strip port from domain (XXX: will this break ipv6?)
            o.domain = o.domain.replace(/:\d+$/, '')

            // append localdomain to domains w/o '."
            // (see https://bugzilla.mozilla.org/show_bug.cgi?id=357323)
            // (file://localhost/ works, see:
            // https://bugzilla.mozilla.org/show_bug.cgi?id=469192)
            /*
             *       if (!o.domain.match(/\./))
             *         o.domain += '.localdomain';
             */

            this.o = o;

            // expires in 2 years
            o.expires = o.expires || 365 * 2;

            // set path to root
            o.path = o.path || '/';

            // call init function
            this.init();
        }
    };

    // init persist
    init();

    // return top-level namespace
    return P;
})();