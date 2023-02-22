/*globals _, s */
(function() {
    "use strict";

    DM.loadData({
        l10n: {
            hide: {
                window_title: _('Building view - %1 (%2)'),
                tabs: [_('Index')],
                index: {
                    hide: _('Cave'),
                    last_10_spy_reports: _('The last 10 spy reports:'),
                    no_espionage: _('No espionage'),
                    silver_coins: _('Silver coins'),
                    stored_coins: _('Stored coins'),
                    popup_text: _literal('<h4>') + _('Store silver coins') + _literal('</h4>') +
                        _literal('<p>') + _('You can store silver coins in the cave. You can then no longer remove those from the cave. With these silver coins, you can assign spies who will reveal the units and building levels of foreign cities.') + _literal('<br />') +
                        _('If you have stored more silver coins than another player has paid for an espionage order against you, the espionage will fail.') + _literal('</p>')
                }
            }
        }
    });
}());