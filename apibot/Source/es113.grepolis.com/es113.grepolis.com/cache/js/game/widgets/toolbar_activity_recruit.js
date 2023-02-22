/* global GameEvents */

(function($) {
    'use strict';

    $.fn.toolbarActivityRecruits = function(params) {
        var settings = $.extend({
            templates: [],
            caption: 0,
            state: false,
            l10n: {},
            options: [],
            cm_context: {},
            destroy_function: null,
            queue_controllers: [],
            premium_mode_class: null
        }, params);

        var $el = $(this);

        var widget, controllers = [];

        /**
         * if we have cached controllers, destroy them
         */
        var destroyControllers = function() {
            for (var i = 0, l = controllers.length; i < l; i++) {
                var controller = controllers[i].controller;

                settings.destroy_function(controller);
            }
            controllers = [];
        };

        /**
         * for every controller we got, find out how many open
         * recruitings are there and create a has out of it
         * the hash is used in the template to show/hide the correct containers
         */
        var updateQueueCounts = function() {
            var options = {};

            for (var i = 0, l = settings.queue_controllers.length; i < l; i++) {
                var name = settings.queue_controllers[i].name;

                options[name] = settings.queue_length_function(name);
            }
            return options;
        };

        /**
         * read the settings.queue_controllers object and create all
         * controllers listed there, and cache them in the controllers variable
         */
        var renderQueueControllers = function($list) {
            for (var i = 0, l = settings.queue_controllers.length; i < l; i++) {
                var name = settings.queue_controllers[i].name,
                    getter = settings.queue_controllers[i].getter;

                var controller = getter($list.find('.content .' + name));
                controllers.push({
                    name: name,
                    controller: controller
                });
                controller.renderPage();
            }
        };

        var registerEventListeners = function(_dd, $list) {
            $.Observer(GameEvents.town.town_switch).subscribe(['toolbar_activities_recuit'], function(e, data) {
                render(_dd, $list);
            });
        };

        var unregisterEventListeners = function() {
            $.Observer(GameEvents.town.town_switch).unsubscribe(['toolbar_activities_recuit']);
        };

        var render = function(_dd, $list) {
            unregisterEventListeners();
            // make sure we have destroyed and unregisterd all components before re-creation
            destroyControllers();

            // setOptions also re-renders the dropDown, so all HTML containers are available
            _dd.setOptions([updateQueueCounts(), settings.premium_mode_class]);

            // re-render the queue to the container objects
            renderQueueControllers($list);

            _dd.updateDropDownListSize();

            registerEventListeners(_dd, $list);

            // hide the dropdown when instant buy tooltip hides (only on this container chain)
            $list.off('ibt:destroy').on('ibt:destroy', function(e, $el, $target) {
                if ($target && !$.contains($list[0], $target[0]) && $target[0] !== $list[0]) {
                    _dd.hide();
                }
            });
        };

        this.setCaption = function(value) {
            widget.setCaption(value);
        };

        this.setState = function(value) {
            widget.setState(value);
        };

        this.updateDropDownListSize = function() {
            widget.updateDropDownListSize();
        };

        /**
         * Clears up stuff before component will be removed
         */
        this.destroy = function() {
            settings.model.off(null, null, this);

            widget.off('wgtta:list:hide');
            widget.off('wgtta:btn:click:odd.wgtta');
            widget.off('wgtta:btn:click:even.wgtta');

            destroyControllers();
        };

        //Initialize
        (function() {
            widget = $el.toolbarActivity({
                template: settings.templates,
                state: settings.state,
                caption: settings.caption,
                options: [updateQueueCounts(), settings.premium_mode_class],
                l10n: settings.l10n,
                exclude_click_nodes_for_hide: ['js-item-btn-premium-action', 'js-caption']
            });

            widget.on('wgtta:list:show', function(e, $list, _dd) {
                render(_dd, $list);
            });

            widget.on('wgtta:list:hide', function(e, $list, _dd) {
                //intentionally do nothing
            });
        }());

        return this;
    };
}(jQuery));