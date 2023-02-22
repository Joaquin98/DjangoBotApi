/* global Game, us, G_vmlCanvasManager */

window.ParalaxRender = (function() {
    'use strict';

    var Render = function(animations, canvas, options) {
        if (canvas.length) {
            canvas = canvas[0];
        }
        this.canvas = canvas;

        //fallback for IE8: canvas element is missing getContext method when its inserted to the DOM dynamically
        //'excanvas' lib is necessary
        if (typeof this.canvas.getContext === 'undefined') {
            G_vmlCanvasManager.initElement(this.canvas);
        }

        this.ctx = canvas.getContext('2d');
        this.animations = animations;
        this.options = us.defaults(options, {
            animation_sequence_duration: 1000
        });

        this._timout = 0;
        this.time = null;
        this.index = null;
        this.do_animation = true;

        this.disableAnimationOnFirefox();
    };

    /**
     * As tested with FF 33-35 slow movements in FF stutter - escpecially on Systems
     * with disabled hardware acceleration.
     * To be safe for now we decided to disable FF only
     */
    Render.prototype.disableAnimationOnFirefox = function() {
        var is_firefox = $('body').hasClass('is_firefox');
        if (is_firefox) {
            this.do_animation = false;
        }
    };

    // prefix image name with correct CDN Url
    Render.prototype._getImageUrl = function(image_name) {
        return Game.img() + '/game/introduction_welcome/' + image_name;
    };

    Render.prototype._loadImages = function(animation, callback) {
        var $el = $('<div></div>');
        animation.forEach(function(image_data) {
            var name = image_data.name,
                $img = $('<img></img>').attr('src', this._getImageUrl(name));

            image_data.img = $img[0];
            image_data.offset_save = image_data.offset;

            $el.append($img);
        }.bind(this));

        // callback if given and last image is done
        if (typeof callback === 'function') {
            $el.find('img').last().on("load", function() {
                callback();
            });
        }
    };

    Render.prototype.loadAnimationImages = function(index) {

        var animation = this.animations[index];

        this._timeout = this.options.animation_sequence_duration;
        this.time = null;

        // check if animation needs to load the images (normally only valid for the first frame)
        if (!animation[0].img) {
            this._loadImages(animation, function() {
                this.index = index;
                this.renderAnimation(index);
            }.bind(this));
        } else {
            // images are preloaded, just start the renderer
            this.index = index;
            this.renderAnimation(index);
        }

        // if a next frame exist, preload the images
        if (this.animations[index + 1]) {
            this._loadImages(this.animations[index + 1]);
        }
    };

    /**
     * This function is called in an requestanimationframe loop
     * It determines its framerate and animates the movement of the animation part
     */
    Render.prototype.renderAnimation = function(index) {
        var animation = this.animations[index],
            now = Date.now(),
            dt = now - (this.time || now);

        this.time = now;

        this._timeout -= dt;
        if (this._timeout > 0) {
            for (var i = 0, l = animation.length; i < l; i++) {
                var image_data = animation[i],
                    dx = -1 * image_data.offset_save / this.options.animation_sequence_duration;

                if (this.do_animation) {
                    image_data.offset += dx * dt;
                }

                this.ctx.drawImage(image_data.img, image_data.left + image_data.offset, image_data.top);
            }
            if (this.index === index) {
                requestAnimationFrame(this.renderAnimation.bind(this, index));
            }
        }
    };

    return Render;
}());