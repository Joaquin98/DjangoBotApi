/* globals DM, jQuery, TooltipFactory, GameEvents, ConfirmationWindowFactory, Game */

(function($) {
    'use strict';

    $.fn.heroDropdown = function(params) {
        var settings = $.extend({
            template: '',
            options: [],
            value: '',
            default_value: '',
            tooltips: [],
            exclusions: [],
            visible_options: 5,
            id: null,
            confirmation_window: 'ConfirmationUnassignHeroWindowData'
        }, params);

        var _self = this,
            $el = $(this),
            $list,
            dropdown,
            btn_left,
            btn_right,
            scroll_index = 0,
            scroll_enabled = true;

        function calculateSizes() {
            var $item_list = $list.find('.js-item-list'),
                $viewport = $list.find('.js-list-viewport'),
                $list_items = $list.find('.js-item-list .option, .js-item-list .divider'),
                size = 0,
                viewport_size = 0,
                options_len = dropdown.getOptions().length,
                max = Math.min(options_len, settings.visible_options),
                count = 0;

            $list_items.each(function(index, el) {
                var $el = $(el);

                size += $el.outerWidth(true);

                if (count < max) {
                    viewport_size += $el.outerWidth(true);

                    // We take also sizes of dividers
                    if ($el.hasClass('option')) {
                        count++;
                    }
                }
            });

            $viewport.css({
                width: viewport_size
            });
            $item_list.css({
                width: size
            });

            $el.__recalculateInitialWidth();
        }

        function getEdgeIndex() {
            var max = dropdown.getOptions().length,
                i,
                edge_index = 0,
                $item_list = $list.find('.js-item-list'),
                $viewport = $list.find('.js-list-viewport'),
                item_list_width = $item_list.width(),
                viewport_width = $viewport.width();

            // Calculate edge element
            for (i = 0; i < max; i++) {
                var option_position = Math.round(
                    $list.find('.option_' + i).position().left * Game.ui_scale.normalize.factor
                );

                // position in FF is not exactly the same, its smaller by 1 pixel, no idea why,
                // that's why we compare with 1 before was:
                // if (parseInt($list.find('.option_' + i).position().left, 10) === item_list_width - viewport_width)
                if (Math.abs(option_position - (item_list_width - viewport_width)) <= 1) {
                    edge_index = i;
                }
            }

            return edge_index;
        }

        function enableScrolling() {
            // btn_left and btn_right must be valid - and jquery elements
            if (!btn_left || !btn_right || !btn_left.length || !btn_right.length) {
                return;
            }

            // Manage buttons
            btn_left.enable();
            btn_right.enable();

            scroll_enabled = true;

            if (scroll_index === 0) {
                btn_left.disable();
            }

            if (scroll_index === getEdgeIndex()) {
                btn_right.disable();
            }
        }

        function getScrollToIndex(scroll_to_index) {
            return Math.min(getEdgeIndex(), Math.max(0, scroll_to_index));
        }

        function scrollTo(index) {
            var $option,
                $item_list = $list.find('.js-item-list'),
                $viewport = $list.find('.js-list-viewport');

            // Determinate scroll index
            scroll_index = getScrollToIndex(index);

            // Move options
            $option = $list.find('.option_' + scroll_index);

            if ($option.length) {
                $item_list.css({
                    left: -Math.min(
                        $item_list.width() - $viewport.width(),
                        Math.max(0, $option.position().left * Game.ui_scale.normalize.factor)
                    )
                });
            }

            //Add "visible" classes to elements which are visible on the list
            var min = scroll_index,
                max = min + settings.visible_options;

            $list.find('.option').each(function(idx, el) {
                $(el).toggleClass('visible', idx >= min && idx < max);
            });

            enableScrolling();
        }

        function onListShow(e, $list) {
            var options_len = dropdown.getOptions().length;

            btn_left = $list.find('.btn_arrow_left').button({
                template: 'empty',
                disabled: options_len <= settings.visible_options
            }).on('btn:click', function() {
                scrollTo(scroll_index - 1);
            });

            btn_right = $list.find('.btn_arrow_right').button({
                template: 'empty',
                disabled: options_len <= settings.visible_options
            }).on('btn:click', function() {
                scrollTo(scroll_index + 1);
            });

            $list.find('.option').each(function(index, el) {
                var $el = $(el),
                    hero_id = $el.attr('name'),
                    data,
                    hero_model,
                    card_options;

                // Exclude empty option
                if (hero_id) {
                    data = _self.getOption(hero_id);
                    hero_model = data.hero_model || false;
                    card_options = {
                        show_portrait: false,
                        hero_level: data.hero_level,
                        additional_info: data.additional_info || false
                    };

                    if (hero_model && hero_model.isInjured()) {
                        $el.addClass('injured');
                    }

                    $el.tooltip(TooltipFactory.getHeroCard(hero_id, card_options), {}, false);
                }
            });

            scrollTo(scroll_index);
        }

        function onListHide() {
            if (btn_left && typeof btn_left.destroy === 'function') {
                btn_left.destroy();
            }
            if (btn_right && typeof btn_right.destroy === 'function') {
                btn_right.destroy();
            }
        }

        function onMouseWheelScroll(e, delta) {
            if (!scroll_enabled) {
                return;
            }

            // Delta in IE is 0.1 instead of 1
            delta = delta < 0 ? -1 : 1;

            scrollTo(scroll_index - delta);
        }

        function setTooltip(current_value) {
            if (current_value === '') {
                // Include initial tooltip message passed to the widget
                if (settings.tooltips.length) {
                    $el.tooltip(settings.tooltips[0].title, {});
                } else {
                    $el.tooltip(DM.getl10n('COMMON', 'heroes').assign, {});
                }
            } else {
                $el.tooltip(
                    TooltipFactory.getHeroCard(current_value, {
                        hero_level: _self.getCurrentOption().hero_level
                    }), {},
                    false
                );
            }
        }

        function removeTooltip() {
            var popup_obj = $el.data('popup_obj');

            if (popup_obj) {
                popup_obj.destroy();
            }
        }

        function unbindEvents() {
            $el.off('hd:change:value');
            $el.off('hd:list:show');
            $el.off('hd:list:hide');
        }

        function bindEvents() {
            var $item_list = $list.find('.js-item-list');

            unbindEvents();

            // Change value
            $el.on('dd:change:value', function(e, new_val, old_val, _dd, data) {
                if (new_val === '' && settings.confirmation_window && !data.not_existing_value) {
                    ConfirmationWindowFactory.openConfirmationWindow(new window[settings.confirmation_window]({
                        onConfirm: function() {
                            $el.trigger('hd:change:value', [new_val, old_val, _dd]);
                            setTooltip(new_val);
                        },
                        onCancel: function() {
                            dropdown.setValue(old_val, {
                                silent: true
                            });
                        }
                    }));
                } else {
                    $el.trigger('hd:change:value', [new_val, old_val, _dd]);
                    setTooltip(new_val);
                }
            });

            // List show
            $el.on('dd:list:show', function(e, $list) {
                onListShow(e, $list);

                $el.trigger('hd:list:show', [$list]);
                $.Observer(GameEvents.hero_dropdown.toggle).publish({});
            });

            // List hide
            $el.on('dd:list:hide', function(e, $list) {
                onListHide();

                $el.trigger('hd:list:hide', [$list]);
                $.Observer(GameEvents.hero_dropdown.toggle).publish({});
            });

            // Disable scrolling
            if (dropdown.getOptions().length > settings.visible_options) {
                $item_list.mousewheel(onMouseWheelScroll);

                $item_list.on('webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionend', function() {
                    enableScrolling();
                });
            }
        }

        this.setValue = function(value) {
            dropdown.setValue(value);
        };

        this.getValue = function() {
            return dropdown.getValue();
        };

        /**
         * get current option
         *
         * @return {object}
         */
        this.getCurrentOption = function() {
            return dropdown.getCurrentOption();
        };

        this.getOption = function(hero_id) {
            return dropdown.getOption('value', hero_id);
        };

        this.setOptions = function(options) {
            dropdown.setOptions(options);

            calculateSizes();

            return this;
        };

        this.resetValue = function(props) {
            dropdown.resetValue(props);

            return this;
        };

        this.updateTooltipWithLevel = function(level) {
            var options = dropdown.getOptions(),
                i,
                l = options.length;

            for (i = 0; i < l; i++) {
                options[i].hero_level = level;
            }

            setTooltip(this.getValue());
        };

        this.showList = function() {
            dropdown.show();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            unbindEvents();
            removeTooltip();
            dropdown.destroy();
        };

        // Initialize
        (function() {
            dropdown = $el.dropdown({
                template: settings.template,
                initial_message: '',
                class_name: 'chose_hero',
                list_pos: 'center',
                options: settings.options,
                value: settings.value,
                default_value: settings.default_value,
                tooltips: settings.tooltips,
                exclusions: settings.exclusions,
                id: settings.id
            });

            $list = dropdown.getListElement();

            calculateSizes();
            bindEvents();
            setTooltip(settings.value);
        }());

        return this;
    };
}(jQuery));