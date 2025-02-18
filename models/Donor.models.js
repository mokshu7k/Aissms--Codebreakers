import mongoose from "mongoose";
import bcrypt from "bcrypt";
// MongoDB automatically provides a unique _id for every document

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
        },
        // stores [longitude, latitude]
        coordinates: [Number],
    },
});

donorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.passowrd = await bcrypt.hash(this.password, salt);
    next();
});

// Create 2dsphere index for geospatial queries
donorSchema.index({ location: "2dsphere" });

export const Donors = mongoose.model("Donors", donorSchema);
