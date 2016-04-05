'use strict';

/** DEMO
 * 
 */
// setTimeout(function () {
//     // wrapped in timout to keep this at the top of the file

//     var pickerResult = new PickerResultInterface(),

//         res = {
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
function PickerResultInterface() {

    var targetOrigin = "", query, vars, getvars, i, pair;

    if (location.search.match(/targetOrigin=([^&]+)/) !== null) {
        targetOrigin = unescape(location.search.match(/targetOrigin=([^&]+)/)[1]);
        console.re.log('targetOrigin:', targetOrigin);
    }

    if (targetOrigin === "") {
        console.re.log("Parameter targetOrigin is not defined!");
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
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, repl);
    }

    /**
     * Send picker data to host. 
     * @param {Array} content Array with fragment Objects
     * @param {Function|null} _callback Callback function gets called after data was transfered to host.
     */
    this.sendResult = function sendResult(result, done) {

        var resultString, retval = null;

        if (result === null) {
            console.re.log("Parameter result is null or undefined!");
            throw new PickerResultException("Parameter result is null or undefined!");
        }
        
        if (typeof done !== 'function') { done = false; }

        result.getvars = getvars;

        // replace emtpy id with randum UUID
        result.content.map(function (c) {
            c.id = (c.id || genUUID());
        });

        resultString = JSON.stringify(result);

        console.re.log(resultString);

        if (targetOrigin === 'sophora://picker') {

            if (typeof sendResultToDeskClient === 'function') {
                // sophora is present

                // Callback to Java from JavaScript OR false
                if (done === false) {
                    // 2. param = hide sophora dialog [true|false]
                    sendResultToDeskClient(resultString, false);
                } else {
                    retval = sendResultToDeskClient(resultString, true);
                    done(retval);
                }

            } else {
                // sophora is missing
                console.re.log("Page not executed inside Sophora Client.");
                throw new PickerResultException("Sophora is null or undefined!");
            }

        } else {
            parent.postMessage(resultString, targetOrigin);
        }
    };
}



