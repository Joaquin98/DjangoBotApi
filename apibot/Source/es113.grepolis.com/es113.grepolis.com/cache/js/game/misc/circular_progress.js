/*globals Math, window, G_vmlCanvasManager */

(function() {
    'use strict';

    var CircularProgress = function(params) {
        this.element = params.element;

        //fallback for IE8: canvas element is missing getContext method when its inserted to the DOM dynamically
        //'excanvas' lib is necessary
        if (typeof this.element.getContext === 'undefined') {
            G_vmlCanvasManager.initElement(this.element);
        }

        this.current_value = 0;
        this.ctx = this.element.getContext('2d');
        this.width = this.element.width;
        this.height = this.element.height;
        this.wdiv2 = this.width / 2;
        this.hdiv2 = this.height / 2;

        this.draw_settings = params.draw_settings;

        this.start_angle = this.draw_settings.start_angle;
        this.end_angle = this.draw_settings.end_angle;

        this.tick_interval = 16;
        this.max_value = params.max_value || 100;

        this.animation_info = {
            start_value: 0,
            end_value: 0,
            delta_value: null,
            start_timestamp: null,
            end_timestamp: null,
            duration: 0
        };

        params.parent.on('pb:change:value');
    };

    CircularProgress.prototype.setCurrentValue = function(value, props) {
        props = props || {};

        this.current_value = value;

        if (!props.silent) {
            this.draw(this.current_value);
        }
    };

    CircularProgress.prototype.setMax = function(value, props) {
        props = props || {};

        this.max_value = value;

        if (!props.silent) {
            this.draw(this.max_value);
        }
    };

    CircularProgress.prototype.animate = function(to, time) {

        this.animation_info.duration = time;

        this.animation_info.start_timestamp = +new Date();
        this.animation_info.end_timestamp = this.animation_info.start_timestamp + time;
        this.animation_info.start_value = this.current_value;
        this.animation_info.end_value = to;

        this.animation_info.delta_value = (this.animation_info.end_value - this.animation_info.start_value);

        this.drawAndNextStep();
        return this;
    };

    CircularProgress.prototype.drawAndNextStep = function() {
        var current_timestamp = +new Date(),
            delta = (current_timestamp - this.animation_info.start_timestamp) / this.animation_info.duration,
            new_value = this.animation_info.start_value + delta * this.animation_info.delta_value;

        this.current_value = new_value;

        if (new_value > this.animation_info.end_value) {
            this.current_value = this.animation_info.end_value;
            this.draw(this.animation_info.end_value);
        } else {
            /** due to problems with small values in IE8 and VML on excanvas **/
            if (new_value / this.animation_info.start_value < 0.005) {
                this.clear();
            } else {
                this.draw(new_value);
            }
            setTimeout((function() {
                this.drawAndNextStep();
            }).bind(this), this.tick_interval);
        }

        return this;
    };

    CircularProgress.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    CircularProgress.prototype.draw = function(value) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        var gr = this.ctx.createLinearGradient(this.width, 0, 0, 0),
            unified_value = value / this.max_value;

        gr.addColorStop(0, this.draw_settings.start_color);
        gr.addColorStop(1, this.draw_settings.end_color);
        this.ctx.fillStyle = gr;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.beginPath();

        var start = this.start_angle,
            stop = this.start_angle + unified_value * (this.end_angle - this.start_angle);

        this.ctx.arc(this.wdiv2, this.hdiv2, Math.min(this.wdiv2, this.hdiv2), start, stop, false);
        this.ctx.arc(this.wdiv2, this.hdiv2, Math.min(this.wdiv2, this.hdiv2) - this.draw_settings.line_thick, stop, start, true);


        /*this.ctx.shadowColor = '#8f6938';
        this.ctx.shadowBlur = 1;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;*/

        this.ctx.fill();
    };

    window.CircularProgress = CircularProgress;
}());