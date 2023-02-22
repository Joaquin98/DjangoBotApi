/* global define */
/**
 * link "handler / fixer" for iOS:
 * - prevents opening href="#(…)" links in safari.app if game runs as a fulscreen app
 * - rewrites inline JS (href="javascript: (…)" to a separate "click" event
 */
define('mobile/ios', function() {
    'use strict';

    return {
        setupLinkHandleriOs: function() {
            $(document.body).on('touchstart', 'a:not(.fixediOsLink)', function(e) {
                var tmp = false,
                    $this = $(this),
                    that = this;
                if ($this.is('[class^="gp_"]')) {
                    return that;
                } else if ($this.attr('href') === '#forum' || $this.attr('href') === '#help') {
                    $this.attr('href', $this.attr('js-data')).addClass('fixediOsLink');
                } else if ($this.attr('onclick')) {
                    tmp = $this.attr('onclick');
                    $this.removeAttr('onclick').on('click', function(event) {
                        event.preventDefault();
                        new Function(tmp).call(that); // jshint ignore:line
                    }).addClass('fixediOsLink').attr('href', '#');
                } else if ($this.is('[href^="javas"]')) {
                    tmp = /^(?:javascript\:)?(.*?)(?:void|$)/.exec($this.attr('href'))[1];
                    if (tmp) {
                        $this.on('click', function(event) {
                            event.preventDefault();
                            new Function(tmp).call(that); // jshint ignore:line
                        }).addClass('fixediOsLink').attr('href', '#');
                    } else {
                        $this.on('click', function(event) {
                            event.preventDefault();
                        }).addClass('fixediOsLink').attr('href', '#');
                    }
                } else {
                    $this.on('click', function(event) {
                        event.preventDefault();
                    }).addClass('fixediOsLink');
                }
            });
        }
    };
});