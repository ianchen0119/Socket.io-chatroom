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

/**
 * 測試用方法
 * @param {arr} catcharr 用於存放待配對的使用者
 * @param {arr} catchedarr 用於存放已配對的使用者
 */

var catcharr = [''];
var catchedarr = [''];
var checkobj = function(user,obj){
  for(i in catchedarr){
    if(obj == catchedarr[i]){
      return true 
    }
  }
  return false //聊天對象已不在
}
var catchobj = function(value){
  for(i in catcharr){
  if (value.keyword == catcharr[i].keyword) {
    io.sockets.connected[value.userId].emit('catch', catcharr[i].userId);
    io.sockets.connected[catcharr[i].userId].emit('catch', value.userId);
    console.log("配對成功")
    catchedarr.push(catcharr[i].userId)
    catchedarr.push(value.userId)
    console.log(catchedarr)
    catcharr.splice(i, 1, 'null');
    return 0;
  }
  }
    catcharr.push(value)
    console.log("配對失敗")
    console.log(catcharr)
}

io.on('connection', function(socket){
  socket.on('catch',msg=>{
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
    // console.log(msg)
    let checkresult = checkobj(socket.id, msg.obj)
    console.log(checkresult)
    if (checkresult) {
      io.sockets.connected[msg.obj].emit('msg', {content:`${msg.content}`,me:false});
    }
    else{
      io.sockets.connected[socket.id].emit('leave', '對方已離開');
      for(i in catchedarr){
    if(socket.id == catchedarr[i]||msg.obj == catchedarr[i]){//清空已配對陣列中存放的id
      catchedarr.splice(i, 1, 'null');
      console.log(catchedarr);
    }
  }
    }
  });
});
io.on('connection', function(socket){
  socket.on('leave', function(msg){
    io.sockets.connected[msg].emit('leave', '對方已離開');
    for(i in catchedarr){
    if(socket.id == catchedarr[i]||msg == catchedarr[i]){//清空已配對陣列中存放的id
      catchedarr.splice(i, 1, 'null');
      console.log(catchedarr);
    }
  }
  });
  socket.on("disconnect", () => {
    console.log('user disconnected')
    for(i in catchedarr){
    if(socket.id == catchedarr[i]){//清空已配對陣列中存放的id
      catchedarr.splice(i, 1, 'null');
    }
  }
});
});

