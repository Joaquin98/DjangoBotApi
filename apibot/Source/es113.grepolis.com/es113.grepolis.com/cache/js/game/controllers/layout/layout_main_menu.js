/*global GameViews, GameControllers, GPWindowMgr, Game, GameEvents, RankingWindowFactory, MobileMessages */

(function() {
    "use strict";

    var LayoutMainMenuController = GameControllers.BaseController.extend({
        view: null,

        initialize: function(options) {
            //Call method from the parent
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.LayoutMainMenu({
                el: this.$el,
                controller: this
            });

            $.Observer(GameEvents.main_menu.init).publish({});

            return this;
        },

        handleClickEvent: function(target) {
            var option_id = target.data('option-id');
            if (this.linksHandler.hasOwnProperty(option_id)) {
                this.linksHandler[option_id].apply(this);
            }
        },

        publishMenuClickEvent: function(menu_item) {
            $.Observer(GameEvents.menu.click).publish({
                option_id: menu_item
            });
        },

        linksHandler: {
            profile: function() {
                GPWindowMgr.Create(GPWindowMgr.TYPE_PLAYER_PROFILE_EDIT); //@todo where is factory for this window ?
                this.publishMenuClickEvent('profile');
            },

            ranking: function() {
                RankingWindowFactory.openRankingWindow();
                this.publishMenuClickEvent('ranking');
            },

            messages: function() {
                GPWindowMgr.Create(GPWindowMgr.TYPE_MESSAGE); //@todo where is factory for this window ?
                this.publishMenuClickEvent('messages');
            },

            reports: function() {
                GPWindowMgr.Create(GPWindowMgr.TYPE_REPORT); //@todo where is factory for this window ?
                this.publishMenuClickEvent('reports');
            },

            invite_friends: function() {
                GPWindowMgr.Create(GPWindowMgr.TYPE_INVITE_FRIENDS); //@todo where is factory for this window ?
                Game.invitation_path = {
                    src: 'menu'
                };
                this.publishMenuClickEvent('invite_friends');
            },

            alliance: function() {
                GPWindowMgr.Create(GPWindowMgr.TYPE_ALLIANCE); //@todo where is factory for this window ?
                this.publishMenuClickEvent('alliance');
            },

            allianceforum: function() {
                GPWindowMgr.Create(GPWindowMgr.TYPE_ALLIANCE_FORUM); //@todo where is factory for this window ?
                this.publishMenuClickEvent('allianceforum');
            },

            domination: function() {
                var DominationWindowFactory = require('features/domination/factories/domination');
                DominationWindowFactory.openWindow();
                this.publishMenuClickEvent('domination');
            },

            forum: function() {
                if (Game.isHybridApp()) {
                    MobileMessages.openExternalLink(Game.forum_url);
                } else {
                    window.open(Game.forum_url);
                }
                this.publishMenuClickEvent('forum');
            },
            olympus: function() {
                var OlympusWindowFactory = require('features/olympus/factories/olympus_window_factory');
                OlympusWindowFactory.openOverviewWindow();
                this.publishMenuClickEvent('olympus');
            },
            world_wonders: function() {
                var WorldWondersWindowFactory = require('features/world_wonders/factories/window_factory');
                WorldWondersWindowFactory.openInfoWindow();
                this.publishMenuClickEvent('world_wonder');
            }
        }
    });

    window.GameControllers.LayoutMainMenuController = LayoutMainMenuController;
}());