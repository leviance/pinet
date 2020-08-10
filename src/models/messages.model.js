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
    text: String,
    file: {data: Buffer, contentType: String, filename: String},
    created_at: {type: Number, default: Date.now},
    updated_at: {type: Number, default: null},
    deleted_at: {type: Number, default: null}

})

let messages_model = mongoose.model('messages',messages_schema)