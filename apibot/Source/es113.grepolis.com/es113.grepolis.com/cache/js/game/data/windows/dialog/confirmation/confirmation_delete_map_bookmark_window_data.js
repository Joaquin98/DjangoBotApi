/*globals ConfirmationWindowData */

(function() {
    "use strict";

    /**
     * Class which represents data in confirmation dialog
     * window
     *
     * @param props {Object}
     *     @param onConfirm {Function}   confirmation button callback
     *     @param onCancel {Function}    cancel button callback
     *
     * @see ConfirmationWindowData class for details about all methods
     */
    function ConfirmationDeleteMapBookmarkWindowData(props) {
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
    }

    ConfirmationDeleteMapBookmarkWindowData.inherits(ConfirmationWindowData);

    ConfirmationDeleteMapBookmarkWindowData.prototype.getTitle = function() {
        return this.l10n.window_title;
    };

    ConfirmationDeleteMapBookmarkWindowData.prototype.getQuestion = function() {
        return this.l10n.question(this.props.bookmark_name);
    };

    ConfirmationDeleteMapBookmarkWindowData.prototype.getType = function() {
        return 'delete_map_bookmark';
    };

    window.ConfirmationDeleteMapBookmarkWindowData = ConfirmationDeleteMapBookmarkWindowData;
}());