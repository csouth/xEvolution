(function(){
    var addFunction =   function(_){
        _.extendr=function() {
            var returnObj   =   {};
            var objects     =   [];
            for(var aI in arguments){
                if(typeof arguments[aI]==="object"){
                    objects.push(arguments[aI]);
                }
            }

            for(var i in objects){
                var obj =   objects[i];
                for(var prop in obj){
                    if(_.isArray(obj[prop])){
                        returnObj[prop] =   _.isArray(returnObj[prop]) ? returnObj[prop] : [];
                        for(var j=0;j<obj[prop].length;j++){
                            returnObj[prop].push(_.extendr(obj[prop][j]));
                        }
                    }else if(typeof obj[prop]==="object"){
                        returnObj[prop]   =   _.extendr(returnObj[prop],obj[prop]);
                    }else{
                        returnObj[prop] =   obj[prop];
                    }
                }
            }
            return returnObj;
        };
    };
    if(typeof define==="function"){
        define([
           'underscore' 
        ],function(_){
            addFunction(_);
            return _;
        });
    }else if(typeof _ ==="function"){
        addFunction(_);
    }
})();