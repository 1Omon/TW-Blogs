import mongoose from  "mongoose";

const AdsSchema = new mongoose.Schema({
    image: String,
    content: {
        type: String,
        required: true
    },
    publisher: {
        type: mongoose.Schema.Types.Objectid.AdsSchema,
        ref: 'Admin'
    },
    redirectionLink: String
})

const Ads = mongoose.model('Ads', AdsSchema)

export default Ads