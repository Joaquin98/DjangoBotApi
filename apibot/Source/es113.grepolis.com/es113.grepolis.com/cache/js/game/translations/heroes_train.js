/*globals _, s */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            heroes_train: {
                window_title: _('Train your hero!'),
                tabs: [_('Index')],
                index: {
                    achievements_next_level: _('Next level:'),
                    level: _('Level:'),
                    use_coins: _('Use Coins'),
                    use_coins_tooltip: _('Pay the chosen amount of coins to help your hero to reach a new level.'),
                    use_coins_no_coins_tooltip: _('You currently do not have any coins to spend.'),
                    use_coins_hero_in_attack_tooltip: _('This hero is moving to attack and thus cannot be trained right now.'),
                    max_level_reached: _("Congratulations! Your hero has reached the highest level. It is no longer possible to spend coins for his/her training, as the hero already knows everything!")
                }
            }
        }
    });
}());