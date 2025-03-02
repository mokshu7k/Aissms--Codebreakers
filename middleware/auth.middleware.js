import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { Donors } from "../models/Donor.models.js";
import { NGO } from "../models/Ngo.models.js";
const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies.access_token ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new Error("Invalid user: Token not found");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) throw new Error("Invalid token");
        // console.log(decodedToken);
        const role = decodedToken.role;
        if (role === "Donors") {
            const _id = decodedToken._id;
            const user = await Donors.findOne({ _id });
            req.user = user
        } else {
            const _id = decodedToken._id;
            const user = await NGO.findOne({ _id });
            req.user = user
        }
        next();
    } catch (error) {
        next(error);
    }
});

export { verifyJWT };
