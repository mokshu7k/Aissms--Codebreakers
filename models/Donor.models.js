import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// MongoDB automatically provides a unique _id for every document

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    location: {
        // for geospatial index
        type: {
            type: String,
            enum : ["Point"], //must
        },
        // stores [longitude, latitude]
        coordinates: [Number],
    },
});

donorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


donorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

donorSchema.methods.generateAccessToken = async function (userRole) {
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
donorSchema.index({ location: "2dsphere" });

export const Donors = mongoose.model("Donors", donorSchema);
