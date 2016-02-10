
var socket = io();


$('.selectpicker').selectpicker({
  style: 'btn-primary',
  size: 'auto',
  showIcon: true
});

$('#selectpicker_new').on('changed.bs.select', function (event, clickedIndex, newValue, oldValue) {
  // do something...
  var selected = $(this).find("option:selected");
  console.log(clickedIndex,selected.val());
  
  
  var link = $(selected).data("link");
  var target = getPathInfo(link);
  
  openiframe( target );
  //openWindow( target );
});

function openiframe(url){
    var iframe = $('#iframe1');
    
    iframe.attr('src', url);
    $('#box1').animate({
        height: '500px'
    }, 500, function() {
        console.log("open");
        
    });    
}


function setupMessaging(target){
    
    var pingtimer;
    var pongtimer;
    var myPopup = window.open(target.url,'myWindow');
    
    var listener = function(event) {
        if(event.origin !== target.origin) return;
        if (event.data == "pong"){
            clearTimeout(pongtimer);
        } else{
            console.log('received response:  ',event.data);            
        }
    };
    
    function popupClosed(){
        console.log("Picker closed");
        window.removeEventListener('message', listener, false);
    }

    // listen to popup response
    window.addEventListener('message', listener, false);
    //

    // periodical message sender
    pingtimer = setInterval(function(){
        var message = 'ping';
        myPopup.postMessage(message, target.origin); //send the message and target URI
        pongtimer = setTimeout(function(){
            clearTimeout(pingtimer);   
            clearTimeout(pongtimer);   
            popupClosed();
        },1000);
    },1000);
    
        
}


function openWindow(target){
    
    var pingtimer;
    var pongtimer;
    var myPopup = window.open(target.url,'myWindow');
    
    var listener = function(event) {
        if(event.origin !== target.origin) return;
        if (event.data == "pong"){
            clearTimeout(pongtimer);
        } else{
            console.log('received response:  ',event.data);            
        }
    };
    
    function popupClosed(){
        console.log("Picker closed");
        window.removeEventListener('message', listener, false);
    }

    // listen to popup response
    window.addEventListener('message', listener, false);
    //

    // periodical message sender
    pingtimer = setInterval(function(){
        var message = 'ping';
        myPopup.postMessage(message, target.origin); //send the message and target URI
        pongtimer = setTimeout(function(){
            clearTimeout(pingtimer);   
            clearTimeout(pongtimer);   
            popupClosed();
        },1000);
    },1000);
    
        
}


function getPathInfo(path) {
    //  create a link in the DOM and set its href
    var link = document.createElement('a');
    var origin = "";
    link.setAttribute('href', path);

    if (!(link.port === "80") || (link.port == "443")){
        origin = link.protocol + "//" + link.hostname + ":" + link.port;
    } else {
        origin = link.protocol + "//" + link.hostname;
    }

    //  return an easy-to-use object that breaks apart the path
    return {
        host:     link.hostname,  //  'example.com'
        port:     link.port,      //  12345
        search:   processSearchParams(link.search),  //  {startIndex: 1, pageSize: 10}
        path:     link.pathname,  //  '/blog/foo/bar'
        protocol: link.protocol,   //  'http:'
        url:      path,
        origin:   origin
    };
}

/**
 *  Convert search param string into an object or array
 *  '?startIndex=1&pageSize=10' -> {startIndex: 1, pageSize: 10}
 */
function processSearchParams(search, preserveDuplicates) {
    //  option to preserve duplicate keys (e.g. 'sort=name&sort=age')
    preserveDuplicates = preserveDuplicates || false;  //  disabled by default

    var outputNoDupes = {};
    var outputWithDupes = [];  //  optional output array to preserve duplicate keys

    //  sanity check
    if(!search) return void(0);

    //  remove ? separator (?foo=1&bar=2 -> 'foo=1&bar=2')
    search = search.split('?')[1];

    //  split apart keys into an array ('foo=1&bar=2' -> ['foo=1', 'bar=2'])
    search = search.split('&');

    //  separate keys from values (['foo=1', 'bar=2'] -> [{foo:1}, {bar:2}])
    //  also construct simplified outputObj
    outputWithDupes = search.map(function(keyval){
        var out = {};
        keyval = keyval.split('=');
        out[keyval[0]] = keyval[1];
        outputNoDupes[keyval[0]] = keyval[1]; //  might as well do the no-dupe work too while we're in the loop
        return out;
    });

    return (preserveDuplicates) ? outputWithDupes : outputNoDupes;
}