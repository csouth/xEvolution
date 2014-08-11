define([
    "xEvolution/models/Entity/HungerableEntity"
],function(
    HungerableEntity
){
    var model    =   HungerableEntity.extend({
        _urlRoot:   "",
        defaults:   {
            speed:                  5,
            movementSpeed:          2,
            
            pdx:                    -1,
            pdy:                    -1
        },
        initialize: function(properties,options){
            this.listenTo(this.board,'tick',this.move);
        },
        getMoveLocation: function(){    
            var pdx    =   Number(this.get('pdx'));
            var pdy    =   Number(this.get('pdy'));

            var dx     =   Math.floor(Math.random()*3)-1;
            var dy     =   Math.floor(Math.random()*3)-1;


            var x          =   Number(this.get('x'));
            var y          =   Number(this.get('y'));
            var hunger     =   Number(this.get('hunger'));
            var maxHunger  =   Number(this.get('maxHunger'));
            var moveSpeed  =   Number(this.get('movementSpeed'));
            var speed      =   hunger>=maxHunger ? moveSpeed/2 : moveSpeed;

            var newLocation    =   {
                x: x+(dx*speed),
                y: y+(dy*speed)
            };
            
            if(this.board.isValidLocation(newLocation)){
                return newLocation;
            }else{
                return this.getMoveLocation();
            }
        },
        move: function(){
            if(!this.get('dead')){
                var newPosition =   this.getMoveLocation();
                this.set(newPosition);                
            }
        }
        
    });
    return model;
});