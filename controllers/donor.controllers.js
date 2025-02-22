import asyncHandler from "../utils/asyncHandler.js";
import  Requests  from "../models/Requests.models.js";
import { NGO } from "../models/Ngo.models.js";

const getDonorPastDonations = asyncHandler(async (req, res) => {
    const _id = req.user._id;
    // console.log(_id)
    const requests_array = await Requests.find({ donorId: _id });
    const ngoDetailsList = [];
    for(const request of requests_array){
        const ngoId = request.ngoId;
        if(!ngoId) throw new Error("Can't find ngoId in getDonorPastDonations")
        // console.log(ngoId)
        const ngo = await NGO.findOne(ngoId)
        ngoDetailsList.push(ngo);
    }
    const response = {requests_array,ngoDetailsList}
    // console.log(response)
    return res.status(200).json(response);
});

const getRequestData = asyncHandler(async (req,res) => {
    const request_id = req.body.req_id;
    const server_response = await Requests.findOne({request_id});
    return res.status(200).json(server_response);
})

const getNGOs = asyncHandler(async (req, res) => {
    const server_response = await NGO.find();
    return res.status(200).json(server_response)
});

export { getDonorPastDonations, getNGOs, getRequestData };

// console.log(req.user._id)
// const server_response = await Requests.create({
//     "donorId" : new mongoose.Types.ObjectId('67b79a97a8e13c98db4c32ef'),
//     "ngoId" : new mongoose.Types.ObjectId('67b625311ac5fa52298c39b8'),
//     "donationdetails" : "Cookies Donated",
//     "expirydate" : new Date(),
//     "status" : "accepted"
// })
// console.log(server_response)
// const id = new mongoose.Types.ObjectId('67b79a97a8e13c98db4c32ef')
// console.log(_id)
// console.log(server_response)
