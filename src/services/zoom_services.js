const zoom_model = require('../models/zoom.model')
const group_model = require('../models/groups.model')
const logs_model = require('../models/logs.model')
const zoom_helper = require('../helper/zoom_helper')

const {zoom_messages} = require('../../lang/vi')
const {log_type} = require('../config/app')

const Store_Zoom_Token_And_User_Data = (zoom_data,user_id) => {
  return new Promise( async (resolve, reject) => {
    let data_zoom_model = {
      "user_id": user_id,
      "token": zoom_data.zoom_token,
      "user_data": zoom_data.zoom_user_data
    }

    let data_log_model = {
      "log_type": log_type.zoom_user_data,
      "user_id": user_id,
      "data": zoom_data.zoom_user_data
    }

    await logs_model.remove_log_data(user_id)
    logs_model.create_new(data_log_model)

    await zoom_model.remove_old_token(user_id)
    await zoom_model.create_new(data_zoom_model)
    
    return resolve()
  })
}

const Create_Group_Meeting = (user_id,group_id) => {
  return new Promise( async (resolve, reject) => {
    let group_data = await group_model.check_user_in_group(user_id, group_id)
    
    if(group_data == null) return reject(zoom_messages.unspecified_error)

    // id of all members in the group
    let group_members = group_data.members
    group_members.push(group_data.user_created_id)

    // nếu trong nhóm chưa có zoom meeting
    if(group_data.link_join_meeting == null){
      if(group_data.user_created_id == user_id){
        // find zoom access token and user id
        let zoom_data = await zoom_model.find_data_by_id(user_id)

        // if not found zoom token return this for client redirect to link zoom auth
        if(!zoom_data) return resolve({user_has_not_authorized: "does not have token in database"})

        zoom_data = zoom_data.toObject()

        // try create Meeting with token store in DB
        try {
          let meeting_data = await zoom_helper.Create_Meetting_Zoom(zoom_data.token.access_token,zoom_data.user_data.id)
          
          let data_model = {
            "log_type": log_type.data_create_meeting,
            "data": meeting_data
          }
          logs_model.create_new(data_model)

          await group_model.store_join_meeting_url(group_id, meeting_data.join_url)
          
          return resolve({
            "link_join_meeting": meeting_data.join_url, 
            "group_members": group_members
          })
        } catch (error) {
          // this error can appear when token expried 
          try {
            // refreshing zoom token
            let new_zoom_token = await zoom_helper.Refreshing_Token(zoom_data.token.refresh_token)
            
            // store new token in database
            zoom_model.store_new_token(user_id, new_zoom_token)

            let meeting_data = await zoom_helper.Create_Meetting_Zoom(new_zoom_token.access_token,zoom_data.user_data.id)
            
            let data_model = {
              "log_type": log_type.data_create_meeting,
              "data": meeting_data
            }
            logs_model.create_new(data_model)

            await group_model.store_join_meeting_url(group_id, meeting_data.join_url)
          
            return resolve({
              "link_join_meeting": meeting_data.join_url, 
              "group_members": group_members
            })
          } catch (error) {
            // if can not refeshing zoom token
            return reject(zoom_messages.error_when_refeshing_zoom_token)
          }
        }
      }

      return resolve({message: zoom_messages.not_enough_authority_to_create_meeting})
    }

    // nếu trong nhóm đã có zoom meeting đang diễn ra
    if(group_data.link_join_meeting != null) //return resolve({"link_join_meeting": group_data.link_join_meeting})
    return resolve({
      "link_join_meeting": group_data.link_join_meeting, 
      "group_members": group_members
    })
  })
}



module.exports = {
  Store_Zoom_Token_And_User_Data,
  Create_Group_Meeting
}