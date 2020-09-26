const {notification_services} = require('../services/index')

let mark_notifications_as_read = (req, res) => {
  let user_id = req.session.user_id
  notification_services.mark_notifications_as_read(user_id)
  return res.status(200).send()
}

let read_more_notifications = async (req, res) => {
  let user_id = req.session.user_id;
  let skip_notifications = Number(req.params.total_notifications);

  try {
    let notifications = await notification_services.read_more_notifications(user_id,skip_notifications)
    return res.status(200).send(notifications)
  } catch (error) {
    return res.status(500).send()
  }

}

let remove_all_notifications = (req, res) => {
  let user_id = req.session.user_id
  notification_services.remove_all_notifications(user_id)

  return res.status(200).send()
}

module.exports = {
  mark_notifications_as_read,
  read_more_notifications,
  remove_all_notifications
}