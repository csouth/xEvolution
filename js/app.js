function xEvolution(height, width) {
    this.canvasHeight = height || 250;
    this.canvasWidth  = width || 250;
    this.canvas = this.createCanvas(this.canvasHeight, this.canvasWidth);

    this.canvas.fillStyle = '#fff';
    this.canvas.fillRect(0, 0, this.canvasHeight, this.canvasWidth);

    this.foodAdded = 0;
    this.foodEaten = 0;

    this.stopped = true;
    this.msBetweenTicks = 100;

    this.creaturesToAdd = 5;
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

xEvolution.prototype.addCreature = function(count) {
    count = count || 1;
    this.creaturesToAdd += count;
};

xEvolution.prototype.addFood = function() {
    var added = false;
    var failedCount = 0;
    var x = 0;
    var y = 0;
    while(!added && failedCount < 2) {
        x = Math.floor((Math.random() * this.canvasWidth) + 1);
        x += Math.floor((Math.random() * this.canvasWidth) + 1);
        x = Math.floor(x/2);
        y = Math.floor((Math.random() * this.canvasHeight) + 1);
        y += Math.floor((Math.random() * this.canvasHeight) + 1);
        y = Math.floor(y/2);

        if(this.isEmpty(x, y)) {
            this.canvas.fillStyle = '#006400';
            this.canvas.fillRect(x, y, 1, 1);
            this.foodAdded++;
            added = true;
        }

        failedCount++;
    }
};

xEvolution.prototype.tick = function() {
    if(this.creaturesToAdd !== 0) {
        this.creatures.push(new Creature(this.generateCreatureId(), this));
        this.creaturesToAdd--;
    }

    this.creatures.forEach(function(element, index, array) {
        this.addFood();
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
        if(this.creatures[i].id !== creatureId && this.creatures[i].isIntersecting(positioning)) {
            return false;
        }
    }

    return true;
};

xEvolution.prototype.isEmpty = function(x, y) {
    var positioning = {
        minX: x,
        minY: y,
        maxX: x,
        maxY: y
    };

    if(!this.positionFree(positioning, 1)) {
        return false;
    }

    var color = window.app.canvas.getImageData(x, y, 1, 1).data;
    if(color[0] !== 255 || color[1] !== 255 || color[2] !== 255) {
        return false;
    }

    return true;
};

window.app = new xEvolution();
