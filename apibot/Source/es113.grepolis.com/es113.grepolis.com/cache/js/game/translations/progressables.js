/*globals DM*/

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            progessables: {
                quest: {
                    'icon': {
                        'all_steps_done': _('All requirements met')
                    },
                    progressbar: {
                        'mouseover': {
                            text: function(quests_left_count) {
                                return s(_('Complete another %1 quests to receive the following rewards:'), quests_left_count);
                            },
                            folks: _('The base production of wood, stone, and silver coins will increase by 75% for 7 days.'),
                            andromeda: _('The heroine Andromeda will enter your service.')
                        },
                        'window': {
                            'header': _('Congratulations!'),
                            'text': {
                                without_andromeda: _('You have built a solid foundation for a promising polis. Your people are happy and very grateful.'),
                                with_andromeda: _('You have built a solid foundation for a promising polis. Your people are happy and Andromeda has joined you.')
                            }

                        }
                    },
                    'new_welcome_window': {
                        'title': _('Welcome to Grepolis'),
                        'text': {
                            'head': {
                                'window': _('Greetings, mortal!')
                            },
                            'text': {
                                'can_not_skip': _('I am Helen, the daughter of Zeus. My father has told me that a new ruler would come to this world to build a great empire. It is for this reason that I have asked one of our wise senators to help you in building your first city.')
                            }
                        },
                        'button': {
                            'start': _('Found city')
                        }
                    },
                    'switch_sniff_tooltip': {
                        'show': _('Click here to display the quest arrows for this quest.'),
                        'hide': _('Click here to deactivate the quest arrows for this quest.')
                    }
                } // quest
            } // progressables
        } // l10n
    });
}());