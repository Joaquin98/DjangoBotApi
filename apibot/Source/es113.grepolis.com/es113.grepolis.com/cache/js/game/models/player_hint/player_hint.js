/* global GrepolisModel */
define('models/player_hint/player_hints', function(require) {

    /**
     * class representing one playerhint model.
     * It has a hidden state which can be queried and changed. Changes will be pushed to the backend
     *
     * @class PlayerHint
     */
    function PlayerHint() {}

    PlayerHint.urlRoot = 'PlayerHint';

    /**
     * @method getType
     * @return {string}
     */
    GrepolisModel.addAttributeReader(PlayerHint, 'type');

    /**
     * used to query the hidden state
     *
     * @method isHidden
     * @return {boolean}
     */
    PlayerHint.isHidden = function() {
        return this.get('hide');
    };

    /**
     * check if player hint is configurable by player (displayed in game settings)
     *
     * @returns {boolean}
     */
    PlayerHint.isUserConfigurable = function() {
        return this.get('is_user_configurable');
    };

    /**
     * Disables this player_hint. This will be stored in the backend
     */
    PlayerHint.disable = function() {
        return this.setHidden(true);
    };

    /**
     * Enables this player_hint. This will be stored in the backend
     *
     * @method show
     */
    PlayerHint.enable = function() {
        return this.setHidden(false);
    };

    /**
     * toggle the state
     *
     */
    PlayerHint.toggle = function() {
        return this.setHidden(!this.get('hide'));
    };

    /**
     * set the hidden state. This will be stored in the backend
     *
     * @method setHidden
     * @param {boolean} hidden
     */
    PlayerHint.setHidden = function(hidden) {
        return this.execute(
            'setHidden', {
                type: this.getType(),
                hidden: hidden
            }
        );
    };

    window.GameModels.PlayerHint = GrepolisModel.extend(PlayerHint);

    return window.GameModels.PlayerHint;
});