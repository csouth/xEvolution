function Creature(id, x, y, height, width) {
    this.id = id;
    this.speed = 5;
    this.movementSize = 2;
    this.outsideColor = '#FFFF00';
    this.insideColor = '#000';

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
    this.hunger = 0;
    this.ticksAtMaxHunger = 0;
    this.ticksAboveHalf = 0;
}

Creature.prototype.doTick = function() {
    var randomNumber = Math.floor((Math.random() * 10) + 1);

    if(this.dead) {
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

    if(this.hunger >= this.maxHunger/2) {
        this.ticksAboveHalf++;
    } else {
        this.ticksAboveHalf = 0;
    }

    if(this.ticksAboveHalf >= 25) {
        this.ticksAboveHalf = 0;
        this.width += 1;
        this.height += 1;
        this.maxHunger += 10;
    }

    if(this.hunger <= (this.maxHunger/4)*3) {
        this.maxAge -= 2;
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
    var randomNumber = Math.floor((Math.random() * 80) + 1);
    var targetX = this.currentX;
    var targetY = this.currentY;

    if(randomNumber <= 10) { // Go west one space
        targetX -= this.movementSize;
    } else if(randomNumber <= 20) { // Go east one space
        targetX += this.movementSize;
    } else if(randomNumber <= 30) { // Go north one space
        targetY -= this.movementSize;
    } else if(randomNumber <= 40) { // Go south one space
        targetY += this.movementSize;
    } else if(randomNumber <= 50) { // Go north-west one space
        targetY += this.movementSize;
        targetX -= this.movementSize;
    } else if(randomNumber <= 60) { // Go north-east one space
        targetY += this.movementSize;
        targetX += this.movementSize;
    } else if(randomNumber <= 70) { // Go south-east one space
        targetY -= this.movementSize;
        targetX += this.movementSize;
    } else { // Go south-west one space
        targetY -= this.movementSize;
        targetX -= this.movementSize;
    }

    if(window.app.positionFree(this.getPositioning(targetX, targetY), this.id)) {
        this.move(targetX, targetY);

        this.hunger += this.movementSize;
        if(this.hunger > this.maxHunger) {
            this.hunger = this.maxHunger;
        }
    }
};

Creature.prototype.move = function(x, y) {
    var colors = window.app.canvas.getImageData(x, y, this.width, this.height).data;

    for(i=0; i<colors.length-1; i+=4) {
        if(colors[i] === 0 && colors[i+1] === 100 && colors[i+2] === 0) {
            window.app.foodEaten++;
            this.hunger -=1;
            if(this.hunger < 0) {
                this.hunger = 0;
            }
        }
    }

    window.app.canvas.fillStyle = '#fff';
    window.app.canvas.fillRect(this.currentX, this.currentY, this.height, this.width);

    window.app.canvas.fillStyle = this.outsideColor;

    if((x+this.width) > window.app.canvasWidth || (x-this.width) < 0) {
        x = window.app.canvasWidth-this.width;
    }

    if((y+this.height) > window.app.canvasHeight || (x-this.height) < 0) {
        y = window.app.canvasHeight - this.height;
    }

    window.app.canvas.fillRect(x, y, this.height, this.width);
    window.app.canvas.fillStyle = this.insideColor;
    window.app.canvas.fillRect(x+1, y+1, this.height-2, this.width-2);

    this.currentX = x;
    this.currentY = y;

};

Creature.prototype.die = function() {
    window.app.canvas.fillStyle = '#f00';
    window.app.canvas.fillRect(this.currentX, this.currentY, this.height, this.width);

    this.dead = true;
};

Creature.prototype.decompose = function() {
    window.app.canvas.fillStyle = '#fff';
    window.app.canvas.fillRect(this.currentX, this.currentY, this.height, this.width);

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
        x = Math.floor((Math.random() * window.app.canvasWidth) + 1);
        y = Math.floor((Math.random() * window.app.canvasHeight) + 1);
        if(window.app.positionFree(x, y)) {
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