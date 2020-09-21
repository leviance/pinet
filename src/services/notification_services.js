const user_model = require('../models/users.model')
const {notifications_content} = require('../../lang/vi')
const notifications_model = require('../models/notifications.model')
const convert_timestamp = require('../helper/convert_timestamp')

let notif_recieved_request_contact = async (sender_req_id, receiver_req_id) => {
  let sender_data = await user_model.find_user_by_id(sender_req_id)
  let receiver_data = await user_model.find_user_by_id(receiver_req_id)

  let notifications_data = {
    sender: {
      id: sender_req_id,
      username: sender_data.username,
      avatar: sender_data.avatar
    },
    receiver: {
        id: receiver_req_id,
        username: receiver_data.username,
        avatar: receiver_data.avatar
    },
    type: "receive_request_cotact",
    content: notifications_content.receive_request_cotact(sender_data.username),
  }

  notifications_model.notif_recieved_request_contact(notifications_data)
}

let count_notifications = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let count_notifications = await notifications_model.count_notifications(user_id)
    return resolve(count_notifications)
  })
}

let get_list_notifications = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let list_notifications = await notifications_model.get_list_notifications(user_id)
    
    let list_notifications_infor = []

    // convert timestamp to human time
    for(let i = 0; i < list_notifications.length; i++) {
      let notification = list_notifications[i]

      list_notifications_infor.push({
        user_id: notification.sender.id,
        avatar: notification.sender.avatar,
        username: notification.sender.username,
        human_time: convert_timestamp(notification.created_at),
        type: notification.type,
        is_read: notification.is_read
      })
    }
  
    return resolve(list_notifications_infor)
  })
}

module.exports = {
  notif_recieved_request_contact,
  count_notifications,
  get_list_notifications
}