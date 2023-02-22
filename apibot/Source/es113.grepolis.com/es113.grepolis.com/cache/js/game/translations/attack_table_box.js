/*globals DM*/

define("translations/attack_table_box", function() {
    "use strict";

    DM.loadData({
        l10n: {
            attack_table_box: {
                headers: {
                    attack_type: _("Types"),
                    attack_strategy: _("Strategies"),
                    spells: _("Spells")
                },
                tooltips: {
                    attack_type: _("The type of attack influences the result of that attack. This is mainly used on revolt worlds."),
                    attack_strategy: _("The strategies are modifiers to how the battle is fought - you can select any number of them to a single attack."),
                    spells: _("You can only cast one spell on a command - the listed spells are the ones that can be used. Make sure you have enough favor before sending the attack.")
                }
            }
        }
    });

});