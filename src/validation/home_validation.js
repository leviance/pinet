const {check} = require('express-validator')
const {user_settings} = require('../../lang/vi')

let valid_user_edit_infor = (data) => {
  return new Promise((resolve, reject) => {
    if(data.username){
      let re = /^[A-Za-z0-9âăêưôđơèéẹẻẽỳýỵỹỷểệễềếủũụùúửữựừứỉĩịìíòóỏõọổồốỗộảạãáàẳặẵắằẩẫậấầÂĂÊƯÔĐƠÈÉẸẺẼỲÝỴỸỶỂỆỄỀẾỦŨỤÙÚỬỮỰỪỨỈĨỊÌÍÒÓỎÕỌỔỒỐỖỘẢẠÃÁÀẲẶẴẮẰẨẪẬẤẦ ]+$/
      
      if(!re.test(data.username)) return reject(user_settings.username_error)
      if(data.username.length > 50 || data.username < 1) return reject(user_settings.username_error)

    }
    if(data.email){
      let re = /^[a-zA-Z0-9]+(@gmail\.com)$/

      if(!re.test(data.email)) return reject(user_settings.email_error)
      if(data.email.length > 100 || data.email.length < 11) return reject(user_settings.email_error)

    }
    if(data.age){

      let age = Number(data.age)
      if(age < 0 || age > 100) return reject(user_settings.age_error)

    }

    if(data.address){
      if(data.address.length < 2 || data.address.length > 200) return reject(user_settings.address_error)
    }

    if(data.classes){
      if(data.classes.length < 2 || data.classes.length > 50) return reject(user_settings.class_error)
    }

    return resolve()
  })
}

module.exports = {
  valid_user_edit_infor
}