/* global TooltipFactory, GameDataUnits, ngettext */
(function($) {
    'use strict';

    $.fn.toolbarActivity = function(params) {
        var settings = $.extend({
            template: '',
            caption: 0,
            options: [],
            l10n: {},
            state: false,
            exclude_click_nodes: ['js-delete'],
            exclude_click_nodes_for_hide: [],
            auto_hide_list: true,
            has_countdown_timers: true,
            config: {},
            tooltips: {
                btn_remove: function(option) {}
            },
            onOptionInit: function($option) {
                return $option;
            }
        }, params);

        var $el = $(this);

        //Keeps references to countdown components
        var countdowns = [],
            buttons = [];

        var button, dropdown;

        function unbindEvents() {
            $el.off('wgtta:btn:click');
            $el.off('wgtta:btn:reduce:click');
            $el.off('wgtta:btn:remove:click');
        }

        function bindEvents() {
            unbindEvents();
        }

        /**
         * Loads template and initiates elements
         */
        function loadTemplate() {
            //Bind events
            bindEvents();
        }

        function getOptionById(order_id) {
            var orders = dropdown.getOptions(),
                i, l = orders.length;

            for (i = 0; i < l; i++) {
                if (typeof orders[i].getId !== 'undefined' && orders[i].getId() === order_id) {
                    return orders[i];
                }
            }

            return false;
        }

        function initializeListButtons() {
            var $list = dropdown.getListElement();

            //Buttons which cancels orders
            $list.find('.button_new.remove').each(function(index, el) {
                var $btn = $(el),
                    id = $btn.data('id'),
                    option = getOptionById(id);

                buttons.push($btn.button({
                    tooltips: [{
                        title: TooltipFactory.getRefundTooltip(option.getCancelRefund())
                    }]
                }).on('btn:click', function(id, e, _btn) {
                    $el.trigger('wgtta:btn:remove:click', [id, _btn]);
                }.bind(null, id)));
            });

            //Buttons which build time reducts
            $list.find('.button_new.reduction').each(function(index, el) {
                var $btn = $(el),
                    id = $btn.data('id'),
                    reduction_costs = GameDataUnits.getUnitOrderBuildTimeReductionCost(),
                    tooltip = s(ngettext('You can cut the recruitment time in half for %1 gold.', 'You can cut the recruitment time in half for %1 gold.', reduction_costs), reduction_costs);

                buttons.push($btn.button({
                    tooltips: [{
                        title: tooltip
                    }]
                }).on('btn:click', function(id, e, _btn) {
                    $el.trigger('wgtta:btn:reduce:click', [id, _btn]);
                }.bind(null, id)));
            });
        }

        function destroyListButtons() {
            var i, l = buttons.length;

            for (i = 0; i < l; i++) {
                buttons[i].destroy();
            }
        }

        /**
         * Initializes countdowns for the list items
         */
        function initializeListCountdowns() {
            var $list = dropdown.getListElement(),
                $items = $list.find('.option');

            $items.each(function(index, el) {
                var $item = $(el);

                countdowns.push(settings.onOptionInit($item).on('cd:condition', function(e, seconds) {
                    destroyListButtons();
                    initializeListButtons();
                }));
            });
        }

        function destroyListCountdowns() {
            var i, l = countdowns.length;

            //Destroy all countdowns
            for (i = 0; i < l; i++) {
                countdowns[i].destroy(true);
            }
        }

        function rerenderList(options) {
            //Destroys countdowns for the list
            if (settings.has_countdown_timers) {
                destroyListCountdowns();
            }
            destroyListButtons();

            dropdown.setOptions(options);

            //Initialize countdowns for the list
            if (settings.has_countdown_timers) {
                initializeListCountdowns();
            }
            initializeListButtons();
        }

        this.setOptions = function(options) {
            rerenderList(options);
            $el.trigger('wgtta:options:set');
        };

        this.rerenderList = function() {
            rerenderList(dropdown.getOptions());
        };

        /**
         * Sets caption of the button which indicates number of activities
         */
        this.setCaption = function(value) {
            $el.find('.js-caption').html(value);
        };

        this.setButtonState = function(value) {
            button.setState(value);
        };

        this.setState = function(state) {
            button.setState(state);
        };

        this.updateDropDownListSize = function() {
            dropdown.updateDropDownListSize();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            //Destroys countdowns for the list
            destroyListCountdowns();
            //Destroys buttons for the list
            destroyListButtons();

            unbindEvents();

            button.destroy();
            dropdown.destroy();
        };

        //Initialize
        (function() {
            loadTemplate();

            button = $el.button({
                template: 'internal',
                caption: settings.caption,
                toggle: false,
                state: settings.state
            }).on('btn:click:odd', function() {
                $el.trigger('wgtta:btn:click:odd');
            }).on('btn:click:even', function() {
                $el.trigger('wgtta:btn:click:even');
            });

            dropdown = $el.find('.js-dropdown').dropdown({
                list_pos: 'left',
                hover: true,
                click: false,
                type: 'image',
                value: 0,
                template: settings.template,
                options: settings.options,
                auto_hide_list: settings.auto_hide_list,
                l10n: settings.l10n,
                exclude_click_nodes: settings.exclude_click_nodes,
                exclude_click_nodes_for_hide: settings.exclude_click_nodes_for_hide,
                config: settings.config
            }).on('dd:list:show', function(e, $list, _dd) {
                $el.trigger('wgtta:list:show', [$list, _dd]);
            }).on('dd:list:hide', function(e, $list, _dd) {
                $el.trigger('wgtta:list:hide', [$list, _dd]);
            });

            //Initialize countdowns for the list
            initializeListCountdowns();
            initializeListButtons();
        }());

        return this;
    };
}(jQuery));