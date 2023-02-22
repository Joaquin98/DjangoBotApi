define('helpers/sub_window', function() {
    'use strict';

    var ViewHelper = require('view/helper');

    return {
        renderSubWindow: function($el, additional_classes) {
            var css_classes = additional_classes ? additional_classes : '',
                template = '<div class="window_inner_curtain grepo_box_window sub_window ' + css_classes + '">' +
                '<div class="grepo_box no_title">' +
                (new ViewHelper())._grepo_box +
                '<div class="content js-window-content"></div>' +
                '</div>' +
                '</div>';

            $el.append(template);
        }
    };
});