const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * app_mode: {light, drak}
 * album_image: {public, friend, private}
 * receive_contact: {true, false}
 * group_invitations: {public, friend, private}
 * personal_profile: {public, friend, private}
 */

let settings_schema = new Schema({
    user_id: String,
    app_mode: {type: String, default: "light"},
    album_images: {type: String, default: "public"},
    receive_contact: {type: Boolean, default: true},
    group_invitations: {type: String, default: "public"},
    notify_if_friend_have_new_activity: {type: Boolean, default: false},
    personal_profile: {type: String, default: "public"},
    remove_message_when_viewed: {type: Boolean, default: false},
    receive_strange_login_message: {type: Boolean, default: false},
    two_factor_authentication: {type: Boolean, default: false}
});

settings_schema.statics = {
    create_new(user_id){
        return this.create_new({user_id: user_id})
    },

    get_list_settings(user_id){
        return this.findOne({user_id: user_id}).exec()
    },

    user_change_view_mode(user_id, mode_user_choose){
        return this.updateOne({user_id: user_id},{app_mode: mode_user_choose}).exec();
    }
}

module.exports = mongoose.model('settings',settings_schema)