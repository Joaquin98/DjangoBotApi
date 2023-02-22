/* globals GPWindowMgr */

(function() {
    'use strict';

    function WndHandlerPublishReport(wndhandle) {
        this.wnd = wndhandle;
    }

    WndHandlerPublishReport.inherits(window.WndHandlerDefault);

    WndHandlerPublishReport.prototype.getDefaultWindowOptions = function() {
        return {
            height: 350,
            width: 400,
            resizable: false,
            title: 'Untitled Window'
        };
    };

    /**
     * Window Initialitation
     *
     * Parameters:
     *	title 	=> window title
     *  UIopts 	=> Jquery UI Options for the window
     *  content => window html content
     * 	variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * Returns:
     * 	boolean, false would abort window creation.
     **/
    WndHandlerPublishReport.prototype.onInit = function(title, UIopts, content) {
        var index_controller = 'report';

        if (content) {
            this.wnd.setContent2(content);
        } else {
            this.wnd.requestContentGet(index_controller, 'publish_report_dialog', UIopts);
        }

        return true;
    };

    WndHandlerPublishReport.prototype.onRcvData = function(data) {
        this.wnd.setContent2(data.html);
        this.bindCheckboxes();
    };

    WndHandlerPublishReport.prototype.bindCheckboxes = function() {
        var root = this.wnd.getJQElement();

        // add click event to 'show all' checkbox
        root.find('#publish_report_show_all').on("click", function(evt) {
            root.find('#publish_report_options input').prop('checked', $(evt.target).prop('checked'));
        });
        // add click event to all other checkboxes to reset the 'show all' checkbox
        root.find('#publish_report_options input').on("click", function(evt) {
            root.find('#publish_report_show_all').prop('checked', false);
        });
    };

    WndHandlerPublishReport.prototype.unpublishReport = function() {
        // collect params from form
        var params = {};
        $('#publish_report_dialog_form input[type="hidden"]').each(function(idx, elm) {
            params[elm.name] = $(elm).val();
        });

        // send ajax request
        this.wnd.ajaxRequestPost('report', 'unpublish_report', params, function(_wnd, data) {
            _wnd.close();
        }, {});

        return false;
    };

    GPWindowMgr.addWndType('PUBLISH_REPORT', null, WndHandlerPublishReport, 1);
}());