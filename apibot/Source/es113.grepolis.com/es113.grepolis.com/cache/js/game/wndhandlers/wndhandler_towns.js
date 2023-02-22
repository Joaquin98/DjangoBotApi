/* globals GameData, gpAjax, hOpenWindow, GodsOverview, GameEvents, ITowns, ConfirmationWindowFactory */
(function() {
    'use strict';

    var WndHandlerTowns = function() {

    };

    WndHandlerTowns.inherits(window.WndHandlerAttack);

    WndHandlerTowns.prototype.getDefaultWindowOptions = function() {
        return {
            height: 400,
            width: 500,
            resizable: false,
            title: 'Untitled Window'
        };
    };

    WndHandlerTowns.prototype.updateTradeCapValue = function() {
        if ($('#avlbl_cap').length) {
            var values = [
                    parseInt($('#trade_type_wood').val() || 0, 10),
                    parseInt($('#trade_type_stone').val() || 0, 10),
                    parseInt($('#trade_type_iron').val() || 0, 10)
                ],
                sum = parseInt($('#avlbl_cap').val(), 10),
                i = values.length;

            while (i--) {
                sum -= values[i];
            }
            $('#left_cap').text(sum).css('color', sum < 0 ? '#f00' : '#000');

            slider_trade_type_wood.setMax(values[0] + sum);
            slider_trade_type_stone.setMax(values[1] + sum);
            slider_trade_type_iron.setMax(values[2] + sum);
        }
    };

    WndHandlerTowns.prototype.castPower = function(power_id, town_id, castedFromTownView, castedFromGodsOverview, callback) {
        var _self = this,
            gd_power = GameData.powers[power_id],
            $root = this.wnd.getJQElement();

        function castPower(context, power_id, town_id) {
            $root.find('#towninfo_description').hide();
            $root.find('#casting_power').show();

            gpAjax.ajaxPost('town_info', 'cast', {
                'power': power_id,
                'id': town_id
            }, false, function(data) {
                //Hides information about the spell in the Town info window
                $root.find('#towninfo_description').hide();

                if (data.report_id) {
                    //when you cast spell in town info->Zauber, then the link to report will be added in the window. this code makes this link clickable
                    $root.find('#power_casted').insertAfter($('.choose_power.' + data.casted_power_id).parent()).show().find('a').off('click.spell_report').on('click.spell_report', function() {
                        hOpenWindow.viewReport(data.report_id);
                    });
                }

                if (castedFromGodsOverview == true && data.finished_at != null) {
                    GodsOverview.updateTownsCastedPowers(town_id, data.casted_power_id, data.finished_at);
                }

                if (typeof callback == 'function') {
                    callback(data);
                }

                // @dev: do we really need that?
                if (typeof data.finished_at == 'number') {
                    $.Observer(GameEvents.command.cast_power).publish({
                        power_id: power_id,
                        town_id: town_id,
                        data: data
                    });
                } else {
                    $.Observer(GameEvents.command.cast_power).publish({
                        power_id: power_id,
                        town_id: town_id
                    });
                }

            }.bind(context));
        }

        if (ITowns.isMyTown(town_id) && gd_power.negative) {
            ConfirmationWindowFactory.openConfirmationCastNegativeSpellOnOwnTownWindow(function() {
                castPower(_self, power_id, town_id);
            });
        } else {
            castPower(this, power_id, town_id);
        }
    };

    window.WndHandlerTowns = WndHandlerTowns;
}());