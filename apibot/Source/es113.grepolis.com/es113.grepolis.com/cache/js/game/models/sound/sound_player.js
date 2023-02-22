/*global Audio, Game, Backbone, Logger, Promise */

(function() {
    "use strict";

    var SoundPlayer = Backbone.Model.extend({
        defaults: {
            idle: true,
            /** internal volume to eg. effects **/
            volume: 1,
            base_volume: null,
            url: null,
            model: null,
            fragment: null,
            effects: null,
            autoplay: false,
            current_fragment: null
        },
        initialize: function() {
            var url = this.get("model").get("url"),
                audio,
                self = this;

            if (!url) {
                audio = new Audio();
            } else {
                audio = new Audio(url);
            }

            this.set("audio", audio);

            if (this.get("autoplay")) {
                audio.autoplay = true;
            }

            if (url) {
                if (this.get("fragment")) {
                    audio.load();
                }
                this.updateVolume();
                audio.preload = "auto";
                audio.autobuffer = "auto";
            }

            if (this.get("loop")) {
                audio.loop = true;
            }

            audio.addEventListener("error", function() {
                Logger.get("gameSounds").log(function() {
                    return ["SoundPlayer::init::error", self.get("url")];
                });
                self.set("idle", true);
                self.get("model").removePlayer(self);
                if (self.get("callbacks") && self.get("callbacks").error) {
                    self.get("callbacks").error();
                }
            }, false);

            /**
             * @TODO: really need that?
             */
            this.on("change:url", function() {
                var audio = this.get("audio");
                audio.src = this.url;
                audio.load();
            });

            this.on("change:volume", function() {
                this.updateVolume();
            });

            this.on("change:base_volume", function() {
                this.updateVolume();
            });

            var callbacks = this.get("callbacks");
            if (callbacks) {
                for (var callback in callbacks) {
                    if (callbacks.hasOwnProperty(callback)) {
                        audio.addEventListener(callback, callbacks[callback], false);
                    }
                }
            }

            if (!this.get("loop")) {
                audio.addEventListener("ended", $.proxy(function() {
                    this.set("idle", true);
                    Logger.get("gameSounds").log(function() {
                        return ["SoundPlayer::ended", self.get("url"), self];
                    });
                }, this), false);
            }

        },
        updateVolume: function() {
            var audio = this.get("audio");

            if (audio) {
                audio.volume = this.get("volume") * this.get("base_volume");
            }
        },
        play: function(fragment) {
            var audio = this.get("audio"),
                effects = this.get("effects"),
                self = this,
                late_callback;

            if (fragment || this.get("fragment")) {
                fragment = fragment || this.get("fragment");
                this.set("current_fragment", fragment);
            } else {
                this.unset("current_fragment");
            }

            if (fragment) {
                if (audio.fragment_callback) {
                    audio.removeEventListener("timeupdate", audio.fragment_callback, false);
                }
                if (audio.networkState !== SoundPlayer.NETWORK_IDLE) {
                    late_callback = function() {
                        try {
                            audio.currentTime = fragment[0];
                            audio.fragment_callback = $.proxy(self.fragmentListener, self);
                            audio.addEventListener("timeupdate", audio.fragment_callback, false);
                            audio.removeEventListener("canplaythrough", late_callback, false);
                        } catch (e) {}
                    };
                    audio.addEventListener("canplaythrough", late_callback, false);
                } else {
                    try {
                        audio.currentTime = fragment[0];
                        audio.fragment_callback = $.proxy(this.fragmentListener, this);
                        audio.addEventListener("timeupdate", audio.fragment_callback, false);
                    } catch (e) {}
                }
            }

            audio.volume = 1 * this.get("base_volume");

            if (effects) {

                if (effects.fadeOut) {
                    if (audio.fade_out_callback) {
                        audio.removeEventListener("timeupdate", audio.fade_out_callback, false);
                    }
                    audio.fade_out_callback = function() {
                        if (fragment && fragment[0] > audio.currentTime) {
                            return;
                        }

                        if (fragment && fragment[1] < audio.currentTime) {
                            audio.volume = 0;
                            return;
                        }

                        var currentTime = audio.currentTime,
                            endTime = (fragment ? fragment[1] : audio.duration),
                            fadeOut = endTime - effects.fadeOut;

                        if (currentTime > fadeOut) {
                            audio.volume = (((endTime - currentTime) / effects.fadeOut)) * self.get("base_volume");
                        }
                    };
                    audio.addEventListener("timeupdate", audio.fade_out_callback, false);
                }

                if (effects.fadeIn) {
                    audio.volume = 0;
                    audio.fade_in_callback = function() {
                        if (fragment && fragment[0] > audio.currentTime) {
                            return;
                        }

                        var currentTime = audio.currentTime - (fragment ? fragment[0] : 0);
                        if (currentTime < effects.fadeIn) {
                            audio.volume = (1 - ((effects.fadeIn - currentTime) / effects.fadeIn)) * self.get("base_volume");
                        }
                    };

                    audio.addEventListener("timeupdate", audio.fade_in_callback, true);
                }
            }

            Logger.get("gameSounds").log(function() {
                return ["SoundPlayer::play", self.get("url"), audio.networkState, audio.readyState, audio.error ? audio.error.code : "no-error"];
            });

            return Promise.resolve(audio.play()).then(function() {
                self.set('idle', false);
            }, function() {
                self.set('idle', true);
            });
        },
        stop: function() {
            var audio = this.get("audio"),
                fragment = this.get("fragment");
            audio.pause();
            audio.currentTime = (fragment ? fragment[0] : audio.currentTime);
            this.set("idle", true);
        },
        fragmentListener: function() {
            var audio = this.get("audio"),
                fragment = this.get("current_fragment");

            if (audio.currentTime > fragment[1]) {
                audio.pause();
                audio.currentTime = fragment[0];
                this.set("idle", true);
            }
        },
        remove: function() {
            var audio = this.get("audio");
            audio.fade_out_callback = null;
            audio.fade_in_callback = null;
            audio.fragment_callback = null;
            this.unset("audio");
            this.unset("model");
            this.unset("fragment");
            this.off("change");

            return this;
        }

    });

    SoundPlayer.HAVE_NOTHING = 0;
    SoundPlayer.HAVE_METADATA = 1;
    SoundPlayer.HAVE_CURRENT_DATA = 2;
    SoundPlayer.HAVE_FUTURE_DATA = 3;
    SoundPlayer.HAVE_ENOUGH_DATA = 4;

    SoundPlayer.NETWORK_EMPTY = 0;
    SoundPlayer.NETWORK_IDLE = 1;
    SoundPlayer.NETWORK_LOADING = 2;
    SoundPlayer.NETWORK_NO_SOURCE = 3;

    window.GameModels.SoundPlayer = SoundPlayer;
}());