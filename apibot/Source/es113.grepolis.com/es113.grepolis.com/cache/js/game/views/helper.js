define('view/helper', function() {
    'use strict';

    function getGameBorderHtml() {
        return '' +
            '<div class="game_border_top"></div>' +
            '<div class="game_border_bottom"></div>' +
            '<div class="game_border_left"></div>' +
            '<div class="game_border_right"></div>' +
            '<div class="game_border_corner corner1"></div>' +
            '<div class="game_border_corner corner2"></div>' +
            '<div class="game_border_corner corner3"></div>' +
            '<div class="game_border_corner corner4"></div>';
    }

    /**
     * Needs a wrapper element with class 'grepo_box'
     * and a content element with class 'content'
     *
     * Example usage:
     * <div class="grepo_box">
     *     <div class="title">Title</div>
     *     <%= _grepo_box %>
     *     <div class="content">...</div>
     * </div>
     *
     * @returns {string}
     */
    function getGrepoBoxHtml() {
        return '' +
            '<div class="box_corner box_corner_tl"></div>' +
            '<div class="box_corner box_corner_tr"></div>' +
            '<div class="box_corner box_corner_bl"></div>' +
            '<div class="box_corner box_corner_br"></div>' +
            '<div class="box_border border_tl"></div>' +
            '<div class="box_border border_tm"></div>' +
            '<div class="box_border border_tr"></div>' +
            '<div class="box_border border_l"></div>' +
            '<div class="box_border border_r"></div>' +
            '<div class="box_border border_b"></div>' +
            '<div class="grepo_box_background"></div>';
    }

    /**
     * Needs a wrapper element with class "speechbubble"
     * and a content element with class "content"
     *
     * Example:
     * <div class="speechbubble">
     *     <%= _speechbubble %>
     *     <div class ="content"></div>
     * </div>
     *
     * @returns {string}
     */
    function getSpeechbubbleHtml() {
        return '' +
            '<div class="speechbubble_b"></div>' +
            '<div class="speechbubble_l"></div>' +
            '<div class="speechbubble_r"></div>' +
            '<div class="speechbubble_t"></div>' +
            '<div class="speechbubble_tl"></div>' +
            '<div class="speechbubble_tr"></div>' +
            '<div class="speechbubble_bl"></div>' +
            '<div class="speechbubble_br"></div>' +
            '<div class="speechbubble_m"></div>' +
            '<div class="speechbubble_arrow_l"></div>';
    }

    /**
     * Simply does a lookup in a provided dictionary of compiled and pre-rendered partials
     * @param partials - list of all available partial templates
     * @param name - the name of the partial that should be rendered
     * @return {string} - rendered template
     */
    function getPartial(partials, name) {
        if (!partials) {
            throw 'You need to add the attribute "partials" with a list' +
                ' of all template names you want to use to your data in the renderTemplate call.';
        } else if (!partials[name]) {
            throw 'Couldn\'t find template with name: ' + name;
        }

        return partials[name];
    }

    return function(partials) {
        return {
            _game_border: getGameBorderHtml(),
            _partial: getPartial.bind(null, partials),
            _grepo_box: getGrepoBoxHtml(),
            _speechbubble: getSpeechbubbleHtml()
        };
    };

});