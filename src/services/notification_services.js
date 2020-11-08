const user_model = require('../models/users.model');
const {notifications_content} = require('../../lang/vi');
const notifications_model = require('../models/notifications.model');
const contact_model = require('../models/contacts.model');
const convert_timestamp = require('../helper/convert_timestamp');

const _ = require('lodash');

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

  notifications_model.create_new_notification(notifications_data)
}

let notif_accept_request_contact = async (receiver_notif_id, sender_notif_id) => {
  let sender_data = await user_model.find_user_by_id(sender_notif_id)
  let receiver_data = await user_model.find_user_by_id(receiver_notif_id)

  let notifications_data = {
    sender: {
      id: sender_notif_id,
      username: sender_data.username,
      avatar: sender_data.avatar
    },
    receiver: {
        id: receiver_notif_id,
        username: receiver_data.username,
        avatar: receiver_data.avatar
    },
    type: "accept_request_cotact",
    content: notifications_content.accept_request_contact(sender_data.username),
  }
  
  await notifications_model.create_new_notification(notifications_data)

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
        is_read: notification.is_read,
        content: notification.content
      })
    }
    
    return resolve(list_notifications_infor)
  })
}

let mark_notifications_as_read = (user_id) => {
  notifications_model.mark_notifications_as_read(user_id)
}

let read_more_notifications = (user_id, skip_notifications) => {
  return new Promise( async (resolve, reject) => {
    let list_notifications = await notifications_model.read_more_notifications(user_id,skip_notifications)
    let list_notifications_infor = [];

    if(list_notifications.length > 0) {
      // convert timestamp to human time
      for(let i = 0; i < list_notifications.length; i++) {
        let notification = list_notifications[i]

        list_notifications_infor.push({
          sender_id: notification.sender.id,
          sender_avatar: notification.sender.avatar,
          sender_username: notification.sender.username,
          human_time: convert_timestamp(notification.created_at),
          type: notification.type,
          is_read: notification.is_read,
          content: notification.content
        })
      }

      return resolve(list_notifications_infor)
    }
    
    return reject()
  })
}

let remove_all_notifications = (user_id) => {
  notifications_model.remove_all_notifications(user_id)
}

let notification_new_group = (sender_id,list_id_members,group_name) => {
  return new Promise( async (resolve, reject) => {
    let sender_data = await user_model.find_user_by_id(sender_id)

    let list_notifications = []

    for(let i = 0; i < list_id_members.length; i++) {
      let receiver_id = list_id_members[i]

      let receiver_data = await user_model.find_user_by_id(receiver_id)

      let notification_data = {
        sender: {
          id: sender_id,
          username: sender_data.username,
          avatar: sender_data.avatar
        },
        receiver: {
            id: receiver_id,
            username: receiver_data.username,
            avatar: receiver_data.avatar
        },
        type: "notification_new_group",
        content: notifications_content.notification_new_group(sender_data.username, group_name),
      }

      let notification = await notifications_model.create_new_notification(notification_data)

      list_notifications.push(notification)
    }

    return resolve(list_notifications)
  })
}

let stt_user_is_offline = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let list_contacts = await contact_model.find_contact_by_id(user_id);
    let list_contacts_id = [];

    list_contacts.forEach(contact => {
      list_contacts_id.push(contact.sender_id);
      list_contacts_id.push(contact.receiver_id);
    });

    _.remove(list_contacts_id, function(n){
      return n == user_id
    });

    return resolve(list_contacts_id);
  })
}

module.exports = {
  notif_recieved_request_contact,
  count_notifications,
  get_list_notifications,
  notif_accept_request_contact,
  mark_notifications_as_read,
  read_more_notifications,
  remove_all_notifications,
  notification_new_group,
  stt_user_is_offline
}