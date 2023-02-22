/*globals _, DM */
(function() {
    "use strict";

    DM.loadData({
        l10n: {
            dialog_info: {
                info_create_first_town_group: {
                    title: _("Game tip"),
                    descr: _("You have now created your first city group. Click on the city group's name to select it. Use drag&drop to add new cities to the group. As soon as you have activated a group, only cities in this group will be shown in the overview.<br />You can also manage your city groups outside of the overview by clicking on the city name in the top-center of the screen. In order to see all cities in the overview again, the active group must be deselected.")
                },

                info_all_towns_in_one_group: {
                    title: _("Information"),
                    descr: _("You have currently arranged all your cities into one city group. If you receive new cities, they will not appear in the overview or the city list. To display the new city in the overviews, you can either add it to the group manually or deselect the active group.")
                },

                info_attack_planner_help: {
                    title: _("Attack planner - Information"),
                    message_1: (function() {
                        return s(_("You can create new plans under %1New plan%2."), "<b>", "</b>");
                    }()),
                    message_2: (function() {
                        return s(_("%1Tip:%2 It's a good idea to create plans with appropriate names and descriptions to give you a clear overview of your battle strategies."), "<b>", "</b>");
                    }()),
                    list: [
                        _('You can add as many targets as you wish to each plan.'),
                        _('You can add as many attacks as you wish to each target.'),
                        _('All the necessary travel times are displayed when you create and manage attacks.'),
                        _('You will be notified of impending attacks.'),
                        _('Share your plans with other players and alliances. (The plans are only visible to players with a captain)'),
                        _('You can start your planned attacks directly from the plan.'),
                        _('Open the travel time overview by tapping on the button "Plan" in the attack and support window.')
                    ],
                    message_3: (function() {
                        return s(_('The %1 travel time overview %2 provides you with a list of all your cities sorted by travel time. You can also reduce the number of cities displayed by using city group selection or by using the search field to filter by city name.'), '<b>', '</b>');
                    }()),
                    message_4: _('The overview only displays those units with at least one unit in the displayed cities. Clicking on the unit image will sort the overview according to the number of units of that type. Clicking on the X icon in the upper-right corner of the unit image will remove that type of unit from the overview. The button "Show all units" will display all removed units in the overview again.'),
                    message_5: _('The button "Units in transit" includes all units currently beyond the city walls. The button "Units in planned attacks" lets you hide those units currently included in other future planned attacks.'),
                    message_6: _('Entering a number in the input field beneath the unit images displays a list of those cities with that number or more units stationed in them.'),
                    message_7: _('Clicking on a unit number in a city opens a form in which you can add the desired units to an attack. You can also select the attack time and change the plan that this attack belongs to. Clicking on the background area of a city name closes the form again.'),
                    message_8: (function() {
                        return s(_('%1 Attacks %2 provides you with an overview of all the attacks that you or your allies have planned. You can also sort them by the arrival or departure of your troops, as well as by city name.'), '<b>', '</b>');
                    }())
                },

                info_mass_recruit_help: {
                    title: _("Recruitment overview information"),
                    descr: _("In this overview you can simultaneously recruit new units in any number of cities with just a few clicks.<br /><br />Define what you want your army to look like in the upper input fields. The system always tries to recruit as many units as possible until your entered values are reached.<br /><br />You can determine how many resources and free resident spaces you still want to have after the recruitment.<br /><br />To take full advantage of this overview, you should divide your cities into city groups. This way you can have different units recruited in each city group.<br /><br />You can switch city groups with the first drop-down on the top left.<br /><br /><b>Keep in mind:</b> In the top input fields, don't enter how many units should be recruited per application but how many units you would like in the city at the end.<br /><br /><b>Tip:</b> Press the shift button on your keyboard to skip entering the values in the city list. Then the units will be recruited directly.")
                },

                info_cap_of_invisibility_not_possible_help: {
                    title: _("Spell not possible"),
                    descr: _("Your troops have travelled too far already.<br>They can't be affected by this spell anymore.<br>You can no longer cast this spell."),
                },

                info_phoenician_salesman_help: {
                    title_1: _("Phoenician merchant"),
                    title_2: _("Information"),
                    descr_1: _("The Phoenician merchant offers you: units in exchange for silver coins, and resources in exchange for other resources."),
                    descr_2: _("While the merchant always offers the same amount of unit types, the amount of offered resources depends on the level of your harbor.")
                }
            }
        } // l10n
    });
}());