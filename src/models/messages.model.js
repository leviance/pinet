const mongoose = require('mongoose');
const Schema = mongoose.Schema;
    
let messages_schema = new Schema({
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
    reader: [],
    is_read: {type: Boolean, default: false},
    text: {type: String, default: null},
    file: {type: String, default: null},
    file_src: {type: String, default: null},
    images: [],
    file_size: {type: String, default: null},
    created_at: {type: Number, default: Date.now},
    updated_at: {type: Number, default: null},
    deleted_at: {type: Number, default: null}

})

messages_schema.statics = {
    get_list_messages_personal(sender_id,receiver_id, skip){
        return this.find({
            $and: [
                {
                    $or: [
                        {
                            "sender.id": sender_id,
                            "receiver.id": receiver_id
                        },
                        {
                            "sender.id": receiver_id,
                            "receiver.id": sender_id
                        }
                    ]
                },
                {"deleted_at": null}
            ]
        }).limit(25).sort({"created_at": -1}).skip(skip).exec()
    },

    get_list_messages_group(group_id, skip) {
        return this.find({
            $and: [
                {"receiver.id": group_id},
                {"deleted_at": null}
            ]
        }).limit(50).sort({"created_at": -1}).skip(skip).exec()
    },

    create_new(model){
        return this.create(model)
    },

    check_sent_message(sender_id,receiver_id){
        return this.find({
            $or: [
                {
                    "sender.id": sender_id,
                    "receiver.id": receiver_id,
                    "deleted_at": null
                },
                {
                    "sender.id": receiver_id,
                    "receiver.id": sender_id,
                    "deleted_at": null
                }
            ]
        }).sort({"created_at": -1}).limit(1).exec()
    },

    check_sent_message_in_group(group_id){
        return this.find({
            "receiver.id": group_id
        }).sort({"created_at": -1}).limit(1).exec()
    },

    count_message_not_read_group(user_id, group_id, message_type){
        return this.find({
            "receiver.id": group_id,
            "type": message_type,
            "sender.id": {$nin: [user_id]},
            "reader": {$nin: [user_id]}
        }).count().exec()
    },

    count_message_not_read_personal(user_id, partner_id, message_type){
        return this.find({
            "sender.id": partner_id,
            "receiver.id": user_id,
            "type": message_type,
            "is_read": false
        }).count().exec()
    },

    marked_as_viewed_message_personal(user_id, friend_id){
        this.updateMany({
            "receiver.id": user_id,
            "sender.id": friend_id,
            "is_read": false
        },{"is_read": true}).exec()
    },

    marked_as_viewed_message_group(user_id,group_id){
        this.updateMany({
            "receiver.id": group_id,
            "sender.id": {$nin: [user_id]},
            "reader": {$nin: [user_id]}
        },{$push: {"reader": user_id}}).exec()
    }
}

module.exports = mongoose.model('messages',messages_schema)
