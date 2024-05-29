import mongoose from  "mongoose";

const AdsSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    publisher: {
        type: mongoose.Schema.Types.Objectid,
        ref: 'Admin',
        required: true
    },

    redirectionLink: {
        type: String ,
        required: false
    },
})

const Ads = mongoose.model('Ads', AdsSchema)

export default Ads