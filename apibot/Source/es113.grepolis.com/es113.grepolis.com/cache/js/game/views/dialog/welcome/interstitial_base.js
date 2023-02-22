/*globals us, Timestamp */

(function() {
    'use strict';

    var GameViews = window.GameViews;

    var DialogInterstitialBase = GameViews.BaseView.extend({
        initialize: function(options) {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.render();
        },

        /**
         * Render main layout
         */
        render: function() {
            this.$el.html(us.template(this.controller.getTemplate('welcome_screen'), {
                l10n: this.controller.getl10n(),
                event_type_css_class: this.controller.getEventName(),
                controller: this.controller,
                skin: this.controller.getBenefitSkin()
            }));

            this.$el.find('.yellowBox').includeTemplate('generic_box');

            this.registerViewComponents();

            return this;
        },

        registerViewComponents: function() {
            var $description;

            this.controller.registerComponent('btn_start', this.$el.find('.btn_start').button({
                caption: this.controller.getBtnStartCaption()
            }).on('btn:click', this.controller.handleOnButtonClick.bind(this.controller)));

            if (this.$el.find('.timer.cd_offer_timer')) {
                var countdown_component = this.$el.find('.cd_offer_timer').countdown2({
                        value: this.controller.getCountdownTime() - Timestamp.now(),
                        display: 'day_hr_min_sec'
                    })
                    .on('cd:finish', function() {
                        this.$el.hide();
                    }.bind(this));

                this.controller.registerComponent('special_offer_icon_countdown', countdown_component);
            }

            $description = this.$el.find('.description');
            if ($description.height() > 230) { // create wrapping boxes and make it all scrollable
                $description.addClass('scrolled').wrapInner('<div class="scrollbox"><div class="scrollable"></div></div>');
                $description = $description.find('.scrollbox');
                this.unregisterComponent('interstitial_description_scrollbar');
                this.registerComponent('interstitial_description_scrollbar', $description.skinableScrollbar({
                    orientation: 'vertical',
                    template: 'tpl_skinable_scrollbar',
                    skin: 'blue',
                    disabled: false,
                    elements_to_scroll: $description.find('.scrollable'),
                    element_viewport: $description,
                    scroll_position: 0
                }));
            }
        },

        destroy: function() {

        }
    });

    window.GameViews.DialogInterstitialBase = DialogInterstitialBase;
}());