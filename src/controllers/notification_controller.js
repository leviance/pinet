const {notification_services} = require('../services/index')

let mark_notifications_as_read = (req, res) => {
  let user_id = req.session.user_id
  notification_services.mark_notifications_as_read(user_id)
  return res.status(200).send()
}

module.exports = {
  mark_notifications_as_read
}