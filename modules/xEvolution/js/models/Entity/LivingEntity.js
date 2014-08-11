define([
    "xEvolution/models/Entity/Entity"
],function(
    Entity
){
    var model    =   Entity.extend({
        _urlRoot:   "",
        defaults:   {
            age:                    0,
            maxAge:                 0,
            
            deadColor:              "rgba(255,0,0,1)",
                        
            dead:                   false,
            ticksDead:              0,
            maxTicksDead:           100,
            
            decomposed:             false
            
        },
        initialize: function(properties,options){
            
            this.on('change:decomposed',this._checkDecompose);
            
            this.listenTo(this.board,'tick',this.age);
            this.listenTo(this.board,'tick',this._decompose);
        },
        _decompose: function(){
            if(this.get('dead') && !this.get('decomposed')){
                var ticksDead       =   Number(this.get('ticksDead'))+1;
                var maxTicksDead    =   this.get('maxTicksDead');
                var fillColor       =   this.board.canvas.RGBAColor(this.get('fillColor'));
                var borderColor     =   this.board.canvas.RGBAColor(this.get('borderColor'));
                var maxTicksDead    =   Number(this.get('maxTicksDead'));
                var fA              =   (maxTicksDead-ticksDead)/maxTicksDead;
                var decomposed      =   ticksDead>=maxTicksDead;
                
                fillColor.a         =   fA;
                borderColor.a       =   fA;
                this.set({
                    ticksDead:      ticksDead,
                    fillColor:      fillColor.toString(),
                    borderColor:    borderColor.toString(),
                    decomposed:     decomposed
                });
            }
         },
         _checkDecompose: function(){
            if(!this.previous('decomposed') && this.get('decomposed')){
                this.stopListening(this.board,'tick');
                console.log('Creature has decomposed');
            }
        },
        age: function(ticks){
            ticks      =   isNaN(ticks) ? 1 : ticks;
            if(!this.get('dead')){
               var age     =   Number(this.get('age'));
               var maxAge  =   this.get('maxAge');

               this.set({
                   age:    age+ticks,
               });
               if(maxAge && age>=maxAge){
                   this.die('old age');
               }
           }
        },
        die: function(cause){
            this.set({
                dead: true,
                fillColor: this.get('deadColor')
            });
            console.log("Creature has died: "+cause);
        },
    });
    return model;
});