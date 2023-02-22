/*global GameData */

(function() {
    "use strict";

    //@todo why BaseController ????
    var HeroesCouncilExchangeCurrency = GameControllers.BaseController.extend({
        initialize: function() {
            GameControllers.BaseController.prototype.initialize.apply(this, arguments);

            return this;
        },

        /**
         * Render main layout
         */
        render: function($content_node) {
            this.$el = $content_node;

            this.$el.html(us.template(this.getTemplate('exchange_currency'), {
                l10n: this.getl10n().exchange_currency,
                denominator: GameDataHeroes.getCoinsExchangeOfferDenominator(),
                numerator: GameDataHeroes.getCoinsExchangeOfferNumerator()
            }));

            this.registerViewComponents();

            return this;
        },

        /**
         * Register main view components
         */
        registerViewComponents: function() {
            var denominator = GameDataHeroes.getCoinsExchangeOfferDenominator(),
                numerator = GameDataHeroes.getCoinsExchangeOfferNumerator();

            // be sure not to divide by 0;
            if (!(denominator && numerator)) {
                return this;
            }

            //@todo split it to controller and view to avoid misunderstandings
            var window_controller = this.window_controller,
                controller = this,
                l10n = this.l10n,
                model = this.model,
                current = {
                    wisdom: model.get('coins_of_wisdom'),
                    war: model.get('coins_of_war')
                },
                exchange = {
                    wisdom: {
                        min: -(current.wisdom - (current.wisdom % denominator)),
                        max: Math.floor(current.war / denominator) * numerator
                    },
                    war: {
                        min: -(current.war - (current.war % denominator)),
                        max: Math.floor(current.wisdom / denominator) * numerator
                    }
                },
                box = {
                    war: {},
                    wisdom: {}
                },
                slider, btn_save,
                handleChange;

            handleChange = function(o) {
                var new_value = {
                        war: current.war,
                        wisdom: current.wisdom
                    },
                    decrease_by = -o.sell,
                    increase_by = -decrease_by * (numerator / denominator);

                if (o.type === 'war') {
                    new_value.war += decrease_by;
                    new_value.wisdom += increase_by;

                    box.war.diff.setValue(decrease_by);
                    box.wisdom.diff.setValue(increase_by);

                } else {
                    new_value.wisdom += decrease_by;
                    new_value.war += increase_by;

                    box.war.diff.setValue(increase_by);
                    box.wisdom.diff.setValue(decrease_by);
                }

                box.war.value.setValue(new_value.war, {
                    silent: true
                });
                box.wisdom.value.setValue(new_value.wisdom, {
                    silent: true
                });
            };

            box.war.value = controller.registerComponent('heroes_coin_current_war', this.$('.current_value.type_war .textbox').textbox({
                type: 'number',
                value: current.war,
                max: current.war + exchange.war.max,
                hidden_zero: false
            }));

            box.wisdom.value = controller.registerComponent('heroes_coin_current_wisdom', this.$('.current_value.type_wisdom .textbox').textbox({
                type: 'number',
                value: current.wisdom,
                max: current.wisdom + exchange.war.wisdom,
                hidden_zero: false
            }));

            box.war.diff = controller.registerComponent('heroes_coin_exchange_war', this.$('.exchange_diff.type_war').colorTextbox({
                min: exchange.war.min,
                max: exchange.war.max,
                sanitize_function: function(new_val) {
                    return new_val < 0 ? (new_val - (new_val % denominator)) : (new_val - (new_val % numerator));
                }
            }).on('ctxt:change:value', function(e, value) {
                if (value > 0) {
                    slider.setValue(-(value * denominator / numerator));
                } else {
                    slider.setValue(-value);
                }
            }));

            box.wisdom.diff = controller.registerComponent('heroes_coin_exchange_wisdom', this.$('.exchange_diff.type_wisdom').colorTextbox({
                min: exchange.wisdom.min,
                max: exchange.wisdom.max,
                sanitize_function: function(new_val) {
                    return new_val < 0 ? (new_val - (new_val % denominator)) : (new_val - (new_val % numerator));
                }
            }).on('ctxt:change:value', function(e, value) {
                if (value > 0) {
                    slider.setValue(value * denominator / numerator);
                } else {
                    slider.setValue(value);
                }
            }));

            slider = controller.registerComponent('heroes_coin_exchange_slider', this.$('.exchange_slider').grepoSlider({
                max: (current.war - (current.war % denominator)),
                min: -(current.wisdom - (current.wisdom % denominator)),
                step: denominator,
                value: 0,
                snap: true
            }).on('sl:change:value', function(e, _sl, value) {
                btn_save.toggleDisable(value === 0);

                if (value > 0) {
                    handleChange({
                        sell: value,
                        type: 'war'
                    });
                } else {
                    handleChange({
                        sell: -value,
                        type: 'wisdom'
                    });
                }
            }));

            btn_save = controller.registerComponent('heroes_save_exchange', this.$('.save_exchange').button({
                disabled: true,
                caption: l10n.exchange_currency.save
            }).on('btn:click', function() {
                var value = slider.getValue(),
                    coins_type = value < 0 ? 'coins_of_wisdom' : 'coins_of_war',
                    amount = Math.abs(value);

                if (value) {
                    //This is bad... and all
                    window_controller.exchangeCoins(coins_type, amount);
                }
            }));

            return this;
        },

        destroy: function() {

        }
    });

    window.GameViews.HeroesCouncilExchangeCurrency = HeroesCouncilExchangeCurrency;
}());