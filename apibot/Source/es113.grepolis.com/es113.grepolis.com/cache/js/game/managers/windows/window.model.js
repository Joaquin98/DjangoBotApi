/*global $, Backbone, us, WM, DM, Logger, GameEvents, MM, gpAjax, Game */

(function(views, collections, models, gamemodels, gamecollections) {
    'use strict';

    var ALL = 'all_data';
    var LOWEST_ZINDEX = 999;

    function prettyPrintRenderPageTemplates(templates, base_namespace, known_data, needed_data, placeholder, namespace_arg) {
        var msg_arr = [],
            namespace = namespace_arg || base_namespace,
            key_or_namespace,
            template_or_subtemplates,
            known_data_element_name,
            element,
            element_name,
            cached;

        for (key_or_namespace in templates) {
            if (templates.hasOwnProperty(key_or_namespace) && needed_data) {
                template_or_subtemplates = templates[key_or_namespace];
                if (typeof(template_or_subtemplates) === 'string') {
                    if ((namespace === base_namespace && needed_data[key_or_namespace] !== undefined) ||
                        (namespace !== base_namespace && needed_data[namespace] !== undefined && needed_data[namespace][key_or_namespace] !== undefined)) {
                        element = {};
                        element_name = (base_namespace === namespace ? '[' + base_namespace + '.]' : namespace + '.') + key_or_namespace;
                        element[needed_data[key_or_namespace]] = templates[key_or_namespace];
                        known_data_element_name = namespace + '__' + key_or_namespace;
                        cached = known_data === ALL || (known_data && known_data.indexOf(known_data_element_name) !== -1);
                        msg_arr.push('\n' + (placeholder || 'templates') + ' ' + element_name, element, (cached ? '- was PRELOADED' : ''));

                        placeholder = '';
                        //weird McAfee heuristic - please don't remove additional braces
                        while ((placeholder.length < 'templates'.length)) {
                            placeholder += ' ';
                        }
                    }
                } else {
                    Array.prototype.push.apply(msg_arr,
                        prettyPrintRenderPageTemplates(template_or_subtemplates, base_namespace, known_data, needed_data, placeholder, key_or_namespace));
                }
            }
        }

        return msg_arr;
    }

    function getModelNameForVariable(object_id) {
        return object_id.replace(/(?:\b|_)(.)/g, function(x, chr) {
            return chr.toUpperCase();
        });
    }

    function prettyPrintRenderPage(window_model, tab_model, render_type, data, known_data) {
        var rawCreationArguments = [],
            creationArguments = '',
            header,
            msg_arr,
            needed_data = tab_model.getRequiredData(window_model.getType()),
            types = ['models', 'collections', 'templates'],
            idx, types_length = types.length,
            type, placeholder,
            elements,
            element_name,
            model_name,
            element,
            cached,
            arg_name, arg;

        for (arg_name in window_model.getArguments()) {
            if (window_model.getArguments().hasOwnProperty(arg_name)) {
                arg = window_model.getArguments()[arg_name];
                rawCreationArguments.push(arg_name + ': ' + arg);
            }
        }

        if (rawCreationArguments.length) {
            creationArguments = '{' + rawCreationArguments.join(', ') + '}';
        }

        header = window_model.getType() + '.' + tab_model.getType() + '.renderPage(' + creationArguments + ') ' + render_type;
        msg_arr = [header];

        for (idx = 0; idx < types_length; ++idx) {
            type = types[idx];
            placeholder = undefined;

            if (data.hasOwnProperty(type)) {
                elements = data[type];

                if (type === 'templates') {
                    Array.prototype.push.apply(
                        msg_arr, prettyPrintRenderPageTemplates(elements, window_model.getType(), known_data.templates || ALL, needed_data.templates));
                } else {
                    for (element_name in elements) {
                        if (elements.hasOwnProperty(element_name) && needed_data[type]) {
                            model_name = getModelNameForVariable(element_name);
                            if (needed_data[type][model_name] !== undefined) {
                                element = elements[element_name];
                                cached = known_data === ALL || (known_data[type] && known_data[type].indexOf(model_name) !== -1);
                                msg_arr.push('\n' + (placeholder || type) + ' ' + element_name, element, (cached ? '- was PRELOADED' : ''));

                                placeholder = '';
                                //weird McAfee heuristic - please don't remove additional braces
                                while ((placeholder.length < type.length)) {
                                    placeholder += ' ';
                                }
                            }
                        }
                    }
                }
            }
        }

        return msg_arr;
    }

    function getVariableNameForClass(str) {
        return str.replace(/([A-Z])/g, function(capital) {
            return '_' + capital.toLowerCase();
        }).replace(/^_/, '');
    }

    models.WindowModel = Backbone.Model.extend({
        defaults: {
            skin: 'wnd_skin_classic',
            css_class: '',

            max_instances: Infinity,

            //Look
            title: 'Default title',
            width: 650,
            height: false,
            minwidth: 150,
            minheight: 200,
            maxwidth: null,
            maxheight: null,
            visible: true,
            //modal means that the curtain will show up and user won't be able to do anything as long as he does not close the window
            modal: false,
            loading: false,
            position: ['center', 'center'], //[vertical, horizontal]
            resizable: false,
            closable: true,
            minimizable: true,
            minimized: false,
            focused: false,
            zindex: 1000,

            //If its set to true it means that it will not be closed by the 'close all buttons window'
            is_important: false,

            special_buttons: {}, //'help'

            // stuff about runtime behaviour in regard to tabs
            activepagenr: 0,
            tabs: []
        },

        initialize: function( /*attributes*/ ) {
            this.data = WM.getAlreadyLoadedData(this);
            this.data.templates = {};
            this.augmentTabsData();
        },

        /**
         * Returns information whether the window has 'help' button or not
         *
         * @return {Boolean}
         */
        hasHelpButton: function() {
            return this.getHelpButtonSettings() !== undefined;
        },

        _extendDataObject: function(data, tab_model) {
            var additional_data = {
                cm_context: {
                    main: this.cid,
                    sub: tab_model.cid
                }
            };

            return $.extend(true, additional_data, data);
        },

        requestTabData: function(tab_model, callback) {
            var that = this,
                can_skip_load_request = this.canSkipLoadRequestAndCopyPreloaded(tab_model),
                known_data;

            if (can_skip_load_request) {
                Logger.get('windows').log(function() {
                    return prettyPrintRenderPage(that, tab_model, '- everything CACHED', that.data, ALL);
                });

                callback(this._extendDataObject(this.data, tab_model));
            } else {
                known_data = this.getKnownDataIds(tab_model);

                gpAjax.ajaxGet('frontend_bridge', 'fetch', {
                    window_type: this.getType(),
                    tab_type: tab_model.getType(),
                    known_data: known_data,
                    'arguments': this.getArguments()
                }, true, {
                    success: function(layout, data /*, retdata, flag, t_token*/ ) {
                        /*try {*/
                        //Store templates within data manager
                        if (data.templates) {
                            DM.loadData({
                                'templates': data.templates
                            });
                            that.canSkipTemplateLoadAndCopyPreloaded(data.templates);
                        }

                        us.extend(that.data.models, that.preloaded_data.models, MM.createBackboneObjects(data.models, gamemodels, that.getArguments()));
                        us.extend(that.data.collections, that.preloaded_data.collections, MM.createBackboneObjects(data.collections, gamecollections, that.getArguments()));

                        Logger.get('windows').log(function() {
                            return prettyPrintRenderPage(that, tab_model, '- via SERVER request', that.data, known_data);
                        });

                        callback(that._extendDataObject(that.data, tab_model));
                        /*} catch (e) {
                        	Logger.get('error').log(that.getType() + '.' + tab_model.getType() + '.render() throw an exception:', e);
                        }*/
                    },
                    error: function(layout, error) {
                        if (error && error.gpWindowclose) {
                            that.close();
                        }
                    }
                });
            }
        },

        setPreloadedData: function(data) {
            this.preloaded_data = data;
        },

        getPreloadedData: function() {
            return this.preloaded_data;
        },

        replaceModels: function(models) {
            return this.replaceData({
                models: models
            });
        },

        replaceCollections: function(collections) {
            return this.replaceData({
                collections: collections
            });
        },

        replaceData: function(new_data) {
            var type,
                data,
                name,
                class_name,
                rerender = false,
                tab_data;

            for (type in new_data) {
                if (new_data.hasOwnProperty(type)) {
                    data = new_data[type];
                    if (!this.preloaded_data) {
                        this.preloaded_data = {};
                    }

                    if (!this.preloaded_data[type]) {
                        this.preloaded_data[type] = {};
                    }

                    for (name in data) {
                        if (data.hasOwnProperty(name)) {
                            class_name = getModelNameForVariable(name);
                            this.preloaded_data[type][name] = data[name];

                            if (this.data && this.data[type] && this.data[type][name]) {
                                if (!this.preloaded_data[type][name] && typeof this.data[type][name].unregisterFromModelManager === 'function') {
                                    this.data[type][name].unregisterFromModelManager();
                                }
                                delete this.data[type][name];
                            }

                            tab_data = this.getActivePage().getRequiredData(this.getType());
                            if (tab_data && tab_data[type] && tab_data[type][class_name] !== undefined) {
                                rerender = true;
                            }
                        }
                    }
                }
            }

            if (rerender) {
                this.trigger('data:replaced');
            }
        },

        canSkipLoadRequestAndCopyPreloaded: function(tab_model) {
            var needed_data = tab_model.getRequiredData(this.getType()),
                data_type,
                data,
                datum,
                instance_name,
                skip_request = true;

            for (data_type in needed_data) {
                if (needed_data.hasOwnProperty(data_type)) {
                    data = needed_data[data_type];

                    for (datum in data) {
                        if (data.hasOwnProperty(datum)) {
                            if (data_type === 'models' || data_type === 'collections') {
                                instance_name = getVariableNameForClass(datum);
                                if (this.preloaded_data && this.preloaded_data[data_type] && // there is preloaded data of this type
                                    this.preloaded_data[data_type][instance_name] && // there is preloaded data of this class
                                    !this.data[data_type][instance_name] // it is not already in this windows data
                                ) {
                                    this.data[data_type][instance_name] = this.preloaded_data[data_type][instance_name];
                                }

                                skip_request = skip_request && this.data[data_type][instance_name];
                            } else if (data_type === 'templates') {
                                // order is important, the method has always to be executed!
                                skip_request = this.canSkipTemplateLoadAndCopyPreloaded(data) && skip_request;
                            }

                            if (!skip_request) {
                                return false;
                            }
                        }
                    }
                }
            }

            return skip_request;
        },

        canSkipTemplateLoadAndCopyPreloaded: function(data, namespace_arg) {
            var skip_request = true,
                key_or_namespace,
                path_or_subdata,
                namespace = namespace_arg || this.getType();

            for (key_or_namespace in data) {
                if (data.hasOwnProperty(key_or_namespace)) {
                    path_or_subdata = data[key_or_namespace];
                    if (typeof(path_or_subdata) === 'string') {
                        // path
                        if (DM.hasTemplate(namespace, key_or_namespace)) {
                            if (namespace === this.getType()) {
                                this.data.templates[key_or_namespace] = DM.getTemplate(namespace, key_or_namespace);
                            } else {
                                if (!this.data.templates[namespace]) {
                                    this.data.templates[namespace] = {};
                                }
                                this.data.templates[namespace][key_or_namespace] = DM.getTemplate(namespace, key_or_namespace);
                            }
                        } else {
                            skip_request = false;
                        }
                    } else {
                        // subdata
                        if (namespace_arg) {
                            // recursion is only allowed to happen one level deep!
                            skip_request = false;
                            Logger.get('error').log('Window.canSkipTemplateLoadAndCopyPreloaded(), recursion level to deep: ', namespace_arg);
                        }
                        // order is important, the method has always to be executed!
                        skip_request = this.canSkipTemplateLoadAndCopyPreloaded(path_or_subdata, key_or_namespace) && skip_request;
                    }
                }
            }

            return skip_request;
        },

        augmentTabsData: function() {
            // add an index to the tab data
            this.set(
                'tabs',
                us.map(this.get('tabs'), function(tab_data, nr) {
                    tab_data.index = nr;
                    return tab_data;
                })
            );
        },

        bringToFront: function() {
            this.collection.bringToFront(this);
        },

        /**
         * moves a window to the lowest possible zIndex (999 - all other windows start at 1000)
         * -> this only works for one window, in contrast to bringToFront
         */
        moveToBack: function() {
            this.setZIndex(LOWEST_ZINDEX);
        },

        removeFocus: function() {
            this.set('focused', false);
        },

        /**
         * Returns whether the focus is on the window or not
         *
         * @return {Boolean}
         */
        isFocused: function() {
            return this.getFocus();
        },

        isModal: function() {
            return this.get('modal');
        },

        /**
         * true if the window is of type dialog
         * @return {Boolean}
         */
        isDialog: function() {
            return this.getType() === 'dialog';
        },

        /**
         * Makes window visible
         */
        show: function() {
            this.set({
                visible: 1
            });
        },

        /**
         * Makes window invisible
         */
        hide: function() {
            this.set({
                visible: 0
            });
        },

        /**
         * Maximizes window
         */
        maximize: function() {
            this.set({
                minimized: false,
                visible: true,
                focused: true
            });

            $.Observer(GameEvents.window.maximize).publish({
                window_type: 'new',
                window_sub_type: this.getType()
            });
        },

        /**
         * Minimizes window
         */
        minimize: function() {
            if (this.isMinimizable()) {
                this.set({
                    minimized: true,
                    visible: false,
                    focused: false
                });
            }
        },

        isMinimized: function() {
            return this.get('minimized');
        },

        isMaximized: function() {
            return !this.get('minimized');
        },

        isMinimizable: function() {
            return this.get('minimizable');
        },

        isClosable: function() {
            return this.get('closable');
        },

        setIsImportant: function(boolval) {
            this.set('is_important', boolval);
        },

        getIsImportant: function() {
            return this.get('is_important');
        },

        /**
         * Returns information whether the window is resizable or not
         *
         * @return {Boolean}
         */
        isResizable: function() {
            return this.get('resizable') === true;
        },

        isVisible: function() {
            return this.get('visible');
        },

        close: function() {
            WM.closeWindow(this);
        },

        /**
         * Action done by user clicking on the X button
         */
        manualClose: function() {
            WM.closeWindow(this, {
                manual_close: true
            });
        },

        /**
         * Callback when X button on window is clicked
         * @param fn function to call onManualClose (if it returns false, window will not close)
         */
        setOnManualCloseCallback: function(fn) {
            this.onManualClose = fn;
        },

        /**
         * By this function you can set onBeforeClose event for the window
         *
         * @param {Function} fn   function which will be executed before
         *                        window is closed (if it returns false, window will not close)
         */
        setOnBeforeClose: function(fn) {
            this.onBeforeClose = fn;
        },

        /**
         * By this function you can set onAfterClose event for the window
         *
         * @param {Function} fn   function which will be executed after
         *                        window is closed
         */
        setOnAfterClose: function(fn) {
            this.onAfterClose = fn;
        },

        /**
         * By this function you can set onBeforeReload event for the window
         *
         * @param {Function} fn   function which will be executed before
         *                        window is reloaded
         */
        setOnBeforeReload: function(fn) {
            this.onBeforeReload = fn;
        },

        /**
         * By this function you can set onAfterReload event for the window
         *
         * @param {Function} fn   function which will be executed after
         *                        window is reloaded
         */
        setOnAfterReload: function(fn) {
            this.onAfterReload = fn;
        },

        /**
         * This function is always called before window is closed
         */
        _onBeforeReload: function() {
            //Trigger that window will close and stuff should be cleand up
            this.trigger('window:beforereload', this);
        },

        _onAfterReload: function() {
            //Trigger that window will close and stuff should be cleand up
            this.trigger('window:afterreload', this);
        },

        _onBeforeClose: function() {
            //Trigger that window will close and stuff should be cleand up
            this.trigger('window:beforeclose', this);
        },

        _onManualClose: function() {
            this.trigger('window:manualclose', this);
        },

        _onAfterClose: function() {
            try {
                //Trigger that window has been closed
                this.trigger('window:afterclose', this);
                $.Observer(GameEvents.window.close).publish({
                    window_obj: this,
                    type: this.getType(),
                    id: this.getIdentifier()
                });

                this.cleanData();
            } catch (e) {
                Logger.get('error').log(this.getType() + '.' + (typeof this.getActivePage() !== 'undefined') ? this.getActivePage().getType() : '' + '._onAfterClose() throw an exception:', e);
            }
        },

        cleanData: function() {
            us.each(['models', 'collections'], function(type, idx) {
                if (!this.data.hasOwnProperty(type)) {
                    return;
                }

                us.each(this.data[type], function(datum, id) {
                    // if it was not preloaded and no other window needs the data, remove it
                    if (!(this.preloaded_data && this.preloaded_data[type] && this.preloaded_data[type][id] !== undefined) &&
                        !WM.otherOpenWindowNeedsData(type, id, this.getArguments())
                    ) {
                        var is_persistent = typeof datum.isPersistent === 'function' && datum.isPersistent();

                        if (datum && !is_persistent) {
                            if (typeof datum.unregisterFromModelManager === 'function') {
                                datum.unregisterFromModelManager();
                            }
                        }
                        delete this.data[type][id];
                    }
                }.bind(this));
            }.bind(this));
        },

        showLoading: function() {
            this.set('loading', true);
        },

        hideLoading: function() {
            this.set('loading', false);
        },

        /**
         *
         */
        isLoading: function() {
            return this.get('loading') === true;
        },

        /**
         * Sends a signal to the controller to reset it's position (default centered)
         */
        requestPositionReset: function() {
            this.trigger('request_position_reset');
        },

        updateArgumentsAndActivePageNr: function(updates, activepagenr) {
            var current_args = us.extend({}, this.getArguments()),
                property, update,
                has_changed = false,
                props = {};

            for (property in updates) {
                if (updates.hasOwnProperty(property)) {
                    update = updates[property];
                    has_changed = has_changed || current_args[property] !== update;
                    current_args[property] = update;
                }
            }

            //Its added because there is a possibility to change opened tab in the window programatically
            //unfortunately new arguments and activepagenr wants to rerender content
            if (activepagenr !== null) {
                if (has_changed) {
                    props.silent = true;
                }

                this.setActivePageNr(activepagenr, props);
            }

            if (has_changed) {
                this.set('args', current_args);
                this.trigger('data:replaced');
            }
        },

        //========================================
        // -------------- Setters ----------------
        //========================================

        /**
         * Sets arguments of the window
         *
         * @param {Object} data
         */
        setArguments: function(data) {
            this.set('args', data);
        },

        /**
         * Sets focus of the window
         *
         * @param {Boolean} value
         */
        setFocus: function(value) {
            this.set('focused', value);
        },

        /**
         * Sets window's title
         *
         * @param {String} value   new title
         */
        setTitle: function(value) {
            this.set({
                title: value
            });
        },

        /**
         * Sets active page number
         *
         * @param {Number} nr      page number
         * @param {Object} props   properties allowed by Backbone.Model (@see reference)
         */
        setActivePageNr: function(nr, props) {
            this.set({
                activepagenr: nr
            }, props);
        },

        /**
         * Sets z-index of the window
         *
         * @param value
         */
        setZIndex: function(value) {
            this.set('zindex', value);
        },

        //========================================
        // -------------- Getters ----------------
        //========================================

        getWidth: function() {
            return this.get('width');
        },

        setWidth: function(width) {
            this.set('width', width);
        },

        getHeight: function() {
            return this.get('height');
        },

        setHeight: function(height) {
            this.set('height', height);
        },

        getMinWidth: function() {
            return this.get('minwidth');
        },

        getMinHeight: function() {
            return this.get('minheight');
        },

        getMaxWidth: function() {
            return this.get('maxwidth');
        },

        getMaxHeight: function() {
            return this.get('maxheight');
        },

        /**
         * Returns an array which keeps positions of the window which is NOT represented in pixels
         * but in strings ['center', 'center'] -> ['ver', 'hor']
         * Currently only 'center' is handled.
         *
         * @return {Array}
         */
        getPosition: function() {
            return this.get('position');
        },

        /**
         * Returns arguments the window was initialized with
         *
         * @return {Object}
         */
        getArguments: function() {
            return this.get('args');
        },

        /**
         * Returns active page number
         *
         * @return {Number}
         */
        getActivePageNr: function() {
            return this.get('activepagenr');
        },

        /**
         * Return zindex of the window
         *
         * @return {Number}
         */
        getZIndex: function() {
            return this.get('zindex');
        },

        /**
         * Returns active tab model
         *
         * @return {WindowManagerModels.TabModel}
         */
        getActivePage: function() {
            return this.getTabsCollection().getTabByNumber(this.getActivePageNr());
        },

        /**
         * Returns information whether the window is focused or not
         *
         * @return {Boolean}
         */
        getFocus: function() {
            return this.get('focused');
        },

        /**
         * Return title of the window
         *
         * @return {String}
         */
        getTitle: function() {
            return this.get('title');
        },

        /**
         * Returns window type
         *
         * @return {String}
         */
        getType: function() {
            return this.get('window_type');
        },

        /**
         * Returns maximal possible amount of instances of this window
         *
         * @return {Number}
         */
        getMaxInstances: function() {
            return this.get('max_instances');
        },

        /**
         * Returns unique identifier for the window
         *
         * @return {Number|String}
         */
        getIdentifier: function() {
            return this.cid;
        },

        /**
         * Returns window class name
         *
         * @return {String}
         */
        getCssClass: function() {
            return this.get('css_class');
        },

        getId: function() {
            return this.id;
        },

        /**
         * Returns skin name
         *
         * @return {String}
         */
        getSkinName: function() {
            return this.get('skin');
        },

        /**
         * Returns settings of the help button
         *
         * @return {Object}
         */
        getHelpButtonSettings: function() {
            return this.get('special_buttons').help;
        },

        /**
         * Returns collection of the tabs
         *
         * @return {WindowManagerCollections.TabsCollection}
         */
        getTabsCollection: function() {
            if (!this.tabs_collection) {
                this.tabs_collection = new collections.TabsCollection(this.get('tabs'));
            }

            return this.tabs_collection;
        },

        getKnownDataIds: function(tab_model) {
            var known_data = {
                    models: [],
                    collections: [],
                    templates: []
                },
                needed_data = this.getRequiredData(tab_model),
                class_name,
                that = this;

            us.each([this.data, this.preloaded_data], function(src) {
                if (src) {
                    us.each(['models', 'collections', 'templates'], function(type) {
                        var datum_name,
                            data = src[type],
                            datum;

                        if (type === 'templates') {
                            Array.prototype.push.apply(known_data.templates, that.getKnownTemplateIds(needed_data.templates, data));
                        } else {
                            for (datum_name in data) {
                                if (data.hasOwnProperty(datum_name)) {
                                    datum = data[datum_name];
                                    if (datum !== undefined && // it may be undefined, if it was loaded once in this window scope
                                        needed_data[type] // may be false, of we do not need any data of this type
                                    ) {
                                        class_name = getModelNameForVariable(datum_name);
                                        if (needed_data[type][class_name] !== undefined) {
                                            known_data[type].push(class_name);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });

            return known_data;
        },

        getRequiredData: function(tab_model) {
            return tab_model.getRequiredData(this.getType());
        },

        getKnownTemplateIds: function(needed, loaded, namespace_arg) {
            var known_data = [],
                key_or_namespace,
                template_or_subloaded,
                namespace = namespace_arg || this.getType();

            for (key_or_namespace in loaded) {
                if (loaded.hasOwnProperty(key_or_namespace)) {
                    template_or_subloaded = loaded[key_or_namespace];
                    if (typeof(template_or_subloaded) === 'string') {
                        // path
                        if (needed && needed[key_or_namespace]) {
                            known_data.push(namespace + '__' + key_or_namespace);
                        }
                    } else {
                        // subdata
                        if (namespace_arg) {
                            // recursion is only allowed to happen one level deep!
                            Logger.get('error').log('Window.canSkipTemplateLoadAndCopyPreloaded(), recursion level to deep: ', namespace_arg);
                        }
                        // order is important, the method has always to be executed!
                        Array.prototype.push.apply(known_data, this.getKnownTemplateIds(needed[key_or_namespace], template_or_subloaded, key_or_namespace));
                    }
                }
            }

            return known_data;
        },

        /**
         * extra_data can be used to store window specific stuff in the model, e.g. get data from the window_settings
         * Example:
         * window_settings : {
         *  extra_data : {
         *   ribbon: 'red'
         *  }
         * }
         */
        getExtraData: function() {
            return this.get('extra_data');
        },

        /**
         * setData / getData allows you to store data on the window_model which survive
         * tab_controller creation / deletion
         * You should never use "collections", "models", "templates" as keys, they are special
         * See cleanData if these data should survive closing the window
         *
         * Since all these data is stored in this.data instead of attributes all the usual backbone
         * stuff does not work
         */
        setData: function(key, object) {
            this.data[key] = object;
        },

        getData: function(key) {
            return this.data[key] || null;
        },

        hasKey: function(key) {
            return typeof this.data[key] !== 'undefined';
        },

        //========================================
        // ---------- Event Listeners ------------
        //========================================

        onDataReplace: function(obj, callback) {
            obj.listenTo(this, 'data:replaced', callback);
        },
        onMinimizedChange: function(obj, callback) {
            obj.listenTo(this, 'change:minimized', callback);
        },
        onVisibleChange: function(obj, callback) {
            obj.listenTo(this, 'change:visible', callback);
        },
        onTitleChange: function(obj, callback) {
            obj.listenTo(this, 'change:title', callback);
        },
        onZIndexChange: function(obj, callback) {
            obj.listenTo(this, 'change:zindex', callback);
        },
        onLoadingChange: function(obj, callback) {
            obj.listenTo(this, 'change:loading', callback);
        },
        onWidthChange: function(obj, callback) {
            obj.listenTo(this, 'change:width', callback);
        },
        onHeightChange: function(obj, callback) {
            obj.listenTo(this, 'change:height', callback);
        },
        onRequestPositionReset: function(obj, callback) {
            obj.listenTo(this, 'request_position_reset', callback);
        }
    });
}(window.WindowManagerViews, window.WindowManagerCollections, window.WindowManagerModels, window.GameModels, window.GameCollections));