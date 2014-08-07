function xEvolution(height, width) {
    this.canvasHeight = height || 600;
    this.canvasWidth  = width || 600;
    this.canvas = this.createCanvas(this.canvasHeight, this.canvasWidth);
    this.interval = null;

    this.creatures = [];
}

xEvolution.prototype.createCanvas = function(height, width) {
    var canvas    = document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    return canvas.getContext('2d');
};

xEvolution.prototype.addCreature = function() {
    var creature = new Creature();
    this.creatures.push(new Creature());
};

xEvolution.prototype.tick = function() {
    for(i=0; i < window.app.creatures.length; i++) {
        window.app.creatures[i].doTick();
    }
};

xEvolution.prototype.start = function() {
    if(null === this.interval) {
        this.interval = setInterval(this.tick, 100);
    }
};

xEvolution.prototype.stop = function() {
    if(null !== this.interval) {
        clearInterval(this.interval);
    }
};

window.app = new xEvolution();