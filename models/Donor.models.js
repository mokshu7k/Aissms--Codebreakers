import mongoose from "mongoose";

// MongoDB automatically provides a unique _id for every document


const donorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        unique : true,
        required : true
    },

    password : {
        type : String,
        required : true
    },
    
    location : {
        // for geospatial index
        type : {
            type : String,
        },
        // stores [longitude, latitude]
        coordinates : [Number]
    }

})

// Create 2dsphere index for geospatial queries
donorSchema.index({ location: "2dsphere" });

export const Donors = mongoose.model("Donors", donorSchema);
