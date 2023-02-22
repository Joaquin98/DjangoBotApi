/* global GameEvents, GPWindowMgr */
(function() {
    'use strict';

    function WndHandlerRanking(wndhandle) {
        this.wnd = wndhandle;
    }

    WndHandlerRanking.inherits(window.WndHandlerDefault);

    WndHandlerRanking.prototype.getDefaultWindowOptions = function() {
        return {
            maxHeight: 500,
            maxWidth: 820,
            height: 500,
            width: 820,
            resizable: true,
            minimizable: true,
            title: _('Ranking')
        };
    };

    /**
     * Window Initialization
     *
     *	@param title String	=> window title
     *  @param UIopts Object	=> Jquery UI Options for the window
     * 	variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * @return Boolean
     **/
    WndHandlerRanking.prototype.onInit = function(title, UIopts) {
        this.wnd.requestContentGet('ranking', 'index', {
            'rank': arguments[2],
            'town_id': arguments[3]
        });

        return true;
    };

    WndHandlerRanking.prototype.onClose = function() {
        $.Observer(GameEvents.town.town_switch).unsubscribe('ranking_handler');
        return true;
    };

    WndHandlerRanking.prototype.onRcvData = function(data, controller, action) {
        this.wnd.setContent2(data.html);

        this.initializeEventListeners();
    };

    WndHandlerRanking.prototype.initializeEventListeners = function() {
        this.initializeEventListenersForGlobalRanking();
        this.initializeEventListenersForSeaPlayerRanking();
        this.initializeEventListenersForAllianceRanking();
        this.initializeEventListenersForSeaAllianceRanking();
        this.initializeEventListenersForWonderAllianceRanking();
        this.initializeEventListenersForGrepoScoreWorldRanking();

        $.Observer(GameEvents.town.town_switch).unsubscribe('ranking_handler');
        $.Observer(GameEvents.town.town_switch).subscribe('ranking_handler', function() {
            this.wnd.close();
            window.RankingWindowFactory.openRankingWindow();
        }.bind(this));
    };

    WndHandlerRanking.prototype.initializeEventListenersForGlobalRanking = function() {
        var root = this.wnd.getJQElement();
        var namespace = 'global_ranking_enter_key';

        var $unique_class_global_ranking_rank = root.find('.unique_class_global_ranking_rank');
        var $unique_class_global_ranking_player_name = root.find('.unique_class_global_ranking_player_name');

        $unique_class_global_ranking_player_name.oldautocomplete('/autocomplete', {
            minChars: 3,
            autoFill: true
        });

        $unique_class_global_ranking_rank.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('global', 'rank', 'rank', 'player_name');
            }
        }.bind(this));

        $unique_class_global_ranking_player_name.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('search_player', 'search', 'rank', 'player_name');
                $unique_class_global_ranking_player_name.hideList();
            }
        }.bind(this));
    };

    WndHandlerRanking.prototype.initializeEventListenersForSeaPlayerRanking = function() {
        var root = this.wnd.getJQElement();
        var namespace = 'see_player_ranking_enter_key';

        var $unique_class_sea_player_ranking_rank = root.find('.unique_class_sea_player_ranking_rank');
        var $unique_class_sea_player_ranking_seaid = root.find('.unique_class_sea_player_ranking_seaid');
        var $unique_class_sea_player_ranking_player_name = root.find('.unique_class_sea_player_ranking_player_name');

        $unique_class_sea_player_ranking_player_name.oldautocomplete('/autocomplete', {
            minChars: 3,
            autoFill: true
        });

        $unique_class_sea_player_ranking_rank.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('sea_player', 'both', 'rank', 'seaid');
            }
        }.bind(this));

        $unique_class_sea_player_ranking_player_name.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('sea_search_player', 'sea_search', 'rank', 'player_name', {
                    'sea_id': 'seaid'
                });

                $unique_class_sea_player_ranking_player_name.hideList();
            }
        }.bind(this));

        $unique_class_sea_player_ranking_seaid.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('sea_player', 'search', 'rank', 'seaid');
            }
        }.bind(this));
    };

    WndHandlerRanking.prototype.initializeEventListenersForAllianceRanking = function() {
        var root = this.wnd.getJQElement();
        var namespace = 'alliance_ranking_enter_key';

        var $unique_class_alliance_ranking_rank = root.find('.unique_class_alliance_ranking_rank');
        var $unique_class_alliance_ranking_alliance_name = root.find('.unique_class_alliance_ranking_alliance_name');

        $unique_class_alliance_ranking_alliance_name.oldautocomplete('/autocomplete', {
            'extraParams': {
                'what': 'game_alliance'
            },
            'minChars': 3,
            'autoFill': true
        });

        $unique_class_alliance_ranking_alliance_name.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('search_alliance', 'search', 'rank', 'alliance_name');

                $unique_class_alliance_ranking_alliance_name.hideList();
            }
        }.bind(this));

        $unique_class_alliance_ranking_rank.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('alliance', 'rank', 'rank', 'alliance_name');
            }
        }.bind(this));
    };

    WndHandlerRanking.prototype.initializeEventListenersForSeaAllianceRanking = function() {
        var root = this.wnd.getJQElement();
        var namespace = 'sea_alliance_ranking_enter_key';

        var $unique_class_sea_alliance_ranking_rank = root.find('.unique_class_sea_alliance_ranking_rank');
        var $unique_class_sea_alliance_ranking_sea_id = root.find('.unique_class_sea_alliance_ranking_sea_id');
        var $unique_class_sea_alliance_ranking_alliance_name = root.find('.unique_class_sea_alliance_ranking_alliance_name');

        $unique_class_sea_alliance_ranking_alliance_name.oldautocomplete('/autocomplete', {
            'extraParams': {
                'what': 'game_alliance'
            },
            'minChars': 3,
            'autoFill': true
        });

        $unique_class_sea_alliance_ranking_alliance_name.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('sea_search_alliance', 'sea_search', 'rank', 'alliance_name', {
                    'sea_id': 'seaid'
                });

                $unique_class_sea_alliance_ranking_alliance_name.hideList();
            }
        }.bind(this));

        $unique_class_sea_alliance_ranking_rank.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('sea_alliance', 'both', 'rank', 'seaid');
                //call('search', )
            }
        }.bind(this));

        $unique_class_sea_alliance_ranking_sea_id.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('sea_alliance', 'search', 'rank', 'seaid');
            }
        }.bind(this));
    };

    WndHandlerRanking.prototype.initializeEventListenersForWonderAllianceRanking = function() {
        var root = this.wnd.getJQElement();
        var namespace = 'kill_player_ranking_enter_key';

        var $unique_class_wonder_alliance_ranking_rank = root.find('.unique_class_wonder_alliance_ranking_rank');

        $unique_class_wonder_alliance_ranking_rank.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('wonder_alliance', 'rank', 'rank', 'player_name');
            }
        }.bind(this));
    };

    WndHandlerRanking.prototype.initializeEventListenersForGrepoScoreWorldRanking = function() {
        var root = this.wnd.getJQElement();
        var namespace = 'grepo_score_world_ranking_enter_key';

        var $unique_class_global_ranking_rank = root.find('.unique_class_grepo_score_world_ranking_rank');
        var $unique_class_global_ranking_player_name = root.find('.unique_class_grepo_score_world_ranking_player_name');

        $unique_class_global_ranking_player_name.oldautocomplete('/autocomplete', {
            minChars: 3,
            autoFill: true
        });

        $unique_class_global_ranking_rank.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('grepo_score_world', 'rank', 'rank', 'player_name');
            }
        }.bind(this));

        $unique_class_global_ranking_player_name.off('.' + namespace).on('keyup.' + namespace, function(e) {
            if (e.keyCode === 13) { //Enter
                this.search('grepo_score_world', 'search', 'rank', 'player_name');
                $unique_class_global_ranking_player_name.hideList();
            }
        }.bind(this));
    };

    WndHandlerRanking.prototype.getPage = function() {
        return null;
    };

    WndHandlerRanking.prototype.search = function(action, use, rank_elm_name, search_elm_name, args) {
        if (typeof args === 'undefined') {
            args = {};
        }
        var search_term = $('#' + search_elm_name).val();
        var rank = $('#' + rank_elm_name).val();
        var sea_id = $('#' + args.sea_id).val();

        switch (use) {
            case 'rank':
                args.rank = rank;
                break;
            case 'search':
                args.search_term = search_term;
                break;
            case 'both':
                args.rank = rank;
                args.search_term = search_term;
                break;
            case 'sea_search':
                args.search_term = search_term;
                args.sea_id = sea_id;
                break;
        }
        this.wnd.requestContentGet('ranking', action, args, this.scrollToRank.bind(this, rank));

        return true;
    };

    WndHandlerRanking.prototype.scrollToRank = function(rank) {
        if (rank) {
            var $scroll_target = $('#ranking_inner').find('.r_rank:contains("' + rank + '")');

            if ($scroll_target.length > 0) {
                $scroll_target[0].scrollIntoView();
            }
        }
    };

    GPWindowMgr.addWndType('RANKING', 'link_ranking', WndHandlerRanking, 1);
}());