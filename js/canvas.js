(function(global) {
    'use strict';
    var CanvasVault = function() {
        this.canvas = null;
        this.canvasContext = null;
    };

    var Canvas   = function(settings) {
        settings = settings || {};
        this.settings = {
            height: 750,
            width:  750,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            style: 'border: 1px solid #fff'
        };

        for(var attrName in settings) {
            this.settings[attrName] = settings[attrName];
        }

        this.canvasElement = null;
        this.canvasContext = null;
        this.setupCanvas();
    };

    Canvas.prototype.setupCanvas  = function() {
        this.canvasElement        = global.document.createElement('canvas');
        this.canvasElement.width  = this.settings.width;
        this.canvasElement.height = this.settings.height;
        this.canvasElement.style  = this.settings.style;

        this.canvasContext        = this.canvasElement.getContext('2d');

        this.canvasContext.fillStyle = this.backgroundColor;
        this.canvasContext.fillRect(0, 0, this.settings.width, this.settings.height);
    };

    Canvas.prototype.isEmpty = function(x, y, width, height) {
        height = height || 1;
        width  = width  || 1;
        var available = true;

        var colors = this.canvasContext.getImageData(x, y, width, height).data;
        var _i;
        for(_i=0; _i<colors.length-1; _i+=4) {
            if(colors[_i] !== 255 || colors[_i+1] !== 255 || colors[_i+2] !== 255) {
                return false;
            }
        }

        return true;
    };

    Canvas.prototype.clearPixels = function(x, y, width, height) {
        width  = width  || 1;
        height = height || 1;
        this.canvasContext.fillStyle = 'rgb(255, 255, 255, 1)';
        this.canvasContext.fillRect(x, y, width, height);
    };

    if(typeof global.xEvolution === 'undefined') {
        Object.defineProperty(global, 'xEvolution', {
            writable : false,
            enumerable : false,
            configurable : false,
            value: {}
        });
    }
    Object.defineProperty(global.xEvolution, 'Canvas', {
        writable : false,
        enumerable : false,
        configurable : false,
        value: {}
    });
    Object.defineProperty(global.xEvolution.Canvas, 'getInstance', {
        writable : false,
        enumerable : false,
        configurable : false,
        value: function(settings) {
            settings = settings || {};

            if(typeof this.instance === 'undefined') {
                Object.defineProperty(global.xEvolution.Canvas, 'instance', {
                    writable : false,
                    enumerable : false,
                    configurable : false,
                    value: new Canvas(settings)
                });
            }

            return this.instance;
        }
    });

})(window);