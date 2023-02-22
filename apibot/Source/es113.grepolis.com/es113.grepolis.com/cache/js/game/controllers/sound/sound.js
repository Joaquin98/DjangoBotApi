/* globals Game, GameData, console, GameSoundSprites, Backbone, GameListeners */

(function() {
    "use strict";

    var SoundModel = window.GameModels.SoundModel;
    var SoundCategory = window.GameModels.SoundCategory;

    var SoundController = Backbone.Model.extend({
        defaults: {
            volume: 1,
            sounds: null,
            enabled: true,
            played_bg: 0
        },
        // iOs sounds will start to play with a delay, so the game gets the info from the phone if it is in silent mode
        playIosSoundsWithDelay: true,

        initialize: function(params) {
            var self = this;

            this.set("enabled", (params.background_music || params.sound_effects || params.click_sounds));
            this.set("audio_path", params.audio_path);

            this.set("supported", true);
            this.set("preloaded", false);

            var audioElement = document.createElement("audio");
            if (audioElement.canPlayType) {
                if ("" !== audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"")) {
                    // for firefox and chrome
                    this.set("extension", ".ogg");
                } else if ("" !== audioElement.canPlayType("audio/mpeg; codecs=\"mp3\"")) {
                    // for IE
                    this.set("extension", ".mp3");
                } else {
                    this.set("supported", false);
                    this.set("enabled", false);
                }
            } else {
                this.set("supported", false);
                this.set("enabled", false);
            }

            if (!this.supported()) {
                $("html").addClass("no-sound");
                return;
            }

            if (!this.enabled()) {
                return;
            }

            this.set("volume", params.sound_volume / 100);
            this.set("sounds", new Backbone.Collection());
            this.set("categories", new Backbone.Collection());
            this.set("categories_enabled", {
                background: params.background_music,
                gods: params.background_music,
                effects: params.sound_effects,
                click: params.click_sounds
            });

            this.set("counter", {
                total: 0,
                over: new Backbone.Collection(),
                history: []
            });

            this.on("change:sound_volume", function() {
                this.get("categories").forEach(function(item) {
                    item.trigger("update_volume", {
                        global: self.getVolume()
                    });
                });
            });

            this.on("change:muted", function() {
                this.get("categories").forEach(function(item) {
                    item.trigger("update_volume", {
                        global: self.getVolume()
                    });
                });
            });

            this.on("players_limit_reached", function() {
                this.get("counter").over.each(function(sound_model) {
                    sound_model.free();
                });
            });

            if (!GameData.Sounds) {
                window.PreloadedData.Sounds.load(this);
                this.GameSounds = GameData.Sounds;
            }

            this.onInit();

            this.registerEventListeners();
        },

        registerEventListeners: function() {
            // set the sound listeners
            this.soundListeners = null;
            if (!this.isMuted()) {
                this.soundListeners = GameListeners.SoundListeners.start(this, this.GameSounds);
                this.soundListeners.startListening();
            }
        },

        unregisterEventListeners: function() {
            if (this.soundListeners) {
                this.soundListeners.stopListening();
                delete this.soundListeners;
            }
        },

        onInit: function() {
            if (this.get("muted")) {
                return;
            }

            var preloaded = this.get("preloaded");
            if (!preloaded) {
                this._preloadSounds();
            }
            this.playBackground();
            this.enableSoundBranch(this.GameSounds.command.cast_power);
            this.enableSoundBranch(this.GameSounds.window.building.open);
        },

        updateCounter: function(amount, model) {
            var counter = this.get("counter"),
                players = model.get("players"),
                total = players.idle.length + players.working.length;

            counter.total += amount;
            if (total > 1) {
                // try to add to list
                if (!counter.over.get(model)) {
                    counter.over.add(model);
                }
            } else {
                // try to remove from list
                counter.over.remove(model);
            }

            if (typeof GameSoundSprites !== "undefined" && counter.total > 40) {
                this.trigger("players_limit_reached");
            }

        },

        _preloadSounds: function() {
            // Walk through sounds and execute function f on every sound
            var loop = function(ob, f) {
                var i;
                for (i in ob) {
                    if (ob.hasOwnProperty(i)) {
                        if (ob[i].hasOwnProperty("path")) {
                            f(ob[i], f);
                        } else {
                            loop(ob[i], f);
                        }
                    }
                }
            };

            var self = this;
            loop(this.GameSounds, function(el) {
                if (el.preload && self.categoryEnabled(el.category)) {
                    self.enableSound(el);
                }
            });

            if (this.enabled() && this.get("categories_enabled").background) {
                this._enableBackground();
            }
            this.set("preloaded", true);
        },

        /**
         * Preload a random background sound and push it to the background-sound queue
         * @param {string} category themes or gods
         */
        _setRandomBgSound: function(category) {
            var collection = this.get("background_settings")[category],
                rand = Math.floor(Math.random() * (collection.length - 1)),
                config = this.GameSounds.background[collection[rand]],
                bg_queue = this.get("background_queue");


            if (!config.callbacks) {
                config.callbacks = {};
            }

            config.callbacks.error = function() {
                var index = bg_queue.indexOf(config);
                if (index !== -1) {
                    bg_queue.splice(index, 1);
                }

                if (typeof config.callbacks.ended === "function") {
                    config.callbacks.ended();
                }
            };

            bg_queue.push(config);
            this.enableSound(config);
        },

        _enableBackground: function() {
            var sound_id,
                background_settings = {
                    themes: [],
                    gods: []
                };

            // Split background sounds in backgrounds & gods
            for (sound_id in this.GameSounds.background) {
                if (this.GameSounds.background.hasOwnProperty(sound_id)) {
                    if (this.GameSounds.background[sound_id].category === "background") {
                        background_settings.themes.push(sound_id);
                    } else {
                        background_settings.gods.push(sound_id);
                    }
                }
            }

            this.set("background_settings", background_settings);
            this.set("background_queue", []);
        },

        /**
         * Play first sound from background queue and push a new background sound or god sound at the end of the queue
         */
        playBackground: function() {
            if (!this.enabled() || !this.get("categories_enabled").background) {
                return;
            }

            if (this.isMuted()) {
                return;
            }

            // Push a new sound at the end of the queue
            var played_bg = this.get("played_bg"),
                element;

            if (played_bg === 2) {
                this.set("played_bg", 0);
                this._setRandomBgSound("gods");
            } else {
                this.set("played_bg", this.get("played_bg") + 1);
                this._setRandomBgSound("themes");
            }

            element = this.get("background_queue").shift();

            // handling issues with corrupted sounds caused e.g. weak internet connection
            if (typeof element === "undefined") {
                setTimeout(this.playBackground.bind(this), 15000);
            } else if (Game.isiOs() && this.playIosSoundsWithDelay) {
                this.playIosSoundsWithDelay = false;
                setTimeout(this.playBackground.bind(this), 2000);
            } else {
                element.player.play();
            }
        },

        startBackgroundSoundForMobileDevice: function() {
            var bg_collection = us.first(this.get("categories").where({
                name: "background"
            })).get("collection");
            us.last(bg_collection.models).play();
        },

        stopBackgroundSoundForMobileDevice: function() {
            var bg_collection = us.first(this.get("categories").where({
                name: "background"
            })).get("collection");
            bg_collection.forEach(function(sound_model) {
                sound_model.stop();
            });
        },

        categoryEnabled: function(name) {
            if (!this.enabled()) {
                return false;
            }

            var enabled = this.get("categories_enabled");
            if (!enabled.hasOwnProperty(name) || !enabled[name]) {
                return false;
            }
            return true;
        },
        anyCategoryEnabled: function() {
            if (!this.enabled()) {
                return false;
            }

            var categories = this.get("categories_enabled"),
                i;
            for (i in categories) {
                if (categories.hasOwnProperty(i) && categories[i]) {
                    return true;
                }
            }
            return false;
        },
        createCategory: function(name) {
            var category = new SoundCategory({
                    name: name
                }),
                self = this;
            this.get("categories").add(category);

            category.on("change:volume", function() {
                category.trigger("update_volume", {
                    global: self.getVolume()
                });
            });
            return category;
        },
        enabled: function() {
            return this.get("enabled");
        },
        supported: function() {
            return this.get("supported");
        },
        enable: function(config) {
            if (!this.enabled()) {
                return;
            }

            // already enabled
            if (config.sound_def.player) {
                return config.sound_def.player;
            }

            var category = us.first(this.get("categories").where({
                    name: config.category_name
                })),
                model;

            if (!category) {
                category = this.createCategory(config.category_name);
            }

            model = new SoundModel(config, {
                global: this.getVolume(),
                category: category.get("volume"),
                controller: this
            });

            category.get("collection").add(model);
            this.get("sounds").add(model);

            config.sound_def.player = model;
            return model;
        },
        enableSound: function(sound_def) {
            var defaultVals = {
                category_name: "default",
                effects: null,
                callbacks: null,
                loop: false,
                autoplay: false
            };

            if (!this.categoryEnabled(sound_def.category)) {
                return;
            }

            // handling sprites from generated file
            // @TODO: move GameSoundSprites to GameData.SoundSprites
            //if (typeof GameSoundSprites !== "undefined" && GameSoundSprites[sound_def.path]) {
            //this.enableSprite($.extend(sound_def, GameSoundSprites[sound_def.path]));
            //return;
            //}

            this.enable($.extend(defaultVals, sound_def.options, {
                name: sound_def.path,
                url: this.get("audio_path") + sound_def.category + "/" + sound_def.path + this.get("extension"),
                category_name: sound_def.category || "default",
                sound_def: sound_def
            }));
        },
        enableSoundBranch: function(branch) {
            for (var id in branch) {
                if (branch.hasOwnProperty(id)) {
                    if (branch[id].hasOwnProperty("path")) {
                        this.enableSound(branch[id]);
                    } else {
                        this.enableSoundBranch(branch[id]);
                    }
                }
            }
        },
        play: function(sound_def) {
            if (!this.enabled()) {
                return;
            }

            if (sound_def) {
                if (sound_def.player) {
                    sound_def.player.play();
                } else if (sound_def.play_on_load) {
                    sound_def.options.autoplay = true;
                }
            }
        },
        stop: function(sound_def) {
            if (sound_def && sound_def.player) {
                sound_def.player.stop();
            }
        },
        setVolume: function(volume) {
            this.set("volume", volume / 100);
            this.set("sound_volume", volume);
        },
        getVolume: function() {
            return this.isMuted() ? 0 : this.get("volume");
        },
        getSoundVolume: function() {
            return this.get("sound_volume");
        },
        isMuted: function() {
            return this.get("muted");
        },
        mute: function() {
            if (Game.isiOs()) {
                this.stopBackgroundSoundForMobileDevice();
            }
            this.set("muted", true);
            this.unregisterEventListeners();
            this.triggerMuteModePostMessage(true);
        },
        unmute: function() {
            this.set("muted", false);
            if (!this.get("preloaded")) {
                this.onInit();
            } else if (Game.isiOs()) {
                this.startBackgroundSoundForMobileDevice();
            }
            this.registerEventListeners();
            this.triggerMuteModePostMessage(false);
        },
        debug: function() {
            console.log("global volume:", this.getVolume());
            console.log("categories(" + this.get("categories").size() + "): ");
            this.get("categories").forEach(function(item) {
                console.log(".category", item.get("name"), " sounds: ", item.get("collection").size());
                item.get("collection").forEach(function(sound) {
                    console.log("..sound", sound.get("name"), " players - idle: ", sound.get("players").idle.size(), " players - working: ", sound.get("players").working.size());
                    sound.get("players").idle.forEach(function(player) {
                        console.log("...player-idle", player.cid);
                    });
                    sound.get("players").working.forEach(function(player) {
                        console.log("...player-working", player.cid);
                    });
                });
            });
        },
        triggerMuteModePostMessage: function(is_muted) {
            if (Game.isHybridApp()) {
                window.top.postMessage({
                    message: 'handle_mute_mode',
                    data: {
                        is_muted: is_muted
                    }
                }, '*');
            }
        }
    });

    window.GameControllers.SoundController = SoundController;
}());