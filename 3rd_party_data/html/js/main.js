
console.re.log('remote log init');
console.re.log("location.protocol:",location.protocol);

var meme;
var selecteditem=false;


$('#myButton').on('click', function () {
    var $btn = $(this).button('loading');
    // business logic...
    console.re.log('#myButton clicked');
    
    save(meme, $btn);    
});

/**
 * Call Picker.sendPickerData
 */
function save(meme, $btn){
        
    var pickerResult= new PickerResultInterface();

    var fragments = [
        {
            "fragmentURI": "http://sofa01.zdf.de/c/twr/132d86f9ac9b25f508db467e431a2e079d648b6d/embedm.html",
            "playout":"web"
        },
        {
            "fragmentURI": "http://date.jsontest.com",
            "playout":"json"
        },
        {
            "fragmentContent": "<div>Hello</div>",
            "playout":"html"
        }
    ]

    var options = {
        "id"          : "3e0e802261d1cc366680040efdaf6ff0b563b4ca",
        "visibleFrom" : "2016-03-21T00:00:00+01:00",
        "visibleTo"   : "2016-11-24T00:00:00+01:00",
    };

    var timeout = setTimeout(function(){
        $btn.button('reset'); 
        alert("data not saved. request timed out");    
    },5000);

    pickerResult.sendPickerData(fragments, options, function(err){
        clearTimeout(timeout);
        $btn.button('reset'); 
        
        if(!err){
            alert("data saved")
        } else {        
            alert("data not saved. erro:",err);
        }
    });
    
}


/**
 * Load Memes
 */
!function init() {    
    //app2 http://version1.api.memegenerator.net/#Generators_Select_ByTrending
    
    $.ajax({
        url: "https://api.imgflip.com/get_memes"
    }).done(function( result ) {
          
        // data to list
        if (result.success){
            
            var memes = result.data.memes.slice(0,29);

            jQuery.each( memes, function(i,m){
                var memeitem = $.parseHTML("<a href=\"#\"><img src="+m.url+"></a>");
                    $(memeitem).on( "click" , function(e){
                        
                        if (selecteditem){
                            selecteditem.removeClass("active");
                        }
                        selecteditem = $(memeitem);
                        selecteditem.addClass("active");
                        
                        meme = m;
                        e.preventDefault();
                    } );                    
                $( "#memes" ).append( memeitem );
            });
        }
    });
}();