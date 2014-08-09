define([
    "xEvolution/app"
],function(
    app
){
    var model    =   app.Model.extend({
        _urlRoot:   "",
        defaults:   {
            speed:              5,
            borderColor:        "#FFFF00",
            bodyColor:          "#000",
            x:                  0,
            y:                  0,
            width:              3,
            height:             3,
            maxAge:             1000,
            currentAge:         0,
            dead:               false,
            ticksDead:          0,
            decomposed:         false,
            maxHunger:          100,
            hunger:             0,
            ticksAtMaxHunger:   0,
            ticksAboveHalf:     0
        },
        board:  null,
        initialize: function(properties,options){
            this.board  =   options.board;
        }
    });
    return model;
});