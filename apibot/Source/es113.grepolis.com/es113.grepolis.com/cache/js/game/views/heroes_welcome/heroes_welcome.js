/*global GameEvents, TooltipFactory */

(function() {
    "use strict";

    var heroes_enum = require('enums/heroes');
    var BaseView = window.GameViews.BaseView;

    var HeroesWelcome = BaseView.extend({

        className: "heroes_welcome",

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n('heroes_welcome');
            this.template = this.controller.getTemplate('welcome_window');

            $.Observer(GameEvents.quest.close).subscribe(['heroesWelcome'], this._handleQuestCloseEvent.bind(this));

            this.render();

            return this;
        },

        /**
         * Render main layout
         */
        render: function() {
            var l10n = this.l10n;

            this.$el.html(us.template(this.template, {
                l10n: l10n,
                has_andromeda: this.controller.hasAndromeda()
            }));

            this.$el.find('.yellowBox').includeTemplate('generic_box');

            this.registerViewComponents();

            return this;
        },

        registerViewComponents: function() {
            var _self = this,
                $el = this.$el,
                controller = this.controller,
                l10n = this.l10n,
                has_andromeda = controller.hasAndromeda();

            this.controller.unregisterComponents();

            if (!has_andromeda) {
                //Progressbar
                controller.registerComponent('pb_quests_progress', $el.find('.pb_quests_progress').singleProgressbar({
                    value: controller.getFinishedTutorialQuestsCount(),
                    max: controller.getTutorialQuestsCount(),
                    animate: true,
                    prevent_overloading: true,
                    type: 'percentage',
                    template: 'tpl_pb_single_nomax'
                }));

                controller.registerComponent('pb_quests_progress_tooltip', $el.find('.pb_quests_progress .caption').tooltip(
                    TooltipFactory.getTutorialQuestsProgressbarTooltip()
                ));
            }

            //register "activate first quest" button"
            controller.registerComponent('btn_start_heroes', $el.find('#btn_start_heroes').button({
                caption: l10n.button
            }).on('btn:click', function() {
                var QuestlogWindowFactory = require('features/questlog/factories/questlog'),
                    hero_quest_id = _self.controller.getHeroQuestId();

                if (hero_quest_id) {
                    QuestlogWindowFactory.openWindow(hero_quest_id);
                }
                _self.controller.closeWindow();
            }));

            $el.find('.portrait').tooltip(TooltipFactory.getHeroCard(heroes_enum.ANDROMEDA), {}, false);
        },

        _handleQuestCloseEvent: function(e, data) {
            var pb = this.controller.getComponent('pb_quests_progress');

            //Update value in the progressbar
            pb.setValue(data.closed_quests);
            //Update tooltip on the progressbar
            pb.tooltip(TooltipFactory.getTutorialQuestsProgressbarTooltip());
        },

        destroy: function() {
            $.Observer().unsubscribe(['heroesWelcome']);
        }
    });

    window.GameViews.HeroesWelcome = HeroesWelcome;
}());