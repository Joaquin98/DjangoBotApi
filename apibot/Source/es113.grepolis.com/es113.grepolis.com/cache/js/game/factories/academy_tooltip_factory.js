/*globals DM, Game, ITowns, DateHelper, GameDataResearches, s, GameData, _, Timestamp */

(function() {
    'use strict';

    var l10n = DM.getl10n('tooltips', 'academy');

    function getIcon(icon_id) {
        return '<img src="' + Game.img() + '/game/res/' + (icon_id === 'population' ? 'pop' : icon_id) + '.png" alt="' + l10n[icon_id] + '" />';
    }

    function getDescriptionInfo(research) {
        return '<p style="width: 320px;">' + research.description + '</p>';
    }

    function getResourcesForResearches(research, current_academy_level) {
        var needed_resources = GameDataResearches.getResearchCosts(research);

        return {
            wood: {
                amount: Math.floor(needed_resources.wood, 10)
            },
            stone: {
                amount: Math.floor(needed_resources.stone, 10)
            },
            iron: {
                amount: Math.floor(needed_resources.iron, 10)
            },
            research_points: {
                amount: research.research_points
            },
            time: {
                amount: GameDataResearches.getResearchTime(research, current_academy_level)
            }
        };
    }

    /**
     * Returns resources which are needed to build specific building
     *
     * @param {Object} research
     * @param {Integer} current_academy_level
     * @param {Integer} available_research_points
     * @return {Object}
     */
    function getNeededResourcesInfoForAcademy(research, current_academy_level, available_research_points) {
        var result = '',
            options = {},
            itown = ITowns.getTown(Game.townId),
            resources = itown.resources(),
            current_production = itown.getProduction(),
            time_to_build = 0,
            enough_points = true,
            enough_resources = true,
            upgrade_not_possible = options.upgrade_not_possible || false,
            requirements = getResourcesForResearches(research, current_academy_level);

        var req_id, requirement, time;

        for (req_id in requirements) {
            if (requirements.hasOwnProperty(req_id)) {
                requirement = requirements[req_id];

                result += getIcon(req_id);

                if (req_id === 'research_points' && requirement.amount > available_research_points) {
                    upgrade_not_possible = true;
                    enough_points = false;
                }
                if (requirement.amount > resources[req_id]) {
                    upgrade_not_possible = true;

                    if (req_id !== 'time' && req_id !== 'research_points') {
                        enough_resources = false;
                        if (current_production[req_id] > 0) {
                            time = parseInt(3600 * parseFloat((requirement.amount - resources[req_id]) / current_production[req_id]), 10);
                            if (time_to_build < time && time > 0) {
                                time_to_build = time;
                            }
                        }

                    }
                }

                if (req_id === 'time') {
                    requirement.amount = DateHelper.readableSeconds(requirement.amount);
                }

                result += '<span' + ((requirement.amount > resources[req_id]) || (req_id === 'research_points' && enough_points === false) ? ' style="color:#B00"' : '') + '>' + requirement.amount + '</span>';
            }
        }

        return {
            result: result,
            upgrade_not_possible: upgrade_not_possible,
            enough_resources: enough_resources,
            time_to_build: time_to_build
        };
    }

    var AcademyTooltipFactory = {
        getResearchTooltip: function(research, current_academy_level, available_research_points, is_researched, in_progress, full_queue) {
            var result = '';

            result += '<div class="academy_popup">';
            result += '<h4>' + research.name + '</h4>';
            result += getDescriptionInfo(research);

            if (is_researched) {
                result += '<h5>' + l10n.already_researched + '</h5>';
            } else if (in_progress) {
                result += '<h5>' + l10n.in_progress + '</h5>';
            } else {
                //Get info about needed resources
                var res_info = getNeededResourcesInfoForAcademy(research, current_academy_level, available_research_points);

                result += res_info.result + '<br/>';

                var research_dependencies = research.building_dependencies;
                if (current_academy_level < research_dependencies.academy) {
                    result += '<h5>' + l10n.building_dependencies + '</h5>';
                    result += '<span class="requirement">' + GameData.buildings.academy.name + ' ' + _('Level') + ' ' + research_dependencies.academy + '</span><br />';
                }

                if (!res_info.enough_resources) {
                    result += '<span class="requirement">' +
                        l10n.not_enough_resources + '</span><br />' +
                        '<span class="requirement">' +
                        s(l10n.enough_resources_in, DateHelper.formatDateTimeNice(Timestamp.server() +
                            res_info.time_to_build, false)) +
                        '</span><br />';
                }

                if (full_queue) {
                    result += '<span class="requirement">' + l10n.full_queue + '</span><br />';
                }
            }

            result += '</div>';

            return result;
        },

        getRevertTooltip: function(research, culture_points) {
            var popup_text = '<h4>' + _('Reset the research') + '</h4>';
            popup_text += '<p>' + _('You can reset a research for one culture point. <br/> You can generate culture points at the Agora.') + '<br/>';
            popup_text += l10n.culture_points_text(culture_points);
            popup_text += '<p>' + _('Reimbursement:') + ' ' + research.research_points + '<img src="' + Game.img() + '/game/res/research_points.png" alt="' + _('Research points') + '" />';

            return popup_text;
        }
    };

    window.AcademyTooltipFactory = AcademyTooltipFactory;
}());