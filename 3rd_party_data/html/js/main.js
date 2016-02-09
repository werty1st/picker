var socket = io();
var meme;

!function init() {    
    $.ajax({
        url: "https://api.imgflip.com/get_memes",
        context: document.body
    }).done(function( result ) {
          
        // data to list
        if (result.success){
            
            var memes = result.data.memes.slice(0,29);

            jQuery.each( memes, function(i,m){
                var memeitem = $.parseHTML(`<a href="#"><img src="${m.url}"></a>`);
                    $(memeitem).on( "click" , function(e){
                        meme = m;
                    } );                    
                $( "#memes" ).append( memeitem );
            });
        }
    });
}();


$('#myButton').on('click', function () {
    var $btn = $(this).button('loading');
    // business logic...
    save(meme);
    setTimeout(()=>{
        $btn.button('reset');    
    },2000);
    
});

function save(meme){
    
    console.log(meme);
    sendPickerData();
    
}