import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',  // Reference to the Donor model
    // required: true
  },

  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',  // Reference to the Food model
    // required: true
  },

  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',  // Reference to the NGO model
    // required: true
  },

  message: {
    type: String,
    // required: true
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],  // Status of the donation request
    default: 'pending'
  },
  
  distance: { 
    type: Number, required: true 
  },

  createdAt: {
    type: Date,
    default: Date.now  // Timestamp of when the notification was created
  }
});


export const Notification = mongoose.model("Notification", notificationSchema);
