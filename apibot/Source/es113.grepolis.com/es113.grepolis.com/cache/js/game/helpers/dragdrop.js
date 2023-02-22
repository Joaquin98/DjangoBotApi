/* global Game, HelperBrowserEvents, us */
(function($) {
    'use strict';

    var HelperDragDrop = {

        getLimitedPosition: function(
            x, y,
            viewport_width, viewport_height,
            draggable_width, draggable_height,
            draggable_offset,
            zoom_factor,
            scale_factor
        ) {
            // Apply UI scaling to both the X/Y coordinates, as well as the edge limits
            var left_edge = 0,
                top_edge = 0,
                right_edge = (viewport_width - draggable_width * zoom_factor) * scale_factor,
                bottom_edge = (viewport_height - draggable_height * zoom_factor) * scale_factor,
                draggable_is_wider_than_viewport = viewport_width < (draggable_width),
                draggable_is_higher_than_viewport = viewport_height < (draggable_height),
                new_x = draggable_is_wider_than_viewport ?
                Math.max(Math.min(left_edge, x), right_edge) :
                (draggable_offset.left),
                new_y = draggable_is_higher_than_viewport ?
                Math.max(Math.min(top_edge, y), bottom_edge) :
                (draggable_offset.top);

            return {
                // Compensate for the scaling factor, to avoid position "jumping"
                x: new_x / scale_factor,
                y: new_y / scale_factor
            };
        },

        setTargetViewCursor: function($viewport, $targetView) {
            if ($viewport.outerWidth() > $targetView.outerWidth() && $viewport.outerHeight() > $targetView.outerHeight()) {
                $targetView.addClass('not_draggable_cursor');
            } else {
                $targetView.removeClass('not_draggable_cursor');
            }
        },

        /**
         * getDragDropEventHandler
         * given a jquery element as viewport returns a function that can be used as Event handler for mouse events
         *
         * @param {Object} $viewport
         * @param {String} namespace if given used to uniquely identifiy events e.g. mouseup.<namespace>
         * @param {function} drag_occured_callback called when the drag rellay happend and the underlying image is moved
         * @return {Function}
         */
        getDragDropEventHandler: function($viewport, namespace, drag_occured_callback, drag_stopped_callback) {

            return function(e) {

                var $delegate_target = $(e.delegateTarget),
                    $draggable_layer = $(e.currentTarget),
                    $document = $(document);

                var event_type = e.type;
                var isiOS = Game.isiOs();

                if (isiOS && event_type === 'mousedown') {
                    return;
                }

                var onMoveEventName = HelperBrowserEvents.getOnMoveEventName(namespace),
                    onStopEventName = HelperBrowserEvents.getOnStopEventName(namespace);

                //This fallback is for the case when delegate target is a 'document'
                var delegate_target_offset = $delegate_target.offset() || {
                    left: 0,
                    top: 0
                };

                var event = event_type === 'touchstart' ? e.originalEvent.touches[0] : e;

                var viewport_width = $viewport.outerWidth(),
                    viewport_height = $viewport.outerHeight(),
                    draggable_width = $draggable_layer.outerWidth(),
                    draggable_height = $draggable_layer.outerHeight(),
                    // position of draggable_layer relative to the DOCUMENT
                    draggable_offset = $draggable_layer.offset(),
                    mouse_start_x = event.clientX,
                    mouse_start_y = event.clientY;

                var transform_origin = $draggable_layer
                    .css('transformOrigin').split(' ').map(function(el) {
                        return parseInt(el, 10);
                    }),
                    transform_origin_x = (transform_origin[0] || 0),
                    transform_origin_y = (transform_origin[1] || 0);

                // if the draggable_layer has a data-attribute reflecting a zoom factor
                // take it into account when calculating the edges
                // the zoom factor is optional
                var zoom_factor = $draggable_layer.data('zoom-factor') || 1.0;
                HelperDragDrop.setTargetViewCursor($viewport, $draggable_layer);

                $document.on(onMoveEventName, function(e) {

                    var event_type = e.type,
                        event = event_type === 'touchmove' ? e.originalEvent.touches[0] : e,
                        x = draggable_offset.left - delegate_target_offset.left + (event.clientX - mouse_start_x),
                        y = draggable_offset.top - delegate_target_offset.top + (event.clientY - mouse_start_y);

                    us.once($draggable_layer.addClass('dragging'));

                    var pos = HelperDragDrop.getLimitedPosition(
                        x,
                        y,
                        viewport_width,
                        viewport_height,
                        draggable_width,
                        draggable_height,
                        draggable_offset,
                        zoom_factor,
                        Game.ui_scale ? Game.ui_scale.factor : 1
                    );

                    // x and y are <= 0
                    $draggable_layer.css({
                        translate: [
                            Math.round(pos.x - transform_origin_x * (1 - zoom_factor)),
                            Math.round(pos.y - transform_origin_y * (1 - zoom_factor))
                        ]
                    });

                    if (drag_occured_callback) {
                        drag_occured_callback(event);
                    }

                });

                $document.on(onStopEventName, function(e) {
                    $draggable_layer.removeClass('dragging');
                    $document.off(onMoveEventName);

                    if (drag_stopped_callback) {
                        drag_stopped_callback();
                    }
                }.bind(this));

                if (!Game.isHybridApp()) {
                    e.preventDefault();
                }
            };
        }
    };

    window.HelperDragDrop = HelperDragDrop;
}(jQuery));