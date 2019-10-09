
var app =require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
    io.emit('subopen',"true");
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('subclose',"true");
    });
    socket.on('connect', function(){
        console.log('user connected');
    });
    socket.on('message', function(msg){
        console.log('message: ' + msg);
        socket.broadcast.emit('message',msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

