/* globals Backbone, GameData, Layout, hOpenWindow, addslashes, WndHandlerBuilding,
PopupFactory,  GPWindowMgr */

(function() {
    'use strict';

    function WndHandlerIsland(wndhandle) {
        this.wnd = wndhandle;
        this.island = null;
    }

    WndHandlerIsland.inherits(window.WndHandlerDefault);

    us.extend(WndHandlerIsland.prototype, Backbone.Events);

    WndHandlerIsland.prototype.getDefaultWindowOptions = function() {
        return {
            height: 570,
            width: 700,
            resizable: false,
            minimizable: true,
            title: _('Island info')
        };
    };

    WndHandlerIsland.prototype.onInit = function(title, UIopts, isleObj) {
        var island = this.island = isleObj,
            params = {
                island_id: island.id
            };

        if (!GameData.IslandInfoTemplate) {
            params.fetch_tmpl = 1;
        }

        this.wnd.requestContentGet('island_info', 'index', params);

        this.stopListening();
        this.getCollection('farm_town_player_relations').onRatioUpdate(this, function(model) {
            var wrapper = $('.island_info_wrapper'),
                $farm_town_el = wrapper.find('.farm_town_el_' + model.getFarmTownId()),
                $ratio_el = $farm_town_el.find('.popup_ratio');
            $ratio_el.text('1:' + model.getCurrentTradeRatio());
        });

        return true;
    };

    /**
     * Receive data, render template
     */
    WndHandlerIsland.prototype.onRcvData = function(data) {
        data.json.island = this.island;

        if (data.tmpl) {
            GameData.add({
                'IslandInfoTemplate': data.tmpl
            });
        }

        this.wnd.setContent2(us.template(GameData.IslandInfoTemplate, data.json));

        //set up click handler
        $('#island_bbcode_link').on('click', function() {
            $('#island_bbcode_id').toggle().trigger("focus");
        });

        $('#link_to_alliance_profile').on('click', function(e) {
            var target = e.target;
            Layout.allianceProfile.open(addslashes(target.getAttribute("title")), target.getAttribute("name"));
        });

        $("#farm_town_overview_btn").on("click", function() {
            hOpenWindow.openFarmTownOverviewWindow();
        }).tooltip(_('Farming villages overview'));

        $("#island_towns_sort").on("change", function(e) {
            var value = $(this).val();

            if (value === "name") {
                $('#island_info_towns_left_sorted_by_score').hide();
                $('#island_info_towns_left_sorted_by_player').hide();
                $('#island_info_towns_left_sorted_by_name').show();
            } else if (value === "score") {
                $('#island_info_towns_left_sorted_by_name').hide();
                $('#island_info_towns_left_sorted_by_player').hide();
                $('#island_info_towns_left_sorted_by_score').show();
            } else if (value === "player") {
                $('#island_info_towns_left_sorted_by_name').hide();
                $('#island_info_towns_left_sorted_by_player').show();
                $('#island_info_towns_left_sorted_by_score').hide();
            }
        });

        WndHandlerBuilding.prototype.initializeBuyForGoldAdvisor.call(this, 'captain');
        this.wnd.getJQElement().find('div.captain_commercial').show().find('a.button').tooltip(PopupFactory.texts.captain_hint);
    };

    WndHandlerIsland.prototype.onClose = function() {
        this.stopListening();

        return true;
    };

    GPWindowMgr.addWndType('ISLAND', 'taskbar_island_info', WndHandlerIsland);
}());