/*global Timestamp, TM, Layout, GameEvents, gpAjax */

(function() {
    'use strict';

    var GameControllers = require_legacy('GameControllers');

    var AcceptGiftController = GameControllers.TabController.extend({
        _expiration_interval_id: null,

        initialize: function(options) {
            //Don't remove it, it should call its parent
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
        },

        /**
         * Sets an interval to check every x seconds if the gift is expired
         * and close this window if it is expired
         */
        setExpirationInterval: function(timer_name, expire_date) {
            if (expire_date && expire_date > 0) {
                var diff = (expire_date - Timestamp.now()) * 1000;

                if (diff > 0 && this._expiration_interval_id === null) {
                    this._expiration_interval_id = timer_name;

                    TM.unregister(this._expiration_interval_id);
                    TM.register(this._expiration_interval_id, diff, function() {
                        this._expiration_interval_id = null;

                        var daily_login_gift_model = this.getModel('daily_login_bonus');
                        if (daily_login_gift_model) {
                            daily_login_gift_model.forceUpdate(function() {
                                // Close any open context menus to avoid actions on the wrong reward
                                if (Layout && Layout.obj_context_menu) {
                                    Layout.obj_context_menu.close();
                                }
                                this.reRender();
                            }.bind(this));
                        } else {
                            this.closeWindow();
                        }
                    }.bind(this), {
                        max: 1
                    });
                }
            }
        },

        clearExpirationInterval: function() {
            if (this._expiration_interval_id !== null) {
                TM.unregister(this._expiration_interval_id);
                this._expiration_interval_id = null;
            }
        },

        onAcceptReward: function(gift_id, option, reward_type, reward_level) {
            gpAjax.ajaxPost('gift', 'accept', {
                'gift_id': gift_id,
                'option': option
            }, true, function() {
                $.Observer(GameEvents.window.daily_bonus.accept).publish({
                    gift_id: gift_id,
                    option: option,
                    reward_type: reward_type,
                    reward_lvl: reward_level
                });

                this.closeWindow();
            }.bind(this));
        },

        destroy: function() {
            this.clearExpirationInterval();
        }
    });

    window.GameControllers.AcceptGiftController = AcceptGiftController;
}());