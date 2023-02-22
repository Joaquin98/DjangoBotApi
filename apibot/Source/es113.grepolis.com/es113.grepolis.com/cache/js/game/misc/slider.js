/**
 * Create a new slider. You need to provide this used elements
 */
(function() {
    'use strict';

    function Slider(options) {
        var ffwd = false,
            that = this;

        this._elementMin = options.elementMin || null;
        this._elementMax = options.elementMax || null;
        this._elementDown = options.elementDown || null;
        this._elementUp = options.elementUp || null;
        this._elementInput = options.elementInput;
        this._elementSlider = options.elementSlider;
        this._orientation = options.orientation || 'horizontal';
        this._max_overwrite = options.max_overwrite || false;
        this._callback = options.callback || function() {};
        this._onmousedown = options.onmousedown || function() {};

        if (options.elementDownFast && options.elementUpFast) {
            this._elementDownFast = options.elementDownFast;
            this._elementUpFast = options.elementUpFast;
            ffwd = true;
        }

        this._elementSlider.on("mouseup", function() {
            if (that._onmousedown) {
                that._onmousedown();
            }
        });

        this._min = options.min || 0;
        this._max = options.max || 100;

        //initial value
        this._value = options.value || this._min;
        //multiply up/down
        this._step = options.step || 1;

        // Create slider and bind slide handler (IE7 has sometimes problems with animate:true)
        try {
            this._elementSlider.slider({
                'animate': true,
                'orientation': this._orientation,
                'min': this._min,
                'max': this._max,
                'value': this._value,
                'step': this._step
            });
        } catch (e) {}
        var sliderChange = (function(event, ui) {
            this.setValue(ui.value);
            this._callback();
        }).bind(this);
        this._elementSlider.on('slide', sliderChange);

        // Bind min/max handlers
        if (this._elementMin != null && this._elementMax != null) {
            this._elementMin.on("click", (
                function() {
                    this.setValue(this.getMin());
                }
            ).bind(this));
            this._elementMax.on("click", (
                function() {
                    this.setValue(this.getMax());
                }
            ).bind(this));
        }
        // Up and down and input box handlers
        if (this._elementDown && this._elementUp) {
            this._elementDown.on("click", (function() {
                this.setValue(this.getValue() - this._step);
                this._elementInput.trigger("change");
            }).bind(this));

            this._elementUp.on("click", (function() {
                this.setValue(this.getValue() + this._step);
                this._elementInput.trigger("change");
            }).bind(this));
        }
        if (ffwd) {
            this._elementDownFast.on("click", (function() {
                this.setValue(this.getValue() - 100 * this._step);
            }).bind(this));
            this._elementUpFast.on("click", (function() {
                this.setValue(this.getValue() + 100 * this._step);
            }).bind(this));
        }

        this._elementInput.on('change', {
            self: this
        }, function(e) { //pass self reference as event data
            e.data.self.setValue(this.value);
        });

        this._elementInput.on("focus", function() {
            this.select();
        }); // TODO: Test IE compatibility
    }

    Slider.prototype = new jQuery();

    Slider.prototype.getValue = function() {
        return parseFloat(this._elementInput.val(), 10);
    };

    Slider.prototype.setValue = function(value) {
        //check if step has decimal point ? round to 1 decimal : round
        value = parseInt(this._step, 10) != this._step ? parseInt(value * 10, 10) / 10 : parseInt(value, 10);

        if (isNaN(value)) {
            return;
        }
        //allow larger numbers than _max, if larger -> set new _max
        if (!this._max_overwrite) {
            value = Math.max(this._min, value);
            value = Math.min(this._max, value);
        } else {
            this.setMax(Math.max(this._max, value));
            value = Math.max(this._min, value);
        }

        this._value = value;
        this._elementInput[0].value = value;
        this._elementSlider.slider("option", 'value', value);
        this._elementSlider.trigger('change');
    };

    Slider.prototype.setMin = function(min) {
        this._min = min;
        if (this._elementMin) {
            this._elementMin.text(min);
        }
        this._elementSlider.slider('option', 'min', min);
    };

    Slider.prototype.getMin = function(value) {
        return this._min;
    };

    Slider.prototype.setMax = function(max) {
        this._max = max;
        if (this._elementMax) {
            this._elementMax.text(max);
        }
        this._elementSlider.slider('option', 'max', max);
        if (!this._max_overwrite) {
            this.setValue(this.getValue());
        }
    };

    Slider.prototype.getMax = function() {
        return this._max;
    };

    Slider.prototype.disable = function(param) {
        if (typeof param !== 'boolean') {
            return;
        }
        this._elementSlider.slider('option', 'disabled', param);
    };

    window.Slider = Slider;
}());