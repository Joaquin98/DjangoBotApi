/*global GodSelectionWindowFactory, TooltipFactory */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LG = {
        events: {
            'click .gods_favor_amount, .favor_progress, .fury_progress, .gods_container': 'openTemple'
        },

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.registerViewComponents();
        },

        _updateData: function() {
            var old_god = this.current_god;
            this.current_god = this.controller.getGodForCurrentTown();
            this.toggleFuryDisplay();
            this.setGodPortrait(old_god);
            this.setProgressValues();
            this.setPopups();

            this.controller.registerResourceChangeListener(old_god);
        },

        toggleFuryDisplay: function() {
            this.$el.toggleClass('show_fury', this.controller.showFuryResource());
        },

        registerViewComponents: function() {
            this.$favor_amount = this.$el.find('.gods_favor_amount .favor_amount');
            this.$fury_amount = this.$el.find('.gods_favor_amount .fury_amount');
            this.$gods_progress = this.$el.find('.gods_progress');
            this.$gods_favor = this.$el.find('.favor_progress');
            this.$gods_fury = this.$el.find('.fury_progress');
            this.$gods_container = this.$el.find('.gods_container');

            this.controller.registerComponent('pb_favor', this.$gods_favor.singleProgressbar({
                template: 'internal',
                type: 'circular',
                value: 0,
                max: this.controller.getMaxFavor(),
                draw_settings: {
                    start_angle: Math.PI * 9 / 8 - Math.PI / 2,
                    end_angle: Math.PI * 23 / 8 - Math.PI / 2,
                    start_color: 'rgb(89,209,251)',
                    end_color: 'rgb(35,139,283)',
                    line_thick: 4
                }
            }));

            this.controller.registerComponent('pb_fury', this.$gods_fury.singleProgressbar({
                template: 'internal',
                type: 'circular',
                value: 0,
                max: this.controller.getMaxFury(),
                draw_settings: {
                    start_angle: Math.PI * 6 / 5 - Math.PI / 2,
                    end_angle: Math.PI * 14 / 5 - Math.PI / 2,
                    start_color: 'rgb(250, 70, 20)',
                    end_color: 'rgb(200,20,20)',
                    line_thick: 4
                }
            }));
        },

        setPopups: function() {
            this.$favor_amount.tooltip(
                TooltipFactory.getFavorsTooltip(this.controller.getCurrentProductionOverview())
            );

            if (this.controller.showFuryResource()) {
                this.$fury_amount.tooltip(
                    TooltipFactory.getFuryTooltip(this.controller.getCurrentFury(), this.controller.getMaxFury())
                );
            }
        },

        setGodPortrait: function(old_god) {
            if (old_god === this.current_god) {
                return;
            }

            if (old_god) {
                this.$gods_container.removeClass('god ' + old_god);
            }

            if (this.current_god) {
                this.$gods_container.addClass('god ' + this.current_god);
            }
        },

        updateResource: function(component, $amount, value, max) {
            if (component === 'progress_favor' && !this.current_god) {
                $amount.removeClass('max');
                component.setValue(0);
            } else {
                $amount.toggleClass('max', value >= max);
                component.setMax(max);
                component.setValue(Math.min(value, max));
            }

            $amount.html(component.getValue());
        },

        setProgressValues: function() {
            var progress_favor = this.controller.getComponent('pb_favor'),
                progress_fury = this.controller.getComponent('pb_fury'),
                max_favor = this.controller.getMaxFavor(),
                max_fury = this.controller.getMaxFury(),
                current_fury = this.controller.getCurrentFury(),
                current_favor;

            if (this.current_god) {
                current_favor = this.controller.getCurrentFavorForGod(this.current_god);
            }

            this.updateResource(progress_favor, this.$favor_amount, current_favor, max_favor);
            this.updateResource(progress_fury, this.$fury_amount, current_fury, max_fury);
        },

        openTemple: function() {
            GodSelectionWindowFactory.openWindow();
        }
    };

    window.GameViews.LayoutGods = BaseView.extend(LG);
}());