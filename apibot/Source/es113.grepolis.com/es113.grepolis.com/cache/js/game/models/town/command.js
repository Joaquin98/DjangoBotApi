(function() {
    "use strict";

    var Command = function() {};

    Command.urlRoot = 'Command';

    /**
     * Returns id of the 'favorite'
     *
     * @return {Number}
     */
    Command.getId = function() {
        return this.get('id');
    };

    /**
     * cancel this command
     *
     * @returns {void}
     */
    Command.cancel = function() {
        var params = {
            id: this.getId()
        };

        this.execute('cancelCommand', params);
    };

    window.GameModels.Command = GrepolisModel.extend(Command);
}());