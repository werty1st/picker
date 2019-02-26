// Version 2017-06-28-1136
'use strict';

/** DEMO
 * 
 */
// setTimeout(function () {
//     // wrapped in timout to keep this at the top of the file

//     var pickerResult = new PickerResultInterface(),

//         res = {
//             "noPopup": false,
//             "getvars": {}, // will be set automatically in sendResult function
//             "content": [
//                 {
//                     "id"          : "", // an empty String will be replaced with random UUID
//                     "description" : "Default picker description",
//                     "visibleFrom" : "2016-03-21T00:00:00+01:00",
//                     "visibleTo"   : "2016-11-24T00:00:00+01:00",
//                     "fragments"   : [
//                         {
//                             "fragmentURI": "http://zdf.de/module/playout.html",
//                             "playout": "web"
//                         }, {
//                             "fragmentURI": "http://zdf.de/module/playout.xml",
//                             "playout": "xml"
//                         }]
//                 }
//             ]
//         };
//     pickerResult.sendResult(res); // targetOrigin will be set automatically in sendResult function
// }, 1000);
/**
 * DEMO END
 */



/**
 * PickerResultInterface class which exposes a sendPickerData function
 * @constructor
 * @implements {sendPickerData}
 */
function IPickerResult() {

    var targetOrigin = "", query, vars, getvars, i, pair, locationEx, forceSSL = "", extId;

    locationEx = location.search + location.hash;

    if (locationEx.match(/targetOrigin=([^&]+)/i) !== null) {
        targetOrigin = unescape(locationEx.match(/targetOrigin=([^&]+)/i)[1]);
        if (console.re){
            console.re.log('targetOrigin:', targetOrigin);
        } else {
            console.log('targetOrigin:', targetOrigin);            
        }
    }

    if (locationEx.match(/forceSSL=([^&]+)/i) !== null) {
        forceSSL = unescape(locationEx.match(/forceSSL=([^&]+)/i)[1]);
        if (console.re){
            console.re.log('forceSSL:', forceSSL);
        } else {
            console.log('forceSSL:', forceSSL);            
        }
    } 
    
    if (locationEx.match(/extId=([^&]+)/i) !== null) {
        extId = unescape(locationEx.match(/extId=([^&]+)/i)[1]);
        if (console.re){
            console.re.log('extId:', extId);
        } else {
            console.log('extId:', extId);            
        }
    }    

    if (targetOrigin === "") {
        if (console.re){
            console.re.log("Parameter targetOrigin is not defined!");
        } else {
            console.log("Parameter targetOrigin is not defined!");            
        }        
        throw new PickerResultException("Parameter targetOrigin is not defined!");
    }

    query = window.location.search.substring(1);
    vars = query.split("&");
    getvars = {};

    for (i = 0; i < vars.length; i += 1) {
        pair = vars[i].split("=");
        getvars[pair[0]] = pair[1];
    }

    /**
     * PickerResultException
     */
    function PickerResultException(message) {
        this.message = message;
        this.name = "pickerResultInterfaceException";
    }

    /**
    * Generates UUID
    * @return {String} UUID
    */
    function genUUID() {
        function repl(c) {
            var r = Math.random() * 16 | 0,
                v = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
        if (console.re){
            console.re.log("Generating new UUID");
        } else {
            console.log("Generating new UUID");            
        }            
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, repl);
    }

    /**
     * Send picker data to host. 
     * @param {Array} content Array with fragment Objects
     * @param {Function|null} _callback Callback function gets called after data was transfered to host.
     */
    this.sendResult = function sendResult(result, done) {

        var resultString, noPopup = true, retval = null;

        if (result === null) {
            if (console.re){
                console.re.log("Parameter result is null or undefined!");
            } else {
                console.log("Parameter result is null or undefined!");
            }
            throw new PickerResultException("Parameter result is null or undefined!");
        }

        if (typeof done !== 'function') {
            noPopup = false;
            done = function () { return; };
        }


        result.getvars = getvars;

        // replace emtpy id with submitted extId and fallback to randum UUID
        result.content.map(function (c) {
            c.id = (c.id || extId || genUUID());
        });

        //delete invalid Dates
        result.content.map(function (c) {
            if( new Date(c.visibleTo) == "Invalid Date" ){
                delete c.visibleTo;
            }
            if( new Date(c.visibleFrom) == "Invalid Date" ){
                delete c.visibleFrom;
            }
        });        


        // replace http links with https
        if (forceSSL == "on"){
            result.content.map(function (c) {
                c.fragments.map(function(f){
                    f.fragmentURI = f.fragmentURI.replace(/^http:\/\//i, 'https://');
                });
            });
        }


        // suppress sophora message
        result.noPopup = noPopup;

        // convert Object to String
        resultString = JSON.stringify(result);

        if (console.re){
            console.re.log(resultString);
        } else {
            console.log(resultString);
        }        

        if (targetOrigin === 'sophora://picker') {

            if (typeof sendResultToDeskClient === 'function') {
                // sophora is present

                retval = sendResultToDeskClient(resultString);
                if (done !== false) { done(retval); }

            } else {
                // sophora is missing
                if (console.re){
                    console.re.log("Page not executed inside Sophora Client.");
                } else {
                    console.log("Page not executed inside Sophora Client.");
                }                
                throw new PickerResultException("Page not executed inside Sophora Client.");
            }

        } else {
            parent.postMessage(resultString, targetOrigin);
            done();
        }
    };

    if (typeof pickerready === 'function') { pickerready(); }
}

var PickerResultInterface;
if (!(PickerResultInterface instanceof IPickerResult)) {
    PickerResultInterface = new IPickerResult();
    if (console.re){
        console.re.log("PickerResultInterface");
    } else {
        console.log("PickerResultInterface");
    }      
}
