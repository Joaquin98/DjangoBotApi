/* 
Copyright (C) 2012 Oliver Herdin https://github.com/DDJarod

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * @param {String} [_orientation='horizontal'] either 'horizontal' or 'vertical'. Both of which are saved as 
 *                                             constants forceOrientation.VERTICAL/HORIZONTAL
 * @param {Object}.[_options] options to overwrite defaults
 * @param {bool}   [_options.dontRotate] can be set to true to prevent the rotation of the body, for debugging
 * @param {Object} [_options.meta] the keys are the names and the properties are the content of meta elements
 *                                defaults: 'apple-mobile-web-app-capable': 'yes'
 *                                          'apple-mobile-web-app-status-bar-style': 'black-translucent'
 *                                          'format-detection': 'telephone=no'
 * @param {int}    [_options.devicePixelRatio] some devices (iPhone with retina display) render pages like they only had 
 *                                            half the resolution. Per default this is prevented, but you can re-enable
 *                                            it by supplying 1
 * @param {string} [_options.overflow] do we want scrollbars or force the screenresolution and remove the rest?
 *                                    defaults to 'hidden', reasonable other option: 'auto'
 */
var forceOrientation = function(_orientation, _options) {
    // we will need this elements later on
    var body = document.querySelector('body'),
        bodyStyle = document.defaultView.getComputedStyle(body),
        head = document.querySelector('head'),
        html = document.querySelector('html'),
        metaViewport // the viewport meta element
        , devicePixelRatio = (_options && _options.devicePixelRatio || window.devicePixelRatio),
        vertical = (_orientation === forceOrientation.VERTICAL),
        toBeRotated // store if we have to rotate
        , hide = (_options && _options.overflow && _options.overflow.toLowerCase() !== 'hidden') ? false : 'hidden';

    // we need these css styles, otherwise this wont work (<- who would have guessed : )
    html.style.overflow = hide || _options.overflow;
    body.style.position = 'absolute';
    body.style.overflow = hide || 'visible';
    body.style.top = 0;
    body.style.left = 0;
    body.style.margin = 0;
    body.style.padding = 0;

    // set the meta viewport
    var metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute('content', 'width=' + window.innerWidth +
        ',height=' + window.innerHeight +
        ',maximum-scale=' + (1.0 / devicePixelRatio) +
        ',minimum-scale=' + (1.0 / devicePixelRatio));
    head.appendChild(metaViewport);

    // the update function, will be triggered once to set tup, and everytime we rotate
    var updateOrientation = function() {
        // rotate the body into the desired position
        if (vertical) {
            toBeRotated = body.style['-webkit-transform'] || // we already rotated it sometime 
                (window.orientation !== undefined) && (Math.abs((Math.abs(window.orientation) % 180)) !== 0);
            if (toBeRotated) {
                body.style['-webkit-transform'] = 'rotate(-' + Math.abs((Math.abs(window.orientation) % 180)) + 'deg)';
            }
        } else {
            toBeRotated = body.style['-webkit-transform'] || // we already rotated it sometime 
                (window.orientation !== undefined) && (Math.abs((Math.abs(window.orientation) - 90)) !== 0);
            if (toBeRotated) {
                body.style['-webkit-transform'] = 'rotate(-' + Math.abs((Math.abs(window.orientation) - 90)) + 'deg)';
            }
        }

        // calculate the desired body dimensions
        var bodyWidth = parseInt(bodyStyle.width),
            bodyHeight = parseInt(bodyStyle.height);

        //Game && Game.dout && Game.dout('before rotation', (toBeRotated ? 'ROTATE' : 'fine'), bodyWidth, 'x', bodyHeight);

        if (hide) {
            bodyWidth = toBeRotated ? window.innerHeight : window.innerWidth;
            bodyHeight = toBeRotated ? window.innerWidth : window.innerHeight;
        } else {
            var tmp = bodyWidth;
            bodyWidth = toBeRotated ? Math.max(window.innerHeight, bodyHeight) : Math.max(window.innerWidth, bodyWidth);
            bodyHeight = toBeRotated ? Math.max(window.innerWidth, tmp) : Math.max(window.innerHeight, bodyHeight);
        }

        //Game && Game.dout && Game.dout('target', (toBeRotated ? 'ROTATE' : 'fine'), bodyWidth, 'x', bodyHeight);

        if (vertical) {
            var bodyWidth = Math.min(window.innerHeight, window.innerWidth),
                bodyHeight = Math.max(window.innerHeight, window.innerWidth);
        } else {
            var bodyWidth = Math.max(window.innerHeight, window.innerWidth),
                bodyHeight = Math.min(window.innerHeight, window.innerWidth);
        }

        // the html base element should have the same dimensions as the screen area we can use
        //		html.style.height = window.innerHeight + 'px';
        //		html.style.width = window.innerWidth + 'px';
        //		html.style.height = bodyHeight + 'px';
        //		html.style.width = bodyWidth + 'px';

        // the body is the element were our stuff is rendere to. This is what we want to rotate.
        // Set its size to the size out application uses
        body.style.width = bodyWidth + 'px';
        body.style.height = bodyHeight + 'px';

        //Game && Game.dout && Game.dout('inner ', window.innerWidth, window.innerHeight);

        // For the case where we force the body to rotate, the normal body is to large for the html in one dimension
        // to not increase the size of the html in that dimension, we shift the body to the left/top (depending on rotation)
        var left = Math.min(0, window.innerWidth - bodyWidth),
            top = Math.min(0, window.innerHeight - bodyHeight);

        //Game && Game.dout && Game.dout('move ', (vertical ? 'top ' + top : 'left ' + left));

        if (vertical) {
            body.style.top = top + 'px';
        } else {
            body.style.left = left + 'px';
        }

        // We rotate a rectangle in another rectangle, which means the after the rotation the borders dont align.
        // To fix, we calculate by how much they wont align and then transform the element.
        // This step is purely cosmetic and wont change dimensions of DOM elements
        var translateOffsetY = Math.abs((bodyWidth - window.innerWidth) / 2.0),
            translateOffsetX = Math.abs((bodyHeight - window.innerHeight) / 2.0);

        if (_options && _options.dontRotate) {
            body.style['-webkit-transform'] = '';
        } else if (Math.abs(translateOffsetX) + Math.abs(translateOffsetY) != 0) {
            //Game && Game.dout && Game.dout('css translate ', translateOffsetX, translateOffsetY);
            body.style['-webkit-transform'] = body.style['-webkit-transform'] + ' translate(-' + translateOffsetX + 'px, ' + translateOffsetY + 'px)';
        }

        // Reset the viewport with the newly generated dimensions. This will force the size recalculation of the html element (dont ask me why ..)
        metaViewport.setAttribute(
            'content',
            'width=' + window.innerWidth + ',height=' + window.innerHeight + ',maximum-scale=' + (1.0 / devicePixelRatio) +
            ',minimum-scale=' + (1.0 / devicePixelRatio)
        );

        // scroll to the top left of the page
        body.scrollLeft = 0;
        body.scrollTop = 0;

        var htmlStyle = document.defaultView.getComputedStyle(html);
        //Game && Game.dout && Game.dout('bodyStyle ', bodyStyle.width, bodyStyle.height);
        //Game && Game.dout && Game.dout('htmlStyle ', htmlStyle.width, htmlStyle.height);
    };

    // call once to set up
    setTimeout(updateOrientation, 1);

    // bind to the rotate event
    window.onorientationchange = updateOrientation;
}

forceOrientation.VERTICAL = 'vertical';
forceOrientation.HORIZONTAL = 'horizontal';