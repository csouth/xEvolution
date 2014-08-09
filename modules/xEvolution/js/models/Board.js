define([
    "xEvolution/app"
],function(
    app
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
        initialize: function(properties,options){
            this.canvas =   options.canvas;
        },
        start:  function(){
            if(!this.timer){
                console.log("starting");
                this.timer  =   setInterval(this.tick, 1000/this.get('ticksPerSecond'),this);
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
            this.creatures.push(new Creature({
                
            },{
                board: this
            }));
        },
        getDimensions:   function(){
            return {
                width:  this.canvas.width,
                height: this.canvas.height
            };
        },
        getRandomPosition: function(){
            
        },
        tick: function(obj){
            if(obj && typeof obj.tick==="function"){
                return obj.tick();
            }
            if(this.processing){
                return;
            }
            this.processing =   true;
                
            this.processing =   false;
        }
    });
    return model;
});