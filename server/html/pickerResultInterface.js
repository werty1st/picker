/* =========================================================================
 * pickerResultInterface.js
 * Version 1.1
 * Project: 2016
 *
 * Last Modified:
 *      $LastChangedDate: 2016-03-22 11:19:00 +0100 $
 *
 * Copyright   : Copyright (c) 2011-2016
 * Organisation: Zweites Deutsches Fernsehen
 *
 *
 * This file creates a global PickerResultInterface object containing the method sendResult.
 *
 *     PickerResultInterface.sendResult(result, targetOrigin)
 *         result           an object containg the result picked by the editor
 *         targetOrigin     the targetOrigin of the parent window containing the CoreMedia Studio application
 *
 *         This method sends the results picked by the editor to the parent window containing the CoreMedia Studio application.
 *         Upon receiving the result message, the CoreMedia Studio creates a new dynamic container object and attributes it with the given results.
 *
 *         Example:
 *         var targetOrigin = "http://editor.zdf.de";
 *         var result = {
 *              "content": [
 *                  {
 *                      "id": "id1",
 *                      "description": "Beschreibungstext1",
 *                      "visibleFrom": "2011-11-24T00:00:00+01:00",
 *                      "visibleTo": "2011-11-24T00:00:00+01:00",
 *                      "fragments": [
 *                          {
 *                              "playout": "xml",
 *                              "fragmentURI": "http://xyz.zdf.de/xml/1"
 *                          },
 *                          {
 *                              "playout": "web",
 *                              "fragmentURI": "http://xyz.zdf.de/web/1"
 *                          },
 *                          {
 *                              "playout": "liquid",
 *                              "fragmentURI": "http://xyz.zdf.de/liquid/1"
 *                          },
 *                          {
 *                              "playout": "json",
 *                              "fragmentURI": "http://xyz.zdf.de/json/1"
 *                          }
 *                      ]
 *                  }
 *              ]
 *         };
 *         PickerResultInterface.sendResult(result, targetOrigin);
 *
 * =========================================================================
 */

var PickerResultInterface;
if (!PickerResultInterface) {
    PickerResultInterface = {};
}

(function() {

    PickerResultInterface.sendResult = function(result, targetOrigin) {

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
            // Callback to Java from JavaScript
            sendResultToDeskClient(resultString);
        } else {
            parent.postMessage(resultString, targetOrigin);
        }
    };

    function PickerResultException(message) {
        this.message = message;
        this.name = "pickerResultInterfaceException";
    }

}());
