const groups_model = require('../models/groups.model')
const messages_model = require('../models/messages.model')
const {app} = require('../config/app')
const _ = require('lodash')

let create_new_group = (user_id,list_id_members,group_name,invite_message) => {
  return new Promise( async (resolve, reject) => {
    let model = {
      group_name: group_name,
      user_created_id : user_id,
      user_amount : list_id_members.length + 1,
      members: list_id_members,
      invite_message: invite_message,
    }

    // check list_id_members is friend of user_id do late

    let result_create_group = await groups_model.create_new(model)

    return resolve(result_create_group)
  })
}

let get_list_groups = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let list_groups = await groups_model.get_list_group(user_id)

    return resolve(list_groups)
  })
}

let get_list_members = (group_id,user_id) => {
  return new Promise( async (resolve, reject) => {
    let group_data = await groups_model.get_list_members(group_id,user_id)

    if(group_data == null) return reject()
 
    let list_members_id = group_data.members
    list_members_id.push(group_data.user_created_id)

    _.remove(list_members_id, function(member_id) {
      return member_id == user_id;
    });

    return resolve(list_members_id)
  })
}

module.exports = {
  create_new_group,
  get_list_groups,
  get_list_members
}