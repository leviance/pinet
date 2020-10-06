const {app} = require('../config/app')
const uid = require('uid')
const multer = require('multer')

let image_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, app.avatar_directory)
  },
  filename: function (req, file, cb) {
    let match = app.avatar_type
    if(match.indexOf(file.mimetype) == -1) return cb(send_message_error.send_image_type_error, null)

    let name = `${uid()}-${new Date().getTime()}-${file.originalname}` 
    cb(null, name)
  }
})

let file_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, app.avatar_directory)
  },
  filename: function (req, file, cb) {
    let name = `${uid()}-${new Date().getTime()}-${file.originalname}` 
    cb(null, name)
  }
})

let message_image = multer({ 
  storage: image_storage,
  limits: {fileSize: app.avatar_limit_size}
}).array('message_images',50);

let message_file = multer({ 
  storage: file_storage,
  limits: {fileSize: app.file_attachment_limit_size}
}).array('message_file',50);

module.exports = {
  message_image,
  message_file
}