const emit_socket = require('../../helper/emit_socket')

let notification_new_group = (notifications,io) => {
  notifications.forEach((notification => {
    let data_to_emit = notification
    data_to_emit.receiver_id = notification.receiver.id

    emit_socket('receive-notification-join-new-group', data_to_emit, io)
  }))
}

module.exports = {
  notification_new_group,
}