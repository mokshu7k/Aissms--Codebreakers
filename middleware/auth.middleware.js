import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { Donors } from "../models/Donor.models.js";
import { NGO } from "../models/Ngo.models.js";
const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // get token from cookies and validate
        const token = req.cookies.accessToken || req.body.accessToken;
        if (!token) throw new Error("Invalid user: Token not found");

        // decode the token and get the user document and validate it
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) throw new Error("Invalid token");
        const userEmail = decodedToken.email;
        const user =
            decodedToken.role === "Donors"
                ? await Donors.findOne({ userEmail })
                : await NGO.findOne({ userEmail });
        if (!user) throw new Error("User doesn't exist");
        
        // set the user document in req parameter
        req.user = user;
        
        // transfer control to the next middleware
        next();
    } catch (error) {
        throw new Error("Error in verifying JWT");
    }
});

export { verifyJWT };
