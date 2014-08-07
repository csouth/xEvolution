function xEvolution(height, width) {
    this.canvasHeight = height || 600;
    this.canvasWidth  = width || 600;
    this.canvas = this.createCanvas(this.canvasHeight, this.canvasWidth);
    this.stopped = true;
    this.msBetweenTicks = 100;

    this.creatures = [];
    this.deadCreatures = [];
}

xEvolution.prototype.createCanvas = function(height, width) {
    var canvas    = document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    return canvas.getContext('2d');
};

xEvolution.prototype.addCreature = function() {
    this.creatures.push(new Creature(this.generateCreatureId()));
};

xEvolution.prototype.tick = function() {
    var decomposed = [];
    for(i=0; i < window.app.creatures.length; i++) {
        if(!window.app.creatures[i].decomposed) {
            window.app.creatures[i].doTick();
            continue;
        }

        decomposed.push(i);
    }

    decomposed.forEach(function(element, index, array) {
        window.app.deadCreatures.push(window.app.creatures.splice(index));
    });

    if(!this.stopped) {
        setTimeout(window.app.tick, window.app.msBetweenTicks);
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
    for(i=0; i < window.app.creatures.length; i++) {
        if(!window.app.creatures[i].decomposed) {
            if(window.app.creatures[i].id !== creatureId && window.app.creatures[i].isIntersecting(positioning)) {
                return false;
            }
        }
    }

    return true;
};

window.app = new xEvolution();