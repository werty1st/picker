
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
  openiframe( link );
});

function openiframe(url){
    $('#iframe1').attr('src', url);
    $('#box1').animate({
        height: '500px'
    }, 500, function() {
        console.log("open");
    });
}

