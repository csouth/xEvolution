function Creature(x, y, height, width) {
    this.speed = 5;
    this.movementSize = 2;

    this.currentX = x || Math.floor((Math.random() * window.app.canvasWidth) + 1);
    this.currentY = x || Math.floor((Math.random() * window.app.canvasHeight) + 1);

    this.height = height || 3;
    this.width = width || 3;

    this.maxAge = 1000;
    this.currentAge = 0;
    this.dead = false;

    this.maxHunger = 100;
    this.hunger = 0;
    this.ticksAtMaxHunger = 0;
}

Creature.prototype.doTick = function() {
    var randomNumber = Math.floor((Math.random() * 10) + 1);

    if(this.dead || this.currentAge === this.maxAge) {
        if(!this.dead) {
            this.die();
        }
        return;
    }

    this.currentAge++;

    if(this.ticksAtMaxHunger === 21) {
        console.log('Pixel died of hunger.');
        this.die();
    }

    if(this.hunger === this.maxHunger) {
        this.ticksAtMaxHunger += 1;
    }

    if(randomNumber >= this.speed) {
        this.hunger += this.movementSize;
        if(this.hunger > this.maxHunger) {
            this.hunger = this.maxHunger;
        }

        this.doAction();
        return;
    }
};

Creature.prototype.doAction = function() {
    var randomNumber = Math.floor((Math.random() * 100) + 1);

    if(randomNumber <= 25) { // Go left one space
        this.move(this.currentX - this.movementSize, this.currentY);
    } else if(randomNumber <= 50) { // Go right one space
        this.move(this.currentX + this.movementSize, this.currentY);
    } else if(randomNumber <= 75) { // Go up one space
        this.move(this.currentX, this.currentY - this.movementSize);
    } else { // Go down one space
        this.move(this.currentX, this.currentY + this.movementSize);
    }
};

Creature.prototype.move = function(x, y) {

    window.app.canvas.fillStyle = '#fff';
    window.app.canvas.fillRect(this.currentX, this.currentY, this.height, this.width);

    window.app.canvas.fillStyle = '#000';

    if((x+this.width) > window.app.canvasWidth || (x-this.width) < 0) {
        x = window.app.canvasWidth-this.width;
    }

    if((y+this.height) > window.app.canvasHeight || (x-this.height) < 0) {
        y = window.app.canvasHeight - this.height;
    }

    window.app.canvas.fillRect(x, y, this.height, this.width);

    this.currentX = x;
    this.currentY = y;

};

Creature.prototype.die = function() {
    window.app.canvas.fillStyle = '#f00';
    window.app.canvas.fillRect(this.currentX, this.currentY, this.height, this.width);

    this.dead = true;
};