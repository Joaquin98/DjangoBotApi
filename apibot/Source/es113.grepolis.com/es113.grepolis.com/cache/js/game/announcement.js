(function() {
    'use strict';

    var Announcements = {
        toggle: function(id) {
            $('#announcement_list .announcement_' + id).toggle();
        }
    };

    window.Announcements = Announcements;
}());