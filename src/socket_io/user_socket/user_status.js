const emit_socket = require('../../helper/emit_socket');
const {notification_services} = require('../../services/index')

const stt_user_is_offline = async (user_id, io) => {
    try {
        let list_friends_id = await notification_services.stt_user_is_offline(user_id)
        
        list_friends_id.forEach(friend_id => {
            let data_to_emit = {
                receiver_id: friend_id,
                user_id: user_id
            }
            emit_socket("user-status-is-offline", data_to_emit, io)
        })
    } catch (error) {
        console.log(error);
    }
}

const stt_user_is_oinline = async (user_id, io) => {
    try {
        let list_friends_id = await notification_services.stt_user_is_offline(user_id)
        
        list_friends_id.forEach(friend_id => {
            let data_to_emit = {
                receiver_id: friend_id,
                user_id: user_id
            }
            emit_socket("user-status-is-online", data_to_emit, io)
        })
    } catch (error) {
        console.log(error);
    }
}

const get_list_status_friends_online = async (user_id, io) => {
    const {list_socket} = require('./user_socket');
    let list_friends_id = await notification_services.stt_user_is_offline(user_id)

    let list_friend_id_online = [];

    list_friends_id.forEach((friend_id) => {
        if(list_socket[friend_id]) list_friend_id_online.push(friend_id);
    })

    let data_to_emit = {
        receiver_id: user_id,
        list_friend_id_online
    }

    emit_socket("receive-list-friend-id-online", data_to_emit, io)
}

const get_friends_status_when_get_message = (data,user_id, io) => {
    const {list_socket} = require('./user_socket');

    let data_to_emit = {
        receiver_id: user_id,
        user_id: data.user_id,
    }

    if(list_socket[data.user_id]) {
        data_to_emit.status = "online"
        emit_socket("response-get-stauts-friend", data_to_emit, io)
    }
    else{
        data_to_emit.status = "offline"
        emit_socket("response-get-stauts-friend", data_to_emit, io)
    }
}

const user_status = (io) => { 
    io.on('connection', socket => {
        let user_id = socket.request.session.user_id;

        stt_user_is_oinline(user_id, io);

        socket.on('get-list-status-friends', () => {
            get_list_status_friends_online(user_id, io);
        })

        socket.on('disconnect', () => {
            stt_user_is_offline(user_id,io);
        })

        socket.on("get-stauts-friend", data => {
            get_friends_status_when_get_message(data,user_id, io);
        })
    })
}

module.exports = user_status