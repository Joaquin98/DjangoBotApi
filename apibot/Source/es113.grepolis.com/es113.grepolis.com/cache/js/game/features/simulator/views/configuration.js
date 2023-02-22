/* globals DM, isNumber */
define('features/simulator/views/configuration', function() {
    'use strict';

    var GameViews = require_legacy('GameViews'),
        GameData = require_legacy('GameData'),
        GameDataPowers = require_legacy('GameDataPowers'),
        TooltipFactory = require_legacy('TooltipFactory'),
        Categories = require('features/simulator/enums/categories'),
        GameDataConfig = require('data/game_config'),
        ATTACKER = 'attacker',
        DEFENDER = 'defender';

    return GameViews.BaseView.extend({
        initialize: function(options) {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);
            this.l10n = this.controller.getl10n();
            this.l10n_extra = DM.getl10n('COMMON', 'simulator');
            this.render();
        },

        registerResetButton: function() {
            this.unregisterComponent('btn_reset');
            this.registerComponent('btn_reset', this.$el.find('.btn_reset').button({
                caption: this.l10n.reset
            }).on('btn:click', this.controller.resetConfiguration.bind(this.controller)));
        },

        registerConfigurationWindowCloseButton: function() {
            var $button = $('<div class="btn_close"></div>');

            this.$el.append($button);

            this.unregisterComponent('close_button');
            this.registerComponent('close_button', $button.button({
                template: 'none'
            }).on('btn:click', this.controller.handleCloseButtonClick.bind(this.controller)));
        },

        registerScroll: function(name, $parent) {
            var $viewport = $parent.find('.js-scrollbar-viewport'),
                $content = $parent.find('.js-scrollbar-content');

            this.unregisterComponent(name);
            return this.registerComponent(name, $viewport.skinableScrollbar({
                template: 'tpl_skinable_scrollbar',
                skin: 'blue',
                elements_to_scroll: $content,
                element_viewport: $viewport
            }));
        },

        replaceOption: function(side, option, $new_option) {
            var selector = '.' + side + ' tr[data-option="' + option.power_id + '"]';

            if (option.hasOwnProperty('permutation')) {
                selector += '[data-permutation="' + option.permutation + '"]';
            }

            this.$el.find(selector).replaceWith($new_option);
        },

        renderOptionToCategory: function(side, category, option, replace) {
            var option_template,
                $row;

            if (category === Categories.TEMPLES) {
                option_template = this.getOptionTemplateTempleIcon(option, true);
            } else {
                option_template = this.getOptionTemplate(category, option, {
                    show_level: true
                });
            }

            $row = $(this.getTemplate('row_power', {
                side: side,
                category: category,
                option: option,
                option_template: option_template,
                description: this.getDescription(category, option)
            }));

            option.properties.forEach(function(property) {
                if (property.type === 'int') {
                    var $spinner = $row.find('.large_int_property');

                    if ($spinner) {
                        $spinner.spinner({
                            value: typeof option.configuration[property.name] !== "undefined" ?
                                option.configuration[property.name] : property.min,
                            step: property.step_size,
                            min: $spinner.data('min'),
                            max: $spinner.data('max')
                        }).on('sp:change:value', function(event, new_val) {
                            this.controller.setOptionPropertyValue(
                                side,
                                category,
                                option,
                                $(event.target).data('property_name'),
                                new_val
                            );
                        }.bind(this));
                    }
                }
            }.bind(this));

            if (category !== Categories.TEMPLES) {
                $row.find('.option').tooltip(this.getTooltip(category, option));
            }

            if (replace) {
                this.replaceOption(side, option, $row);
            } else {
                this.controller.addOptionToConfiguration(side, category, option);
                this.$el.find('.' + category + ' .' + side + ' tr:last-child').before($row);
            }

            $row.off().on('click', function(event) {
                var $target = $(event.target);

                if ($target.hasClass('btn_up')) {
                    if ($target.hasClass('count')) {
                        this.controller.adjustOptionCount(side, category, option, 1);

                        return;
                    }

                    this.controller.adjustOptionPropertyValue(
                        side,
                        category,
                        option,
                        $target.data('property_name'),
                        $target.data('step_size')
                    );
                } else if ($target.hasClass('btn_down')) {
                    if ($target.hasClass('count')) {
                        this.controller.adjustOptionCount(side, category, option, -1);

                        return;
                    }

                    this.controller.adjustOptionPropertyValue(
                        side,
                        category,
                        option,
                        $target.data('property_name'), -1 * $target.data('step_size')
                    );
                }
            }.bind(this));

            this.updateAddNewButton(side, category);
            this.scrollbar.update();
        },

        removeOptionFromCategory: function($button) {
            var $row = $button.parents('tr'),
                side = $row.data('side'),
                power_id = $row.data('option'),
                category = $row.data('category'),
                permutation = $row.data('permutation'),
                option = this.controller.getOption(category, power_id, permutation);

            $row.remove();
            this.controller.removeOptionFromConfiguration(side, category, option);

            this.updateAddNewButton(side, category);
            this.scrollbar.update();
        },

        getTooltip: function(category, option) {
            var result;

            switch (category) {
                case Categories.POWERS:
                case Categories.SPELLS:
                    result = TooltipFactory.createPowerTooltip(option.power_id, {},
                        option.configuration, undefined, true);
                    break;
                case Categories.TECHNOLOGIES:
                    result = TooltipFactory.getResearchTooltip(option.power_id);
                    break;
                case Categories.BUILDINGS:
                    result = GameData.buildings[option.power_id].name;
                    break;
                case Categories.ADVISORS:
                    result = TooltipFactory.getAdvisorTooltip(option.power_id);
                    break;
                case Categories.GAME_BONUSES:
                    result = this.getDescription(category, option);
                    break;
                default:
                    break;
            }

            return result;
        },

        getTempleDescription: function(option) {
            var power_configuration = {};

            for (var id in option.configuration) {
                if (!option.configuration.hasOwnProperty(id)) {
                    continue;
                }

                if (isNumber(option.configuration[id])) {
                    power_configuration[id] = option.configuration[id] * option.count;
                } else {
                    power_configuration[id] = option.configuration[id];
                }
            }

            return GameDataPowers.getTooltipPowerData(
                GameData.powers[option.power_id],
                power_configuration
            ).i_effect;
        },

        getGameBonusDescription: function(power_id) {
            var result = '';

            switch (power_id) {
                case 'strategy_breach':
                    result = GameData.researches.breach.description;
                    break;
                case 'alliance_modifier':
                    result = this.l10n_extra.alliance_modifier(GameDataConfig.getKillPointMultiplierAllianceUnits());
                    break;
                case 'building_tower':
                    result = this.l10n_extra.tower;
                    break;
                case 'is_night':
                    result = this.l10n_extra.night_bonus;
                    break;
                default:
                    break;
            }

            return result;
        },

        getDescription: function(category, option) {
            var result = '';

            switch (category) {
                case Categories.POWERS:
                case Categories.SPELLS:
                    var powerdata = GameData.powers[option.power_id];
                    if (powerdata.is_upgradable && option.configuration.level) {
                        var level_increases = option.configuration.level_increases;
                        option.configuration[level_increases] = (
                            powerdata.meta_defaults[level_increases] * option.configuration.level
                        ).toFixed(1);
                    }
                    result = GameDataPowers.getTooltipPowerData(
                        powerdata,
                        option.configuration,
                        typeof option.configuration.level !== "undefined" ? option.configuration.level : 1,
                        undefined,
                        true
                    ).i_effect;
                    break;
                case Categories.TEMPLES:
                    result = this.getTempleDescription(option);
                    break;
                case Categories.TECHNOLOGIES:
                    result = GameData.researches[option.power_id].description;
                    break;
                case Categories.BUILDINGS:
                    result = GameData.buildings[option.power_id].description;
                    break;
                case Categories.ADVISORS:
                    if (option.power_id === 'priest') {
                        result = this.l10n_extra.priestess;
                    } else {
                        result = this.l10n_extra[option.power_id];
                    }
                    break;
                case Categories.GAME_BONUSES:
                    result = this.getGameBonusDescription(option.power_id);
                    break;
                default:
                    break;
            }

            return result;
        },

        getOptionTemplateTempleIcon: function(option, show_count) {
            var count = show_count ? '<div class="level">' + option.count + '</div>' : '';

            return '<div class="icon temple_' + option.size + '">' + count + '</div>';
        },

        getOptionTemplateTemple: function(option) {
            var result = '<div class="option temple ' + option.power_id +
                '" data-id="' + option.power_id +
                '" data-permutation="' + option.permutation +
                '">' +
                this.getOptionTemplateTempleIcon(option) +
                '<div class="description">' + this.getDescription(Categories.TEMPLES, option) + '</div>' +
                '</div>';

            return result;
        },

        getOptionTemplatePower: function(option, settings) {
            var css_class = GameDataPowers.getCssPowerId(option);

            // Use level property if available (upgradable powers)
            if (option.configuration && option.configuration.level && settings && settings.show_level) {
                return '<div class="option power_icon45x45 ' + css_class + ' lvl lvl' + option.configuration.level +
                    ' ' + '" data-id="' + option.power_id + '"></div>';
            }

            // Derive level from cf_on effect property, if available (reward levels)
            if (option.configuration && option.configuration.cf_on && settings && settings.show_level) {
                var meta_defaults = GameData.powers[option.power_id].meta_defaults;

                return '<div class="option power_icon45x45 ' + css_class + ' lvl lvl' +
                    Math.round(
                        option.configuration[option.configuration.cf_on] / meta_defaults[option.configuration.cf_on]
                    ) + ' ' + '" data-id="' + option.power_id + '"></div>';
            }

            return '<div class="option power_icon45x45 ' + css_class + '" data-id="' + option.power_id + '"></div>';
        },

        getOptionTemplate: function(category, option, settings) {
            var result;

            switch (category) {
                case Categories.POWERS:
                case Categories.SPELLS:
                    result = this.getOptionTemplatePower(option, settings);
                    break;
                case Categories.TECHNOLOGIES:
                    result = '<div class="option research_icon research ' + option.power_id + '" data-id="' + option.power_id + '"></div>';
                    break;
                case Categories.BUILDINGS:
                    result = '<div class="option building_icon50x50 ' + option.power_id + '" data-id="' + option.power_id + '"></div>';
                    break;
                case Categories.ADVISORS:
                    result = '<div class="option advisors40x40 ' + option.power_id + '" data-id="' + option.power_id + '"></div>';
                    break;
                case Categories.TEMPLES:
                    result = this.getOptionTemplateTemple(option);
                    break;
                case Categories.GAME_BONUSES:
                    result = '<div class="option place_image ' + option.power_id + '" data-id="' + option.power_id + '"></div>';
                    break;
                default:
                    break;
            }

            return result;
        },

        renderCategoryPopupOptions: function($popup, side, category) {
            var $list = $popup.find('.options_list .js-scrollbar-content');

            this.controller.getAvailableCategoryOptionsBySide(side, category).forEach(function(option) {
                var $template = $(this.getOptionTemplate(category, option));

                if (category !== Categories.TEMPLES) {
                    $template.tooltip(this.getTooltip(category, option));
                }

                $list.append($template);
            }.bind(this));

            $popup.off().on('click', function(event) {
                var $target = $(event.target),
                    id, permutation, option;

                if ($target.hasClass('btn_close')) {
                    this.closeCategoryPopup();
                } else if ($target.hasClass('option')) {
                    id = $target.data('id');
                } else if ($target.parents('.option').length > 0) {
                    $target = $target.parents('.option');
                    id = $target.data('id');
                    permutation = $target.data('permutation');
                }

                if (id) {
                    option = this.controller.getOption(category, id, permutation);
                    this.closeCategoryPopup();
                    this.renderOptionToCategory($popup.data('side'), category, option);
                }
            }.bind(this));

            if (category === Categories.TEMPLES) {
                this.registerScroll('popup_scroll', $popup);
            }
        },

        closeCategoryPopup: function() {
            this.$el.find('.configuration_option_popup').remove();
            this.scrollbar.enable();
        },

        openCategoryPopup: function($button, category) {
            var button_top = $button.position().top,
                content_top = this.$configuration_content.position().top,
                popup_top = 0,
                offset = 20,
                $side = $button.parents('.side'),
                side = $side.data('id'),
                $popup, arrow_top, button_center, popup_bottom;

            this.closeCategoryPopup();
            this.scrollbar.disable();

            $popup = $(this.getTemplate('option_popup', {
                side: side,
                category: category,
                l10n: this.l10n,
                is_category_temples: category === Categories.TEMPLES
            }));

            $popup.appendTo(this.$el.find('.configuration_content'));

            this.renderCategoryPopupOptions($popup, side, category);

            button_top += $side.position().top + this.$content.position().top;
            button_center = (button_top + $button.outerHeight() / 2);

            popup_top = button_center - offset;
            popup_bottom = content_top + popup_top + $popup.outerHeight();

            if (popup_bottom > this.$el.height()) {
                popup_top = this.$el.height() - $popup.outerHeight() - content_top;
            }

            arrow_top = button_top - popup_top;

            $popup.css({
                top: popup_top
            });
            $popup.find('.speechbubble_arrow_l').css({
                top: arrow_top
            });
        },

        renderCategory: function($el, category) {
            $el.append(this.getTemplate('configuration_category', {
                category: category,
                l10n: this.l10n
            }));

            this.updateAddNewButton(ATTACKER, category);
            this.updateAddNewButton(DEFENDER, category);

            $el.find('.category.' + category).off().on('click', function(event) {
                var $target = $(event.target);

                if ($target.hasClass('btn_add_new') && !$target.hasClass('disabled')) {
                    this.openCategoryPopup($target, category);
                } else if ($target.hasClass('btn_remove')) {
                    this.removeOptionFromCategory($target);
                }
            }.bind(this));
        },

        renderConfigurationSections: function() {
            var $content = this.$el.find('.js-scrollbar-content');

            this.controller.getCategories().forEach(function(category) {
                this.renderCategory($content, category);
            }.bind(this));
        },

        registerConfigurationContentClick: function() {
            this.$el.find('.configuration_content').off().on('click', function(event) {
                var $target = $(event.target);

                if ($target.hasClass('header') && this.$el.find('.configuration_option_popup').length === 0) {
                    $target.parents('.configuration_section').toggleClass('closed');
                    this.scrollbar.update();
                }
            }.bind(this));
        },

        updateAddNewButton: function(side, category) {
            var $add_new_button = this.$el.find('.' + category + ' .' + side + ' .btn_add_new'),
                show_tooltip = !this.controller.hasAvailableCategoryOptions(side, category),
                tooltip = this.l10n.no_selection_tooltip;

            $add_new_button.toggleClass(
                'disabled',
                show_tooltip
            ).tooltip().destroy();

            if (show_tooltip) {
                $add_new_button.tooltip(tooltip);
            }
        },

        render: function() {
            this.renderTemplate(this.$el, 'configuration', {
                l10n: this.l10n
            });

            this.registerConfigurationWindowCloseButton();
            this.renderConfigurationSections();
            this.registerConfigurationContentClick();
            this.registerResetButton();

            this.$configuration_content = this.$el.find('.configuration_content');
            this.scrollbar = this.registerScroll('configuration_scroll', this.$configuration_content);
            this.$content = this.$configuration_content.find('.js-scrollbar-content');
        }
    });
});