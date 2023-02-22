/* globals DM */
define('features/spells_dialog/translations/translations', function() {
    'use strict';

    DM.loadData({
        l10n: {
            spells_dialog: {
                cast_spell: {
                    headline: {
                        town: _("Choose a spell you want to cast on this town:"),
                        command: _("Choose a spell you want to cast on this command:"),
                        attack: _("Choose a spell you want to cast on this command:")
                    },
                    worship_a_god_first: _("Please worship a god in the temple first!"),
                    btn_to_temple: _("To the Temple"),
                    view_report: _("View report")
                }
            },
            premium: {
                cast_spell_confirmation_town: {
                    confirmation: {
                        window_title: '',
                        question: function(casted_power, target) {
                            return s(_("Would you like to cast %1 on %2?"), casted_power, target);
                        },
                        confirm: _("Cast spell"),
                        cancel: _("Cancel")
                    }
                },
                cast_spell_confirmation_command: {
                    confirmation: {
                        window_title: '',
                        question: function(casted_power, target) {
                            return s(_("Would you like to cast %1 on this command?"), casted_power, target);
                        },
                        confirm: _("Cast spell"),
                        cancel: _("Cancel")
                    }
                },
                cast_negative_spell_on_own_town: {
                    confirmation: {
                        window_title: _("Cast negative powers"),
                        question: _("This effect will inflict damage on your city. Do you really want to use this effect?")
                    }
                },
                cast_negative_spell_on_own_command: {
                    confirmation: {
                        window_title: _("Cast negative powers"),
                        question: _("This effect will inflict damage on your troops. Do you really want to use this effect?")
                    }
                },
            }
        }
    });
});