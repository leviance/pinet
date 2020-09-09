const user_model = require('../models/users.model')
const {user_settings} = require('../../lang/vi')
const send_mail = require('../config/send_mail')
const uid = require('uid')
const verify_code_model = require('../models/verify_code_model')


let get_data_user = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let data_user = await user_model.find_user_by_id(user_id)
    //console.log(data_user)
    return resolve(data_user)
  })
}

let user_upload_avatar = (file_name, user_id) => {
  return new Promise( async (resolve, reject) => {
    let result_update = await user_model.user_upload_avatar(file_name, user_id)

    if(result_update.nModified == 0) return reject()

    return resolve()
  })
}

let user_edit_information = (user_id, data, url) => {
  return new Promise( async (resolve, reject) => {
    let check_email_changed = false
    let user_data = await user_model.find_user_by_id(user_id)

    let data_to_update = {}

    if(data.username) {
      if(user_data.student.student_code) return reject(user_settings.student_can_not_change)
      data_to_update.username = data.username
    }
    if(data.email) {
      // if user register with gg,fb can not change email
      if(user_data.local.email === false) {
        return reject(user_settings.email_can_not_change)
      }

      // else send link verify for user to change email address
      check_email_changed = true
      
    }
    if(data.age) {
      if(user_data.student.student_code) return reject(user_settings.student_can_not_change)
      data_to_update.age = data.age
    }
    if(data.address) {
      if(user_data.student.student_code) return reject(user_settings.student_can_not_change)
      data_to_update.address = data.address
    }
    if(data.classes) {
      if(user_data.student.student_code) return reject(user_settings.student_can_not_change)
      data_to_update.classes = data.classes
    }

    let result_update = await user_model.user_update_informations(user_id, data_to_update)
  
    if(result_update.nModified == 0 && check_email_changed === false) return reject(user_settings.update_infor_error)

    if(check_email_changed === true) {
      let verify_code = `${uid()}${new Date().getTime()}`
      let new_email = data.email
      let old_email = user_data.local.email

      let url_to_change_email = `${url}/verify-to-change-email/${verify_code}/${new_email}/${old_email}`
      
      // store verify code to DB
      await verify_code_model.create_change_email_verify_code(new_email, verify_code)

      // send link verify for user to change email address
      send_mail(old_email,user_settings.subject_to_change_email, user_settings.html_to_change_email(url_to_change_email))

      return resolve(user_settings.status_change_email)
    }

    return resolve(user_settings.update_infor_success)
  })
}

let user_change_email = (verify_code, new_email, old_email) => {
  return new Promise( async (resolve, reject) => {
    let find_verify_code_change_email = await verify_code_model.find_verify_code_change_email(verify_code, new_email)
    
    if(!find_verify_code_change_email) return reject()

    await verify_code_model.remove_verify_code(new_email, verify_code)

    await user_model.user_change_email(old_email,new_email)
    
    return resolve()
  })
}

let search_friend_to_add_contact = (key_word) => {
  return new Promise( async (resolve, reject) => {
    let result_search = await user_model.find_by_keyword(key_word)
    
    if(result_search.length === 0) return reject()

    return resolve(result_search)
  })
}

module.exports = {
  get_data_user,
  user_upload_avatar,
  user_edit_information,
  user_change_email,
  search_friend_to_add_contact
}