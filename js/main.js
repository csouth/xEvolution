require.config({
    "baseUrl":  "js/lib",
    "paths":    {
        "xEvolution":  "../../modules/xEvolution/js"
    },
    config:     {
        "xEvolution/app": {
            "_router":              "xEvolution/router",                   //The module name of the app router: REQUIRED
            "_css":                 "modules/xEvolution/css/screen.css",   //The stylesheet or array of stylesheets to be injected
            "_apiRootUrl":          "api",                              //The Base URL used for all API communications
            "_templateRootUrl":     "modules/xEvolution/html/",            //The Base URL used to load external templates
            "_cookieName":          "xEvolution_settings",                 //When storing settings via cookie, this is the name
            "_storageDuration":     (5*365*24*60*60*1000)               //The duration to store the cookie
            /*
             * Any configuration option not begining with an underscore (_) will be saved to the browser via local storage / cookies
             */
        }
    }
});

require([
    'xEvolution/app'
],function(app){
    app.start();
});