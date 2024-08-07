const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    // image: {
    //     type: String,
    //     default: "https://images.unsplash.com/photo-1682685797507-d44d838b0ac7?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set: v => v === "" ? "https://images.unsplash.com/photo-1682685797507-d44d838b0ac7?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    // },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // coordinates:{
    //     type:[Number],
    //     required:true
    // }
    geometry: {
        type: {
            type: String,// Don't do `{ location: { type: String } }`
            enum: ["Point"],// 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    contactPhoneNo: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    }

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;