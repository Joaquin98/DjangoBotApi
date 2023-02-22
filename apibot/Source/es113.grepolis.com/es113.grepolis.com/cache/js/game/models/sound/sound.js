/*global debug, Logger, Backbone, Game */

(function() {
    "use strict";

    var SoundPlayer = window.GameModels.SoundPlayer;

    var SoundModel = Backbone.Model.extend({

        defaults: {
            players: null,
            category_name: null,
            category: null,
            name: null,
            volume: 1,
            url: null,
            fragment: null,
            fragment_player: null,
            base_volume: null,
            autoplay: null,
            /**
             * max_players - 0 - unlimited; other value means limited
             */
            max_players: 0
        },

        initialize: function(params, opts) {
            this.controller = opts.controller;

            this.set('players', {
                idle: new Backbone.Collection(),
                working: new Backbone.Collection()
            });

            this.set('base_volume', opts.global * opts.category * this.get('volume'));
            this.set('callbacks', params.callbacks);
            this.get('autoplay', params.autoplay);

            this.on('update_volume', function(params) {
                var players = this.get('players'),
                    volume = params.global * params.category * this.get('volume');

                this.set('base_volume', volume);

                players.working.forEach(function(item) {
                    item.set('base_volume', volume);
                });

                players.idle.forEach(function(item) {
                    item.set('base_volume', volume);
                });

                /**
                 * @todo if loop then play or pause yo!
                 */
                //if (this.get('base_volume')) {}
            });

            if (this.get('base_volume') > 0 && !this.get('fragment')) {
                this.createPlayer();
            }

        },

        setupFragmentPlayer: function() {
            var fragmentPlayer;
            this.set('fragmentPlayer', fragmentPlayer);
        },

        getPlayer: function() {
            var players = this.get('players');

            // The backbone documentation only provide the length property
            // for size estimation
            if (!players.idle.length) {
                this.createPlayer();
            }
            return players.idle.pop();
        },

        /**
         * create a new player object and push it to the collection
         * of "ilde" players
         * @method createPlayer
         */
        createPlayer: function() {
            var _self = this,
                player = new SoundPlayer({
                    base_volume: this.get('base_volume'),
                    model: this,
                    fragment: this.get('fragment'),
                    effects: this.get('effects'),
                    url: this.get('url'),
                    loop: this.get('loop'),
                    autoplay: this.get('autoplay'),
                    callbacks: this.get('callbacks')
                }),
                players = this.get('players');

            this.get('players').idle.push(player);

            player.on('change:idle', function(event) {
                if (event.get('idle') === false) {
                    players.idle.remove(this);
                    players.working.add(this);
                } else {
                    players.working.remove(this);
                    players.idle.add(this);
                }
            });

            _self.controller.updateCounter(1, this);
        },

        //TODO This method is actually only called from sound_player.js
        //once, and only used to remove itself from the collection
        //could be done more efficently
        removePlayer: function(player) {
            var players = this.get('players').idle,
                el = players.indexOf(player);

            if (el !== -1) {
                players.remove(player);
                player.remove();
            } else {
                return false;
            }
        },

        play: function(fragment) {
            var max = this.get('max_players'),
                player,
                self = this;

            if (this.get('fragment')) {
                Logger.get('gameSounds').log(function() {
                    return ['SoundModel::Play::fragment', self.get('name'), self.get('fragment')];
                });
                this.get('fragment_player').play(this.get('fragment'));
                return;
            }

            if ((max === 0) || (this.get('players').working.length < max)) {
                Logger.get('gameSounds').log(function() {
                    return ['SoundModel::Play', self.get('name'), fragment];
                });
                player = this.getPlayer();
                if (player) {
                    player.play(fragment);
                } else {
                    debug('No player available in players!', 'players', this.get('players'));
                }
            }
        },

        stop: function() {
            this.get('players').working.each(function(player) {
                player.stop();
            });
        },

        free: function() {
            var players = this.get('players'),
                working = players.working.length,
                idle = players.idle.length,
                removed = 0;

            if (working > 0 && idle > 0) {
                while (idle--) {
                    players.idle.shift().remove().destroy();
                    ++removed;
                }
            }

            if (idle > 1) {
                while (--idle) {
                    players.idle.shift().remove().destroy();
                    ++removed;
                }
            }

            // call it in a new functioncontext to not block the game while freeing
            setTimeout(this.controller.updateCounter.bind(this.controller, -removed, this));
        }
    });

    window.GameModels.SoundModel = SoundModel;
}());