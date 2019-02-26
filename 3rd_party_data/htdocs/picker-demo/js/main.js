
console.re && console.re.log('remote log init');
console.re && console.re.log("location.protocol:", location.protocol);

function bootstrapAlert(message,type){    

    if (message === undefined){
        message = "Hinweis"
    }
    if (!type){
        type = "alert-info"; //alert-info alert-success alert-warning alert-danger
    }
    
    if ( $('#notification-center').html().trim() !== ""){
        // remove old to "flash" again
        $('#notification-center').html("");
        setTimeout(function(){
            bootstrapAlert(message,type);
        },200);
        return;
    }
    
    $('#notification-center')
        .html('<div class="alert ' 
        + type 
        + '" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        + message+'</div>');
    
}

$( document ).ready(function() {

    var meme;
    var selecteditem = false;
        

    // setup save button
    $('#myButton').on('click', function () {
        var $btn = $(this).button('loading');
        console.re && console.re.log('#myButton clicked');
        
        if (meme === undefined){
            bootstrapAlert("No item selected.","alert-warning");
            $btn.button('reset');
        } else
            save(meme, $btn);
    });
    
    // function called from PickerResultInterface after its loaded 
    pickerready = function () {
        $('#myButton').prop('disabled', false);
    }


    /**
     * dynamically load full or minified version 
     */
    (function(){
        if (location.search.match(/debugging=([^&]+)/) !== null) {
            var debugging = unescape(location.search.match(/debugging=([^&]+)/)[1]);
            console.re && console.re.log('debugging:', debugging);
            console.log('debugging:', debugging);
        }

        var s = document.createElement('script');
        if (debugging === "true"){

            var sre = document.createElement('script');
            sre.setAttribute('src','//console.re/connector.js');
            sre.setAttribute('data-channel','adams_picker_2016_03_22_12_20');
            sre.setAttribute('id','consolerescript');
            document.head.appendChild(sre);

            s.setAttribute('src','../libs/js/pickerResultInterface/pickerResultInterface_debug.js');
        }
        else{
            s.setAttribute('src','../libs/js/pickerResultInterface/pickerResultInterface.min.js');
        }   
        document.head.appendChild(s);
    }());    


    /**
     * Call Picker.sendResult
     */
    function save(meme, $btn){

        var fragments = [ {
                "fragmentURI": "http://sofa.zdf.de/dummy",
                "playout": "web"
            }, {
                "fragmentURI": "http://date.jsontest.com",
                "playout": "json"
            }, {
                "fragmentURI": "http://sofa.zdf.de/dummy",
                "playout": "xml"
            }, {
                "fragmentContent": "head...head",
                "fragmentURI": "http://date.jsontest.com",
                "playout": "head"
            }],

            content = {
                "id"          : "", // use extId or fallback to new UUID
                "description" : "Beschreibungstext1",
                "visibleFrom" : "2016-03-21T00:00:00+01:00",
                "visibleTo"   : "2016-11-24T00:00:00+01:00",
                "fragments"   : fragments
            },
            
            res = {
                content: [content]
            }

            timeout = setTimeout(function () {
                $btn.button('reset');
                console.re && console.re.log("Data not saved. Request timed out.");
                bootstrapAlert("Data not saved. Request timed out.","alert-danger");
            }, 2000);

        try {
            PickerResultInterface.sendResult(res, function (err) {
                clearTimeout(timeout);
                $btn.button('reset');

                if (!err) {
                    console.re && console.re.log("data saved");
                    bootstrapAlert("Success","alert-success");
                } else {
                    bootstrapAlert("Data not saved. Check error log for details.","alert-danger");
                    console.log("Data not saved. erro:", err);
                    console.re && console.re.log("Data not saved. erro:", err);
                }
            });            
        } catch (error) {
            clearTimeout(timeout);
            $btn.button('reset');
            bootstrapAlert(error.message, "alert-danger");
        }


    }

    /**
     * Load Memes
     */
    (function init() {
        //app2 http://version1.api.memegenerator.net/#Generators_Select_ByTrending

        $.ajax({
            url: "https://api.imgflip.com/get_memes"
        }).done(function (result) {

            // data to list
            if (result.success) {

                var memes = result.data.memes.slice(0, 29);

                jQuery.each(memes, function (i, m) {
                    var memeitem = $.parseHTML("<a href=\"#\"><img src=" + m.url + "></a>");
                    $(memeitem).on("click", function (e) {

                        if (selecteditem) {
                            selecteditem.removeClass("active");
                        }

                        selecteditem = $(memeitem);
                        selecteditem.addClass("active");

                        console.re && console.re.log('meme selected:', JSON.stringify(m));

                        meme = m;
                        e.preventDefault();
                    });
                    $("#memes").append(memeitem);
                });
            }
        });
    }());





});





