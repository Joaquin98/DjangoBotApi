/**
 * configure logging or errors
 * sentry automatically redirects all uncaught exceptions via window.onerror
 *
 * this is based on Game.sentry and Game.dev
 *
 * Rules:
 * 	-> if Game_dev -> no sentry and no redirection, logging everything on the console
 * 	-> if !Game_dev and market XX, XA -> internal beta, zz -> beta, live markets -> live
 */
(function(Raven, Game) {
    // safety checks, we are pretty early in the loading process
    if (!Raven || !Raven.config || !Game || !Game.sentry || !Game.sentry.enabled || !Game.sentry.dsn) {
        return;
    }

    // DEV machines are treated like market XX, but directly log to console
    if (Game.dev) {
        Game.sentry.enabled = false;
        return;
    }

    Raven.config(Game.sentry.dsn, {
        tags: {
            world: Game.world_id,
            market: Game.market_id
        },
        ignoreErrors: [
            'RepConv' // Report Converter user extension
        ],
        ignoreUrls: [
            // Chrome extensions
            /extensions\//i,
            /^chrome:\/\//i,
            // known user script URLs
            /grmh\.pl/i,

        ]
    }).install();

    // Game.version.branch is either the current branch (in dev) or a version number (e.g. '2.123.2')
    // slashes are not supported so we replace them with minus
    Raven.setRelease(Game.version.branch.replace('/', '-'));

    Raven.setUserContext({
        id: Game.player_id,
        name: Game.player_name,
        market: Game.market_id
    });

    // Pre-charge every sentry call with some nice meta data

    var configuration = {
        is_admin_login: Game.admin || Game.is_admin_mode_with_premium,
        is_dev: Game.dev,
        market_id: Game.market_id,
        player_id: Game.player_id,
        current_town_id: Game.townId,
        world_id: Game.world_id,
        is_premium_user: Game.premium_user,
        maintenance: 'no',
        git_commit: Game.version.revision
    };
    Raven.setExtraContext(configuration);
}(window.Raven, window.Game));