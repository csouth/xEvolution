function Creature(id, app, x, y, height, width) {
    this.id = id;
		this.app = app;
    this.speed = 5;
    this.movementSize = 2;

    this.currentX = x || -1;
    this.currentY = y || -1;
    if(this.currentX == -1 || this.currentY == -1) {
        this.getRandomStartingPosition();
    }

    this.height = height || 3;
    this.width = width || 3;

    this.maxAge = 1000;
    this.currentAge = 0;
    this.dead = false;
    this.ticksDead = 0;
    this.decomposed = false;

    this.maxHunger = 100;
    this.hunger = 1;
    this.ticksAtMaxHunger = 0;
}

Creature.prototype.doTick = function() {
    var randomNumber = Math.floor((Math.random() * 10) + 1);

    if(this.dead || this.currentAge === this.maxAge) {
        if(this.ticksDead === 30) {
            this.decompose();
        }

        if(!this.dead) {
            this.die();
        } else {
            this.ticksDead += 1;
        }
        return;
    }

    this.currentAge++;

    if(this.ticksAtMaxHunger === 21) {
        this.die();
    }

    if(this.hunger === this.maxHunger) {
        this.ticksAtMaxHunger += 1;
    }

    if(randomNumber >= this.speed) {
        this.doAction();
        return;
    }
};

Creature.prototype.doAction = function() {
    var randomNumber = Math.floor((Math.random() * 100) + 1);
    var targetX = this.currentX;
    var targetY = this.currentY;

    if(randomNumber <= 25) { // Go left one space
        targetX -= this.movementSize;
    } else if(randomNumber <= 50) { // Go right one space
        targetX += this.movementSize;
    } else if(randomNumber <= 75) { // Go up one space
        targetY -= this.movementSize;
    } else { // Go down one space
        targetY += this.movementSize;
    }

    if(this.app.positionFree(this.getPositioning(targetX, targetY), this.id)) {
        this.move(targetX, targetY);

        this.hunger += this.movementSize;
        if(this.hunger > this.maxHunger) {
            this.hunger = this.maxHunger;
        }
    }
};

Creature.prototype.move = function(x, y) {

    this.app.canvas.fillStyle = '#fff';
    this.app.canvas.fillRect(this.currentX, this.currentY, this.height, this.width);

    this.app.canvas.fillStyle = '#000';

    if((x+this.width) > this.app.canvasWidth || (x-this.width) < 0) {
        x = this.app.canvasWidth-this.width;
    }

    if((y+this.height) > this.app.canvasHeight || (x-this.height) < 0) {
        y = this.app.canvasHeight - this.height;
    }

    this.app.canvas.fillRect(x, y, this.height, this.width);

    this.currentX = x;
    this.currentY = y;

};

Creature.prototype.die = function() {
    this.app.canvas.fillStyle = '#f00';
    this.app.canvas.fillRect(this.currentX, this.currentY, this.height, this.width);

    this.dead = true;
};

Creature.prototype.decompose = function() {
    this.app.canvas.fillStyle = '#fff';
    this.app.canvas.fillRect(this.currentX, this.currentY, this.height, this.width);

    this.decomposed = true;
};

Creature.prototype.getPositioning = function(x, y) {
    x = x || this.currentX;
    y = y || this.currentY;

    var retVal = {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
    };

    retVal.minX = x;
    retVal.minY = y;
    retVal.maxY = y + this.width;
    retVal.maxX = x + this.height;

    return retVal;
};

Creature.prototype.getRandomStartingPosition = function() {
    var haveLocation = false;
    var x = 0;
    var y = 0;

    while(!haveLocation) {
        x = Math.floor((Math.random() * this.app.canvasWidth) + 1);
        y = Math.floor((Math.random() * this.app.canvasHeight) + 1);
        if(this.app.positionFree(x, y)) {
            this.currentX = x;
            this.currentY = y;
        }

        haveLocation = true;
    }
};

Creature.prototype.isIntersecting = function (positioning) {
    var a = this.getPositioning();
    var b = positioning;

    return (a.minX <= b.maxX && b.minX <= a.maxX && a.minY <= b.maxY && b.minY <= a.maxY);
};
