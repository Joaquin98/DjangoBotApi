/* global Layout, InfoWindowFactory, GPWindowMgr */
(function() {
    'use strict';

    function WndHandlerPhoenicianSalesman(wndhandle) {
        this.wnd = wndhandle;
    }

    WndHandlerPhoenicianSalesman.inherits(window.WndHandlerDefault);

    WndHandlerPhoenicianSalesman.prototype.getDefaultWindowOptions = function() {
        return {
            maxHeight: 560,
            maxWidth: 790,
            height: 560,
            width: 790,
            resizable: false,
            yOverflowHidden: true,
            title: _('Phoenician merchant'),
            help: true
        };
    };

    /**
     * Window Initialization
     *
     * @param title String	=> window title
     * @param UIopts Object	=> Jquery UI Options for the window
     * variant => the window parameters passed to the GPWindowMgr.new() function
     *
     * @return Boolean
     **/
    WndHandlerPhoenicianSalesman.prototype.onInit = function(title, UIopts) {
        // id, name, build_name, build_controller
        this.wnd.sendMessage('loadPhoenicianSalesmanView', 'phoenician_salesman', {}, true);
        return true;
    };

    /**
     * Window Close Button Action
     * @return Boolean
     **/
    WndHandlerPhoenicianSalesman.prototype.onClose = function() {
        Layout.phoenicianSalesman.close(true); // invoked by window

        return true;
    };

    /**
     *  On receive data
     *
     */
    WndHandlerPhoenicianSalesman.prototype.onRcvData = function(data, controller, action) {
        this.wnd.setContent2(data.html);
    };

    /**
     *  On receive message
     *  @return null
     */
    WndHandlerPhoenicianSalesman.prototype.onMessage = function(message, controller) {
        switch (message) {
            case 'loadPhoenicianSalesmanView': // 1: building_controller, 2: town_id, 3: byInit
                this.wnd.requestContentGet(controller, 'index', {
                    town_id: 0
                });
                break;
        }
        return null;
    };

    WndHandlerPhoenicianSalesman.prototype.showHelp = function() {
        InfoWindowFactory.openPhoenicianSalesmanHelpInfoWindow();
    };

    GPWindowMgr.addWndType('PHOENICIANSALESMAN', null, WndHandlerPhoenicianSalesman, 1);
}());