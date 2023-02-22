/*global DM, GameHelpers, GameEvents */

(function() {
    'use strict';

    var Controller = window.GameControllers.TabController;

    var QuestWelcome = Controller.extend({
        renderPage: function(data) {
            var l10n = DM.getl10n('progessables', 'quest').new_welcome_window,
                templates = DM.getTemplate('quest_welcome'),
                root = this.$el,
                yBox;

            this.quest_model = data.models.progressable;

            this.window_model.setTitle(l10n.title);

            root.html(us.template(templates.welcome_window, {
                l10n: l10n,
                intro: l10n.text
            }));

            // let's do some magic here ;)
            yBox = root.find('.yellowBox');

            yBox.html(us.template(document.getElementById('tpl_generic_box_container').innerHTML, {
                value: yBox.html()
            }));

            this.initializeComponents(root, l10n);

            return this;
        },

        initializeComponents: function(root, l10n) {
            var _self = this;

            this.unregisterComponents();

            // register "activate first quest" button"
            this.registerComponent('btn_start_tutorial', root.find('#btn_start_tutorial').button({
                caption: l10n.button.start
            }).on('btn:click', function( /*e, _btn*/ ) {
                $.Observer(GameEvents.tutorial.started).publish();
                _self.window_model.close();

                // remove all existing 'quest' group helpers, to avoid having two arrows
                GameHelpers.remove({
                    groupId: 'quest'
                });

                // add quest arrow to the first quest
                GameHelpers.add({
                    groupId: 'found_city',
                    setId: 'start_tutorial',
                    arrogant: true,
                    steps: [{
                            search: '#icons_container_left .questlog_icon',
                            show: [{
                                selector: '#icons_container_left .questlog_icon',
                                type: 'arrow',
                                direction: 'nw',
                                offset: {
                                    x: -5,
                                    y: -25
                                }
                            }]
                        },
                        {
                            search: '#quest_inspector .btn_action',
                            show: [{
                                selector: '#quest_inspector .btn_action',
                                type: 'arrow',
                                direction: 'e'
                            }]
                        }

                    ]
                });
            }));

            // add quest arrow
            GameHelpers.add({
                groupId: 'found_city',
                setId: 'start_tutorial',
                arrogant: true,
                steps: [{
                    search: '#btn_start_tutorial',
                    show: [{
                        selector: '#btn_start_tutorial',
                        type: 'arrow',
                        direction: 'n'
                    }]
                }]
            });
        },

        destroy: function() {
            this.$el.empty();
        }
    });

    window.GameViews.QuestWelcome = QuestWelcome;
}());