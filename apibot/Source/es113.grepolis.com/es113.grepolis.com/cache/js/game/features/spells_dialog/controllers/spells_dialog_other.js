define('features/spells_dialog/controllers/spells_dialog_other', function() {
    'use strict';

    var SpellsDialogBaseController = require('features/spells_dialog/controllers/spells_dialog_base'),
        SpellsDialogOtherView = require('features/spells_dialog/views/spells_dialog_other');

    return SpellsDialogBaseController.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            SpellsDialogBaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            this.view = new SpellsDialogOtherView({
                el: this.$el,
                controller: this
            });

            this.registerEventListeners();
        },

        getCastedPowerOnTheTargetTown: function(power_id) {
            return null;
        }
    });
});