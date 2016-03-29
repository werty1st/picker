/** DEMO
 * 
 */
// var pickerResult= new PickerResultInterface();

// var fragments = [
//     {
//         "fragmentURI": "http://sofa01.zdf.de/c/twr/132d86f9ac9b25f508db467e431a2e079d648b6d/embedm.html",
//         "playout":"web"
//     },
//     {
//         "fragmentURI": "http://date.jsontest.com",
//         "playout":"json"
//     },
//     {
//         "fragmentURI": "http://sofa01.zdf.de/c/twr/132d86f9ac9b25f508db467e431a2e079d648b6d/embedm.html",
//         "playout":"head"
//     },
//     {
//         "fragmentContent": "<root>Hello</root>",
//         "playout":"xml"
//     }
// ]

// var options = {
//     "id"          : "3e0e802261d1cc366680040efdaf6ff0b563b4ca",
//     "visibleFrom" : "2016-03-21T00:00:00+01:00",
//     "visibleTo"   : "2016-11-24T00:00:00+01:00",
// };

// var timeout = setTimeout(function(){
//     alert("data not saved. request timed out");    
// },5000);

// pickerResult.sendPickerData(fragments, options, function(err){
//     clearTimeout(timeout);
//     if(!err){
//         alert("data saved")
//     } else {        
//         alert("data not saved. erro:",err);
//     }
// });
/**
 * DEMO END
 */


/**
 * PickerResultInterface class which exposes a sendPickerData function
 * @constructor
 * @implements {sendPickerData}
 */
PickerResultInterface = function PickerResultInterface () {
    
    var targetOrigin = "";

    if (location.search.match(/targetOrigin=([^&]+)/) != null){
        targetOrigin = location.search.match(/targetOrigin=([^&]+)/)!= null && unescape(location.search.match(/targetOrigin=([^&]+)/)[1]);
        console.re.log('targetOrigin:',targetOrigin);
    }

    if( targetOrigin === "" ){
        console.re.log('sendPickerData: no targetOrigin');
        throw new Error("targetOrigin must not be undefined")
    }
    

    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var getvars = {};

    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        getvars[ pair[0] ] = pair[1];
    }    
        
    /**
     * Sends pickerData to host. 
     * @param {Array} fragments Array of fragment Objects { playout: "web", fragmentURI: "(https|http)://..."}
     * @param {Object|null} _options Options to pass with fragments,
     * @param {Function|null} _callback Callback function gets called after data was transfered to host.
     */    
    this.sendPickerData = function (fragments, _options, _callback) {
        
        var callback = false;
        var options = {};
        
        if (typeof _callback === 'function') callback = _callback;
        if (typeof _options  === 'object')    options = _options;
        
        //give `options` a default value
        var content = {
            "id"          : options.id || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16);}),
            "description" : options.description || "Default picker description",
            "visibleFrom" : options.visibleFrom || "2011-11-24T00:00:00+01:00",
            "visibleTo"   : options.visibleTo || "2012-11-24T00:00:00+01:00",
            "fragments"   : fragments
        };

        var res = {
            "getvars": getvars,
            "content": [
                content
            ]
        };

        sendResult(res, targetOrigin, callback);
    }

    /**
     * PickerResultException
     */
    function PickerResultException(message) {
        this.message = message;
        this.name = "pickerResultInterfaceException";
    }
    
    /**
     * Send PickerResult
     */
    function sendResult(result, targetOrigin, done) {

        if (targetOrigin == null || targetOrigin.length == 0) {
            alert("Parameter targetOrigin is not set!");
            throw new PickerResultException("Parameter targetOrigin is not set!");
        }
        if (result == null) {
            alert("Parameter result is null or undefined!");
            throw new PickerResultException("Parameter result is null or undefined!");
        }
        if (parent == null) {
            alert("Parent window is null or undefined!");
            throw new PickerResultException("Parent window is null or undefined!");
        }

        var resultString = JSON.stringify(result);
        if (targetOrigin == 'sophora://picker') {
            
            // Callback to Java from JavaScript OR false
            if(done === false){
                // 2. param = hide sophora dialog [true|false]
                sendResultToDeskClient(resultString, false);
            } else {
                var result = sendResultToDeskClient(resultString, true);
                done(result);
            }
            
        } else {
            parent.postMessage(resultString, targetOrigin);
        }
    };
    
}



