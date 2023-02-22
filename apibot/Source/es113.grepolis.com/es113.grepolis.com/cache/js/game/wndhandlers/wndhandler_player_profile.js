/* global Game, CM, MM, WndHandlerDefault, GPWindowMgr, DM */
(function() {
    'use strict';

    var Features = require('data/features');

    function WndHandlerPlayerProfile(wndhandle) {
        this.wnd = wndhandle;
        this.elmnts = {};
        this.player_id = 0;
    }
    WndHandlerPlayerProfile.inherits(WndHandlerDefault);

    WndHandlerPlayerProfile.prototype.getDefaultWindowOptions = function() {
        return {
            height: 509,
            width: 800,
            resizable: false,
            minimizable: true,
            title: 'Untitled Window'
        };
    };

    WndHandlerPlayerProfile.prototype.onInit = function(title, UIopts) {
        this.player_id = UIopts.player_id;
        this.wnd.requestContentGet('player', 'get_profile_html', {
            player_id: this.player_id
        });
        return true;
    };

    WndHandlerPlayerProfile.prototype.registerEventListeners = function() {
        this.grepo_score_model.onChange(this, this.updateGrepoScore);
    };

    WndHandlerPlayerProfile.prototype.onRcvData = function(data, controller, action, params) {
        this.wnd.setContent2(data.html);
        if (data.awards) {
            this.initAwards(data.awards);
            $('#awards div.expansion').tooltip(_('Display awards from other worlds'));
        }

        var el = this.wnd.getJQElement();

        if (Features.isArtifactLevelsEnabled()) {
            if (!Game.isMobileBrowser()) {
                el.find('#artifacts_scrollpane div').removeClass("js-scrollbar-viewport js-scrollbar-content");
                this.initScrollable(
                    '#artifacts_list',
                    '.artifacts_list',
                    '.player_profile_artifact',
                    '#artifacts_scrollpane',
                    'artifact_list'
                );
            } else {
                this.initSkinableScrollbar(
                    el,
                    '#artifacts_scrollpane .js-scrollbar-content li',
                    '#artifacts_scrollpane div.expansion',
                    '#artifacts_scrollpane .js-scrollbar-content',
                    '#artifacts_scrollpane .scrollbar-slider-container',
                    'scrollbar_artifacts',
                    '#artifacts_scrollpane .js-scrollbar-viewport'
                );
            }
        }

        // this.player_id == 0 seems to indicate the own profile (see ajax request below)
        if (params.player_id) {
            this.player_id = params.player_id;
        }

        // Own profile when either no player_id or our own player_id is send
        var is_own_profile = this.player_id === 0 || this.player_id === Game.player_id;

        var context = this.wnd.getContext();
        CM.unregister(context);

        var $txt_bb_code = CM.register(context, 'grepo_score_textbox', el.find('.txt_grepolis_score_bb_code').textbox({
            value: '[score]' + Game.player_name + '[/score]',
            visible: false,
            read_only: true
        }));

        var l10n = DM.getl10n('grepolis_score');

        this.btn_grepolis_score = CM.register(context, 'btn_grepolis_score', el.find('.btn_grepolis_score').button({
            disabled: !is_own_profile,
            state: !is_own_profile,
            icon: true,
            icon_position: 'left',
            icon_type: 'grepolis_score',
            tooltips: [{
                title: l10n.bb_code_tooltip
            }, {
                title: l10n.earned_score
            }]
        }).on('btn:click', function() {
            $txt_bb_code.toggleVisibility();
            if ($txt_bb_code.isVisible()) {
                $txt_bb_code.selectAll();
            }
        }));

        this.grepo_score_model = MM.getModelByNameAndPlayerId('GrepoScore');

        this.updateGrepoScore();

        this.registerEventListeners();
    };

    WndHandlerPlayerProfile.prototype.updateGrepoScore = function() {
        var is_own_profile = this.player_id === 0 || this.player_id === Game.player_id,
            score = this.grepo_score_model.getTotalScore(),
            $score_box = this.wnd.getJQElement().find('.grepolis_score_container .grepolis_score_box'),
            $score = this.wnd.getJQElement().find('.grepolis_score_container .grepolis_score'),
            l10n = DM.getl10n('grepolis_score');

        $score_box.tooltip(l10n.earned_score);
        if (is_own_profile) {
            $score.text(score);
        }
    };


    WndHandlerPlayerProfile.prototype.inviteIntoAlliance = function(player_name) {
        this.wnd.ajaxRequestPost('alliance', 'invite', {
            player_name: player_name
        }, function(_wnd, data) {});
    };

    WndHandlerPlayerProfile.prototype.initAwards = function() {
        var el = this.wnd.getJQElement();
        this.initializeAwardTooltips();

        if (!Game.isMobileBrowser()) {
            el.find('#awards div').removeClass("js-scrollbar-viewport js-scrollbar-content");
            this.initScrollable('#awards', '.awards', '.award', '#scrollpane', 'awardlist');
        } else {
            this.initSkinableScrollbar(
                el,
                '#awards .js-scrollbar-content li',
                '#awards div.expansion',
                '#awards .js-scrollbar-content',
                '#awards .scrollbar-slider-container',
                'scrollbar_awards',
                '#awards .js-scrollbar-viewport'
            );
        }
    };

    WndHandlerPlayerProfile.prototype.initSkinableScrollbar = function(
        el,
        scrollable_elements,
        expansion_element,
        content_element,
        scrollbar_slider_container,
        scrollbar_name,
        viewport_element
    ) {
        var list_width = 0;

        $(scrollable_elements).each(function(idx, el) {
            list_width += ($(el).outerWidth(true)) + 3;
        });

        list_width += ($(expansion_element).outerWidth(true));

        el.find(content_element).css({
            width: list_width + 25 + 'px'
        });
        el.find(scrollbar_slider_container).css({
            width: list_width + 26 + 'px'
        });
        CM.register(this.wnd.getContext(), scrollbar_name, el.find(viewport_element).skinableScrollbar({
            orientation: 'horizontal',
            template: 'tpl_skinable_scrollbar',
            skin: 'narrow',
            elements_to_scroll: el.find(content_element),
            element_viewport: el.find(viewport_element),
            min_slider_size: 16
        }));
    };

    WndHandlerPlayerProfile.prototype.initScrollable = function(
        element_id,
        element_class,
        individual_element_class,
        scrollable_id,
        property_name
    ) {
        var list_width = 0;
        this.elmnts[property_name] = $(element_id);

        $(element_id + ' li').each(function(idx, el) {
            list_width += Math.ceil($(el).outerWidth(true));
        });

        list_width += ($(element_id + ' div.expansion').outerWidth(true));
        this.elmnts[property_name].css({
            width: list_width + 'px'
        });

        var $document = $(document),
            $scroll_panel = $(scrollable_id),
            $element = $(element_id),
            w_viewport = $scroll_panel.outerWidth(),
            w_element = $element.outerWidth(),
            isMobile = Game.isMobileBrowser() || Game.isHybridApp();

        // Check if the element is empty, this is the case when the player doesn't have enough awards
        if (typeof $element.position() === 'undefined') {
            return;
        }

        // When awards from the different worlds are loaded, it's possible that there will not be any
        // so in this case there will be empty gap in the end of the list
        $element.css({
            left: Math.min(Math.max(w_viewport - w_element, $element.position().left), 0)
        });

        var onStartEventName = (isMobile ? 'touchstart' : 'mousedown') + element_class,
            onMoveEventName = (isMobile ? 'touchmove' : 'mousemove') + element_class,
            onStopEventName = (isMobile ? 'touchend' : 'mouseup') + element_class;

        var dragDropHandler = function(event) {
            event.preventDefault();
            event = event.type === 'touchstart' ? event.originalEvent.touches[0] : event;

            var w_offset = $element.position(),
                dx, sx = event.clientX;

            $document.on(onMoveEventName, function(move_event) {
                event = move_event.type === 'touchmove' ? move_event.originalEvent.touches[0] : move_event;

                //Limit movement to size of the main_area container
                dx = Math.max(
                    Math.min(0, w_offset.left + (move_event.clientX - sx)),
                    Math.min(0, w_viewport - w_element)
                );

                $element.css({
                    left: dx,
                    top: 0,
                    right: 'auto',
                    bottom: 'auto'
                });
            });

            $document.on(onStopEventName, function() {
                $document.off(onMoveEventName + ' ' + onStopEventName);
            });
        };

        $scroll_panel.off(onStartEventName).on(onStartEventName, individual_element_class, dragDropHandler);
    };

    /**
     * initialize award tooltips
     */
    WndHandlerPlayerProfile.prototype.initializeAwardTooltips = function() {
        $('#awards li.award').on('mouseover', function(e) {
            var $el = $(e.currentTarget),
                el_data = $el.data(),
                name = el_data.name,
                description = el_data.description,
                awarded_at = el_data.awarded_at;

            if (name && description && awarded_at) {
                $el.tooltip('<b>' + name + '</b> (' + awarded_at + ')<br />' + description).showTooltip(e);
            }
        });
    };

    WndHandlerPlayerProfile.prototype.loadMasterAwards = function() {
        var that = this;

        $('#awards div.expansion').hide();

        this.wnd.ajaxRequestGet('player', 'get_master_awards', {
            player_id: this.player_id || Game.player_id
        }, function(_wnd, data) {
            $('#awards').append(data.html);
            that.initAwards(data.awards);
        });
    };


    GPWindowMgr.addWndType('PLAYER_PROFILE', 'b_profile', WndHandlerPlayerProfile, 1);

    window.WndHandlerPlayerProfile = WndHandlerPlayerProfile;
}());