/* global ITowns, ConfirmationWindowFactory, GameData, GameEvents, Game, GPWindowMgr, DateHelper */

(function() {
    'use strict';

    var WndHandlerUninhabited = function(wndhandle) {
        this.wnd = wndhandle;
        this.params = null;
    };

    var naval_unit_enums = require('enums/naval_units');

    WndHandlerUninhabited.inherits(window.WndHandlerAttack);

    WndHandlerUninhabited.prototype.getDefaultWindowOptions = function() {
        return {
            height: 500,
            width: 550,
            resizable: false,
            title: 'Untitled Window'
        };
    };

    WndHandlerUninhabited.prototype.onInit = function(title, UIopts) {
        this.params = arguments[2];
        this.wnd.requestContentGet('uninhabited_place_info', 'info', arguments[2]);

        return true;
    };

    WndHandlerUninhabited.prototype.onClose = function() {

        this.unregisterEventListeners();
        return true;
    };

    WndHandlerUninhabited.prototype.render = function() {
        var html = us.template(GameData.ColonizeTemplate, this.data);

        //clear this.unitInputs
        delete this.unitInputs;

        this.wnd.setContent(html);
        // bind click events
        var that = this;
        this.root = this.wnd.getJQElement();
        this.root.find('a.index_unit').on("click", function() {
            that.selectUnit(this);
        });

        this.root.find('input[name="colonize_ship"]').val(ITowns.getTown(Game.townId).units().colonize_ship ? 1 : 0);

        // bind event handler for changes
        this.root.find('a.select_all_units').on('click', function() {
            that.bindDurationCounter();
            that.bindCapacityCounter();
        });
        this.root.find('a.index_unit').on('click', function() {
            that.bindDurationCounter();
            that.bindCapacityCounter();
        });
        this.root.find('input.unit_input').on('keyup change', function() {
            that.bindDurationCounter();
            that.bindCapacityCounter();
        });

        // add unit tooltips
        this.root.find('a.unit').each(function() {
            var $this = $(this);
            $this.setPopup($this.attr('id') + '_details');
        });
    };

    WndHandlerUninhabited.prototype.onRcvData = function(data) {
        this.unregisterEventListeners();

        data.json.type = '';
        //store unit count in current town
        this.data = data.json;

        this.data.preselect_units = this.data.preselect_units || false;
        this.duration = data.json.duration;

        var units = {};
        for (var i in data.json.units) {
            if (data.json.units.hasOwnProperty(i)) {
                units[i] = data.json.units[i].count;
            }
        }

        if (data.tmpl) {
            GameData.add({
                'ColonizeTemplate': data.tmpl
            });
        }

        this.render();

        this.bindDurationCounter();

        this.registerEventListeners();
    };

    WndHandlerUninhabited.prototype.sendColonizer = function() {
        var is_one_colonize_ship_selected = false;

        var that = this;
        this.getUnitInputs().each(function() {
            var name = this.name,
                value = parseInt(this.value, 10);

            if (name && !isNaN(value)) {
                that.params[name] = value;

                if (name === naval_unit_enums.COLONIZE_SHIP) {
                    is_one_colonize_ship_selected = (value === 1);
                }
            }
        });

        // If not exactly one colonize ship is selected, directly make the backend call to get an immediate error toast message
        if (!is_one_colonize_ship_selected) {
            this.wnd.ajaxRequestPost('uninhabited_place_info', 'send_colonizer', this.params, function(data) {}.bind(this), {}, 'send_colonizer');
            return;
        }

        // Otherwise show the regular confirmation window
        ConfirmationWindowFactory.openConfirmationFoundNewCityWindow(function() {
            this.wnd.ajaxRequestPost('uninhabited_place_info', 'send_colonizer', this.params, function(data) {}.bind(this), {}, 'send_colonizer');
        }.bind(this));
    };

    WndHandlerUninhabited.prototype.bindDurationCounter = function() {
        var that = this;
        //cache elements for this window
        var elm = {};
        elm.root = that.wnd.getJQElement();
        elm.error = elm.root.find('div.duration_error');
        elm.duration = elm.root.find('span.way_duration');
        elm.arrival = elm.root.find('span.arrival_time');

        elm.colonize = elm.root.find('input[name="colonize_ship"]');

        function recalcDuration() {
            if (!parseInt(elm.colonize.val(), 10)) {
                elm.error.show().text(_('You have to select a colony ship.'));
                elm.duration.hide();
                elm.arrival.hide();
            } else {
                elm.error.hide();
                elm.duration.text(DateHelper.readableSeconds(that.duration)).show();
                elm.arrival.hide().text(that.duration).updateTime().show();
            }
        }

        recalcDuration();
    };

    WndHandlerUninhabited.prototype.registerEventListeners = function() {
        var that = this;

        $.Observer(GameEvents.town.units.change).subscribe(['WndHandlerUninhabited' + this.wnd.getID()], function(e, data) {
            that.handleEvents(e, that);
        });

        $.Observer(GameEvents.town.town_switch).subscribe(['WndHandlerUninhabited' + this.wnd.getID()], function(e, data) {
            that.handleEvents(e, that);
        });
    };

    WndHandlerUninhabited.prototype.unregisterEventListeners = function() {
        $.Observer().unsubscribe(['WndHandlerUninhabited' + this.wnd.getID()]);
    };

    /**
     * handle events for town
     *
     * @param object event
     * @param object that -> actual wndhandler
     */
    WndHandlerUninhabited.prototype.handleEvents = function(event, that) {
        if (event.type === GameEvents.town.units.change) {
            if (that.data) {
                // update unit count from Layout.town
                var units = ITowns.getTown(Game.townId).units();

                for (var unit_name in that.data.units) {
                    if (that.data.units.hasOwnProperty(unit_name)) {
                        that.data.units[unit_name].count = units[unit_name];
                    }
                }
                that.render.apply(that, []);
            }
        }

        if (event.type === GameEvents.town.town_switch) {
            this.params.town_id = Game.townId;
            this.wnd.requestContentGet('uninhabited_place_info', 'info', this.params);
        }
    };

    GPWindowMgr.addWndType('UNINHABITED_PLACE', null, WndHandlerUninhabited, 1);
}());