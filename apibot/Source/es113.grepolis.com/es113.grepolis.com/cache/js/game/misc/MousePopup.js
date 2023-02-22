/* global Game */

(function() {
    'use strict';

    var TOOLTIP_DELAY_MS = 250;
    var TOOLTIP_DELAY_MS_TAPHOLD = 0;

    var _tooltip_delay;
    var _delay_timer_id = 0;

    /**
     * Call a function only after a certain delay.
     * @param callback function to call
     */
    var delay = function(callback) {
            clearDelay();
            _delay_timer_id = setTimeout(callback, _tooltip_delay);
        },
        clearDelay = function() {
            clearTimeout(_delay_timer_id);
        };

    /**
     * Extends jQuery with the function named 'mousePopup'.
     *
     */
    jQuery.fn.extend({
        /**
         * Binds the MousePopup 'popup' to the current jQuery object
         * (most likely a HtmlObject wrapped with jQuery functions).
         */
        mousePopup: function(popup) {
            popup.bindTo(this);
            return this;
        }
    });

    /**
     * Class MousePopups
     *
     * Creates a popup that follows the mouse pointer and positions itself to fit into the viewport.
     *
     */
    var MousePopup = function() {
        this.initialize.apply(this, arguments);
    };

    var $document = $(document),
        $window = $(window);

    var s_x, s_y, v_x, v_y;

    jQuery.extend(MousePopup.prototype, {
        element: null,
        popup_wrapper: null,
        is_mobile: Game.isMobileBrowser(),

        /**
         * set this.xthml based on what we get,
         * keeps a reference to the original string, to avoid garbage collection
         */
        setTooltipContent: function(xhtml) {
            if (typeof xhtml === 'function') {
                this.xhtml = xhtml.call();
            } else {
                this.xhtml = xhtml;
            }

            // convert everything we get to jquery objects here
            // see GP-16629
            if (typeof this.xhtml === 'string') {
                this.original_xhtml = this.xhtml;
                this.xhtml = $('<div>').html(this.xhtml);
            }
        },

        /**
         * Initializes this instance
         *
         * @param String xhtml Content
         * @param Object styles Specific styles
         */
        initialize: function(xhtml, styles, no_frame_arg) {
            var that = this,
                no_frame = no_frame_arg || false;

            if (typeof xhtml === 'undefined') {
                return;
            }

            this.setTooltipContent(xhtml);

            this.styles = styles || {};
            this.popup_wrapper = document.getElementById('popup_div');
            this.no_frame = no_frame;

            if (this.is_mobile) {
                $('#popup_div_curtain').on('click', this.handlerOut.bind(this));
            }

            if (this.popup_wrapper) {
                $(this.popup_wrapper).off().on('mouseover', function(e) {
                    that.handlerMove(e);
                });
            }

            // distances scroll - is mostly 0
            s_x = $document.scrollLeft();
            s_y = $document.scrollTop();
            // dimension of visible website area (size of window without chrome)
            v_x = $window.innerWidth();
            v_y = $window.innerHeight();
        },

        /**
         * Calculates the position of the div element containing the popup content.
         *
         * @return object with top and left (e.g. {top: '50px', left: '30px'})
         */
        position: function() {
            var $popup_wrapper = $(this.popup_wrapper),
                $popup_wrapper_middle = $popup_wrapper.find('#popup_content'),
                scale_factor = Game.ui_scale.normalize.factor;

            $popup_wrapper_middle.width('auto');

            var p_x = this.cur_x * scale_factor,
                p_y = this.cur_y * scale_factor,

                // offset of popup to mouse pointer
                o_x = 10,
                o_y = 10,
                // dimension of popup
                pp_w = Math.max($popup_wrapper.outerWidth(), $popup_wrapper_middle.outerWidth(true)),
                pp_h = $popup_wrapper.outerHeight(),
                result = {
                    left: 0,
                    top: 0
                };

            // the window may resize during the lifetime of the tooltip, so we need to be current and can not rely on cached values
            v_x = $window.innerWidth();
            v_y = $window.innerHeight();

            // E.g. translated: 'if mouse left + popup width + offset is greater than horizontal space in window, than..'
            if ((p_x + pp_w + o_x) > v_x) {
                // position should be left/atop of mouse pointer
                p_x = p_x - pp_w - o_x + s_x;
            } else {
                // position should be right/beneath of mouse pointer
                p_x = p_x + o_x + s_x;
            }
            if ((p_y + pp_h + o_y) > v_y) {
                // position should be left/atop of mouse pointer
                p_y = p_y - pp_h - o_y + s_y;
            } else {
                // position should be right/beneath of mouse pointer
                p_y = p_y + o_y + s_y;
            }

            result.left = Math.max(p_x, s_x);
            result.top = Math.max(p_y, s_y);

            // use Math.max to stay within viewport
            return result;
        },
        p_x: 0,
        p_y: 0,
        /**
         * move handler, moves mousepopup
         *
         * @param Event ev
         */
        handlerMove: function(ev, data) {
            if (window.keep_tooltips_visible) {
                return;
            }

            if (ev.type === 'taphold') {
                this.cur_x = ev.pageX;
                this.cur_y = ev.pageY;
            } else {
                this.cur_x = ev.clientX;
                this.cur_y = ev.clientY;
            }

            //For example menu is initialized that early, so 'popup_div' can not be taken from the BODY
            //we need to try once again
            if (!this.popup_wrapper) {
                this.popup_wrapper = document.getElementById('popup_div');
            }

            var p = this.popup_wrapper,
                pos = this.position();

            p.style.left = pos.left + 'px';
            p.style.top = pos.top + 'px';
        },

        /**
         * over handler, show mousepopup after delay
         *
         * @param Event ev
         */
        handlerOver: function(ev, phase, $target, data) {
            this.showDiv();
            this.handlerMove(ev, data);
        },

        /**
         * Out handler, hide mousepopup and disable show timer.
         * Internet Explorer may not use fade effect for popup,
         * because the transparent PNGs become black when changing
         * opacity value.
         *
         */
        handlerOut: function() {
            if (window.keep_tooltips_visible) {
                return;
            }

            clearDelay();
            $('#popup_div')
                .stop(true, true)
                .animate({
                    'opacity': '0'
                }, {
                    'duration': 250,
                    'complete': this.onOutAnimationComplete.bind(this)
                });

            if (this.is_mobile) {
                $('#popup_div_curtain').css({
                    position: 'static',
                    top: 'auto',
                    bottom: 'auto',
                    left: 'auto',
                    right: 'auto',
                    'z-index': 'auto'
                });
            }
        },

        /**
         * Resets the the popup immediatly
         *
         */
        onOutAnimationComplete: function() {
            $('#popup_div').hide().clearQueue().data('displayedPopup', false);
        },


        /**
         * Shows the div when necessary (e.g. after hovering an element and waiting delay miliseconds
         *
         */
        showDiv: function() {
            delay(function() {
                if (this.enabled === false) {
                    return;
                }

                // IE tends to garbage collect unused DOM nodes, in that case reuse our original reference
                if (this.xhtml.length && this.xhtml[0].innerHTML === '') {
                    this.xhtml.html(this.original_xhtml);
                }

                $('#popup_content').html(this.xhtml);

                var popup_div = $('#popup_div'),
                    basic_styles = {
                        'position': 'absolute',
                        'display': 'block',
                        'z-index': 6001,
                        'width': 'auto'
                    };

                if (this.no_frame) {
                    $(popup_div).addClass('no-frame');
                } else {
                    $(popup_div).removeClass('no-frame');
                }

                var styles = jQuery.extend(basic_styles, this.position(), this.styles);

                if (this.is_mobile) {
                    $('#popup_div_curtain').css({
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        'z-index': 6001
                    }).show();
                }

                styles = jQuery.extend(styles, {
                    'opacity': 1
                });

                popup_div.css(styles);
                popup_div.stop(true); // stop all effects and clear effect queue
                popup_div.data('displayedPopup', this);
            }.bind(this));
        },

        show: function(ev, data) {
            this.showDiv();
            this.handlerMove(ev, data);

            return this;
        },

        /**
         * Property: bindTo
         * Binds the popup to an element. The popup is shown when hovering the element and wait delay miliseconds
         *
         * @param HTMLelement el the element the mouse popup should be bound to
         */
        bindTo: function(el) {
            var existing_popup_obj;

            el = $(el);

            existing_popup_obj = el.data('popup_obj');

            if (existing_popup_obj && existing_popup_obj.destroy) {
                existing_popup_obj.destroy();
            }

            this.element = el;
            if (this.is_mobile) {
                el.off('.popup').on('taphold.popup', this.handlerOver.bind(this));
            } else {
                el.on({
                    'mouseenter.popup': this.handlerOver.bind(this),
                    'mousemove.popup': this.handlerMove.bind(this),
                    'mouseleave.popup': this.handlerOut.bind(this),
                    'click.popup': this.handlerOut.bind(this)
                });
            }
            _tooltip_delay = this.is_mobile ? TOOLTIP_DELAY_MS_TAPHOLD : TOOLTIP_DELAY_MS;

            el.data('popup_obj', this);
        },


        /**
         * Disables MousePopup immediately
         *
         * @return
         */
        disable: function() {
            this.enabled = false;
        },


        /**
         * Enables the MousePopup
         *
         * @return
         */
        enable: function() {
            this.enabled = true;
        },

        updateContent: function(xhtml) {
            if (typeof xhtml === 'undefined') {
                return;
            }
            this.setTooltipContent(xhtml);
            $('#popup_content').html(this.xhtml);
        },

        destroy: function() {
            this.element.removeData('popup_obj');
            this.element.off('.popup');
            if ($('#popup_div').data('displayedPopup') === this) {
                this.handlerOut();
            }
        },

        destroyTooltip: function() {
            this.destroy();
        }
    });

    window.MousePopup = MousePopup;
}());