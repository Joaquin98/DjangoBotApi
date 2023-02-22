/*globals us */

(function() {
    'use strict';

    var DialogInfo = GameViews.BaseView.extend({
        initialize: function() {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.render();
        },

        /**
         * This method can be overwritten by child view
         */
        render: function() {

            this.$el.html(us.template(this.controller.getDialogInfoTemplate(), {
                l10n: this.controller.getl10n(),
                type: this.controller.getType()
            }));

            this.registerViewComponents();

            return this;
        },

        /**
         * This method can be overwritten by child view
         */
        registerViewComponents: function() {

        },

        destroy: function() {

        }
    });

    window.GameViews.DialogInfo = DialogInfo;
}());