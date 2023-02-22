/*global us, GameEvents */
(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;
    var GameDataPowers = require('data/powers');
    var GameDataInventory = require('data/inventory');
    var ContextMenuHelper = require('helpers/context_menu');

    var InventorySlotView = BaseView.extend({
        tagName: 'div',
        className: 'slot',

        initialize: function(options) {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n('body');

            this.disabled = options.disabled;
            this.disabled_button = options.disabled_button;
            this.slot_type = options.slot_type;
            this.cm_subcontext = options.slot_type + options.index;
            this.index = options.index;
        },

        render: function() {
            var $el = this.$el,
                type = this.model.getType(),
                is_empty = type === 'empty';

            var properties = null;
            var level = 0;
            if (!is_empty) {
                properties = this.model.getProperties();
                if (properties.configuration && properties.configuration.level) {
                    level = properties.configuration.level;
                }
            }

            $el.html(us.template(this.controller.getTemplate('slot'), {
                l10n: this.l10n,
                disabled: this.disabled,
                class_name: this._getIconClassName(),
                count: this.model.getCount()
            }));

            $el.addClass(this._getSlotClassName());

            this.registerComponents();

            return this;
        },

        registerComponents: function() {
            var self = this;

            this.unregisterComponents(this.cm_subcontext);

            if (this.model.getId() === 0) {
                // slot locked, add unlock button
                this.registerComponent('btn_unlock_' + this.index, this.$el.find('.button_new').button({
                    caption: GameDataInventory.getSlotCost(this.index + 1),
                    disabled: !this.disabled_button,
                    icon: true,
                    icon_type: 'gold',
                    icon_position: 'right',
                    tooltips: [{
                        title: '<h4>' + _('Add a new slot') + '</h4>' + s(_('You can add a new inventory slot for %1 gold.'), GameDataInventory.getSlotCost(this.index + 1)),
                        styles: {
                            width: 400
                        },
                        hide_when_disabled: true
                    }]
                }).on('btn:click', function(e, _btn) {
                    self.controller.onUnlockSlotButtonClick(_btn, self.index + 1);
                }), this.cm_subcontext);
            } else {
                // slot has a reward, add it
                this.registerComponent('reward_' + this.index, this.$el.find('.reward').reward({
                    reward: this.model.getProperties()
                }).on('rwd:click', function(event, reward, position) {
                    ContextMenuHelper.showContextMenu(event, position, {
                        context_menu: 'inventory',
                        data: {
                            event_group: GameEvents.window.inventory,
                            level_id: reward.level_id,
                            data: reward,
                            id: self.model.getId(),
                            slot_type: self.slot_type
                        }
                    });
                }), this.cm_subcontext);
            }
        },

        /**
         * Returns power icon css class name
         *
         * @return {String}
         * @private
         */
        _getIconClassName: function() {
            var type = this.model.getType(),
                class_name = '',
                is_empty = type === 'empty';

            if (!is_empty) {
                class_name = 'power_icon60x60 ' + GameDataPowers.getRewardCssClassIdWithLevel(this.model.getProperties());
            }

            return class_name;
        },

        /**
         * Returns css clas name of the slot
         *
         * @return {String}
         * @private
         */
        _getSlotClassName: function() {
            var type = this.model.getType(),
                class_name = '',
                is_empty = type === 'empty';

            if (this.disabled) {
                class_name += ' disabled';
            }

            if (is_empty) {
                class_name += ' empty';
            }

            return class_name;
        },

        destroy: function() {
            this.unregisterComponents(this.cm_subcontext);
            this.$el.remove();
        }
    });

    window.GameViews.InventorySlotView = InventorySlotView;
}());