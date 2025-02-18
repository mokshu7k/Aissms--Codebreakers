import asyncHandler from "../utils/asyncHandler.js";
const getAllDonors = asyncHandler(async (req, res) => {
    res.status(200).send("You didn't get shit yet");
});

export { getAllDonors };
