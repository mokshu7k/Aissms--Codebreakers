import mongoose from "mongoose";
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    roomId:{
        type: String,
        required: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        refPath : "senderModel",
        required: true,
    },
    senderModel: {
        type:String,
        required: true,
        enum: ['Ngo','Donor'],
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        refPath : "receiverModel",
        required:true,
    },
    receiverModel: {
        type:String,
        required: true,
        enum: ['NGO','Donor'],
    },

    text: {
        type: String,
        trim: true,
    },
    image: {
        type: [String],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
},{timestamps: true}
)


const Message = mongoose.model("Messages", messageSchema);

export default Message;