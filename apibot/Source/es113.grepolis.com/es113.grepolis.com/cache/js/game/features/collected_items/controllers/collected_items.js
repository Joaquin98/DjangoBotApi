define('features/collected_items/controllers/collected_items', function(require) {
    'use strict';

    var GameControllers = window.GameControllers,
        CollectView = require('features/collected_items/views/collected_items'),
        PlayerHintsHelper = require('helpers/player_hints'),
        BenefitHelper = require('helpers/benefit');

    return GameControllers.TabController.extend({
        view: null,

        initialize: function(options) {
            GameControllers.TabController.prototype.initialize.apply(this, arguments);
            this.checkbox_value = false;
        },

        renderPage: function() {
            this.view = new CollectView({
                controller: this,
                el: this.$el
            });

            this.registerEventListener();
        },

        registerEventListener: function() {
            this.stopListening();
            this.getCollectedItems().onCollectedItemsAddChange(this, this.view.updateValue.bind(this.view));
        },

        getCollectedItems: function() {
            return this.getCollection('collected_items');
        },

        getWindowSkin: function() {
            return this.getArgument('window_skin');
        },

        onConfirmClick: function() {
            this.closeWindow();
        },

        onCheckboxClick: function(checked) {
            this.checkbox_value = checked;
        },

        isMissionsEvent: function() {
            return BenefitHelper.isMissionsEventRunning();
        },

        destroy: function() {
            var player_hints = PlayerHintsHelper.getPlayerHintsCollection();

            if (this.checkbox_value) {
                player_hints.disableHint('collected_items');
            }
        }
    });
});