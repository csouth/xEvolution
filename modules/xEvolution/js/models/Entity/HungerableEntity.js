define([
    "xEvolution/models/Entity/LivingEntity"
],function(
    LivingEntity
){
    var model    =   LivingEntity.extend({
        _urlRoot:   "",
        defaults:   {
            hunger:                 0,
            hungerSpeed:            2,
            maxHunger:              100,
            ticksAtMaxHunger:       0,
            ticksBelowHalf:         0,
            growTicks:              21,
            maxTicksAtMaxHunger:    200,            
        },
        initialize: function(properties,options){
            this.listenTo(this.board,'tick',this._checkHunger);
            this.listenTo(this.board,'tick',this._checkGrow);
        },
        _checkHunger: function(){
            if(this.get('dead')){
                return;
            }
            
            var ammount             =   Number(this.get('hungerSpeed'));
            var hunger              =   Number(this.get('hunger'))+ammount;
            var maxHunger           =   Number(this.get('maxHunger'));
            var ticksAtMaxHunger    =   Number(this.get('ticksAtMaxHunger'));
            var ticksBelowHalf      =   Number(this.get('ticksBelowHalf'));
            var maxTicksAtMaxHunger =   Number(this.get('maxTicksAtMaxHunger'));            
            
            if(maxHunger && hunger>=maxHunger){
                ticksAtMaxHunger++;
            }else{
                ticksAtMaxHunger    =   0;
            }
            
            if(maxHunger && hunger<=maxHunger/2){
                ticksBelowHalf++;
            }else{
                ticksBelowHalf  =   0;
            }
            
            this.set({
               hunger:              hunger,
               ticksAtMaxHunger:    ticksAtMaxHunger,
               ticksBelowHalf:      ticksBelowHalf
            });
            
            if(maxHunger && ticksAtMaxHunger>=maxTicksAtMaxHunger){
                this.die("hunger");
            }
         },
         _checkGrow: function(){
            var ticksBelowHalf  =   Number(this.get('ticksBelowHalf'));
            var growTicks       =   Number(this.get('growTicks'));
            if(ticksBelowHalf>=growTicks){
                this.set({
                    ticksBelowHalf: 0
                });
                this.grow();
                console.log('Creature has grown');
            }
         },
         grow: function(){
            /*
             * This can be overridden by extending classes
             */ 
            var w   =   Number(this.get('width'));
            var h   =   Number(this.get('height'));
            this.set({
                width:          w+1,
                height:         h+1
            });
         }
    });
    return model;
});