import mongoose, { Schema } from "mongoose";

const ngoSchema = new Schema({
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
        // strores [longitude, latitude]
        coordinates : [Number]
    }
})

// Create 2dsphere index for geospatial queries
ngoSchema.index({ location: "2dsphere" });

export const NGO = mongoose.model("NGO",ngoSchema);