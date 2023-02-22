/*globals Game, DM */
define('helpers/error_handler', function() {
    'use strict';

    return {
        handleImageCorsError: function(e) {
            var img_tag = e.target,
                img_src = img_tag.currentSrc,
                game_url = Game.game_url,
                img_tag_parent = img_tag.parentElement;

            var error_div_element = document.createElement('div');
            error_div_element.innerHTML = us.template(DM.getTemplate('error_messages', 'cors_error_message'), {
                error_message: DM.getl10n('COMMON').error.cors_error_message(img_src, game_url, Game.img_hosting_whitelist_wiki_url)
            });
            img_tag_parent.insertBefore(error_div_element.firstChild, img_tag);

            img_tag_parent.removeChild(img_tag);
        }
    };
});