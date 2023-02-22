/*globals NotificationType, Timestamp, HelperTown, GameEvents, WorldWondersWelcomeWindowFactory, WorldEndWelcomeWindowFactory,
GrepoNotificationStack, gpAjax, HelperLayout, JSON, Game */

(function() {
    'use strict';

    /**
     * Notification Stack, used to manage the visibility of notifications
     * ('Viewport')
     */
    window.GrepoNotificationStack = function notificationStack() {
        var ignore_units_box = false;
        var layout_reserved_height = 27; //bottom position + padding of the notification bar
        var unit_menu_bottom = 0;
        var spells_menu_bottom = 0;
        var max_notifications = 5;
        var hidden = [];
        var spawned = [];
        var notifybox_height = 44;

        var that = this;

        var $hidden_notification_count = null;

        /**
         * Update 'hidden'-counter
         */
        function setHiddenCountinLayout() {
            var len = hidden.length;

            if (!$hidden_notification_count || !$hidden_notification_count.length) {
                $hidden_notification_count = $('#hidden_notification_count');
            }

            $hidden_notification_count.html(len).toggle(!!len);
        }


        /**
         * Checks the current 'spawned' stack / num; and spawns if possible new notificatiosn from the hidden stack
         */
        function checkstack() {
            var newnotify;
            while (spawned.length < max_notifications && (newnotify = hidden.shift())) {
                spawned.push(newnotify);

                newnotify.attachToParent();

                $.Observer(GameEvents.notification.checkstack.spawned).publish(newnotify);
            }
            setHiddenCountinLayout();
        }

        /**
         * Handler for resize event
         */
        function recalcMaxNotifications() {
            //check if window is iframe
            //otherwise it will throw an error when changing the alliance emblem
            if (window.location !== window.parent.location) {
                return;
            }
            var height = $(window).height(),
                reserved_space = (unit_menu_bottom > spells_menu_bottom ? unit_menu_bottom : spells_menu_bottom),
                x = height - (layout_reserved_height + reserved_space),
                i = spawned.length;

            if (that.collidesWithSpellsMenu() || that.collidesWithUnitMenu() || ignore_units_box) {
                x = 1;
            } else {
                x /= notifybox_height;
            }

            x = parseInt(x, 10);

            if (x < max_notifications) {
                max_notifications = x;

                //  unspawn all and spawn new
                while (i--) {
                    var notify = spawned[i];
                    notify.despawn();

                    // store the now - despawned notification in hidden stack
                    notify = hidden.unshift(notify);

                    spawned.remove(i);
                }

                spawned = []; // reset all

                checkstack();

            } else if (x > max_notifications) {
                max_notifications = x;
                checkstack();
            }

        }

        this.collidesWithUnitMenu = function() {
            return notifybox_height > $(window).height() - (unit_menu_bottom + layout_reserved_height);
        };

        this.collidesWithSpellsMenu = function() {
            return notifybox_height > $(window).height() - (spells_menu_bottom + layout_reserved_height);
        };

        /**
         *
         */
        this.length = function length() {
            return hidden.length + spawned.length;
        };

        /**
         * applies a fucntion to all notifications
         *
         * @param callback Function
         */
        this.loop = function(callback) {
            var i = hidden.length;
            while (i--) {
                callback(i, hidden[i], hidden);
            }

            i = spawned.length;
            while (i--) {
                callback(i, spawned[i], spawned);
            }

            checkstack();
        };

        /**
         * Deletes outdated notifications
         */
        this.deleteOutdated = function() {
            var att = NotificationType.INCOMING_ATTACK,
                sup = NotificationType.INCOMING_SUPPORT,
                type,
                now = Timestamp.now();

            that.loop(function(i, elem, arr) {
                if (!elem) {
                    return;
                }
                if (((type = elem.getType()) === att || type === sup) && elem.getTime() < now) {
                    elem.destroy();
                    arr.remove(i);
                }
            });
        };

        this.setUnitMenuBottom = function(px) {
            if (px !== unit_menu_bottom) {
                unit_menu_bottom = px;
                recalcMaxNotifications();
            }
        };

        this.setSpellsMenuBottom = function(px) {
            if (px !== spells_menu_bottom) {
                spells_menu_bottom = px;
                recalcMaxNotifications();
            }
        };

        /**
         * Deletes all notifications (spawned and hidden)
         * from notification stack; also deletes it @ server
         *
         * Public function for interface
         */
        this.deleteByTypeAndParamID = function(type, param_id, dont_delete_on_server_side) {
            var opt, numeric_param_id = parseInt(param_id, 10);

            // No break in loops
            // cause its possible that there are several notifications for the same object
            // Like  a message ...
            this.loop(function(i, elem, arr) {
                opt = elem.getOpt();

                if (opt.type === type && opt.param_id === numeric_param_id) {
                    // Delete @@Server
                    if (!dont_delete_on_server_side) {
                        gpAjax.ajaxPost('notify', 'delete', {
                            'id': opt.id
                        }, false, function( /*data*/ ) {
                            // Destroy object (will also remove in stack and despawn in interface)
                            elem.destroy();
                            arr.remove(i);
                        });
                    } else {
                        // Destroy object (will also remove in stack and despawn in interface)
                        elem.destroy();
                        arr.remove(i);
                    }

                }
            });

            // Recheck.
            setHiddenCountinLayout();
            HelperTown.updateBrowserWindowTitle(); //I'm not sure if it still has to be here
        };

        /**
         * This function deletes a notification from the 'spawned' stack
         * note: this function should not called to destroy or hide or whatever a notification
         * it's used by the notification's destroy() method itself.
         */
        this.del = function(notification) {
            this.loop(function(i, elem, arr) {
                if (notification === elem) {
                    arr.remove(i);
                }
            });
            checkstack();
            $.Observer(GameEvents.notification.del).publish({
                notifications_count: spawned.length + hidden.length
            });
        };

        this.push = function(notification) {
            // when trying to add
            // check for some types for double notificated for the same thing.
            var nopt = notification.getOpt(),
                type = NotificationType.AWMESSAGE,
                opt,
                dupl = false;

            // Message Answer shouldnt generate more than one notification
            // so: check the hidden and show'n stack - to delete an older notification
            // OR: if this notification is older than an existing one for this object - delete this before it gets spawned.

            this.loop(function(i, elem, arr) {
                // notifications are fetched with each request: we don't know, in which order they will be received.
                if (elem.getId() === notification.getId()) {
                    return (dupl = true);
                }
                if (nopt.type === type) {
                    opt = elem.getOpt();
                    if (opt.type === type && opt.param_id === nopt.param_id) {
                        if (opt.time < nopt.time) {
                            // Delete @@Server
                            gpAjax.ajaxPost('notify', 'delete', {
                                'id': opt.id
                            }, false, function(data) {});

                            // Destroy object (will also remove in stack and despawn in interface)
                            elem.destroy();
                            arr.remove(i);
                        } else {
                            // delete this.
                            elem.destroy();
                            arr.remove(i);
                            return;
                        }
                    }
                }
            });

            if (!dupl) {
                hidden.push(notification);
                checkstack();
            }

            $.Observer(GameEvents.notification.push).publish({
                notifications_count: spawned.length + hidden.length,
                notification_height: notifybox_height
            });
        };

        this.deleteAttackPlanerNotification = function(notification_id) {
            GrepoNotificationStack.loop(function(i, elem, arr) {
                if (elem.getId() === notification_id) {
                    elem.destroy();
                    arr.remove(i);
                    return;
                }
            });
        };

        this.deleteBotCheckNotification = function() {
            GrepoNotificationStack.loop(function(i, elem, arr) {
                if (elem.getType() === NotificationType.BOTCHECK) {
                    elem.destroy();
                    arr.remove(i);
                }
            });
        };

        this.deleteNotificationDependingOnTypeAndId = function(notification_id, type) {
            GrepoNotificationStack.loop(function(i, elem, arr) {
                if (elem.getId() === notification_id && elem.getType() === type) {
                    gpAjax.ajaxPost('notify', 'delete', {
                        'id': notification_id
                    }, false, function() {
                        elem.destroy();
                        arr.remove(i);
                    });
                }
            });
        };

        recalcMaxNotifications();

        $(window).on("resize", recalcMaxNotifications);

        $.Observer(GameEvents.ui.layout_units.rendered).subscribe('NotificationStack', function(e, data) {
            that.setUnitMenuBottom(data.unit_menu_bottom);
        });

        $.Observer(GameEvents.ui.layout_gods_spells.rendered).subscribe('NotificationStack', function(e, data) {
            that.setSpellsMenuBottom(data.spells_menu_bottom);
        });

        $.Observer(GameEvents.ui.layout_gods_spells.state_changed).subscribe('NotificationStack', function(e, data) {
            that.setSpellsMenuBottom(0);
        });

        $.Observer(GameEvents.notification.system.arrive).subscribe(['removeAttackNotification', 'notification_js'], function(evt, notification) {
            that.deleteByTypeAndParamID(NotificationType.INCOMING_ATTACK, notification.param_id, true);
        });

        $.Observer(GameEvents.notification.system.arrive).subscribe(['removeSupportNotification', 'notification_js'], function(evt, notification) {
            that.deleteByTypeAndParamID(NotificationType.INCOMING_SUPPORT, notification.param_id, true);
        });

        $.Observer(GameEvents.notification.system.arrive).subscribe('ageOfWonderStarted', function(e, data) {
            var param_data = JSON.parse(data.param_str),
                age_of_wonder_started_at = param_data.age_of_wonder_started_at;
            WorldWondersWelcomeWindowFactory.openWindow(age_of_wonder_started_at);
        });

        $.Observer(GameEvents.notification.system.arrive).subscribe('startShutdownCountdown', function(e, data) {
            var param_data = JSON.parse(data.param_str),
                gift_data = [];

            gift_data.push({
                type: 'hint.world_ends',
                days_left_until_shutdown: param_data.days_left_until_shutdown,
                new_world_exists: param_data.new_world_exists,
                new_world_selection_url: param_data.new_world_selection_url
            });

            WorldEndWelcomeWindowFactory.openWindow(HelperLayout.getGiftData(gift_data, 'hint.world_ends'));
        });

        return this;
    }.call({});
}());