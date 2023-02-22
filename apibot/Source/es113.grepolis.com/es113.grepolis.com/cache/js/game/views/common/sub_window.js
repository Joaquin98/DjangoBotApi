/*global GameViews, us, DM */

(function() {
    'use strict';

    var SubWindowView = GameViews.BaseView.extend({
        $curtain: null,
        css_classes: null,

        initialize: function(options) {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.$parent = options.$parent;
            this.css_classes = options.css_classes;

            this.render();
        },

        render: function() {
            var template = DM.getTemplate('COMMON', 'wnd_generic');

            this.$parent.append(us.template(template, {
                l10n: this.controller.getl10n(),
                css_classes: this.css_classes,
                closeable: this.controller.isCloseable()
            }));

            this.$el = this.$parent.find('.js-details-window-root');
            this.$curtain = this.$parent.find('.js-details-window-curtain');
            this.$title = this.$parent.find('.js-details-window-root .title');

            this.registerViewComponents();

            return this;
        },

        /**
         * Centers sub window
         */
        center: function() {
            var $el = this.$el,
                $parent = $el.parent(),
                parent_width = $parent.width(),
                parent_height = $parent.height(),
                width = $el.width(),
                height = $el.height();

            $el.css({
                top: parseInt((parent_height - height) / 2, 10),
                left: parseInt((parent_width - width) / 2, 10)
            });
        },

        /**
         * Centers sub window at the top of the parent window
         */
        centerTop: function() {
            var $parent = this.$el.parent(),
                parent_width = $parent.width(),
                width = this.$el.width();

            this.$el.css({
                top: 0,
                left: Math.round((parent_width - width) / 2)
            });
        },

        setTitle: function(title) {
            this.$title.text(title);
        },

        getTitle: function() {
            return this.$title.text();
        },

        registerViewComponents: function() {
            var _self = this;

            if (this.controller.isCloseable()) {
                this.unregisterComponents();
                this.registerComponent('btn_close', this.$el.find('.js-button-close').button({
                    template: 'empty'
                }).on('btn:click', function() {
                    _self.controller.close();
                }));
            }
        },

        destroy: function() {
            this.$curtain.remove();
            this.$el.remove();
        }
    });

    window.GameViews.SubWindowView = SubWindowView;
}());