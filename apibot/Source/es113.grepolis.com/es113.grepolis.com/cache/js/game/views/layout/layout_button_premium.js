/*global Backbone, Game, TownOverviewWindowFactory, PremiumWindowFactory, GameEvents, AttackPlannerWindowFactory */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LayoutButtonPremium = BaseView.extend({

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.l10n;

            //@todo move it to the controller
            this.premium_features_model = this.controller.getModel('premium_features');
            this.premium_features_model.on('change', function(advisors_model) {
                var advisor_id, changes = advisors_model.changedAttributes();

                for (advisor_id in changes) {
                    if (changes.hasOwnProperty(advisor_id) && this.premium_features_model.isProperAdvisorId(advisor_id)) {
                        if (this.premium_features_model.isActivated(advisor_id)) {
                            this.activateTopMenuSection(advisor_id);
                        } else {
                            this.deactivateTopMenuSection(advisor_id);
                        }
                    }
                }

                this.handleCityOverviewLink();
            }, this);

            this.overviews_menu = {};
            this.overviews_menu[this.premium_features_model.CURATOR] = [
                'trade_overview',
                'command_overview',
                'recruit_overview',
                'unit_overview',
                'outer_units',
                'building_overview',
                'culture_overview',
                'gods_overview',
                'hides_overview',
                'town_group_overview',
                'towns_overview'
            ];

            this.overviews_menu[this.premium_features_model.CAPTAIN] = [
                'attack_planer',
                'farm_town_overview'
            ];

            this.$menu = $('#overviews_link_hover_menu');

            this.createTopMenu();
            this.bindTopMenuEvents();

            this.registerViewComponents();
        },

        createTopMenu: function() {
            this.$menu = $(us.template(this.controller.getTemplate('premium_menu'), {
                menu_data: this.overviews_menu,
                active: this.premium_features_model.getAllActivated(),
                l10n: this.l10n
            })).appendTo($(document.body));
        },

        bindTopMenuEvents: function() {
            var self = this;

            this.$menu.off('.top_menu');

            this.$menu.on('mouseleave.top_menu', function() {
                this.hideTopMenu();
            }.bind(this));

            this.$menu.on('click.top_menu touchstart.top_menu', 'a', function() {
                var $el = $(this),
                    name = $el.attr('name'),
                    type = $el.attr('type'),
                    is_subsection_disabled = $el.closest('.subsection').hasClass('disabled');

                if (is_subsection_disabled) {
                    if (type === 'advisor') {
                        PremiumWindowFactory.openAdvantagesTab(name);
                    } else {
                        PremiumWindowFactory.openAdvantagesFeatureTab(name);
                    }

                    self.hideTopMenu();
                } else {
                    if (type === 'overview') {
                        switch (name) {
                            case 'town_group_overview':
                                TownOverviewWindowFactory.openTownGroupOverview();
                                break;
                            case 'farm_town_overview':
                                FarmTownOverviewWindowFactory.openFarmTownOverview();
                                break;
                            case 'attack_planer':
                                AttackPlannerWindowFactory.openAttackPlannerWindow();
                                break;
                            default:
                                TownOverviewWindowFactory.openOverview(name);
                                break;
                        }

                        self.hideTopMenu();
                    }
                }
            });

            this.$el.on({
                'mouseenter.top_menu': Game.isIeTouch() ? this.delayedMouseEnterTopMenu.bind(this) : this.mouseEnterTopMenu.bind(this),
                'mouseleave.top_menu': (function(e) {
                    if (!this.$menu.find(e.relatedTarget).length && !Game.isIeTouch()) {
                        this.hideTopMenu();
                    }
                }).bind(this)
            });
        },

        delayedMouseEnterTopMenu: function(e) {
            setTimeout(this.mouseEnterTopMenu.bind(this, e), 1);
        },

        mouseEnterTopMenu: function() {
            var self = this;
            this.$menu.addClass('show').show();

            $.Observer(GameEvents.premium.overviews_menu.toggle_view).publish({
                state: 'show'
            });
        },

        hideTopMenu: function() {
            this.$menu.removeClass('show').hide();
            $.Observer(GameEvents.premium.overviews_menu.toggle_view).publish({
                state: 'hide'
            });
        },

        activateTopMenuSection: function(advisor_id) {
            var $section = this.$menu.find('.subsection.' + advisor_id);

            $section
                .removeClass('disabled')
                .addClass('enabled');

            $section.find('.advisors22x22')
                .removeClass(advisor_id + '_active')
                .removeClass(advisor_id + '_inactive')
                .addClass(advisor_id + '_active');
        },

        deactivateTopMenuSection: function(advisor_id) {
            var $section = this.$menu.find('.subsection.' + advisor_id);

            $section
                .removeClass('enabled')
                .addClass('disabled');

            $section.find('.advisors22x22')
                .removeClass(advisor_id + '_active')
                .removeClass(advisor_id + '_inactive')
                .addClass(advisor_id + '_inactive');
        },

        handleCityOverviewLink: function() {
            var model = this.premium_features_model;

            if (model.isActivated(model.CURATOR) || model.isActivated(model.CAPTAIN)) {
                this.activateCityOverviewLink();
            } else {
                this.deactivateCityOverviewLink();
            }
        },

        activateCityOverviewLink: function() {
            this.controller.getComponent('btn_premium').enable();
        },

        deactivateCityOverviewLink: function( /*adviser*/ ) {
            this.controller.getComponent('btn_premium').disable();
        },

        registerViewComponents: function() {
            var controller = this.controller;

            //Register Button controller
            controller.registerComponent('btn_premium', this.$el.button({
                template: 'internal'
            }).on('btn:click', (function(e, _btn) {
                var model = this.premium_features_model;
                if (model.isActivated(model.CURATOR)) {
                    TownOverviewWindowFactory.openOverview('trade_overview');
                } else if (model.isActivated(model.CAPTAIN)) {
                    FarmTownOverviewWindowFactory.openFarmTownOverview();
                }
            }).bind(this)));
        },

        destroy: function() {
            this.premium_features_model.off(null, null, this);
        }
    });

    window.GameViews.LayoutButtonPremium = LayoutButtonPremium;
}());