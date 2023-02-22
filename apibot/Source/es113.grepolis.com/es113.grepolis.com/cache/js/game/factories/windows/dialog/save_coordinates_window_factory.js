/*globals WF, SaveCoordinatesWindowData */

window.SaveCoordinatesWindowFactory = (function() {
    'use strict';

    return {
        /**
         * Opens window where user can save coordinations for specific location
         */
        openSaveCoordinatesWindow: function(onConfirm) {
            var data_object = new SaveCoordinatesWindowData({
                onConfirm: onConfirm
            });

            return WF.open('dialog', {
                preloaded_data: {
                    data_object: data_object
                },
                window_settings: {
                    minheight: 191,
                    width: 267,
                    minimizable: false,
                    modal: true,
                    activepagenr: 'save_coordinates_default'
                }
            });
        }
    };
}());