/* globals Game, GameControllers, GameViews, GameDataPremium, DateHelper, BuyForGoldWindowFactory, PremiumWindowFactory */

(function() {
    'use strict';

    var TabController = GameControllers.TabController;

    var PremiumAdvisorsController = TabController.extend({
        initialize: function(options) {
            //Don't remove it, it should call its parent
            TabController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new GameViews.PremiumAdvisorsView({
                el: this.$el,
                controller: this
            });

            this.registerEventListeners();

            return this;
        },

        registerEventListeners: function() {
            this.stopListening();
            this.getModel('premium_features').onAdvisorChange(this, this.view.rerender.bind(this.view));
        },

        getAdvisorExpirationTime: function(advisor_id) {
            return this.getModel('premium_features').getExpiredTime(advisor_id);
        },

        isAdvisorActivated: function(advisor_id) {
            return this.getModel('premium_features').isActivated(advisor_id);
        },

        getAdvisorDuration: function(advisor_id) {
            return GameDataPremium.getAdvisorDuration(advisor_id, this.getCollection('tutorial_quests'));
        },

        getAdvisorCost: function(advisor_id) {
            return GameDataPremium.getAdvisorCost(advisor_id, this.getCollection('tutorial_quests'));
        },

        getAdvisorExpirationTranslation: function(advisor_id) {
            var l10n = this.getl10n();
            var is_active = this.isAdvisorActivated(advisor_id);

            return is_active ? l10n.ends(DateHelper.formatAdvisorExpiration(this.getAdvisorExpirationTime(advisor_id), 'player_timezone')) : l10n.not_activated;
        },

        getAdvisorsData: function() {
            var l10n = this.getl10n();
            var advisors_ids = GameDataPremium.getAdvisorsIds();
            var advisors_data = [];

            advisors_ids.forEach(function(advisor_id) {
                var is_active = this.isAdvisorActivated(advisor_id);

                advisors_data.push({
                    id: advisor_id,
                    expiration: this.getAdvisorExpirationTranslation(advisor_id),
                    duration: l10n.duration(this.getAdvisorDuration(advisor_id)),
                    active: is_active,
                    cost: this.getAdvisorCost(advisor_id),
                    button_caption: is_active ? l10n.extend_feature : l10n.activate_feature,
                    description: GameDataPremium.getAdvisorDescription(advisor_id),
                    bonus: GameDataPremium.getAdvisorBonus(advisor_id)
                });
            }.bind(this));

            return advisors_data;
        },

        getAdvisorAdvantages: function(advisor_id) {
            var advantages = {
                curator: [{
                        icon: 'curator_queue',
                        caption: this.getAdvisorFeatureText('curator', 'curator_queue'),
                        caption_size: 'big'
                    },
                    {
                        icon: 'overviews',
                        caption: this.getAdvisorFeatureText('curator', 'overviews'),
                        caption_size: 'big'
                    }
                ],
                trader: [{
                    icon: 'resources',
                    caption: this.getAdvisorFeatureText('trader', 'resources'),
                    caption_size: 'big'
                }],
                priest: [{
                        icon: 'favor',
                        caption: this.getAdvisorFeatureText('priest', 'favor'),
                        caption_size: 'big'
                    },
                    {
                        icon: 'mythical_units_strength',
                        caption: this.getAdvisorFeatureText('priest', 'mythical_units_strength'),
                        caption_size: 'big'
                    }
                ],
                commander: [{
                    icon: 'ground_units_strength',
                    caption: this.getAdvisorFeatureText('commander', 'ground_units_strength'),
                    caption_size: 'big'
                }],
                captain: [{
                        icon: 'naval_units_strength',
                        caption: this.getAdvisorFeatureText('captain', 'naval_units_strength'),
                        caption_size: 'big'
                    },
                    {
                        icon: 'trade_speed',
                        caption: this.getAdvisorFeatureText('captain', 'trade_speed'),
                        caption_size: 'big'
                    },
                    {
                        icon: 'attack_planner',
                        caption: this.getAdvisorFeatureText('captain', 'attack_planner'),
                        caption_size: 'small'
                    },
                    {
                        icon: 'farm_town_overview',
                        caption: this.getAdvisorFeatureText('captain', 'farm_town_overview'),
                        caption_size: 'small'
                    }
                ]
            };

            return advantages[advisor_id];
        },

        getAdvisorFeatureText: function(advisor_id, feature_id) {
            var backend_feature_id = this.getAdvisorFeatureNameMap(feature_id);
            var bonus = Game.premium_data[advisor_id].bonus[backend_feature_id];

            return bonus.amt || bonus.desc_index;
        },

        getAdvisorFeatureNameMap: function(feature_id) {
            var map = {
                curator_queue: 'curator_queue',
                overviews: 'curator_overview',
                resources: 'trader_res',
                favor: 'priest_favor',
                mythical_units_strength: 'priest_myth_units',
                ground_units_strength: 'commander_ground_units',
                naval_units_strength: 'captain_naval_units',
                trade_speed: 'captain_trade_speed',
                attack_planner: 'captain_attack_planer',
                farm_town_overview: 'captain_farm_town'
            };

            return map[feature_id];
        },

        isExtendFeatureCheckboxChecked: function(advisor_id) {
            return this.getComponent('cbx_extend_advisor_' + advisor_id).isChecked();
        },

        isExtendingAdvisorEnabled: function(advisor_id) {
            return this.getModel('player_settings').isExtendingAdvisorEnabled(advisor_id);
        },

        extendOrActivateAdvisor: function(advisor_id, disable_auto_extension, btn) {
            var callback = {
                error: function() {
                    btn.enable();
                }.bind(this)
            };
            this.getModel('premium_features').extend(advisor_id, disable_auto_extension, callback);
        },

        onButtonClick: function(_btn, advisor_id, is_active) {
            var cost = this.getAdvisorCost(advisor_id);
            var callback = function(advisor_id) {
                var disable_auto_extension = !this.isExtendFeatureCheckboxChecked(advisor_id);

                this.extendOrActivateAdvisor(advisor_id, disable_auto_extension, _btn);
            }.bind(this, advisor_id);

            if (cost > 0) {
                if (is_active) {
                    BuyForGoldWindowFactory.openExtendAdvisorWindow(_btn, advisor_id, callback);
                } else {
                    BuyForGoldWindowFactory.openBuyAdvisorWindow(_btn, advisor_id, callback);
                }
            } else {
                callback();
            }
        },

        onCheckboxClick: function(advisor_id) {
            var callbacks = {
                success: function() {},
                error: function() {
                    if (this.isExtendingAdvisorEnabled(advisor_id) !== this.isExtendFeatureCheckboxChecked(advisor_id)) {
                        this.getComponent('cbx_extend_advisor_' + advisor_id).check(!this.isExtendFeatureCheckboxChecked(advisor_id));
                    }
                }.bind(this)
            };
            this.getModel('premium_features').toggleAutoExtension(advisor_id, callbacks);
        },

        onAdvisorImageClick: function(advisor_id) {
            PremiumWindowFactory.openAdvantagesTab(advisor_id);
        },

        destroy: function() {
            this.stopListening();
        }
    });

    window.GameControllers.PremiumAdvisorsController = PremiumAdvisorsController;
}());