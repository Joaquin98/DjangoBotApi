/*globals ConfirmationWindowData */

(function() {
    'use strict';

    function ConfirmationSimpleData(props) {
        // make onCancel optional
        props.onCancel = props.onCancel || {};
        this.props = props;
        ConfirmationWindowData.prototype.constructor.apply(this, arguments);
        this.title = props.title;
        this.question = props.question;
    }

    ConfirmationSimpleData.inherits(ConfirmationWindowData);

    ConfirmationSimpleData.prototype.getTitle = function() {
        return this.title;
    };

    ConfirmationSimpleData.prototype.getQuestion = function() {
        return this.question;
    };


    window.ConfirmationSimpleData = ConfirmationSimpleData;
}());