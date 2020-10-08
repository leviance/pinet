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
    get_list_messages(sender_id,receiver_id, skip){
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
    }
}

module.exports = mongoose.model('messages',messages_schema)
