/* global Game, gpAjax */
/**
 * class representing all (stored) playerhints of the player.
 * If a model for a specific hint is not in here, one has to assume that is currently is visible.
 *
 * @class PlayerHints
 */
define('collections/player_hint/player_hints', function(require) {
    'use strict';

    var Collection = require_legacy('GrepolisCollection');
    var PlayerHint = require('models/player_hint/player_hints');
    var CATEGORIES = require('enums/player_hint_categories');

    var DEFAULT_CATEGORY = CATEGORIES.CONFIRMATION;

    /*
     * some types should be combined to a hint setting
     */
    var mappings = {
        buy_or_extend_advisor: [
            'extend_curator',
            'extend_trader',
            'extend_priest',
            'extend_commander',
            'extend_captain',

            'buy_curator',
            'buy_trader',
            'buy_priest',
            'buy_commander',
            'buy_captain'
        ]
    };

    var categories = {};

    categories[CATEGORIES.MAP] = [
        'map_beginners_protection',
        'map_last_attack_smoke',
        'map_revolt_conquest_fires',
        'map_casual_world_blessing'
    ];

    var PlayerHints = Collection.extend({
        model: PlayerHint,
        model_class: 'PlayerHint',

        initialize: function() {
            this.on('add', function(model) {
                var type = model.getType();

                if (categories[CATEGORIES.MAP].indexOf(type) !== -1) {
                    model.set('category', CATEGORIES.MAP);
                } else {
                    model.set('category', DEFAULT_CATEGORY);
                }
            });
        },

        /**
         * Get GameModels.PlayerHint for a given type
         * If a model for a specific hint is not in here, one has to assume that is currently is visible.
         * To reflect hat, a new instance of the model for the given type is returned where the 'hidden'
         * property is true.
         *
         * @method getForType
         * @param {String} type the type of the hint
         * @return {GameModels.PlayerHint}
         */
        getForType: function(type) {
            var name = this.getMapping(type);
            var hint = this.find(function(hint) {
                return hint.getType() === name;
            });

            if (hint) {
                return hint;
            } else {
                return new PlayerHint({
                    player_id: Game.player_id,
                    type: type
                });
            }
        },

        /**
         * Returns all possible PlayerHint Models.
         * Needed to populate the settings.
         * @returns {Array} of GameModels.PlayerHint
         */
        getAll: function() {
            return this.filter(function(model) {
                return model.isUserConfigurable();
            });
        },

        /**
         * Get the name for the hint mapped to the confirmation type.
         * (some confirmation types are merged into one setting)
         *
         * @param type confirmation dialog type
         * @returns {string} the name of the hint to map to
         */
        getMapping: function(type) {
            for (var name in mappings) {
                if (mappings.hasOwnProperty(name) && us.contains(mappings[name], type)) {
                    return name;
                }
            }
            // if no mapping is found the original type is the hint name
            return type;
        },

        disableHint: function(hint_type) {
            var hint = this.getForType(hint_type);

            hint.disable();
        },

        enableHint: function(hint_type) {
            var hint = this.getForType(hint_type);

            hint.enable();
        },

        /**
         * Save multiple hints at once
         *
         * @param hints	colection of hint models
         * @param states collection of booleans indicating if hint should be visible
         * @param callback called when ajax request is done
         */
        saveHints: function(hints, states, callback) {
            var serialized = hints.map(function(hint, index) {
                return {
                    type: hint.get('type'),
                    hidden: states[index]
                };
            });

            gpAjax.ajaxPost('player_hint', 'handle_all', {
                player_hints: serialized
            }, false, callback);
        },

        /**
         * Get notified if a hint is beeing set to visible.
         * This is often used to trigger interstitials on backend push.
         *
         * @param hint_type	Which hint to watch
         * @param obj		Backbone Event Object that listens
         * @param callback	What to call when it's set to visible
         */
        onShowHintInterstitialWindow: function(hint_type, obj, callback) {
            obj.listenTo(this, 'change:hide', function(hint_type, model, value) {
                if (model.getType() === hint_type && !model.isHidden()) {
                    callback();
                }
            }.bind(null, hint_type));
        },

        /**
         * return all user configurable hints for a given category
         * categories are not frontend only and defined above
         *
         * @see enums/player_hint_enums
         * @see PlayerHintsEnum.php
         * @param {string} category
         * @returns {[PlayerHint]}
         */
        getConfigurableForCategory: function(category) {
            return this.where({
                category: category,
                is_user_configurable: true
            });
        }
    });

    window.GameCollections.PlayerHints = PlayerHints;

    return PlayerHints;
});