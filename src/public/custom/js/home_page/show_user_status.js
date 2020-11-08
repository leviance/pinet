function get_friends_status_when_get_message(user_id){
    let data_to_emit = {
        user_id
    }

    socket.emit("get-stauts-friend",data_to_emit );

    socket.on("response-get-stauts-friend", function(data){
        let id_in_chat_frame = $('#chat-frame').attr("data-uid")
        
        if(id_in_chat_frame == data.user_id){
            if(data.status == "online"){
                $("#dot-status-user-inchat-frame").removeClass("text-success")
                $("#dot-status-user-inchat-frame").removeClass("text-secondary")
                $("#dot-status-user-inchat-frame").addClass("text-success")
            }
            if(data.status == "offline"){
                $("#dot-status-user-inchat-frame").removeClass("text-secondary")
                $("#dot-status-user-inchat-frame").removeClass("text-success")
                $("#dot-status-user-inchat-frame").addClass("text-secondary")
            }
        }
    })
}

function get_group_status_when_get_message(){
    $("#dot-status-user-inchat-frame").removeClass("text-success")
    $("#dot-status-user-inchat-frame").removeClass("text-secondary")
    $("#dot-status-user-inchat-frame").addClass("text-success")
}

$(document).ready(function(){
    socket.emit("get-list-status-friends");

    socket.on('user-status-is-online', data => {
        let message = $("#chat-message-list").find(`li[data-uid=${data.user_id}]`)
        message.find(".chat-user-img").removeClass("offline");
        message.find(".chat-user-img").removeClass("online");
        message.find(".chat-user-img").addClass("online");

        let id_in_chat_frame = $('#chat-frame').attr("data-uid")
        if(id_in_chat_frame == data.user_id){
            $("#dot-status-user-inchat-frame").removeClass("text-success")
            $("#dot-status-user-inchat-frame").removeClass("text-secondary")
            $("#dot-status-user-inchat-frame").addClass("text-success")
        }
    })

    socket.on('user-status-is-offline', function(data){
        let message = $("#chat-message-list").find(`li[data-uid=${data.user_id}]`)
        message.find(".chat-user-img").removeClass("online");
        message.find(".chat-user-img").removeClass("offline");
        message.find(".chat-user-img").addClass("offline");

        let id_in_chat_frame = $('#chat-frame').attr("data-uid")
        if(id_in_chat_frame == data.user_id){
            $("#dot-status-user-inchat-frame").removeClass("text-secondary")
            $("#dot-status-user-inchat-frame").removeClass("text-success")
            $("#dot-status-user-inchat-frame").addClass("text-secondary")
        }
    });

    socket.on('receive-list-friend-id-online',data => {
        let list_friend_id_online = data.list_friend_id_online;

        list_friend_id_online.forEach((friend_id) => {
            let message = $("#chat-message-list").find(`li[data-uid=${friend_id}]`);
            message.find(".chat-user-img").removeClass("offline");
            message.find(".chat-user-img").removeClass("online");
            message.find(".chat-user-img").addClass("online");
        })
    })
})