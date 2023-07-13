const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user_email: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        required: true
    }
}) 

module.exports = mongoose.model("Comment", CommentSchema)