/* global Persist, Timestamp */
//
// Local Storage Provider
//
//
(function() {
    'use strict';

    function GPLocalStore(_playerID, useLocalStore) {
        var that = this;
        var playerID = _playerID;
        var pstore_name = '';
        var pstore = null; // Player based persistent storage
        var gstore = null; // Grepo - project - based persistent storage
        var pstores = {};

        // Memory Store
        var mem_pstore = {};
        var mem_gstore = {};

        // In memory store, ttl ( ttl <= this value == memory stored )
        var _conf_inmemory = 300;

        function addThisPstoreToGlobalDataList() {
            pstores[pstore_name] = true;
            gstore.set('localstores', pstores);
        }

        // function that recevies the global data list
        function globalDataListCallback(ok, data) {
            if (!ok || (ok && (!data || !data[pstore_name]))) {
                addThisPstoreToGlobalDataList();
            }
        }

        function init(ls_enabled) {
            if (ls_enabled !== false && Persist.isAvailable()) {
                pstore_name = 'Grepo2_01Data_p' + playerID;
                pstore = new Persist.Store(pstore_name);
                gstore = new Persist.Store('Grepo2_01Data_global');
                gstore.get('localstores', globalDataListCallback, that);
            }
        }

        //
        // General functions

        /**
         */
        this.check = function() {
            if (!useLocalStore) {
                return false;
            }

            return Persist.isAvailable();
        };

        this.getType = function() {
            return Persist.getType();
        };

        //
        // Memory Storage wrapper for 'short ttl' objects
        //
        function mem_set(_h, _key, _value, _ttl) {
            var row = {
                data: _value,
                valid_until: Timestamp.server() + parseInt(_ttl, 10)
            };
            // ==
            _h[_key] = row;
        }

        function mem_get(_h, _key) {
            var row = _h[_key];

            if (row) {
                if (row.valid_until >= Timestamp.server()) {
                    return row.data;
                } else {
                    _h[_key] = undefined;
                    delete _h[_key];
                    return undefined;
                }
            }

            return undefined;
        }

        function mem_del(_h, _key) {
            var row = _h[_key];

            if (row) {
                _h[_key] = undefined;
                delete _h[_key];
                return true;
            }

            return false;
        }

        function mem_vacuum(_h) {
            var ts = Timestamp.server();

            for (var k in _h) {
                if (_h[k].valid_until < ts) {
                    /// Del it
                    _h[k] = undefined;
                    delete _h[k];
                }
            }
        }

        //
        // Player storage (player dpendent..)  functions
        //

        /**
         * This sets a value by key, in playerbased storage
         *
         * @param key		the key (index)
         * @param value		the value (data to store)
         * @param ttl		time-to-live, 0 means infinite
         */
        this.set = function(key, value, ttl) {
            ttl = parseInt(ttl, 10);

            if (ttl < 0) {
                return;
            }

            // Store in memory?
            if (!pstore || (ttl !== 0 && ttl <= _conf_inmemory)) {
                // store in memory=>
                mem_set(mem_pstore, key, value, ttl);
                return;
            }

            if (pstore) {
                pstore.set(key, value, null, ttl);
            }
        };

        /**
         * This fetches a row by the given key
         *
         * @param key		the key (index)
         * @param cbfn		callback function ( Type: function(ok, data, param)
         *												ok is boolean; if data was found its true; otherwise its false, data contains the row, param the user param from get request )
         * @param scope		the scope where the callbackfunction gets called in
         */
        this.get = function(key, cbfn, param, scope) {
            // is in memory stored?
            var data = mem_get(mem_pstore, key);
            if (data) {
                if (typeof cbfn === 'function') {
                    cbfn.call(scope || this, true, data, param);
                }
                return data;
            }

            if (pstore) {
                return pstore.get(key, cbfn, scope, param);
            } else {
                if (typeof cbfn === 'function') {
                    cbfn.call(scope || this, false, null, param);
                }
                return null;
            }
        };

        /**
         * This deletes a row by the given key
         *
         * @param key		the key (index)
         */
        this.del = function(key) {
            // is defined in memory, when skip persistdb
            if (mem_del(mem_pstore, key)) {
                return;
            }

            if (pstore) {
                pstore.remove(key);
            }
        };

        /**
         * This cleans the whole store; (deletes everything in it)
         */
        this.clear = function() {
            mem_pstore = {}; // empty mem storage

            if (pstore) {
                pstore.clear();
            }
        };

        /**
         * Removes  timed out items
         */
        this.vacuum = function() {
            mem_vacuum(mem_pstore);

            if (pstore) {
                pstore.vacuum();
            }
        };

        // =====
        // Global storage (player independent) storage
        //

        /**
         * This sets a value by key, in playerbased storage
         *
         * @param key		the key (index)
         * @param value		the value (data to store)
         * @param ttl		time-to-live, 0 means infinite
         */
        this.gset = function(key, value, ttl) {
            if (ttl < 0) {
                return;
            }

            if (!gstore || (ttl !== 0 && ttl <= _conf_inmemory)) {
                mem_set(mem_gstore, key, value, ttl);
                return;
            }

            if (gstore) {
                gstore.set(key, value, null, ttl);
            }
        };

        /**
         * This fetches a row by the given key
         *
         * @param key		the key (index)
         * @param callback		callback function ( Type: function(ok, data, param)
         *							ok is boolean; if data was found its true; otherwise its false, data contains the row, param the user param from get request )
         * @param scope		the scope where the callbackfunction gets called in
         */
        this.gget = function(key, callback, param, scope) {
            var data = mem_get(mem_gstore, key);
            if (data) {
                callback.call(scope || this, true, data, param);
                return;
            }

            if (gstore) {
                // it seems that we have sometimes trouble with invalid data.
                try {
                    gstore.get(key, callback, scope, param);
                } catch (e) {
                    // remove broken entry:
                    gstore.remove(key);
                    callback.call(scope || this, false, null, param);
                }
            } else {
                callback.call(scope || this, false, null, param);
            }
        };

        /**
         * This deletes a row by the given key
         *
         * @param key		the key (index)
         */
        this.gdel = function(key) {
            if (mem_del(mem_gstore, key)) {
                return;
            }

            if (gstore) {
                gstore.remove(key);
            }
        };

        /**
         * This Deletes the whole global cache (player independent) and
         * NOTE: it also deletes all local stores!
         */
        this.gclear = function() {
            // empty both memory stores
            mem_gstore = {};
            mem_pstore = {};

            if (gstore) {
                gstore.clear();

                for (var p in pstores) {
                    if (pstores.hasOwnProperty(p)) {
                        var tmpstore = new Persist.Store(p);

                        if (tmpstore) {
                            tmpstore.clear();
                        }

                        delete pstores[pstore_name];
                    }
                } //end each pstores

                pstores = {};

                init();
            }
        };

        /**
         * Removes items that are timed out..
         */
        this.gvacuum = function() {
            mem_vacuum(mem_gstore);

            if (gstore) {
                gstore.vacuum();
            }
        };

        init(useLocalStore);
    }

    window.GPLocalStore = GPLocalStore;
}());