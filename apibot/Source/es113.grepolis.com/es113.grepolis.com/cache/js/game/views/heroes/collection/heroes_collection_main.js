/*global define, GameData, TooltipFactory, MousePopup, hOpenWindow */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var HeroesCollection = BaseView.extend({
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = $.extend({}, this.controller.getl10n('collection'), this.controller.getl10n('common'));

            this.player_heroes_collection = this.controller.getCollection('player_heroes');
            this.player_heroes_collection.on('add', this.render, this);

            this.render();
        },

        /**
         * Render main layout
         */
        render: function() {
            var controller = this.controller;

            this.$el.html(us.template(controller.getTemplate('collection_main'), {
                l10n: this.l10n
            }));

            this.renderList();
            this.registerViewComponents();
        },

        /**
         * Register main view components
         */
        registerViewComponents: function() {
            var $el = this.$el,
                controller = this.controller,
                $scrollbar = $el.find('.scrollbar_all_heroes');

            controller.unregisterComponents();

            //Initialize list
            controller.registerComponent('scrollbar_all_heroes', $scrollbar.skinableScrollbar({
                orientation: 'vertical',
                template: 'tpl_skinable_scrollbar',
                skin: 'round',
                elements_to_scroll: $scrollbar.find('.js-scrollbar-content'),
                element_viewport: $scrollbar.find('.js-scrollbar-viewport'),
                scroll_position: 0,
                min_slider_size: 16,
                hide_when_nothing_to_scroll: true
            }));
        },

        /**
         * Render heroes lists (first render is done in onInit in pager component)
         */
        renderList: function() {
            var controller = this.controller,
                heroes = controller.getHeroes();

            this.$el.find('.js-scrollbar-content').html(us.template(controller.getTemplate('heroes_list'), {
                l10n: this.l10n,
                heroes: heroes
            }));

            this.registerListComponents(heroes);
        },

        registerListComponents: function(heroes) {
            var $el = this.$el,
                i, l = heroes.length,
                hero;

            for (i = 0; i < l; i++) {
                hero = heroes[i];
                $el.find('.hero_box.' + hero.id).tooltip(TooltipFactory.getHeroCard(hero.id, {
                    show_requirements: true
                }), {}, false);
            }
        },

        destroy: function() {

        }
    });

    window.GameViews.HeroesCollection = HeroesCollection;
}());