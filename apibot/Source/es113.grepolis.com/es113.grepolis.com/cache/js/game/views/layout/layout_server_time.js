/*global TM, getHumanReadableTimeDate, Timestamp, MousePopup */

(function() {
    "use strict";

    var BaseView = window.GameViews.BaseView;

    var LayoutServerTime = BaseView.extend({
        //Keeps reference to the tooltip object
        tooltip: null,

        events: {
            'mouseover': '_handleMouseOverEvent',
            'mouseout': '_handleMouseOutEvent'
        },

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n();

            this.registerViewComponents();
        },

        registerViewComponents: function() {
            var el = this.$el[0];

            //Timer
            TM.unregister('layout_local_time');
            TM.register('layout_local_time', 1000, function() {
                el.innerHTML = getHumanReadableTimeDate(Timestamp.serverTimeToLocal());
            }, {});
        },

        /**
         * Shows popup with server time when user hover over the local time box
         */
        _handleMouseOverEvent: function(e) {
            var _self = this,
                server_time = getHumanReadableTimeDate(Timestamp.serverTime()),
                caption = this.l10n.server_time;

            this.tooltip = new MousePopup(caption + ': ' + server_time);

            this.$el.mousePopup(this.tooltip);

            this.tooltip.show(e);

            //Timer
            TM.unregister('layout_sever_time');
            TM.register('layout_sever_time', 1000, function() {
                //Update Server time only when tooltip is shown
                var server_time = getHumanReadableTimeDate(Timestamp.serverTime());
                _self.tooltip.updateContent(caption + ': ' + server_time);
            }, {});
        },

        /**
         * Destroys tooltip with server time
         */
        _handleMouseOutEvent: function() {
            TM.unregister('layout_sever_time', 1000);

            if (typeof this.tooltip.destroy === "function") {
                this.tooltip.onOutAnimationComplete();
                this.tooltip.destroy();
            }

            this.tooltip = null;
        }
    });

    window.GameViews.LayoutServerTime = LayoutServerTime;
}());