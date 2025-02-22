import asyncHandler from "../utils/asyncHandler.js";
import  Requests  from "../models/Requests.models.js";
import { NGO } from "../models/Ngo.models.js";

const getUserDonations = asyncHandler(async (req, res) => {
    const user = req.user;
    const _id = req.user._id;
    const response = await Requests.find({ donorId: _id });
    return res.status(200).json(response);
});

const getNGOs = asyncHandler(async (req, res) => {
    const response = await NGO.find();
    return res.status(200).json(response)
});
 
export { getUserDonations, getNGOs };

// console.log(req.user._id)
// const response = await Requests.create({
//     "donorId" : new mongoose.Types.ObjectId('67b79a97a8e13c98db4c32ef'),
//     "ngoId" : new mongoose.Types.ObjectId('67b625311ac5fa52298c39b8'),
//     "donationdetails" : "Cookies Donated",
//     "expirydate" : new Date(),
//     "status" : "accepted"
// })
// console.log(response)
// const id = new mongoose.Types.ObjectId('67b79a97a8e13c98db4c32ef')
// console.log(_id)
// console.log(response)
