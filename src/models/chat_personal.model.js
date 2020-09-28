const mongoose = require('mongoose');
const Schema = mongoose.Schema;
    
let chat_personal_schema = new Schema({
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
    text: {type: String, default: null},
    file: {type: String, default: null},
    images: [],
    file_size: {type: String, default: null},
    created_at: {type: Number, default: Date.now},
    updated_at: {type: Number, default: null},
    deleted_at: {type: Number, default: null}

})

chat_personal_schema.statics = {
    get_list_messages(yourself_user_id,partner_id, skip){
        return this.find({
            $and: [
                {
                    $or: [
                        {
                            "sender.id": yourself_user_id,
                            "receiver.id": partner_id
                        },
                        {
                            "sender.id": partner_id,
                            "receiver.id": yourself_user_id
                        }
                    ]
                },
                {"deleted_at": null}
            ]
        }).limit(25).sort({"created_at": -1}).skip(skip).exec()
    }
}

module.exports = mongoose.model('chat_personal',chat_personal_schema)
