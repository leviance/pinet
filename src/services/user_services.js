const user_model = require('../models/users.model')


let get_data_user = async (user_id) => {
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

module.exports = {
  get_data_user,
  user_upload_avatar
}