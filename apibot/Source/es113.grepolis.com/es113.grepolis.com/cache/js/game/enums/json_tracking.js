/**
 * Matches the definition ids defined by anayltics schemas: https://analytics.innogames.de/schema/grepo-backend
 */
define('enums/json_tracking', function() {
    return {
        EVENT_SCREEN: 'event-screen',
        CRM_RESPONSE: 'crm-response',
        WINDOW_POPUP: 'popup',
        SHOP_OPEN: 'shop-open',
        SHOP_CLOSE: 'shop-close',
        SHOP_ERROR: 'shop-error'
    };
});