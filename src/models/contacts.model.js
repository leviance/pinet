const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let contacts_schema = new Schema({
    user_id: String,
    contact_id: String,
    status: Boolean,
    created_at: {type: Number, default: Date.now},
    updated_at: {type: Number, default: null},
    deleted_at: {type: Number, default: null}
});

let contacts_model = mongoose.model('contacts',contacts_schema)