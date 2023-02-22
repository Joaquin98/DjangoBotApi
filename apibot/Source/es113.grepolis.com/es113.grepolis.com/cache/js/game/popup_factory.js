/* global _, GameData, TooltipFactory */
(function() {
    'use strict';

    // TODO get rid of this file since it's now only used to redirect to unit tooltips

    var PopupFactory = {
        texts: {},

        init: function() {
            var ts = {
                storage_info: '<b>' + _('Warehouse') + '</b>',
                population_info: '<b>' + _('Free population') + '</b>',
                unit_type_hack: '<h4>' + _('Blunt weapon') + '</h4>',
                unit_type_pierce: '<h4>' + _('Sharp weapon') + '</h4>',
                unit_type_distance: '<h4>' + _('Distance weapon') + '</h4>',
                party: _('City festival'),
                games: _('Olympic Games'),
                theater: _('Theater plays'),
                triumph: _('Victory procession')
            };
            var pfs = [{
                    i: 'curator',
                    t: _('Administrator'),
                    d: PopupFactory.texts.curator_info
                },
                {
                    i: 'trader',
                    t: _('Merchant'),
                    d: PopupFactory.texts.trader_info
                },
                {
                    i: 'priest',
                    t: _('High Priestess'),
                    d: PopupFactory.texts.priest_info
                },
                {
                    i: 'commander',
                    t: _('Commander'),
                    d: PopupFactory.texts.commander_info
                },
                {
                    i: 'captain',
                    t: _('Captain'),
                    d: PopupFactory.texts.captain_info
                }
            ];
            var i = pfs.length;
            while (i--) {
                ts[pfs[i].i + '_info'] = '<div class="premium_advisor_image advisors132x132 advisor_popup ' + pfs[i].i +
                    '" ></div><div class="premium_advisor_popup_text"><b>' +
                    pfs[i].t + '</b><br />' + pfs[i].d + '</div>';
            }
            this.addTexts(ts);

            // Attach unit names
            var unit_values = {};
            if (GameData.heroes) {
                $.each(GameData.heroes, function(key, unit) {
                    unit_values[key] = unit.name;
                });
            }
            $.each(GameData.units, function(key, unit) {
                unit_values[key] = unit.name;
                if (PopupFactory.isGroundUnit(unit)) {
                    unit_values[key + '_details'] =
                        '<div class="temple_unit_popup">' +
                        '<h4>' + unit.name + '</h4>' +
                        '<div class="unit_icon90x90 ' + key + '" style="padding:0;"></div>' +
                        '<div class="temple_unit_popup_info">' +
                        '<table id="unit_order_unit_info" border="1" style="font-weight: bold">' +
                        '<tr>' +
                        '<td><div id="unit_order_att_' + unit.attack_type + '" />' + unit.attack + '</td>' +
                        '<td><div id="unit_order_def_hack" />' + unit.def_hack + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><div id="unit_order_speed" />' + unit.speed + '</td>' +
                        '<td><div id="unit_order_def_pierce" />' + unit.def_pierce + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><div id="unit_order_booty" />' + (unit.booty ? unit.booty : '0') + '</td>' +
                        '<td><div id="unit_order_def_distance" />' + unit.def_distance + '</td>' +
                        '</tr>' +
                        '</table>' +
                        '<p>' + unit.description + '</p>' +
                        '</div>' +
                        '</div>';
                } else {
                    unit_values[key + '_details'] =
                        '<div class="temple_unit_popup">' +
                        '<h4>' + unit.name + '</h4>' +
                        '<div class="unit_icon90x90 ' + key + '" style="padding:0;"></div>' +
                        '<div class="temple_unit_popup_info">' +
                        '<table id="unit_order_unit_info" border="1" style="font-weight: bold">' +
                        '<tr>' +
                        '<td><div id="unit_order_attack" />' + unit.attack + '</td>' +
                        '<td><div id="unit_order_defense" />' + unit.defense + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td><div id="unit_order_speed" />' + unit.speed + '</td>' +
                        '<td><div id="unit_order_transport" />' + unit.capacity + '</td>' +
                        '</tr>' +
                        '</table>' +
                        '<p>' + unit.description + '</p>' +
                        '</div>' +
                        '</div>';
                }
            });

            this.addTexts(unit_values);
        },

        addTexts: function(texts) {
            jQuery.extend(this.texts, texts);
        },

        bindNewPopupTo: function(element, popup_type) {
            if (this.texts[popup_type] === undefined) {
                //throw "PopupFactory: Invalid popup type '" + popup_type + "'.";
            }

            element.tooltip(this.texts[popup_type]);
        },

        isGroundUnit: function(unit) {
            return unit.capacity === undefined;
        }
    };

    /**
     * Extend with setPopup function
     */
    jQuery.fn.extend({
        setPopup: function(popup_type, amount) {
            var details_pos = popup_type.indexOf('_details');

            if (details_pos !== -1) {
                this.tooltip(
                    TooltipFactory.getUnitCard(popup_type.substr(0, details_pos), {
                        amount: amount
                    }), {},
                    false
                );
            } else {
                PopupFactory.bindNewPopupTo(this, popup_type);
            }
        }
    });

    window.PopupFactory = PopupFactory;
}());