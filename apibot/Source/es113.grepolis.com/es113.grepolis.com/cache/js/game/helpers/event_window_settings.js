/* globals DM, us, Game */

define('helpers/event_window_settings', function(require) {
    'use strict';

    var BenefitHelper = require('helpers/benefit'),
        EventWindowSettings = require('windows/events/settings');

    return {
        l10n: null,

        getEventWindowSettings: function(window_id, options, props) {
            if (options && options.benefit_type) {
                this.l10n = BenefitHelper.getl10nForSkin(DM.getl10n(window_id), window_id, options.benefit_type);
            } else {
                this.l10n = BenefitHelper.getl10nForSkin(DM.getl10n(window_id), window_id);
            }

            var tabs = options.tabs ? this.getTabSettings(options.tabs) : null,
                additional_settings = EventWindowSettings.getWindowSettings(window_id, BenefitHelper.getBenefitSkin()),
                window_settings = {
                    window_type: window_id,
                    max_instances: 1,
                    activepagenr: options.activepagenr ? options.activepagenr : 0,
                    minheight: 570,
                    minwidth: 770,
                    l10n: this.l10n,
                    title: this.l10n.window_title,
                    tabs: tabs,
                    special_buttons: {
                        help: {
                            action: {
                                type: 'external_link',
                                url: Game.event_wiki_url
                            }
                        }
                    }
                };

            props = props || {};
            options = options || {};


            us.extend(window_settings, additional_settings, options.window_settings, props);

            return window_settings;
        },

        getTabSettings: function(tabs) {
            return tabs.map(function(tab) {
                return {
                    type: tab.type,
                    content_view_constructor: tab.content_view_constructor,
                    title: this.l10n.tabs[tab.type],
                    hidden: tab.hidden || false
                };
            }.bind(this));
        }
    };
});