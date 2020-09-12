const {user_services} = require('../services/index')
const {app} = require('../config/app')
const {user_settings} = require('../../lang/vi')
const uid = require('uid')
const multer = require('multer')
const {home_valid} = require('../validation/index')
const { validationResult } = require('express-validator');

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

let user_edit_information = async (req, res) => {
  let data = req.body
  let user_id = req.session.user_id
  let url = `${req.protocol}://${req.get("host")}`
  
  for (let key in data){
    if(data[key] == "") delete data[key]
  }

  try {
    await home_valid.valid_user_edit_infor(data)
    
    let result_valid = await user_services.user_edit_information(user_id, data, url)

    return res.status(200).send(result_valid)

  } catch (error) {
    return res.status(500).send(error)
  }
  
}

let user_change_email = async (req, res) => {
  let verify_code = req.params.verify_code;
  let new_email = req.params.new_email;
  let old_email = req.params.old_email;
  let result_valid = validationResult(req).errors;

  if(result_valid.length > 0) return res.status(500).send(result_valid[0].msg)

  let result_change_email = await user_services.user_change_email(verify_code, new_email, old_email)

  res.redirect('/login')
}


module.exports = {
  user_upload_avatar,
  user_edit_information,
  user_change_email
}