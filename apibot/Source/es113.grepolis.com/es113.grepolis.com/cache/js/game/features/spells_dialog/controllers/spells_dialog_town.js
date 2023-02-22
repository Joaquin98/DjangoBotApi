define('features/spells_dialog/controllers/spells_dialog_town', function() {
    'use strict';

    var BaseController = window.GameControllers.BaseController,
        SpellsDialogOwnController = require('features/spells_dialog/controllers/spells_dialog_own'),
        SpellsDialogOtherController = require('features/spells_dialog/controllers/spells_dialog_other'),
        TargetType = require('features/spells_dialog/enums/target_type');

    return BaseController.extend({
        initialize: function() {
            //Don't remove it, it should call its parent
            BaseController.prototype.initialize.apply(this, arguments);
        },

        renderPage: function() {
            var controller;
            var settings = {
                el: this.$el.find('.gpwindow_content'),
                cm_context: this.getContext(),
                parent_controller: this,
                target_id: this.getTargetId(),
                town_name: this.getTownName(),
                is_own_town: this.isOwnTown(),
                target_type: TargetType.TOWN
            };

            if (this.isOwnTown()) {
                controller = this.registerController('own_town', new SpellsDialogOwnController(settings));
            } else {
                controller = this.registerController('other_town', new SpellsDialogOtherController(settings));
            }

            controller.renderPage();
        },

        getTargetId: function() {
            return this.options.target_id;
        },

        getTownName: function() {
            return this.options.town_name;
        },

        isOwnTown: function() {
            return this.getCollection('towns').isMyOwnTown(this.getTargetId()) === true;
        }
    });
});