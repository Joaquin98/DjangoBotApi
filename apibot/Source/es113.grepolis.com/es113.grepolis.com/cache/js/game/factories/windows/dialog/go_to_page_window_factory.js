/*globals WF, GoToPageWindowData */

window.GoToPageWindowFactory = (function() {
    "use strict";

    return {
        _openGoToPageWindow: function(data_object) {
            if (!(data_object instanceof GoToPageWindowData)) {
                throw "To run openGoToPageWindow you need to pass object which is instance of GoToPageWindowData";
            }

            return WF.open('dialog', {
                preloaded_data: {
                    data_object: data_object
                },
                window_settings: {
                    minheight: 126,
                    width: 231,
                    minimizable: true,
                    modal: true,
                    activepagenr: 'go_to_page_default'
                }
            });
        },

        /**
         * Opens a window which allows use to set a specific page number in pager
         */
        openPagerGoToPageWindow: function(objPager, activepagenr, number_of_pages) {
            this.openGoToPageWindow(activepagenr, number_of_pages, function(page_nr) {
                objPager.setActivePage(page_nr - 1);
            });
        },

        openGoToPageWindow: function(activepagenr, number_of_pages, on_confirm) {
            this._openGoToPageWindow(new GoToPageWindowData({
                activepagenr: activepagenr,
                number_of_pages: number_of_pages,
                onConfirm: on_confirm
            }));
        }
    };
}());