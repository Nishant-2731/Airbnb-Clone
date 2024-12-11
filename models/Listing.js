const mongoose = require("mongoose");

const {Schema} = mongoose;
const Review = require("./Review.js")

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            // This ternary operator works like if-else. In the first part before ? there is a condition and after that results for both true and false are given separated by : respectively
            // default: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637",
            // set: (v)=> v === "" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637" : v
        }        
    },
    price: {
        type: Number,
        min: 0
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

// This post mongoose middleware deletes Reviews from review collections which belonged to the deleted listing
listingSchema.post("findOneAndDelete", async (listing)=>
{
    if(listing)
    {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing;