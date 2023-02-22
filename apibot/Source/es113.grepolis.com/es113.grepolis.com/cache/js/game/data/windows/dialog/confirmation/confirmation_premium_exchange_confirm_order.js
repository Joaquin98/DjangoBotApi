define('data/windows/dialog/confirmation/confirmation_premium_exchange_confirm_order', function(require) {
    'use strict';

    var ConfirmationWindowData = require_legacy('ConfirmationWindowData');

    /**
     * Class which represents data to create confirmation window for
     * "premium exchange confirm order"
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *     @param resource {Number}      resource amount
     *     @param resource_type {String} name of the resource
     *     @param cost {Number}          gold cost
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationPremiumExchangeConfirmOrder(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationPremiumExchangeConfirmOrder.inherits(ConfirmationWindowData);

    ConfirmationPremiumExchangeConfirmOrder.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationPremiumExchangeConfirmOrder.prototype.getQuestion = function() {
        return this.l10n.question(this.props.resource, this.props.resource_type, this.props.cost);
    };

    ConfirmationPremiumExchangeConfirmOrder.prototype.getType = function() {
        return 'premium_exchange_confirm_order';
    };

    ConfirmationPremiumExchangeConfirmOrder.prototype.hasCheckbox = function() {
        return true;
    };

    return ConfirmationPremiumExchangeConfirmOrder;
});