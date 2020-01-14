var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var open = require("open");
open("http://localhost:8080/", "chrome");
open("http://localhost:8080/", "chrome");
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/style', function(req, res){
  res.sendFile(__dirname + '/style.css');
});
var catcharr = [''];
var catchobj = function(value){
  // console.log(value)
  
  for(i in catcharr){
  // console.log(catcharr[i].keyword)
  // console.log(value.keyword)
  if (value.keyword == catcharr[i].keyword) {
    io.sockets.connected[value.userId].emit('catch', catcharr[i].userId);
    io.sockets.connected[catcharr[i].userId].emit('catch', value.userId);
    catcharr.splice(i, 1, 'null');
    console.log("配對成功")
    return 0;
  }
  }
    catcharr.push(value)
    console.log("配對失敗")
    console.log(catcharr)
}

io.on('connection', function(socket){
  socket.on('catch',msg=>{
    // global.catcharr.push({
    // keyword:`${msg}`,
    // userId:`${socket.id}`
    // })
    catchobj({
    keyword:`${msg}`,
    userId:`${socket.id}`
    })
  })
});

http.listen(8080, function(){
  console.log("http://localhost:8080/");
});

io.on('connection', function(socket){
  socket.on('message', function(msg){
    console.log(msg)
    io.sockets.connected[msg.obj].emit('msg', {content:`${msg.content}`,me:false});
  });
});
io.on('connection', function(socket){
  socket.on('leave', function(msg){
    io.sockets.connected[msg].emit('leave', '對方已離開');
    console.log('user disconnected')
  });
});
