/* global _, DM */

(function() {
    "use strict";

    DM.loadData({
        l10n: {
            invite_friends: {
                invite_friends: {
                    cbx_agree_caption: _('I hereby claim that the recipient agrees on receiving an invitation email.'),
                    buttons: {
                        mail: {
                            caption: _('via email'),
                            tooltips: {
                                disabled: _('You need to validate your game account via email before you can invite new players.')
                            }
                        },
                        url: {
                            caption: _('via link')
                        },
                        banner: {
                            caption: _('via banner')
                        },
                        facebook: {
                            caption: _('via Facebook')
                        }
                    }
                }
            }
        }
    });
}());