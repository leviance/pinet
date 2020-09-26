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
    create_new_notification(notifications_data){
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
        }).limit(20).sort({"created_at": -1}).exec()
    },

    mark_notifications_as_read(user_id){
        return this.updateMany(
            {"receiver.id": user_id},
            {"is_read": true}).exec()
    },

    read_more_notifications(user_id, skip){
        return this.find({
            "receiver.id":  user_id,
        }).limit(13).sort({"created_at": -1}).skip(skip).exec()
    },

    remove_all_notifications(user_id){
        return this.deleteMany({"receiver.id": user_id}).exec()
    }
}

module.exports = mongoose.model('notifications', notifications_schema)