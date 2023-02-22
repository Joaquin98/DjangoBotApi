/* globals us, DM, HelperBrowserEvents */
define('features/spells_dialog/views/spells_dialog_base', function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    return BaseView.extend({
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);

            this.registerEventListeners();
            this.unregisterComponents('powers_buttons');
            this.render();
        },

        rerender: function() {
            this.unregisterComponents('powers_buttons');
            this.render();
        },

        renderTemplate: function() {
            var template = DM.getTemplate('spells_dialog', 'index');

            this.$el.html(us.template(template, {
                l10n: this.controller.getl10n(),
                has_any_god: this.controller.hasAnyGod(),
                target_type: this.controller.getTargetType()
            }));

            this.renderBanner();
        },

        renderBanner: function() {
            var template = DM.getTemplate('spells_dialog', 'banner'),
                gods_in_towns = this.controller.getGodsInTowns(),
                gods_favor = this.controller.getCurrentFavorForGods(),
                powers = this.controller.getCastablePowersForAllGods(),
                banners = '';

            this.controller.getWorldAvailableGods().forEach(function(god_id) {
                var has_god = gods_in_towns.indexOf(god_id) >= 0,
                    god_class = god_id + (has_god ? '' : '_disabled');

                if (powers[god_id].length > 0) {
                    banners += us.template(template, {
                        god_id: god_id,
                        has_god: has_god,
                        god_class: god_class,
                        powers: powers[god_id],
                        current_favor: gods_favor[god_id]
                    });
                }
            });

            this.$el.find('.gods_container').append(banners);
        },

        registerEventListeners: function() {
            this.$el.off().on(HelperBrowserEvents.getOnMouseOverEventName(), '.js-power-icon', this.controller.btnSpellMouseOverHandler.bind(this.controller));
        },

        registerViewComponents: function() {
            //Initialize components only for powers which user has god for (rest should be disabled)
            var castable_powers = this.controller.getCastablePowersForAvailableGods();

            for (var god_id in castable_powers) {
                if (castable_powers.hasOwnProperty(god_id)) {
                    var powers = castable_powers[god_id];

                    for (var index in powers) {
                        if (powers.hasOwnProperty(index)) {
                            var power_id = powers[index];

                            this.registerComponent('powers_button_' + power_id, this.$el.find('.js-god-box[data-god_id="' + god_id + '"] .js-power-icon.' + power_id).button({
                                template: 'internal'
                            }).on('btn:click', this.controller.btnSpellClickHandler.bind(this.controller, power_id)), 'powers_buttons');
                        }
                    }
                }
            }

            if (!this.controller.hasAnyGod()) {
                var l10n = this.controller.getl10n();

                this.unregisterComponent('btn_go_to_temple');
                this.registerComponent('btn_go_to_temple', this.$el.find('.btn_to_temple').button({
                    caption: l10n.btn_to_temple
                }).on('btn:click', this.controller.onBtnAnyGodClick));
            }
        },

        renderGodsFavor: function() {
            var gods_favor = this.controller.getCurrentFavorForGods(),
                _self = this;

            this.$el.find('.js-god-box').each(function(index, el) {
                var $god_box = $(el),
                    god_id = $god_box.data('god_id');

                $god_box.find('.js-favor').html(gods_favor[god_id]);

                _self.updateButtonsStates(god_id);
            });
        },

        showViewReportBox: function(report_id) {
            var l10n = this.controller.getl10n();

            this.$el.find('.js-view-report-box').show();

            this.unregisterComponent('btn_view_report');
            this.registerComponent('btn_view_report', this.$el.find('.btn_view_report').button({
                template: 'internal',
                caption: l10n.view_report
            }).on('btn:click', this.controller.onBtnShowReportClick.bind(this, report_id)));
        }
    });
});