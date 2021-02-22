const {zoom_services} = require('../services/index')
const zoom_helper = require('../helper/zoom_helper')
const {app} = require('../config/app')

const Zoom_User_Uninstall = (req, res) => {
  console.log("zoom-user-uninstall");
  console.log("-----------------------------------------------")
  console.log(req)
  console.log("-----------------------------------------------")
  
  return res.status(200).send()
}

const Zoom_Auth_Domain = (req, res) => {
  return res.render('./services_pages/verifyzoom')
}

const Authenticate_Zoom = async (req, res) => {
  if(req.query.code){
    try {
      let user_id = req.session.user_id

      let zoom_data = await zoom_helper.Zoom_Authenticate(req.query.code)

      await zoom_services.Store_Zoom_Token_And_User_Data(zoom_data,user_id)

      return res.render('./services_pages/get_zoom_token_success')
    } catch (error) {
      return res.status(500).send(error)
    }
  }
  else{
    return res.status(500).send("Error does not have zoom code return")
  }
}


const User_Click_Btn_Call_Video = async (req, res) => {
  try {
    let user_id = req.session.user_id
    let chat_type = req.body.chat_type
    let chat_id = req.body.chat_id

    // handle call video personal latter
    if(chat_type == app.chat_personal) return res.status(500).send("Bạn chỉ có thể gọi video trong chat nhóm")

    if(chat_type == app.chat_group){
      let result = await zoom_services.Check_Have_Been_Any_Meeting_In_Group(user_id,chat_id)
    
      // handle real time notification for all user in group

      return res.status(200).send(result)
    }
  } catch (error) {
    return res.status(500).send(error)
  }
}

// const refresh_zoom_token = () => {
//   return new Promise( async (resolve, reject) => {

//   })
// }

module.exports = {
  Zoom_User_Uninstall,
  Zoom_Auth_Domain,
  Authenticate_Zoom,
  User_Click_Btn_Call_Video
}