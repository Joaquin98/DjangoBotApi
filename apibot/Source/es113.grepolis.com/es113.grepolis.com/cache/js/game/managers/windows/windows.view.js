/*global Backbone, $, GameEvents, Game, WM, HelperBrowserEvents */

(function(views, controllers, collections) {
    "use strict";

    var isiOS = Game.isiOs(),
        $document = $(document);

    views.WindowsView = Backbone.View.extend({
        el: 'body',

        //Object which keeps all window view instances
        window_views: {},
        first_time_rendered: false,

        initialize: function(options) {
            var _self = this,
                collection = this.collection,
                extended_window_manager = this.extended_window_manager = options.extended_window_manager;

            var $main_area = this.$el;

            collection.on('reset', this.render, this);
            collection.on('add', this.renderWindow, this);
            collection.on('remove', this.removeWindow, this);

            //Initialize collection which will manage all minimized windows
            var MinimizedWindows = new collections.MinimizedWindows();

            $.Observer(GameEvents.window.tab.rendered).subscribe('WindowsView', function(e, data) {
                if (!_self.isFirstTimeRendered()) {
                    var window_view = _self.getWindowView(data.window_model.cid);

                    if (window_view) {
                        window_view.updateWindowVerticalPosition();
                    }
                    _self.setFirstTimeRendered(true);
                }
            });

            $.Observer(GameEvents.main_menu.init).subscribe('WindowsView', function() {
                _self.MinimizedWndManager = new views.ViewMinimizedWindows({
                    el: $("#minimized_windows_area"),
                    collection: MinimizedWindows,
                    open_windows: collection,
                    extended_window_manager: extended_window_manager
                });
            });

            $.Observer(GameEvents.document.key.esc.down).subscribe('closeWindowWithEscBtn', function(e, key_e, is_input) {
                WM.closeFrontWindow();
            });

            var namespace = "new_windows_manager",
                onStartEventName = HelperBrowserEvents.getOnStartEventName(namespace),
                onStopEventName = HelperBrowserEvents.getOnStopEventName(namespace),
                onMoveEventName = HelperBrowserEvents.getOnMoveEventName(namespace) +
                (isiOS ? ' touchmove.old_windows_manager_ipad' : '');

            var dragDropHandler = function(e) {
                var $delegate_target = $(e.delegateTarget),
                    $window = $(e.currentTarget),
                    $target = $(e.target);

                //This fallback is for the case when delegate target is a 'document'
                var delegate_target_offset = $delegate_target.offset() || {
                    left: 0,
                    top: 0
                };

                if (isiOS && e.type === "mousedown") {
                    return;
                }

                e = e.type === "touchstart" ? e.originalEvent.touches[0] : e;

                var ma_width = $main_area.outerWidth(),
                    ma_height = $main_area.outerHeight(),
                    w_width = $window.outerWidth(),
                    w_height = $window.outerHeight(),
                    w_offset = $window.offset(),
                    scaling = Game.ui_scale.normalize.factor,
                    dx, dy,
                    sx = e.clientX,
                    sy = e.clientY;

                if ($target.hasClass('js-window-move') || $target.hasClass('ipad_drag_element')) {
                    $document.on(onMoveEventName, function(e) {
                        e = e.type === "touchmove" ? e.originalEvent.touches[0] : e;

                        dx = (w_offset.left - delegate_target_offset.left + (e.clientX - sx)) * scaling;
                        dy = (w_offset.top - delegate_target_offset.top + (e.clientY - sy)) * scaling;

                        //Limit movement to size of the main_area container
                        dx = Math.min(Math.max(0, dx), ma_width - w_width);
                        if (ma_height > w_height) {
                            dy = Math.min(Math.max(0, dy), ma_height - w_height);
                        } else {
                            dy = Math.min(Math.max(0, dy), ma_height - 100);
                        }

                        $window.css({
                            left: dx,
                            top: dy,
                            right: 'auto',
                            bottom: 'auto'
                        });
                    });

                    $document.on(onStopEventName, function(e) {
                        $document.off(onMoveEventName);
                    });
                }
            };

            $main_area.on(onStartEventName, '.js-window-main-container', dragDropHandler);
            //This is workaround for d&d for old windows, please remove it when there are no longer any old window
            $document.on('touchstart.old_windows_manager_ipad', '.ui-dialog', dragDropHandler);
        },

        render: function() {
            // render all currently open windows
            this.collection.each(this.renderWindow);

            return this;
        },

        isFirstTimeRendered: function() {
            return this.first_time_rendered;
        },

        setFirstTimeRendered: function(value) {
            this.first_time_rendered = value;
        },

        getMinimizedWindowsView: function() {
            return this.MinimizedWndManager;
        },

        getWindowView: function(cid) {
            return this.window_views[cid];
        },

        renderWindow: function(window_model) {
            var view = new controllers.WindowController({
                $parent: this.$el,
                models: {
                    window: window_model
                },
                collections: {
                    windows: this.collection
                },
                extended_window_manager: this.extended_window_manager,
                cm_context: {
                    main: 'window_controller',
                    sub: window_model.cid
                }
            });

            //Save view object
            this.window_views[window_model.cid] = view;

            //Create window HTML (this is base shape of the window)
            view.render();

            //Position window depends on the settings in model
            view.updateWindowPosition();

            //Publih, that window has been opened
            $.Observer(GameEvents.window.open).publish(window_model);
        },

        removeWindow: function(model) {
            //Get window view and destroy it
            var cid = model.cid,
                controller = this.getWindowView(cid);

            //calling _destroy to call also parent destroy which will call .destroy()
            controller._destroy();

            //Remove window view object from the collection view
            if (this.window_views[cid]) {
                delete this.window_views[cid];
            }

            //Execute onAfterClose function specified by developer
            /*if (typeof model.onAfterClose === "function") {
            	model.onAfterClose();
            }*/

            //Execute onAfterClose function
            /*model._onAfterClose();*/
        },

        remove: function() {
            this.setFirstTimeRendered(false);
        }
    });
}(window.WindowManagerViews, window.WindowManagerControllers, window.WindowManagerCollections, window.WindowManagerModels));