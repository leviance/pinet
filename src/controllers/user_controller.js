const {user_services} = require('../services/index')
const {app} = require('../config/app')
const {user_settings} = require('../../lang/vi')
const uid = require('uid')
const multer = require('multer')

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, app.avatar_directory)
  },
  filename: function (req, file, cb) {
    let match = app.avatar_type
    if(match.indexOf(file.mimetype) == -1) return cb(user_settings.avatar_type_error, null)

    let avatar_name = `${uid()}-${new Date().getTime()}-${file.originalname}` 
    cb(null, avatar_name)
  }
})
 
let upload_avatar = multer({ 
  storage: storage,
  limits: {fileSize: app.avatar_limit_size}
}).single("avatar")

let user_upload_avatar = async (req, res) => {

  upload_avatar(req, res, async (error) => {

    if(error) {
      if(error.message){
        return res.status(500).send(user_settings.avatar_type_error)
      }

      return res.status(500).send(error)
    }

    
    try {
      let file_name = req.file.filename
      let user_id = req.session.user_id

      await user_services.user_upload_avatar(file_name,user_id)

      return res.status(200).send()

    } catch (error) {
      return res.status(500).send(user_settings.unspecified_error)
    }
  })

}

module.exports = {
  user_upload_avatar
}