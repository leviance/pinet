const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let chats_group_schema = new Schema({
    name: String,
    users_amount: Number,
    messages_amount: Number,
    user_create_id: String,
    members: [
        {user_id: String}
    ],
    created_at: {type: Number, default: Date.now},
    updated_at: {type: Number, default: null},
    deleted_at: {type: Number, default: null}
})

chats_group_model = mongoose.model("chats_group", chats_group_schema)