/* globals DM, WndHandlerPlayerProfile, BBCode, WndHandlerDefault, GameDataPlayer, HumanMessage, hCommon, Game,
GPWindowMgr */
(function() {
    'use strict';

    function WndHandlerPlayerProfileEdit(wndhandle) {
        this.wnd = wndhandle;
        this.active_world = null;
        this.parent_elem = null;
        this.award_id = null;
        this.original_target = null;
        this.help = false;
    }

    WndHandlerPlayerProfileEdit.inherits(window.WndHandlerDefault);

    WndHandlerPlayerProfileEdit.prototype.getDefaultWindowOptions = function() {
        return {
            height: 510,
            width: 800,
            resizable: false,
            minimizable: true,
            title: _('Player profile')
        };
    };

    WndHandlerPlayerProfileEdit.prototype.onInit = function(title, UIopts) {
        this.wnd.requestContentGet('player', 'get_profile_html', {
            inside_edit_profile: true
        });
        this.l10n = DM.getl10n('player', 'profile');

        this.wnd_handler_profile = new WndHandlerPlayerProfile(this.wnd);
        return true;
    };

    WndHandlerPlayerProfileEdit.prototype.onRcvData = function(data, controller, action) {
        if (controller == 'player') {
            this.wnd_handler_profile.onRcvData.apply(this.wnd_handler_profile, arguments);
        } else {
            this.wnd.setContent(data.html);
        }
    };

    WndHandlerPlayerProfileEdit.prototype.onSetContent = function(html) {
        var new_html = document.createElement('div');
        var wrapper;
        new_html.innerHTML = html;

        wrapper = $(new_html).find('div.bb_button_wrapper');
        this.bbcode = new BBCode(this.wnd, wrapper, '#edit_profile_text');

        return new_html;
    };

    WndHandlerPlayerProfileEdit.prototype.onClose = function() {
        WndHandlerDefault.prototype.onClose.apply(this, arguments);
        this.wnd_handler_profile.stopListening();
    };

    /**
     * This is overridden here to catch messages (function calls)
     * that should go to the integrated wndhandler_player_profile
     * @override
     * @returns {*}
     */
    WndHandlerPlayerProfileEdit.prototype.onMessage = function() {
        var args = Array.prototype.slice.call(arguments);
        var function_name = args.shift();
        var this_function = this[function_name];
        var profile_function = this.wnd_handler_profile[function_name];

        if (typeof this_function === 'function') {
            return this_function.apply(this, args);
        } else if (typeof profile_function === 'function') {
            return profile_function.apply(this.wnd_handler_profile, args);
        }

    };

    //profile
    WndHandlerPlayerProfileEdit.prototype.profilePreview = function() {
        var root = this.wnd.getJQElement();
        var text = root.find('#edit_profile_text').val();

        this.wnd.ajaxRequestPost('player_profile', 'profile_preview', {
            'profile_text': text
        }, function(window, data) {
            root.find('#profile_preview').html(data.profile_text);
        });
    };

    WndHandlerPlayerProfileEdit.prototype.profileEdit = function() {
        var root = this.wnd.getJQElement(),
            text = root.find('#edit_profile_text').val(),
            max_length = GameDataPlayer.getMaxProfileLength();

        if (text.length > max_length) {
            return HumanMessage.error(this.l10n.error_profile_length(max_length));
        }

        this.wnd.ajaxRequestPost('player_profile', 'profile_edit', {
            'profile_text': text
        }, function(window, data) {
            root.find('#profile_preview').html(data.profile_text);
        });
    };

    WndHandlerPlayerProfileEdit.prototype.updateEmblem = function() {
        hCommon.submit_form('emblem_form', 'player_profile', 'update');
    };

    WndHandlerPlayerProfileEdit.prototype.awardVisibilityInit = function(data) {
        var that = this;

        $('li.award_draggable').draggable({
            zIndex: 2000,
            appendTo: 'body',
            scaling: Game.ui_scale.normalize.factor,

            helper: function() {
                var clone = $(this).clone(), //clone
                    id = '_' + clone.attr('id'); //valid id
                return clone.attr('id', id);
            },

            start: function(e, ui) {
                var target = $(e.currentTarget);

                that.parent_elem = target.parent().attr('id');
                that.award_id = target.attr('id').replace("award_id_", "");
            },

            drag: function(e, ui) {
                if (that.original_target == null) {
                    that.original_target = e.target;
                    if (navigator.appName == "Microsoft Internet Explorer") {
                        $(that.original_target).attr('style', 'filter:alpha(opacity=50);');
                    } else {
                        $(that.original_target).css('opacity', 0.5);
                    }
                }
            },
            stop: function() {
                $(that.original_target).removeAttr('style');
                that.original_target = null;
                that.parent_elem = null;
            }
        });

        $('div.awards_all_drop_area').droppable({
            accept: function(d) {
                return (that.parent_elem === 'awards_visibility_ally_list' || that.parent_elem === 'awards_visibility_player_list');
            },
            activeClass: 'droppable-active',
            hoverClass: 'droppable-hover',
            drop: function(e, ui) {
                that.setVisibility(ui.draggable, 'all', that.parent_elem);
            }
        });

        $('div.awards_ally_drop_area').droppable({
            accept: function(d) {
                return (that.parent_elem === 'awards_visibility_all_list' || that.parent_elem === 'awards_visibility_player_list');
            },
            activeClass: 'droppable-active',
            hoverClass: 'droppable-hover',
            drop: function(e, ui) {
                that.setVisibility(ui.draggable, 'ally', that.parent_elem);
            }
        });

        $('div.awards_player_drop_area').droppable({
            accept: function(d) {
                return (that.parent_elem === 'awards_visibility_all_list' || that.parent_elem === 'awards_visibility_ally_list');
            },
            activeClass: 'droppable-active',
            hoverClass: 'droppable-hover',
            drop: function(e, ui) {
                that.setVisibility(ui.draggable, 'player', that.parent_elem);
            }
        });

        $.each(data, function(id, award) {
            $('#award_id_' + award.award_id).tooltip('<b>' + award.name + '</b>');
        });
    };

    WndHandlerPlayerProfileEdit.prototype.setVisibility = function(award, visibility_new, visibility_old) {
        var data = {};

        data.award_id = award.attr('id').replace("award_id_", "");
        data.visibility = visibility_new;
        data.world_id = this.active_world;

        //Ajax.post('player_profile', 'set_award_visibility', data, function(return_data) {
        this.wnd.ajaxRequestPost('player_profile', 'set_award_visibility', data, function(return_data) {
            award.appendTo($('#awards_visibility_' + visibility_new + '_list'));
        });
    };

    WndHandlerPlayerProfileEdit.prototype.changeDefaultVisibility = function(visibility_new) {
        this.wnd.requestContentPost('player_profile', 'set_default_award_visibility', {
            default_visibility: $(visibility_new).val()
        });
    };

    WndHandlerPlayerProfileEdit.prototype.changeWorld = function(select) {
        var world_id = select.options[select.options.selectedIndex].value;
        this.wnd.requestContentGet('player_profile', 'award_visibility', {
            active_world: world_id
        });
    };

    GPWindowMgr.addWndType('PLAYER_PROFILE_EDIT', null, WndHandlerPlayerProfileEdit, 1);
}());