import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const ngoSchema = new Schema({
    name : {
        type : String,
        // required : true
    },

    email : {
        type : String,
        unique : true,
        // required : true
    },

    password : {
        type : String,
        // required : true
    },

    location : {
        // for geospatial index
        type : {
            type : String,
        },
        // strores [longitude, latitude]
        coordinates : [Number]
    },

    contact : {
        type : Number,
        // required : true
    }
})

ngoSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

ngoSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

ngoSchema.methods.generateAccessToken = async function (userRole) {
    const payload = {
        _id: this._id,
        role: userRole,
        name: this.name,
        email: this.email,
    };
    return jwt.sign(
        payload, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Create 2dsphere index for geospatial queries
ngoSchema.index({ location: "2dsphere" });

export const NGO = mongoose.model("NGO",ngoSchema);