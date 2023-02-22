/*global us, GameViews */
(function() {
    'use strict';

    var View = window.GameViews.BaseView;

    var InventoryMainView = View.extend({

        initialize: function() {
            View.prototype.initialize.apply(this, arguments);

            this.views_slots = [];
            this.premium_slots = [];
            this.initial_width = this.controller.window_model.getWidth();

            this.render();
        },

        render: function() {
            this.$el.html(us.template(this.controller.getTemplate('index'), {
                l10n: this.controller.getl10n('body')
            }));

            this.renderSlots();
            this.renderPremiumSlots();
        },

        /**
         * Rerenders inventory slots
         */
        rerenderSlots: function() {
            this.destroySlots();
            this.renderSlots();
        },

        /**
         * Renders inventory slots
         */
        renderSlots: function() {
            var $slots = this.$el.find('.js-slots'),
                i, disabled, slot, first_disabled = false,
                total_slots = this.controller.getTotalAmountOfSlots(),
                accessible_slots = this.controller.getAmountOfAccessibleSlots(),
                prepared_slots = document.createDocumentFragment();

            for (i = 0; i < total_slots; i++) {
                disabled = i >= accessible_slots;

                slot = this.initializeSlotView(this.controller.getItemModelByIndex(i), disabled, !first_disabled && disabled, 'regular', i);

                if (!first_disabled && disabled) {
                    first_disabled = true;
                }

                prepared_slots.appendChild(slot.render().el);

                this.views_slots[i] = slot;
            }

            $slots.append(prepared_slots);
        },

        rerenderPremiumSlots: function() {
            this.destroyPremiumSlots();
            this.renderPremiumSlots();
        },

        /**
         * Renders premium inventory slots
         */
        renderPremiumSlots: function() {
            var $slots = this.$el.find('.js-premium-slots'),
                items = this.controller.getGroupedPremiumItems(),
                prepared_slots = document.createDocumentFragment(),
                row_size = 10,
                $fade_to_black = $('<div/>').addClass('fade_to_black'),
                initial_width = this.initial_width,
                scrollbar_width = 17;

            // make extended area visible if we have items
            this.$el.find('.premium_inventory').toggle(items.length > 0);


            for (var i = 0, l = items.length; i < l; i++) {
                var slot = this.initializeSlotView(
                    items[i],
                    false,
                    false,
                    'premium',
                    i
                );

                prepared_slots.appendChild(slot.render().el);
                this.premium_slots[i] = slot;
            }

            $slots.empty().append(prepared_slots);

            if (items.length > row_size) {
                this.$el.append($fade_to_black);
                this.controller.window_model.setWidth(initial_width + scrollbar_width);
                this._limitViewportHeight();
                this.$el.addClass('with_scrollbar');
                this.initializeScrollbar();
            } else {

                this._unLimitViewportHeight();
                this.controller.unregisterComponent('inventory_scrollbar');
                this.$el.find('.js-scrollbar-content').removeAttr('style');
                this.controller.window_model.setWidth(initial_width);
                this.$el.find('.fade_to_black').remove();
                this.$el.removeClass('with_scrollbar');
            }

        },

        _limitViewportHeight: function() {
            this.$el.find('.js-scrollbar-viewport').height(400);

        },

        _unLimitViewportHeight: function() {
            this.$el.find('.js-scrollbar-viewport').height('auto');
        },

        initializeScrollbar: function() {
            this.controller.registerComponent('inventory_scrollbar', this.$el.skinableScrollbar({
                orientation: 'vertical',
                template: 'tpl_skinable_scrollbar',
                skin: 'blue',
                disabled: false,
                elements_to_scroll: this.$el.find('.js-scrollbar-content'),
                element_viewport: this.$el.find('.js-scrollbar-viewport'),
                scroll_position: 0,
                min_slider_size: 16
            }));
        },

        initializeSlotView: function(model, disabled, disabled_button, slot_type, index) {
            return new GameViews.InventorySlotView({
                controller: this.controller,
                model: model,
                disabled: disabled,
                disabled_button: disabled_button,
                slot_type: slot_type,
                index: index
            });
        },

        _destroySlot: function(slot) {
            slot.destroy();
        },

        /**
         * Cleans up slots views
         */
        destroySlots: function() {
            this.views_slots.forEach(this._destroySlot);
            this.views_slots = [];
        },

        /**
         * Cleanup premium slots
         */
        destroyPremiumSlots: function() {
            this.controller.unregisterComponent('inventory_scrollbar');
            this.premium_slots.forEach(this._destroySlot);
            this.premium_slots = [];
        },

        destroy: function() {
            this.destroySlots();
            this.destroyPremiumSlots();
        }
    });

    window.GameViews.InventoryMainView = InventoryMainView;
}());