import mongoose from "mongoose";


const requestSchema = new mongoose.Schema({
    
    // all fields are related to donor only
    // gives all this information when clicks on donate button

    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',  // Reference to the Donor model
        required: true
    },

    name : {
        type : String
    },

    donationdetails : {
        type : String
    },

    expirydate : {
        type : Date
    },
    
    location : {
        type : {
            type : String,
            enum : ["Point"],
        },

        coordinates : [Number]
    },

    status : {
        type: String,
        enum: ['pending', 'accepted', 'expired'],  // Status of the donation request
        default: 'pending'
    },  

    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO', // Reference to the NGO model
        default: null
    }

    
})

requestSchema.index({location : "2dsphere"});

export const Requests = mongoose.model("Requests", requestSchema);