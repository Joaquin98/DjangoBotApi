/*global define, Backbone, GameViews, GameModels, ITowns, Game, GameData, GameDataUnits, GameEvents, MousePopup, s, ngettext */

(function() {
    'use strict';

    var sub_context = 'main_view';

    var BarracksMainView = GameViews.BaseView.extend({
        view_details: null,
        view_orders: null,
        view_banners: null,

        initialize: function() {
            GameViews.BaseView.prototype.initialize.apply(this, arguments);

            this.render();
        },

        reRender: function() {
            this.render();
        },

        render: function() {
            var building_type = this.controller.getBuildingType(),
                has_building = this.controller.hasBuildingWithLevel(building_type, 1),
                selected_unit_id = this.controller.getSelectedUnitId();

            //If user does has at least one level of barracks in the current town
            if (has_building) {
                //Render main layout
                this.renderMainLayout();
                //Render units tabs
                this.renderUnitsTabs(selected_unit_id);
            } else {
                this.$el.html(us.template(this.controller.getTemplate('no_barracks'), {
                    building_type: building_type,
                    l10n: this.controller.getl10n()
                }));
            }

            return this;
        },

        selectUnit: function(unit_id) {
            this.$el.find('.unit').removeClass('selected').filter('.' + unit_id).addClass('selected');
        },

        renderMainLayout: function() {
            this.$el.html(us.template(this.controller.getTemplate('index'), {}));

            this.registerEventListeners();
        },

        registerEventListeners: function() {
            this.$el.on('click', '.unit', this.onSelectUnitTabClick.bind(this));
        },

        renderUnitsTabs: function(selected_unit_id) {
            this.$el.find('.units_tabs').html(us.template(this.controller.getTemplate('units_tabs'), {
                units: this.controller.getUnits(),
                selected_unit_id: selected_unit_id
            }));

            this.registerUnitsTabsComponents();
        },

        registerUnitsTabsComponents: function() {
            var _self = this,
                l10n = this.controller.getl10n(),
                $units_tabs = this.$el.find('.units_tabs');

            this.unregisterComponents(sub_context);

            //Popups for units
            $.each(GameData.units, function(unit) {
                $units_tabs.find('.unit_icon.' + unit).setPopup(unit + '_details');
            });

            //Button show hide units
            this.registerComponent('btn_toggle_invisible_units', $units_tabs.find('.btn_toggle_invisible_units').button({
                toggle: true,
                template: 'empty',
                tooltips: [{
                        title: '<h4>' + l10n.show_all_units + '</h4>'
                    },
                    {
                        title: '<h4>' + l10n.show_possible_to_build_units + '</h4>'
                    }
                ]
            }).on('btn:click', function(e, _btn) {
                _self.controller.onToggleInvisibleUnits(_btn.getState());
            }), sub_context);

            this.$el.find('.total_amount').tooltip('<h4>' + l10n.tooltips.order_total + '</h4>');
        },

        /**
         * Shows or hides unit tabs
         *
         * @param {Boolean} state
         */
        toggleInvisibleUnits: function(state) {
            this.$el.find('.can_not_build').toggleClass('hide', !state);
        },

        onSelectUnitTabClick: function(e) {
            var $el = $(e.currentTarget),
                unit_id = $el.attr('data-unitid');

            this.controller.onSelectUnitTabClick(unit_id);
        },

        destroy: function() {

        }
    });

    window.GameViews.BarracksMainView = BarracksMainView;
}());