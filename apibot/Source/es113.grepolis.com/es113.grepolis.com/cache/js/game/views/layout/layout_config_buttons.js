/* global Game, GameEvents, SettingsWindowFactory, gpAjax, MobileMessages */
(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LayoutConfigButtons = BaseView.extend({
        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.registerViewComponents();
        },

        registerViewComponents: function() {
            this.initializeButtonOpenSettingsWindow();
            this.initializeButtonOpenWikiPage();
            this.initializeButtonLogout();
        },

        initializeButtonOpenSettingsWindow: function() {
            this.controller.registerComponent('btn_settings', this.$el.find('.btn_settings').button({
                template: 'internal',
                tooltips: [{
                    title: this.l10n.settings
                }]
            }).on('btn:click', function() {
                SettingsWindowFactory.openSettingsWindow();
                $.Observer(GameEvents.menu.click).publish({
                    option_id: 'settings'
                });
            }));
        },

        initializeButtonAudioToggle: function() {
            var btn_audio_toggle = this.$el.find('.btn_audio_toggle'),
                tooltip;

            if (!Game.Audio.supported()) {
                tooltip = this.l10n.not_supported;
            } else {
                tooltip = this.l10n.toggle_audio;
            }

            if (!Game.Audio.supported() ||
                Game.Audio.isMuted() ||
                Game.Audio.getSoundVolume === 0 ||
                !Game.Audio.anyCategoryEnabled()
            ) {
                btn_audio_toggle.addClass('muted');
            }

            this.controller.registerComponent('btn_audio_toggle', btn_audio_toggle.button({
                template: 'internal',
                tooltips: [{
                    title: tooltip
                }]
            }).on('btn:click', function() {
                if (!Game.Audio.supported()) {
                    return;
                }

                if (!Game.Audio.anyCategoryEnabled() || Game.Audio.getSoundVolume() === 0 || !Game.Audio.categoryEnabled('background')) {
                    SettingsWindowFactory.openSettingsWindow({
                        onAfterWindowLoad: function() {
                            $('#player-index-sound_config').trigger("click");
                        }
                    });
                    return;
                }

                var $this = $(this),
                    is_muted = $this.hasClass('muted');

                gpAjax.ajaxPost('player', 'save_settings', {
                    settings: {
                        muted: !is_muted
                    }
                }, true, $.noop);
                $this.toggleClass('muted', !is_muted);

                if (is_muted) {
                    Game.Audio.unmute();
                } else {
                    Game.Audio.mute();
                }
            }));
        },
        initializeButtonOpenWikiPage: function() {
            this.controller.registerComponent('btn_wiki', this.$el.find('.btn_wiki').button({
                template: 'internal',
                tooltips: [{
                    title: this.l10n.help
                }]
            }).on('btn:click', function() {
                if (Game.isHybridApp()) {
                    MobileMessages.openExternalLink(Game.wiki_url);
                } else {
                    window.open(Game.wiki_url);
                }
                $.Observer(GameEvents.menu.click).publish({
                    option_id: 'help'
                });
            }));
        },
        initializeButtonLogout: function() {
            this.controller.registerComponent('btn_logout', this.$el.find('.btn_logout').button({
                template: 'internal',
                tooltips: [{
                    title: this.l10n.logout
                }]
            }).on('btn:click', function() {
                window.parent.postMessage('switch_world', '*');
                gpAjax.ajaxPost('player', 'logout', {}, true);
            }));
        }
    });

    window.GameViews.LayoutConfigButtons = LayoutConfigButtons;
}());