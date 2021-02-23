const {zoom_services} = require('../services/index')
const zoom_helper = require('../helper/zoom_helper')
const message_controller = require('./message_controller')
const {app} = require('../config/app')

const emit_socket = require('../helper/emit_socket')
const { forEach } = require('lodash')

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
      let result_create_meeting = await zoom_services.Create_Group_Meeting(user_id,chat_id)
      let result_send_mess = null
      
      // handle real time notification for all user in group
      if(result_create_meeting.group_members){
        result_create_meeting.group_members.forEach( member_id => {
          if(member_id != user_id) {
            let data_to_emit = {
              group_id: chat_id,
              receiver_id: member_id,
              link_join_meeting: result_create_meeting.link_join_meeting
            }
  
            emit_socket('receiver-meeting-created',data_to_emit, req.io)
          }
        })

        let sender = {
          id: req.session.user_id,
          username: req.session.username,
          avatar: req.session.avatar
        }

        let group_id = chat_id
        let message = `Lớp học đã bắt đầu: ${result_create_meeting.link_join_meeting}`

        result_send_mess = await message_controller.module_send_text_message_group(sender,group_id,message, req.io)
      }

      return res.status(200).send({result_create_meeting,result_send_mess})
    }
  } catch (error) {
    return res.status(500).send(error)
  }
}

const Zoom_Notification = (req, res) => {
  console.log(req)
  return res.status(200).send()
}

module.exports = {
  Zoom_User_Uninstall,
  Zoom_Auth_Domain,
  Authenticate_Zoom,
  User_Click_Btn_Call_Video,
  Zoom_Notification
}