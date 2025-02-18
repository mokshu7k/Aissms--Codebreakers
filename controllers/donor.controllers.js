import asyncHandler from "../utils/asyncHandler.js"
const getAllDonations = asyncHandler(async (req,res)=>{
    res.status(200).send("You didn't donate shit yet")
})

export {getAllDonations}