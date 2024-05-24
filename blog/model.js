import mongoose from "mongoose"

const Schema = mongoose.Schema

const BlogSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        required: true
    }
},{
    timestamps: true
})



const Blog = mongoose.model('Blog', BlogSchema)

export default Blog