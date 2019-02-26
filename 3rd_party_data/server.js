var express = require('express');
var app = express();
var http = require('http').Server(app);

const PORT = process.env.PORTC;

app.use(express.static(__dirname + '/htdocs'));



http.listen(PORT, function(){
    console.log(`client is listening on *:${PORT}`);
});    




