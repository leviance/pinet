const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let contacts_schema = new Schema({
    sender_id: String,
    receiver_id: String,
    status: {type: Boolean, default: false},
    created_at: {type: Number, default: Date.now},
    updated_at: {type: Number, default: null},
    deleted_at: {type: Number, default: null},
});

contacts_schema.statics = {
    add_friend_with_admin(user_id, admin_id) {
        return this.create({
            "sender_id": admin_id,
            "receiver_id": user_id,
            "status": true
        })
    },

    create_new(sender_req_id,receiver_req_id){
        return this.create({
            "sender_id": sender_req_id,
            "receiver_id": receiver_req_id
        })
    },

    find_contact_by_id(user_id){
        return this.find({
            $or: [
                {"sender_id": user_id},
                {"receiver_id": user_id}
            ]
        }).exec()
    },

    find_contact_sent(user_id, skip){
        return this.find({
            $and: [
                {"sender_id": user_id},
                {"status": false}
            ]
        }).limit(20).sort({"created_at": -1}).skip(skip).exec()
    },

    find_contact_received(user_id, skip){
        return this.find({
            $and: [
                {"receiver_id": user_id},
                {"status": false}
            ]
        }).limit(20).sort({"created_at": -1}).skip(skip).exec()
    },

    remove_contact(sender_req_id, receiver_req_id){
        return this.deleteOne({
            "sender_id": sender_req_id,
            "receiver_id": receiver_req_id
        }).exec()
    },

    find_contact(sender_req_id, receiver_req_id){
        return this.findOne({
            $or: [
                {"sender_id": sender_req_id, "receiver_id": receiver_req_id},
                {"sender_id": receiver_req_id, "receiver_id": sender_req_id}
            ],
            "status": true
        }).exec()
    },

    count_contact_received(user_id){
        return this.countDocuments({
            "receiver_id": user_id,
            "status": false
        }).exec()
    },

    count_contact_sent(user_id){
        return this.countDocuments({
            "sender_id": user_id,
            "status": false
        }).exec()
    },

    accept_contact_received(sender_id,receiver_id){
        return this.updateOne({
            "sender_id": sender_id,
            "receiver_id": receiver_id
        },{"status": true}).exec()
    },

    get_list_friends(user_id){
        return this.find({
            $and: [
                {$or: [
                    {"sender_id": user_id},
                    {"receiver_id": user_id}
                ]},
                {"status": true}
            ]
        }).sort({"created_at": -1}).limit(20).exec()
    },

    check_has_contact(sender_id,receiver_id){
        return this.findOne({
            $or: [
                {"sender_id": sender_id, "receiver_id": receiver_id, "status": true},
                {"sender_id": receiver_id, "receiver_id": sender_id, "status": true}
            ]
        }).exec()
    }
}

module.exports = mongoose.model('contacts',contacts_schema)