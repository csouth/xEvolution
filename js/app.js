function xEvolution(height, width) {
    this.canvasHeight = height || 600;
    this.canvasWidth  = width || 600;
    this.canvas = this.createCanvas(this.canvasHeight, this.canvasWidth);
    this.stopped = true;
    this.msBetweenTicks = 100;

    this.creatures = [];
    this.deadCreatures = [];

    this.tick = this.tick.bind(this);
}

xEvolution.prototype.createCanvas = function(height, width) {
    var canvas    = document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    return canvas.getContext('2d');
};

xEvolution.prototype.addCreature = function() {
    this.creatures.push(new Creature(this.generateCreatureId(), this));
};

xEvolution.prototype.tick = function() {
    this.creatures.forEach(function(element, index, array) {
        if(element.decomposed) {
            this.creatures.splice(index, 1);
            this.deadCreatures.push(element);
            return;
        }

        element.doTick();
    }.bind(this));

    if(!this.stopped) {
        setTimeout(this.tick, this.msBetweenTicks);
    }
};

xEvolution.prototype.start = function() {
    this.stopped = false;
    this.tick();
};

xEvolution.prototype.stop = function() {
    this.stopped = true;
};

xEvolution.prototype.generateCreatureId = (function() {
    function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };
})();

xEvolution.prototype.positionFree = function(positioning, creatureId) {
    for(i=0; i < this.creatures.length; i++) {
        if(!this.creatures[i].decomposed) {
            if(this.creatures[i].id !== creatureId && this.creatures[i].isIntersecting(positioning)) {
                return false;
            }
        }
    }

    return true;
};

window.app = new xEvolution();
