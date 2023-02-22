/* globals GameEvents */

/**
 * Takes a DOM element and animates it to the inventory
 *
 */

define('helpers/animate_to_inventory', function() {
    'use strict';

    var TRANSITION_DURATION_MS = 2000;

    function _getInventory() {
        return $('#ui_box .toolbar_button.inventory');
    }


    function toInventory(el) {
        var $original = $(el),
            $clone = $original.clone(),
            $inventory = _getInventory(),
            inventory_offset = $inventory.offset(),
            original_offset = $original.offset(),
            $animation_layer = $('#reward_animations_layer');

        $clone.css({
            width: $original.width(),
            height: $original.height(),
            position: 'absolute',
            top: original_offset.top,
            left: original_offset.left,
            'z-index': 3000,
            'will-change': 'transform, scale'
        });

        $animation_layer.append($clone);
        //$original.css({ visibility: 'hidden'});

        // measure
        var x_scale = $inventory.width() / $original.width(),
            y_scale = $inventory.height() / $original.height(),
            x = inventory_offset.left - original_offset.left - $inventory.width() / 2,
            y = inventory_offset.top - original_offset.top - $inventory.height() / 2;

        // animate
        $clone.transition({
            translate: [x + 'px', y + 'px'],
            scale: [x_scale.toString(), y_scale.toString()],
            ease: 'linear',
            complete: function() {
                $clone.remove();
                $.Observer(GameEvents.window.inventory.item_added).publish({});
            }
        }, TRANSITION_DURATION_MS);

    }

    return toInventory;
});