import mongoose from  "mongoose";

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password : {
        type: String,
        required: true,
        min: 8,
    },
    userImage : {
       type: String,
    }, 
    type: {
        type: String,
        enum: ["author", "consumer", "admin"]
    }
    // isAuthor: {
    //     type: Boolean,
    //     default: false
    // },
    // isAdmin: {
    //     type: Boolean,
    //     default: false,
    // },
},{
    // timestamps: true,
    discriminatorKey: 'userType'
})

const AuthorSchema = new mongoose.Schema({
    blogs_authored: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Consumer'
        }
    ]
})

const ConsumerSchema = new mongoose.Schema({
  following:  [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
    ],
    preferences: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    feeds:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
})

const AdminSchema = new mongoose.Schema({
    ads_published: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ads'
    }],
})

//all models have the fields of the user model
//all discriminator models have their own private fields too

const User = mongoose.model("User", UserSchema)

//rendering it based on User schema
//meaning the other fields in the USER SCHEMA will be added to the SCHEMAs below
const Author = User.discriminator('Author', AuthorSchema)
const Consumer = User.discriminator('Consumer', ConsumerSchema)
const Admin = User.discriminator('Admin', AdminSchema)


export {User, Author, Consumer, Admin} 