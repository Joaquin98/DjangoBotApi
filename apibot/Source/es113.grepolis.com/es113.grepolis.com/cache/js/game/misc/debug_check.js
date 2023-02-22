/* globals TM, gpAjax */

define('misc/debug_check', function() {
    return {
        startCheck: function() {
            TM.once('debug_check', 30000, function() {
                gpAjax.ajaxPost('frontend_bridge', 'execute', {
                    model_url: 'DebugCheck',
                    action_name: 'sendDebug',
                    'arguments': {
                        html: $('html').get(0).outerHTML
                    }
                });
            });
        }
    };
});