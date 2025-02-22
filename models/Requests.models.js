import mongoose from "mongoose";
// request matlab donation


const requestSchema = new mongoose.Schema({
    
    // all fields are related to donor only
    // gives all this information when clicks on donate button

    // reference to donor
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donors',  // Reference to the Donor model
        
    },
    // reference to ngo 
    ngoId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NGO",
        // required: true
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
    images :{
        type : [String],
    }
})
requestSchema.index({location : "2dsphere"});

const Requests = mongoose.model("Requests", requestSchema);
export default Requests;