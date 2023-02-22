//All events which are used in the game
define('data/events', function() {
    'use strict';

    var GameEvents = {
        all: 'all',
        advent: {
            reward: {
                use: 'advent:reward:use',
                stash: 'advent:reward:stash',
                trash: 'advent:reward:trash'
            },
            advisors_received: 'advent:advisors_received',
            shard_collected: 'advent:shard_collected'
        },

        alliance: {
            leave: 'alliance:leave',
            remove: 'alliance:remove',
            create: 'alliance:create',
            join: 'alliance:join',
            new_message: 'alliance:new_message'
        },
        attack: {
            incoming: 'attack:incoming',
            planner_reminder: 'attack:planner_reminder'
        },

        bar: {
            powers: {
                render: 'bar:powers:render'
            },
            units: {
                render: 'bar:units:render',
                duration: {
                    render: 'bar:units:duration:render'
                }
            }
        },

        building: {
            expand: 'building:expand',
            demolish: 'building:demolish',
            cancel: 'building:cancel',
            city_overview: {
                initialized: 'building:city_overview:initialized',
                destroyed: 'building:city_overview:destroyed'
            },
            academy: {
                research: {
                    buy: 'building:academy:research:buy',
                    cancel: 'building:academy:research:cancel'
                }
            },
            farm: {
                request_militia: 'building:farm:request_militia'
            }
        },

        button: {
            buy_gold: {
                click: 'button:buy_gold:click'
            }
        },

        celebration: {
            start: 'celebration:start'
        },

        command: {
            send_unit: 'command:send_unit',
            build_unit: 'command:build_unit',
            cast_power: 'command:cast_power',
            cancel: 'command:cancel',
            support: {
                send_back: 'command:support:send_back'
            }
        },

        community_goals: {
            goal_reached: 'community_goals:goal_reached'
        },

        daily_login_bonus: {
            reward: {
                use: 'daily_login_bonus:reward:use',
                stash: 'daily_login_bonus:reward:stash',
                trash: 'daily_login_bonus:reward:trash'
            }
        },

        document: {
            key_down: 'document:key_down',
            key_up: 'document:key_up',
            key: {
                enter: {
                    down: 'document:key:enter:down',
                    up: 'document:key:enter:up'
                },
                shift: {
                    down: 'document:key:shift:down',
                    up: 'document:key:shift:up'
                },
                esc: {
                    down: 'document:key:esc:down',
                    up: 'document:key:esc:up'
                },
                arrow_left: {
                    down: 'document:key:arrow_left:down',
                    up: 'document:key:arrow_left:up'
                },
                arrow_right: {
                    down: 'document:key:arrow_right:down',
                    up: 'document:key:arrow_right:up'
                },
                space: {
                    down: 'document:key:space:down',
                    up: 'document:key:space:up'
                }
            },
            window: {
                resize: 'document:window:resize'
            }
        },

        favor: {
            change: 'favor:change',
            full: {
                all_gods: 'favor:full:all_gods'
            }
        },

        forum: {
            content_set: 'forum:content_set'
        },

        game: {
            //executed when the game was started
            start: 'game:start',
            night: 'game:night',
            //Executed when game is completely loaded
            load: 'game:load'
        },

        god: {
            //triggered when town has a god, but user decided to change it
            changed_to: 'god:changed_to',
            //triggered when user selects god for town for a first time
            choose: 'god:choose',
            //triggered when 'god:choose' and 'god:changed_to' are triggered
            change: 'god:change'
        },

        hero: {
            wounded: 'hero:wounded',
            healed: 'hero:healed'
        },

        halloween: {
            reward: {
                use: 'halloween:reward:use',
                stash: 'halloween:reward:stash',
                trash: 'halloween:reward:trash'
            }
        },

        turn_over_tokens: {
            shot: 'turn_over_tokens:shot',
            ranking_evaluation: 'turn_over_tokens:ranking_evaluation'
        },

        easter: {
            reward: {
                use: 'easter:reward:use',
                stash: 'easter:reward:stash',
                trash: 'easter:reward:trash'
            },
            crafted: 'easter:crafted',
            ranking_evaluation: 'easter:ranking_evaluation'
        },

        campaign: {
            ranking_evaluation: 'campaign:ranking_evaluation'
        },

        hercules2014: {
            reward: {
                use: 'active_happening:reward:use',
                stash: 'active_happening:reward:stash',
                trash: 'active_happening:reward:trash'
            }
        },

        active_happening: {
            reward: {
                use: 'active_happening:reward:use',
                stash: 'active_happening:reward:stash',
                trash: 'active_happening:reward:trash'
            },
            inventory: {
                use: 'active_happening:inventory:use',
                stash: 'active_happening:inventory:stash',
                trash: 'active_happening:inventory:trash'
            },
            grand_prize: {
                use: 'active_happening:grand_prize:use',
                stash: 'active_happening:grand_prize:stash',
                trash: 'active_happening:grand_prize:trash'
            }
        },

        happenings: {
            icon: {
                initialize: 'happenings:icon:initialize'
            },
            window: {
                opened: 'happenings:window:opened'
            }
        },

        hero_dropdown: {
            toggle: 'hero_dropdown:toggle'
        },

        itowns: {
            refetch: {
                start: 'itowns:refetch:start',
                finish: 'itowns:refetch:finish'
            },
            town_groups: {
                add: 'itowns:town_groups:add',
                remove: 'itowns:town_groups:remove',
                set_active_group: 'itowns:town_groups:set_active_group'
            }
        },

        main_menu: {
            init: 'main_menu:init',
            resize: 'main_menu:resize'
        },

        map: {
            zoom_in: 'map:zoom_in',
            zoom_out: 'map:zoom_out',
            jump: 'map:jump',
            town: {
                click: 'map:town:click'
            },
            special_town: {
                click: 'map:special_town:click'
            },
            free_town: {
                click: 'map:free_town:click'
            },
            farm: {
                click: 'map:farm:click'
            },
            invitation_spot: {
                click: 'map:invitation_spot:click'
            },
            island: {
                click: 'map:island:click'
            },
            context_menu: {
                click: 'map:context_menu:click'
            },
            refresh: {
                all: 'map:refresh:all',
                towns: 'map:refresh:towns'
            }
        },

        minimap: {
            mouse_events: {
                mouse_up: 'minimap:mouse_events:mouse_up'
            },
            refresh: 'minimap:refresh',
            load_chunks: 'minimap:load_chunks'
        },

        /**
         * Main Menu on the left side
         */
        menu: {
            //fired when user clicked on the menu option
            click: 'menu:click'
        },

        notification: {
            push: 'notification:push',
            del: 'notification:del',
            del_all: 'notification:del_all',
            building_finished: {
                arrive: 'notification:building_finished:arrive' //check if it realy works
            },

            message: {
                arrive: 'notification:message:arrive'
            },

            report: {
                arrive: 'notification:report:arrive'
            },

            system: {
                //@see grepo/include/models/Notifications.php for event-types list
                arrive: 'notification:system:arrive'
            },

            checkstack: {
                spawned: 'notification:checkstack:spawned'
            }
        },

        premium: {
            overviews_menu: {
                toggle_view: 'premium:overviews_menu:toggle_view'
            },
            adviser: {
                activate: 'premium:adviser:activate',
                expire: 'premium:adviser:expire',
                expire_soon: 'premium:adviser:expire_soon'
            },
            merchant: {
                immediate_call: 'premium:merchant:immediate_call',
                run_out: 'premium:merchant:run_out'
            },
            build_time_reduction: 'premium:build_time_reduction',
            build_cost_reduction: 'premium:build_cost_reduction',
            close_cash_shop: 'premium:close_cash_shop'
        },

        progressable: {
            remove: 'progressable:remove',
            add: 'progressable:add'
        },

        quest: {
            add: 'quest:add',
            close: 'quest:close',
            change_state: 'quest:change_state',
            reduce_build_time_quest_changed: 'quest:reduce_build_time_quest_changed',
            tutorial_dead_zone_finished: 'quest:tutorial_dead_zone_finished'
        },

        island_quest: {
            add: 'island_quest:add',
            satisfied: 'island_quest:satisfied'
        },

        sound: {
            init: 'sound:init',
            enable: {
                group: 'sound:enable:group'
            },
            volume: {
                change: 'sound:volume:change',
                mute: 'sound:volume:mute'
            }
        },

        town: {
            power: {
                added: 'town:power:added',
                removed: 'town:power:removed'
            },
            town_switch: 'town:town_switch',
            units_beyond: {
                change: 'town:units_beyond:change'
            },
            units: {
                // Is triggered by Town modUnits (comment from GPEvents)
                change: 'town:units:change',

                barracks: {
                    order: {
                        done: 'town:units:barracks:order:done'
                    }
                },
                docks: {
                    order: {
                        done: 'town:units:docks:order:done'
                    }
                }
            },

            resources: {
                update: 'town:resources:update',
                limit_reached: 'town:resources:limit_reached',
                limit_reached_all: 'town:resources:limit_reached_all',
                limit_freed: 'town:resources:limit_freed'
            },
            population: {
                limit_reached: 'town:population:limit_reached',
                limit_freed: 'town:population:limit_freed'
            },
            trade: {
                arrived: 'town:trade:arrived'
            },
            favor: {
                full: 'town:favor:full'
            },
            research: {
                done: 'town:research:done'
            },
            building: {
                order: {
                    start: 'town:building:order:start',
                    done: 'town:building:order:done',
                    count_change: 'town:building:order:count_change'
                }
            },
            commands: {
                update: 'town:commands:update',
                bulk_update: 'town:commands:bulk_update'
            },
            hide: {
                change: 'town:hide:change'
            }
        },

        tutorial: {
            started: 'tutorial:started',
            arrow: {
                next: {
                    // fired when 'next slide' button is clicked in old tutorial
                    click: 'tutorial:arrow:next:click'
                },

                previous: {
                    //fired when 'previous slide' button is clicked in tutorial
                    click: 'tutorial:arrow:previous:click'
                }
            }
        },

        unit: {
            order: {
                //single unit order finished
                change: 'unit:order:change'
            }
        },

        ui: {
            layout_units: {
                rendered: 'ui:layout_units:rendered'
            },
            layout_gods_spells: {
                rendered: 'ui:layout_gods_spells:rendered',
                state_changed: 'ui:layout_gods_spells:state_changed'
            },
            layout_construction_queue: {
                construction_mode: {
                    activated: 'ui:layout_construction_queue:construction_mode:activated',
                    deactivated: 'ui:layout_construction_queue:construction_mode:deactivated'
                }
            },
            spells_menu: {
                request_open: 'ui:spells_menu:request_open'
            },
            bull_eye: {
                radiobutton: {
                    city_overview: {
                        click: 'ui:bull_eye:radiobutton:city_overview:click'
                    },
                    strategic_map: {
                        click: 'ui:bull_eye:radiobutton:strategic_map:click'
                    },
                    island_view: {
                        click: 'ui:bull_eye:radiobutton:island_view:click'
                    }
                }
            }
        },

        window: {
            open: 'window:open',
            close: 'window:close',

            tab: {
                rendered: 'window:tab:rendered'
            },

            dialog: {
                rendered: 'window:dialog:rendered'
            },

            maximize: 'window:maximize',
            minimize: 'window:minimize',

            reload: 'window:reload',

            town: {
                hide: {
                    count_change: 'window:town:hide:count_change'
                }
            },

            quest: {
                open: 'window:quest:open',
                init_icon: 'window:quest:init_icon'
            },

            building: {
                open: 'window:building:open'
            },

            daily_bonus: {
                accept: 'window:daily_bonus:accept'
            },

            townindex: {
                building: {
                    click: 'window:townindex:building:click'
                }
            },

            inventory: {
                use: 'window:inventory:use',
                trash: 'window:inventory:trash',
                item_added: 'window:inventory:item_added'
            },

            farm: {
                claim_load: 'window:farm:claim_load',
                claim_unit: 'window:farm:claim_unit',
                trade: 'window:farm:trade',
                send_resources: 'window:farm:send_resources'
            },
            alliance: {
                invite_friends: 'window:alliance:invite_friends'
            },
            premium: {
                buy_gold: {
                    open: 'window:premium:buy_gold:open'
                }
            },
            island_quest: {
                reward: {
                    use: 'window:island_quest:reward:use',
                    stash: 'window:island_quest:reward:stash',
                    trash: 'window:island_quest:reward:trash'
                }
            },
            minimized_windows_area: {
                show: 'window:minimized_windows_area:show',
                hide: 'window:minimized_windows_area:hide'
            }
        },

        system: {
            maintenance_started: 'system:maintenance_started',
            maintenance_ended: 'system:maintenance_ended',
            midnight_signal: 'system:midnight_signal'
        },

        spawn: {
            destroy_city_portal: 'spawn:destroy_city_portal'
        },

        grid_event: {
            close_grand_prize_journey: 'grid_event:close_grand_prize_journey'
        },

        attack_spot: {
            reward: {
                use: 'attack_spot:reward:use',
                stash: 'attack_spot:reward:stash',
                trash: 'attack_spot:reward:trash'
            }
        },

        color_picker: {
            change_color: 'color_picker:change_color'
        },

        strategic_map_filter: {
            close: {
                color_picker: 'strategic_map_filter:close:color_picker'
            }
        },

        unit_picker: {
            town_switch_rerender: 'unit_picker:town_switch_rerender'
        }
    };

    window.GameEvents = GameEvents;

    return GameEvents;
});