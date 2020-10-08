const {contact_services,group_services, notification_services} = require('../services/index')

const notification_socket = require('../socket_io/notification_socket/notification_socket')
const emit_socket = require('../helper/emit_socket')

let get_list_friends_to_create_group = async (req, res) => {
  let user_id = req.session.user_id
  let list_friends = await contact_services.get_list_friends(user_id)

  return res.status(200).send(list_friends)
} 

let create_new_group = async (req, res) => {
  try {
    let user_id = req.session.user_id
    let list_id_members = req.body.list_id_members
    let group_name = req.body.group_name.trim()
    let invite_message = req.body.invite_message.trim()

    if(list_id_members.length < 2 || group_name.length < 1) return res.status(500).send()

    let result_create_group = await group_services.create_new_group(user_id,list_id_members,group_name,invite_message)
    
    // send req real time to members 
    for(let i = 0 ; i < result_create_group.members.length; i++){
      let member_id = result_create_group.members[i]
      let data_to_emit = result_create_group
      data_to_emit.receiver_id = member_id

      emit_socket('receiver-create-new-group',data_to_emit,req.io)
    }

    // send notification
    let notifications = await notification_services.notification_new_group(user_id,list_id_members,group_name)
    notification_socket.notification_new_group(notifications,req.io)

    return res.status(200).send(result_create_group)
  } catch (error) {
    return res.status(500).send()
  }
}

module.exports = {
  get_list_friends_to_create_group,
  create_new_group
}