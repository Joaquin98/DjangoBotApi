/* global submit_form_light */
(function() {
    'use strict';

    var OPTS = {
        revenge: 'revenge',
        alliance: 'alliance',
        new_world: 'new_world'
    };

    var chooseDirection = {
        _showDirectionChooser: function() {
            $('.direction_chooser').show();
            $('.defeat_chooser').hide();
            $('.choose_bg_block').hide();
        },
        _showDefeatChooser: function() {
            $('.defeat_chooser').show();
            $('.choose_bg_block').show();
            $('.direction_chooser').hide();
        },

        _submitForAlliance: function() {
            $('div#start_compass input[checked]').prop('checked', false);
            $('div#start_compass input#direction_ally').prop('checked', true);
            submit_form_light('choose_direction');
        },

        _gotoSelectWorldPage: function() {
            window.location = this.data.master_url + '/start/index?action=select_new_world';
        },

        _initializeOptions: function() {
            var options = [];

            options.push({
                value: OPTS.revenge,
                name: this.data.opt_1
            });

            if (this.data.has_alliance) {
                options.push({
                    value: OPTS.alliance,
                    name: this.data.opt_2
                });
            }

            options.push({
                value: OPTS.new_world,
                name: this.data.opt_3
            });
            return options;
        },

        _buttonClickEvent: function() {
            var value = this.rb_revenge.getValue();

            switch (value) {
                case OPTS.revenge:
                    this._showDirectionChooser();
                    break;
                case OPTS.alliance:
                    this._submitForAlliance();
                    break;
                case OPTS.new_world:
                    this._gotoSelectWorldPage();
                    break;
                default:
                    break;
            }
        },

        _hideReward: function() {
            $('#choose_direction .textblock.reward').hide();
            $('#choose_direction .reward_container').hide();
        },

        init: function(data) {
            this.data = data;

            var options = this._initializeOptions();

            this.rb_revenge = $('#choose_direction .rb_revenge').radiobutton({
                value: 'revenge',
                template: 'tpl_radiobutton',
                options: options
            });

            $('#choose_direction .btn_restart').on('click', this._buttonClickEvent.bind(this));

            $('#choose_direction .reward_container>div').on('hover', function() {
                $('.reward_popup').toggle();
                $('#popup_div').toggle();
            });

            if (!data.show_reward) {
                this._hideReward();
            }

            if (data.is_game_over) {
                this._showDefeatChooser();
            } else {
                this._showDirectionChooser();
            }
        }
    };

    window.chooseDirection = chooseDirection;
}());