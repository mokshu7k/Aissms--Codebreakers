import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export default NGO = mongoose.model("NGO", ngoSchema);
