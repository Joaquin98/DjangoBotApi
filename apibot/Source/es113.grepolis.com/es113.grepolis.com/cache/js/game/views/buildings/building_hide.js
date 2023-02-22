/* global GameEvents, hOpenWindow, BuildingWindowFactory, GameDataBuildings, us */

(function() {
    'use strict';

    var BaseView = window.GameViews.BaseView;

    var BuildingHideView = BaseView.extend({
        // basics

        /**
         * @property {window.GameControllers.BuildingHideIndexController}
         */
        controller: null,

        /**
         * @property {Object}
         */
        l10n: null,

        /**
         * @property {String}
         */
        sub_context: null,

        /**
         * @property {window.GameModels.Town}
         */
        town: null,

        /**
         * set up variables and trigger render
         */
        initialize: function() {
            BaseView.prototype.initialize.apply(this, arguments);

            this.l10n = this.controller.getl10n('index');
            this.sub_context = 'building_hide_index';
            this.town = this.controller.getCurrentTown();

            this.render();
            this.registerListeners();
        },

        unregisterListeners: function() {
            $.Observer(GameEvents.town.town_switch).unsubscribe(['window.GameViews.BuildingHideView']);
            $.Observer(GameEvents.notification.report.arrive).unsubscribe(['window.GameViews.BuildingHideView']);
            this.stopListening();
        },

        registerListeners: function() {
            $.Observer(GameEvents.town.town_switch).subscribe(['window.GameViews.BuildingHideView'], this._onTownChange.bind(this));
            this.listenTo(this.town, 'change:espionage_storage', this._onIronOrStorageChange.bind(this, true));
            this.listenTo(this.town, 'change:iron', this._onIronOrStorageChange.bind(this, false));
            this.listenTo(this.controller.getCollection('movements_spys'), 'change add remove', this._onTownChange.bind(this));


            /* LastSypReports does not get pushed when reports arrive, so we listen for any report and do something */
            $.Observer(GameEvents.notification.report.arrive).subscribe(['window.GameViews.BuildingHideView'], this._onNewSpyReport.bind(this));
            //this.controller.getLastSpyReports().onNewSpyReport(this, this._onNewSpyReport.bind(this));
        },

        /**
         * unregister all components
         */
        unregisterViewComponents: function() {
            this.controller.unregisterComponents(this.sub_context);
        },

        registerViewComponents: function() {
            var $el = this.$el,
                controller = this.controller,
                sub_context = this.sub_context,
                slider_base_values = this._getSliderBaseValues(controller),
                $hide_slider_box_with_image = $el.find('.hide_slider_box_with_image'),
                slider;

            slider = controller.registerComponent('hide_slider_box_with_image', $hide_slider_box_with_image.imageBoxSlider({
                max: slider_base_values.hide_order_max_value,
                min: slider_base_values.hide_order_min_value,
                step: 100,
                button_step: 1,
                value: slider_base_values.hide_order_max_value,
                snap: true,
                disabled: slider_base_values.not_enough_iron
            }).on('ibsl:change:value', function(e, _sl, value) {
                $.Observer(GameEvents.window.town.hide.count_change).publish({
                    value: value
                });
            }).on('ibsl:click', function() {
                controller.storeIron(slider.getValue());
            }), sub_context);

            slider.setMax(slider_base_values.hide_order_max_value);

            if (slider_base_values.not_enough_iron) {
                slider.disable();
            } else {
                slider.enable();
            }

            this._fillStorageBar(slider_base_values.max_hide_storage, slider_base_values.hide_storage_level_unlimited, slider_base_values.iron_stored, slider_base_values.current_level);

            $('#hide_reports').on('click', '.game_list li a.view_report', function() {
                var report_id = $(this).data('report-id');
                hOpenWindow.viewReport(report_id);
            });
        },

        /**
         *
         * @param {Number} max_hide_storage
         * @param {Number} hide_storage_level_unlimited
         * @param {Number} iron_stored
         * @param {Number} current_level
         * @return void
         * @private
         */
        _fillStorageBar: function(max_hide_storage, hide_storage_level_unlimited, iron_stored, current_level) {
            var width = max_hide_storage !== hide_storage_level_unlimited ? iron_stored / current_level * 0.28 : 280;

            this.$el.find('.storage_resbar .storage_res').css({
                width: width + 'px'
            });
            this.$el.find('.hide_storage_level').html(iron_stored);
            this.$el.find('.hide_storage_max').html(max_hide_storage !== hide_storage_level_unlimited ? max_hide_storage : '&infin;');
        },

        /**
         * event handler upon town change
         * re-render the whole view
         *
         * @return void
         * @private
         */
        _onTownChange: function() {
            this.unregisterListeners();
            this.unregisterViewComponents();

            this.town = this.controller.getCurrentTown();

            this.render();
            this.registerListeners();
        },

        _onNewSpyReport: function() {
            // TODO only redraw last spy reports instead of refreshing the whole cave, to keep current silver selection
            this.controller.closeWindow();
            BuildingWindowFactory.open('hide');
        },

        _getSliderBaseValues: function(controller) {
            var town = this.town,
                current_level = town.getBuildings().get('hide'),
                max_hide_storage = town.getHideStorageCapacity(),
                hide_storage_level_unlimited = GameDataBuildings.getHideStorageLevelUnlimited(),
                iron_stored = town.getEspionageStorage(),
                payed_iron = controller.getPayedIron(),
                max_iron_to_store = max_hide_storage - iron_stored - payed_iron,
                hide_order_max_value = max_hide_storage === hide_storage_level_unlimited ? town.getResource('iron') : Math.max(0, Math.min(town.getResource('iron'), max_iron_to_store)),
                hide_order_min_value = 0,
                not_enough_iron = hide_order_max_value < hide_order_min_value || hide_order_max_value === 0;

            return {
                current_level: current_level,
                max_hide_storage: max_hide_storage,
                hide_storage_level_unlimited: hide_storage_level_unlimited,
                iron_stored: iron_stored,
                hide_order_min_value: hide_order_min_value,
                hide_order_max_value: hide_order_max_value,
                not_enough_iron: not_enough_iron
            };
        },

        /**
         * event handler if town resource iron or espionage storage changes
         * Updates available iron and hide storage value
         *
         * @return void
         * @private
         */
        _onIronOrStorageChange: function(reset_to_max) {
            var controller = this.controller,
                slider = controller.getComponent('hide_slider_box_with_image', this.sub_context),
                slider_base_values = this._getSliderBaseValues(controller);

            slider.setMax(slider_base_values.hide_order_max_value);

            if (reset_to_max || slider.getValue() > slider_base_values.hide_order_max_value) {
                slider.setValue(slider_base_values.hide_order_max_value);
            }

            if (slider_base_values.not_enough_iron) {
                slider.disable();
            } else {
                slider.enable();
            }

            this._fillStorageBar(slider_base_values.max_hide_storage, slider_base_values.hide_storage_level_unlimited, slider_base_values.iron_stored, slider_base_values.current_level);
        },

        /**
         * register tooltips for big image and storage bar
         *
         * @return void
         */
        registerTooltips: function() {
            var $el = this.$el,
                l10n = this.l10n;

            $el.find('.boxed_image').tooltip(l10n.popup_text);
            $el.find('div.storage_iron').tooltip(l10n.stored_coins);
        },

        /**
         * Render template
         *
         * @returns {window.GameViews.BuildingHideView}
         */
        render: function() {
            var town = this.town,
                max_hide_storage = town.getHideStorageCapacity(),
                iron_stored = town.getEspionageStorage(),
                current_level = town.getBuildings().get('hide');

            this.controller._onTownChange();

            if (current_level > 0) {
                this.$el.html(us.template(this.controller.getTemplate('building_hide'), {
                    l10n: this.l10n,
                    reports: this.controller.getLastSpyReports(),
                    max_hide_storage: max_hide_storage,
                    iron_stored: iron_stored,
                    current_level: current_level
                }));

                this.registerViewComponents();
                this.registerTooltips();
            } else {
                this.$el.html(us.template(this.controller.getTemplate('no_building'), GameDataBuildings.getNoBuildingTemplateData('hide')));
            }

            return this;
        },

        /**
         * unregister components, unregister listener
         *
         * @return void
         * @private
         */
        destroy: function() {
            this.unregisterViewComponents();
            this.unregisterListeners();
        }
    });

    window.GameViews.BuildingHideView = BuildingHideView;
}());