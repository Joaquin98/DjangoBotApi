/*global GameEvents, GrepoNotificationStack, Backbone */

define('listeners/layout_collision', function(require) {
    'use strict';

    var active_handlers = {
        happening_large_icon: false,
        partners_banner: false
    };

    var GameDataInfos = require('game/game/infos');

    var $window = $(window),
        unit_menu_bottom = 568,
        large_icon_min_bottom = 25,
        spells_menu_bottom = 0,
        collision_right_menu_class = 'collision_with_right_menu',
        collision_spells_menu_class = 'collision_with_gods_spells_menu',
        small_ui = false,
        small_ui_class = 'small_ui',
        small_large_icon_class = 'small';

    var LayoutCollisionListener = {
        initialize: function() {
            $window.on('resize', this.mainHandler.bind(this));

            $(function() {
                //Its the easiest way to check it media partner's banner is in the document
                if ($('#box').hasClass('media_partner_banner')) {
                    active_handlers.partners_banner = true;
                }

                this.mainHandler();
            }.bind(this));

            /**
             * Observers
             */
            $.Observer(GameEvents.happenings.icon.initialize).subscribe(['collision_happening_large_icon'], function(e, data) {
                active_handlers.happening_large_icon = true;
                this.mainHandler();
            }.bind(this));

            $.Observer(GameEvents.main_menu.init).subscribe(['collision_happening_large_icon'], this.mainHandler.bind(this));
            $.Observer(GameEvents.main_menu.resize).subscribe(['collision_happening_large_icon'], this.mainHandler.bind(this));
            $.Observer(GameEvents.menu.click).subscribe(['collision_happening_large_icon'], function(e, data) {
                if (data.option_id === 'hide_show_menu') {
                    this.mainHandler();
                }
            }.bind(this));

            $.Observer(GameEvents.ui.layout_units.rendered).subscribe(['layout_collision'], function(e, data) {
                unit_menu_bottom = data.unit_menu_bottom;
                this.mainHandler();
            }.bind(this));

            $.Observer(GameEvents.ui.layout_gods_spells.rendered).subscribe(['layout_collision'], function(e, data) {
                spells_menu_bottom = data.spells_menu_bottom;
                this.mainHandler();
            }.bind(this));

            $.Observer(GameEvents.ui.layout_gods_spells.state_changed).subscribe(['layout_collision'], function(e, data) {
                spells_menu_bottom = 0;
                this.mainHandler();
            }.bind(this));
        },

        /**
         * test if large icon overlaps right menu considering window height
         *
         * @param {Integer} large_icon_height
         * @param {Integer} window_height
         * @returns {Boolean}
         */
        _largeIconOverlapsRightMenu: function(large_icon_height, window_height) {
            return (large_icon_height + large_icon_min_bottom) > (window_height - unit_menu_bottom);
        },

        /**
         * test if large icon overlaps spell bar considering window height
         *
         * @returns {Boolean}
         */
        _largeIconOverlapsSpellMenu: function(large_icon_top) {
            if (spells_menu_bottom) {
                return large_icon_top < spells_menu_bottom;
            }

            return false;
        },

        handleCollisionsWithNotificationStack: function() {
            var $notification_area = $('#notification_area');

            $notification_area.toggleClass(collision_right_menu_class, GrepoNotificationStack.collidesWithUnitMenu());
            $notification_area.toggleClass(collision_spells_menu_class, GrepoNotificationStack.collidesWithSpellsMenu());
        },

        /**
         * handles collisions with happening icon
         * in case large icon collides with units bar move it to the left of it (with the css class)
         * @param {jQuery} $large_icon
         * @param {int} window_height  - window width
         * @returns {void}
         */
        handleCollisionsWithHappeningIcon: function($large_icon, window_height) {
            var is_small = $large_icon.hasClass('small') || small_ui,
                client_rect = $large_icon.get(0).getBoundingClientRect(),
                client_rect_collides_with_unit_menu = this._largeIconOverlapsRightMenu(client_rect.height, window_height),
                client_rect_collides_with_spells_menu = this._largeIconOverlapsSpellMenu(client_rect.top),
                collides_with_unit_menu = this._largeIconOverlapsRightMenu($large_icon.height(), window_height) ||
                client_rect_collides_with_spells_menu;

            $large_icon.toggleClass(small_large_icon_class, collides_with_unit_menu);
            $large_icon.toggleClass(collision_right_menu_class, is_small && client_rect_collides_with_unit_menu);
            $large_icon.toggleClass(collision_spells_menu_class, is_small && client_rect_collides_with_spells_menu);

            this.handleCollisionsWithNotificationStack();
        },

        //As far the biggest banner has 174px x 44px
        handleCollisionsWithMediaPartnerBanner: function(mm_height, mm_width, window_width) {
            $('#external_partner_logo_ingame').css({
                bottom: (mm_height && ((window_width - mm_width) / 2 < 185) ? mm_height + 30 : 27)
            });

            $('.btn_close_all_windows').css({
                bottom: (mm_height && ((window_width - mm_width) / 2 < 185) ? mm_height + 76 : 27)
            });
        },

        handleMediaPartnerIngameLogo: function() {
            var $media_partner_ingame_logo = $('#media_partner_ingame_logo'),
                $nui_main_menu = $('.nui_main_menu');

            if ($nui_main_menu.length) {
                if ($media_partner_ingame_logo.length > 0) {
                    if ($nui_main_menu.position().top + $nui_main_menu.height() > $media_partner_ingame_logo.position().top) {
                        $media_partner_ingame_logo.css('left', $nui_main_menu.width() + 'px');
                    } else {
                        $media_partner_ingame_logo.css('left', 0);
                    }
                }
            }
        },

        isWindowSizeAboveMinimum: function() {
            return $window.innerWidth() > GameDataInfos.MIN_SUPPORTED_WINDOW_WIDTH &&
                $window.innerHeight() > GameDataInfos.MIN_SUPPORTED_WINDOW_HEIGHT;
        },

        /**
         * Main handler
         */
        mainHandler: function(e) {
            var $large_icon = $('.happening_large_icon_container'),
                $body = $('body'),
                window_width = $window.innerWidth(),
                window_height = $window.innerHeight();

            if (!this.isWindowSizeAboveMinimum()) {
                $body.addClass(small_ui_class);
                small_ui = true;
            } else {
                $body.removeClass(small_ui_class);
                small_ui = false;
            }

            //Happening large icon
            if ($large_icon.is(':visible') && active_handlers.happening_large_icon) {
                this.handleCollisionsWithHappeningIcon($large_icon, window_height);
            } else {
                this.handleCollisionsWithNotificationStack(false, false);
            }

            //Partners Banner
            if (active_handlers.partners_banner) {
                this.handleCollisionsWithMediaPartnerBanner(window_width, window_height);
            }

            this.handleMediaPartnerIngameLogo();
        },

        destroy: function() {
            $.Observer(GameEvents.happenings.icon.initialize).unsubscribe(['collision_happening_large_icon']);
            $.Observer(GameEvents.main_menu.init).unsubscribe(['collision_happening_large_icon']);
            $.Observer(GameEvents.main_menu.resize).unsubscribe(['collision_happening_large_icon']);
            $.Observer(GameEvents.menu.click).unsubscribe(['collision_happening_large_icon']);
            $.Observer(GameEvents.ui.layout_units.rendered).unsubscribe(['layout_collision']);
            $.Observer(GameEvents.ui.layout_gods_spells.rendered).unsubscribe(['layout_collision']);
            $.Observer(GameEvents.ui.layout_gods_spells.state_changed).unsubscribe(['layout_collision']);

            this.stopListening();
        }
    };

    us.extend(LayoutCollisionListener, Backbone.Events);

    window.GameListeners.LayoutCollisionListener = LayoutCollisionListener;
    return LayoutCollisionListener;
});