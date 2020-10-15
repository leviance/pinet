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

let render_file_data_to_save_in_database = (files) => {
  return new Promise((resolve, reject) => {
    let files_data = []
    let re = /^([A-Za-z0-9]*-)([A-Za-z0-9]*-)/

    for(let i = 0; i < files.length; i++) {
      let file = files[i]

      let filename = file.filename
      filename = filename.replace(re, "")

      let file_data = {
        name: filename,
        src: file.filename,
        size: file.size
      }
      files_data.push(file_data)
    }

    return resolve(files_data)
  })
}

module.exports = {
  message_image,
  message_file,
  render_file_data_to_save_in_database
}