/**
 * enum represents all states a farm town can have:
 *  * no player relation - farm town is locked
 *  * owned - farm is owned by the player
 *  * revolt - farm is owned but currenty under revolt (old system only)
 */
define('enums/farm_town_states', function() {
    return {
        LOCKED: 'locked',
        OWNED: 'owned',
        REVOLT: 'revolt'
    };
});