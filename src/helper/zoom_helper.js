const axios = require('axios');
const {zoom_messages} = require('../../lang/vi')

const data_to_create_meetting = {
  "topic": "Test Zoom api",
  "type": 1,
  "password": "12341",
  "agenda": "This meetting created for testing Zoom API",
  "settings": {
    "host_video": true,
    "participant_video": false,
    "cn_meeting": false,
    "in_meeting": false,
    "mute_upon_entry": false,
    "watermark": false,
    "use_pmi": false,
    "approval_type": 2,
    "audio": "both",
    "waiting_room": true,
    "auto_recording": "none",
  }
}

const Zoom_Authenticate = (zoom_code) => {
  return new Promise( async (resolve, reject) => {
    let url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${zoom_code}&redirect_uri=${process.env.ZOOM_AUTH_TOKEN_CALLBACK}`
    let authorization = `Basic ${Buffer.from(process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET).toString("base64")}`

    axios.post(url, {} ,{
      headers: {
        "Authorization": authorization
      }
    }).then( async (response) => {
        if(response.data.access_token){
          let user_data = await Get_userID(response.data.access_token)
          
          //let result_create_meeting = await Create_Meetting_Zoom(response.data.access_token, user_data.id)

          return resolve({zoom_user_data: user_data, zoom_token: response.data})
        }
        
        return reject(zoom_messages.could_not_get_zoom_token)
      }).catch(error => {
        return reject(zoom_messages.error_when_getting_zoom_token(error))
      })
  })
}

const Get_userID = (access_token) => {
  return new Promise( async (resolve, reject) => {
    let user_data = await axios.get("https://api.zoom.us/v2/users/me", {
      headers: {
        "Authorization": `Bearer  ${access_token}`
      }
    })

    return resolve(user_data.data)
  })
}

const Create_Meetting_Zoom = (access_token, user_id) => {
  return new Promise( async (resolve, reject) => {
    axios.post(`https://api.zoom.us/v2/users/${user_id}/meetings`, data_to_create_meetting,{
      headers: {
        "Authorization": `Bearer  ${access_token}`
      }
    }).then( response => {

      return resolve(response.data)
    }).catch( err => {
      return reject(err)
    })
  })
}

const Refreshing_Token = (refresh_token) => {
  return new Promise( async (resolve, reject) => {
    let url = `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${refresh_token}`
    let authorization = `Basic ${Buffer.from(process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET).toString("base64")}`

    axios.post(url, {}, {
      headers: {
        "Authorization": authorization
      }
    }).then( response => {

      return resolve(response.data)
    }).catch( err => {
      return reject(err)
    })
  })
}

module.exports = {
  Zoom_Authenticate,
  Create_Meetting_Zoom,
  Refreshing_Token
}