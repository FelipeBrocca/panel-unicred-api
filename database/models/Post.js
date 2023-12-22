import mongoose from "mongoose";

const menusSchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String
    },
    body: {
        type: String,
        default: ""
    },
    image: {
        type: Array,
        default: null
    },
    category: {
        type: String,
        required: true
    },
    ping: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        required: true
    }
})

const Post = mongoose.model('Post', menusSchema);

export default Post;