/* global Game, GameData, Logger, GameEvents*/

(function() {
    'use strict';

    var SoundListeners = {
        start: function(audio, game_sounds) {
            if (window.isForum) {
                return;
            }

            this.audio = audio;
            this.game_sounds = game_sounds;

            return this;
        },

        // Don't remove otherwise everything breaks
        initialize: function() {

        },

        // Don't remove otherwise everything breaks
        destroy: function() {

        },

        startListening: function() {
            var audio = this.audio,
                game_sounds = this.game_sounds;

            /* --:[ Generic click ]:-- */
            $(document).on('mousedown.gameSounds', function() {
                audio.play(game_sounds.click);

                Logger.get('gameSounds').log(function() {
                    return ['mousedown.gameSounds'];
                });
            });

            /* --:[ Sound triggers! ]:-- */

            $.Observer(GameEvents.window.close).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.close);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.close, data];
                });
            });

            $.Observer(GameEvents.window.minimize).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.minimize);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.minimize, data];
                });
            });

            $.Observer(GameEvents.window.maximize).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.maximize, data];
                });
            });

            $.Observer(GameEvents.notification.message.arrive).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.notification.message.arrive);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.notification.message.arrive, data];
                });
            });

            $.Observer(GameEvents.map.jump).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.map.jump);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.map.jump, data];
                });
            });

            $.Observer(GameEvents.menu.click).subscribe('game_sounds', function(e, data) {
                switch (data.option_id) {
                    case 'messages':
                        //FALLTHROUGH
                    case 'reports':
                        audio.play(game_sounds.menu.messages.click);
                        break;
                    case 'alliance':
                        audio.play(game_sounds.menu.alliance.click);
                        break;
                    case 'allianceforum':
                        audio.play(game_sounds.menu.alliance_forum.click);
                        break;
                    case 'settings':
                        audio.play(game_sounds.menu.settings.click);
                        break;
                    case 'profile':
                        audio.play(game_sounds.menu.profile.click);
                        break;
                    case 'ranking':
                        audio.play(game_sounds.menu.ranking.click);
                        break;
                    case 'help':
                        audio.play(game_sounds.menu.help.click);
                        break;
                    case 'forum':
                        audio.play(game_sounds.menu.forum.click);
                        break;
                    case 'premium':
                        audio.play(game_sounds.menu.premium.click);
                        break;
                    case 'invite_friends':
                        audio.play(game_sounds.menu.invite_friends.click);
                        break;
                }

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.menu.click, data];
                });
            });

            $.Observer(GameEvents.window.alliance.invite_friends).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.alliance.invite_friends);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.alliance.invite_friends, data];
                });
            });

            $.Observer(GameEvents.map.zoom_in).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.map.zoom_in);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.map.zoom_in, data];
                });
            });

            $.Observer(GameEvents.map.zoom_out).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.map.zoom_out);
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.map.zoom_out, data];
                });
            });

            $.Observer(GameEvents.celebration.start).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.celebration.start[data.celebration_type]);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.celebration.start, data];
                });
            });

            $.Observer(GameEvents.premium.adviser.activate).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.premium.adviser.activate[data.adviser_id]);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.premium.adviser.activate, data];
                });
            });

            $.Observer(GameEvents.premium.build_time_reduction).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.premium.build_time_reduction[data.type]);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.premium.build_time_reduction, data];
                });
            });

            $.Observer(GameEvents.window.premium.buy_gold.open).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.button.buy_gold.click);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.premium.buy_gold.open, data];
                });
            });

            $.Observer(GameEvents.button.buy_gold.click).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.button.buy_gold.click);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.button.buy_gold.click, data];
                });
            });

            $.Observer(GameEvents.window.building.open).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.building.open[data.building_id]);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.building.open, data];
                });
            });

            $.Observer(GameEvents.god.change).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.god.change[data.god_id]);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.god.change, data];
                });
            });

            $.Observer(GameEvents.map.town.click).subscribe('game_sounds', function(e, data) {
                if (data.player_name === '') {
                    audio.play(game_sounds.map.town.click.ghost_city);

                } else if (data.player_id === Game.player_id) {
                    audio.play(game_sounds.map.town.click.own);

                } else if (data.alliance_id === Game.alliance_id) {
                    audio.play(game_sounds.map.town.click.alliance);

                } else {
                    /**
                     * @todo discuss about pacts & enemies
                     */
                    //audio.play(game_sounds.map.town.click.enemy);
                }
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.map.town.click, data];
                });
            });

            $.Observer(GameEvents.map.context_menu.click).subscribe('game_sounds', function(e, data) {
                if (data && data.name) {
                    switch (data.name) {
                        case 'god':
                            audio.play(game_sounds.map.context_menu.click.spells);
                            break;
                        case 'goToTown':
                            audio.play(game_sounds.map.context_menu.click.overview);
                            break;
                        case 'espionage':
                            audio.play(game_sounds.map.context_menu.click.espionage);
                            break;
                    }
                }

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.map.context_menu.click, data]; // 228. 229
                });
            });

            $.Observer(GameEvents.command.build_unit).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.command.build_unit[data.unit_id]);
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.command.build_unit, data];
                });
            });

            $.Observer(GameEvents.building.farm.request_militia).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.farm.request_militia);
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.building.farm.request_militia, data];
                });
            });

            $.Observer(GameEvents.window.farm.claim_load).subscribe('game_sounds', function(e, data) {
                var lvl = 'lvl_' + (data.data ? data.data.expansion_stage : 0);
                audio.play(game_sounds.window.farm.claim_load[data.claim_type][lvl]);

                Logger.get('gameSounds').log(function() {
                    var type;
                    if (data.claim_type === 'normal') { // 293-296
                        type = 'farm';
                    }
                    if (data.claim_type === 'double') { // 297 - 300
                        type = 'loot';
                    }
                    return ['game_sounds.window.farm.claim_load[' + data.claim_type + '][' + lvl + ']', GameEvents.window.farm.claim_load, type, data]; //  use target_id to check the lvl of farm?
                });
            });

            $.Observer(GameEvents.window.farm.trade).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.farm.trade);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.farm.trade, data];
                });
            });

            $.Observer(GameEvents.window.farm.send_resources).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.farm.send_resources);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.farm.send_resources, data];
                });
            });

            $.Observer(GameEvents.command.cast_power).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.command.cast_power[data.power_id]);
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.command.cast_power, data];
                });
            });

            $.Observer(GameEvents.building.academy.research.buy).subscribe('game_sounds', function(e, data) {
                switch (data.research_id) {
                    case 'slinger':
                    case 'archer':
                    case 'hoplite':
                    case 'rider':
                    case 'chariot':
                    case 'big_transporter':
                    case 'bireme':
                    case 'attack_ship':
                    case 'demolition_ship':
                    case 'small_transporter':
                    case 'colonize_ship':
                        audio.play(game_sounds.command.build_unit[data.research_id]);
                        break;

                    default:
                        audio.play(game_sounds.window.academy.research.buy[data.research_id]);
                        break;
                }

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.building.academy.research.buy, data];
                });
            });

            /** disabled by GP-7088 **/
            /*$.Observer(GameEvents.quest.add).subscribe('game_sounds', function(e, data) {
             audio.play(game_sounds.quest.add);
             Logger.get('gameSounds').log(function(){
             return [ GameEvents.quest.add, data];
             });
             });*/

            $.Observer(GameEvents.quest.change_state).subscribe('game_sounds', function(e, data) {
                switch (data.new_state) {
                    /** disabled by GP-7088 **/
                    /*case 'running':
                     audio.play(game_sounds.quest.accept);
                     break;*/
                    /*case 'satisfied':
                     audio.play(game_sounds.quest.completed);
                     break;*/
                    case 'closed':
                        audio.play(game_sounds.quest.claim_reward);
                        break;
                }
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.quest.change_state, data];
                });
            });

            $.Observer(GameEvents.window.quest.open).subscribe('game_sounds', function(e, data) {
                switch (data.quest_type) {
                    case 'blue':
                        audio.play(game_sounds.window.quest.open.socrates);
                        break;
                    case 'yellow':
                        audio.play(game_sounds.window.quest.open.captain);
                        break;
                    case 'red':
                        audio.play(game_sounds.window.quest.open.curator);
                        break;
                    case 'hermes':
                        audio.play(game_sounds.window.quest.open.hermes);
                        break;
                }
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.quest.open, data];
                });
            });

            $.Observer(GameEvents.command.cancel).subscribe('game_sounds', function(e, data) {
                switch (data.unit_id) {
                    case 'sword':
                    case 'slinger':
                    case 'archer':
                    case 'hoplite':
                    case 'rider':
                    case 'chariot':
                    case 'catapult':
                        audio.play(game_sounds.command.cancel.troops);
                        break;

                    case 'big_transporter':
                    case 'bireme':
                    case 'attack_ship':
                    case 'demolition_ship':
                    case 'small_transporter':
                    case 'trireme':
                    case 'colonize_ship':
                        audio.play(game_sounds.command.cancel.ships);
                        break;

                }
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.command.cancel, data];
                });
            });

            $.Observer(GameEvents.building.academy.research.cancel).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.academy.research.cancel);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.building.academy.research.cancel, data];
                });
            });

            $.Observer(GameEvents.building.cancel).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.building.cancel);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.building.cancel, data];
                });
            });

            $.Observer(GameEvents.command.send_unit).subscribe('game_sounds', function(e, data) {
                var unit, ships = false;
                for (unit in GameData.units) {
                    if (GameData.units.hasOwnProperty(unit) && GameData.units[unit].is_naval && data.params[unit]) {
                        ships = true;
                        break;
                    }
                }

                if (ships) {
                    audio.play(game_sounds.command.send_unit.ships);
                } else {
                    audio.play(game_sounds.command.send_unit.troops);
                }

                Logger.get('gameSounds').log(function() {
                    var type;
                    if (data.sending_type === 'support') {
                        type = 'support'; //just support
                    } else if (data.sending_type === 'attack') {
                        type = 'attack'; //just attack
                    } else if (data.sending_type === '') {
                        data.sending_type = 'farm';
                        type = 'farming';
                    }

                    return [GameEvents.command.send_unit, type, data];
                });

            });

            $.Observer(GameEvents.window.daily_bonus.accept).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.window.daily_bonus.accept);
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.daily_bonus.accept, data];
                });
            });

            $.Observer(GameEvents.premium.merchant.immediate_call).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.premium.merchant.immediate_call);
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.premium.merchant.immediate_call, data];
                });
            });

            $.Observer(GameEvents.attack.incoming).subscribe('game_sounds', function(e, data) {
                if (data.count > 0 && data.count > data.previous_count) {
                    audio.play(game_sounds.attack.incoming);

                    Logger.get('gameSounds').log(function() {
                        return [GameEvents.attack.incoming, data];
                    });
                }
            });

            /**** enabling sounds ****/

            $.Observer(GameEvents.window.open).subscribe('game_sounds', function(e, data) {
                audio.enableSound(game_sounds.window.minimize);
                audio.enableSound(game_sounds.window.close);
                switch (data.context || data.getType()) {
                    case 'premium':
                        audio.enableSound(game_sounds.button.buy_gold.click);
                        audio.enableSoundBranch(game_sounds.premium.adviser);
                        break;
                    case 'town':
                        audio.enableSoundBranch(game_sounds.command.cast_power);
                        audio.enableSoundBranch(game_sounds.command.send_unit);
                        break;
                    case 'farm_town':
                        audio.enableSoundBranch(game_sounds.command.send_unit);
                        break;
                    case 'attack_spot':
                        audio.enableSoundBranch(game_sounds.command.send_unit);
                        break;
                    case 'alliance':
                        audio.enableSound(game_sounds.window.alliance.invite_friends);
                        break;
                }
            });

            $.Observer(GameEvents.window.building.open).subscribe('game_sounds', function(e, data) {
                switch (data.building_id) {
                    case 'docks':
                        audio.enableSound(game_sounds.command.cancel.ships);
                        audio.enableSound(game_sounds.premium.build_time_reduction.unit);
                        audio.enableSound(game_sounds.premium.merchant.immediate_call);
                        audio.enableSoundBranch(game_sounds.command.build_unit);
                        break;
                    case 'barracks':
                        audio.enableSound(game_sounds.command.cancel.troops);
                        audio.enableSound(game_sounds.premium.build_time_reduction.unit);
                        audio.enableSoundBranch(game_sounds.command.build_unit);
                        break;
                    case 'temple':
                        audio.enableSoundBranch(game_sounds.god.change);
                        break;
                    case 'farm':
                        audio.enableSound(game_sounds.window.farm.request_militia);
                        break;
                    case 'place':
                        audio.enableSoundBranch(game_sounds.celebration.start);
                        break;
                    case 'main':
                        audio.enableSound(game_sounds.premium.build_time_reduction.building);
                        audio.enableSound(game_sounds.building.cancel);
                        break;
                    case 'academy':
                        audio.enableSoundBranch(game_sounds.window.academy);
                        audio.enableSound(game_sounds.command.build_unit.slinger);
                        audio.enableSound(game_sounds.command.build_unit.archer);
                        audio.enableSound(game_sounds.command.build_unit.hoplite);
                        audio.enableSound(game_sounds.command.build_unit.rider);
                        audio.enableSound(game_sounds.command.build_unit.chariot);
                        audio.enableSound(game_sounds.command.build_unit.bireme);
                        audio.enableSound(game_sounds.command.build_unit.trireme);
                        audio.enableSound(game_sounds.command.build_unit.big_transporter);
                        audio.enableSound(game_sounds.command.build_unit.attack_ship);
                        audio.enableSound(game_sounds.command.build_unit.demolition_ship);
                        audio.enableSound(game_sounds.command.build_unit.small_transporter);
                        audio.enableSound(game_sounds.command.build_unit.colonize_ship);
                        break;
                }
            });

            $.Observer(GameEvents.map.context_menu.click).subscribe('game_sounds', function(e, data) {
                audio.enableSoundBranch(game_sounds.map.context_menu.click);
            });

            $.Observer(GameEvents.window.quest.init_icon).subscribe('game_sounds', function(e, data) {
                audio.enableSound(game_sounds.quest.claim_reward);
            });

            $.Observer(GameEvents.window.quest.open).subscribe('game_sounds', function(e, data) {
                audio.enableSoundBranch(game_sounds.quest);
            });

            $.Observer(GameEvents.map.farm.click).subscribe('game_sounds', function(e, data) {
                audio.enableSoundBranch(game_sounds.window.farm);
            });

            /**** not used *****/

            $.Observer(GameEvents.town.units.barracks.order.done).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.town.barracks.units.order.done, data];
                });
            });

            $.Observer(GameEvents.town.units.docks.order.done).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.town.docks.units.order.done, data];
                });
            });

            $.Observer(GameEvents.map.free_town.click).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.map.free_town.click, data];
                });
            });

            $.Observer(GameEvents.map.invitation_spot.click).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.map.invitation_spot.click, data];
                });
            });

            $.Observer(GameEvents.map.island.click).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.map.island.click, data];
                });
            });

            $.Observer(GameEvents.window.farm.claim_unit).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.window.farm.claim_unit, data];
                });
            });

            $.Observer(GameEvents.tutorial.arrow.next.click).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.tutorial.arrow.next.click, data];
                });
            });

            $.Observer(GameEvents.tutorial.arrow.previous.click).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.tutorial.arrow.previous.click, data];
                });
            });

            $.Observer(GameEvents.building.expand).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.building.expand, data];
                });
            });

            //@todo

            $.Observer(GameEvents.building.demolish).subscribe('game_sounds', function(e, data) {
                Logger.get('gameSounds').log(function() {
                    return [GameEvents.building.demolish, data];
                });
            });

            $.Observer(GameEvents.notification.system.arrive).subscribe('game_sounds', function(e, data) {
                audio.play(game_sounds.notification.system.arrive);

                Logger.get('gameSounds').log(function() {
                    return [GameEvents.notification.system.arrive, data];
                });
            });
        },

        stopListening: function() {
            $(document).off('mousedown.gameSounds');
            $.Observer().unsubscribe('game_sounds');
        }
    };

    window.GameListeners.SoundListeners = SoundListeners;
}());