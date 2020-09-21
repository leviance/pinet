const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let notifications_schema = new Schema({
    sender: {
        id: String,
        username: String,
        avatar: String
    },
    receiver: {
        id: String,
        username: String,
        avatar: String
    },
    type: String,
    content: String,
    is_read: {type: Boolean, default: false},
    created_at: {type: Number, default: Date.now}
})

notifications_schema.statics = {
    notif_recieved_request_contact(notifications_data){
        return this.create(notifications_data)
    },

    count_notifications(user_id){
        return this.countDocuments({
            "receiver.id":  user_id,
            "is_read": false
        }).exec()
    },

    get_list_notifications(user_id){
        return this.find({
            "receiver.id":  user_id,
        }).limit(15).sort({"created_at": -1}).exec()
    }
}

module.exports = mongoose.model('notifications', notifications_schema)