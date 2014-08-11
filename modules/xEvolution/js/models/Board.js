define([
    "xEvolution/app",
    "xEvolution/models/Creature",
    "xEvolution/models/Plant"
],function(
    app,
    Creature,
    Plant
){
    var model    =   app.Model.extend({
        _urlRoot:   "",
        defaults:   {
            foodAdded:          0,
            foodEaten:          0,
            stopped:            true,
            ticksPerSecond:     100,
            defaultCreatures:   5,
            creatures:          [],
        },
        timer:      null,
        processing: false,
        canvas:     null,
        lastTick:   null,
        initialize: function(properties,options){
            this.canvas =   options.canvas;
            this.listenToOnce(this.canvas,'place:complete',this.addInitial);
        },
        addInitial: function(){
            for(var i=0;i<this.get('defaultCreatures');i++){
                this.add();
            }
            for(var j=0;j<100;j++){
                var position    =   this.getRandomPosition();
                var creature    =   new Plant({
                    x:  position.x,
                    y:  position.y
                },{
                    board: this
                });
            }
        },
        start:  function(){
            if(!this.timer){
                console.log("starting");
                this.lastTick   =   Date.now();
                this.timer      =   setInterval(this.tick, 1000/this.get('ticksPerSecond'),this);
            }
        },
        stop: function(){
            if(this.timer){
                console.log("stopping");
                clearInterval(this.timer);
                this.timer  =   null;
            }
        },
        add: function(){
            var position    =   this.getRandomPosition();
            var creature    =   new Creature({
                x:  position.x,
                y:  position.y
            },{
                board: this
            });
            this.listenTo(creature,'change:decompose',this.remove);
            this.get('creatures').push(creature);
        },
        remove: function(creature){
            if(!creature instanceof Creature){
                return;
            }
            if(!creature.get('decomposed')){
                return;
            }
            var index   =   this.get('creatures').indexOf(creature);
            if(index===-1){
                return;
            }
            this.get('creatures').splice(index,1);
        },
        isValidLocation: function(location){
            if(!location || !location.x || !location.y){
                return false;
            }
            var dimensions  =   this.getDimensions();
            if(location.x>0 && location.y>0 && location.x<dimensions.width && location.y<dimensions.height){
                return true;
            }
            return false;
        },
        isLocationEmpty: function(location){
            if(!location.x || !location.y){
                return false;
            }
            for(var i in this.get('creatures')){
                var creature    =   this.get('creatures')[i];
                if(creature.containsPoint(location)){
                    return false;
                }
            }
            return true;
        },
        getDimensions:   function(){
            return {
                width:  this.canvas.width,
                height: this.canvas.height
            };
        },
        getRandomPosition: function(){
            var dimensions  =   this.getDimensions();
            var x           =   Math.floor(Math.random()*dimensions.width);
            var y           =   Math.floor(Math.random()*dimensions.height);
            return {
                x:  x,
                y:  y
            };
        },
        tick: function(obj){
            if(obj && typeof obj.tick==="function"){
                return obj.tick();
            }
            if(this.processing){
                return;
            }
            var now =   Date.now();
            var d   =   now-this.lastTick;
            this.processing =   true;
            //console.log('tick: '+d);
            this.trigger('tick');
            this.processing =   false;
            this.lastTick   =   now;
        }
    });
    return model;
});