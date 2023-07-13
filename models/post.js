const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    is_public: {
        type: Boolean,
        default: true
    }
})

PostSchema.virtual("url").get(function() {
    return `/${this._id}`
})

module.exports = mongoose.model("Post", PostSchema)