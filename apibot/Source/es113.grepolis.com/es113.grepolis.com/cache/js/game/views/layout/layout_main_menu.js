/*global us, Game */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;
    var MAX_INDICATOR_VALUE = 999;
    var Features = require('data/features');

    var LayoutMainMenu = BaseView.extend({
        buttons_definition: [],
        buttons: {},
        events: {
            'click .main_menu_item': 'handleClickEvent',
            'click .slide_button': 'slideToggle'
        },
        visible: true,

        setButtonDefinition: function() {
            this.buttons_definition = [{
                    id: 'messages'
                },
                {
                    id: 'reports'
                },
                {
                    id: 'alliance'
                },
                {
                    id: 'allianceforum'
                },
                {
                    id: 'ranking'
                },
                {
                    id: 'profile'
                },
                {
                    id: 'invite_friends'
                },
                {
                    id: 'forum'
                }
            ];

            if (Features.isDominationActive()) {
                this.buttons_definition.splice(4, 0, {
                    id: 'domination'
                });
            } else if (Features.isOlympusEndgameActive()) {
                this.buttons_definition.splice(4, 0, {
                    id: 'olympus'
                });
            } else if (Features.isWorldWondersEndgameActive() && Features.isNewWorldWonderEndgameEnabled()) {
                this.buttons_definition.splice(4, 0, {
                    id: 'world_wonders'
                });
            }
        },

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.l10n;

            this.$content_menu = this.$el.find('.middle .content ul');

            this.player_report_status = this.controller.getModel('player_report_status');
            this.current_player = this.controller.getModel('current_player');

            this.setButtonDefinition();

            this.initializeUpdateIndicator();
            this.render();

            // set inital values
            this.updateNewMessagesIndicator(this.player_report_status);
            this.updateNewAlliancePostsIndicator(this.player_report_status);
            this.updateNewReportsIndicator(this.player_report_status);

            this.updateAllianceMembership();
            this.updateRanking();

            //update the admin status at the end to be sure that it doesn't get overridden anymore
            this.updateAdminStatus();
        },

        render: function() {
            var last_index = this.buttons_definition.length - 1;

            us.each(this.buttons_definition, (function(button_definition, key) {
                this.buttons[button_definition.id] = {
                    $element: $(
                        us.template(
                            this.controller.getTemplate('main_menu_item'), {
                                type: button_definition.id,
                                name: this.l10n.items[button_definition.id],
                                first: key === 0,
                                last: key === last_index,
                                disabled: button_definition.disabled ? true : false,
                                rank_element: button_definition.id === 'ranking'
                            }
                        )
                    )
                };

                this.$content_menu.append(
                    this.buttons[button_definition.id].$element
                );

            }).bind(this));

            return this;
        },

        initializeUpdateIndicator: function() {
            //@todo try to use listenTo
            this.player_report_status.onNewMessagesCountChange(this.updateNewMessagesIndicator, this);
            this.player_report_status.onNewAnnouncementsCountChange(this.updateNewMessagesIndicator, this);

            this.player_report_status.onNewReportsCountChange(this.updateNewReportsIndicator, this);

            this.player_report_status.onNewAlliancePostsCountChange(this.updateNewAlliancePostsIndicator, this);

            this.current_player.onChangeAllianceMembership(this, this.updateAllianceMembership);
            this.current_player.onChangeRank(this.updateRanking, this);
        },

        updateNewMessagesIndicator: function(prs_model) {
            var option_id = 'messages',
                total_count = prs_model.getTotalMessagesAnnouncementsAmount();

            this.renderIndicator(option_id, total_count, prs_model.getNewAnnouncementsCount() > 0);
        },

        updateNewAlliancePostsIndicator: function(prs_model) {
            var option_id = 'allianceforum';

            this.renderIndicator(option_id, prs_model.getNewAlliancePostsCount());
        },

        updateNewReportsIndicator: function(prs_model) {
            var option_id = 'reports';

            this.renderIndicator(option_id, prs_model.getNewReportsCount());
        },

        updateAllianceMembership: function() {
            this.buttons.allianceforum.$element.toggleClass('disabled', !this.current_player.isInAlliance());
        },

        updateAdminStatus: function() {
            if (Game.admin) {
                this.buttons.messages.$element.addClass('disabled');
                this.buttons.allianceforum.$element.addClass('disabled');
                this.buttons.invite_friends.$element.addClass('disabled');
            }
        },

        updateRanking: function() {
            this.buttons.ranking.$element.find('.rank').text(' (' + this.current_player.getCurrentRank() + ')');
        },

        /**
         * render number bubble on the icon
         * @param {string} main_menu_id id of main menu element
         * @param {integer} value value which should be show
         * @param {boolean} has_announcement if special announcement style should be applied
         */
        renderIndicator: function(main_menu_id, value, has_announcement) {
            var $indicator = this.buttons[main_menu_id].$element.find('.indicator');

            if (value > MAX_INDICATOR_VALUE) {
                value = MAX_INDICATOR_VALUE;
                $indicator.html(value + '+');
            } else {
                $indicator.html(value);
            }

            $indicator.toggle(value !== 0)
                .toggleClass('has_annoucements', has_announcement === true);
        },

        slideToggle: function() {
            if (this.visible) {
                this.$content_menu.find('.content_wrapper .button_wrapper, .content_wrapper .name_wrapper').animate({
                    opacity: 0
                }, {
                    duration: 200
                });
                this.$content_menu.delay(100).slideUp({
                    duration: 300
                });
                this.$el.addClass('container_hidden');

                this.visible = false;
            } else {
                this.visible = true;
                this.$content_menu.slideDown({
                    duration: 300
                });
                this.$el.removeClass('container_hidden');
                this.$content_menu.find('.content_wrapper .button_wrapper, .content_wrapper .name_wrapper').animate({
                    opacity: 1
                }, {
                    duration: 400
                });
            }
        },

        handleClickEvent: function(event) {
            var target = $(event.currentTarget);
            if (!target.hasClass('disabled')) {
                this.controller.handleClickEvent(target);
            }
        },

        destroy: function() {
            //@todo try to use listenTo
            this.player_report_status.off(null, null, this);
            this.current_player.off(null, null, this);
        }
    });

    window.GameViews.LayoutMainMenu = LayoutMainMenu;
}());