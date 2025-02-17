import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export default Donor = mongoose.model("Donor", donorSchema);
