const {list_socket} = require('../socket_io/user_socket/user_socket')

let emit_socket = (event_name, data,io) => {
  let receiver_id = data.receiver_id;

  if(list_socket[receiver_id]){
    list_socket[receiver_id].forEach( socket_id => {
      io.sockets.connected[socket_id].emit(event_name,data);
    })
  }
}

module.exports = emit_socket