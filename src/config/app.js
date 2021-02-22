module.exports.app  = {
  avatar_directory : "src/public/assets/images/users",
  avatar_type : ['image/jpg','image/png','image/gif', 'image/jpeg'],
  avatar_limit_size : 1048576 * 10,
  file_attachment_limit_size : 1048576 * 1024,
  chat_personal: "chat_personal",
  chat_group: "chat_group"
}

module.exports.log_type = {
  data_create_meeting: 'data_create_meeting',
  zoom_user_data: 'zoom_user_data'
}