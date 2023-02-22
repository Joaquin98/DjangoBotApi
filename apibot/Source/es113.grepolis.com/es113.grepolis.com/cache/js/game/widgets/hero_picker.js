/*globals DM, MousePopup, jQuery, TooltipFactory, WF, ConfirmationUnassignHeroWindowData, us */

/**
 *
 * heroPicker widget
 *
 * Extends standard .heroDropdown;
 *
 * If needed: use standard heroDropdown events on main element
 * they will be detached upon widget destroy.
 *
 */

(function($) {
    "use strict";

    $.fn.heroPicker = function(params) {
        params.l10n = us.extend({}, DM.getl10n('COMMON', 'heroes'), params.l10n);

        var settings = $.extend({
            widget_template: DM.getTemplate('heroes', 'hero_picker'),
            template: DM.getTemplate('heroes', 'dropdown_select_hero'),
            options: [],
            value: '',
            default_value: '',
            tooltips: [],
            id: null, // id passed to obj - set as a part of className due to id used by internal dropdown functionality
            // template settings
            type: 'small',
            background_class: 'index_unit background_marble_brown',
            icon_class: 'unit_icon40x40',
            list_class: '',
            caption_class: 'level',
            btn_add_class: 'button_new square plus',
            btn_change_class: 'button_new square switch',
            btn_remove_class: 'button_new square remove',
            should_have_remove_and_change_btn: true,
            should_have_level_btn: false,
            template_params: {}
        }, params);

        var _self = this,
            $el = $(this),
            $list, $icon, $caption, $picker,
            hero_dropdown, $btn_add, $btn_change, $btn_remove, $level_spinner;

        function onListChange(e, hero_id, old_hero_id, data) {
            var option_data;
            if (hero_id) {
                option_data = hero_dropdown.getOption(hero_id);
                if (settings.should_have_remove_and_change_btn) {
                    $btn_change.enable();
                    $btn_remove.enable();
                }
                if (settings.should_have_level_btn) {
                    $level_spinner.enable();
                }
                $btn_add.disable();
                $icon.attr('class', 'icon ' + settings.icon_class + ' ' + hero_id);
                $caption.text(settings.type === 'small' ? hero_dropdown.getOption(hero_id).hero_level : hero_dropdown.getOption(hero_id).level);
                $picker.removeClass('no_hero');

            } else {
                if (settings.should_have_remove_and_change_btn) {
                    $btn_change.disable();
                    $btn_remove.disable();
                }
                if (settings.should_have_level_btn) {
                    $level_spinner.disable();
                }
                $btn_add.enable();
                $icon.attr('class', 'icon ' + settings.icon_class);
                $caption.text('');
                $picker.addClass('no_hero');
            }
        }

        function loadTemplates() {
            $el.html(us.template(settings.widget_template, us.extend({
                hero_id: settings.value || false,
                id: settings.id || false,
                l10n: settings.l10n,
                type: settings.type,
                background_class: settings.background_class,
                icon_class: settings.icon_class,
                list_class: settings.list_class,
                caption_class: settings.caption_class,
                btn_add_class: settings.btn_add_class,
                btn_change_class: settings.btn_change_class,
                btn_remove_class: settings.btn_remove_class,
                should_have_remove_and_change_btn: settings.should_have_remove_and_change_btn,
                should_have_level_btn: settings.should_have_level_btn,
            }, settings.template_params)));

            $picker = $el.find('.hero_picker');
            $list = $el.find('.list');
            $icon = $el.find('.icon');
            $caption = $el.find('.caption');
            $btn_add = $el.find('.btn_add');

            if (settings.should_have_remove_and_change_btn) {
                $btn_change = $el.find('.btn_change');
                $btn_remove = $el.find('.btn_remove');
            }

            if (settings.should_have_level_btn) {
                $level_spinner = $el.find('.place_sim_hero_spinner');
            }
        }

        function registerComponents() {
            var tooltips = settings.tooltips,
                l10n = settings.l10n;

            hero_dropdown = $list.heroDropdown(us.extend({}, settings, {
                tooltips: tooltips.dropdown
            }));

            $btn_add = $btn_add.button({
                tooltips: tooltips.btn_add || [{
                    title: l10n.assign
                }]
            });

            if (settings.should_have_remove_and_change_btn) {
                $btn_change = $btn_change.button({
                    disabled: true,
                    tooltips: tooltips.btn_change || [{
                        title: l10n.change
                    }]
                });

                $btn_remove = $btn_remove.button({
                    disabled: true,
                    tooltips: tooltips.btn_remove || [{
                        title: l10n.unassign
                    }]
                });
            }

            if (settings.should_have_level_btn) {
                $level_spinner = $level_spinner.spinner({
                    value: 1,
                    max: 20,
                    min: 1,
                    step: 1,
                    disabled: true
                });
            }

            // setup initial state
            if (settings.value) {
                onListChange(false, settings.value);
            }
        }

        // unbind events on widget destroy
        function unbindGlobalEvents() {
            $el.off('hd:change:value');
            $el.off('hd:list:show');
            $el.off('hd:list:hide');
        }

        function unbindLocalEvents() {
            hero_dropdown.off("hd:change:value");
            $btn_add.off("btn:click");
            if (settings.should_have_remove_and_change_btn) {
                $btn_change.off("btn:click");
                $btn_remove.off("btn:click");
            }
            if (settings.should_have_level_btn) {
                $level_spinner.off("sp:change:value")
            }
        }

        function bindLocalEvents() {
            unbindLocalEvents();

            hero_dropdown.on("hd:change:value", onListChange);

            $btn_add.on("btn:click", function() {
                hero_dropdown.showList();
            });

            if (settings.should_have_remove_and_change_btn) {
                $btn_change.on("btn:click", function() {
                    hero_dropdown.showList();
                });

                $btn_remove.on("btn:click", function() {
                    hero_dropdown.resetValue();
                });
            }

            if (settings.should_have_level_btn) {
                $level_spinner.on('sp:change:value', function(e, new_val) {
                    $caption.text(new_val);
                });
            }
        }

        this.setValue = function(value) {
            hero_dropdown.setValue(value);
            return this;
        };

        this.getValue = function() {
            return hero_dropdown.getValue();
        };

        this.getCurrentlySelectedHeroAndLevel = function() {
            return {
                name: hero_dropdown.getValue(),
                level: $level_spinner.getValue()
            };
        };

        this.getCurrentOption = function() {
            return hero_dropdown.getCurrentOption();
        };

        this.getOption = function(hero_id) {
            return hero_dropdown.getOption(hero_id);
        };

        this.setOptions = function(options) {
            hero_dropdown.setOptions(options);
            return this;
        };

        this.resetValue = function(props) {
            hero_dropdown.resetValue(props);
            return this;
        };

        this.updateTooltipWithLevel = function(level) {
            hero_dropdown.updateTooltipWithLevel(level);
            return this;
        };

        this.showList = function() {
            hero_dropdown.showList();
            return this;
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            unbindLocalEvents();
            unbindGlobalEvents();
            hero_dropdown.destroy();
            $btn_add.destroy();
            if (settings.should_have_remove_and_change_btn) {
                $btn_change.destroy();
                $btn_remove.destroy();
            }

            if (settings.should_have_level_btn) {
                $level_spinner.destroy();
            }

        };

        //Initialize
        (function() {
            loadTemplates();
            registerComponents();
            bindLocalEvents();
        }());

        return this;
    };
}(jQuery));