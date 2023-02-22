define('features/collected_items/views/collected_items', function() {
    'use strict';

    var GameViews = window.GameViews;

    return GameViews.BaseView.extend({
        initialize: function(options) {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);
            this.l10n = this.controller.getl10n();
            this.render();
            this.registerConfirmButton();
            this.registerCheckbox();
        },

        render: function() {
            var fragment = document.createDocumentFragment(),
                template = this.getTemplate('collected_items', {
                    l10n: this.l10n
                }),
                $fragment = $(fragment);


            $fragment.append(us.template(template));

            if (this.controller.isMissionsEvent()) {
                this.handleMissionsItems($fragment);
            } else {
                this.handleItems($fragment);
            }

            this.$el.html($fragment);
        },

        handleItems: function($fragment) {
            var last_item = this.controller.getCollectedItems().last(),
                $highlights, $values;

            $highlights = $fragment.find('.highlights');
            $values = $fragment.find('.values');

            if (last_item) {
                this.createAndAppendElement($highlights, {});
                this.createAndAppendElement($values, {}, last_item.getDelta());
            }
        },

        handleMissionsItems: function($fragment) {
            var items = this.controller.getCollectedItems(),
                $values;

            $values = $fragment.find('.values');

            items.forEach(function(item) {
                var attributes = {
                    "data-item_id": item.getItemId()
                };

                this.createAndAppendElement($values, attributes, item.getDelta());
            }.bind(this));
        },

        updateValue: function(item) {
            var $item = this.$el.find('.values [data-item_id=' + item.getItemId() + ']');
            $item.text(item.getDelta());
        },

        createAndAppendElement: function($el, attributes, text) {
            var div = document.createElement('div'),
                $div = $(div);

            for (var attr in attributes) {
                if (attributes.hasOwnProperty(attr)) {
                    $div.attr(attr, attributes[attr]);
                }
            }

            if (text !== null) {
                $div.text(text);
            }

            $el.append($div);
        },

        registerConfirmButton: function() {
            this.unregisterComponent('btn_confirm');
            this.registerComponent('btn_confirm', this.$el.find('.btn_confirm').button({
                caption: this.l10n.button
            }).on('btn:click', function() {
                this.controller.onConfirmClick();
            }.bind(this)));
        },

        registerCheckbox: function() {
            this.unregisterComponent('cbx_confirmation');
            this.registerComponent('cbx_confirmation', this.$el.find('.cbx_confirmation').checkbox({
                caption: this.l10n.checkbox
            }).on('cbx:check', function(ev, cbx, checked) {
                this.controller.onCheckboxClick(checked);
            }.bind(this)));
        }
    });
});