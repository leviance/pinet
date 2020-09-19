const _ = require('lodash');

let list_socket = {};

let user_socket = (io) => {
  io.on('connection', socket => {
    let user_id = socket.request.session.user_id;
      
    // nếu  có list_socket id của user_id thì đẩy socket id vào trong mảng user_id
    if(list_socket[user_id]){
      list_socket[user_id].push(socket.id);
    }
    // nếu chưa có danh sách socket id của user_id thì tạo mới
    else {  
      list_socket[user_id] = [socket.id];
    }

    // lọc những socket id đã disconnected ra khỏi mảng 
    socket.on('disconnect', () =>{
        _.remove(list_socket[user_id], function(socketId) {
          return socketId === socket.id;
        });

        if(list_socket[user_id] === []) delete list_socket[user_id];
    });
 
  });
  
}

module.exports.user_socket = user_socket;
module.exports.list_socket = list_socket;