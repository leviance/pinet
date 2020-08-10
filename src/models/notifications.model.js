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

let notifications_model = mongoose.model('notifications', notifications_schema)